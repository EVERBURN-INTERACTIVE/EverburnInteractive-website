'use client';

import { useEffect, useMemo, useRef } from 'react';
import { AdditiveBlending, CanvasTexture, LinearFilter } from 'three';
import type { BufferAttribute, Points, PointsMaterial, Texture } from 'three';
import { useFrame, useThree } from '@react-three/fiber';

interface StarsProps {
  count: number;
  reducedMotion: boolean;
}

export function Stars({ count, reducedMotion }: StarsProps) {
  const pointsRef = useRef<Points | null>(null);
  const positionAttrRef = useRef<BufferAttribute | null>(null);
  const previousCameraRef = useRef<{ x: number; y: number; z: number } | null>(null);
  const driftOffsetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const { camera, viewport } = useThree();
  const initialPositions = useMemo<Float32Array>(() => new Float32Array(count * 3), [count]);

  const starTexture = useMemo<Texture | null>(() => {
    if (typeof document === 'undefined') {
      return null;
    }

    const size = 64;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const context = canvas.getContext('2d');

    if (!context) {
      return null;
    }

    context.clearRect(0, 0, size, size);
    const center = size / 2;

    const cross = context.createLinearGradient(center, 0, center, size);
    cross.addColorStop(0, 'rgba(255,255,255,0)');
    cross.addColorStop(0.49, 'rgba(255,255,255,0.38)');
    cross.addColorStop(0.51, 'rgba(255,255,255,0.38)');
    cross.addColorStop(1, 'rgba(255,255,255,0)');
    context.fillStyle = cross;
    context.fillRect(center - 0.95, 16, 1.9, size - 32);

    const crossHorizontal = context.createLinearGradient(0, center, size, center);
    crossHorizontal.addColorStop(0, 'rgba(255,255,255,0)');
    crossHorizontal.addColorStop(0.49, 'rgba(255,255,255,0.38)');
    crossHorizontal.addColorStop(0.51, 'rgba(255,255,255,0.38)');
    crossHorizontal.addColorStop(1, 'rgba(255,255,255,0)');
    context.fillStyle = crossHorizontal;
    context.fillRect(16, center - 0.95, size - 32, 1.9);

    const core = context.createRadialGradient(center, center, 0, center, center, 16);
    core.addColorStop(0, 'rgba(255,255,255,1)');
    core.addColorStop(0.46, 'rgba(255,255,255,0.95)');
    core.addColorStop(1, 'rgba(255,255,255,0)');
    context.fillStyle = core;
    context.beginPath();
    context.arc(center, center, 12, 0, Math.PI * 2);
    context.fill();

    const texture = new CanvasTexture(canvas);
    texture.minFilter = LinearFilter;
    texture.magFilter = LinearFilter;
    texture.needsUpdate = true;
    return texture;
  }, []);

  useEffect(() => {
    return () => {
      starTexture?.dispose();
    };
  }, [starTexture]);

  const seeds = useMemo<Array<{ x: number; y: number; depth: number; twinkle: number }>>(
    () => Array.from({ length: count }, (_, i) => ({
      x: (((i * 41) % 100) / 50) - 1,
      y: (((i * 17) % 100) / 50) - 1,
      depth: ((i * 29) % 100) / 100,
      twinkle: (i * 0.19) % (Math.PI * 2),
    })),
    [count],
  );

  useFrame(({ clock }) => {
    if (!pointsRef.current || !positionAttrRef.current) {
      return;
    }

    if (!previousCameraRef.current) {
      previousCameraRef.current = {
        x: camera.position.x,
        y: camera.position.y,
        z: camera.position.z,
      };
    }

    const prev = previousCameraRef.current;
    const deltaX = camera.position.x - prev.x;
    const deltaY = camera.position.y - prev.y;
    const deltaZ = camera.position.z - prev.z;
    const cameraMoved = Math.abs(deltaX) + Math.abs(deltaY) + Math.abs(deltaZ) > 0.0004;

    if (cameraMoved) {
      driftOffsetRef.current.x += deltaX * 0.22 + deltaZ * 0.08;
      driftOffsetRef.current.y += deltaY * 0.12 + deltaZ * 0.07;
      previousCameraRef.current = {
        x: camera.position.x,
        y: camera.position.y,
        z: camera.position.z,
      };
    }

    const view = viewport.getCurrentViewport(camera, camera.position);
    const halfWidth = view.width * 0.5;
    const halfHeight = view.height * 0.5;
    const positions = positionAttrRef.current.array as Float32Array;
    const driftX = driftOffsetRef.current.x;
    const driftY = driftOffsetRef.current.y;

    for (let i = 0; i < count; i += 1) {
      const seed = seeds[i];
      const depthParallax = 0.5 + seed.depth * 0.9;
      positions[i * 3] = seed.x * halfWidth * 0.95 + driftX * depthParallax;
      positions[i * 3 + 1] = seed.y * halfHeight * 0.95 + driftY * depthParallax;
      positions[i * 3 + 2] = -172 - seed.depth * 22;
    }

    positionAttrRef.current.needsUpdate = true;
    pointsRef.current.position.set(camera.position.x, camera.position.y, camera.position.z);
    pointsRef.current.quaternion.copy(camera.quaternion);

    const material = pointsRef.current.material as PointsMaterial;
    if (!reducedMotion) {
      material.opacity = 0.72 + Math.sin(clock.elapsedTime * 5.6) * 0.2 + Math.sin(clock.elapsedTime * 13.4) * 0.1;
      material.size = 2.7 + Math.sin(clock.elapsedTime * 6.2) * 0.24;
    } else {
      material.opacity = 0.72;
      material.size = 2.7;
    }
  });

  return (
    <points ref={pointsRef} renderOrder={-20}>
      <bufferGeometry>
        <bufferAttribute
          ref={(node) => {
            positionAttrRef.current = node;
          }}
          attach="attributes-position"
          count={count}
          args={[initialPositions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        map={starTexture ?? undefined}
        alphaMap={starTexture ?? undefined}
        color="#f4f8ff"
        size={2.8}
        sizeAttenuation={false}
        transparent
        opacity={0.84}
        depthWrite={false}
        depthTest
        blending={AdditiveBlending}
        fog={false}
      />
    </points>
  );
}