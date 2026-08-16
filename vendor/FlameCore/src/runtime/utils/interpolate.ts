/**
 * Type-aware value interpolation for animation keyframes.
 *
 * The {@link interpolateValue} dispatcher fans out to the correct
 * per-type lerp/slerp routine based on the track's `valueType`.
 *
 * @module @runtime/utils/interpolate
 */

import type {
  AnimatableValue,
  AnimatableValueType,
  ColorRGBA,
  QuaternionValue,
  Vec2,
  Vec3,
  Vec4,
} from '@shared/types/animation';
import { lerp } from './easing';

/**
 * Interpolate between two animatable values. The eased `t` parameter is
 * computed by the caller using {@link applyEasing}.
 *
 * Falls back to step-at-0.5 for incompatible / non-numeric value pairs.
 */
export function interpolateValue(
  a: AnimatableValue,
  b: AnimatableValue,
  t: number,
  valueType: AnimatableValueType,
): AnimatableValue {
  switch (valueType) {
    case 'number':
      return lerp(a as number, b as number, t);
    case 'vec2':
      return lerpVec2(a as Vec2, b as Vec2, t);
    case 'vec3':
      return lerpVec3Tuple(a as Vec3, b as Vec3, t);
    case 'vec4':
      return lerpVec4(a as Vec4, b as Vec4, t);
    case 'color':
      return lerpColorRGBA(a, b, t);
    case 'quaternion':
      return slerpQuaternion(a as QuaternionValue, b as QuaternionValue, t);
    case 'string': {
      if (typeof a === 'string' && typeof b === 'string') {
        const lerped = lerpCssColorString(a, b, t);
        if (lerped !== undefined) return lerped;
      }
      return t < 0.5 ? a : b;
    }
    case 'boolean':
      return t < 0.5 ? a : b;
    default:
      return t < 0.5 ? a : b;
  }
}

function lerpVec2(a: Vec2, b: Vec2, t: number): Vec2 {
  return [lerp(a[0], b[0], t), lerp(a[1], b[1], t)];
}

function lerpVec3Tuple(a: Vec3, b: Vec3, t: number): Vec3 {
  return [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
}

function lerpVec4(a: Vec4, b: Vec4, t: number): Vec4 {
  return [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t), lerp(a[3], b[3], t)];
}

/**
 * Lerp between two colors. Accepts both the canonical {@link ColorRGBA}
 * object shape and the legacy `[r, g, b]` array used by existing components.
 * The output shape matches `a`'s shape.
 */
function lerpColorRGBA(a: AnimatableValue, b: AnimatableValue, t: number): AnimatableValue {
  // Array form: [r, g, b] in [0, 1]
  if (Array.isArray(a) && Array.isArray(b)) {
    const len = Math.min(a.length, b.length);
    const out: number[] = new Array(len);
    for (let i = 0; i < len; i++) out[i] = lerp(a[i] as number, b[i] as number, t);
    return out as unknown as Vec3;
  }
  // Object form
  const ao = a as ColorRGBA;
  const bo = b as ColorRGBA;
  return {
    r: lerp(ao.r ?? 0, bo.r ?? 0, t),
    g: lerp(ao.g ?? 0, bo.g ?? 0, t),
    b: lerp(ao.b ?? 0, bo.b ?? 0, t),
    a: lerp(ao.a ?? 1, bo.a ?? 1, t),
  };
}

/**
 * Shortest-arc quaternion slerp.
 * Implements the standard formula; numerically stable for tiny angles.
 */
function slerpQuaternion(a: QuaternionValue, b: QuaternionValue, t: number): QuaternionValue {
  let { x: bx, y: by, z: bz, w: bw } = b;
  let cos = a.x * bx + a.y * by + a.z * bz + a.w * bw;
  if (cos < 0) {
    cos = -cos;
    bx = -bx;
    by = -by;
    bz = -bz;
    bw = -bw;
  }
  if (cos > 0.9995) {
    // Linear fallback for very small angles.
    const x = a.x + t * (bx - a.x);
    const y = a.y + t * (by - a.y);
    const z = a.z + t * (bz - a.z);
    const w = a.w + t * (bw - a.w);
    const len = Math.hypot(x, y, z, w) || 1;
    return { x: x / len, y: y / len, z: z / len, w: w / len };
  }
  const theta = Math.acos(Math.min(1, cos));
  const sinTheta = Math.sin(theta);
  const sa = Math.sin((1 - t) * theta) / sinTheta;
  const sb = Math.sin(t * theta) / sinTheta;
  return {
    x: a.x * sa + bx * sb,
    y: a.y * sa + by * sb,
    z: a.z * sa + bz * sb,
    w: a.w * sa + bw * sb,
  };
}

/**
 * Lerp CSS color strings (`#rgb`, `#rrggbb`, `rgb()`, `rgba()`).
 * Returns undefined when either side is not a parseable CSS color.
 */
export function lerpCssColorString(a: string, b: string, t: number): string | undefined {
  const ca = parseCssColor(a);
  const cb = parseCssColor(b);
  if (!ca || !cb) return undefined;
  const r = Math.round(lerp(ca[0], cb[0], t));
  const g = Math.round(lerp(ca[1], cb[1], t));
  const bl = Math.round(lerp(ca[2], cb[2], t));
  const alpha = lerp(ca[3], cb[3], t);
  if (ca[3] < 1 || cb[3] < 1 || alpha < 0.999) {
    return `rgba(${r}, ${g}, ${bl}, ${Number(alpha.toFixed(3))})`;
  }
  return `rgb(${r}, ${g}, ${bl})`;
}

function parseCssColor(s: string): [number, number, number, number] | undefined {
  const trimmed = s.trim();
  const hex = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(trimmed);
  if (hex) {
    const h = hex[1];
    if (h.length === 3) {
      return [
        parseInt(h[0] + h[0], 16),
        parseInt(h[1] + h[1], 16),
        parseInt(h[2] + h[2], 16),
        1,
      ];
    }
    return [
      parseInt(h.slice(0, 2), 16),
      parseInt(h.slice(2, 4), 16),
      parseInt(h.slice(4, 6), 16),
      1,
    ];
  }
  const rgb =
    /^rgba?\(\s*([0-9.]+)\s*,\s*([0-9.]+)\s*,\s*([0-9.]+)(?:\s*,\s*([0-9.]+))?\s*\)$/i.exec(
      trimmed,
    );
  if (rgb) {
    return [
      Number(rgb[1]),
      Number(rgb[2]),
      Number(rgb[3]),
      rgb[4] !== undefined ? Number(rgb[4]) : 1,
    ];
  }
  return undefined;
}

/** Best-effort value-type inference for ad-hoc / migrated keyframes. */
export function inferAnimatableValueType(sample: AnimatableValue): AnimatableValueType {
  if (typeof sample === 'number') return 'number';
  if (typeof sample === 'string') return 'string';
  if (typeof sample === 'boolean') return 'boolean';
  if (Array.isArray(sample)) {
    const len = (sample as ReadonlyArray<unknown>).length;
    if (len === 2) return 'vec2';
    if (len === 3) return 'vec3';
    if (len === 4) return 'vec4';
  }
  if (typeof sample === 'object' && sample !== null) {
    if ('w' in sample && 'x' in sample) return 'quaternion';
    if ('r' in sample) return 'color';
  }
  return 'number';
}
