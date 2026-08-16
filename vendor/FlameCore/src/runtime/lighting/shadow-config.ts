import * as THREE from 'three';
import type { QualitySettings } from '../quality/quality-manager';

/**
 * Default orthographic half-extent (world units) for directional shadow cameras.
 * Covers a typical starter ground (~22u) plus margin for nearby props.
 */
export const DEFAULT_DIRECTIONAL_SHADOW_EXTENT = 28;

/** Default shadow-map near/far for directional lights. */
export const DEFAULT_DIRECTIONAL_SHADOW_NEAR = 0.5;
export const DEFAULT_DIRECTIONAL_SHADOW_FAR = 120;

const SHADOW_OPACITY_UD = 'flameCastShadowOpacity';

/**
 * Resolve how densely a mesh should write into the shadow map.
 *
 * Three.js shadow maps are binary depth tests, so translucent casters still
 * produce full-strength umbras unless we dither the depth pass. When
 * `castShadowOpacity` is unset, opaque meshes stay at 1 and translucent ones
 * map to a lighter band so clouds/glass do not look like solid blockers.
 */
export function resolveCastShadowOpacity(
  castShadow: boolean,
  opacity: number,
  castShadowOpacity?: number,
): number {
  if (!castShadow) return 0;
  if (castShadowOpacity !== undefined) {
    return Math.min(1, Math.max(0, castShadowOpacity));
  }
  if (opacity >= 0.999) return 1;
  // Keep umbra clearly lighter than the surface opacity (0.92 → ~0.26).
  return Math.min(0.4, Math.max(0.1, opacity * 0.28));
}

function patchDitheredShadowShader(
  shader: { uniforms: Record<string, { value: unknown }>; fragmentShader: string },
  strength: number,
): void {
  shader.uniforms.flameShadowOpacity = { value: strength };
  shader.fragmentShader = shader.fragmentShader.replace(
    '#include <common>',
    `#include <common>
uniform float flameShadowOpacity;
float flameShadowDither(const in vec2 p) {
  return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}`,
  );
  shader.fragmentShader = shader.fragmentShader.replace(
    'void main() {',
    `void main() {
  if (flameShadowDither(gl_FragCoord.xy) > flameShadowOpacity) discard;`,
  );
}

/**
 * Create a directional/spot shadow depth material that discards a fraction of
 * fragments so PCF shadows read softer / lighter. Strength 1 is a plain depth material.
 */
export function createDitheredDepthMaterial(strength: number): THREE.MeshDepthMaterial {
  const clamped = Math.min(1, Math.max(0, strength));
  const material = new THREE.MeshDepthMaterial({ depthPacking: THREE.RGBADepthPacking });
  material.userData[SHADOW_OPACITY_UD] = clamped;
  if (clamped >= 0.999) return material;

  material.onBeforeCompile = (shader) => patchDitheredShadowShader(shader, clamped);
  material.customProgramCacheKey = () => `flame-dither-depth:${clamped.toFixed(3)}`;
  return material;
}

/**
 * Create a point-light distance material with the same dithered density.
 */
export function createDitheredDistanceMaterial(strength: number): THREE.MeshDistanceMaterial {
  const clamped = Math.min(1, Math.max(0, strength));
  const material = new THREE.MeshDistanceMaterial();
  material.userData[SHADOW_OPACITY_UD] = clamped;
  if (clamped >= 0.999) return material;

  material.onBeforeCompile = (shader) => patchDitheredShadowShader(shader, clamped);
  material.customProgramCacheKey = () => `flame-dither-distance:${clamped.toFixed(3)}`;
  return material;
}

function disposeShadowDepthMaterial(mesh: THREE.Mesh): void {
  if (mesh.customDepthMaterial) {
    mesh.customDepthMaterial.dispose();
    mesh.customDepthMaterial = undefined;
  }
  if (mesh.customDistanceMaterial) {
    mesh.customDistanceMaterial.dispose();
    mesh.customDistanceMaterial = undefined;
  }
}

/**
 * Apply cast/receive shadow flags to a mesh or an entire Object3D subtree
 * (GLTF roots include nested meshes that must be flagged individually).
 *
 * @param castShadowOpacity - 0..1 density of the shadow umbra. Values below 1
 *   install a dithered depth material so translucent casters leave lighter
 *   shadows. Omit or pass 1 for solid umbras.
 */
export function applyShadowFlags(
  root: THREE.Object3D,
  castShadow: boolean,
  receiveShadow: boolean,
  castShadowOpacity = 1,
): void {
  const strength = castShadow ? Math.min(1, Math.max(0, castShadowOpacity)) : 0;
  root.traverse((obj) => {
    if (!(obj instanceof THREE.Mesh || obj instanceof THREE.SkinnedMesh)) return;
    obj.castShadow = castShadow && strength > 0;
    obj.receiveShadow = receiveShadow;

    disposeShadowDepthMaterial(obj);
    if (!obj.castShadow || strength >= 0.999) return;

    obj.customDepthMaterial = createDitheredDepthMaterial(strength);
    obj.customDistanceMaterial = createDitheredDistanceMaterial(strength);
  });
}

/**
 * Configure Three.js shadow-map parameters on a light that supports them.
 * Safe to call on ambient/hemisphere lights (no-op).
 *
 * Disposes any existing shadow map when the resolution changes so the next
 * render allocates a map at the quality-appropriate size.
 */
export function configureLightShadows(
  light: THREE.Light,
  settings: Pick<QualitySettings, 'shadowMapSize' | 'shadowSoftness'>,
): void {
  if (!('shadow' in light) || !light.shadow) return;

  const size = Math.max(256, settings.shadowMapSize);
  const shadow = light.shadow;
  const sizeChanged = shadow.mapSize.x !== size || shadow.mapSize.y !== size;
  shadow.mapSize.set(size, size);

  if (sizeChanged && shadow.map) {
    shadow.map.dispose();
    shadow.map = null;
  }

  // Soften acne without lifting the shadow too far off the surface.
  shadow.bias = -0.0002;
  shadow.normalBias = 0.04;

  if (light instanceof THREE.DirectionalLight) {
    const cam = shadow.camera as THREE.OrthographicCamera;
    const extent = DEFAULT_DIRECTIONAL_SHADOW_EXTENT;
    cam.left = -extent;
    cam.right = extent;
    cam.top = extent;
    cam.bottom = -extent;
    cam.near = DEFAULT_DIRECTIONAL_SHADOW_NEAR;
    cam.far = DEFAULT_DIRECTIONAL_SHADOW_FAR;
    cam.updateProjectionMatrix();
    // PCF radius; ignored by BasicShadowMap but softens PCF soft maps.
    shadow.radius = settings.shadowSoftness === 'none' ? 1 : 2;
  } else if (light instanceof THREE.SpotLight) {
    const cam = shadow.camera as THREE.PerspectiveCamera;
    cam.near = 0.5;
    cam.far = Math.max(light.distance || 50, 20);
    cam.updateProjectionMatrix();
    shadow.radius = settings.shadowSoftness === 'none' ? 1 : 2;
  } else if (light instanceof THREE.PointLight) {
    const cam = shadow.camera as THREE.PerspectiveCamera;
    cam.near = 0.5;
    cam.far = Math.max(light.distance || 50, 20);
    cam.updateProjectionMatrix();
    shadow.radius = settings.shadowSoftness === 'none' ? 1 : 2;
  }
}

/**
 * Walk a Three.js scene graph and re-apply shadow-map settings to every
 * light that currently has `castShadow` enabled. Used when quality changes.
 */
export function syncSceneLightShadows(
  root: THREE.Object3D,
  settings: Pick<QualitySettings, 'shadowMapSize' | 'shadowSoftness'>,
): void {
  root.traverse((obj) => {
    if (
      obj instanceof THREE.DirectionalLight ||
      obj instanceof THREE.SpotLight ||
      obj instanceof THREE.PointLight
    ) {
      if (obj.castShadow) configureLightShadows(obj, settings);
    }
  });
}
