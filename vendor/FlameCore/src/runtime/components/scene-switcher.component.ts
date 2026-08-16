/**
 * Configurable project-scene switcher driven by click, touch, wheel, scroll,
 * or UI button events.
 *
 * Attach to any actor (often with {@link InputListenerComponent} for 3D click,
 * or a UI/canvas button for HUD). Choose the target scene id and trigger in
 * the Inspector.
 *
 * @module @runtime/components/scene-switcher
 */

import type { SerializedComponentProps } from '@shared/types';
import { BaseComponent } from '../scene/component';
import type { ComponentEvent } from '../scene/component';
import {
  switchProjectScene,
  type SceneSwitchTransition,
} from '../project-scene-navigator';
import {
  InputListenerComponent,
  makeInputListenerProps,
  type InputListenerCallback,
} from './input-listener.component';
import { getScrollTriggerSystem } from '../systems/scroll-trigger.system';

/** How the switcher activates. */
export type SceneSwitcherTrigger = 'click' | 'wheel' | 'scroll' | 'uiButton' | 'manual';

/** Serialized scene-switcher properties. */
export interface SceneSwitcherProps extends SerializedComponentProps {
  readonly _version: 1;
  /** Target project scene id (must exist in the project scene table). */
  targetSceneId: string;
  /** Interaction that fires the switch. */
  trigger: SceneSwitcherTrigger;
  /** Transition style. */
  transition: SceneSwitchTransition;
  /** Fade duration in seconds (when transition is fade). */
  fadeDuration: number;
  /** Fire only once, then disable. */
  once: boolean;
  /** Master enable. */
  enabled: boolean;
  /**
   * For `scroll`: absolute window scrollY (px) that activates the switch.
   * For `wheel`: accumulated |deltaY| threshold.
   */
  scrollThreshold: number;
  /** For `scroll`: optional start of a range (px). When set with scrollEnd, uses range. */
  scrollStart: number;
  /** For `scroll`: optional end of a range (px). Crosses progress >= 1 to fire. */
  scrollEnd: number;
}

/** Factory for default scene-switcher props. */
export function makeSceneSwitcherProps(
  patch: Partial<Omit<SceneSwitcherProps, '_version'>> = {},
): SceneSwitcherProps {
  return {
    _version: 1,
    targetSceneId: patch.targetSceneId ?? '',
    trigger: patch.trigger ?? 'click',
    transition: patch.transition ?? 'fade',
    fadeDuration: patch.fadeDuration ?? 0.35,
    once: patch.once ?? true,
    enabled: patch.enabled ?? true,
    scrollThreshold: patch.scrollThreshold ?? 400,
    scrollStart: patch.scrollStart ?? 0,
    scrollEnd: patch.scrollEnd ?? 0,
  };
}

/**
 * Switches the top-level project scene when the chosen trigger fires.
 * Touch uses the same pointer path as click via {@link InputListenerComponent}.
 */
export class SceneSwitcherComponent extends BaseComponent<SceneSwitcherProps> {
  static readonly typeName = 'SceneSwitcherComponent';

  private _fired = false;
  private _busy = false;
  private _wheelAccum = 0;
  private _clickHandler: InputListenerCallback | undefined;
  private _previousOnClick: InputListenerCallback | undefined;
  private _wheelListener: ((e: WheelEvent) => void) | undefined;

  onSceneAttach(scene: Parameters<BaseComponent<SceneSwitcherProps>['onSceneAttach']>[0]): void {
    super.onSceneAttach(scene);
    this._wire();
  }

  onSceneDetach(scene: Parameters<BaseComponent<SceneSwitcherProps>['onSceneDetach']>[0]): void {
    this._unwire();
    super.onSceneDetach(scene);
  }

  protected onPropsChanged(): void {
    this._wire();
  }

  onUpdate(_dt: number): void {
    if (!this._props.enabled || this._busy) return;
    if (this._props.once && this._fired) return;
    if (this._props.trigger !== 'scroll') return;

    const runtime = this.actor?.scene?.runtime;
    if (!runtime) return;
    const scrollSys = getScrollTriggerSystem(runtime);
    const scrollY = scrollSys?.scrollY ?? (typeof window !== 'undefined' ? window.scrollY : 0);

    if (this._props.scrollEnd > this._props.scrollStart) {
      const span = this._props.scrollEnd - this._props.scrollStart;
      const p = span > 0 ? (scrollY - this._props.scrollStart) / span : 0;
      if (p >= 1) void this.activate();
      return;
    }

    if (scrollY >= this._props.scrollThreshold) {
      void this.activate();
    }
  }

  /** Component / UI event hook — listens for canvas/DOM `uiClick`. */
  onEvent(event: ComponentEvent): void {
    if (event.name !== 'uiClick') return;
    if (this._props.trigger !== 'uiButton') return;
    void this.activate();
  }

  /** Programmatic activate (also used when trigger is `manual`). */
  async activate(): Promise<void> {
    if (!this._props.enabled || this._busy) return;
    if (this._props.once && this._fired) return;
    const target = this._props.targetSceneId.trim();
    if (!target) {
      console.warn('[SceneSwitcher] targetSceneId is empty.');
      return;
    }
    const runtime = this.actor?.scene?.runtime;
    if (!runtime) {
      console.warn('[SceneSwitcher] no runtime bound.');
      return;
    }

    this._busy = true;
    try {
      await switchProjectScene(runtime, target, {
        transition: this._props.transition,
        fadeDuration: this._props.fadeDuration,
      });
      this._fired = true;
    } catch (err) {
      console.warn('[SceneSwitcher] switch failed:', err);
    } finally {
      this._busy = false;
    }
  }

  private _wire(): void {
    this._unwire();
    if (!this._props.enabled) return;

    if (this._props.trigger === 'click') {
      this._wireClick();
    } else if (this._props.trigger === 'wheel') {
      this._wireWheel();
    }
  }

  private _unwire(): void {
    this._unwireClick();
    this._unwireWheel();
  }

  private _wireClick(): void {
    const actor = this.actor;
    if (!actor) return;
    let listener = actor.getComponent(InputListenerComponent);
    if (!listener) {
      // Click / touch need an InputListener; create one so authors can
      // attach SceneSwitcher alone without a second Add Component step.
      listener = new InputListenerComponent(
        makeInputListenerProps({ click: true, hover: true, cursor: 'pointer' }),
      );
      actor.addComponent(listener);
    }
    this._previousOnClick = listener.onClick;
    this._clickHandler = (event) => {
      this._previousOnClick?.(event);
      void this.activate();
    };
    listener.onClick = this._clickHandler;
  }

  private _unwireClick(): void {
    const listener = this.actor?.getComponent(InputListenerComponent);
    if (listener && this._clickHandler && listener.onClick === this._clickHandler) {
      listener.onClick = this._previousOnClick;
    }
    this._clickHandler = undefined;
    this._previousOnClick = undefined;
  }

  private _wireWheel(): void {
    if (typeof window === 'undefined') return;
    this._wheelAccum = 0;
    this._wheelListener = (e: WheelEvent) => {
      if (!this._props.enabled || this._busy) return;
      if (this._props.once && this._fired) return;
      this._wheelAccum += Math.abs(e.deltaY);
      if (this._wheelAccum >= this._props.scrollThreshold) {
        this._wheelAccum = 0;
        void this.activate();
      }
    };
    window.addEventListener('wheel', this._wheelListener, { passive: true });
  }

  private _unwireWheel(): void {
    if (this._wheelListener && typeof window !== 'undefined') {
      window.removeEventListener('wheel', this._wheelListener);
    }
    this._wheelListener = undefined;
    this._wheelAccum = 0;
  }
}
