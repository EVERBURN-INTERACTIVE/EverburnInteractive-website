import * as THREE from 'three';
import type { LocalLightProfile } from './light-profiles';
import { getOrCreateLightingProbe } from './lighting-probe';

const ISO_PATCH_KEY = '__flamecoreIsoPbr';
const SHADER_CACHE_VERSION = 'v2';

/**
 * GLSL injected in place of scene light loops — one local key + ambient per
 * material, plus IBL when USE_ENVMAP is defined (requires material.envMap set
 * *before* shader compilation / needsUpdate).
 */
const ISO_LIGHTS_CHUNK = /* glsl */ `
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif

IncidentLight directLight;
directLight.color = uIsoKeyColor;
directLight.direction = normalize( ( modelViewMatrix * vec4( uIsoKeyDir, 0.0 ) ).xyz );
directLight.visible = true;

#if defined( RE_Direct )
	RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif

#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = uIsoAmbient;
#endif

#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif

#if defined( RE_IndirectDiffuse )
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif

#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif

#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance + iblIrradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif

#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
`;

/** Handle returned by {@link bindIsolatedPbrLighting}. */
export interface IsolatedLightingBinding {
  readonly profileId: string;
  readonly root: THREE.Object3D;
  /** Non-null env map currently driving USE_ENVMAP on patched materials. */
  readonly envMap: THREE.Texture;
  /** Swap the env map later (e.g. after an async probe) and force recompile. */
  setEnvMap(envMap: THREE.Texture, intensity?: number): void;
  dispose(): void;
}

interface IsoUniforms {
  uIsoAmbient: { value: THREE.Color };
  uIsoKeyColor: { value: THREE.Color };
  uIsoKeyDir: { value: THREE.Vector3 };
}

interface IsoMaterialState {
  material: THREE.MeshStandardMaterial;
  uniforms: IsoUniforms;
  onBeforeCompile: THREE.MeshStandardMaterial['onBeforeCompile'];
  customProgramCacheKey: THREE.MeshStandardMaterial['customProgramCacheKey'];
}

function assertEnvMap(envMap: THREE.Texture | null | undefined): THREE.Texture {
  if (!envMap) {
    throw new Error(
      'bindIsolatedPbrLighting requires a non-null envMap. ' +
        'Call createLightingProbe() / getOrCreateLightingProbe() first, ' +
        'or use bindIsolatedPbrWithProbe().',
    );
  }
  return envMap;
}

function resolveEnvMapIntensity(profile: LocalLightProfile, override?: number): number {
  const raw = override ?? profile.envMapIntensity;
  // Intensity 0 silences all IBL even when USE_ENVMAP is defined.
  return Math.max(0.01, raw);
}

/**
 * Clone a standard material, optionally upgrading to MeshPhysicalMaterial when
 * the profile requests clearcoat / anisotropy.
 */
function cloneForIsolatedLighting(
  source: THREE.MeshStandardMaterial,
  profile: LocalLightProfile,
): THREE.MeshStandardMaterial {
  const phys = profile.physical;
  if (!phys) return source.clone();

  // MeshPhysicalMaterial.copy assumes a physical source (sheen/anisotropy
  // vectors). Copy only the standard layer, then apply physical extras.
  const upgraded = new THREE.MeshPhysicalMaterial();
  THREE.MeshStandardMaterial.prototype.copy.call(upgraded, source);
  if (phys.clearcoat !== undefined) upgraded.clearcoat = phys.clearcoat;
  if (phys.clearcoatRoughness !== undefined) upgraded.clearcoatRoughness = phys.clearcoatRoughness;
  // Anisotropy landed in three@0.163 — set only when the runtime supports it.
  if (phys.anisotropy !== undefined && 'anisotropy' in upgraded) {
    (upgraded as THREE.MeshPhysicalMaterial & { anisotropy: number }).anisotropy = phys.anisotropy;
  }
  if (phys.anisotropyRotation !== undefined && 'anisotropyRotation' in upgraded) {
    (upgraded as THREE.MeshPhysicalMaterial & { anisotropyRotation: number }).anisotropyRotation =
      phys.anisotropyRotation;
  }
  return upgraded;
}

function applyEnvMapToMaterial(
  material: THREE.MeshStandardMaterial,
  envMap: THREE.Texture,
  intensity: number,
  profileId: string,
): void {
  material.envMap = envMap;
  material.envMapIntensity = intensity;
  // Force shader recompilation so USE_ENVMAP / ENVMAP_TYPE_CUBE_UV are defined.
  material.needsUpdate = true;
  material.customProgramCacheKey = () =>
    `flamecore_iso_pbr_${SHADER_CACHE_VERSION}_${profileId}_env`;
}

/**
 * Binds per-object lighting that ignores scene lights. Uses a shader patch instead of
 * extra THREE.Light instances, so many buildings can be lit in isolation without
 * hitting GPU light limits or affecting neighbors.
 *
 * @param envMap - Required PMREM / cube-UV env map. Never pass null — metals
 *   need USE_ENVMAP at compile time or specular radiance stays vec3(0).
 */
export function bindIsolatedPbrLighting(
  root: THREE.Object3D,
  profile: LocalLightProfile,
  envMap: THREE.Texture,
): IsolatedLightingBinding {
  const map = assertEnvMap(envMap);
  const envIntensity = resolveEnvMapIntensity(profile);
  const materials: IsoMaterialState[] = [];

  const ambient = new THREE.Color(profile.ambientBoost).multiplyScalar(profile.ambientIntensity);
  const hemiGround = new THREE.Color(profile.groundColor).multiplyScalar(profile.hemiIntensity * 0.5);
  const hemiSky = new THREE.Color(profile.skyColor).multiplyScalar(profile.hemiIntensity * 0.5);
  ambient.add(hemiGround).add(hemiSky);

  const keyColor = new THREE.Color(profile.keyColor).multiplyScalar(profile.keyIntensity);
  const keyDir = profile.keyDirection.clone().normalize();

  let activeEnvMap = map;

  root.traverse((child) => {
    if (!(child instanceof THREE.Mesh)) return;

    const mats = Array.isArray(child.material) ? child.material : [child.material];
    const patched: THREE.Material[] = [];

    for (const mat of mats) {
      // MeshPhysicalMaterial extends MeshStandardMaterial — both are accepted.
      if (!(mat instanceof THREE.MeshStandardMaterial)) {
        patched.push(mat);
        continue;
      }

      const isolated = cloneForIsolatedLighting(mat, profile);
      applyEnvMapToMaterial(isolated, activeEnvMap, envIntensity, profile.id);

      const uniforms: IsoUniforms = {
        uIsoAmbient: { value: ambient.clone() },
        uIsoKeyColor: { value: keyColor.clone() },
        uIsoKeyDir: { value: keyDir.clone() },
      };

      const prevOnBeforeCompile = isolated.onBeforeCompile;
      const prevCacheKey = isolated.customProgramCacheKey;

      isolated.customProgramCacheKey = () =>
        `flamecore_iso_pbr_${SHADER_CACHE_VERSION}_${profile.id}_env`;
      isolated.onBeforeCompile = (shader, renderer) => {
        prevOnBeforeCompile?.call(isolated, shader, renderer);

        shader.uniforms.uIsoAmbient = uniforms.uIsoAmbient;
        shader.uniforms.uIsoKeyColor = uniforms.uIsoKeyColor;
        shader.uniforms.uIsoKeyDir = uniforms.uIsoKeyDir;

        shader.fragmentShader = shader.fragmentShader
          .replace('#include <lights_fragment_begin>', ISO_LIGHTS_CHUNK)
          .replace('#include <lights_fragment_maps>', '')
          .replace('#include <lights_fragment_end>', '');
      };

      isolated.userData[ISO_PATCH_KEY] = true;
      materials.push({
        material: isolated,
        uniforms,
        onBeforeCompile: prevOnBeforeCompile,
        customProgramCacheKey: prevCacheKey,
      });
      patched.push(isolated);
    }

    child.material = patched.length === 1 ? patched[0]! : patched;
  });

  root.userData.flamecoreIsolatedLighting = true;

  const binding: IsolatedLightingBinding = {
    profileId: profile.id,
    root,
    get envMap() {
      return activeEnvMap;
    },
    setEnvMap(next: THREE.Texture, intensity?: number) {
      const resolved = assertEnvMap(next);
      const nextIntensity = resolveEnvMapIntensity(profile, intensity);
      activeEnvMap = resolved;
      for (const entry of materials) {
        applyEnvMapToMaterial(entry.material, resolved, nextIntensity, profile.id);
      }
    },
    dispose() {
      for (const entry of materials) {
        entry.material.onBeforeCompile = entry.onBeforeCompile;
        entry.material.customProgramCacheKey = entry.customProgramCacheKey;
        delete entry.material.userData[ISO_PATCH_KEY];
        entry.material.dispose();
      }
      delete root.userData.flamecoreIsolatedLighting;
      delete root.userData.isolatedLightingBinding;
    },
  };

  root.userData.isolatedLightingBinding = binding;
  return binding;
}

/**
 * Create (or reuse) a lighting probe, then bind isolated PBR.
 * Prefer this entry point so envMap is never null at bind time.
 */
export function bindIsolatedPbrWithProbe(
  root: THREE.Object3D,
  profile: LocalLightProfile,
  renderer: THREE.WebGLRenderer,
): IsolatedLightingBinding {
  const envMap = getOrCreateLightingProbe(renderer, profile);
  return bindIsolatedPbrLighting(root, profile, envMap);
}

export function disposeIsolatedPbrLighting(root: THREE.Object3D): void {
  const binding = root.userData.isolatedLightingBinding as IsolatedLightingBinding | undefined;
  binding?.dispose();
  delete root.userData.isolatedLightingBinding;
}
