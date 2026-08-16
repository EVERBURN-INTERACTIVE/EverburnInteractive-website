import * as THREE from 'three';
import type { LocalLightProfile } from './light-profiles';

/** Per-renderer cache of PMREM probes keyed by profile id. */
const probeCache = new WeakMap<THREE.WebGLRenderer, Map<string, THREE.Texture>>();

/**
 * Builds a high-contrast PMREM environment from a profile.
 *
 * Always returns a usable texture (never null). Warm key + cool fill and a
 * bright specular disc give metals readable reflections.
 */
export function createLightingProbe(
  renderer: THREE.WebGLRenderer,
  profile: LocalLightProfile,
): THREE.Texture {
  const pmrem = new THREE.PMREMGenerator(renderer);
  pmrem.compileEquirectangularShader();

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(profile.skyColor);

  // Strong sky/ground split — flat gray hemi washes out metal specular.
  const hemi = new THREE.HemisphereLight(
    profile.skyColor,
    profile.groundColor,
    profile.hemiIntensity * 1.6,
  );
  scene.add(hemi);

  const key = new THREE.DirectionalLight(profile.keyColor, profile.keyIntensity * 1.25);
  key.position.copy(profile.keyDirection).multiplyScalar(12);
  scene.add(key);

  // Cool opposing fill (not the same hue as ambientBoost) for probe contrast.
  const fill = new THREE.DirectionalLight(profile.fillColor, profile.fillIntensity * 1.35);
  fill.position.set(
    -profile.keyDirection.x,
    Math.max(0.2, profile.keyDirection.y * 0.35),
    -profile.keyDirection.z,
  );
  scene.add(fill);

  // Bright disc in the key direction → sharp specular lobe on low-roughness metals.
  const sun = new THREE.Mesh(
    new THREE.SphereGeometry(0.55, 24, 24),
    new THREE.MeshBasicMaterial({ color: profile.keyColor }),
  );
  sun.position.copy(profile.keyDirection).normalize().multiplyScalar(9);
  scene.add(sun);

  const texture = pmrem.fromScene(scene, 0.02).texture;
  pmrem.dispose();
  sun.geometry.dispose();
  (sun.material as THREE.Material).dispose();
  return texture;
}

/**
 * Returns a cached probe for `(renderer, profile.id)`, creating it on first use.
 * Prefer this over raw {@link createLightingProbe} when binding many roots.
 */
export function getOrCreateLightingProbe(
  renderer: THREE.WebGLRenderer,
  profile: LocalLightProfile,
): THREE.Texture {
  let byProfile = probeCache.get(renderer);
  if (!byProfile) {
    byProfile = new Map();
    probeCache.set(renderer, byProfile);
  }
  const existing = byProfile.get(profile.id);
  if (existing) return existing;
  const created = createLightingProbe(renderer, profile);
  byProfile.set(profile.id, created);
  return created;
}

/** Drop cached probes for a renderer (e.g. on dispose). */
export function clearLightingProbeCache(renderer: THREE.WebGLRenderer): void {
  const byProfile = probeCache.get(renderer);
  if (!byProfile) return;
  for (const tex of byProfile.values()) tex.dispose();
  byProfile.clear();
  probeCache.delete(renderer);
}
