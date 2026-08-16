/**
 * Parallax layer component — the simple, zero-timeline path to scroll-driven
 * motion in FlameCore.
 *
 * @module @runtime/components/parallax-layer
 */

import type { Vec3 } from '@shared/types';
import type { ParallaxAxis, ParallaxLayerProps } from '@shared/types/parallax';
import { BaseComponent } from '../scene/component';
import type { Actor } from '../scene/actor';
import { TransformComponent } from './transform.component';

/** Factory for default parallax layer props. */
export function makeParallaxLayerProps(
  patch: Partial<Omit<ParallaxLayerProps, '_version'>> = {},
): ParallaxLayerProps {
  return {
    _version: 1,
    scrollStart: patch.scrollStart ?? 0,
    scrollEnd: patch.scrollEnd ?? 1000,
    depth: patch.depth ?? 1,
    startOffset: patch.startOffset ?? ([0, 0, 0] as Vec3),
    endOffset: patch.endOffset ?? ([0, -2, 0] as Vec3),
    clamp: patch.clamp ?? true,
    axis: patch.axis ?? 'all',
  };
}

/**
 * Reads `window.scrollY` every frame and adds a Vec3 offset on top of the
 * actor's `TransformComponent` position. The component never mutates the
 * `TransformComponent`'s props, so gizmo edits in the editor remain the
 * authoritative "home" position for the layer — the parallax offset is
 * purely additive at render time.
 *
 * If the actor has no `TransformComponent`, the layer falls back to the
 * actor's `Object3D.position` snapshot captured on attach. This keeps the
 * component usable in test harnesses that do not wire up a full transform.
 */
export class ParallaxLayerComponent extends BaseComponent<ParallaxLayerProps> {
  static readonly typeName = 'ParallaxLayerComponent';

  /** Fallback base position used when the actor has no TransformComponent. */
  private readonly _fallbackBase: [number, number, number] = [0, 0, 0];
  private _hasFallbackBase = false;

  onAttach(actor: Actor): void {
    super.onAttach(actor);
    // Snapshot the actor's current world position so we have a sensible
    // home value even when no TransformComponent is present.
    const o = actor.object3D.position;
    this._fallbackBase[0] = o.x;
    this._fallbackBase[1] = o.y;
    this._fallbackBase[2] = o.z;
    this._hasFallbackBase = true;
    this._applyOffset();
  }

  protected onPropsChanged(): void {
    this._applyOffset();
  }

  /**
   * Current scroll progress in `[0..1]` (or beyond when `clamp === false`).
   * Exposed so editor previews / inspector UIs can display the live value.
   */
  get progress(): number {
    const { scrollStart, scrollEnd, clamp } = this._props;
    const scrollY = readScrollY();
    const range = scrollEnd - scrollStart;
    let p = range > 0 ? (scrollY - scrollStart) / range : 0;
    if (clamp) p = Math.max(0, Math.min(1, p));
    return p;
  }

  onUpdate(_dt: number): void {
    this._applyOffset();
  }

  private _applyOffset(): void {
    if (!this._actor) return;
    const base = this._readBasePosition();
    const offset = this._currentOffset();
    const pos = this._actor.object3D.position;
    pos.set(base[0] + offset[0], base[1] + offset[1], base[2] + offset[2]);
  }

  /** Read the authoritative "home" position for this actor. */
  private _readBasePosition(): readonly [number, number, number] {
    if (!this._actor) return this._fallbackBase;
    const t = this._actor.getComponent(TransformComponent);
    if (t) {
      const p = t.props.position;
      return [p[0], p[1], p[2]];
    }
    return this._hasFallbackBase ? this._fallbackBase : [0, 0, 0];
  }

  /** Compute the current Vec3 offset based on scroll, depth, and axis lock. */
  private _currentOffset(): [number, number, number] {
    const { startOffset, endOffset, depth, axis } = this._props;
    const p = this.progress;
    const dx = (startOffset[0] + (endOffset[0] - startOffset[0]) * p) * depth;
    const dy = (startOffset[1] + (endOffset[1] - startOffset[1]) * p) * depth;
    const dz = (startOffset[2] + (endOffset[2] - startOffset[2]) * p) * depth;
    return maskAxis(axis, dx, dy, dz);
  }
}

function readScrollY(): number {
  if (typeof window === 'undefined') return 0;
  return window.scrollY ?? 0;
}

function maskAxis(
  axis: ParallaxAxis,
  dx: number,
  dy: number,
  dz: number,
): [number, number, number] {
  switch (axis) {
    case 'x':
      return [dx, 0, 0];
    case 'y':
      return [0, dy, 0];
    case 'z':
      return [0, 0, dz];
    case 'all':
    default:
      return [dx, dy, dz];
  }
}
