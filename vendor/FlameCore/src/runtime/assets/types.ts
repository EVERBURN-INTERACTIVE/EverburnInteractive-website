/**
 * Asset & VFS type definitions used by the runtime and editor.
 *
 * These types are deliberately serialization-friendly (no live Three.js
 * references); a separate {@link AssetLoader} resolves them to GPU-backed
 * objects on demand.
 */
import type { SerializedActor } from '../scene/actor';

/** Kinds of assets the engine knows how to manage. */
export type AssetType =
  | 'mesh'
  | 'texture'
  | 'material'
  | 'audio'
  | 'prefab'
  | 'animation-clip'
  | 'font'
  | 'particle-system';

/** Brandless GUID alias used for asset references. */
export type AssetId = string;

/** Logical folder in the project's virtual file system. */
export interface VfsFolder {
  /** Logical path like `/Meshes` or `/Textures/UI`. Always starts with `/`. */
  readonly path: string;
}

/** Default top-level folders created for every new project. */
export const DEFAULT_VFS_FOLDERS: ReadonlyArray<VfsFolder> = [
  { path: '/Scenes' },
  { path: '/Meshes' },
  { path: '/Textures' },
  { path: '/Materials' },
  { path: '/Audio' },
  { path: '/Fonts' },
  { path: '/Prefabs' },
  { path: '/Animations' },
  { path: '/Particles' },
];

/** Type-specific metadata stored on an {@link AssetRecord}. */
export interface AssetMetaByType {
  mesh: {
    /** Source GLTF / GLB file name. */
    sourceFile?: string;
    /** MIME type of the stored blob. */
    mimeType?: string;
    /** Original byte size. */
    sizeBytes?: number;
    /** Child asset ids extracted from the source (animations, materials). */
    childAssetIds?: ReadonlyArray<AssetId>;
    /** Named node paths inside the GLTF scene (for part binding UI). */
    nodePaths?: ReadonlyArray<string>;
    /** Embedded GLTF animation clip names, if any. */
    animationNames?: ReadonlyArray<string>;
    /** Count of embedded GLTF animations. */
    animationCount?: number;
    /** Morph targets discovered during import (for inspector / timeline). */
    morphTargets?: ReadonlyArray<{
      nodePath: string;
      morphName: string;
      index: number;
    }>;
  };
  texture: {
    sourceFile?: string;
    mimeType?: string;
    sizeBytes?: number;
    width?: number;
    height?: number;
    /** Optional data-URL thumbnail. */
    thumbnail?: string;
  };
  material: {
    /** Inline color/metalness/roughness/etc. */
    color?: readonly [number, number, number];
    metalness?: number;
    roughness?: number;
    /** Texture asset references. */
    baseColorTextureId?: AssetId;
    normalTextureId?: AssetId;
  };
  audio: {
    sourceFile?: string;
    mimeType?: string;
    sizeBytes?: number;
    durationSec?: number;
  };
  prefab: {
    /** Number of actors in the prefab subtree. */
    actorCount?: number;
  };
  'animation-clip': {
    sourceMeshAssetId?: AssetId;
    durationSec?: number;
  };
  font: {
    sourceFile?: string;
    mimeType?: string;
    sizeBytes?: number;
    /** The CSS font-family name registered via FontFace API. */
    family?: string;
    /** Font weight (e.g., 'normal', 'bold', '400', '700'). */
    weight?: string;
    /** Font style ('normal' | 'italic'). */
    style?: string;
  };
  'particle-system': {
    /** Number of emitters in the inline asset. */
    emitterCount?: number;
  };
}

/**
 * A serialized asset entry. Asset binary data (blobs) is stored separately
 * via a {@link BlobStore}; this record only holds JSON-safe metadata + the
 * pointer to where the blob lives.
 */
export interface SerializedAssetRecord<TType extends AssetType = AssetType> {
  readonly id: AssetId;
  readonly type: TType;
  name: string;
  /** Logical path in the VFS (e.g., `/Meshes/spaceship.glb`). */
  path: string;
  /**
   * Inline payload for assets that fit in JSON (prefabs, materials,
   * animation clips). Binary assets use the external `BlobStore` keyed by
   * `id` instead.
   */
  inline?: unknown;
  /** Type-specific metadata. */
  meta: AssetMetaByType[TType];
  /** Wall-clock millis the asset was created. */
  createdAt: number;
  /** Wall-clock millis the asset was last modified. */
  updatedAt: number;
  /** Asset schema version. */
  readonly _version: 1;
}

/** Convenience aliases. */
export type MeshAssetRecord = SerializedAssetRecord<'mesh'>;
export type TextureAssetRecord = SerializedAssetRecord<'texture'>;
export type MaterialAssetRecord = SerializedAssetRecord<'material'>;
export type AudioAssetRecord = SerializedAssetRecord<'audio'>;
export type PrefabAssetRecord = SerializedAssetRecord<'prefab'>;
export type AnimationClipAssetRecord = SerializedAssetRecord<'animation-clip'>;
export type FontAssetRecord = SerializedAssetRecord<'font'>;
export type ParticleSystemAssetRecord = SerializedAssetRecord<'particle-system'>;

/**
 * Serialized form of a prefab. Stored in
 * `SerializedAssetRecord<'prefab'>.inline`.
 *
 * The first entry in `actors` is the root; any other entries are children
 * (resolved by `parentId`).
 */
export interface PrefabDescriptor {
  readonly id: AssetId;
  readonly name: string;
  readonly actors: ReadonlyArray<SerializedActor>;
  readonly _version: 1;
}

/**
 * Editor-side per-instance override applied to a prefab actor.
 * `actorPath` is a `/`-separated list of child indices from the prefab root
 * (`""` = root, `"0"` = first child, `"0/2"` = child 2 of child 0).
 */
export interface PrefabOverride {
  actorPath: string;
  componentType: string;
  patch: Record<string, unknown>;
}
