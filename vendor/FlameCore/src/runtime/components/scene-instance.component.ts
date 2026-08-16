import type { SerializedComponentProps } from '@shared/types';
import { BaseComponent } from '../scene/component';
import { deserializeScene } from '../scene/deserialize';
import type { Scene } from '../scene/scene';

/**
 * How a nested sub-scene is loaded relative to its host.
 *
 * - `embedded` — the sub-scene is instantiated immediately when the host
 *   actor enters its scene and stays resident for the host's lifetime.
 * - `streamed` — the sub-scene is only instantiated when explicitly
 *   activated (via {@link SceneInstanceComponent.loadInstance} or, when
 *   `autoActivateOnParentEnter` is set, when the host enters its scene) and
 *   can be unloaded again without destroying the host.
 */
export type SceneInstanceMode = 'embedded' | 'streamed';

/** Serialized {@link SceneInstanceComponent} properties (v1). */
export interface SceneInstanceProps extends SerializedComponentProps {
  readonly _version: 1;
  /** GUID of the child scene asset to instantiate. */
  sceneAssetId: string;
  /** Load strategy. See {@link SceneInstanceMode}. */
  mode: SceneInstanceMode;
  /** Whether the sub-scene uses the host scene's time scale (reserved). */
  inheritTimeScale: boolean;
  /** Whether the sub-scene participates in the host's input routing (reserved). */
  inheritInput: boolean;
  /** Auto-load streamed sub-scenes when the host actor enters its scene. */
  autoActivateOnParentEnter: boolean;
  /** Optional render-layer override; defaults to inheriting the host scene. */
  layerOverride?: number;
}

/** Default props factory for {@link SceneInstanceComponent}. */
export function makeSceneInstanceProps(
  patch: Partial<Omit<SceneInstanceProps, '_version'>> = {},
): SceneInstanceProps {
  const out: SceneInstanceProps = {
    _version: 1,
    sceneAssetId: patch.sceneAssetId ?? '',
    mode: patch.mode ?? 'embedded',
    inheritTimeScale: patch.inheritTimeScale ?? true,
    inheritInput: patch.inheritInput ?? true,
    autoActivateOnParentEnter: patch.autoActivateOnParentEnter ?? true,
  };
  if (patch.layerOverride !== undefined) out.layerOverride = patch.layerOverride;
  return out;
}

/**
 * Instantiates another scene asset as a nested sub-scene at this actor's
 * transform. The sub-scene's `threeScene` is parented under the host actor's
 * `Object3D`, so it inherits the host's world transform and is rendered as
 * part of the host scene. The sub-scene is registered with the runtime as a
 * {@link Scene} flagged `nested`, so every engine system (gameplay, physics,
 * animation) still processes its actors.
 *
 * Cyclic nesting is prevented: if a scene asset already appears in the host's
 * ancestor chain, instantiation is refused and a warning is logged. See
 * PRD 1 (Nested Scene System).
 */
export class SceneInstanceComponent extends BaseComponent<SceneInstanceProps> {
  static readonly typeName = 'SceneInstanceComponent';

  private _hostScene: Scene | undefined;
  private _instance: Scene | undefined;

  /** The currently-loaded sub-scene instance, if any. */
  get instance(): Scene | undefined {
    return this._instance;
  }

  /** True while a sub-scene is loaded and active. */
  get isLoaded(): boolean {
    return this._instance !== undefined;
  }

  onSceneAttach(scene: Scene): void {
    super.onSceneAttach(scene);
    this._hostScene = scene;
    const shouldAutoLoad =
      this._props.mode === 'embedded' || this._props.autoActivateOnParentEnter;
    if (shouldAutoLoad) this.loadInstance();
  }

  onSceneDetach(scene: Scene): void {
    this.unloadInstance();
    this._hostScene = undefined;
    super.onSceneDetach(scene);
  }

  onDetach(): void {
    this.unloadInstance();
    this._hostScene = undefined;
    super.onDetach();
  }

  protected onPropsChanged(): void {
    // Rebuild on any prop change so a new sceneAssetId / mode takes effect.
    const wasLoaded = this.isLoaded;
    this.unloadInstance();
    if (wasLoaded || this._props.mode === 'embedded') this.loadInstance();
  }

  /**
   * Instantiate and activate the referenced sub-scene. No-op if already
   * loaded, if no `sceneAssetId` is set, or if the host has no runtime.
   * Degrades gracefully (logs a warning, renders nothing) when the scene
   * cannot be resolved or would create a cycle.
   */
  loadInstance(): void {
    if (this._instance || !this._actor || !this._hostScene) return;
    const { sceneAssetId } = this._props;
    if (!sceneAssetId) return;

    const runtime = this._hostScene.runtime;
    if (!runtime) return;

    if (this._hostScene._ancestorAssetIds.has(sceneAssetId)) {
      console.warn(
        `[SceneInstanceComponent] Refusing to instantiate scene "${sceneAssetId}": ` +
          'cyclic nesting detected.',
      );
      return;
    }

    const resolver = runtime.sceneResolver;
    if (!resolver) {
      console.warn(
        '[SceneInstanceComponent] No sceneResolver set on the runtime; ' +
          `cannot instantiate nested scene "${sceneAssetId}".`,
      );
      return;
    }

    const serialized = resolver(sceneAssetId);
    if (!serialized) {
      console.warn(
        `[SceneInstanceComponent] Scene asset "${sceneAssetId}" could not be resolved; ` +
          'the host scene continues without it.',
      );
      return;
    }

    let sub: Scene;
    try {
      sub = deserializeScene(serialized);
    } catch (err) {
      console.warn(
        `[SceneInstanceComponent] Failed to deserialize scene "${sceneAssetId}":`,
        err,
      );
      return;
    }

    sub.nested = true;
    sub._ancestorAssetIds = new Set<string>([
      ...this._hostScene._ancestorAssetIds,
      sceneAssetId,
    ]);
    if (this._props.layerOverride !== undefined) {
      sub.renderOrder = this._props.layerOverride;
    }

    // Parent the sub-scene's Three.js root under the host actor so it
    // inherits the host transform and is drawn during the host's render pass.
    this._actor.object3D.add(sub.threeScene);

    this._instance = sub;
    runtime.registerNestedScene(sub);
  }

  /** Deactivate, detach, and dispose the loaded sub-scene. No-op if none. */
  unloadInstance(): void {
    const sub = this._instance;
    if (!sub) return;
    this._instance = undefined;

    const runtime = sub.runtime ?? this._hostScene?.runtime;
    runtime?.unregisterNestedScene(sub);

    if (this._actor) this._actor.object3D.remove(sub.threeScene);
    sub.dispose();
  }
}
