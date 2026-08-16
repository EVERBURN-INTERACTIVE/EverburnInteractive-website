import {
  Material,
  Mesh,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  Object3D,
} from 'three';

import { prepareGltfMaterial } from './TileGlbIcon';

/** Orange accent strips — light emissive so they read in the web scene. */
const CAR_ACCENT_MATERIALS = new Set(['Material.003']);

function prepareBattleArenaCarMaterial(material: Material): Material {
  const prepared = prepareGltfMaterial(material);

  if (!(prepared instanceof MeshStandardMaterial) && !(prepared instanceof MeshPhysicalMaterial)) {
    return prepared;
  }

  const mat = prepared;

  // Trust Blender/glTF base color, metalness, and roughness. Only fix export artifacts.
  if (mat.emissive.r + mat.emissive.g + mat.emissive.b < 0.02) {
    mat.emissive.setRGB(0, 0, 0);
    mat.emissiveIntensity = 0;
  }

  if (CAR_ACCENT_MATERIALS.has(mat.name)) {
    mat.emissive.copy(mat.color);
    mat.emissiveIntensity = 0.45;
  }

  mat.envMapIntensity = mat.metalness > 0.5 ? 2.0 : 1.15;
  mat.needsUpdate = true;
  return mat;
}

export function prepareBattleArenaCarObject(root: Object3D): void {
  root.traverse((child) => {
    if (!(child instanceof Mesh)) {
      return;
    }

    child.castShadow = true;
    child.receiveShadow = true;
    child.raycast = () => undefined;

    const materials = Array.isArray(child.material) ? child.material : [child.material];
    const nextMaterials = materials.map((material) => prepareBattleArenaCarMaterial(material));

    if (Array.isArray(child.material)) {
      child.material = nextMaterials;
    } else {
      child.material = nextMaterials[0];
    }
  });
}
