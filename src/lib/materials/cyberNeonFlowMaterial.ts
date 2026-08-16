import {
  Material,
  MeshStandardMaterial,
  NoColorSpace,
  RepeatWrapping,
  SRGBColorSpace,
  Texture,
  TextureLoader,
} from 'three';

/** Blender material name — keep in sync with M_Cyber_Neon_Flow in the .blend file. */
export const CYBER_NEON_FLOW_MATERIAL_NAME = 'M_Cyber_Neon_Flow';

export const CYBER_NEON_ALBEDO_URL = '/textures/cyber-track/cyber_neon_albedo.png';
export const CYBER_NEON_EMISSIVE_URL = '/textures/cyber-track/cyber_neon_emissive.png';

/** One full scroll along the circuit lines. */
export const CYBER_NEON_FLOW_CYCLE_SECONDS = 5;

const textureLoader = new TextureLoader();

interface CyberNeonFlowUniforms {
  uEmissiveMap: { value: Texture };
  uFlowOffset: { value: number };
}

const animatedMaterials: MeshStandardMaterial[] = [];

let sharedAlbedo: Texture | null = null;
let sharedEmissive: Texture | null = null;

function loadSharedTextures(): { albedo: Texture; emissive: Texture } {
  if (!sharedAlbedo) {
    sharedAlbedo = textureLoader.load(CYBER_NEON_ALBEDO_URL);
    sharedAlbedo.colorSpace = SRGBColorSpace;
    sharedAlbedo.wrapS = sharedAlbedo.wrapT = RepeatWrapping;
    sharedAlbedo.needsUpdate = true;
  }

  if (!sharedEmissive) {
    sharedEmissive = textureLoader.load(CYBER_NEON_EMISSIVE_URL);
    sharedEmissive.colorSpace = SRGBColorSpace;
    sharedEmissive.wrapS = sharedEmissive.wrapT = RepeatWrapping;
    sharedEmissive.needsUpdate = true;
  }

  return { albedo: sharedAlbedo, emissive: sharedEmissive };
}

function cloneRepeatingTexture(source: Texture, repeatX: number, repeatY: number): Texture {
  const clone = source.clone();
  clone.repeat.set(repeatX, repeatY);
  clone.wrapS = clone.wrapT = RepeatWrapping;
  clone.needsUpdate = true;
  return clone;
}

/** Animated cyber floor for large planes (independent UV tiling from glTF track pieces). */
export function createCyberNeonFlowPlaneMaterial(
  repeatX: number,
  repeatY: number,
  baseColor = '#060a14',
): MeshStandardMaterial {
  const { albedo, emissive } = loadSharedTextures();
  const material = new MeshStandardMaterial({
    color: baseColor,
    map: cloneRepeatingTexture(albedo, repeatX, repeatY),
    emissiveMap: cloneRepeatingTexture(emissive, repeatX, repeatY),
  });

  return applyCyberNeonFlowMaterial(material);
}

export function isCyberNeonFlowMaterial(material: Material): material is MeshStandardMaterial {
  return material instanceof MeshStandardMaterial && material.name === CYBER_NEON_FLOW_MATERIAL_NAME;
}

/** Patch a glTF/Blender standard material with scrolling neon flow (WebGL-safe). */
export function applyCyberNeonFlowMaterial(material: MeshStandardMaterial): MeshStandardMaterial {
  const { albedo, emissive } = loadSharedTextures();

  material.name = CYBER_NEON_FLOW_MATERIAL_NAME;
  material.map = albedo;
  material.emissiveMap = emissive;
  material.emissive.setRGB(0.04, 0.55, 0.95);
  material.emissiveIntensity = 1.35;
  material.metalness = 0.35;
  material.roughness = 0.42;
  material.customProgramCacheKey = () => 'everburn-cyber-neon-flow-v1';

  material.onBeforeCompile = (shader) => {
    shader.uniforms.uEmissiveMap = { value: emissive };
    shader.uniforms.uFlowOffset = { value: 0 };
    material.userData.cyberNeonUniforms = shader.uniforms as unknown as CyberNeonFlowUniforms;

    shader.vertexShader = shader.vertexShader.replace(
      '#include <common>',
      `#include <common>
varying vec2 vCyberUv;`,
    );

    shader.vertexShader = shader.vertexShader.replace(
      '#include <uv_vertex>',
      `#include <uv_vertex>
vCyberUv = uv;`,
    );

    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <common>',
      `#include <common>
varying vec2 vCyberUv;
uniform sampler2D uEmissiveMap;
uniform float uFlowOffset;`,
    );

    shader.fragmentShader = shader.fragmentShader.replace(
      'vec4 diffuseColor = vec4( diffuse, opacity );',
      `vec4 diffuseColor = vec4( diffuse, opacity );
{
  vec2 flowUv = vCyberUv + vec2(uFlowOffset * 0.85, uFlowOffset * 0.22);
  vec3 neonLine = texture2D(uEmissiveMap, flowUv).rgb;
  float lineMask = max(neonLine.r, max(neonLine.g, neonLine.b));
  diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.08, 0.22, 0.38), lineMask * 0.55);
}`,
    );

    shader.fragmentShader = shader.fragmentShader.replace(
      'vec3 totalEmissiveRadiance = emissive;',
      `vec3 totalEmissiveRadiance = emissive;
{
  vec2 flowUv = vCyberUv + vec2(uFlowOffset * 0.85, uFlowOffset * 0.22);
  vec3 neonLine = texture2D(uEmissiveMap, flowUv).rgb;
  float lineMask = max(neonLine.r, max(neonLine.g, neonLine.b));
  float pulse = smoothstep(0.0, 1.0, fract(vCyberUv.x * 2.4 - uFlowOffset * 1.6));
  float pulseBand = lineMask * pulse;
  totalEmissiveRadiance += vec3(0.15, 0.95, 1.0) * lineMask * 2.4;
  totalEmissiveRadiance += vec3(0.85, 0.35, 1.0) * pulseBand * 3.2;
}`,
    );
  };

  material.needsUpdate = true;

  if (!animatedMaterials.includes(material)) {
    animatedMaterials.push(material);
  }

  return material;
}

export function prepareCyberNeonFlowMaterial(material: Material): Material {
  if (!isCyberNeonFlowMaterial(material)) {
    return material;
  }

  return applyCyberNeonFlowMaterial(material);
}

export function tickCyberNeonFlowMaterials(elapsedTime: number): void {
  const flowOffset = (elapsedTime / CYBER_NEON_FLOW_CYCLE_SECONDS) % 1;

  animatedMaterials.forEach((material) => {
    const uniforms = material.userData.cyberNeonUniforms as CyberNeonFlowUniforms | undefined;
    if (uniforms?.uFlowOffset) {
      uniforms.uFlowOffset.value = flowOffset;
    }
  });
}

/** Ensure glTF-loaded maps use the correct color spaces before animation is applied. */
export function normalizeCyberNeonFlowMaps(material: MeshStandardMaterial): void {
  if (material.map) {
    material.map.colorSpace = SRGBColorSpace;
    material.map.needsUpdate = true;
  }

  if (material.emissiveMap) {
    material.emissiveMap.colorSpace = SRGBColorSpace;
    material.emissiveMap.needsUpdate = true;
  }

  if (material.normalMap) {
    material.normalMap.colorSpace = NoColorSpace;
    material.normalMap.needsUpdate = true;
  }
}
