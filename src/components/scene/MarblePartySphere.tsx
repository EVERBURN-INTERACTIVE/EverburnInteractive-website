'use client';

import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import { Color, Mesh, MeshStandardMaterial } from 'three';

import { PAGE_TILE_SURFACE_Y } from './TileGlbIcon';

export interface MarblePartySphereProps {
  position?: [number, number, number];
  radius?: number;
}

export function MarblePartySphere({
  position = [0, PAGE_TILE_SURFACE_Y + 0.46, 0],
  radius = 0.52,
}: MarblePartySphereProps) {
  const meshRef = useRef<Mesh>(null);
  const colorRef = useRef(new Color());

  useFrame(({ clock }) => {
    const mesh = meshRef.current;
    if (!mesh) {
      return;
    }

    const material = mesh.material as MeshStandardMaterial;
    const hue = (clock.elapsedTime * 0.22) % 1;
    colorRef.current.setHSL(hue, 0.92, 0.56);
    material.color.copy(colorRef.current);
    material.emissive.copy(colorRef.current);
    material.emissiveIntensity = 0.42;
  });

  return (
    <mesh ref={meshRef} position={position} castShadow receiveShadow>
      <sphereGeometry args={[radius, 40, 40]} />
      <meshStandardMaterial roughness={0.22} metalness={0.28} />
    </mesh>
  );
}
