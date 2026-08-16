/**
 * Module library for the particle system (PRD 11 §3.5). Modules are stateless
 * implementations keyed by `type`; per-particle state lives in the
 * {@link ParticleBuffer}. Init modules run once when a particle spawns;
 * update modules run every simulation step. Parameter packs come from each
 * {@link ModuleRef} so the same implementation serves many configurations.
 */
import type { ParticleBuffer } from './buffer';
import type { ColorStop, CurveStop } from './types';

/** Per-step context shared with every module. */
export interface ModuleContext {
  /** Deterministic pseudo-random number in `[0, 1)`. */
  random(): number;
  /** World gravity vector (m/s²). */
  readonly gravity: readonly [number, number, number];
  /** System/global parameters set via `ParticleSystemComponent.setParameter`. */
  readonly globals: ReadonlyMap<string, number | readonly number[]>;
}

/** Implementation contract for a particle module. */
export interface ParticleModuleImpl {
  /** Run once at spawn for particle `i`. */
  init?(buf: ParticleBuffer, i: number, params: Record<string, unknown>, ctx: ModuleContext): void;
  /** Run every step for particle `i`. */
  update?(
    buf: ParticleBuffer,
    i: number,
    dt: number,
    params: Record<string, unknown>,
    ctx: ModuleContext,
  ): void;
}

function num(params: Record<string, unknown>, key: string, fallback: number): number {
  const v = params[key];
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback;
}

function vec3(
  params: Record<string, unknown>,
  key: string,
  fallback: readonly [number, number, number],
): readonly [number, number, number] {
  const v = params[key];
  if (Array.isArray(v) && v.length >= 3) {
    return [Number(v[0]) || 0, Number(v[1]) || 0, Number(v[2]) || 0];
  }
  return fallback;
}

function rgba(
  params: Record<string, unknown>,
  key: string,
  fallback: readonly [number, number, number, number],
): readonly [number, number, number, number] {
  const v = params[key];
  if (Array.isArray(v) && v.length >= 4) {
    return [Number(v[0]) || 0, Number(v[1]) || 0, Number(v[2]) || 0, Number(v[3]) || 0];
  }
  return fallback;
}

function sampleColorStops(stops: ReadonlyArray<ColorStop>, t: number): [number, number, number, number] {
  if (stops.length === 0) return [1, 1, 1, 1];
  if (t <= stops[0].t) return [...stops[0].rgba];
  const last = stops[stops.length - 1];
  if (t >= last.t) return [...last.rgba];
  for (let s = 0; s < stops.length - 1; s++) {
    const a = stops[s];
    const b = stops[s + 1];
    if (t >= a.t && t <= b.t) {
      const f = b.t === a.t ? 0 : (t - a.t) / (b.t - a.t);
      return [
        a.rgba[0] + (b.rgba[0] - a.rgba[0]) * f,
        a.rgba[1] + (b.rgba[1] - a.rgba[1]) * f,
        a.rgba[2] + (b.rgba[2] - a.rgba[2]) * f,
        a.rgba[3] + (b.rgba[3] - a.rgba[3]) * f,
      ];
    }
  }
  return [...last.rgba];
}

function sampleCurveStops(stops: ReadonlyArray<CurveStop>, t: number): number {
  if (stops.length === 0) return 1;
  if (t <= stops[0].t) return stops[0].value;
  const last = stops[stops.length - 1];
  if (t >= last.t) return last.value;
  for (let s = 0; s < stops.length - 1; s++) {
    const a = stops[s];
    const b = stops[s + 1];
    if (t >= a.t && t <= b.t) {
      const f = b.t === a.t ? 0 : (t - a.t) / (b.t - a.t);
      return a.value + (b.value - a.value) * f;
    }
  }
  return last.value;
}

/** The built-in module registry. */
export const PARTICLE_MODULES: Readonly<Record<string, ParticleModuleImpl>> = {
  // ---- Init / spawn modules -------------------------------------------------
  InitPositionSphere: {
    init(buf, i, params, ctx) {
      const radius = num(params, 'radius', 0.5);
      // Uniform point inside a sphere.
      const u = ctx.random();
      const v = ctx.random();
      const w = ctx.random();
      const theta = u * Math.PI * 2;
      const phi = Math.acos(2 * v - 1);
      const r = radius * Math.cbrt(w);
      buf.posX[i] += r * Math.sin(phi) * Math.cos(theta);
      buf.posY[i] += r * Math.sin(phi) * Math.sin(theta);
      buf.posZ[i] += r * Math.cos(phi);
    },
  },
  InitPositionBox: {
    init(buf, i, params, ctx) {
      const ext = vec3(params, 'extents', [0.5, 0.5, 0.5]);
      buf.posX[i] += (ctx.random() * 2 - 1) * ext[0];
      buf.posY[i] += (ctx.random() * 2 - 1) * ext[1];
      buf.posZ[i] += (ctx.random() * 2 - 1) * ext[2];
    },
  },
  InitVelocityCone: {
    init(buf, i, params, ctx) {
      const angle = (num(params, 'angleDeg', 25) * Math.PI) / 180;
      const speed = num(params, 'speedMin', 1) +
        ctx.random() * (num(params, 'speedMax', 2) - num(params, 'speedMin', 1));
      const azimuth = ctx.random() * Math.PI * 2;
      const polar = ctx.random() * angle;
      const sinP = Math.sin(polar);
      // Cone opens along +Y by default.
      buf.velX[i] += speed * sinP * Math.cos(azimuth);
      buf.velY[i] += speed * Math.cos(polar);
      buf.velZ[i] += speed * sinP * Math.sin(azimuth);
    },
  },
  InitVelocityRandomSphere: {
    init(buf, i, params, ctx) {
      const speed = num(params, 'speedMin', 1) +
        ctx.random() * (num(params, 'speedMax', 2) - num(params, 'speedMin', 1));
      const theta = ctx.random() * Math.PI * 2;
      const phi = Math.acos(2 * ctx.random() - 1);
      buf.velX[i] += speed * Math.sin(phi) * Math.cos(theta);
      buf.velY[i] += speed * Math.sin(phi) * Math.sin(theta);
      buf.velZ[i] += speed * Math.cos(phi);
    },
  },
  InitSizeRandomBetween: {
    init(buf, i, params, ctx) {
      const min = num(params, 'min', 0.1);
      const max = num(params, 'max', 0.3);
      buf.size[i] = min + ctx.random() * (max - min);
      buf.startSize[i] = buf.size[i];
    },
  },
  InitColorRandomBetween: {
    init(buf, i, params, ctx) {
      const a = rgba(params, 'colorA', [1, 1, 1, 1]);
      const b = rgba(params, 'colorB', [1, 1, 1, 1]);
      const f = ctx.random();
      buf.r[i] = a[0] + (b[0] - a[0]) * f;
      buf.g[i] = a[1] + (b[1] - a[1]) * f;
      buf.b[i] = a[2] + (b[2] - a[2]) * f;
      buf.a[i] = a[3] + (b[3] - a[3]) * f;
      buf.captureStartValues(i);
    },
  },
  InitLifetimeRandomBetween: {
    init(buf, i, params, ctx) {
      const min = num(params, 'min', 1);
      const max = num(params, 'max', 2);
      buf.life[i] = Math.max(0.0001, min + ctx.random() * (max - min));
    },
  },

  // ---- Update modules -------------------------------------------------------
  ApplyGravity: {
    update(buf, i, dt, params, ctx) {
      const scale = num(params, 'scale', 1);
      buf.velX[i] += ctx.gravity[0] * scale * dt;
      buf.velY[i] += ctx.gravity[1] * scale * dt;
      buf.velZ[i] += ctx.gravity[2] * scale * dt;
    },
  },
  ApplyForce: {
    update(buf, i, dt, params) {
      const f = vec3(params, 'force', [0, 0, 0]);
      buf.velX[i] += f[0] * dt;
      buf.velY[i] += f[1] * dt;
      buf.velZ[i] += f[2] * dt;
    },
  },
  Drag: {
    update(buf, i, dt, params) {
      const drag = num(params, 'drag', 0.5);
      const damp = Math.max(0, 1 - drag * dt);
      buf.velX[i] *= damp;
      buf.velY[i] *= damp;
      buf.velZ[i] *= damp;
    },
  },
  /**
   * Soft coherent drift for dust/smoke. Uses particle age + index so motion
   * wanders instead of white-noise jittering every frame.
   */
  Turbulence: {
    update(buf, i, dt, params) {
      const strength = num(params, 'strength', 0.4);
      const frequency = num(params, 'frequency', 0.8);
      const verticalScale = num(params, 'verticalScale', 0.35);
      const t = buf.age[i] * frequency;
      const seed = (i + 1) * 12.9898;
      const nx = Math.sin(t * 1.71 + seed) * Math.cos(t * 0.93 + seed * 0.31);
      const ny = Math.sin(t * 1.13 + seed * 1.73) * verticalScale;
      const nz = Math.cos(t * 1.37 + seed * 2.11) * Math.sin(t * 0.79 + seed * 0.47);
      buf.velX[i] += nx * strength * dt;
      buf.velY[i] += ny * strength * dt;
      buf.velZ[i] += nz * strength * dt;
    },
  },
  VelocityIntegration: {
    update(buf, i, dt) {
      buf.posX[i] += buf.velX[i] * dt;
      buf.posY[i] += buf.velY[i] * dt;
      buf.posZ[i] += buf.velZ[i] * dt;
    },
  },
  ColorOverLife: {
    update(buf, i, _dt, params) {
      const stops = (params.stops as ReadonlyArray<ColorStop>) ?? [];
      const t = buf.life[i] > 0 ? buf.age[i] / buf.life[i] : 1;
      const [r, g, b, a] = sampleColorStops(stops, t);
      buf.r[i] = r;
      buf.g[i] = g;
      buf.b[i] = b;
      buf.a[i] = a;
    },
  },
  SizeOverLife: {
    update(buf, i, _dt, params) {
      const stops = (params.stops as ReadonlyArray<CurveStop>) ?? [];
      const t = buf.life[i] > 0 ? buf.age[i] / buf.life[i] : 1;
      buf.size[i] = buf.startSize[i] * sampleCurveStops(stops, t);
    },
  },
  // LifetimeKill is implicit (the runtime culls particles with age >= life),
  // but we register a no-op so module stacks can reference it explicitly.
  LifetimeKill: {},
};

/** Returns the module implementation for a type id, or undefined if unknown. */
export function getParticleModule(type: string): ParticleModuleImpl | undefined {
  return PARTICLE_MODULES[type];
}
