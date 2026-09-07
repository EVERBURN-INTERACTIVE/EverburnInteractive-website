'use client';

import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import {
  AdditiveBlending,
  BackSide,
  CanvasTexture,
  Color,
  DoubleSide,
  Group,
  InstancedMesh,
  LinearFilter,
  MathUtils,
  Mesh,
  MeshBasicMaterial,
  Object3D,
  PointLight,
  Points,
  RepeatWrapping,
  ShaderMaterial,
  Sprite,
  Vector3,
  type PerspectiveCamera,
} from 'three';

import {
  budgetHeat,
  type BuildInquiry,
  type ChapterId,
} from '@/lib/buildInquiry';

import { createGalaxyTexture } from './galaxyTexture';
import { createLavaMaterial } from './forgeMaterials';

interface Station {
  position: [number, number, number];
  lookAt: [number, number, number];
}

const STATIONS: Record<ChapterId, Station> = {
  arrival: { position: [0.15, 2.05, 10.2], lookAt: [0, 1.35, 0] },
  lookingFor: { position: [7.4, 2.55, 4.6], lookAt: [0.4, 1.4, 0] },
  goal: { position: [-7.1, 2.7, 5.1], lookAt: [-0.3, 1.45, 0] },
  business: { position: [1.4, 1.45, 5.1], lookAt: [0, 1.15, 0] },
  scope: { position: [6.9, 4.4, 2.2], lookAt: [0.6, 1.6, 0] },
  size: { position: [-6.6, 1.75, 4.1], lookAt: [-0.4, 1.3, 0] },
  threeD: { position: [0.5, 6.1, 5.8], lookAt: [0, 1.7, 0] },
  budget: { position: [0.2, 1.5, 3.5], lookAt: [0, 1.35, 0] },
  timeline: { position: [-3.4, 4.0, 8.8], lookAt: [0, 1.5, 0] },
  assets: { position: [5.1, 2.15, 6.2], lookAt: [0.3, 1.2, 0] },
  design: { position: [0.25, 6.6, 9.0], lookAt: [0, 1.7, 0] },
  contact: { position: [0.12, 1.65, 4.3], lookAt: [0, 1.25, 0] },
  success: { position: [-5.6, 3.3, 6.4], lookAt: [0, 1.55, 0] },
  review: { position: [0, 8.4, 13.2], lookAt: [0, 1.9, 0] },
};

interface ChapterLook {
  galaxy: string;
  fog: string;
  light: string;
  ember: string;
  rings: number;
  fov: number;
}

const CHAPTER_LOOK: Record<ChapterId, ChapterLook> = {
  arrival: { galaxy: '#e8d4ff', fog: '#0a0608', light: '#ff6a22', ember: '#ff7a32', rings: 1, fov: 42 },
  lookingFor: { galaxy: '#ffc08a', fog: '#120805', light: '#ff5a12', ember: '#ff6a18', rings: 2, fov: 38 },
  goal: { galaxy: '#c8b4ff', fog: '#080614', light: '#8a6aff', ember: '#b08cff', rings: 3, fov: 46 },
  business: { galaxy: '#ffe2a8', fog: '#100c08', light: '#ffc08a', ember: '#ffd27a', rings: 3, fov: 36 },
  scope: { galaxy: '#9ae8ff', fog: '#061018', light: '#4ad2ff', ember: '#7ae0ff', rings: 4, fov: 48 },
  size: { galaxy: '#ffc090', fog: '#140806', light: '#ff7a28', ember: '#ffb56a', rings: 4, fov: 40 },
  threeD: { galaxy: '#a8f0ff', fog: '#051018', light: '#66e0ff', ember: '#c8f4ff', rings: 5, fov: 52 },
  budget: { galaxy: '#ffb08a', fog: '#1a0604', light: '#ff2d00', ember: '#ff6a00', rings: 5, fov: 34 },
  timeline: { galaxy: '#fff0b8', fog: '#141008', light: '#ffd27a', ember: '#ffe4b0', rings: 5, fov: 44 },
  assets: { galaxy: '#ffc0d0', fog: '#140810', light: '#ff5a7a', ember: '#ff9ab0', rings: 5, fov: 39 },
  design: { galaxy: '#ffe8c8', fog: '#100a08', light: '#ffc08a', ember: '#ffe0b8', rings: 5, fov: 50 },
  contact: { galaxy: '#ffd4a0', fog: '#120806', light: '#ff9a3c', ember: '#ffd27a', rings: 5, fov: 37 },
  success: { galaxy: '#ffe8b0', fog: '#160a04', light: '#ffd27a', ember: '#fff0c8', rings: 5, fov: 41 },
  review: { galaxy: '#fff6e0', fog: '#080604', light: '#ffe0b0', ember: '#fff6e0', rings: 5, fov: 54 },
};

const STYLE_GALAXY: Partial<Record<BuildInquiry['visualStyle'], string>> = {
  minimal: '#d7d2c8',
  premium: '#c9b27c',
  corporate: '#8ab0d0',
  bold: '#ff5a1f',
  'dark-futuristic': '#4ad2ff',
  playful: '#ff6a8a',
  cinematic: '#ff6a18',
  recommend: '#ff8a3a',
};

const GALAXY_RINGS = [
  { radius: 1.55, tube: 0.11, y: 0.46, color: '#ff6a18', speed: 0.22, tilt: 1.52, offset: 0.02 },
  { radius: 2.28, tube: 0.042, y: 1.38, color: '#7a5cff', speed: -0.15, tilt: 1.72, offset: 0.18 },
  { radius: 3.12, tube: 0.036, y: 1.58, color: '#2ec8ff', speed: 0.1, tilt: 1.36, offset: 0.34 },
  { radius: 4.05, tube: 0.03, y: 1.82, color: '#ff3d7a', speed: -0.08, tilt: 1.88, offset: 0.51 },
  { radius: 5.15, tube: 0.026, y: 2.08, color: '#ffe08a', speed: 0.05, tilt: 1.58, offset: 0.67 },
];

export interface BuildWorldProps {
  chapter: ChapterId;
  inquiry: BuildInquiry;
  progress: number;
  reducedMotion: boolean;
  isMobile: boolean;
  hoverKey: string;
  onIgnite: () => void;
}

function useGalaxyMap() {
  const texture = useMemo(() => createGalaxyTexture(), []);
  useEffect(() => {
    return () => {
      texture.dispose();
    };
  }, [texture]);
  return texture;
}

function LavaFloor({ heat, reducedMotion }: { heat: number; reducedMotion: boolean }) {
  const meshRef = useRef<Mesh>(null);
  const lavaMaterial = useMemo(() => createLavaMaterial(), []);

  useEffect(() => {
    return () => {
      lavaMaterial.dispose();
    };
  }, [lavaMaterial]);

  useFrame(({ clock }) => {
    const mesh = meshRef.current;
    const material = mesh?.material;
    if (material instanceof ShaderMaterial) {
      material.uniforms.uTime.value = reducedMotion ? clock.elapsedTime * 0.15 : clock.elapsedTime;
      material.uniforms.uHeat.value = MathUtils.lerp(material.uniforms.uHeat.value as number, heat, 0.06);
    }
    if (mesh) {
      mesh.rotation.z = reducedMotion ? 0 : clock.elapsedTime * 0.015;
    }
  });

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} material={lavaMaterial}>
      <circleGeometry args={[11, 72]} />
    </mesh>
  );
}

function createFlameSpriteTexture(): CanvasTexture | null {
  if (typeof document === 'undefined') {
    return null;
  }
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 256;
  const context = canvas.getContext('2d');
  if (!context) {
    return null;
  }

  const gradient = context.createLinearGradient(64, 252, 64, 4);
  gradient.addColorStop(0, 'rgba(255, 40, 0, 0)');
  gradient.addColorStop(0.1, 'rgba(255, 70, 0, 0.9)');
  gradient.addColorStop(0.32, 'rgba(255, 150, 24, 1)');
  gradient.addColorStop(0.52, 'rgba(255, 230, 140, 1)');
  gradient.addColorStop(0.78, 'rgba(255, 110, 16, 0.4)');
  gradient.addColorStop(1, 'rgba(255, 70, 0, 0)');
  context.fillStyle = gradient;
  const drawTongue = (peakX: number, baseShift: number, height: number) => {
    context.beginPath();
    context.moveTo(peakX, 6);
    context.bezierCurveTo(peakX + 58 + baseShift, 70, peakX + 50 + baseShift, 175, 64 + baseShift, height);
    context.bezierCurveTo(peakX - 50 + baseShift, 175, peakX - 58 + baseShift, 70, peakX, 6);
    context.fill();
  };
  drawTongue(64, 0, 250);
  drawTongue(48, -10, 210);
  drawTongue(80, 12, 200);

  const texture = new CanvasTexture(canvas);
  texture.minFilter = LinearFilter;
  texture.magFilter = LinearFilter;
  texture.needsUpdate = true;
  return texture;
}

const FLAME_LAYERS = [
  { color: '#ff2a00', opacity: 0.52, scale: [1.55, 2.95, 1] as [number, number, number], y: 1.22 },
  { color: '#ff5a00', opacity: 0.6, scale: [1.32, 2.55, 1] as [number, number, number], y: 1.3 },
  { color: '#ff8a18', opacity: 0.7, scale: [1.08, 2.18, 1] as [number, number, number], y: 1.38 },
  { color: '#ffc85a', opacity: 0.82, scale: [0.82, 1.75, 1] as [number, number, number], y: 1.46 },
  { color: '#fff3c8', opacity: 0.94, scale: [0.58, 1.32, 1] as [number, number, number], y: 1.52 },
];

function HearthFire({
  heat,
  reducedMotion,
  ignitable,
  lightColor,
  onIgnite,
}: {
  heat: number;
  reducedMotion: boolean;
  ignitable: boolean;
  lightColor: string;
  onIgnite: () => void;
}) {
  const lightRef = useRef<PointLight>(null);
  const flameRefs = useRef<Array<Sprite | null>>([]);
  const sparkRefs = useRef<Array<Mesh | null>>([]);
  const color = useMemo(() => new Color(lightColor), [lightColor]);
  const spriteMap = useMemo(() => createFlameSpriteTexture(), []);
  const sparks = useMemo(
    () =>
      Array.from({ length: 18 }, (_, index) => ({
        offset: index * 0.37,
        radius: 0.08 + (index % 5) * 0.03,
      })),
    [],
  );

  useEffect(() => {
    return () => {
      spriteMap?.dispose();
    };
  }, [spriteMap]);

  useFrame(({ clock }) => {
    const time = clock.elapsedTime;
    const motion = reducedMotion ? 0.22 : 1;
    const heatScale = 0.85 + heat * 0.55;

    flameRefs.current.forEach((flame, index) => {
      if (!flame) {
        return;
      }
      const layer = FLAME_LAYERS[index];
      const wobble = Math.sin(time * (4.4 * motion) + index * 0.9) * 0.1;
      const pulse = 1 + Math.sin(time * (6.2 * motion) + index) * 0.07;
      flame.position.x = wobble * 0.22;
      flame.position.z = Math.cos(time * (2.8 * motion) + index) * 0.06;
      flame.position.y = layer.y * heatScale;
      flame.scale.set(layer.scale[0] * pulse * heatScale, layer.scale[1] * pulse * heatScale, 1);
      flame.material.rotation = wobble * 0.28;
    });

    sparkRefs.current.forEach((spark, index) => {
      if (!spark) {
        return;
      }
      const seed = sparks[index];
      const rise = (time * (0.85 * motion) + seed.offset) % 1.8;
      spark.position.set(
        Math.sin(rise * 5 + index) * seed.radius,
        0.35 + rise * (1.4 + heat * 0.8),
        Math.cos(rise * 4.2 + index) * seed.radius,
      );
      spark.scale.setScalar(Math.max(0.012, 0.045 - rise * 0.018));
    });

    if (lightRef.current) {
      lightRef.current.color.lerp(color, 0.08);
      lightRef.current.intensity = 6 + heat * 14 + Math.sin(time * 5.2 * motion) * (1.4 + heat * 2.4);
    }
  });

  return (
    <group position={[0, 0.18, 0]}>
      <mesh
        position={[0, 0.04, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        onClick={() => {
          if (ignitable) {
            onIgnite();
          }
        }}
        onPointerOver={() => {
          if (ignitable) {
            document.body.style.cursor = 'pointer';
          }
        }}
        onPointerOut={() => {
          document.body.style.cursor = '';
        }}
      >
        <circleGeometry args={[1.48, 48]} />
        <meshBasicMaterial
          color="#ff7a22"
          transparent
          opacity={0.55}
          blending={AdditiveBlending}
          depthWrite={false}
          side={DoubleSide}
        />
      </mesh>
      {FLAME_LAYERS.map((layer, index) => (
        <sprite
          key={`hearth-flame-${layer.color}`}
          ref={(node) => {
            flameRefs.current[index] = node;
          }}
          position={[0, layer.y, 0]}
          scale={layer.scale}
          renderOrder={4 + index}
        >
          <spriteMaterial
            map={spriteMap ?? undefined}
            alphaMap={spriteMap ?? undefined}
            color={layer.color}
            transparent
            opacity={layer.opacity}
            blending={AdditiveBlending}
            depthWrite={false}
            fog={false}
          />
        </sprite>
      ))}
      {sparks.map((seed, index) => (
        <mesh
          key={`hearth-spark-${seed.offset}`}
          ref={(node) => {
            sparkRefs.current[index] = node;
          }}
          position={[0, 0.4, 0]}
        >
          <sphereGeometry args={[0.03, 6, 6]} />
          <meshBasicMaterial
            color={index % 2 === 0 ? '#ffd27a' : '#ff6a18'}
            transparent
            opacity={0.85}
            blending={AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}
      <pointLight ref={lightRef} color={lightColor} distance={28} decay={1.5} position={[0, 1.4, 0]} />
      <pointLight color="#ffd27a" intensity={1.8 + heat * 2.4} distance={11} decay={2} position={[0, 2.1, 0]} />
    </group>
  );
}

function EmberRain({
  count,
  color,
  reducedMotion,
}: {
  count: number;
  color: string;
  reducedMotion: boolean;
}) {
  const pointsRef = useRef<Points>(null);
  const positions = useMemo(() => {
    const data = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      data[i * 3] = (((i * 37) % 200) / 200) * 22 - 11;
      data[i * 3 + 1] = ((i * 13) % 140) / 10;
      data[i * 3 + 2] = (((i * 53) % 200) / 200) * 22 - 11;
    }
    return data;
  }, [count]);
  const dotTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const context = canvas.getContext('2d');
    if (!context) {
      return null;
    }
    const gradient = context.createRadialGradient(32, 32, 2, 32, 32, 30);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.45, 'rgba(255, 180, 80, 0.55)');
    gradient.addColorStop(1, 'rgba(255, 80, 0, 0)');
    context.fillStyle = gradient;
    context.fillRect(0, 0, 64, 64);
    const texture = new CanvasTexture(canvas);
    texture.minFilter = LinearFilter;
    texture.magFilter = LinearFilter;
    return texture;
  }, []);

  useEffect(() => {
    return () => {
      dotTexture?.dispose();
    };
  }, [dotTexture]);

  useFrame((_, delta) => {
    const points = pointsRef.current;
    if (!points) {
      return;
    }

    const attr = points.geometry.getAttribute('position');
    const speed = reducedMotion ? 0.35 : 1.15;
    for (let i = 0; i < count; i += 1) {
      let y = attr.getY(i) - delta * speed * (0.6 + (i % 7) * 0.08);
      if (y < -0.4) {
        y = 12 + (i % 5);
        attr.setX(i, (((i * 41 + Math.floor(y * 10)) % 200) / 200) * 22 - 11);
        attr.setZ(i, (((i * 59 + Math.floor(y * 7)) % 200) / 200) * 22 - 11);
      }
      attr.setY(i, y);
    }
    attr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} count={count} />
      </bufferGeometry>
      <pointsMaterial
        map={dotTexture ?? undefined}
        alphaMap={dotTexture ?? undefined}
        color={color}
        size={0.055}
        transparent
        opacity={0.72}
        alphaTest={0.08}
        blending={AdditiveBlending}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}

function FloatingShards({
  showThreeD,
  progress,
  reducedMotion,
}: {
  showThreeD: boolean;
  progress: number;
  reducedMotion: boolean;
}) {
  const meshRef = useRef<InstancedMesh>(null);
  const helper = useMemo(() => new Object3D(), []);
  const seeds = useMemo(
    () =>
      Array.from({ length: 28 }, (_, index) => ({
        radius: 3.4 + (index % 7) * 0.38,
        height: 0.6 + (index % 5) * 0.55,
        speed: 0.12 + (index % 6) * 0.03,
        offset: index * 0.37,
        scale: 0.12 + (index % 4) * 0.05,
      })),
    [],
  );

  useFrame(({ clock }) => {
    if (!meshRef.current) {
      return;
    }

    const time = clock.elapsedTime;
    const motion = reducedMotion ? 0.2 : 1;
    for (let i = 0; i < seeds.length; i += 1) {
      const seed = seeds[i];
      const angle = seed.offset + time * seed.speed * motion;
      helper.position.set(
        Math.cos(angle) * seed.radius,
        seed.height + Math.sin(time * 0.7 + seed.offset) * 0.18 * motion,
        Math.sin(angle) * seed.radius,
      );
      helper.rotation.set(time * 0.2, angle, time * 0.14);
      const extra = (showThreeD ? 1.45 : 1) * (0.7 + progress * 0.8);
      helper.scale.setScalar(seed.scale * extra);
      helper.updateMatrix();
      meshRef.current.setMatrixAt(i, helper.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, seeds.length]}>
      <icosahedronGeometry args={[1, 0]} />
      <meshStandardMaterial
        color={showThreeD ? '#ffb56a' : '#3a2416'}
        emissive={showThreeD ? '#ff6a18' : '#140804'}
        emissiveIntensity={showThreeD ? 0.85 : 0.12 + progress * 0.5}
        metalness={0.55}
        roughness={0.28}
      />
    </instancedMesh>
  );
}

function GalaxySky({
  map,
  tint,
  reducedMotion,
}: {
  map: CanvasTexture;
  tint: string;
  reducedMotion: boolean;
}) {
  const meshRef = useRef<Mesh>(null);
  const materialRef = useRef<MeshBasicMaterial>(null);
  const color = useMemo(() => new Color(tint), [tint]);

  useFrame(({ clock }, delta) => {
    if (meshRef.current && !reducedMotion) {
      meshRef.current.rotation.y += delta * 0.012;
      meshRef.current.rotation.z = Math.sin(clock.elapsedTime * 0.05) * 0.04;
    }
    materialRef.current?.color.lerp(color, 0.04);
  });

  return (
    <mesh ref={meshRef} renderOrder={-20}>
      <sphereGeometry args={[48, 48, 32]} />
      <meshBasicMaterial
        ref={materialRef}
        map={map}
        color={tint}
        side={BackSide}
        fog={false}
        toneMapped={false}
        depthWrite={false}
      />
    </mesh>
  );
}

function GalaxyRings({
  map,
  visibleCount,
  reducedMotion,
}: {
  map: CanvasTexture;
  visibleCount: number;
  reducedMotion: boolean;
}) {
  const groupRef = useRef<Group>(null);
  const discRef = useRef<Mesh>(null);
  const maps = useMemo(
    () =>
      GALAXY_RINGS.map((ring) => {
        const clone = map.clone();
        clone.wrapS = RepeatWrapping;
        clone.wrapT = RepeatWrapping;
        clone.repeat.set(2.4, 1);
        clone.offset.set(ring.offset, ring.offset * 0.4);
        clone.needsUpdate = true;
        return clone;
      }),
    [map],
  );
  const discMap = useMemo(() => {
    const clone = map.clone();
    clone.wrapS = RepeatWrapping;
    clone.wrapT = RepeatWrapping;
    clone.repeat.set(1.15, 1.15);
    clone.offset.set(0.12, 0.08);
    clone.needsUpdate = true;
    return clone;
  }, [map]);

  useEffect(() => {
    return () => {
      maps.forEach((texture) => texture.dispose());
      discMap.dispose();
    };
  }, [discMap, maps]);

  useFrame(({ clock }) => {
    const group = groupRef.current;
    if (!group) {
      return;
    }
    const time = clock.elapsedTime;
    group.children.forEach((child, index) => {
      const spec = GALAXY_RINGS[index];
      if (!spec) {
        return;
      }
      child.visible = index < visibleCount;
      child.rotation.x = spec.tilt;
      child.rotation.z = reducedMotion ? spec.offset : time * spec.speed;
    });
    if (discRef.current) {
      discRef.current.visible = visibleCount > 0;
      discRef.current.rotation.z = reducedMotion ? 0 : time * 0.06;
    }
  });

  const inner = GALAXY_RINGS[0];

  return (
    <group>
      <mesh
        ref={discRef}
        position={[0, inner.y - 0.02, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        visible={visibleCount > 0}
        renderOrder={1}
      >
        <circleGeometry args={[inner.radius - inner.tube * 0.15, 64]} />
        <meshBasicMaterial
          color="#ffb056"
          transparent
          opacity={0.96}
          depthWrite={false}
          fog={false}
          toneMapped={false}
          side={DoubleSide}
        />
      </mesh>
      <mesh
        position={[0, inner.y - 0.01, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        visible={visibleCount > 0}
        renderOrder={2}
      >
        <circleGeometry args={[inner.radius - inner.tube * 0.15, 64]} />
        <meshBasicMaterial
          map={discMap}
          color="#ffd27a"
          transparent
          opacity={0.55}
          blending={AdditiveBlending}
          depthWrite={false}
          fog={false}
          toneMapped={false}
          side={DoubleSide}
        />
      </mesh>
      <group ref={groupRef}>
        {GALAXY_RINGS.map((ring, index) => (
          <mesh key={`galaxy-ring-${ring.color}`} position={[0, ring.y, 0]} visible={index < visibleCount}>
            <torusGeometry args={[ring.radius, ring.tube, 16, 128]} />
            <meshBasicMaterial
              map={maps[index]}
              color={ring.color}
              transparent
              opacity={0.92}
              blending={AdditiveBlending}
              depthWrite={false}
              fog={false}
              toneMapped={false}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}

function CameraRig({
  chapter,
  fov,
  reducedMotion,
  isMobile,
}: {
  chapter: ChapterId;
  fov: number;
  reducedMotion: boolean;
  isMobile: boolean;
}) {
  const targetPos = useRef(new Vector3(...STATIONS.arrival.position));
  const targetLook = useRef(new Vector3(...STATIONS.arrival.lookAt));
  const look = useRef(new Vector3(...STATIONS.arrival.lookAt));

  useFrame(({ camera, size }, delta) => {
    const station = STATIONS[chapter];
    const compact = isMobile || size.width < 1024;
    const lift = compact ? 0.72 : 0;
    // On compact screens the sheet covers the lower frame, so the hearth sits higher in view.
    targetPos.current.set(station.position[0], station.position[1] + lift * 0.45, station.position[2]);
    targetLook.current.set(station.lookAt[0], station.lookAt[1] + lift, station.lookAt[2]);
    const damp = reducedMotion ? 3.6 : 2.35;
    camera.position.lerp(targetPos.current, 1 - Math.exp(-damp * delta));
    look.current.lerp(targetLook.current, 1 - Math.exp(-damp * delta));
    camera.lookAt(look.current);
    const persp = camera as PerspectiveCamera;
    if (typeof persp.fov === 'number') {
      persp.fov = MathUtils.lerp(persp.fov, fov + (compact ? 10 : 0), 1 - Math.exp(-damp * delta));
      persp.updateProjectionMatrix();
    }
  });

  return null;
}

export function BuildWorld({
  chapter,
  inquiry,
  progress,
  reducedMotion,
  isMobile,
  hoverKey,
  onIgnite,
}: BuildWorldProps) {
  const look = CHAPTER_LOOK[chapter];
  const galaxyTint = STYLE_GALAXY[inquiry.visualStyle] ?? look.galaxy;
  const heat = Math.max(budgetHeat(inquiry.budget), 0.18 + progress * 0.85);
  const showThreeD = inquiry.lookingFor === '3d-website' || inquiry.includes.includes('3d-elements');
  const hoverBoost = hoverKey ? 0.1 : 0;
  const ringCount = Math.min(GALAXY_RINGS.length, look.rings + (showThreeD ? 1 : 0));
  const galaxyMap = useGalaxyMap();

  return (
    <>
      <color attach="background" args={['#050308']} />
      <fog attach="fog" args={[look.fog, 28, 78]} />
      <ambientLight intensity={0.16} color={look.light} />
      <directionalLight position={[6, 14, 8]} intensity={0.4} color={look.light} />
      <CameraRig chapter={chapter} fov={look.fov} reducedMotion={reducedMotion} isMobile={isMobile} />
      <GalaxySky map={galaxyMap} tint={galaxyTint} reducedMotion={reducedMotion} />
      <LavaFloor heat={heat + hoverBoost} reducedMotion={reducedMotion} />
      <HearthFire
        heat={heat + hoverBoost}
        reducedMotion={reducedMotion}
        ignitable={chapter === 'arrival'}
        lightColor={look.light}
        onIgnite={onIgnite}
      />
      <GalaxyRings map={galaxyMap} visibleCount={ringCount} reducedMotion={reducedMotion} />
      <FloatingShards showThreeD={showThreeD} progress={progress} reducedMotion={reducedMotion} />
      <EmberRain count={isMobile ? 80 : 160} color={look.ember} reducedMotion={reducedMotion} />
    </>
  );
}
