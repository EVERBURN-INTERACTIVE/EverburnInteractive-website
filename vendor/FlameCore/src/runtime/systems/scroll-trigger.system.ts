/**
 * Lightweight scroll progress driver for scroll-linked animations.
 * @module @runtime/systems/scroll-trigger
 */

import type { ScrollRangeProps } from '@shared/types/scroll';
import type { Runtime } from '../runtime';
import type { System } from './system';

/** Priority: before gameplay so components read fresh progress. */
export const SCROLL_TRIGGER_PRIORITY = 12;

/** Registered scroll trigger with a stable id. */
export interface ScrollTriggerRegistration extends ScrollRangeProps {
  readonly id: string;
}

/**
 * ScrollTriggerSystem computes normalized scroll progress for registered
 * triggers. Components and other systems query progress via
 * {@link getProgress} rather than reading `window.scrollY` directly.
 */
export class ScrollTriggerSystem implements System {
  readonly name = 'ScrollTriggerSystem';
  readonly priority = SCROLL_TRIGGER_PRIORITY;

  private readonly _triggers = new Map<string, ScrollTriggerRegistration>();

  onUpdate(_dt: number): void {
    // Progress is computed on demand; no per-frame state.
  }

  /** Register a scroll range trigger. */
  register(trigger: ScrollTriggerRegistration): void {
    this._triggers.set(trigger.id, trigger);
  }

  /** Remove a trigger by id. */
  unregister(id: string): void {
    this._triggers.delete(id);
  }

  /** Current scroll Y in pixels (0 when no window). */
  get scrollY(): number {
    if (typeof window === 'undefined') return 0;
    return window.scrollY ?? 0;
  }

  /** Normalized progress `[0..1]` for a registered trigger id. */
  getProgress(id: string): number {
    const t = this._triggers.get(id);
    if (!t) return 0;
    return computeScrollProgress(this.scrollY, t);
  }

  /** Utility: compute progress for an ad-hoc range without registration. */
  computeProgress(range: ScrollRangeProps): number {
    return computeScrollProgress(this.scrollY, range);
  }
}

/** Compute normalized scroll progress for a range. */
export function computeScrollProgress(
  scrollY: number,
  range: ScrollRangeProps,
): number {
  const span = range.scrollEnd - range.scrollStart;
  let p = span > 0 ? (scrollY - range.scrollStart) / span : 0;
  if (range.clamp) p = Math.max(0, Math.min(1, p));
  return p;
}

/** Resolve the ScrollTriggerSystem from a runtime instance. */
export function getScrollTriggerSystem(runtime: Runtime): ScrollTriggerSystem | undefined {
  return runtime.systems.find((s) => s.name === 'ScrollTriggerSystem') as
    | ScrollTriggerSystem
    | undefined;
}
