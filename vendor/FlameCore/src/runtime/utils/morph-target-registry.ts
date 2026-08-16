/**
 * Per-actor morph target descriptors for timeline authoring.
 * Populated when a GLTF mesh resolves in the editor.
 *
 * @module @runtime/utils/morph-target-registry
 */

import type { AnimatablePropertyDescriptor } from '@shared/types/animation';
import type { GltfMorphTargetInfo } from '../assets/gltf-morph-utils';
import {
  encodeMorphStorageKey,
  morphAnimatablePropertyPath,
} from '../assets/gltf-morph-utils';

/** Morph descriptor with optional GLTF node path for library playback. */
export interface MorphAnimatableDescriptor extends AnimatablePropertyDescriptor {
  readonly gltfNodePath?: string;
  readonly morphStorageKey: string;
}

class MorphRegistry {
  private readonly _byActor = new Map<string, MorphAnimatableDescriptor[]>();

  /** Replace morph descriptors for an actor (typically after GLTF load). */
  sync(actorId: string, morphs: ReadonlyArray<GltfMorphTargetInfo>): void {
    const descriptors = morphs.map((info) => this._toDescriptor(info));
    if (descriptors.length === 0) this._byActor.delete(actorId);
    else this._byActor.set(actorId, descriptors);
  }

  clear(actorId: string): void {
    this._byActor.delete(actorId);
  }

  list(actorId: string): ReadonlyArray<MorphAnimatableDescriptor> {
    return this._byActor.get(actorId) ?? [];
  }

  get(
    actorId: string,
    componentType: string,
    propertyPath: string,
  ): MorphAnimatableDescriptor | undefined {
    if (componentType !== 'MeshRendererComponent') return undefined;
    return this._byActor.get(actorId)?.find((d) => d.propertyPath === propertyPath);
  }

  private _toDescriptor(info: GltfMorphTargetInfo): MorphAnimatableDescriptor {
    const storageKey = encodeMorphStorageKey(info.nodePath, info.morphName);
    const leaf = info.nodePath.split('/').pop() ?? info.nodePath;
    const label = info.nodePath ? `Morph: ${info.morphName} (${leaf})` : `Morph: ${info.morphName}`;
    return {
      componentType: 'MeshRendererComponent',
      propertyPath: morphAnimatablePropertyPath(storageKey),
      valueType: 'number',
      label,
      min: 0,
      max: 1,
      gltfNodePath: info.nodePath || undefined,
      morphStorageKey: storageKey,
    };
  }
}

/** Process-wide morph descriptor registry (editor + runtime validation). */
export const MorphTargetAnimatableRegistry = new MorphRegistry();
