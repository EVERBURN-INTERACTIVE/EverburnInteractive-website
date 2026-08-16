/**
 * Convert THREE.GLTF embedded animations into FlameCore {@link AnimationClip}s.
 * @module @runtime/assets/gltf-animation-import
 */

import * as THREE from 'three';
import type { AnimationClip, AnimationTrack, EasingPreset, Keyframe } from '@shared/types/animation';
import { createAnimationClip, createAnimationTrack, createKeyframe } from './animation-clip';
import { AnimatablePropertyRegistry } from '../utils/animatable-property-registry';
import { listGltfNodePaths } from './gltf-utils';
import {
  encodeMorphStorageKey,
  morphAnimatablePropertyPath,
  parseMorphTrackName,
} from './gltf-morph-utils';
import type { AssetId } from './types';

/** Maps a GLTF node name to the FlameCore actor id that represents it. */
export type GltfActorBindingMap = Readonly<Record<string, string>>;

/** Options for {@link importGltfAnimations}. */
export interface ImportGltfAnimationsOptions {
  /** THREE clips from `gltf.animations`. */
  clips: ReadonlyArray<THREE.AnimationClip>;
  /** Node name → actor id for track targeting. */
  actorByNodeName: GltfActorBindingMap;
  /** Optional name prefix for generated clip assets. */
  namePrefix?: string;
}

/** Options for {@link importGltfAnimationsAsLibraryClips}. */
export interface ImportGltfLibraryClipsOptions {
  clips: ReadonlyArray<THREE.AnimationClip>;
  meshAssetId: AssetId;
  nodePaths: ReadonlyArray<string>;
  namePrefix?: string;
}

/** Result of library clip import for asset persistence. */
export interface GltfLibraryClipResult {
  readonly clip: AnimationClip;
  readonly assetName: string;
}

const PROPERTY_MAP: Readonly<
  Record<string, { component: string; property: string; valueType: 'number' | 'vec3' }>
> = {
  position: { component: 'TransformComponent', property: 'position', valueType: 'vec3' },
  rotation: { component: 'TransformComponent', property: 'rotation', valueType: 'vec3' },
  scale: { component: 'TransformComponent', property: 'scale', valueType: 'vec3' },
};

/**
 * Import GLTF animation clips as FlameCore clips bound to actor ids.
 * Quaternion rotation tracks are converted to Euler radians.
 */
export function importGltfAnimations(options: ImportGltfAnimationsOptions): AnimationClip[] {
  const prefix = options.namePrefix ?? 'GLTF';
  const out: AnimationClip[] = [];

  for (const threeClip of options.clips) {
    const tracks: AnimationTrack[] = [];
    for (const track of threeClip.tracks) {
      const morphParsed = parseMorphTrackName(track.name);
      if (morphParsed) {
        const actorId = options.actorByNodeName[morphParsed.nodeName];
        if (!actorId) continue;
        const built = buildMorphFlameCoreTrack(track, morphParsed, actorId, morphParsed.nodeName);
        if (built) tracks.push(built);
        continue;
      }
      const parsed = parseThreeTrackName(track.name);
      if (!parsed) continue;
      const actorId = options.actorByNodeName[parsed.nodeName];
      if (!actorId) continue;
      const built = buildFlameCoreTrack(track, parsed, actorId, parsed.nodeName);
      if (built) tracks.push(built);
    }

    if (tracks.length === 0) continue;
    out.push(
      createAnimationClip({
        name: `${prefix} / ${threeClip.name || 'Animation'}`,
        duration: threeClip.duration,
        tracks,
        tags: ['gltf-import'],
      }),
    );
  }

  return out;
}

/**
 * Import GLTF clips as node-path library clips (no actor ids yet).
 * Tracks carry `targetGltfNodePath` for {@link AnimationSystem} to resolve
 * against a {@link MeshRendererComponent} on the playing actor.
 */
export function importGltfAnimationsAsLibraryClips(
  options: ImportGltfLibraryClipsOptions,
): GltfLibraryClipResult[] {
  const prefix = options.namePrefix ?? options.meshAssetId;
  const nodePathByLeaf = buildLeafPathMap(options.nodePaths);
  const out: GltfLibraryClipResult[] = [];

  for (const threeClip of options.clips) {
    const tracks: AnimationTrack[] = [];
    for (const track of threeClip.tracks) {
      const morphParsed = parseMorphTrackName(track.name);
      if (morphParsed) {
        const nodePath = nodePathByLeaf.get(morphParsed.nodeName);
        if (!nodePath) continue;
        const built = buildMorphFlameCoreTrack(
          track,
          morphParsed,
          '',
          morphParsed.nodeName,
          nodePath,
        );
        if (built) tracks.push(built);
        continue;
      }
      const parsed = parseThreeTrackName(track.name);
      if (!parsed) continue;
      const nodePath = nodePathByLeaf.get(parsed.nodeName);
      if (!nodePath) continue;
      const built = buildFlameCoreTrack(track, parsed, '', parsed.nodeName, nodePath);
      if (built) tracks.push(built);
    }
    if (tracks.length === 0) continue;
    const clipName = `${prefix} / ${threeClip.name || 'Animation'}`;
    out.push({
      assetName: `${clipName}.clip`,
      clip: createAnimationClip({
        name: clipName,
        duration: threeClip.duration,
        tracks,
        tags: ['gltf-library', `mesh:${options.meshAssetId}`],
      }),
    });
  }

  return out;
}

function buildFlameCoreTrack(
  track: THREE.KeyframeTrack,
  parsed: { nodeName: string; property: 'position' | 'rotation' | 'scale' },
  targetActorId: string,
  targetActorName: string,
  targetGltfNodePath?: string,
): AnimationTrack | undefined {
  const mapping = PROPERTY_MAP[parsed.property];
  if (!mapping) return undefined;

  const descriptor = AnimatablePropertyRegistry.get(mapping.component, mapping.property);
  if (!descriptor) return undefined;

  const keyframes = threeKeyframesToFlameCore(track, mapping.valueType, parsed.property);
  if (keyframes.length === 0) return undefined;

  const created = createAnimationTrack({
    targetActorId,
    targetActorName,
    descriptor,
    keyframes,
  });
  if (targetGltfNodePath) {
    return { ...created, targetGltfNodePath };
  }
  return created;
}

function buildMorphFlameCoreTrack(
  track: THREE.KeyframeTrack,
  parsed: { nodeName: string; morphKey: string },
  targetActorId: string,
  targetActorName: string,
  targetGltfNodePath?: string,
): AnimationTrack | undefined {
  const nodePath = targetGltfNodePath ?? '';
  const storageKey = encodeMorphStorageKey(nodePath, parsed.morphKey);
  const propertyPath = morphAnimatablePropertyPath(storageKey);
  const keyframes = threeNumberKeyframesToFlameCore(track);
  if (keyframes.length === 0) return undefined;

  const created = createAnimationTrack({
    targetActorId,
    targetActorName,
    descriptor: {
      componentType: 'MeshRendererComponent',
      propertyPath,
      valueType: 'number',
      label: `Morph: ${parsed.morphKey}`,
      min: 0,
      max: 1,
    },
    keyframes,
  });
  if (targetGltfNodePath) {
    return { ...created, targetGltfNodePath };
  }
  return created;
}

function buildLeafPathMap(nodePaths: ReadonlyArray<string>): Map<string, string> {
  const map = new Map<string, string>();
  for (const path of nodePaths) {
    const leaf = path.split('/').pop() ?? path;
    const base = leaf.replace(/#\d+$/, '');
    if (!map.has(base)) map.set(base, path);
    map.set(leaf, path);
  }
  return map;
}

function parseThreeTrackName(
  name: string,
): { nodeName: string; property: 'position' | 'rotation' | 'scale' } | undefined {
  const parts = name.split('.');
  if (parts.length < 2) return undefined;
  let property = parts[parts.length - 1] as 'position' | 'rotation' | 'scale' | 'quaternion';
  if (property === 'quaternion') property = 'rotation';
  if (property !== 'position' && property !== 'rotation' && property !== 'scale') return undefined;
  const nodeName = parts[parts.length - 2];
  return nodeName ? { nodeName, property } : undefined;
}

function threeKeyframesToFlameCore(
  track: THREE.KeyframeTrack,
  valueType: 'number' | 'vec3',
  property: 'position' | 'rotation' | 'scale',
): Keyframe[] {
  const times = track.times;
  const values = track.values;
  const easing: EasingPreset = 'linear';
  const keyframes: Keyframe[] = [];

  const valueSize = track.getValueSize();
  const isQuaternionRotation = property === 'rotation' && valueSize === 4;

  for (let i = 0; i < times.length; i++) {
    const t = times[i];
    const base = i * valueSize;
    let value: Keyframe['value'];

    if (isQuaternionRotation) {
      const quat = new THREE.Quaternion(
        values[base] ?? 0,
        values[base + 1] ?? 0,
        values[base + 2] ?? 0,
        values[base + 3] ?? 1,
      );
      const euler = new THREE.Euler().setFromQuaternion(quat, 'XYZ');
      value = [euler.x, euler.y, euler.z];
    } else if (valueType === 'vec3' || valueSize === 3) {
      value = [values[base] ?? 0, values[base + 1] ?? 0, values[base + 2] ?? 0];
    } else {
      value = values[base] ?? 0;
    }

    keyframes.push(createKeyframe({ time: t, value, easing }));
  }

  return keyframes;
}

function threeNumberKeyframesToFlameCore(track: THREE.KeyframeTrack): Keyframe[] {
  const times = track.times;
  const values = track.values;
  const easing: EasingPreset = 'linear';
  const keyframes: Keyframe[] = [];
  const valueSize = track.getValueSize();
  for (let i = 0; i < times.length; i++) {
    const t = times[i];
    const base = i * valueSize;
    keyframes.push(createKeyframe({ time: t, value: values[base] ?? 0, easing }));
  }
  return keyframes;
}

/** Build library clips from a parsed GLTF buffer (editor import helper). */
export function importGltfLibraryFromScene(
  scene: THREE.Object3D,
  animations: ReadonlyArray<THREE.AnimationClip>,
  meshAssetId: AssetId,
): GltfLibraryClipResult[] {
  return importGltfAnimationsAsLibraryClips({
    clips: animations,
    meshAssetId,
    nodePaths: listGltfNodePaths(scene),
    namePrefix: meshAssetId,
  });
}
