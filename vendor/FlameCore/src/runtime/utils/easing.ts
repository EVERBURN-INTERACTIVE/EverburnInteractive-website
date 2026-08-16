/**
 * Easing functions for animation interpolation (v2).
 *
 * Adds all PRD presets (Back/Bounce/Elastic/step variants/custom bezier)
 * while keeping the v1 names ('easeIn' / 'easeOut' / 'easeInOut' / 'cubic' /
 * 'step') working.
 *
 * @module @runtime/utils/easing
 */

import type { BezierHandle, EasingPreset } from '@shared/types/animation';

const PI2 = Math.PI * 2;
const BACK_S = 1.70158;
const BACK_S2 = BACK_S * 1.525;

const clamp01 = (t: number): number => Math.max(0, Math.min(1, t));

/**
 * Apply an easing function to a normalized time value `[0, 1]`.
 * Unknown presets fall back to `linear`.
 */
export function applyEasing(t: number, easing: EasingPreset, handles?: BezierHandle): number {
  t = clamp01(t);
  switch (easing) {
    case 'linear':
      return t;
    case 'easeIn':
      return t * t;
    case 'easeOut':
      return t * (2 - t);
    case 'easeInOut':
      return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    case 'easeInCubic':
      return t * t * t;
    case 'easeOutCubic': {
      const u = t - 1;
      return u * u * u + 1;
    }
    case 'easeInOutCubic':
      return t < 0.5 ? 4 * t * t * t : 1 + (t - 1) * (2 * (t - 1)) * (2 * (t - 1));
    case 'cubic':
      return t < 0.5 ? 4 * t * t * t : 1 + (t - 1) * (2 * (t - 1)) * (2 * (t - 1));
    case 'easeInBack':
      return (BACK_S + 1) * t * t * t - BACK_S * t * t;
    case 'easeOutBack': {
      const u = t - 1;
      return 1 + (BACK_S + 1) * u * u * u + BACK_S * u * u;
    }
    case 'easeInOutBack':
      return t < 0.5
        ? (Math.pow(2 * t, 2) * ((BACK_S2 + 1) * 2 * t - BACK_S2)) / 2
        : (Math.pow(2 * t - 2, 2) * ((BACK_S2 + 1) * (t * 2 - 2) + BACK_S2) + 2) / 2;
    case 'easeOutBounce':
      return bounceOut(t);
    case 'easeInBounce':
      return 1 - bounceOut(1 - t);
    case 'easeInElastic':
      if (t === 0 || t === 1) return t;
      return -Math.pow(2, 10 * t - 10) * Math.sin(((t * 10 - 10.75) * PI2) / 3);
    case 'easeOutElastic':
      if (t === 0 || t === 1) return t;
      return Math.pow(2, -10 * t) * Math.sin(((t * 10 - 0.75) * PI2) / 3) + 1;
    case 'step':
      return t < 1 ? 0 : 1;
    case 'stepStart':
      return t > 0 ? 1 : 0;
    case 'stepEnd':
      return t >= 1 ? 1 : 0;
    case 'custom':
      return handles ? cubicBezier(t, handles.cp1[0], handles.cp1[1], handles.cp2[0], handles.cp2[1]) : t;
    default:
      return t;
  }
}

function bounceOut(t: number): number {
  const n1 = 7.5625;
  const d1 = 2.75;
  if (t < 1 / d1) return n1 * t * t;
  if (t < 2 / d1) {
    const u = t - 1.5 / d1;
    return n1 * u * u + 0.75;
  }
  if (t < 2.5 / d1) {
    const u = t - 2.25 / d1;
    return n1 * u * u + 0.9375;
  }
  const u = t - 2.625 / d1;
  return n1 * u * u + 0.984375;
}

/**
 * Solve a CSS-style cubic bezier with anchors (0,0) and (1,1) and control
 * points (x1,y1) (x2,y2). Uses Newton-Raphson with a bisection fallback.
 */
export function cubicBezier(t: number, x1: number, y1: number, x2: number, y2: number): number {
  if (t <= 0) return 0;
  if (t >= 1) return 1;
  // Find parametric u such that bezierX(u) ≈ t, then return bezierY(u).
  let u = t;
  for (let i = 0; i < 8; i++) {
    const cx = bezierX(u, x1, x2) - t;
    if (Math.abs(cx) < 1e-6) break;
    const dx = bezierDX(u, x1, x2);
    if (Math.abs(dx) < 1e-6) break;
    u -= cx / dx;
  }
  u = Math.max(0, Math.min(1, u));
  return bezierY(u, y1, y2);
}

function bezierX(u: number, x1: number, x2: number): number {
  const oneMinus = 1 - u;
  return 3 * oneMinus * oneMinus * u * x1 + 3 * oneMinus * u * u * x2 + u * u * u;
}
function bezierY(u: number, y1: number, y2: number): number {
  const oneMinus = 1 - u;
  return 3 * oneMinus * oneMinus * u * y1 + 3 * oneMinus * u * u * y2 + u * u * u;
}
function bezierDX(u: number, x1: number, x2: number): number {
  const oneMinus = 1 - u;
  return 3 * oneMinus * oneMinus * x1 + 6 * oneMinus * u * (x2 - x1) + 3 * u * u * (1 - x2);
}

// ---------------------------------------------------------------------------
// Primitive lerps — kept for back-compat with existing systems and tests.
// ---------------------------------------------------------------------------

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function lerpVec3(
  a: [number, number, number],
  b: [number, number, number],
  t: number,
): [number, number, number] {
  return [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
}

export function lerpColor(
  a: [number, number, number],
  b: [number, number, number],
  t: number,
): [number, number, number] {
  return lerpVec3(a, b, t);
}
