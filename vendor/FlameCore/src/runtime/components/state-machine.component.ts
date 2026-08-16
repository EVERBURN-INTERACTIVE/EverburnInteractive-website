/**
 * State machine component for managing actor states and transitions.
 * @module @runtime/components/state-machine
 */

import type {
  StateMachine,
  StateMachineState,
  StateTransition,
  TransitionTrigger,
} from '@shared/types/animation';
import type { Component, ComponentEvent } from '../scene/component';
import { BaseComponent } from '../scene/component';
import { AnimationPlayerComponent } from './animation-player.component';
import { createId } from '../utils/id';
import { getScrollTriggerSystem } from '../systems/scroll-trigger.system';

/** Factory for creating a default state machine. */
export function makeStateMachineProps(
  patch: Partial<Omit<StateMachine, '_version'>> = {},
): StateMachine {
  const defaultState: StateMachineState = {
    id: createId(),
    name: 'Default',
  };

  return {
    _version: 1,
    states: patch.states ?? [defaultState],
    transitions: patch.transitions ?? [],
    initialStateId: patch.initialStateId ?? defaultState.id,
  };
}

/**
 * StateMachineComponent manages states and transitions for an actor.
 *
 * Each state can:
 * - Play an animation clip
 * - Override component properties
 *
 * Transitions can be triggered by:
 * - Events (onClick, onHover, etc.)
 * - Scroll position
 * - Timers
 */
export class StateMachineComponent extends BaseComponent<StateMachine> {
  static readonly typeName = 'StateMachineComponent';

  private _currentStateId: string;
  private _transitionTimer = 0;
  private _isTransitioning = false;
  private _transitionTargetStateId: string | undefined;
  private _transitionDuration = 0;
  private _transitionProgress = 0;
  /** Seconds spent in the current state (for timer triggers). */
  private _stateElapsedSec = 0;

  /** Get the current state. */
  get currentState(): StateMachineState | undefined {
    return this._props.states.find((s) => s.id === this._currentStateId);
  }

  /** Get the current state ID. */
  get currentStateId(): string {
    return this._currentStateId;
  }

  /** Check if currently transitioning between states. */
  get isTransitioning(): boolean {
    return this._isTransitioning;
  }

  /** Get transition progress [0, 1]. */
  get transitionProgress(): number {
    return this._transitionProgress;
  }

  constructor(props: StateMachine) {
    super(props);
    this._currentStateId = props.initialStateId;
  }

  onAttach(actor: Parameters<BaseComponent<StateMachine>['onAttach']>[0]): void {
    super.onAttach(actor);
    this._enterState(this._currentStateId);
  }

  onUpdate(dt: number): void {
    if (!this._isTransitioning) {
      this._stateElapsedSec += dt;
    }

    if (this._isTransitioning && this._transitionDuration > 0) {
      this._transitionTimer += dt;
      this._transitionProgress = Math.min(1, this._transitionTimer / this._transitionDuration);

      if (this._transitionProgress >= 1) {
        this._completeTransition();
      }
    }

    if (this._isTransitioning) return;
    for (const transition of this._props.transitions) {
      if (transition.fromStateId === this._currentStateId) {
        if (this._checkTrigger(transition.trigger, dt)) {
          this.transitionTo(transition.toStateId, transition.duration);
          break;
        }
      }
    }
  }

  onEvent(event: ComponentEvent): void {
    for (const transition of this._props.transitions) {
      if (transition.fromStateId === this._currentStateId) {
        if (transition.trigger.type === 'event' && transition.trigger.eventName === event.name) {
          this.transitionTo(transition.toStateId, transition.duration);
          break;
        }
      }
    }
  }

  /** Manually trigger a transition to a target state. */
  transitionTo(targetStateId: string, duration = 0): void {
    if (this._isTransitioning) return;
    if (targetStateId === this._currentStateId) return;

    const targetState = this._props.states.find((s) => s.id === targetStateId);
    if (!targetState) {
      console.warn(`[StateMachineComponent] Unknown state: ${targetStateId}`);
      return;
    }

    this._isTransitioning = true;
    this._transitionTargetStateId = targetStateId;
    this._transitionDuration = duration;
    this._transitionTimer = 0;
    this._transitionProgress = 0;

    if (duration === 0) {
      this._completeTransition();
    }
  }

  private _completeTransition(): void {
    if (!this._transitionTargetStateId) return;

    this._currentStateId = this._transitionTargetStateId;
    this._isTransitioning = false;
    this._transitionTargetStateId = undefined;
    this._transitionTimer = 0;
    this._transitionProgress = 0;

    this._enterState(this._currentStateId);
  }

  private _enterState(stateId: string): void {
    const state = this._props.states.find((s) => s.id === stateId);
    if (!state) return;

    this._stateElapsedSec = 0;

    if (state.clipId && this.actor) {
      const player = this.actor.getComponent(AnimationPlayerComponent);
      if (player) {
        player.setClip(state.clipId);
        player.play();
      }
    }

    if (state.propertyOverrides && this.actor) {
      for (const override of state.propertyOverrides) {
        const component = this.actor.components.find((c) => c.type === override.componentType);
        if (component) {
          writeComponentProperty(component, override.property, override.value);
        }
      }
    }
  }

  private _checkTrigger(trigger: TransitionTrigger, _dt: number): boolean {
    switch (trigger.type) {
      case 'timer': {
        const dur = trigger.timerDuration ?? 0;
        return this._stateElapsedSec >= dur;
      }

      case 'scroll': {
        const range = trigger.scrollRange;
        if (!range || range.length < 2) return false;
        const [a, b] = range;
        const runtime = this.actor?.scene?.runtime;
        const scrollSys = runtime ? getScrollTriggerSystem(runtime) : undefined;
        const scrollY =
          scrollSys?.scrollY ?? (typeof window !== 'undefined' ? window.scrollY : 0);
        const lo = Math.min(a, b);
        const hi = Math.max(a, b);
        return scrollY >= lo && scrollY <= hi;
      }

      case 'event':
        return false;

      case 'immediate':
        return true;

      default:
        return false;
    }
  }

  addState(state: StateMachineState): void {
    this.setProps({
      ...this._props,
      states: [...this._props.states, state],
    });
  }

  removeState(stateId: string): void {
    this.setProps({
      ...this._props,
      states: this._props.states.filter((s) => s.id !== stateId),
      transitions: this._props.transitions.filter(
        (t) => t.fromStateId !== stateId && t.toStateId !== stateId,
      ),
    });
  }

  addTransition(transition: StateTransition): void {
    this.setProps({
      ...this._props,
      transitions: [...this._props.transitions, transition],
    });
  }

  removeTransition(fromStateId: string, toStateId: string): void {
    this.setProps({
      ...this._props,
      transitions: this._props.transitions.filter(
        (t) => !(t.fromStateId === fromStateId && t.toStateId === toStateId),
      ),
    });
  }
}

function writeComponentProperty(component: Component, propertyPath: string, value: unknown): void {
  const parts = propertyPath.split('.').filter(Boolean);
  const finalKey = parts[parts.length - 1];
  if (!finalKey) return;

  let current: Record<string, unknown> = component.props as unknown as Record<string, unknown>;
  for (let i = 0; i < parts.length - 1; i += 1) {
    const next = current[parts[i]];
    if (!isRecord(next)) return;
    current = next;
  }
  current[finalKey] = value;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}
