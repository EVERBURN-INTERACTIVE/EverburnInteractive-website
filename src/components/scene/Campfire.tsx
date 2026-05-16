'use client';

import { useEffect, useMemo, useRef } from 'react';
import { AdditiveBlending, CanvasTexture, CylinderGeometry, LinearFilter, Mesh, PointLight, Sprite } from 'three';
import { useFrame } from '@react-three/fiber';

interface CampfireProps {
  reducedMotion: boolean;
}

interface FlameLayerConfig {
  color: string;
  opacity: number;
  scale: [number, number, number];
  y: number;
}

const FLAME_LAYERS: FlameLayerConfig[] = [
  { color: '#ff6a00', opacity: 0.5, scale: [1.5, 3, 1], y: 0.8 },
  { color: '#ff9e42', opacity: 0.5, scale: [1.32, 2.64, 1], y: 0.88 },
  { color: '#1fdfff', opacity: 0.92, scale: [1.14, 2.28, 1], y: 0.96 },
  { color: '#7fefff', opacity: 0.94, scale: [0.96, 1.92, 1], y: 1.04 },
  { color: '#ffffff', opacity: 0.98, scale: [0.78, 1.56, 1], y: 1.1 },
];

export function Campfire({ reducedMotion }: CampfireProps) {
  const blueLightRef = useRef<PointLight | null>(null);
  const orangeLightRef = useRef<PointLight | null>(null);
  const flameRefs = useRef<Array<Sprite | null>>([]);
  const ringRefs = useRef<Array<Mesh | null>>([]);
  const particleRefs = useRef<Array<Mesh | null>>([]);
  const particleSeeds = useMemo<Array<{ offset: number }>>(() => (
    Array.from({ length: 40 }, (_, index) => ({
      offset: Math.random() * 100 + index * 0.13,
    }))
  ), []);

  const flameTexture = useMemo(() => {
    if (typeof document === 'undefined') {
      return null;
    }

    const width = 128;
    const height = 256;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d');

    if (!context) {
      return null;
    }

    const gradient = context.createRadialGradient(64, 120, 10, 64, 120, 90);
    gradient.addColorStop(0, 'rgba(255,255,255,1)');
    gradient.addColorStop(0.12, 'rgba(140,240,255,1)');
    gradient.addColorStop(0.35, 'rgba(0,180,255,0.95)');
    gradient.addColorStop(0.7, 'rgba(255,140,0,0.6)');
    gradient.addColorStop(1, 'rgba(255,80,0,0)');

    context.fillStyle = gradient;
    context.beginPath();
    context.moveTo(64, 0);
    context.bezierCurveTo(120, 80, 110, 180, 64, 256);
    context.bezierCurveTo(20, 180, 10, 80, 64, 0);
    context.fill();

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
    const time = clock.elapsedTime;
    const motionScale = reducedMotion ? 0.5 : 1;

    if (blueLightRef.current) {
      blueLightRef.current.intensity = 4.7 + Math.sin(time * (2.8 * motionScale)) * 0.45;
    }

    if (orangeLightRef.current) {
      orangeLightRef.current.intensity = 4.1 + Math.sin(time * (3.6 * motionScale) + 0.8) * 0.6;
    }

    flameRefs.current.forEach((flame, index) => {
      if (!flame) {
        return;
      }

      const layer = FLAME_LAYERS[index];
      const wobble = Math.sin(time * (4 * motionScale) + index * 0.8) * 0.08;
      const pulse = 1 + Math.sin(time * (6 * motionScale) + index) * 0.06;
      const baseScale = 1.5 - index * 0.18;
      flame.position.x = wobble * 0.18;
      flame.position.z = Math.cos(time * (3 * motionScale) + index) * 0.05;
      flame.scale.set(layer.scale[0] * pulse, layer.scale[1] * pulse, layer.scale[2]);
      flame.material.rotation = wobble * 0.3;
      flame.position.y = layer.y;

      if (index < FLAME_LAYERS.length) {
        flame.scale.set(baseScale * pulse, baseScale * 2 * pulse, 1);
      }
    });

    ringRefs.current.forEach((ring, index) => {
      if (!ring) {
        return;
      }

      ring.rotation.z = time * ((1.2 + index * 0.2) * motionScale);
      ring.position.y = 0.3 + ((time * (0.75 * motionScale) + index * 0.5) % 1.8);
    });

    particleRefs.current.forEach((particle, index) => {
      if (!particle) {
        return;
      }

      const rise = (time * (0.7 * motionScale) + particleSeeds[index].offset) % 2;
      particle.position.y = rise;
      particle.position.x = Math.sin(rise * 4 + index) * 0.18;
      particle.position.z = Math.cos(rise * 5 + index) * 0.18;
      particle.scale.setScalar(Math.max(0.018, 0.04 - rise * 0.008));
    });
  });

  return (
    <group position={[0, 0.08, 0]}>
      {Array.from({ length: 3 }, (_, index) => (
        <mesh key={`campfire-log-${index}`} rotation={[0, (Math.PI / 3) * index, Math.PI / 2]} position={[0, 0.08, 0]} castShadow>
          <cylinderGeometry args={[0.14, 0.14, 1.3, 8]} />
          <meshStandardMaterial color="#6a4023" emissive="#261206" emissiveIntensity={0.15} roughness={0.9} />
          <lineSegments>
            <edgesGeometry args={[new CylinderGeometry(0.14, 0.14, 1.3, 8)]} />
            <lineBasicMaterial color="#69dfff" />
          </lineSegments>
        </mesh>
      ))}
      {FLAME_LAYERS.map((layer, index) => (
        <sprite
          key={`campfire-flame-${layer.color}-${index}`}
          ref={(node) => {
            flameRefs.current[index] = node;
          }}
          position={[0, layer.y, 0]}
          scale={layer.scale}
        >
          <spriteMaterial
            map={flameTexture ?? undefined}
            alphaMap={flameTexture ?? undefined}
            color={layer.color}
            transparent
            opacity={layer.opacity}
            blending={AdditiveBlending}
            depthWrite={false}
          />
        </sprite>
      ))}
      {[0.45, 0.55].map((radius, index) => (
        <mesh
          key={`campfire-ring-${radius}`}
          ref={(node) => {
            ringRefs.current[index] = node;
          }}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <torusGeometry args={[radius, 0.02, 12, 40]} />
          <meshBasicMaterial color="#53ff9c" transparent opacity={0.85} blending={AdditiveBlending} />
        </mesh>
      ))}
      {particleSeeds.map((seed, index) => (
        <mesh
          key={`campfire-particle-${seed.offset}-${index}`}
          ref={(node) => {
            particleRefs.current[index] = node;
          }}
          position={[0, 0.2, 0]}
        >
          <sphereGeometry args={[0.025, 5, 5]} />
          <meshBasicMaterial color={index % 2 === 0 ? '#5fe1ff' : '#ff9a42'} />
        </mesh>
      ))}
      <pointLight ref={blueLightRef} color="#4fdfff" intensity={5} distance={18} decay={1.6} position={[0, 1.2, 0]} />
      <pointLight ref={orangeLightRef} color="#ff7b2f" intensity={4} distance={20} decay={1.6} position={[0, 0.8, 0]} />
    </group>
  );
}