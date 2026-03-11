'use client';

import { useState } from 'react';

import { PathLabel } from '@/components/ui/PathLabel';
import { PATH_CONFIGS } from '@/types/scene';

interface NavigationPathsProps {
  active: boolean;
  onNavigate: (href: string) => void;
}

export function NavigationPaths({ active, onNavigate }: NavigationPathsProps) {
  const [activePath, setActivePath] = useState<string | null>(null);

  return (
    <group>
      {PATH_CONFIGS.map((path) => {
        const centerPosition: [number, number, number] = [
          path.position[0] / 2,
          0.01,
          path.position[2] / 2,
        ];

        return (
          <group key={path.section}>
            <mesh
              position={centerPosition}
              rotation={path.rotation}
              visible={active}
              onPointerEnter={() => setActivePath(path.section)}
              onPointerLeave={() => setActivePath((current) => (current === path.section ? null : current))}
              onClick={() => onNavigate(path.href)}
            >
              <planeGeometry args={[3, 25]} />
              <meshStandardMaterial color={activePath === path.section ? '#9a7047' : '#8b6340'} roughness={1} />
            </mesh>
            <PathLabel path={path} visible={active && activePath === path.section} />
          </group>
        );
      })}
    </group>
  );
}