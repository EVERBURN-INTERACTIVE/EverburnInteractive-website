'use client';

import { useGLTF } from '@react-three/drei';
import { useMemo, type ReactNode } from 'react';
import {
  Box3,
  Material,
  Mesh,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  NoColorSpace,
  Object3D,
  SRGBColorSpace,
  Texture,
  Vector3,
} from 'three';

import { useGlbAvailability } from '@/lib/hooks/useGlbAvailability';
import {
  CYBER_NEON_FLOW_MATERIAL_NAME,
  normalizeCyberNeonFlowMaps,
  prepareCyberNeonFlowMaterial,
} from '@/lib/materials/cyberNeonFlowMaterial';
import { markTextureForUpload } from '@/lib/textureUpload';

export const PAGE_TILE_SURFACE_Y = 0.09;
const DEFAULT_TARGET_FOOTPRINT = 2.75;

function getModelGroundMinY(root: Object3D): number {
  return new Box3().setFromObject(root).min.y;
}

function setTextureColorSpace(texture: Texture, colorSpace: typeof SRGBColorSpace | typeof NoColorSpace): void {
  texture.colorSpace = colorSpace;
  markTextureForUpload(texture);
}

export function prepareGltfMaterial(material: Material): Material {
  if (!(material instanceof MeshStandardMaterial) && !(material instanceof MeshPhysicalMaterial)) {
    return material;
  }

  const gltfMaterial: MeshStandardMaterial | MeshPhysicalMaterial = material;

  if (
    gltfMaterial instanceof MeshStandardMaterial &&
    gltfMaterial.name === CYBER_NEON_FLOW_MATERIAL_NAME
  ) {
    normalizeCyberNeonFlowMaps(gltfMaterial);
    return prepareCyberNeonFlowMaterial(gltfMaterial);
  }

  gltfMaterial.needsUpdate = true;

  if (gltfMaterial.map) {
    setTextureColorSpace(gltfMaterial.map, SRGBColorSpace);
  }

  if (gltfMaterial.emissiveMap) {
    setTextureColorSpace(gltfMaterial.emissiveMap, SRGBColorSpace);
  }

  if (gltfMaterial.normalMap) {
    setTextureColorSpace(gltfMaterial.normalMap, NoColorSpace);
  }

  if (gltfMaterial.roughnessMap) {
    setTextureColorSpace(gltfMaterial.roughnessMap, NoColorSpace);
  }

  if (gltfMaterial.metalnessMap) {
    setTextureColorSpace(gltfMaterial.metalnessMap, NoColorSpace);
  }

  if (gltfMaterial.aoMap) {
    setTextureColorSpace(gltfMaterial.aoMap, NoColorSpace);
  }

  if (gltfMaterial.alphaMap) {
    setTextureColorSpace(gltfMaterial.alphaMap, NoColorSpace);
  }

  if (gltfMaterial.bumpMap) {
    setTextureColorSpace(gltfMaterial.bumpMap, NoColorSpace);
  }

  if (gltfMaterial instanceof MeshPhysicalMaterial) {
    if (gltfMaterial.sheenColorMap) {
      setTextureColorSpace(gltfMaterial.sheenColorMap, SRGBColorSpace);
    }
  }

  return gltfMaterial;
}

export function prepareGltfObject(root: Object3D): void {
  root.traverse((child) => {
    if (!(child instanceof Mesh)) {
      return;
    }

    child.castShadow = true;
    child.receiveShadow = true;

    const materials = Array.isArray(child.material) ? child.material : [child.material];
    const nextMaterials: Material[] = materials.map((material) => prepareGltfMaterial(material));

    if (Array.isArray(child.material)) {
      child.material = nextMaterials;
    } else {
      child.material = nextMaterials[0];
    }
  });
}

interface TileGlbIconLoadedProps {
  url: string;
  position: [number, number, number];
  rotationY: number;
  targetFootprint: number;
}

function TileGlbIconLoaded({ url, position, rotationY, targetFootprint }: TileGlbIconLoadedProps) {
  const { scene } = useGLTF(url);

  const model = useMemo(() => {
    const clone = scene.clone(true);
    clone.updateMatrixWorld(true);

    const bounds = new Box3().setFromObject(clone);
    const size = new Vector3();
    bounds.getSize(size);

    const footprint = Math.max(size.x, size.z);
    const scale = footprint > 0 ? targetFootprint / footprint : 1;
    clone.scale.setScalar(scale);
    clone.updateMatrixWorld(true);

    const scaledBounds = new Box3().setFromObject(clone);
    const scaledCenter = scaledBounds.getCenter(new Vector3());
    const groundMinY = getModelGroundMinY(clone);
    clone.position.set(-scaledCenter.x, -groundMinY, -scaledCenter.z);

    prepareGltfObject(clone);

    return clone;
  }, [scene, targetFootprint]);

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <primitive object={model} />
    </group>
  );
}

export interface TileGlbIconProps {
  url: string;
  position?: [number, number, number];
  rotationY?: number;
  targetFootprint?: number;
  fallback?: ReactNode;
}

export function TileGlbIcon({
  url,
  position = [0, PAGE_TILE_SURFACE_Y, 0],
  rotationY = 0,
  targetFootprint = DEFAULT_TARGET_FOOTPRINT,
  fallback = null,
}: TileGlbIconProps) {
  const isAvailable = useGlbAvailability(url);

  if (isAvailable === false) {
    return <>{fallback}</>;
  }

  if (isAvailable === null) {
    return null;
  }

  return (
    <TileGlbIconLoaded
      url={url}
      position={position}
      rotationY={rotationY}
      targetFootprint={targetFootprint}
    />
  );
}

export function preloadTileGlb(url: string): void {
  if (typeof window === 'undefined') {
    return;
  }

  const bareUrl = url.split('?')[0];
  fetch(bareUrl, { method: 'HEAD' })
    .then((response) => {
      if (response.ok) {
        useGLTF.preload(url);
      }
    })
    .catch(() => {
      /* Model not exported yet. */
    });
}
