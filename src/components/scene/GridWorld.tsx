'use client';

import { useMemo, useRef, useState, useEffect } from 'react';
import { Html } from '@react-three/drei';
import type { Group, Mesh, ShaderMaterial } from 'three';
import { useFrame, useLoader } from '@react-three/fiber';
import { AdditiveBlending, BoxGeometry, ConeGeometry, DoubleSide, Shape, ShapeGeometry, TextureLoader } from 'three';
import type { CSSProperties } from 'react';

import EverFlameWithName from '@/assets/EverFlame-with-Name.png';
import EverFlame from '@/assets/EverFlame.png';

import { Campfire } from './Campfire';

interface GridWorldProps {
  active: boolean;
  reducedMotion: boolean;
  onNavigate: (href: string, tileWorldPosition: [number, number, number]) => void;
}

interface GridCell {
  x: number;
  z: number;
  type: 'campfire' | 'car' | 'page' | 'trees';
  label?: string;
  href?: string;
}

const TILE_SIZE = 4;
const TILE_CORNER_POSITIONS = [
  [-1.34, -1.34],
  [1.34, -1.34],
  [-1.34, 1.34],
  [1.34, 1.34],
] as const;

type TileVariant = 'grass' | 'road' | 'page';

const GRID_CELLS: GridCell[] = [
  { x: -1, z: 1, type: 'trees' },
  { x: 0, z: 1, type: 'page', label: 'OUR PROJECTS', href: '/games' },
  { x: 1, z: 1, type: 'trees' },
  { x: -1, z: 0, type: 'page', label: 'ABOUT US', href: '/studio' },
  { x: 0, z: 0, type: 'campfire' },
  { x: 1, z: 0, type: 'page', label: 'TECHNOLOGY', href: '/technology' },
  { x: -1, z: -1, type: 'trees' },
  { x: 0, z: -1, type: 'page', label: 'CONTACT US', href: '/contact' },
  { x: 1, z: -1, type: 'trees' },
];

function WorldTileBase({
  variant,
  energized = false,
  showCenterGlyph = true,
}: {
  variant: TileVariant;
  energized?: boolean;
  showCenterGlyph?: boolean;
}) {
  const isRoad = variant === 'road';
  const isPage = variant === 'page';
  const topColor = isRoad ? '#1b2431' : isPage ? '#253848' : '#2f4a3b';
  const topEmissive = isRoad ? '#102131' : isPage ? '#15384f' : '#172c20';
  const insetColor = isRoad ? '#0d141d' : isPage ? '#0d141d' : '#152018';
  const insetEmissive = isRoad ? '#11253a' : isPage ? '#14344a' : '#14231a';
  const accentColor = isRoad ? '#f3d48d' : isPage ? '#8be6ff' : '#6bc78d';
  const accentEmissive = isRoad ? '#ffab37' : isPage ? '#54cfff' : '#3aa06b';
  const accentIntensity = isPage ? (energized ? 0.9 : 0.48) : isRoad ? 0.58 : 0.14;
  const cornerColor = isPage ? '#ffb56a' : isRoad ? '#74d4ff' : '#a3c49a';
  const cornerEmissive = isPage ? '#ff8c38' : isRoad ? '#3aacff' : '#4b8a68';

  return (
    <group>
      <mesh position={[0, -0.08, 0]} receiveShadow castShadow>
        <boxGeometry args={[TILE_SIZE * 0.98, 0.22, TILE_SIZE * 0.98]} />
        <meshStandardMaterial
          color={isPage ? '#0d131b' : isRoad ? '#0a0f15' : '#101711'}
          roughness={0.82}
          metalness={isPage ? 0.24 : 0.1}
        />
      </mesh>
      <mesh position={[0, 0.03, 0]} receiveShadow castShadow>
        <boxGeometry args={[TILE_SIZE * 0.92, 0.12, TILE_SIZE * 0.92]} />
        <meshStandardMaterial
          color={topColor}
          emissive={topEmissive}
          emissiveIntensity={isPage ? (energized ? 0.36 : 0.22) : isRoad ? 0.14 : 0.08}
          roughness={isPage ? 0.54 : 0.76}
          metalness={isPage ? 0.28 : isRoad ? 0.18 : 0.06}
        />
      </mesh>
      <mesh position={[0, 0.11, 0]} receiveShadow>
        <boxGeometry args={[TILE_SIZE * 0.74, 0.02, TILE_SIZE * 0.74]} />
        <meshStandardMaterial
          color={insetColor}
          emissive={insetEmissive}
          emissiveIntensity={energized ? 0.32 : 0.14}
          roughness={0.42}
          metalness={isPage ? 0.28 : 0.12}
        />
      </mesh>
      {isRoad ? (
        <>
          <mesh position={[0, 0.125, 0]} receiveShadow>
            <boxGeometry args={[0.22, 0.018, TILE_SIZE * 0.66]} />
            <meshStandardMaterial
              color={accentColor}
              emissive={accentEmissive}
              emissiveIntensity={accentIntensity}
              roughness={0.38}
              metalness={0.16}
            />
          </mesh>
          {[-1.2, 1.2].map((offset) => (
            <mesh key={offset} position={[offset, 0.13, 0]} receiveShadow>
              <boxGeometry args={[0.12, 0.018, TILE_SIZE * 0.7]} />
              <meshStandardMaterial
                color="#5ccfff"
                emissive="#2aa4ff"
                emissiveIntensity={energized ? 0.42 : 0.22}
                roughness={0.28}
                metalness={0.26}
              />
            </mesh>
          ))}
        </>
      ) : (
        <>
          {showCenterGlyph ? (
            <>
              <mesh position={[0, 0.122, 0]}>
                <boxGeometry args={[TILE_SIZE * 0.5, 0.012, 0.08]} />
                <meshStandardMaterial
                  color={accentColor}
                  emissive={accentEmissive}
                  emissiveIntensity={accentIntensity}
                  roughness={0.34}
                  metalness={0.24}
                />
              </mesh>
              <mesh position={[0, 0.122, 0]} rotation={[0, Math.PI / 2, 0]}>
                <boxGeometry args={[TILE_SIZE * 0.5, 0.012, 0.08]} />
                <meshStandardMaterial
                  color={accentColor}
                  emissive={accentEmissive}
                  emissiveIntensity={accentIntensity}
                  roughness={0.34}
                  metalness={0.24}
                />
              </mesh>
            </>
          ) : null}
          {TILE_CORNER_POSITIONS.map(([cornerX, cornerZ]) => (
            <mesh key={`${cornerX}-${cornerZ}`} position={[cornerX, 0.14, cornerZ]} castShadow>
              <boxGeometry args={[0.18, 0.08, 0.18]} />
              <meshStandardMaterial
                color={cornerColor}
                emissive={cornerEmissive}
                emissiveIntensity={isPage ? (energized ? 0.86 : 0.4) : 0.12}
                roughness={0.36}
                metalness={isPage ? 0.32 : 0.08}
              />
            </mesh>
          ))}
        </>
      )}
    </group>
  );
}

function Tile({
  x,
  z,
  variant = 'grass',
  showCenterGlyph = true,
}: {
  x: number;
  z: number;
  variant?: 'grass' | 'road';
  showCenterGlyph?: boolean;
}) {
  return (
    <group position={[x * TILE_SIZE, 0, z * TILE_SIZE]}>
      <WorldTileBase variant={variant} showCenterGlyph={showCenterGlyph} />
    </group>
  );
}

function TreeCluster({ x, z }: { x: number; z: number }) {
  const baseX = x * TILE_SIZE;
  const baseZ = z * TILE_SIZE;
  const lowerCanopyRefs = useRef<Array<Mesh | null>>([]);
  const upperCanopyRefs = useRef<Array<Mesh | null>>([]);
  const ringRefs = useRef<Array<Mesh | null>>([]);
  const treeGroupRefs = useRef<Array<Group | null>>([]);
  const treeConfigs = useMemo(() => {
    const baseOffsets: Array<[number, number]> = [
      [-0.82, -0.84],
      [0.9, -0.42],
      [-0.12, 0.82],
    ];

    return baseOffsets.map(([offsetX, offsetZ], index) => {
      const seed = Math.abs(Math.sin((x + 2.17) * 12.9898 + (z - 1.13) * 78.233 + index * 39.425));
      return {
        offset: [offsetX, offsetZ] as [number, number],
        scale: 0.78 + seed * 0.24,
        ringY: 1.04 + seed * 0.22,
        ringSpeed: 1.05 + seed * 0.45,
      };
    });
  }, [x, z]);

  useFrame(({ clock }) => {
    const time = clock.elapsedTime;

    treeGroupRefs.current.forEach((treeGroup, index) => {
      if (!treeGroup) {
        return;
      }

      const sway = Math.sin(time * 0.56 + index * 0.55 + x * 0.45 + z * 0.28) * 0.08;
      treeGroup.rotation.z = sway;
      treeGroup.rotation.x = sway * 0.18;
    });

    lowerCanopyRefs.current.forEach((canopy, index) => {
      if (!canopy) {
        return;
      }

      const sway = Math.sin(time * 0.7 + index * 0.62 + x * 0.25 + z * 0.22) * 0.18;
      canopy.rotation.z = sway;
      canopy.rotation.x = sway * 0.35;
    });

    upperCanopyRefs.current.forEach((canopy, index) => {
      if (!canopy) {
        return;
      }

      const sway = Math.sin(time * 0.86 + index * 0.75 + x * 0.2 + z * 0.18) * 0.22;
      canopy.rotation.z = sway;
      canopy.rotation.x = sway * 0.5;
    });

    ringRefs.current.forEach((ring, index) => {
      if (!ring) {
        return;
      }

      ring.rotation.z = time * treeConfigs[index].ringSpeed + index * 0.8;
      ring.position.y = treeConfigs[index].ringY + Math.sin(time * 1.8 + index) * 0.12;
    });
  });

  return (
    <group>
      {treeConfigs.map((tree, index) => (
        <group
          key={`tree-${x}-${z}-${index}`}
          ref={(node) => {
            treeGroupRefs.current[index] = node;
          }}
          position={[baseX + tree.offset[0], 0.12, baseZ + tree.offset[1]]}
          scale={[tree.scale, tree.scale, tree.scale]}
        >
          <mesh position={[0, 0.35, 0]} castShadow>
            <cylinderGeometry args={[0.16, 0.2, 0.7, 6]} />
            <meshStandardMaterial color="#6a4023" emissive="#2c1407" emissiveIntensity={0.15} roughness={0.9} />
          </mesh>
          <mesh
            ref={(node) => {
              lowerCanopyRefs.current[index] = node;
            }}
            position={[0, 1.0, 0]}
            castShadow
          >
            <coneGeometry args={[0.78, 1.15, 6]} />
            <meshStandardMaterial
              color="#2f9d57"
              emissive="#1eff7a"
              emissiveIntensity={0.35}
              roughness={0.8}
              metalness={0.1}
            />
            <lineSegments>
              <edgesGeometry args={[new ConeGeometry(0.78, 1.15, 6)]} />
              <lineBasicMaterial color="#6ad6ff" />
            </lineSegments>
          </mesh>
          <mesh
            ref={(node) => {
              upperCanopyRefs.current[index] = node;
            }}
            position={[0, 1.58, 0]}
            castShadow
          >
            <coneGeometry args={[0.54, 0.9, 6]} />
            <meshStandardMaterial
              color="#49c96e"
              emissive="#52ff98"
              emissiveIntensity={0.45}
              roughness={0.8}
              metalness={0.1}
            />
            <lineSegments>
              <edgesGeometry args={[new ConeGeometry(0.54, 0.9, 6)]} />
              <lineBasicMaterial color="#8be7ff" />
            </lineSegments>
          </mesh>
          <mesh
            ref={(node) => {
              ringRefs.current[index] = node;
            }}
            position={[0, 1.2, 0]}
            rotation={[Math.PI / 2, 0, 0]}
          >
            <torusGeometry args={[0.82, 0.03, 12, 40]} />
            <meshStandardMaterial
              color="#72ff9b"
              emissive="#44ff88"
              emissiveIntensity={2}
              roughness={0.1}
              metalness={0.2}
              transparent
              opacity={0.8}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function createTriangleShape(points: Array<[number, number]>) {
  const shape = new Shape();
  shape.moveTo(points[0][0], points[0][1]);
  shape.lineTo(points[1][0], points[1][1]);
  shape.lineTo(points[2][0], points[2][1]);
  shape.closePath();
  return shape;
}

function EnvelopeIcon() {
  const envelopeRef = useRef<Group | null>(null);
  const coreRef = useRef<Mesh | null>(null);
  const platformRingRef = useRef<Mesh | null>(null);
  const coneMaterialRef = useRef<ShaderMaterial | null>(null);
  const particleRefs = useRef<Array<Mesh | null>>([]);
  const particleSeeds = useMemo(() => (
    Array.from({ length: 48 }, () => ({
      angle: Math.random() * Math.PI * 2,
      height: Math.random() * 6,
      speed: 0.2 + Math.random() * 0.4,
    }))
  ), []);
  const topFlapShape = useMemo(() => createTriangleShape([[-1.6, 1], [1.6, 1], [0, 0]]), []);
  const leftFlapShape = useMemo(() => createTriangleShape([[-1.6, 1], [-1.6, -1], [0, 0]]), []);
  const rightFlapShape = useMemo(() => createTriangleShape([[1.6, 1], [1.6, -1], [0, 0]]), []);
  const scanlineOffsets = useMemo(() => Array.from({ length: 37 }, (_, index) => (index - 18) * 0.05), []);

  useFrame(({ clock }) => {
    const time = clock.elapsedTime;

    if (coneMaterialRef.current) {
      coneMaterialRef.current.uniforms.time.value = time;
    }

    if (envelopeRef.current) {
      envelopeRef.current.position.y = 4 + Math.sin(time * 1.3) * 0.18;
      envelopeRef.current.rotation.y = Math.sin(time * 0.5) * 0.35;
      envelopeRef.current.rotation.x = Math.sin(time * 0.9) * 0.05;
    }

    if (coreRef.current) {
      const pulse = 1 + Math.sin(time * 4) * 0.25;
      coreRef.current.scale.setScalar(pulse);
    }

    if (platformRingRef.current) {
      platformRingRef.current.rotation.z += 0.004;
    }

    particleRefs.current.forEach((particle, index) => {
      if (!particle) {
        return;
      }

      const seed = particleSeeds[index];
      seed.height += seed.speed * 0.02;

      if (seed.height > 6) {
        seed.height = 0;
      }

      seed.angle += 0.002;
      const radius = (seed.height / 6) * 2.1;
      particle.position.x = Math.cos(seed.angle + index) * radius;
      particle.position.z = Math.sin(seed.angle + index) * radius;
      particle.position.y = seed.height;
    });
  });

  return (
    <group position={[0, 0.32, 0]} scale={[0.22, 0.22, 0.22]}>
      <mesh castShadow>
        <cylinderGeometry args={[1.5, 1.5, 0.08, 64]} />
        <meshStandardMaterial
          color="#071522"
          emissive="#003344"
          emissiveIntensity={0.8}
          roughness={0.35}
          metalness={0.9}
        />
      </mesh>
      <mesh ref={platformRingRef} rotation={[Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
        <torusGeometry args={[1.48, 0.025, 10, 100]} />
        <meshBasicMaterial color="#00ffee" transparent opacity={0.9} blending={AdditiveBlending} />
      </mesh>
      <mesh position={[0, 3, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[2.3, 6, 64, 1, true]} />
        <shaderMaterial
          ref={coneMaterialRef}
          transparent
          side={DoubleSide}
          depthWrite={false}
          blending={AdditiveBlending}
          uniforms={{ time: { value: 0 } }}
          vertexShader={`
            varying vec2 vUv;

            void main() {
              vUv = uv;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `}
          fragmentShader={`
            uniform float time;

            varying vec2 vUv;

            void main() {
              float glow = 1.0 - vUv.y;
              float scan = sin(vUv.y * 80.0 - time * 4.0) * 0.06 + 0.94;
              vec3 color = mix(vec3(0.0, 1.0, 0.9), vec3(0.5, 0.1, 1.0), vUv.y);
              gl_FragColor = vec4(color, glow * 0.35 * scan);
            }
          `}
        />
      </mesh>
      {particleSeeds.map((seed, index) => (
        <mesh
          key={`envelope-particle-${index}`}
          ref={(node) => {
            particleRefs.current[index] = node;
          }}
          position={[0, 0, 0]}
        >
          <sphereGeometry args={[0.018, 5, 5]} />
          <meshBasicMaterial color={index % 2 === 0 ? '#00ffee' : '#8844ff'} />
        </mesh>
      ))}
      <pointLight color="#00ffee" intensity={2.4} distance={12} position={[0, 5, 3]} />
      <pointLight color="#7722ff" intensity={1.2} distance={9} position={[0, 0.3, 0]} />
      <group ref={envelopeRef} position={[0, 4, 0]}>
        <mesh castShadow>
          <boxGeometry args={[3.2, 2, 0.16]} />
          <meshStandardMaterial
            color="#081622"
            emissive="#00cfff"
            emissiveIntensity={0.45}
            metalness={1}
            roughness={0.18}
            transparent
            opacity={0.88}
          />
        </mesh>
        <lineSegments>
          <edgesGeometry args={[new BoxGeometry(3.2, 2, 0.16)]} />
          <lineBasicMaterial color="#8df5ff" />
        </lineSegments>
        <mesh position={[0, 0, 0.09]} castShadow>
          <shapeGeometry args={[topFlapShape]} />
          <meshStandardMaterial
            color="#0c2435"
            emissive="#8df5ff"
            emissiveIntensity={2.8}
            transparent
            opacity={0.88}
            side={2}
            metalness={0.6}
            roughness={0.2}
          />
        </mesh>
        <lineSegments position={[0, 0, 0.11]}>
          <edgesGeometry args={[new ShapeGeometry(topFlapShape)]} />
          <lineBasicMaterial color="#ffffff" />
        </lineSegments>
        <mesh position={[0, 0, 0.082]} rotation={[0, 0, Math.PI]} castShadow>
          <shapeGeometry args={[topFlapShape]} />
          <meshStandardMaterial
            color="#0c2435"
            emissive="#00bbff"
            emissiveIntensity={1}
            transparent
            opacity={0.88}
            side={2}
            metalness={0.6}
            roughness={0.2}
          />
        </mesh>
        <mesh position={[0, 0, 0.081]} castShadow>
          <shapeGeometry args={[leftFlapShape]} />
          <meshStandardMaterial
            color="#0c2435"
            emissive="#44aaff"
            emissiveIntensity={1}
            transparent
            opacity={0.88}
            side={2}
            metalness={0.6}
            roughness={0.2}
          />
        </mesh>
        <mesh position={[0, 0, 0.081]} castShadow>
          <shapeGeometry args={[rightFlapShape]} />
          <meshStandardMaterial
            color="#0c2435"
            emissive="#44ffee"
            emissiveIntensity={1}
            transparent
            opacity={0.88}
            side={2}
            metalness={0.6}
            roughness={0.2}
          />
        </mesh>
        {scanlineOffsets.map((offset, index) => (
          <mesh key={`envelope-scanline-${offset}`} position={[0, offset, 0.09]}>
            <boxGeometry args={[3, 0.01, 0.01]} />
            <meshBasicMaterial color={index % 2 === 0 ? '#00ffee' : '#00aaff'} transparent opacity={0.18} />
          </mesh>
        ))}
        <mesh ref={coreRef} position={[0, 0, 0.12]}>
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={1} blending={AdditiveBlending} />
        </mesh>
      </group>
    </group>
  );
}

function ArcadeCarIcon({
  position = [0, 0, 0],
  scale = 1,
  rotationY = 0,
}: {
  position?: [number, number, number];
  scale?: number;
  rotationY?: number;
}) {
  const bodyShape = useMemo(() => {
    const shape = new Shape();
    shape.moveTo(-1.22, 0.16);
    shape.bezierCurveTo(-1.02, 0.2, -0.86, 0.32, -0.62, 0.46);
    shape.lineTo(0.12, 0.62);
    shape.bezierCurveTo(0.54, 0.6, 0.92, 0.43, 1.24, 0.22);
    shape.lineTo(1.34, 0.14);
    shape.lineTo(-1.22, 0.14);
    shape.closePath();
    return shape;
  }, []);
  const cabinShape = useMemo(() => {
    const shape = new Shape();
    shape.moveTo(-0.52, 0.52);
    shape.bezierCurveTo(-0.34, 0.78, -0.08, 0.92, 0.24, 0.86);
    shape.bezierCurveTo(0.48, 0.8, 0.66, 0.66, 0.76, 0.54);
    shape.lineTo(-0.52, 0.52);
    shape.closePath();
    return shape;
  }, []);
  const bodyExtrudeOptions = useMemo(
    () => ({ depth: 1.18, bevelEnabled: true, bevelThickness: 0.08, bevelSize: 0.06, bevelSegments: 6 }),
    [],
  );
  const cabinExtrudeOptions = useMemo(
    () => ({ depth: 0.78, bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.04, bevelSegments: 5 }),
    [],
  );
  const wheelPositions = [
    [-0.76, 0.23, 0.61],
    [0.78, 0.23, 0.61],
    [-0.76, 0.23, -0.61],
    [0.78, 0.23, -0.61],
  ] as const;

  return (
    <group position={position} scale={[scale, scale, scale]} rotation={[0, rotationY, 0]}>
      <mesh position={[0, 0, -0.59]} castShadow>
        <extrudeGeometry args={[bodyShape, bodyExtrudeOptions]} />
        <meshStandardMaterial color="#f05a24" roughness={0.34} metalness={0.3} />
      </mesh>
      <mesh position={[0, 0.02, -0.39]} castShadow>
        <extrudeGeometry args={[cabinShape, cabinExtrudeOptions]} />
        <meshStandardMaterial color="#1c303c" emissive="#174761" emissiveIntensity={0.22} roughness={0.14} metalness={0.16} />
      </mesh>
      <mesh position={[0.28, 0.48, 0]} scale={[0.95, 0.11, 0.5]} castShadow>
        <sphereGeometry args={[1, 32, 16]} />
        <meshStandardMaterial color="#ff6b2a" roughness={0.32} metalness={0.24} />
      </mesh>
      <mesh position={[-0.48, 0.38, 0]} scale={[0.72, 0.08, 0.54]} castShadow>
        <sphereGeometry args={[1, 28, 12]} />
        <meshStandardMaterial color="#de431e" roughness={0.36} metalness={0.28} />
      </mesh>
      <mesh position={[0.38, 0.77, 0.4]} rotation={[0, 0.08, -0.18]} castShadow>
        <planeGeometry args={[0.58, 0.24]} />
        <meshStandardMaterial color="#97dcff" emissive="#2b88c4" emissiveIntensity={0.32} roughness={0.12} metalness={0.08} />
      </mesh>
      <mesh position={[0.38, 0.77, -0.4]} rotation={[0, -0.08, -0.18]} castShadow>
        <planeGeometry args={[0.58, 0.24]} />
        <meshStandardMaterial color="#97dcff" emissive="#2b88c4" emissiveIntensity={0.32} roughness={0.12} metalness={0.08} />
      </mesh>
      <mesh position={[0.05, 0.79, 0]} rotation={[0, 0, -0.16]} castShadow>
        <boxGeometry args={[0.08, 0.32, 0.76]} />
        <meshStandardMaterial color="#14232d" emissive="#185475" emissiveIntensity={0.2} roughness={0.16} metalness={0.1} />
      </mesh>
      <mesh position={[1.22, 0.34, 0.33]} rotation={[0, 0, -0.18]} castShadow>
        <boxGeometry args={[0.07, 0.09, 0.34]} />
        <meshStandardMaterial color="#ffe7b4" emissive="#ffb64d" emissiveIntensity={0.78} roughness={0.22} />
      </mesh>
      <mesh position={[1.22, 0.34, -0.33]} rotation={[0, 0, -0.18]} castShadow>
        <boxGeometry args={[0.07, 0.09, 0.34]} />
        <meshStandardMaterial color="#ffe7b4" emissive="#ffb64d" emissiveIntensity={0.78} roughness={0.22} />
      </mesh>
      <mesh position={[-1.16, 0.32, 0.3]} castShadow>
        <boxGeometry args={[0.06, 0.1, 0.3]} />
        <meshStandardMaterial color="#ff352d" emissive="#ff1f18" emissiveIntensity={0.46} roughness={0.34} />
      </mesh>
      <mesh position={[-1.16, 0.32, -0.3]} castShadow>
        <boxGeometry args={[0.06, 0.1, 0.3]} />
        <meshStandardMaterial color="#ff352d" emissive="#ff1f18" emissiveIntensity={0.46} roughness={0.34} />
      </mesh>
      <mesh position={[0.54, 0.18, 0]} castShadow>
        <boxGeometry args={[1.5, 0.06, 1.26]} />
        <meshStandardMaterial color="#0d1115" roughness={0.68} metalness={0.18} />
      </mesh>
      <mesh position={[1.18, 0.17, 0]} rotation={[0, 0, -0.16]} castShadow>
        <boxGeometry args={[0.5, 0.05, 1.3]} />
        <meshStandardMaterial color="#080b0e" roughness={0.72} metalness={0.2} />
      </mesh>
      <mesh position={[-1.03, 0.68, 0]} rotation={[0, 0, 0.2]} castShadow>
        <boxGeometry args={[0.08, 0.08, 1.08]} />
        <meshStandardMaterial color="#101419" roughness={0.36} metalness={0.42} />
      </mesh>
      {wheelPositions.map(([wheelX, wheelY, wheelZ]) => (
        <group key={`${wheelX}-${wheelZ}`} position={[wheelX, wheelY, wheelZ]} rotation={[Math.PI / 2, 0, 0]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.26, 0.26, 0.18, 32]} />
            <meshStandardMaterial color="#151515" roughness={0.92} />
          </mesh>
          <mesh>
            <torusGeometry args={[0.2, 0.035, 10, 24]} />
            <meshStandardMaterial color="#070707" roughness={0.86} />
          </mesh>
          <mesh position={[0, 0, 0.083]}>
            <cylinderGeometry args={[0.13, 0.13, 0.028, 20]} />
            <meshStandardMaterial color="#d8c28e" roughness={0.32} metalness={0.55} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function CarDisplay({ x, z }: { x: number; z: number }) {
  const baseX = x * TILE_SIZE;
  const baseZ = z * TILE_SIZE;
  const carRef = useRef<Group | null>(null);

  useFrame(({ clock }) => {
    if (!carRef.current) {
      return;
    }

    carRef.current.position.y = Math.sin(clock.elapsedTime * 1.8) * 0.025;
  });

  return (
    <group ref={carRef} position={[baseX, 0.18, baseZ]}>
      <ArcadeCarIcon rotationY={-Math.PI / 4} />
    </group>
  );
}

function PageMarker({
  x,
  z,
  label,
  href,
  active,
  onNavigate,
}: {
  x: number;
  z: number;
  label: string;
  href: string;
  active: boolean;
  onNavigate: (href: string, tileWorldPosition: [number, number, number]) => void;
}) {
  const posX = x * TILE_SIZE;
  const posZ = z * TILE_SIZE;
  const floatingGroupRef = useRef<Group | null>(null);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [logoWithNameTexture, logoTexture] = useLoader(TextureLoader, [EverFlameWithName.src, EverFlame.src]);

  useEffect(() => {
    return () => {
      logoWithNameTexture.dispose();
      logoTexture.dispose();
    };
  }, [logoWithNameTexture, logoTexture]);

  useFrame(({ clock }) => {
    if (!floatingGroupRef.current) {
      return;
    }

    const bob = active && isHovered ? (Math.sin(clock.elapsedTime * 4.2) * 0.05 + 0.12) : 0;
    floatingGroupRef.current.position.y += (bob - floatingGroupRef.current.position.y) * 0.2;
  });

  const renderIcon = () => {
    if (href === '/studio') {
      return (
        <group position={[0, 0.53, 0]} castShadow>
          <mesh position={[0, 0.28, 0]} castShadow>
            <boxGeometry args={[1.05, 0.56, 0.84]} />
            <meshStandardMaterial color="#8f6a44" roughness={0.88} />
          </mesh>
          <mesh position={[0.53, 0.3, 0]} rotation={[0, -Math.PI / 2, 0]}>
            <planeGeometry args={[0.58, 0.26]} />
            <meshStandardMaterial map={logoWithNameTexture} transparent roughness={0.72} metalness={0} side={2} />
          </mesh>
          <mesh position={[0, 0.72, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
            <coneGeometry args={[0.74, 0.31, 4]} />
            <meshStandardMaterial color="#6c3f25" roughness={0.86} />
          </mesh>
          <mesh position={[0, 0.3, 0.43]} castShadow>
            <boxGeometry args={[0.2, 0.32, 0.06]} />
            <meshStandardMaterial color="#d8bd8f" roughness={0.88} />
          </mesh>
        </group>
      );
    }

    if (href === '/contact') {
      return <EnvelopeIcon />;
    }

    if (href === '/technology') {
      return (
        <group position={[0, 0.62, 0]} castShadow>
          <mesh position={[0, 0.22, 0]} castShadow>
            <boxGeometry args={[1.02, 0.7, 0.14]} />
            <meshStandardMaterial color="#7f95a9" roughness={0.7} metalness={0.16} />
          </mesh>
          <mesh position={[0, 0.22, 0.09]} castShadow>
            <planeGeometry args={[0.82, 0.5]} />
            <meshStandardMaterial color="#223345" emissive="#3cb8ff" emissiveIntensity={0.35} roughness={0.35} metalness={0.18} />
          </mesh>
          <mesh position={[0, 0.22, 0.095]}>
            <planeGeometry args={[0.72, 0.38]} />
            <meshStandardMaterial map={logoTexture} transparent emissive="#4bc5ff" emissiveIntensity={0.3} roughness={0.38} metalness={0.12} />
          </mesh>
          <mesh position={[0, -0.2, 0]} castShadow>
            <boxGeometry args={[0.74, 0.12, 0.5]} />
            <meshStandardMaterial color="#6a7f90" roughness={0.8} metalness={0.12} />
          </mesh>
          <mesh position={[0, -0.08, 0]} castShadow>
            <boxGeometry args={[0.16, 0.12, 0.16]} />
            <meshStandardMaterial color="#5a6f81" roughness={0.8} metalness={0.1} />
          </mesh>
          <mesh position={[0, -0.31, 0]} castShadow>
            <boxGeometry args={[0.9, 0.08, 0.62]} />
            <meshStandardMaterial color="#7a8f9f" roughness={0.82} metalness={0.12} />
          </mesh>
        </group>
      );
    }

    if (href === '/games') {
      return <ArcadeCarIcon position={[0, 0.44, 0]} scale={0.48} rotationY={-Math.PI / 4} />;
    }

    return (
      <group position={[0, 0.56, 0]} castShadow>
        <mesh castShadow>
          <boxGeometry args={[0.92, 0.56, 0.92]} />
          <meshStandardMaterial color="#f28723" emissive="#ff7a1a" emissiveIntensity={0.28} roughness={0.82} />
        </mesh>
        <mesh position={[0, 0.32, 0]} castShadow>
          <boxGeometry args={[0.96, 0.16, 0.96]} />
          <meshStandardMaterial color="#c33a23" emissive="#a82f1d" emissiveIntensity={0.2} roughness={0.78} />
        </mesh>
        <mesh position={[0, 0.06, 0]} castShadow>
          <boxGeometry args={[0.14, 0.76, 0.98]} />
          <meshStandardMaterial color="#4da4ff" emissive="#2f7ef0" emissiveIntensity={0.3} roughness={0.78} />
        </mesh>
        <mesh position={[0, 0.06, 0]} rotation={[0, Math.PI / 2, 0]} castShadow>
          <boxGeometry args={[0.14, 0.76, 0.98]} />
          <meshStandardMaterial color="#4da4ff" emissive="#2f7ef0" emissiveIntensity={0.3} roughness={0.78} />
        </mesh>
        <mesh position={[0, 0.37, 0]} castShadow>
          <boxGeometry args={[0.46, 0.1, 0.11]} />
          <meshStandardMaterial color="#4da4ff" emissive="#2f7ef0" emissiveIntensity={0.38} roughness={0.8} />
        </mesh>
        <mesh position={[0, 0.37, 0]} rotation={[0, Math.PI / 2, 0]} castShadow>
          <boxGeometry args={[0.46, 0.1, 0.11]} />
          <meshStandardMaterial color="#4da4ff" emissive="#2f7ef0" emissiveIntensity={0.38} roughness={0.8} />
        </mesh>
        <mesh position={[0.12, 0.49, 0]} rotation={[0, 0, 0.62]} castShadow>
          <torusGeometry args={[0.11, 0.03, 10, 20]} />
          <meshStandardMaterial color="#6fb4ff" emissive="#3d8fff" emissiveIntensity={0.28} roughness={0.75} />
        </mesh>
        <mesh position={[-0.12, 0.49, 0]} rotation={[0, 0, -0.62]} castShadow>
          <torusGeometry args={[0.11, 0.03, 10, 20]} />
          <meshStandardMaterial color="#6fb4ff" emissive="#3d8fff" emissiveIntensity={0.28} roughness={0.75} />
        </mesh>
        <mesh position={[0, 0.46, 0]} castShadow>
          <sphereGeometry args={[0.04, 8, 8]} />
          <meshStandardMaterial color="#86c4ff" emissive="#56a4ff" emissiveIntensity={0.3} roughness={0.7} />
        </mesh>
      </group>
    );
  };

  return (
    <group
      position={[posX, 0, posZ]}
      ref={floatingGroupRef}
      onPointerEnter={() => {
        setIsHovered(true);
      }}
      onPointerLeave={() => {
        setIsHovered(false);
      }}
    >
      <WorldTileBase variant="page" energized={active && isHovered} />
      {renderIcon()}
      <mesh
        position={[0, 0.54, 0]}
        visible={false}
        onClick={() => {
          if (active) {
            onNavigate(href, [posX, 0, posZ]);
          }
        }}
      >
        <boxGeometry args={[1.65, 1.25, 1.65]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
      <Html position={[0, 1.74, 0.24]} center transform sprite distanceFactor={10}>
        <button
          type="button"
          className="grid-page-pill"
          disabled={!active}
          onMouseEnter={() => {
            setIsHovered(true);
          }}
          onMouseLeave={() => {
            setIsHovered(false);
          }}
          onClick={() => onNavigate(href, [posX, 0, posZ])}
        >
          {label}
        </button>
      </Html>
    </group>
  );
}

export function GridWorld({ active, reducedMotion, onNavigate }: GridWorldProps) {
  return (
    <group>
      {GRID_CELLS.map((cell) => (
        <group key={`${cell.x}-${cell.z}`}>
          {cell.type !== 'page' ? (
            <Tile
              x={cell.x}
              z={cell.z}
              variant={cell.type === 'car' ? 'road' : 'grass'}
              showCenterGlyph={cell.type !== 'campfire'}
            />
          ) : null}
          {cell.type === 'trees' ? <TreeCluster x={cell.x} z={cell.z} /> : null}
          {cell.type === 'car' ? <CarDisplay x={cell.x} z={cell.z} /> : null}
          {cell.type === 'campfire' ? <Campfire reducedMotion={reducedMotion} /> : null}
          {cell.type === 'page' && cell.label && cell.href ? (
            <PageMarker
              x={cell.x}
              z={cell.z}
              label={cell.label}
              href={cell.href}
              active={active}
              onNavigate={onNavigate}
            />
          ) : null}
        </group>
      ))}
    </group>
  );
}

export function FocusTreesDecor() {
  const frontTrees = [
    { x: '2%', h: 122, w: 68, trunk: 38, delay: '0.1s', hue: 0, sway: 4.1 },
    { x: '9%', h: 156, w: 84, trunk: 54, delay: '0.5s', hue: 8, sway: 5.2 },
    { x: '16%', h: 106, w: 62, trunk: 34, delay: '0.9s', hue: -4, sway: 3.9 },
    { x: '24%', h: 178, w: 92, trunk: 62, delay: '0.3s', hue: 6, sway: 5.6 },
    { x: '32%', h: 134, w: 74, trunk: 44, delay: '0.7s', hue: -2, sway: 4.7 },
    { x: '40%', h: 168, w: 90, trunk: 58, delay: '1.1s', hue: 4, sway: 5.4 },
    { x: '49%', h: 98, w: 56, trunk: 30, delay: '0.4s', hue: -6, sway: 3.5 },
    { x: '58%', h: 186, w: 96, trunk: 66, delay: '0.8s', hue: 7, sway: 5.8 },
    { x: '67%', h: 126, w: 70, trunk: 40, delay: '1.2s', hue: 1, sway: 4.3 },
    { x: '76%', h: 174, w: 88, trunk: 60, delay: '0.2s', hue: 5, sway: 5.5 },
    { x: '85%', h: 114, w: 64, trunk: 36, delay: '1.0s', hue: -5, sway: 4.0 },
    { x: '93%', h: 148, w: 82, trunk: 50, delay: '0.6s', hue: 3, sway: 5.0 },
  ];

  const backTrees = [
    { x: '6%', h: 72, w: 42, trunk: 22, delay: '0.2s', hue: -16, sway: 6.0 },
    { x: '18%', h: 78, w: 45, trunk: 24, delay: '0.7s', hue: -14, sway: 6.4 },
    { x: '29%', h: 70, w: 40, trunk: 21, delay: '1.0s', hue: -17, sway: 5.8 },
    { x: '41%', h: 84, w: 48, trunk: 26, delay: '0.4s', hue: -13, sway: 6.5 },
    { x: '53%', h: 74, w: 44, trunk: 23, delay: '0.8s', hue: -16, sway: 5.9 },
    { x: '64%', h: 80, w: 46, trunk: 25, delay: '1.1s', hue: -14, sway: 6.2 },
    { x: '77%', h: 76, w: 43, trunk: 23, delay: '0.5s', hue: -15, sway: 6.1 },
    { x: '90%', h: 82, w: 47, trunk: 26, delay: '0.9s', hue: -13, sway: 6.3 },
  ];

  return (
    <>
      {backTrees.map((tree) => {
        const style = {
          '--x': tree.x,
          '--tree-height': `${tree.h}px`,
          '--tree-width': `${tree.w}px`,
          '--trunk-height': `${tree.trunk}px`,
          '--tree-hue': `${tree.hue}deg`,
          '--tree-delay': tree.delay,
          '--tree-sway': `${tree.sway}s`,
        } as CSSProperties;

        return (
          <div key={`focus-tree-back-${tree.x}`} className="focus-tree focus-tree-back" style={style}>
            <span className="focus-tree-trunk" />
            <span className="focus-tree-canopy focus-tree-canopy-1" />
            <span className="focus-tree-canopy focus-tree-canopy-2" />
            <span className="focus-tree-canopy focus-tree-canopy-3" />
          </div>
        );
      })}
      {frontTrees.map((tree) => {
        const style = {
          '--x': tree.x,
          '--tree-height': `${tree.h}px`,
          '--tree-width': `${tree.w}px`,
          '--trunk-height': `${tree.trunk}px`,
          '--tree-hue': `${tree.hue}deg`,
          '--tree-delay': tree.delay,
          '--tree-sway': `${tree.sway}s`,
        } as CSSProperties;

        return (
          <div key={`focus-tree-front-${tree.x}`} className="focus-tree focus-tree-front" style={style}>
            <span className="focus-tree-trunk" />
            <span className="focus-tree-canopy focus-tree-canopy-1" />
            <span className="focus-tree-canopy focus-tree-canopy-2" />
            <span className="focus-tree-canopy focus-tree-canopy-3" />
          </div>
        );
      })}
    </>
  );
}
