'use client';

import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import {
  Box3,
  DoubleSide,
  Material,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  Object3D,
  SRGBColorSpace,
  Texture,
  TextureLoader,
  Vector3,
} from 'three';

const STUDIO_BUILDING_URL = '/models/studio-building.glb?v=8';

const LOGO_MESHES = new Set(['Everburn_Logo_Sign', 'Logo_Plaque']);
const LOGO_MATERIALS = new Set(['Everburn_Logo_Image']);

/** Meshes with CircuitBoard_Master in Blender Everburn_Tile_Export */
const CIRCUIT_BOARD_MESHES = new Set([
  'HQ_Lower_Mass',
  'HQ_Upper_Mass',
  'HQ_Left_Wing',
  'HQ_Right_Wing',
  'HQ_Rear_Volume',
]);

const PAGE_TILE_SURFACE_Y = 0.09;
const TARGET_SIZE = 2.65;
const CIRCUIT_PATTERN_URL = '/textures/circuit/circuit_pattern_generated.png?v=2';

const GROUND_ALIGN_PATTERN = /^(Bush_|Tree_Trunk_|HQ_Lower_Mass)/;

/** Blender Mapping_Pulse_Scroll: 0→1 over 60 frames @ 24fps */
const PULSE_CYCLE_SECONDS = 60 / 24;

const textureLoader = new TextureLoader();

interface CircuitUniforms {
  uPatternMap: { value: Texture };
  uPulseOffset: { value: number };
}

function getGroundMinY(root: Object3D): number {
  const groundBox = new Box3();
  let hasGroundMesh = false;

  root.traverse((child) => {
    if (!(child instanceof Mesh)) {
      return;
    }
    if (!GROUND_ALIGN_PATTERN.test(child.name)) {
      return;
    }
    groundBox.expandByObject(child);
    hasGroundMesh = true;
  });

  if (hasGroundMesh) {
    return groundBox.min.y;
  }

  return new Box3().setFromObject(root).min.y;
}

function isLogoMaterial(material: unknown): material is MeshStandardMaterial {
  return material instanceof MeshStandardMaterial && LOGO_MATERIALS.has(material.name);
}

/** Unlit sign material — keeps logo colours vivid regardless of scene lighting. */
function applyLogoMaterial(material: MeshStandardMaterial): MeshBasicMaterial {
  if (material.map) {
    material.map.colorSpace = SRGBColorSpace;
    material.map.needsUpdate = true;
  }

  return new MeshBasicMaterial({
    name: material.name,
    map: material.map,
    transparent: true,
    depthWrite: false,
    side: DoubleSide,
    toneMapped: false,
  });
}

function applyCircuitBoardMaster(
  material: MeshStandardMaterial,
  patternMap: Texture,
  circuitMaterials: MeshStandardMaterial[],
): void {
  material.name = 'CircuitBoard_Master';
  material.metalness = 0;
  material.roughness = 0.85;
  material.emissive.setRGB(0, 0, 0);
  material.emissiveIntensity = 1;
  material.customProgramCacheKey = () => 'everburn-circuit-board-master-uv-v1';

  material.onBeforeCompile = (shader) => {
    shader.uniforms.uPatternMap = { value: patternMap };
    shader.uniforms.uPulseOffset = { value: 0 };

    material.userData.circuitUniforms = shader.uniforms as unknown as CircuitUniforms;

    shader.vertexShader = shader.vertexShader.replace(
      '#include <common>',
      `#include <common>
varying vec2 vCircuitUv;`,
    );

    shader.vertexShader = shader.vertexShader.replace(
      '#include <uv_vertex>',
      `#include <uv_vertex>
vCircuitUv = uv;`,
    );

    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <common>',
      `#include <common>
varying vec2 vCircuitUv;
uniform sampler2D uPatternMap;
uniform float uPulseOffset;`,
    );

    shader.fragmentShader = shader.fragmentShader.replace(
      'vec4 diffuseColor = vec4( diffuse, opacity );',
      `vec4 diffuseColor = vec4( diffuse, opacity );
{
  vec4 circuitSample = texture2D(uPatternMap, vCircuitUv);
  float circuitMask = max(circuitSample.r, circuitSample.g);
  diffuseColor.rgb = mix(vec3(0.01, 0.03, 0.08), vec3(0.2, 0.9, 1.0), circuitMask);
}`,
    );

    shader.fragmentShader = shader.fragmentShader.replace(
      'vec3 totalEmissiveRadiance = emissive;',
      `vec3 totalEmissiveRadiance = emissive;
{
  vec4 circuitSample = texture2D(uPatternMap, vCircuitUv);
  float circuitMask = max(circuitSample.r, circuitSample.g);
  float pulseGradient = fract(vCircuitUv.x + uPulseOffset);
  float pulseMask = pulseGradient * circuitMask;
  totalEmissiveRadiance += vec3(0.1, 0.8, 1.0) * circuitMask * 3.5;
  totalEmissiveRadiance += vec3(0.6, 1.0, 1.0) * pulseMask * 6.0;
}`,
    );
  };

  material.needsUpdate = true;
  circuitMaterials.push(material);
}

export interface StudioBuildingProps {
  position?: [number, number, number];
  rotationY?: number;
}

export function StudioBuilding({
  position = [0, PAGE_TILE_SURFACE_Y, 0],
  rotationY = 0,
}: StudioBuildingProps) {
  const { scene } = useGLTF(STUDIO_BUILDING_URL);
  const circuitMaterialsRef = useRef<MeshStandardMaterial[]>([]);

  const patternMap = useMemo(() => {
    const texture = textureLoader.load(CIRCUIT_PATTERN_URL);
    texture.colorSpace = SRGBColorSpace;
    texture.needsUpdate = true;
    return texture;
  }, []);

  const model = useMemo(() => {
    circuitMaterialsRef.current = [];

    const clone = scene.clone(true);
    clone.updateMatrixWorld(true);

    const bounds = new Box3().setFromObject(clone);
    const size = new Vector3();
    bounds.getSize(size);

    const footprint = Math.max(size.x, size.z);
    const scale = TARGET_SIZE / footprint;
    clone.scale.setScalar(scale);
    clone.updateMatrixWorld(true);

    const scaledBounds = new Box3().setFromObject(clone);
    const scaledCenter = scaledBounds.getCenter(new Vector3());
    const groundMinY = getGroundMinY(clone);
    clone.position.set(-scaledCenter.x, -groundMinY, -scaledCenter.z);

    clone.traverse((child) => {
      if (!(child instanceof Mesh)) {
        return;
      }

      child.castShadow = true;
      child.receiveShadow = true;

      if (LOGO_MESHES.has(child.name)) {
        child.renderOrder = 3;
        child.castShadow = false;
        child.receiveShadow = false;
      }

      const materials = Array.isArray(child.material) ? child.material : [child.material];
      const nextMaterials: Material[] = materials.map((material) => {
        if (isLogoMaterial(material)) {
          return applyLogoMaterial(material);
        }
        return material;
      });

      if (Array.isArray(child.material)) {
        child.material = nextMaterials;
      } else {
        child.material = nextMaterials[0];
      }

      if (!CIRCUIT_BOARD_MESHES.has(child.name)) {
        return;
      }

      const sourceMaterial = child.material;
      const base =
        sourceMaterial instanceof MeshStandardMaterial
          ? sourceMaterial.clone()
          : new MeshStandardMaterial();

      applyCircuitBoardMaster(base, patternMap, circuitMaterialsRef.current);
      child.material = base;
    });

    return clone;
  }, [scene, patternMap]);

  useFrame(({ clock }) => {
    const pulseOffset = (clock.elapsedTime / PULSE_CYCLE_SECONDS) % 1;

    circuitMaterialsRef.current.forEach((material) => {
      const uniforms = material.userData.circuitUniforms as CircuitUniforms | undefined;
      if (uniforms?.uPulseOffset) {
        uniforms.uPulseOffset.value = pulseOffset;
      }
    });
  });

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <primitive object={model} />
    </group>
  );
}

useGLTF.preload(STUDIO_BUILDING_URL);
