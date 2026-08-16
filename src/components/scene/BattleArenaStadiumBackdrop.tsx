'use client';

import { useGLTF } from '@react-three/drei';
import { useMemo } from 'react';
import { Box3, Mesh, MeshPhysicalMaterial, MeshStandardMaterial, Object3D, Vector3 } from 'three';

import { BATTLE_ARENA_STADIUM } from '@/lib/battleArenaTrackLayout';
import { prepareGltfObject } from './TileGlbIcon';

function enhanceStadiumMaterials(root: Object3D): void {
  root.traverse((child) => {
    if (!(child instanceof Mesh)) {
      return;
    }

    const materials = Array.isArray(child.material) ? child.material : [child.material];
    materials.forEach((material) => {
      if (!(material instanceof MeshStandardMaterial) && !(material instanceof MeshPhysicalMaterial)) {
        return;
      }

      material.metalness = Math.min(0.92, material.metalness * 1.15 + 0.18);
      material.roughness = Math.max(0.14, material.roughness * 0.82);
      material.envMapIntensity = 1.35;

      const hsl = { h: 0, s: 0, l: 0 };
      material.color.getHSL(hsl);

      if (hsl.l > 0.5 || material.name.toLowerCase().includes('screen')) {
        material.emissive.setHex(0x2244cc);
        material.emissiveIntensity = Math.max(material.emissiveIntensity, 0.55);
      } else if (hsl.l < 0.22) {
        material.emissive.setHex(0x0a1838);
        material.emissiveIntensity = Math.max(material.emissiveIntensity, 0.28);
      }
    });
  });
}

function prepareStadiumObject(root: Object3D): void {
  prepareGltfObject(root);
  enhanceStadiumMaterials(root);
  root.traverse((child) => {
    if (child instanceof Mesh) {
      child.raycast = () => undefined;
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
}

/** Colosseum / grandstand shell behind the circuit. */
export function BattleArenaStadiumBackdrop() {
  const { scene } = useGLTF(BATTLE_ARENA_STADIUM.url);

  const model = useMemo(() => {
    const clone = scene.clone(true);
    clone.updateMatrixWorld(true);

    const bounds = new Box3().setFromObject(clone);
    const size = new Vector3();
    bounds.getSize(size);

    const footprint = Math.max(size.x, size.z);
    const scale = footprint > 0 ? BATTLE_ARENA_STADIUM.targetFootprint / footprint : 1;
    clone.scale.setScalar(scale);
    clone.updateMatrixWorld(true);

    const scaledBounds = new Box3().setFromObject(clone);
    const center = scaledBounds.getCenter(new Vector3());
    clone.position.set(-center.x, -scaledBounds.min.y, -center.z);

    prepareStadiumObject(clone);
    return clone;
  }, [scene]);

  return (
    <group
      position={BATTLE_ARENA_STADIUM.position}
      rotation={[0, BATTLE_ARENA_STADIUM.rotationY, 0]}
      name="BattleArenaStadiumBackdrop"
    >
      <primitive object={model} />
    </group>
  );
}

useGLTF.preload(BATTLE_ARENA_STADIUM.url);
