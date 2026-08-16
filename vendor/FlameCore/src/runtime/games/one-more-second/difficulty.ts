import { BASE_SPEED, CORRIDOR_HALF_WIDTH, CORRIDOR_NARROW_HALF_WIDTH } from './config';

/** Difficulty derived only from seconds alive. */
export interface Difficulty {
  /** Movement speed multiplier (1× at t=0). */
  speedMul: number;
  /** Absolute forward speed. */
  speed: number;
  /** Chance a non-empty segment is chosen. */
  density: number;
  /** Moving (lane-sliding) obstacles. */
  moving: boolean;
  /** Wider blockers and double-staggered segments. */
  complex: boolean;
  /** Larger obstacle scale. */
  larger: boolean;
  /** Corridor half-width this second. */
  halfWidth: number;
  /** 0..1 dramatic intensity used by the view. */
  intensity: number;
  /** Screen-shake amplitude. */
  shake: number;
  /** Extra camera FOV in degrees. */
  fovBoost: number;
  /** Peak camera roll in radians. */
  cameraTilt: number;
  /** Chromatic aberration 0..1. */
  chromatic: number;
  /** Glitch 0..1. */
  glitch: number;
}

function clamp01(v: number): number {
  return v < 0 ? 0 : v > 1 ? 1 : v;
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/**
 * Piecewise curve from the design doc, with continuous acceleration after 120s.
 */
export function difficultyAt(timeAlive: number): Difficulty {
  const t = Math.max(0, timeAlive);
  let speedMul: number;
  if (t < 20) speedMul = 1;
  else if (t < 40) speedMul = 1.25;
  else if (t < 60) speedMul = 1.5;
  else if (t < 90) speedMul = 2;
  else if (t < 120) speedMul = 2.5;
  else speedMul = 2.5 + (t - 120) * 0.012;

  let density: number;
  if (t < 20) density = 0.38;
  else if (t < 40) density = 0.55;
  else if (t < 60) density = 0.66;
  else if (t < 90) density = 0.74;
  else if (t < 120) density = 0.84;
  else density = 0.9;

  const narrowT = t < 90 ? 0 : clamp01((t - 90) / 30);
  const intensity = clamp01(t / 120);
  const late = clamp01((t - 60) / 60);
  const fail = clamp01((t - 120) / 20);

  return {
    speedMul,
    speed: BASE_SPEED * speedMul,
    density,
    moving: t >= 40,
    complex: t >= 90,
    larger: t >= 90,
    halfWidth: lerp(CORRIDOR_HALF_WIDTH, CORRIDOR_NARROW_HALF_WIDTH, narrowT),
    intensity,
    shake: late * 0.018 + fail * 0.025,
    fovBoost: late * 3.5 + fail * 1.5,
    cameraTilt: t >= 90 ? 0.01 : 0,
    chromatic: late * 0.07 + fail * 0.05,
    /** Kept low so late-game remains readable. */
    glitch: fail * 0.14,
  };
}
