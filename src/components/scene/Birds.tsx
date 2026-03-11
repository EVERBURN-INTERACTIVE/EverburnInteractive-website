'use client';

import { useMemo, useRef } from 'react';
import type { Group } from 'three';
import { useFrame } from '@react-three/fiber';

interface BirdsProps {
  count: number;
  reducedMotion: boolean;
}

export function Birds({ count, reducedMotion }: BirdsProps) {
  const groupRef = useRef<Group | null>(null);
  const seeds = useMemo<number[]>(() => {
    return Array.from({ length: count }, (_, index) => index * 1.37);
  }, [count]);

  useFrame(({ clock }) => {
    if (!groupRef.current || reducedMotion) {
      return;
    }

    const time = clock.elapsedTime;
    const dt = 0.05;
    for (let index = 0; index < groupRef.current.children.length; index += 1) {
      const bird = groupRef.current.children[index];
      const seed = seeds[index];
      const travel = ((time * 0.11 + seed * 0.17) % 1) * 2 - 1;
      const x = travel * 24;
      const z = -6 + index * 3.2 + Math.sin(time * 0.5 + seed) * 1.2;
      const y = 8 + Math.sin(time * 1.4 + seed) * 0.35;

      const travelNext = (((time + dt) * 0.11 + seed * 0.17) % 1) * 2 - 1;
      const nextX = travelNext * 24;
      const nextZ = -6 + index * 3.2 + Math.sin((time + dt) * 0.5 + seed) * 1.2;
      const dx = nextX - x;
      const dz = nextZ - z;

      bird.position.set(x, y, z);
      bird.rotation.y = Math.atan2(dx, dz);

      const leftWing = bird.children[0];
      const rightWing = bird.children[1];
      const flap = Math.sin(time * 8 + seed) * 0.4;
      leftWing.rotation.z = flap;
      rightWing.rotation.z = -flap;
    }
  });

  return (
    <group ref={groupRef}>
      {seeds.map((seed, index) => (
        <group key={`bird-${seed}-${index}`}>
          <mesh position={[-0.16, 0, 0]} rotation={[0, 0, 0.12]}>
            <boxGeometry args={[0.34, 0.03, 0.12]} />
            <meshStandardMaterial color="#1f1f1f" roughness={0.75} />
          </mesh>
          <mesh position={[0.16, 0, 0]} rotation={[0, 0, -0.12]}>
            <boxGeometry args={[0.34, 0.03, 0.12]} />
            <meshStandardMaterial color="#1f1f1f" roughness={0.75} />
          </mesh>
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshStandardMaterial color="#171717" roughness={0.8} />
          </mesh>
          <mesh position={[0, 0, 0.08]} rotation={[Math.PI / 2, 0, 0]}>
            <coneGeometry args={[0.018, 0.06, 8]} />
            <meshStandardMaterial color="#f0b55e" roughness={0.8} />
          </mesh>
        </group>
      ))}
    </group>
  );
}