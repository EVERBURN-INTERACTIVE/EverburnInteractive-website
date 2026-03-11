'use client';

import { useEffect, useMemo, useRef } from 'react';
import { AdditiveBlending, CanvasTexture, LinearFilter, Mesh, PointLight, Sprite } from 'three';
import { useFrame } from '@react-three/fiber';

interface CampfireProps {
  reducedMotion: boolean;
}

export function Campfire({ reducedMotion }: CampfireProps) {
  const lightRef = useRef<PointLight | null>(null);
  const flameRefs = useRef<Array<Sprite | null>>([]);
  const sparkRefs = useRef<Array<Mesh | null>>([]);
  const flameBaseScales: Array<[number, number, number]> = [
    [0.98, 1.36, 1],
    [0.72, 1.02, 1],
    [0.44, 0.66, 1],
  ];
  const sparkSeeds = useMemo<Array<{ angle: number; radius: number; offset: number; speed: number }>>(() => (
    Array.from({ length: 12 }, (_, index) => ({
      angle: (index / 12) * Math.PI * 2,
      radius: 0.26 + (index % 4) * 0.06,
      offset: index * 0.37,
      speed: 0.45 + (index % 3) * 0.12,
    }))
  ), []);

  const flameTexture = useMemo(() => {
    if (typeof document === 'undefined') {
      return null;
    }

    const width = 96;
    const height = 128;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d');

    if (!context) {
      return null;
    }

    const scaleX = width / 25;
    const scaleY = height / 35;
    context.save();
    context.scale(scaleX, scaleY);
    const flamePath = new Path2D('M12.5 1C16 8 22 11 22 19C22 27 17.5 34 12.5 34C7.5 34 3 27 3 19C3 11 9 8 12.5 1Z');
    context.fillStyle = '#ffffff';
    context.fill(flamePath);
    context.restore();

    const texture = new CanvasTexture(canvas);
    texture.minFilter = LinearFilter;
    texture.magFilter = LinearFilter;
    texture.needsUpdate = true;
    return texture;
  }, []);

  useEffect(() => {
    return () => {
      flameTexture?.dispose();
    };
  }, [flameTexture]);

  useFrame(({ clock }) => {
    if (!lightRef.current) {
      return;
    }

    const speed = reducedMotion ? 2 : 8;
    const flicker = Math.sin(clock.elapsedTime * speed) * 0.25 + Math.sin(clock.elapsedTime * (speed * 1.6)) * 0.14;
    lightRef.current.intensity = 5.1 + flicker * 1.2;

    flameRefs.current.forEach((flame, index) => {
      if (!flame) {
        return;
      }

      const wobble = Math.sin(clock.elapsedTime * (reducedMotion ? 1.6 : 6.2) + index * 0.65) * 0.08;
      const pulse = 1 + Math.sin(clock.elapsedTime * (reducedMotion ? 1.8 : 9.2) + index) * 0.06;
      const baseScale = flameBaseScales[index];
      flame.position.x = wobble * 0.35;
      flame.position.z = Math.cos(clock.elapsedTime * 4.8 + index) * 0.04;
      flame.scale.set(baseScale[0] * (1 + wobble), baseScale[1] * pulse, baseScale[2]);
    });

    sparkRefs.current.forEach((spark, index) => {
      if (!spark) {
        return;
      }

      const seed = sparkSeeds[index];
      const cycle = (clock.elapsedTime * seed.speed) % 1;
      const progress = (cycle + seed.offset) % 1;
      spark.visible = progress > 0.12;

      if (!spark.visible) {
        return;
      }

      const rise = (progress - 0.12) / 0.88;
      const swirl = Math.sin(clock.elapsedTime * 7 + index) * 0.1;
      spark.position.x = Math.cos(seed.angle + swirl) * seed.radius * (1 - rise * 0.22);
      spark.position.y = 0.78 + rise * 1.28;
      spark.position.z = Math.sin(seed.angle + swirl) * seed.radius * (1 - rise * 0.22);
      const scale = Math.max(0.03, 0.07 - rise * 0.05);
      spark.scale.setScalar(scale);
    });
  });

  return (
    <group position={[0, 0.12, 0]}>
      <mesh rotation={[0, Math.PI / 4, Math.PI / 2]} position={[0, 0.1, 0]}>
        <cylinderGeometry args={[0.16, 0.16, 1.3]} />
        <meshStandardMaterial color="#5c3a1e" roughness={0.9} />
      </mesh>
      <mesh rotation={[0, -Math.PI / 4, Math.PI / 2]} position={[0, 0.1, 0]}>
        <cylinderGeometry args={[0.16, 0.16, 1.3]} />
        <meshStandardMaterial color="#5c3a1e" roughness={0.9} />
      </mesh>
      <sprite
        ref={(node) => {
          flameRefs.current[0] = node;
        }}
        position={[0, 0.86, 0]}
        scale={flameBaseScales[0]}
      >
        <spriteMaterial
          map={flameTexture ?? undefined}
          alphaMap={flameTexture ?? undefined}
          color="#ff6a00"
          transparent
          opacity={0.98}
          blending={AdditiveBlending}
          depthWrite={false}
        />
      </sprite>
      <sprite
        ref={(node) => {
          flameRefs.current[1] = node;
        }}
        position={[0, 1.16, 0.01]}
        scale={flameBaseScales[1]}
      >
        <spriteMaterial
          map={flameTexture ?? undefined}
          alphaMap={flameTexture ?? undefined}
          color="#ffd786"
          transparent
          opacity={0.93}
          blending={AdditiveBlending}
          depthWrite={false}
        />
      </sprite>
      <sprite
        ref={(node) => {
          flameRefs.current[2] = node;
        }}
        position={[0, 1.36, 0.02]}
        scale={flameBaseScales[2]}
      >
        <spriteMaterial
          map={flameTexture ?? undefined}
          alphaMap={flameTexture ?? undefined}
          color="#fff2c6"
          transparent
          opacity={0.9}
          blending={AdditiveBlending}
          depthWrite={false}
        />
      </sprite>
      {sparkSeeds.map((seed, index) => (
        <mesh
          key={`campfire-spark-${seed.offset}-${index}`}
          ref={(node) => {
            sparkRefs.current[index] = node;
          }}
          position={[0, 0.5, 0]}
        >
          <sphereGeometry args={[0.06, 6, 6]} />
          <meshBasicMaterial color="#ffd8a0" transparent opacity={0.95} />
        </mesh>
      ))}
      <pointLight ref={lightRef} color="#ff8a33" intensity={6.8} distance={21} decay={1.7} />
      <pointLight color="#ffb36f" intensity={2.1} distance={28} decay={1.5} position={[0, 0.95, 0]} />
    </group>
  );
}