import { describe, expect, it } from 'vitest';
import * as THREE from 'three';
import {
  applyMorphInfluence,
  encodeMorphStorageKey,
  decodeMorphStorageKey,
  listGltfMorphTargets,
  morphAnimatablePropertyPath,
  parseMorphTrackName,
} from './gltf-morph-utils';

function meshWithMorph(name: string): THREE.Mesh {
  const base = new THREE.BoxGeometry(1, 1, 1);
  const morphed = base.clone();
  morphed.translate(0, 0.5, 0);
  base.morphAttributes.position = [morphed.attributes.position];
  base.morphTargetsRelative = false;
  const mesh = new THREE.Mesh(base, new THREE.MeshBasicMaterial());
  mesh.name = name;
  mesh.morphTargetInfluences = [0];
  mesh.morphTargetDictionary = { [name]: 0 };
  return mesh;
}

describe('gltf-morph-utils', () => {
  it('encodes and decodes morph storage keys', () => {
    const key = encodeMorphStorageKey('Body/Mesh', 'Smile');
    expect(key).toBe('Body/Mesh::Smile');
    expect(decodeMorphStorageKey(key)).toEqual({ nodePath: 'Body/Mesh', morphName: 'Smile' });
    expect(morphAnimatablePropertyPath(key)).toBe(`morph.${key}`);
  });

  it('parses THREE morph track names', () => {
    expect(parseMorphTrackName('Head.morphTargetInfluences[Smile]')).toEqual({
      nodeName: 'Head',
      morphKey: 'Smile',
    });
    expect(parseMorphTrackName('Head.morphTargetInfluences[0]')).toEqual({
      nodeName: 'Head',
      morphKey: '0',
    });
  });

  it('lists morph targets under a GLTF root', () => {
    const root = new THREE.Group();
    const mesh = meshWithMorph('Smile');
    mesh.name = 'Head';
    root.add(mesh);
    const targets = listGltfMorphTargets(root);
    expect(targets.length).toBe(1);
    expect(targets[0]?.morphName).toBe('Smile');
    expect(targets[0]?.nodePath).toBe('Head');
  });

  it('applies morph influence by name', () => {
    const root = new THREE.Group();
    const mesh = meshWithMorph('Smile');
    mesh.name = 'Head';
    root.add(mesh);
    expect(applyMorphInfluence(root, 'Head', 'Smile', 0.75)).toBe(true);
    expect(mesh.morphTargetInfluences?.[0]).toBeCloseTo(0.75);
  });
});
