'use client';

import { useEffect, useMemo, useRef } from 'react';
import { AdditiveBlending, CanvasTexture, LinearFilter } from 'three';
import type { Group, Mesh, MeshBasicMaterial, Texture } from 'three';
import { useFrame, useThree } from '@react-three/fiber';

export function ShootingStars() {
  const groupRef = useRef<Group | null>(null);
  const { camera, viewport } = useThree();
  const meteorRef = useRef<{
    spawnAt: number;
    duration: number;
  }>({
    spawnAt: 0.2,
    duration: 0.42,
  });

  // Fixed trajectory controls: edit these to adjust star position and angle.
  const START_X_RATIO = 1.5;
  const START_Y_RATIO = 0.72;
  const END_X_RATIO = -5.58;
  const END_Y_RATIO = -0.72;
  const STAR_DEPTH = -120;
  const STAR_TILT = 0;

  const trailTexture = useMemo<Texture | null>(() => {
    if (typeof document === 'undefined') {
      return null;
    }

    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 32;
    const context = canvas.getContext('2d');

    if (!context) {
      return null;
    }

    const gradient = context.createLinearGradient(0, 0, canvas.width, 0);
    gradient.addColorStop(0, 'rgba(180,205,255,0)');
    gradient.addColorStop(0.72, 'rgba(214,232,255,0.55)');
    gradient.addColorStop(1, 'rgba(255,255,255,0.95)');
    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, canvas.height);

    const texture = new CanvasTexture(canvas);
    texture.minFilter = LinearFilter;
    texture.magFilter = LinearFilter;
    texture.needsUpdate = true;
    return texture;
  }, []);

  useEffect(() => {
    return () => {
      trailTexture?.dispose();
    };
  }, [trailTexture]);

  useFrame(({ clock }) => {
    if (!groupRef.current) {
      return;
    }

    const view = viewport.getCurrentViewport(camera, camera.position);
    const halfWidth = view.width * 0.5;
    const halfHeight = view.height * 0.5;

    groupRef.current.position.copy(camera.position);
    groupRef.current.quaternion.copy(camera.quaternion);

    const time = clock.elapsedTime;
    const star = groupRef.current.children[0];
    const hash = (n: number) => {
      const value = Math.sin(n * 12.9898) * 43758.5453;
      return value - Math.floor(value);
    };

    if (time > meteorRef.current.spawnAt + meteorRef.current.duration) {
      const seed = Math.floor(time * 1000);
      const hiddenGap = 5.6 + hash(seed + 0.9) * 2.8;
      meteorRef.current.spawnAt = time + hiddenGap;
      meteorRef.current.duration = 0.24 + hash(seed + 5.8) * 0.18;
    }

    const progress = (time - meteorRef.current.spawnAt) / meteorRef.current.duration;

    if (progress < 0 || progress > 1) {
      star.visible = false;
      return;
    }

    const startX = halfWidth * START_X_RATIO;
    const startY = halfHeight * START_Y_RATIO;
    const endX = halfWidth * END_X_RATIO;
    const endY = halfHeight * END_Y_RATIO;
    const directionX = endX - startX;
    const directionY = endY - startY;

    star.visible = true;
    star.position.set(startX + directionX * progress, startY + directionY * progress, STAR_DEPTH);
    star.rotation.z = Math.atan2(directionY, directionX) + STAR_TILT;

    const scale = Math.max(0.22, 0.44 - progress * 0.16);
    star.scale.setScalar(scale);

    const head = star.children[0];
    if (head?.type === 'Mesh') {
      const headMaterial = (head as Mesh).material as MeshBasicMaterial;
      headMaterial.opacity = Math.max(0.72, 1 - progress * 0.15);
    }

    const trail = star.children[1];
    if (trail?.type === 'Mesh') {
      const trailMaterial = (trail as Mesh).material as MeshBasicMaterial;
      trailMaterial.opacity = Math.max(0.18, 0.72 - progress * 0.36);
      const flicker = 1 + Math.sin(time * 24) * 0.22;
      trail.scale.set(0.9 + progress * 0.4, flicker, 1);
      if (trailMaterial.map) {
        trailMaterial.map.offset.x = (time * 2.6) % 1;
      }
    }

    for (let i = 2; i <= 4; i += 1) {
      const sparkle = star.children[i];
      if (sparkle?.type !== 'Mesh') {
        continue;
      }

      const sparkleMesh = sparkle as Mesh;
      const sparkleMaterial = sparkleMesh.material as MeshBasicMaterial;
      const jitter = 0.12 + i * 0.03;
      sparkleMesh.position.x = -0.06 - i * 0.03 + Math.sin(time * (18 + i * 2.4)) * jitter;
      sparkleMesh.position.y = Math.cos(time * (22 + i * 1.8)) * 0.09;
      sparkleMesh.position.z = 0;
      sparkleMaterial.opacity = 0.35 + Math.sin(time * (20 + i * 1.3)) * 0.22;
    }
  });

  return (
    <group ref={groupRef} renderOrder={11}>
      <group>
        <mesh>
          <sphereGeometry args={[0.12, 8, 8]} />
          <meshBasicMaterial color="#f8fbff" transparent opacity={1} fog={false} depthWrite={false} />
        </mesh>
        <mesh position={[-1.14, 0, 0]}>
          <planeGeometry args={[2.26, 0.2]} />
          <meshBasicMaterial
            map={trailTexture ?? undefined}
            alphaMap={trailTexture ?? undefined}
            color="#d6e6ff"
            transparent
            opacity={0.72}
            depthWrite={false}
            blending={AdditiveBlending}
            fog={false}
          />
        </mesh>
        <mesh position={[-0.18, 0.04, 0]}>
          <sphereGeometry args={[0.05, 6, 6]} />
          <meshBasicMaterial color="#dff0ff" transparent opacity={0.42} depthWrite={false} fog={false} />
        </mesh>
        <mesh position={[-0.26, -0.02, 0]}>
          <sphereGeometry args={[0.04, 6, 6]} />
          <meshBasicMaterial color="#cde5ff" transparent opacity={0.38} depthWrite={false} fog={false} />
        </mesh>
        <mesh position={[-0.32, 0.05, 0]}>
          <sphereGeometry args={[0.035, 6, 6]} />
          <meshBasicMaterial color="#e8f3ff" transparent opacity={0.34} depthWrite={false} fog={false} />
        </mesh>
      </group>
    </group>
  );
}