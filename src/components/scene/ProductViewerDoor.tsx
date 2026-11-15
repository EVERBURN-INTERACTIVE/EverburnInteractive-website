'use client';

import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import { Group, MeshStandardMaterial } from 'three';

import { PAGE_TILE_SURFACE_Y } from './TileGlbIcon';

export interface ProductViewerDoorProps {
  position?: [number, number, number];
}

/** Simple procedural neon door icon for the PRODUCT VIEWER project tile. */
export function ProductViewerDoor({
  position = [0, PAGE_TILE_SURFACE_Y + 0.08, 0],
}: ProductViewerDoorProps) {
  const groupRef = useRef<Group>(null);
  const neonFrame = useMemo(
    () =>
      new MeshStandardMaterial({
        color: '#4df0ff',
        emissive: '#4df0ff',
        emissiveIntensity: 0.7,
        roughness: 0.25,
        metalness: 0.15,
      }),
    [],
  );
  const neonHandle = useMemo(
    () =>
      new MeshStandardMaterial({
        color: '#ff6a00',
        emissive: '#ff6a00',
        emissiveIntensity: 0.65,
        roughness: 0.3,
        metalness: 0.2,
      }),
    [],
  );

  useFrame(({ clock }) => {
    const pulse = 0.55 + Math.sin(clock.elapsedTime * 2.4) * 0.28;
    neonFrame.emissiveIntensity = pulse;
    neonHandle.emissiveIntensity = pulse * 0.9;
  });

  return (
    <group ref={groupRef} position={position} scale={0.92}>
      <mesh position={[0, 0.02, 0.02]} receiveShadow>
        <boxGeometry args={[1.05, 0.04, 0.42]} />
        <meshStandardMaterial color="#14141c" roughness={0.85} metalness={0.2} />
      </mesh>

      <mesh position={[0, 0.72, 0]} castShadow>
        <boxGeometry args={[0.72, 1.28, 0.08]} />
        <meshStandardMaterial color="#1a1a24" roughness={0.45} metalness={0.35} />
      </mesh>

      <mesh position={[-0.42, 0.72, 0.02]} castShadow material={neonFrame}>
        <boxGeometry args={[0.07, 1.42, 0.12]} />
      </mesh>
      <mesh position={[0.42, 0.72, 0.02]} castShadow material={neonFrame}>
        <boxGeometry args={[0.07, 1.42, 0.12]} />
      </mesh>
      <mesh position={[0, 1.4, 0.02]} castShadow material={neonFrame}>
        <boxGeometry args={[0.91, 0.07, 0.12]} />
      </mesh>
      <mesh position={[0, 0.04, 0.02]} castShadow material={neonFrame}>
        <boxGeometry args={[0.91, 0.07, 0.12]} />
      </mesh>

      <mesh position={[0.22, 0.7, 0.08]} castShadow material={neonHandle}>
        <boxGeometry args={[0.05, 0.18, 0.05]} />
      </mesh>
    </group>
  );
}
