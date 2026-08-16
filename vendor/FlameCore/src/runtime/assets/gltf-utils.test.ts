import { describe, expect, it } from 'vitest';
import * as THREE from 'three';
import {
  findGltfNodeByPath,
  listGltfNodePaths,
  suggestArticulationNodePaths,
} from './gltf-utils';

describe('gltf-utils', () => {
  it('lists named node paths', () => {
    const root = new THREE.Group();
    root.name = 'Root';
    const base = new THREE.Group();
    base.name = 'Base';
    const lid = new THREE.Group();
    lid.name = 'Screen';
    root.add(base, lid);
    base.position.set(0, 0, 0);
    lid.position.set(0, 1, 0);

    const paths = listGltfNodePaths(root);
    expect(paths).toContain('Base');
    expect(paths).toContain('Screen');
  });

  it('resolves paths and suggests hinge parts', () => {
    const root = new THREE.Group();
    const lid = new THREE.Group();
    lid.name = 'Laptop_Lid';
    root.add(lid);

    const path = listGltfNodePaths(root)[0];
    expect(findGltfNodeByPath(root, path)).toBe(lid);
    expect(suggestArticulationNodePaths([path]).length).toBe(1);
  });
});
