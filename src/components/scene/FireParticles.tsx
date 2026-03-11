'use client';

import { useMemo, useRef } from 'react';
import type { InstancedMesh } from 'three';
import { Color, Object3D } from 'three';
import { useFrame } from '@react-three/fiber';

interface FireParticlesProps {
  count: number;
  reducedMotion: boolean;
}

interface FireSeed {
  angle: number;
  radius: number;
  speed: number;
  offset: number;
  drift: number;
}

export function FireParticles({ count, reducedMotion }: FireParticlesProps) {
  const meshRef = useRef<InstancedMesh | null>(null);
  const helper = useMemo(() => new Object3D(), []);
  const seeds = useMemo<FireSeed[]>(() => {
    return Array.from({ length: count }, (_, index) => ({
      angle: (index / count) * Math.PI * 2,
      radius: 0.05 + ((index * 17) % 100) / 1500,
      speed: 0.55 + ((index * 13) % 100) / 140,
      offset: ((index * 31) % 100) / 100,
      drift: ((index * 19) % 100) / 100,
    }));
  }, [count]);

  useFrame(({ clock }) => {
    if (!meshRef.current) {
      return;
    }

    const time = clock.elapsedTime;
    const riseScale = reducedMotion ? 0.35 : 1;

    for (let index = 0; index < seeds.length; index += 1) {
      const seed = seeds[index];
      const cycle = (time * seed.speed * riseScale + seed.offset) % 1;
      const y = 0.1 + cycle * 2.4;
      const swirl = seed.angle + time * (reducedMotion ? 0.2 : 0.8) + seed.drift;
      const radius = seed.radius * (1 + cycle * 1.8);

      helper.position.set(Math.cos(swirl) * radius, y, Math.sin(swirl) * radius);
      helper.scale.setScalar(Math.max(0.02, (1 - cycle) * 0.22));
      helper.rotation.set(0, swirl, 0);
      helper.updateMatrix();
      meshRef.current.setMatrixAt(index, helper.matrix);
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[0.12, 8, 8]} />
      <meshBasicMaterial color={new Color('#ff8c2a')} transparent opacity={0.72} depthWrite={false} />
    </instancedMesh>
  );
}