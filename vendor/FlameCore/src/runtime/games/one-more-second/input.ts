import type { SimEvents, SimReadout } from './types';

export interface GameInputState {
  steer: number;
  rewind: boolean;
  restart: boolean;
}

function isHudControl(target: EventTarget | null): boolean {
  if (!(target instanceof Element)) {
    return false;
  }
  return Boolean(target.closest('button, a, input, textarea, .oms-help, .oms-fail, .oms-signin-gate'));
}

/**
 * Keyboard + touch steering. Arrow keys / A D, Space rewind, Enter / R restart.
 * Touch: hold the left or right half of the play surface. HUD controls are ignored.
 * A/Left move the sphere left on screen (world +X while the camera looks down +Z).
 */
export class OneMoreSecondInput {
  private _left = false;
  private _right = false;
  private _rewindQueued = false;
  private _restartQueued = false;
  private readonly _pointers = new Map<number, number>();
  private readonly _root: HTMLElement | undefined;
  private _disposed = false;
  private _active = false;

  constructor(root?: HTMLElement) {
    this._root = root;
    window.addEventListener('keydown', this._onKeyDown, { capture: true });
    window.addEventListener('keyup', this._onKeyUp, { capture: true });
    if (root) {
      root.addEventListener('pointerdown', this._onPointerDown);
      root.addEventListener('pointermove', this._onPointerMove);
      root.addEventListener('pointerup', this._onPointerUp);
      root.addEventListener('pointercancel', this._onPointerUp);
    }
  }

  /** Consume edge-triggered buttons and current analog steer. */
  sample(phase: SimReadout['phase']): GameInputState {
    const rewind = this._rewindQueued;
    this._rewindQueued = false;
    const restart = this._restartQueued;
    this._restartQueued = false;
    let steer = this._touchSteer();
    if (this._left) steer -= 1;
    if (this._right) steer += 1;
    if (steer > 1) steer = 1;
    if (steer < -1) steer = -1;
    // Camera looks down +Z (yaw π). Screen-left is world +X, so invert.
    steer = -steer;
    const allowSteer = phase === 'playing' || phase === 'attract';
    return { steer: allowSteer ? steer : 0, rewind, restart };
  }

  /** When false, keys and touches are ignored so the editor can keep Space = Play. */
  setActive(active: boolean): void {
    this._active = active;
    if (!active) {
      this._left = false;
      this._right = false;
      this._pointers.clear();
    }
  }

  queueRewind(): void {
    this._rewindQueued = true;
  }

  queueRestart(): void {
    this._restartQueued = true;
  }

  dispose(): void {
    if (this._disposed) return;
    this._disposed = true;
    window.removeEventListener('keydown', this._onKeyDown, { capture: true });
    window.removeEventListener('keyup', this._onKeyUp, { capture: true });
    this._root?.removeEventListener('pointerdown', this._onPointerDown);
    this._root?.removeEventListener('pointermove', this._onPointerMove);
    this._root?.removeEventListener('pointerup', this._onPointerUp);
    this._root?.removeEventListener('pointercancel', this._onPointerUp);
  }

  private _touchSteer(): number {
    let steer = 0;
    for (const value of this._pointers.values()) {
      steer += value;
    }
    if (steer > 1) return 1;
    if (steer < -1) return -1;
    return steer;
  }

  private _sideFromEvent(e: PointerEvent): number {
    const rect = this._root?.getBoundingClientRect();
    if (!rect) return 0;
    const x = (e.clientX - rect.left) / Math.max(1, rect.width);
    return x < 0.5 ? -1 : 1;
  }

  private readonly _onKeyDown = (e: KeyboardEvent): void => {
    if (!this._active) return;
    if (e.repeat) {
      this._applyKey(e, true);
      return;
    }
    if (e.code === 'Space') {
      e.preventDefault();
      this._rewindQueued = true;
      return;
    }
    if (e.code === 'Enter' || e.code === 'KeyR') {
      this._restartQueued = true;
    }
    this._applyKey(e, true);
  };

  private readonly _onKeyUp = (e: KeyboardEvent): void => {
    if (!this._active) return;
    this._applyKey(e, false);
  };

  private _applyKey(e: KeyboardEvent, down: boolean): void {
    if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
      e.preventDefault();
      this._left = down;
    }
    if (e.code === 'ArrowRight' || e.code === 'KeyD') {
      e.preventDefault();
      this._right = down;
    }
  }

  private readonly _onPointerDown = (e: PointerEvent): void => {
    if (!this._active || isHudControl(e.target)) return;
    this._pointers.set(e.pointerId, this._sideFromEvent(e));
    try {
      this._root?.setPointerCapture(e.pointerId);
    } catch {
      /* jsdom / unsupported */
    }
  };

  private readonly _onPointerMove = (e: PointerEvent): void => {
    if (!this._active || !this._pointers.has(e.pointerId)) return;
    this._pointers.set(e.pointerId, this._sideFromEvent(e));
  };

  private readonly _onPointerUp = (e: PointerEvent): void => {
    this._pointers.delete(e.pointerId);
    try {
      if (this._root?.hasPointerCapture(e.pointerId)) {
        this._root.releasePointerCapture(e.pointerId);
      }
    } catch {
      /* jsdom / unsupported */
    }
  };
}

export type { SimEvents };
