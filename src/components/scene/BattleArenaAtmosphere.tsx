'use client';

import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import { Color, Object3D, PointLight } from 'three';

interface BattleArenaAtmosphereProps {
  active: boolean;
}

const NEON_LIGHT_POSITIONS: Array<[number, number, number]> = [
  [-42, 16, -34],
  [42, 16, -34],
  [-42, 16, -14],
  [42, 16, -14],
  [0, 20, -8],
  [-22, 14, -40],
  [22, 14, -40],
  [-28, 10, -24],
  [28, 10, -24],
];

/** Neon-lit night race atmosphere — cyan and magenta floods over the circuit. */
export function BattleArenaAtmosphere({ active }: BattleArenaAtmosphereProps) {
  const lightRefs = useRef<Array<PointLight | null>>([]);
  const pulseOffset = useMemo(() => Math.random() * Math.PI * 2, []);
  const spotlightTarget = useMemo(() => new Object3D(), []);

  useFrame(({ clock }) => {
    if (!active) {
      return;
    }

    const t = clock.elapsedTime;
    lightRefs.current.forEach((light, index) => {
      if (!light) {
        return;
      }

      const pulse = 0.78 + Math.sin(t * 2.1 + pulseOffset + index * 0.85) * 0.18;
      light.intensity = 3.1 * pulse;
    });
  });

  if (!active) {
    return null;
  }

  return (
    <>
      <hemisphereLight args={['#6a28a8', '#04020c', 0.55]} />
      <ambientLight intensity={0.22} color="#1a2848" />
      {NEON_LIGHT_POSITIONS.map((position, index) => (
        <pointLight
          key={`neon-flood-${index}`}
          ref={(node) => {
            lightRefs.current[index] = node;
          }}
          position={position}
          color={index % 3 === 0 ? new Color('#cc66ff') : new Color('#00e8ff')}
          intensity={3.1}
          distance={110}
          decay={2}
        />
      ))}
      <spotLight
        position={[0, 32, -14]}
        angle={0.62}
        penumbra={0.72}
        intensity={2.4}
        color="#88ddff"
        target={spotlightTarget}
      />
      <primitive object={spotlightTarget} position={[0, -0.5, -28]} />
    </>
  );
}
