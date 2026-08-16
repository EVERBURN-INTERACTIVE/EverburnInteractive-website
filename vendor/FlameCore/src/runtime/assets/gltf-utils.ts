/**
 * GLTF hierarchy helpers for articulated product workflows.
 * @module @runtime/assets/gltf-utils
 */

import * as THREE from 'three';

/** Parsed GLTF payload used by loaders and the editor. */
export interface ParsedGltf {
  readonly scene: THREE.Object3D;
  readonly animations: ReadonlyArray<THREE.AnimationClip>;
  readonly nodePaths: ReadonlyArray<string>;
}

const PATH_SEP = '/';

/**
 * List slash-separated paths for every named node in a GLTF scene subtree.
 * Unnamed nodes are skipped; duplicate sibling names use `#index` suffixes.
 */
export function listGltfNodePaths(root: THREE.Object3D): string[] {
  const paths: string[] = [];
  root.traverse((obj) => {
    if (obj === root) return;
    if (!obj.name.trim()) return;
    paths.push(buildNodePath(root, obj));
  });
  return paths.sort((a, b) => a.localeCompare(b));
}

/** Resolve a slash-separated path under `root`. Returns undefined when missing. */
export function findGltfNodeByPath(root: THREE.Object3D, nodePath: string): THREE.Object3D | undefined {
  const trimmed = nodePath.trim();
  if (!trimmed) return undefined;
  const parts = trimmed.split(PATH_SEP).filter(Boolean);
  let current: THREE.Object3D = root;
  for (const part of parts) {
    const match = resolveChildBySegment(current, part);
    if (!match) return undefined;
    current = match;
  }
  return current === root ? undefined : current;
}

/**
 * Reparent `node` under `newParent` while preserving world transform.
 * The node's local matrix is rewritten relative to the new parent.
 */
export function reparentNodePreserveWorld(node: THREE.Object3D, newParent: THREE.Object3D): void {
  node.updateWorldMatrix(true, false);
  newParent.updateWorldMatrix(true, false);
  const worldMatrix = node.matrixWorld.clone();
  const parentInv = newParent.matrixWorld.clone().invert();
  const localMatrix = worldMatrix.premultiply(parentInv);
  localMatrix.decompose(node.position, node.quaternion, node.scale);
  newParent.add(node);
}

/** Copy world TRS from `source` into `target` as local TRS relative to `target.parent`. */
export function applyWorldTransformToObject3D(source: THREE.Object3D, target: THREE.Object3D): void {
  source.updateWorldMatrix(true, false);
  const worldPos = new THREE.Vector3();
  const worldQuat = new THREE.Quaternion();
  const worldScale = new THREE.Vector3();
  source.matrixWorld.decompose(worldPos, worldQuat, worldScale);

  if (target.parent) {
    target.parent.updateWorldMatrix(true, false);
    const parentPos = new THREE.Vector3();
    const parentQuat = new THREE.Quaternion();
    const parentScale = new THREE.Vector3();
    target.parent.matrixWorld.decompose(parentPos, parentQuat, parentScale);
    const invParentQuat = parentQuat.clone().invert();
    worldPos.sub(parentPos);
    worldPos.applyQuaternion(invParentQuat);
    worldQuat.premultiply(invParentQuat);
    if (parentScale.x !== 0 && parentScale.y !== 0 && parentScale.z !== 0) {
      worldScale.divide(parentScale);
    }
  }

  target.position.copy(worldPos);
  target.quaternion.copy(worldQuat);
  target.scale.copy(worldScale);
}

/** Heuristic: nodes that look like mechanical parts worth articulating. */
export function suggestArticulationNodePaths(paths: ReadonlyArray<string>): string[] {
  const hints = /lid|screen|clasp|hinge|door|cover|flap|fold|top|base|body|case|band/i;
  return paths.filter((p) => hints.test(p));
}

let _parseLoader:
  | import('three/examples/jsm/loaders/GLTFLoader.js').GLTFLoader
  | undefined;

/**
 * Parse a GLTF/GLB buffer in the browser (editor import, tooling).
 * Lazily constructs a GLTFLoader with DRACO support.
 */
export async function parseGltfBuffer(buffer: ArrayBuffer): Promise<ParsedGltf> {
  const loader = await _getParseLoader();
  const gltf = await loader.parseAsync(buffer, '');
  const scene = gltf.scene;
  return {
    scene,
    animations: gltf.animations ?? [],
    nodePaths: listGltfNodePaths(scene),
  };
}

async function _getParseLoader(): Promise<
  import('three/examples/jsm/loaders/GLTFLoader.js').GLTFLoader
> {
  if (_parseLoader) return _parseLoader;
  const [gltfMod, dracoMod] = await Promise.all([
    import('three/examples/jsm/loaders/GLTFLoader.js'),
    import('three/examples/jsm/loaders/DRACOLoader.js'),
  ]);
  const loader = new gltfMod.GLTFLoader();
  const draco = new dracoMod.DRACOLoader();
  draco.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');
  loader.setDRACOLoader(draco);
  _parseLoader = loader;
  return loader;
}

function buildNodePath(root: THREE.Object3D, obj: THREE.Object3D): string {
  const segments: string[] = [];
  let current: THREE.Object3D | null = obj;
  while (current && current !== root) {
    segments.unshift(segmentLabel(current));
    current = current.parent;
  }
  return segments.join(PATH_SEP);
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

function resolveChildBySegment(parent: THREE.Object3D, segment: string): THREE.Object3D | undefined {
  const hash = segment.indexOf('#');
  const base = hash >= 0 ? segment.slice(0, hash) : segment;
  const occurrence = hash >= 0 ? Number(segment.slice(hash + 1)) : 0;
  if (!base.trim() || !Number.isFinite(occurrence)) return undefined;
  const matches = parent.children.filter((c) => c.name.trim() === base);
  return matches[occurrence];
}
