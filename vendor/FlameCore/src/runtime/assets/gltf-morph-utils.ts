/**
 * GLTF morph-target discovery and influence application.
 * @module @runtime/assets/gltf-morph-utils
 */

import * as THREE from 'three';
import { findGltfNodeByPath } from './gltf-utils';

/** Separator between node path and morph name in storage / property keys. */
export const MORPH_KEY_SEP = '::';

/** One morph target on a mesh inside a GLTF hierarchy. */
export interface GltfMorphTargetInfo {
  /** Slash-separated path from the GLTF root to the mesh node. */
  readonly nodePath: string;
  /** Morph target name from the asset (or `morph_${index}` when unnamed). */
  readonly morphName: string;
  /** Index in `THREE.Mesh.morphTargetInfluences`. */
  readonly index: number;
}

/**
 * Stable key for {@link MeshRendererProps.morphInfluences} and animation
 * property paths (`morph.{key}`).
 */
export function encodeMorphStorageKey(nodePath: string, morphName: string): string {
  const path = nodePath.trim();
  const name = morphName.trim();
  if (!path) return name;
  return `${path}${MORPH_KEY_SEP}${name}`;
}

/** Decode a morph storage key back into node path + morph name. */
export function decodeMorphStorageKey(key: string): { nodePath: string; morphName: string } {
  const sep = key.indexOf(MORPH_KEY_SEP);
  if (sep < 0) return { nodePath: '', morphName: key };
  return {
    nodePath: key.slice(0, sep),
    morphName: key.slice(sep + MORPH_KEY_SEP.length),
  };
}

/** Property path segment used by animation tracks (`morph.{storageKey}`). */
export function morphAnimatablePropertyPath(storageKey: string): string {
  return `morph.${storageKey}`;
}

/** List every morph target under a GLTF root. */
export function listGltfMorphTargets(root: THREE.Object3D): GltfMorphTargetInfo[] {
  const out: GltfMorphTargetInfo[] = [];
  root.traverse((obj) => {
    if (!(obj instanceof THREE.Mesh)) return;
    const mesh = obj;
    const influences = mesh.morphTargetInfluences;
    if (!influences || influences.length === 0) return;
    const nodePath = buildPathFromRoot(root, obj);
    const dict = mesh.morphTargetDictionary ?? {};
    const namesByIndex = invertMorphDictionary(dict);
    for (let i = 0; i < influences.length; i++) {
      const morphName = namesByIndex.get(i) ?? `morph_${i}`;
      out.push({ nodePath, morphName, index: i });
    }
  });
  return out.sort((a, b) =>
    `${a.nodePath}|${a.morphName}`.localeCompare(`${b.nodePath}|${b.morphName}`),
  );
}

/**
 * Apply a morph weight on the mesh at `nodePath` (or on descendant meshes when
 * `node` is a group). `morphKey` may be a morph name or numeric index string.
 */
export function applyMorphInfluence(
  root: THREE.Object3D,
  nodePath: string,
  morphKey: string,
  influence: number,
): boolean {
  const node = nodePath.trim() ? findGltfNodeByPath(root, nodePath) : root;
  if (!node) return false;
  let applied = false;
  const visit = (obj: THREE.Object3D): void => {
    if (obj instanceof THREE.Mesh && applyMorphToMesh(obj, morphKey, influence)) {
      applied = true;
    }
    for (const child of obj.children) visit(child);
  };
  visit(node);
  return applied;
}

/** Apply a morph weight on every mesh under `root` that exposes `morphKey`. */
export function applyMorphInfluenceOnSubtree(
  root: THREE.Object3D,
  morphKey: string,
  influence: number,
): boolean {
  let applied = false;
  root.traverse((obj) => {
    if (!(obj instanceof THREE.Mesh)) return;
    if (applyMorphToMesh(obj, morphKey, influence)) applied = true;
  });
  return applied;
}

/** Parse THREE morph keyframe track names such as `Cube.morphTargetInfluences[0]`. */
export function parseMorphTrackName(
  trackName: string,
): { nodeName: string; morphKey: string } | undefined {
  const match = /^(.+)\.morphTargetInfluences\[(.+)\]$/.exec(trackName.trim());
  if (!match) return undefined;
  const nodeName = match[1]?.trim();
  const morphKey = match[2]?.trim();
  if (!nodeName || morphKey === undefined || morphKey === '') return undefined;
  return { nodeName, morphKey };
}

function applyMorphToMesh(mesh: THREE.Mesh, morphKey: string, influence: number): boolean {
  const influences = mesh.morphTargetInfluences;
  if (!influences || influences.length === 0) return false;
  const idx = resolveMorphIndex(morphKey, mesh.morphTargetDictionary, influences.length);
  if (idx < 0 || idx >= influences.length) return false;
  influences[idx] = influence;
  return true;
}

function resolveMorphIndex(
  morphKey: string,
  dictionary: Record<string, number> | undefined,
  length: number,
): number {
  if (dictionary && morphKey in dictionary) return dictionary[morphKey]!;
  const asNum = Number(morphKey);
  if (Number.isInteger(asNum) && asNum >= 0 && asNum < length) return asNum;
  return -1;
}

function invertMorphDictionary(dict: Record<string, number>): Map<number, string> {
  const map = new Map<number, string>();
  for (const [name, index] of Object.entries(dict)) {
    map.set(index, name);
  }
  return map;
}

function buildPathFromRoot(root: THREE.Object3D, obj: THREE.Object3D): string {
  const segments: string[] = [];
  let current: THREE.Object3D | null = obj;
  while (current && current !== root) {
    segments.unshift(segmentLabel(current));
    current = current.parent;
  }
  return segments.join('/');
}

function segmentLabel(obj: THREE.Object3D): string {
  const name = obj.name.trim();
  const parent = obj.parent;
  if (!parent) return name;
  const siblings = parent.children.filter((c) => c.name.trim() === name);
  if (siblings.length <= 1) return name;
  const idx = siblings.indexOf(obj);
  return idx <= 0 ? name : `${name}#${idx}`;
}
