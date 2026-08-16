/**
 * Isolated PBR lighting — envMap / USE_ENVMAP contract tests.
 */
import { describe, expect, it } from 'vitest';
import * as THREE from 'three';
import {
  bindIsolatedPbrLighting,
  disposeIsolatedPbrLighting,
} from './isolated-pbr';
import { METAL_STUDIO_LOCAL_LIGHT, STUDIO_LOCAL_LIGHT } from './light-profiles';

function makeMetalMesh(metalness = 1, roughness = 0.05): THREE.Mesh {
  const mat = new THREE.MeshStandardMaterial({
    color: 0xffc030,
    metalness,
    roughness,
  });
  return new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), mat);
}

describe('bindIsolatedPbrLighting', () => {
  it('throws when envMap is null/undefined (metals need USE_ENVMAP at compile time)', () => {
    const root = new THREE.Group();
    root.add(makeMetalMesh());
    expect(() =>
      bindIsolatedPbrLighting(root, STUDIO_LOCAL_LIGHT, null as unknown as THREE.Texture),
    ).toThrow(/non-null envMap/);
  });

  it('always assigns envMap and intensity > 0 on patched materials', () => {
    const root = new THREE.Group();
    const mesh = makeMetalMesh();
    root.add(mesh);

    const envMap = new THREE.Texture();
    envMap.mapping = THREE.CubeUVReflectionMapping;
    const versionBefore = (mesh.material as THREE.MeshStandardMaterial).version;

    const binding = bindIsolatedPbrLighting(root, STUDIO_LOCAL_LIGHT, envMap);
    const patched = mesh.material as THREE.MeshStandardMaterial;

    expect(patched.envMap).toBe(envMap);
    expect(patched.envMapIntensity).toBeGreaterThan(0);
    expect(patched.envMapIntensity).toBe(STUDIO_LOCAL_LIGHT.envMapIntensity);
    // Three.js Material.needsUpdate is write-only; version bumps on assign.
    expect(patched.version).toBeGreaterThan(versionBefore);
    expect(patched.userData.__flamecoreIsoPbr).toBe(true);
    expect(binding.envMap).toBe(envMap);

    binding.dispose();
  });

  it('upgrades to MeshPhysicalMaterial when profile.physical is set', () => {
    const root = new THREE.Group();
    const mesh = makeMetalMesh();
    root.add(mesh);

    const envMap = new THREE.Texture();
    const binding = bindIsolatedPbrLighting(root, METAL_STUDIO_LOCAL_LIGHT, envMap);
    const patched = mesh.material as THREE.MeshPhysicalMaterial;

    expect(patched).toBeInstanceOf(THREE.MeshPhysicalMaterial);
    expect(patched.clearcoat).toBeGreaterThan(0);
    expect(patched.envMap).toBe(envMap);
    binding.dispose();
  });

  it('setEnvMap reassigns envMap and bumps material version', () => {
    const root = new THREE.Group();
    const mesh = makeMetalMesh();
    root.add(mesh);

    const first = new THREE.Texture();
    const second = new THREE.Texture();
    const binding = bindIsolatedPbrLighting(root, STUDIO_LOCAL_LIGHT, first);

    const patched = mesh.material as THREE.MeshStandardMaterial;
    const versionBefore = patched.version;
    binding.setEnvMap(second, 1.5);

    expect(patched.envMap).toBe(second);
    expect(patched.envMapIntensity).toBe(1.5);
    expect(patched.version).toBeGreaterThan(versionBefore);
    expect(binding.envMap).toBe(second);
    binding.dispose();
  });

  it('disposeIsolatedPbrLighting clears the binding handle', () => {
    const root = new THREE.Group();
    root.add(makeMetalMesh());
    const envMap = new THREE.Texture();
    bindIsolatedPbrLighting(root, STUDIO_LOCAL_LIGHT, envMap);
    expect(root.userData.isolatedLightingBinding).toBeTruthy();
    disposeIsolatedPbrLighting(root);
    expect(root.userData.isolatedLightingBinding).toBeUndefined();
  });

  it('clamps envMapIntensity so reflections are never fully silenced', () => {
    const root = new THREE.Group();
    const mesh = makeMetalMesh();
    root.add(mesh);
    const envMap = new THREE.Texture();
    const profile = { ...STUDIO_LOCAL_LIGHT, envMapIntensity: 0 };
    const binding = bindIsolatedPbrLighting(root, profile, envMap);
    const patched = mesh.material as THREE.MeshStandardMaterial;
    expect(patched.envMapIntensity).toBeGreaterThanOrEqual(0.01);
    binding.dispose();
  });
});
