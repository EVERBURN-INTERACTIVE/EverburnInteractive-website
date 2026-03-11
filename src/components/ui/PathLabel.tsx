'use client';

import { Html } from '@react-three/drei';

import { PathConfig } from '@/types/scene';

interface PathLabelProps {
  path: PathConfig;
  visible: boolean;
}

export function PathLabel({ path, visible }: PathLabelProps) {
  const position: [number, number, number] = [
    path.position[0] * 0.8,
    0.3,
    path.position[2] * 0.8,
  ];

  return (
    <Html position={position} center>
      <div className="path-label" style={{ opacity: visible ? 1 : 0 }}>
        {path.label}
      </div>
    </Html>
  );
}