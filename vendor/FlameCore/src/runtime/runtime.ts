import type * as THREE from 'three';
import { EventEmitter } from './utils/events';
import { RuntimeContext, type RuntimeContextOptions } from './runtime-context';
import { GameplaySystem } from './systems/gameplay.system';
import { InputSystem } from './systems/input.system';
import { LODSystem } from './systems/lod.system';
import { PhysicsSystem } from './systems/physics.system';
import { AnimationSystem } from './systems/animation.system';
import { AudioSystem } from './systems/audio.system';
import { UISystem } from './systems/ui.system';
import { ParticleSystem } from './systems/particle.system';
import { MaterialSystem } from './systems/material.system';
import { ScrollTriggerSystem } from './systems/scroll-trigger.system';
import { CameraPathSystem } from './systems/camera-path.system';
import { RenderingSystem } from './systems/rendering.system';
import { CameraComponent } from './components/camera.component';
import { LightComponent } from './components/light.component';
import { syncSceneLightShadows } from './lighting/shadow-config';
import { AdaptivePerformanceController } from './quality/adaptive-performance';
import type { System } from './systems/system';
import type { Scene } from './scene/scene';
import type { SerializedScene } from './scene/scene';

/** Runtime version embedded in exported projects. Bump on breaking changes. */
export const FLAMECORE_RUNTIME_VERSION = '0.1.0';

/**
 * Resolves a scene-asset GUID to its serialized form. Supplied by the host
 * (the editor wires this to its project store; exported sites wire it to the
 * bundled scene table). Used by {@link SceneInstanceComponent} to instantiate
 * nested sub-scenes. See PRD 1 (Nested Scene System).
 */
export type SceneResolver = (sceneAssetId: string) => SerializedScene | undefined;

/**
 * Resolves a particle-system asset GUID to its in-memory definition. Supplied
 * by the host (editor project store or bundled asset table). Used by
 * {@link ParticleSystemComponent}; when unset, particle components that
 * reference an asset by id log a warning and stay idle. See PRD 11.
 */
export type ParticleResolver = (
  particleSystemAssetId: string,
) => import('./particles/types').ParticleSystemAsset | undefined;

/** Lifecycle events emitted by the Runtime. */
export interface RuntimeEvents {
  beforeUpdate: { dt: number };
  afterUpdate: { dt: number };
  sceneActivated: { scene: Scene };
  sceneDeactivated: { scene: Scene };
  /** Fired after {@link switchProjectScene} replaces the top-level scene. */
  projectSceneSwitched: { scene: Scene; sceneId: string };
}

/** Options accepted by {@link Runtime.create}. */
export interface RuntimeOptions extends RuntimeContextOptions {
  /** Maximum simulation `dt` per frame, in seconds. Clamps long pauses. */
  maxDeltaTime?: number;
  /** Fixed timestep used by physics-like systems. Reserved for PRD 4. */
  fixedTimeStep?: number;
}

/**
 * The Runtime is the top-level entry point: it owns the {@link RuntimeContext}
 * (renderer, canvas, clock), the registered {@link System} list, and the set
 * of active {@link Scene}s. Call `start()` to begin the `requestAnimationFrame`
 * loop and `stop()` to halt it.
 */
export class Runtime {
  readonly context: RuntimeContext;
  readonly events = new EventEmitter<RuntimeEvents>();
  readonly version = FLAMECORE_RUNTIME_VERSION;

  /** Hard cap on per-frame dt to avoid huge steps after tab backgrounding. */
  maxDeltaTime: number;

  /**
   * Optional resolver mapping a scene-asset GUID to its serialized form.
   * Required for {@link SceneInstanceComponent} (nested scenes) to function;
   * when unset, nested scene instances log a warning and render nothing.
   */
  sceneResolver: SceneResolver | undefined;

  /**
   * Optional resolver mapping a particle-system asset GUID to its definition.
   * Required for {@link ParticleSystemComponent} to resolve assets by id; when
   * unset, components must be given an asset directly via `setAsset`.
   */
  particleResolver: ParticleResolver | undefined;

  /** Assign the nested-scene resolver. See {@link wireRuntimeResolvers}. */
  setSceneResolver(resolver: SceneResolver | undefined): void {
    this.sceneResolver = resolver;
  }

  /** Assign the particle-system asset resolver. See {@link wireRuntimeResolvers}. */
  setParticleResolver(resolver: ParticleResolver | undefined): void {
    this.particleResolver = resolver;
  }

  private readonly _systems: System[] = [];
  private readonly _scenes = new Set<Scene>();
  private _running = false;
  private _rafHandle = 0;
  private _lastTime = 0;
  private _adaptivePerformance: AdaptivePerformanceController | undefined;

  private readonly _resizeObserver: ResizeObserver | undefined;
  private readonly _onWindowResize: () => void;

  private constructor(options: RuntimeOptions) {
    this.context = new RuntimeContext(options);
    this.maxDeltaTime = options.maxDeltaTime ?? 1 / 15;

    this._onWindowResize = (): void => this._handleResize();
    window.addEventListener('resize', this._onWindowResize);
    if (typeof ResizeObserver !== 'undefined') {
      this._resizeObserver = new ResizeObserver(() => this._handleResize());
      this._resizeObserver.observe(this.context.canvas);
    }

    // Keep light shadow-map resolution / frustum in sync when quality changes.
    this.context.quality.events.on('settingsChanged', ({ settings }) => {
      this._syncAllLightShadows(settings);
    });
  }

  /**
   * Create a Runtime with the default system stack (Input, Gameplay, Physics,
   * Animation, Rendering). Physics WASM is loaded lazily only when PhysicsBodyComponents
   * are present in the scene.
   */
  static create(options: RuntimeOptions = {}): Runtime {
    const runtime = new Runtime(options);
    runtime.registerSystem(new InputSystem());
    runtime.registerSystem(new ScrollTriggerSystem());
    runtime.registerSystem(new LODSystem());
    runtime.registerSystem(new GameplaySystem());
    runtime.registerSystem(new MaterialSystem());
    runtime.registerSystem(new CameraPathSystem());
    runtime.registerSystem(new PhysicsSystem());
    runtime.registerSystem(new AudioSystem());
    runtime.registerSystem(new AnimationSystem());
    runtime.registerSystem(new ParticleSystem());
    runtime.registerSystem(new UISystem());
    runtime.registerSystem(new RenderingSystem());
    runtime._initAdaptivePerformance();
    return runtime;
  }

  /**
   * Adaptive quality / physics-rate controller. Enabled by default so heavy
   * editor scenes stay interactive; disable via {@link AdaptivePerformanceController.enabled}.
   */
  get adaptivePerformance(): AdaptivePerformanceController | undefined {
    return this._adaptivePerformance;
  }

  private _initAdaptivePerformance(): void {
    const physics = this.getSystem(PhysicsSystem);
    this._adaptivePerformance = new AdaptivePerformanceController(this.context.quality, {
      onPhysicsRateChange: (hz) => physics?.setSimulationRateHz(hz),
    });
  }

  /** True between `start()` and `stop()`. */
  get isRunning(): boolean {
    return this._running;
  }

  /** Iterable of currently active scenes. */
  get activeScenes(): ReadonlyArray<Scene> {
    return [...this._scenes].filter((s) => s.isActive);
  }

  /** Iterable of all loaded scenes (active or not). */
  get scenes(): ReadonlyArray<Scene> {
    return [...this._scenes];
  }

  /** Iterable of all registered systems. */
  get systems(): ReadonlyArray<System> {
    return this._systems;
  }

  /** Register a system. Systems are kept sorted by `priority` ascending. */
  registerSystem(system: System): void {
    this._systems.push(system);
    this._systems.sort((a, b) => a.priority - b.priority);
    system.onRegister?.(this);
  }

  /** Remove a previously-registered system. */
  unregisterSystem(system: System): void {
    const idx = this._systems.indexOf(system);
    if (idx < 0) return;
    this._systems.splice(idx, 1);
    system.onUnregister?.(this);
  }

  /** Look up a system by its class constructor. */
  getSystem<TSystem extends System>(ctor: new (...args: never[]) => TSystem): TSystem | undefined {
    return this._systems.find((s) => s instanceof ctor) as TSystem | undefined;
  }

  /** Load a scene: initializes it and activates it. */
  loadScene(scene: Scene): void {
    scene.runtime = this;
    this._scenes.add(scene);
    if (!scene.isInitialized) scene.init();
    scene.enter();
    this._applySceneQuality(scene);
    this._syncAllLightShadows(this.context.quality.getEffectiveSettings());
    this._handleResize();
    // Components may have run `onSceneAttach` before the scene had a runtime
    // (deserialize / starter construction). Re-fire so mesh/texture bindings,
    // animation players, and other runtime-dependent hooks can resolve.
    for (const actor of scene.actors) {
      for (const c of actor.components) c.onSceneAttach(scene);
    }
    this.events.emit('sceneActivated', { scene });
  }

  /** Deactivate and remove a scene from the runtime. */
  unloadScene(scene: Scene): void {
    if (!this._scenes.has(scene)) return;
    scene.exit();
    this._scenes.delete(scene);
    if (scene.runtime === this) scene.runtime = undefined;
    this.events.emit('sceneDeactivated', { scene });
  }

  /**
   * Register a nested sub-scene instantiated by a {@link SceneInstanceComponent}.
   * Nested scenes are processed by all systems (gameplay, physics, animation)
   * but skipped by the {@link RenderingSystem}; they are drawn as part of the
   * host scene because their `threeScene` is parented under the host actor.
   * Registration is appended after the host so update order stays
   * parent-before-child within a frame. See PRD 1 (Nested Scene System).
   */
  registerNestedScene(scene: Scene): void {
    if (this._scenes.has(scene)) return;
    scene.nested = true;
    scene.runtime = this;
    this._scenes.add(scene);
    if (!scene.isInitialized) scene.init();
    scene.enter();
    // The sub-scene was deserialized with no runtime bound, so its components'
    // initial `onSceneAttach` ran before opt-in systems (audio, particles,
    // physics) and nested SceneInstanceComponents could resolve the runtime.
    // Re-fire `onSceneAttach` now that the runtime and ancestor-id set are in
    // place so those components register and nested instances (and cycle
    // detection) take effect. Built-in components' `onSceneAttach` hooks are
    // re-entrant (system registration is set-based; asset bindings refresh).
    for (const actor of scene.actors) {
      for (const c of actor.components) c.onSceneAttach(scene);
    }
    this.events.emit('sceneActivated', { scene });
  }

  /** Unregister a previously {@link registerNestedScene}-d sub-scene. */
  unregisterNestedScene(scene: Scene): void {
    this.unloadScene(scene);
  }

  /** Begin the rAF loop. Safe to call multiple times. */
  start(): void {
    if (this._running) return;
    this._running = true;
    this._lastTime = performance.now();
    const tick = (now: number): void => {
      if (!this._running) return;
      const dtRaw = (now - this._lastTime) / 1000;
      this._lastTime = now;
      const dt = Math.min(dtRaw, this.maxDeltaTime);
      this._frame(dt);
      this._rafHandle = requestAnimationFrame(tick);
    };
    this._rafHandle = requestAnimationFrame(tick);
  }

  /** Halt the rAF loop. */
  stop(): void {
    if (!this._running) return;
    this._running = false;
    cancelAnimationFrame(this._rafHandle);
  }

  /** Tear down the runtime: stops, disposes scenes, releases GPU resources. */
  dispose(): void {
    this.stop();
    window.removeEventListener('resize', this._onWindowResize);
    this._resizeObserver?.disconnect();
    for (const s of [...this._systems]) this.unregisterSystem(s);
    for (const scene of [...this._scenes]) {
      scene.exit();
      scene.dispose();
      this._scenes.delete(scene);
    }
    this.context.dispose();
    this.events.clear();
  }

  /**
   * Manually advance one frame. Primarily useful in tests; the
   * production loop is driven by `requestAnimationFrame`.
   */
  step(dt: number): void {
    this._frame(dt);
  }

  /**
   * Override the camera used by the {@link RenderingSystem}. Intended for
   * the editor's free-flying viewport camera; exported sites should never
   * call this and will fall back to the scene's main camera.
   */
  setOverrideCamera(camera: THREE.Camera | null): void {
    this.getSystem(RenderingSystem)?.setOverrideCamera(camera);
  }

  /** Clear any editor override camera so scenes use their main camera. */
  clearOverrideCamera(): void {
    this.setOverrideCamera(null);
  }

  private _frame(dt: number): void {
    this.events.emit('beforeUpdate', { dt });
    for (const system of this._systems) system.onUpdate(dt);
    this.events.emit('afterUpdate', { dt });
    this._adaptivePerformance?.recordFrame(performance.now(), dt);
  }

  private _handleResize(): void {
    this.context.resize();
    const { width, height } = this.context.canvas.getBoundingClientRect();
    for (const scene of this._scenes) {
      const id = scene.mainCameraActorId;
      if (!id) continue;
      const camActor = scene.findActorById(id);
      camActor?.getComponent(CameraComponent)?.updateAspect(width, height);
    }
  }

  /** Apply a scene's `qualityPreset` override to the runtime's QualityManager. */
  private _applySceneQuality(scene: Scene): void {
    const preset = scene.settings.qualityPreset;
    if (!preset || preset === 'auto') return;
    this.context.quality.applyProfile(preset);
  }

  /** Push quality shadow settings onto every shadow-casting light in loaded scenes. */
  private _syncAllLightShadows(
    settings: ReturnType<Runtime['context']['quality']['getEffectiveSettings']>,
  ): void {
    for (const scene of this._scenes) {
      syncSceneLightShadows(scene.threeScene, settings);
      for (const actor of scene.actors) {
        actor.getComponent(LightComponent)?.syncShadowQuality();
      }
    }
  }
}
