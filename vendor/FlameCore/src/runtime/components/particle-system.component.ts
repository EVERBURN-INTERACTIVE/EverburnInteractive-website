import * as THREE from 'three';
import type { SerializedComponentProps } from '@shared/types';
import { BaseComponent } from '../scene/component';
import type { Scene } from '../scene/scene';
import type { AssetId } from '../assets/types';
import { EmitterRuntime } from '../particles/emitter-runtime';
import type {
  ParticleSystemAsset,
  ParticleSimulationSpace,
  ParticleLoopMode,
} from '../particles/types';

/**
 * Serialized {@link ParticleSystemComponent} properties (v1).
 *
 * The component references a {@link ParticleSystemAsset} by GUID; the runtime
 * resolves it via `Runtime.particleResolver`. Overrides let a single asset be
 * reused with per-instance tweaks without cloning the asset. See PRD 11 §3.6.
 */
export interface ParticleSystemProps extends SerializedComponentProps {
  readonly _version: 1;
  /** Particle system asset to play. When undefined the component is idle. */
  particleSystemAssetId?: AssetId;
  /** Begin playing automatically when the component enters an active scene. */
  autoPlay: boolean;
  /** Playback speed multiplier (`1` = real time). Clamped to `[0, 8]`. */
  playbackSpeed: number;
  /** Multiplier on every emitter's spawn rate. Clamped to `[0, 16]`. */
  emissionRateScale: number;
  /** Optional simulation-space override applied to all emitters. */
  simulationSpaceOverride?: ParticleSimulationSpace;
  /** Optional loop-mode override for the whole system. */
  loopModeOverride?: ParticleLoopMode;
}

/** Default props factory (backfills older serialized projects). */
export function makeParticleSystemProps(
  patch: Partial<Omit<ParticleSystemProps, '_version'>> = {},
): ParticleSystemProps {
  const out: ParticleSystemProps = {
    _version: 1,
    autoPlay: patch.autoPlay ?? true,
    playbackSpeed: patch.playbackSpeed ?? 1,
    emissionRateScale: patch.emissionRateScale ?? 1,
  };
  if (patch.particleSystemAssetId) out.particleSystemAssetId = patch.particleSystemAssetId;
  if (patch.simulationSpaceOverride) out.simulationSpaceOverride = patch.simulationSpaceOverride;
  if (patch.loopModeOverride) out.loopModeOverride = patch.loopModeOverride;
  return out;
}

/**
 * ParticleSystemComponent drives a CPU-simulated, GPU-rendered particle effect
 * built from a {@link ParticleSystemAsset}. Each emitter in the asset gets an
 * {@link EmitterRuntime}; world-space emitters render under the scene root,
 * local-space emitters render under the actor so they inherit its transform.
 *
 * The {@link ParticleSystem} engine system advances playing components each
 * frame. Physics-style WASM is not involved; simulation is pure JS so the
 * "no particles" path costs nothing (the system early-outs when no component
 * exists).
 *
 * Lifecycle:
 *  - `onSceneAttach` -> register with the system, resolve the asset, build
 *    emitters, and auto-play if configured.
 *  - `onSceneDetach`/`onDetach` -> dispose emitters and unregister.
 */
export class ParticleSystemComponent extends BaseComponent<ParticleSystemProps> {
  static readonly typeName = 'ParticleSystemComponent';

  private _scene: Scene | undefined;
  private _asset: ParticleSystemAsset | undefined;
  private _emitters: EmitterRuntime[] = [];
  private _playing = false;
  private _built = false;
  private readonly _globals = new Map<string, number | readonly number[]>();
  private readonly _worldPos = new THREE.Vector3();
  private _masterSeed = 1;

  constructor(props: ParticleSystemProps) {
    super(makeParticleSystemProps(props));
  }

  /** True while the effect is actively simulating. */
  get isPlaying(): boolean {
    return this._playing;
  }

  /** The resolved asset, if any. */
  get asset(): ParticleSystemAsset | undefined {
    return this._asset;
  }

  /** Live emitter runtimes (read-only). */
  get emitters(): ReadonlyArray<EmitterRuntime> {
    return this._emitters;
  }

  /** Total live particle count across all emitters. */
  get liveParticleCount(): number {
    let n = 0;
    for (const e of this._emitters) n += e.buffer.count;
    return n;
  }

  onSceneAttach(scene: Scene): void {
    super.onSceneAttach(scene);
    this._scene = scene;
    const system = scene.runtime?.systems.find((s) => s.name === 'ParticleSystem') as
      | { register: (c: ParticleSystemComponent) => void }
      | undefined;
    system?.register(this);

    if (!this._asset && this._props.particleSystemAssetId) {
      const resolver = scene.runtime?.particleResolver;
      const resolved = resolver?.(this._props.particleSystemAssetId);
      if (resolved) {
        this._asset = resolved;
      } else if (resolver) {
        console.warn(
          `[ParticleSystem] Could not resolve particle asset ` +
            `"${this._props.particleSystemAssetId}" for actor "${this._actor?.name ?? '?'}".`,
        );
      }
    }
    this._ensureBuilt();
    if (this._props.autoPlay) this.play();
  }

  onSceneDetach(scene: Scene): void {
    const system = scene.runtime?.systems.find((s) => s.name === 'ParticleSystem') as
      | { unregister: (c: ParticleSystemComponent) => void }
      | undefined;
    system?.unregister(this);
    this._teardown();
    this._scene = undefined;
    super.onSceneDetach(scene);
  }

  onDetach(): void {
    this._teardown();
    super.onDetach();
  }

  /**
   * Set the asset directly, bypassing the resolver. Useful for tests and for
   * hosts that hold the asset in memory. Rebuilds emitters.
   */
  setAsset(asset: ParticleSystemAsset | undefined): void {
    const wasPlaying = this._playing;
    this._teardown();
    this._asset = asset;
    this._ensureBuilt();
    if (wasPlaying || this._props.autoPlay) this.play();
  }

  /** Start (or resume) playback. */
  play(): void {
    this._ensureBuilt();
    if (this._emitters.length === 0) return;
    this._playing = true;
  }

  /** Pause playback (keeps particles frozen). */
  pause(): void {
    this._playing = false;
  }

  /** Stop playback and clear all live particles. */
  stop(): void {
    this._playing = false;
    for (const e of this._emitters) e.reset();
  }

  /** Restart from the beginning. */
  restart(): void {
    for (const e of this._emitters) e.reset();
    this._playing = true;
  }

  /** Set a named global parameter consumed by modules. */
  setParameter(name: string, value: number | readonly number[]): void {
    this._globals.set(name, value);
  }

  /**
   * Advance the simulation. Called by the {@link ParticleSystem} each frame.
   * @internal
   */
  _tick(dt: number): void {
    if (!this._playing || this._emitters.length === 0) return;
    const speed = Math.max(0, Math.min(8, this._props.playbackSpeed));
    const scaled = dt * speed;
    if (scaled <= 0) return;

    const emissionScale = Math.max(0, Math.min(16, this._props.emissionRateScale));
    const space = this._effectiveSpace();
    const gravity = this._gravity();

    let origin: readonly [number, number, number] = [0, 0, 0];
    if (space === 'world' && this._actor) {
      this._actor.object3D.getWorldPosition(this._worldPos);
      origin = [this._worldPos.x, this._worldPos.y, this._worldPos.z];
    }

    for (const e of this._emitters) {
      e.update(scaled, origin, space, gravity, this._globals, emissionScale);
    }
  }

  private _ensureBuilt(): void {
    if (this._built || !this._asset || !this._actor) return;
    const space = this._effectiveSpace();
    const root = this._scene?.threeScene;
    for (const def of this._asset.emitters) {
      if (!def.enabled) continue;
      const runtime = new EmitterRuntime(def, this._masterSeed);
      const emitterSpace = def.simulationSpaceOverride ?? space;
      // World-space emitters render under the scene root (identity transform);
      // local-space emitters render under the actor to inherit its transform.
      if (emitterSpace === 'world' && root) {
        root.add(runtime.object3D);
      } else {
        this._actor.object3D.add(runtime.object3D);
      }
      this._emitters.push(runtime);
    }
    this._built = true;
  }

  private _teardown(): void {
    this._playing = false;
    for (const e of this._emitters) e.dispose();
    this._emitters = [];
    this._built = false;
  }

  private _effectiveSpace(): ParticleSimulationSpace {
    return (
      this._props.simulationSpaceOverride ?? this._asset?.simulationSpace ?? 'world'
    );
  }

  private _gravity(): readonly [number, number, number] {
    const g = this._globals.get('gravity');
    if (Array.isArray(g) && g.length >= 3) {
      return [Number(g[0]) || 0, Number(g[1]) || 0, Number(g[2]) || 0];
    }
    return [0, -9.81, 0];
  }

  protected onPropsChanged(): void {
    // Asset/space changes require a rebuild; speed/scale apply live.
    // Keep it simple: rebuild on any change when already built.
    if (this._built && this._scene) {
      const wasPlaying = this._playing;
      this._teardown();
      this._ensureBuilt();
      if (wasPlaying) this.play();
    }
  }
}
