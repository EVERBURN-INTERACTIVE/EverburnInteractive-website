import type { AssetDatabase } from './assets/asset-database';
import type { SerializedScene } from './scene/scene';
import type { Runtime } from './runtime';
import type { ParticleSystemAsset } from './particles/types';

/** Options for {@link wireRuntimeResolvers}. */
export interface WireRuntimeResolversOptions {
  /** Serialized scenes indexed by id for nested scene resolution. */
  scenes?: ReadonlyArray<SerializedScene>;
  /** Live scene accessor (editor); takes precedence over `scenes`. */
  getScenes?: () => ReadonlyArray<SerializedScene>;
  /** Project asset database for particle-system inline assets. */
  assetDatabase: AssetDatabase;
}

function resolveScenes(options: WireRuntimeResolversOptions): ReadonlyArray<SerializedScene> {
  return options.getScenes?.() ?? options.scenes ?? [];
}

/**
 * Connect host project data to runtime resolvers used by
 * {@link SceneInstanceComponent} and {@link ParticleSystemComponent}.
 */
export function wireRuntimeResolvers(
  runtime: Runtime,
  options: WireRuntimeResolversOptions,
): void {
  runtime.setSceneResolver((sceneAssetId) => {
    const scenes = resolveScenes(options);
    return scenes.find((s) => s.id === sceneAssetId);
  });

  runtime.setParticleResolver((particleSystemAssetId) => {
    const record = options.assetDatabase.get(particleSystemAssetId);
    if (!record || record.type !== 'particle-system') return undefined;
    return record.inline as ParticleSystemAsset | undefined;
  });
}
