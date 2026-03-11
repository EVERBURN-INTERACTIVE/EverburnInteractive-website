'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Group, Mesh, MeshStandardMaterial } from 'three';

interface SkyDomeProps {
  dimmed: boolean;
}

interface CloudSpec {
  position: [number, number, number];
  scale: [number, number, number];
  speed: number;
  opacity: number;
}

export function SkyDome({ dimmed }: SkyDomeProps) {
  const cloudRefs = useRef<Array<Group | null>>([]);
  const cloudSpecs = useMemo<CloudSpec[]>(() => [
    { position: [-3.4, 4.1, -2.8], scale: [1.15, 0.36, 1], speed: 0.12, opacity: 0.56 },
    { position: [2.5, 4.7, -1.6], scale: [1.3, 0.4, 1.08], speed: 0.1, opacity: 0.54 },
    { position: [4.2, 3.9, 1.4], scale: [1.05, 0.33, 0.9], speed: 0.11, opacity: 0.49 },
    { position: [-4.6, 5.1, 1.8], scale: [1.2, 0.38, 1.02], speed: 0.095, opacity: 0.54 },
    { position: [0.4, 5.4, 3.4], scale: [1.38, 0.42, 1.16], speed: 0.085, opacity: 0.46 },
  ], []);

  useFrame(({ clock }) => {
    const elapsed = clock.elapsedTime;
    cloudRefs.current.forEach((group, index) => {
      if (!group) {
        return;
      }

      const drift = Math.sin(elapsed * cloudSpecs[index].speed + index * 1.2) * 0.9;
      const fadeCycle = (Math.sin(elapsed * 0.2 + index * 1.9) + 1) * 0.5;
      const fadeStrength = 0.14 + fadeCycle * 0.86;

      group.position.x = cloudSpecs[index].position[0] + drift;
      group.position.z = cloudSpecs[index].position[2] + Math.cos(elapsed * cloudSpecs[index].speed + index) * 0.45;
      group.position.y = cloudSpecs[index].position[1] + Math.sin(elapsed * 0.14 + index) * 0.18;

      group.children.forEach((child) => {
        if (child.type !== 'Mesh') {
          return;
        }

        const cloudMaterial = (child as Mesh).material as MeshStandardMaterial;
        if (!cloudMaterial) {
          return;
        }

        const baseOpacity = Number(cloudMaterial.userData.baseOpacity ?? 0.4);
        cloudMaterial.opacity = baseOpacity * fadeStrength;
      });
    });
  });

  const cloudOpacityMultiplier = dimmed ? 0.55 : 1;

  return (
    <group>
      {cloudSpecs.map((cloud, index) => (
        <group
          key={`cloud-${index}`}
          ref={(node) => {
            cloudRefs.current[index] = node;
          }}
          position={cloud.position}
          scale={cloud.scale}
        >
          <mesh position={[-0.96, 0.08, 0]} scale={[1.2, 0.58, 0.85]}>
            <sphereGeometry args={[1.1, 16, 16]} />
            <meshStandardMaterial
              color="#ffffff"
              roughness={0.9}
              metalness={0}
              transparent
              opacity={cloud.opacity * cloudOpacityMultiplier}
              userData={{ baseOpacity: cloud.opacity * cloudOpacityMultiplier }}
            />
          </mesh>
          <mesh position={[0.22, 0.12, -0.12]} scale={[1.15, 0.52, 0.82]}>
            <sphereGeometry args={[1.05, 16, 16]} />
            <meshStandardMaterial
              color="#f7f9ff"
              roughness={0.9}
              metalness={0}
              transparent
              opacity={cloud.opacity * 0.95 * cloudOpacityMultiplier}
              userData={{ baseOpacity: cloud.opacity * 0.95 * cloudOpacityMultiplier }}
            />
          </mesh>
          <mesh position={[1.06, 0.05, 0.08]} scale={[1.04, 0.5, 0.78]}>
            <sphereGeometry args={[0.98, 16, 16]} />
            <meshStandardMaterial
              color="#eef2ff"
              roughness={0.9}
              metalness={0}
              transparent
              opacity={cloud.opacity * 0.9 * cloudOpacityMultiplier}
              userData={{ baseOpacity: cloud.opacity * 0.9 * cloudOpacityMultiplier }}
            />
          </mesh>
          <mesh position={[0.1, -0.18, 0.03]} scale={[1.4, 0.38, 0.9]}>
            <sphereGeometry args={[1.06, 16, 16]} />
            <meshStandardMaterial
              color="#ffffff"
              roughness={0.95}
              metalness={0}
              transparent
              opacity={cloud.opacity * 0.45 * cloudOpacityMultiplier}
              userData={{ baseOpacity: cloud.opacity * 0.45 * cloudOpacityMultiplier }}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}