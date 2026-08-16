'use client';

import { useMemo, useRef } from 'react';
import type { Group, Mesh } from 'three';
import { ConeGeometry } from 'three';
import { useFrame } from '@react-three/fiber';

import { TILE_SIZE } from '@/lib/gridConstants';

export interface TreeClusterProps {
  x: number;
  z: number;
  /** Center the cluster on a page tile icon instead of grid world coordinates. */
  tileIcon?: boolean;
}

export function TreeCluster({ x, z, tileIcon = false }: TreeClusterProps) {
  const baseX = tileIcon ? 0 : x * TILE_SIZE;
  const baseZ = tileIcon ? 0 : z * TILE_SIZE;
  const lowerCanopyRefs = useRef<Array<Mesh | null>>([]);
  const upperCanopyRefs = useRef<Array<Mesh | null>>([]);
  const ringRefs = useRef<Array<Mesh | null>>([]);
  const treeGroupRefs = useRef<Array<Group | null>>([]);
  const treeConfigs = useMemo(() => {
    const baseOffsets: Array<[number, number]> = [
      [-0.82, -0.84],
      [0.9, -0.42],
      [-0.12, 0.82],
    ];

    return baseOffsets.map(([offsetX, offsetZ], index) => {
      const seed = Math.abs(Math.sin((x + 2.17) * 12.9898 + (z - 1.13) * 78.233 + index * 39.425));
      return {
        offset: [offsetX, offsetZ] as [number, number],
        scale: 0.78 + seed * 0.24,
        ringY: 1.04 + seed * 0.22,
        ringSpeed: 1.05 + seed * 0.45,
      };
    });
  }, [x, z]);

  useFrame(({ clock }) => {
    const time = clock.elapsedTime;

    treeGroupRefs.current.forEach((treeGroup, index) => {
      if (!treeGroup) {
        return;
      }

      const sway = Math.sin(time * 0.56 + index * 0.55 + x * 0.45 + z * 0.28) * 0.08;
      treeGroup.rotation.z = sway;
      treeGroup.rotation.x = sway * 0.18;
    });

    lowerCanopyRefs.current.forEach((canopy, index) => {
      if (!canopy) {
        return;
      }

      const sway = Math.sin(time * 0.7 + index * 0.62 + x * 0.25 + z * 0.22) * 0.18;
      canopy.rotation.z = sway;
      canopy.rotation.x = sway * 0.35;
    });

    upperCanopyRefs.current.forEach((canopy, index) => {
      if (!canopy) {
        return;
      }

      const sway = Math.sin(time * 0.86 + index * 0.75 + x * 0.2 + z * 0.18) * 0.22;
      canopy.rotation.z = sway;
      canopy.rotation.x = sway * 0.5;
    });

    ringRefs.current.forEach((ring, index) => {
      if (!ring) {
        return;
      }

      ring.rotation.z = time * treeConfigs[index].ringSpeed + index * 0.8;
      ring.position.y = treeConfigs[index].ringY + Math.sin(time * 1.8 + index) * 0.12;
    });
  });

  return (
    <group>
      {treeConfigs.map((tree, index) => (
        <group
          key={`tree-${x}-${z}-${index}`}
          ref={(node) => {
            treeGroupRefs.current[index] = node;
          }}
          position={[baseX + tree.offset[0], 0.12, baseZ + tree.offset[1]]}
          scale={[tree.scale, tree.scale, tree.scale]}
        >
          <mesh position={[0, 0.35, 0]} castShadow>
            <cylinderGeometry args={[0.16, 0.2, 0.7, 6]} />
            <meshStandardMaterial color="#6a4023" emissive="#2c1407" emissiveIntensity={0.15} roughness={0.9} />
          </mesh>
          <mesh
            ref={(node) => {
              lowerCanopyRefs.current[index] = node;
            }}
            position={[0, 1.0, 0]}
            castShadow
          >
            <coneGeometry args={[0.78, 1.15, 6]} />
            <meshStandardMaterial
              color="#2f9d57"
              emissive="#1eff7a"
              emissiveIntensity={0.35}
              roughness={0.8}
              metalness={0.1}
            />
            <lineSegments>
              <edgesGeometry args={[new ConeGeometry(0.78, 1.15, 6)]} />
              <lineBasicMaterial color="#6ad6ff" />
            </lineSegments>
          </mesh>
          <mesh
            ref={(node) => {
              upperCanopyRefs.current[index] = node;
            }}
            position={[0, 1.58, 0]}
            castShadow
          >
            <coneGeometry args={[0.54, 0.9, 6]} />
            <meshStandardMaterial
              color="#49c96e"
              emissive="#52ff98"
              emissiveIntensity={0.45}
              roughness={0.8}
              metalness={0.1}
            />
            <lineSegments>
              <edgesGeometry args={[new ConeGeometry(0.54, 0.9, 6)]} />
              <lineBasicMaterial color="#8be7ff" />
            </lineSegments>
          </mesh>
          <mesh
            ref={(node) => {
              ringRefs.current[index] = node;
            }}
            position={[0, 1.2, 0]}
            rotation={[Math.PI / 2, 0, 0]}
          >
            <torusGeometry args={[0.82, 0.03, 12, 40]} />
            <meshStandardMaterial
              color="#72ff9b"
              emissive="#44ff88"
              emissiveIntensity={2}
              roughness={0.1}
              metalness={0.2}
              transparent
              opacity={0.8}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}
