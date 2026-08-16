/**
 * Click-to-toggle driver for {@link ArticulationComponent} progress.
 * @module @runtime/components/articulation-driver
 */

import type { ArticulationDriverProps } from '@shared/types/articulation';
import { BaseComponent } from '../scene/component';
import { ArticulationComponent } from './articulation.component';
import { InputListenerComponent, type InputListenerCallback } from './input-listener.component';

/** Factory for default articulation driver props. */
export function makeArticulationDriverProps(
  patch: Partial<Omit<ArticulationDriverProps, '_version'>> = {},
): ArticulationDriverProps {
  return {
    _version: 1,
    closedProgress: patch.closedProgress ?? 0,
    openProgress: patch.openProgress ?? 1,
    transitionDuration: patch.transitionDuration ?? 0.6,
    startOpen: patch.startOpen ?? false,
    toggleOnClick: patch.toggleOnClick ?? true,
    allowInterrupt: patch.allowInterrupt ?? true,
  };
}

/**
 * ArticulationDriverComponent eases {@link ArticulationComponent.progress}
 * between closed and open values. When `toggleOnClick` is true it wires the
 * actor's {@link InputListenerComponent.onClick} handler.
 */
export class ArticulationDriverComponent extends BaseComponent<ArticulationDriverProps> {
  static readonly typeName = 'ArticulationDriverComponent';

  private _targetProgress = 0;
  private _currentProgress = 0;
  private _clickHandler: (() => void) | undefined;
  private _previousOnClick: InputListenerCallback | undefined;

  onAttach(actor: Parameters<BaseComponent<ArticulationDriverProps>['onAttach']>[0]): void {
    super.onAttach(actor);
    const start = this._props.startOpen ? this._props.openProgress : this._props.closedProgress;
    this._targetProgress = start;
    this._currentProgress = start;
    this._syncArticulation(start);
  }

  onSceneAttach(scene: Parameters<BaseComponent<ArticulationDriverProps>['onSceneAttach']>[0]): void {
    super.onSceneAttach(scene);
    this._wireClick();
  }

  onSceneDetach(scene: Parameters<BaseComponent<ArticulationDriverProps>['onSceneDetach']>[0]): void {
    this._unwireClick();
    super.onSceneDetach(scene);
  }

  protected onPropsChanged(): void {
    if (this._props.startOpen) {
      this._targetProgress = this._props.openProgress;
    }
    this._wireClick();
  }

  onUpdate(dt: number): void {
    if (Math.abs(this._currentProgress - this._targetProgress) < 1e-5) return;
    const duration = Math.max(0.001, this._props.transitionDuration);
    const step = dt / duration;
    const dir = this._targetProgress > this._currentProgress ? 1 : -1;
    this._currentProgress += dir * step;
    if (dir > 0) this._currentProgress = Math.min(this._targetProgress, this._currentProgress);
    else this._currentProgress = Math.max(this._targetProgress, this._currentProgress);
    this._syncArticulation(this._currentProgress);
  }

  /** Toggle between closed and open targets. */
  toggle(): void {
    const open = this._props.openProgress;
    const closed = this._props.closedProgress;
    const midpoint = (open + closed) * 0.5;
    const goingOpen = this._targetProgress < midpoint;
    this._targetProgress = goingOpen ? open : closed;
    if (this._props.allowInterrupt) return;
    this._currentProgress = this._targetProgress;
    this._syncArticulation(this._currentProgress);
  }

  /** Drive to fully open. */
  open(): void {
    this._targetProgress = this._props.openProgress;
  }

  /** Drive to fully closed. */
  close(): void {
    this._targetProgress = this._props.closedProgress;
  }

  private _syncArticulation(progress: number): void {
    const articulation = this.actor?.getComponent(ArticulationComponent);
    if (!articulation) return;
    articulation.setProps({ ...articulation.props, progress });
  }

  private _wireClick(): void {
    this._unwireClick();
    if (!this._props.toggleOnClick || !this.actor) return;
    const input = this.actor.getComponent(InputListenerComponent);
    if (!input) return;

    this._clickHandler = () => this.toggle();
    this._previousOnClick = input.onClick;
    const prev = this._previousOnClick;
    input.onClick = (event) => {
      prev?.(event);
      this._clickHandler?.();
    };
  }

  private _unwireClick(): void {
    if (!this.actor) return;
    const input = this.actor.getComponent(InputListenerComponent);
    if (input && this._clickHandler) {
      input.onClick = this._previousOnClick;
    }
    this._clickHandler = undefined;
    this._previousOnClick = undefined;
  }
}
