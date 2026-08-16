/**
 * AnimationMixer — combines contributions from multiple animation players
 * into a single value per (actor, component, property) tuple.
 *
 * Each layer carries a (weight, value, type) tuple and is sorted by
 * ascending `layer` index. Layers are combined sequentially:
 *
 * - layer 0 is the base.
 * - subsequent layers are blended toward the accumulator using their `weight`
 *   when `additive === false`, or added on top of the accumulator when
 *   `additive === true` (additive currently supported for numeric values
 *   only — additive on vectors/colors lerps toward `base + delta`).
 *
 * @module @runtime/systems/animation.mixer
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
import { interpolateValue } from '../utils/interpolate';

/** A single contribution to a property. */
export interface MixerContribution {
  /** Numeric blend layer index — higher overrides lower. */
  layer: number;
  /** Blend weight in `[0, 1]`. 1 = full influence, 0 = no influence. */
  weight: number;
  /** Track value type. */
  valueType: AnimatableValueType;
  /** Value to apply. */
  value: AnimatableValue;
  /** When true the value is added on top of the running accumulator. */
  additive?: boolean;
}

/**
 * Reduce a list of contributions to a single value. Returns `undefined` if
 * the list is empty.
 */
export function mixContributions(contributions: MixerContribution[]): AnimatableValue | undefined {
  if (contributions.length === 0) return undefined;
  if (contributions.length === 1) return contributions[0].value;

  // Sort low → high so higher layers blend last.
  contributions.sort((a, b) => a.layer - b.layer);

  let acc = contributions[0].value;
  let accType = contributions[0].valueType;

  for (let i = 1; i < contributions.length; i++) {
    const c = contributions[i];
    const w = clamp01(c.weight);
    if (w <= 0) continue;
    if (c.additive) {
      acc = addValues(acc, c.value, c.valueType, w);
    } else {
      acc = interpolateValue(acc, c.value, w, c.valueType);
    }
    accType = c.valueType;
  }

  void accType;
  return acc;
}

/**
 * Crossfade helper — produces two contributions for the same (actor, property)
 * over a `duration` window. `progress` is `[0, 1]` from start to end.
 */
export function crossfade(
  fromValue: AnimatableValue,
  toValue: AnimatableValue,
  valueType: AnimatableValueType,
  progress: number,
  baseLayer = 0,
): MixerContribution[] {
  const p = clamp01(progress);
  return [
    { layer: baseLayer, weight: 1, valueType, value: fromValue },
    { layer: baseLayer + 1, weight: p, valueType, value: toValue },
  ];
}

/**
 * Additive contribution helper — produces a layer that adds `delta` on top
 * of the existing value with the supplied weight.
 */
export function additive(
  delta: AnimatableValue,
  valueType: AnimatableValueType,
  weight: number,
  layer: number,
): MixerContribution {
  return { layer, weight, valueType, value: delta, additive: true };
}

const clamp01 = (t: number): number => Math.max(0, Math.min(1, t));

function addValues(
  base: AnimatableValue,
  delta: AnimatableValue,
  valueType: AnimatableValueType,
  weight: number,
): AnimatableValue {
  switch (valueType) {
    case 'number':
      return (base as number) + (delta as number) * weight;
    case 'vec2': {
      const a = base as Vec2;
      const d = delta as Vec2;
      return [a[0] + d[0] * weight, a[1] + d[1] * weight];
    }
    case 'vec3': {
      const a = base as Vec3;
      const d = delta as Vec3;
      return [a[0] + d[0] * weight, a[1] + d[1] * weight, a[2] + d[2] * weight];
    }
    case 'vec4': {
      const a = base as Vec4;
      const d = delta as Vec4;
      return [
        a[0] + d[0] * weight,
        a[1] + d[1] * weight,
        a[2] + d[2] * weight,
        a[3] + d[3] * weight,
      ];
    }
    case 'color': {
      if (Array.isArray(base) && Array.isArray(delta)) {
        return (base as number[]).map((v, i) => v + (delta as number[])[i] * weight) as unknown as Vec3;
      }
      const a = base as ColorRGBA;
      const d = delta as ColorRGBA;
      return {
        r: a.r + d.r * weight,
        g: a.g + d.g * weight,
        b: a.b + d.b * weight,
        a: a.a + d.a * weight,
      };
    }
    case 'quaternion': {
      // Additive quaternion is approximated by lerp + renormalize.
      const a = base as QuaternionValue;
      const d = delta as QuaternionValue;
      const x = a.x + d.x * weight;
      const y = a.y + d.y * weight;
      const z = a.z + d.z * weight;
      const w = a.w + d.w * weight;
      const len = Math.hypot(x, y, z, w) || 1;
      return { x: x / len, y: y / len, z: z / len, w: w / len };
    }
    default:
      return base;
  }
}
