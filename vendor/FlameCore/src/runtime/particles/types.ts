/**
 * Niagara-style particle system data model (PRD 11).
 *
 * The model mirrors Niagara's conceptual hierarchy: a {@link ParticleSystemAsset}
 * owns one or more {@link ParticleEmitterDefinition}s, each of which is a
 * linear stack of {@link ModuleRef}s (init modules run once per spawned
 * particle, update modules run every simulation step). All types here are
 * serialization-friendly (JSON-safe, no live Three.js references).
 */

import type { AssetId } from '../assets/types';

/** Simulation space for an emitter's particles. */
export type ParticleSimulationSpace = 'world' | 'local';

/** How the system clock advances. */
export type ParticleTimeMode = 'gameTime' | 'unscaledTime';

/** Looping behaviour for the whole system. */
export type ParticleLoopMode = 'once' | 'loop' | 'pingPong';

/** Which renderer draws an emitter's particles. */
export type ParticleRendererType = 'sprite' | 'mesh' | 'ribbon';

/** Blending mode for sprite particles. */
export type ParticleBlendMode = 'additive' | 'normal';

/** A gradient stop used by color-over-life modules. */
export interface ColorStop {
  /** Normalized position in `[0, 1]` along particle lifetime. */
  readonly t: number;
  /** RGBA color in `[0, 1]`. */
  readonly rgba: readonly [number, number, number, number];
}

/** A curve stop used by size-over-life modules (multiplies start size). */
export interface CurveStop {
  /** Normalized position in `[0, 1]`. */
  readonly t: number;
  /** Multiplier value. */
  readonly value: number;
}

/**
 * Reference to a particle module: a registered module `type` plus a loose
 * parameter pack consumed by that module's implementation.
 */
export interface ModuleRef {
  readonly type: string;
  readonly params: Record<string, unknown>;
}

/** Spawn settings for an emitter. */
export interface ParticleSpawnSettings {
  /** Continuous spawn rate, particles per second. */
  rate: number;
  /** Optional one-shot burst count at `burstInterval` cadence. */
  burstCount?: number;
  /** Seconds between bursts. */
  burstInterval?: number;
  /** Emitter active duration in seconds (`0` = infinite). */
  duration: number;
  /** Whether the emitter restarts after `duration`. */
  looping: boolean;
}

/** Sprite renderer configuration. */
export interface SpriteRendererConfig {
  /** Texture asset id for the sprite (optional; a soft dot is used if unset). */
  materialAssetId?: AssetId;
  /** Blend mode. */
  blend: ParticleBlendMode;
}

/** Mesh renderer configuration. */
export interface MeshRendererConfig {
  meshAssetId?: AssetId;
  materialAssetId?: AssetId;
}

/** Ribbon renderer configuration (spec only in v1). */
export interface RibbonRendererConfig {
  trailLength: number;
  widthOverLife?: ReadonlyArray<CurveStop>;
}

/** Definition of a single emitter within a particle system. */
export interface ParticleEmitterDefinition {
  readonly name: string;
  enabled: boolean;
  spawn: ParticleSpawnSettings;
  /** Maximum live particles for this emitter. */
  capacity: number;
  /** Modules executed once when a particle spawns. */
  initialModules: ReadonlyArray<ModuleRef>;
  /** Modules executed every simulation step. */
  updateModules: ReadonlyArray<ModuleRef>;
  /** Which renderer to use. */
  renderer: ParticleRendererType;
  sprite?: SpriteRendererConfig;
  mesh?: MeshRendererConfig;
  ribbon?: RibbonRendererConfig;
  /** Optional per-emitter simulation-space override. */
  simulationSpaceOverride?: ParticleSimulationSpace;
}

/** A complete particle system asset (lives under `/Particles`). */
export interface ParticleSystemAsset {
  readonly id: AssetId;
  name: string;
  readonly _version: 1;
  emitters: ReadonlyArray<ParticleEmitterDefinition>;
  simulationSpace: ParticleSimulationSpace;
  timeMode: ParticleTimeMode;
  loopMode: ParticleLoopMode;
  /** Global cap across all emitters (defensive upper bound). */
  maxParticleBudget: number;
}

/** Factory for a default, ready-to-simulate sprite emitter. */
export function makeDefaultEmitter(
  patch: Partial<ParticleEmitterDefinition> = {},
): ParticleEmitterDefinition {
  return {
    name: patch.name ?? 'Emitter',
    enabled: patch.enabled ?? true,
    capacity: patch.capacity ?? 512,
    spawn: patch.spawn ?? { rate: 50, duration: 0, looping: true },
    initialModules: patch.initialModules ?? [
      { type: 'InitPositionSphere', params: { radius: 0.2 } },
      { type: 'InitVelocityCone', params: { angleDeg: 25, speedMin: 1, speedMax: 2.5 } },
      { type: 'InitSizeRandomBetween', params: { min: 0.1, max: 0.3 } },
      { type: 'InitColorRandomBetween', params: { colorA: [1, 0.8, 0.2, 1], colorB: [1, 0.3, 0.1, 1] } },
      { type: 'InitLifetimeRandomBetween', params: { min: 1, max: 2 } },
    ],
    updateModules: patch.updateModules ?? [
      { type: 'ApplyGravity', params: { scale: 0.3 } },
      { type: 'Drag', params: { drag: 0.5 } },
      { type: 'VelocityIntegration', params: {} },
      {
        type: 'ColorOverLife',
        params: {
          stops: [
            { t: 0, rgba: [1, 0.9, 0.4, 1] },
            { t: 1, rgba: [1, 0.2, 0.1, 0] },
          ],
        },
      },
      {
        type: 'SizeOverLife',
        params: {
          stops: [
            { t: 0, value: 1 },
            { t: 1, value: 0 },
          ],
        },
      },
    ],
    renderer: patch.renderer ?? 'sprite',
    sprite: patch.sprite ?? { blend: 'additive' },
    ...(patch.mesh ? { mesh: patch.mesh } : {}),
    ...(patch.ribbon ? { ribbon: patch.ribbon } : {}),
    ...(patch.simulationSpaceOverride
      ? { simulationSpaceOverride: patch.simulationSpaceOverride }
      : {}),
  };
}

/** Factory for a default particle system asset (a single fire-like emitter). */
export function makeParticleSystemAsset(
  patch: Partial<ParticleSystemAsset> = {},
): ParticleSystemAsset {
  return {
    id: patch.id ?? '',
    name: patch.name ?? 'Particle System',
    _version: 1,
    emitters: patch.emitters ?? [makeDefaultEmitter()],
    simulationSpace: patch.simulationSpace ?? 'world',
    timeMode: patch.timeMode ?? 'gameTime',
    loopMode: patch.loopMode ?? 'loop',
    maxParticleBudget: patch.maxParticleBudget ?? 4096,
  };
}
