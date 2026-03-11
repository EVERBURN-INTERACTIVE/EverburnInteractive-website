'use client';

import { useMemo, useRef } from 'react';
import type { Points } from 'three';
import { AdditiveBlending, BufferAttribute } from 'three';
import { useFrame } from '@react-three/fiber';

interface EmbersProps {
  count: number;
  reducedMotion: boolean;
}

export function Embers({ count, reducedMotion }: EmbersProps) {
  const pointsRef = useRef<Points | null>(null);
  const positions = useMemo<Float32Array>(() => {
    const array = new Float32Array(count * 3);

    for (let i = 0; i < count; i += 1) {
      const angle = (i / count) * Math.PI * 2;
      const radius = 0.4 + ((i * 7) % 100) / 240;

      array[i * 3] = Math.cos(angle) * radius;
      array[i * 3 + 1] = 0.3 + ((i * 11) % 100) / 120;
      array[i * 3 + 2] = Math.sin(angle) * radius;
    }

    return array;
  }, [count]);

  useFrame(({ clock }) => {
    if (!pointsRef.current) {
      return;
    }

    const pos = pointsRef.current.geometry.getAttribute('position') as BufferAttribute;
    const time = clock.elapsedTime;
    const speed = reducedMotion ? 0.12 : 0.4;

    for (let i = 0; i < count; i += 1) {
      const i3 = i * 3;
      const yBase = positions[i3 + 1];
      const y = ((yBase + time * speed + i * 0.02) % 2.8) + 0.2;
      const x = positions[i3] + Math.sin(time * 0.5 + i) * (reducedMotion ? 0.003 : 0.01);
      const z = positions[i3 + 2] + Math.cos(time * 0.5 + i) * (reducedMotion ? 0.003 : 0.01);

      pos.setXYZ(i, x, y, z);
    }

    pos.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#ff6622"
        size={0.08}
        transparent
        opacity={0.6}
        blending={AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}