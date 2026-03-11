'use client';

import { useRef, useState, useEffect } from 'react';
import { Html } from '@react-three/drei';
import type { Group, Mesh } from 'three';
import { useFrame, useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
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
  type: 'campfire' | 'page' | 'trees';
  label?: string;
  href?: string;
}

const TILE_SIZE = 4;

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

function Tile({ x, z }: { x: number; z: number }) {
  return (
    <mesh position={[x * TILE_SIZE, 0, z * TILE_SIZE]} receiveShadow>
      <boxGeometry args={[TILE_SIZE * 0.92, 0.24, TILE_SIZE * 0.92]} />
      <meshStandardMaterial color="#6e8a57" roughness={0.95} />
    </mesh>
  );
}

function TreeCluster({ x, z }: { x: number; z: number }) {
  const baseX = x * TILE_SIZE;
  const baseZ = z * TILE_SIZE;
  const canopyRefs = useRef<Array<Mesh | null>>([]);
  const treeGroupRefs = useRef<Array<Mesh | null>>([]);
  const offsets: Array<[number, number]> = [
    [-0.95, -0.7],
    [0.75, -0.5],
    [0, 0.88],
  ];

  useFrame(({ clock }) => {
    const time = clock.elapsedTime;

    canopyRefs.current.forEach((canopy, index) => {
      if (!canopy) {
        return;
      }

      const sway = Math.sin(time * 0.72 + index * 0.8 + x * 0.25 + z * 0.22) * 0.18;
      canopy.rotation.z = sway;
      canopy.rotation.x = sway * 0.55;
    });

    treeGroupRefs.current.forEach((treeGroup, index) => {
      if (!treeGroup) {
        return;
      }

      treeGroup.rotation.z = Math.sin(time * 0.56 + index * 0.45 + x) * 0.08;
    });
  });

  return (
    <group>
      {offsets.map((offset, index) => (
        <group
          key={`tree-${x}-${z}-${index}`}
          ref={(node) => {
            treeGroupRefs.current[index] = node as Mesh | null;
          }}
          position={[baseX + offset[0], 0.12, baseZ + offset[1]]}
          castShadow
        >
          <mesh position={[0, 0.35, 0]}>
            <cylinderGeometry args={[0.16, 0.2, 0.7, 6]} />
            <meshStandardMaterial color="#6a4023" roughness={0.85} />
          </mesh>
          <mesh
            ref={(node) => {
              canopyRefs.current[index * 2] = node;
            }}
            position={[0, 1.0, 0]}
          >
            <coneGeometry args={[0.78, 1.15, 6]} />
            <meshStandardMaterial color="#2a6a38" roughness={0.9} />
          </mesh>
          <mesh
            ref={(node) => {
              canopyRefs.current[index * 2 + 1] = node;
            }}
            position={[0, 1.58, 0]}
          >
            <coneGeometry args={[0.54, 0.9, 6]} />
            <meshStandardMaterial color="#327744" roughness={0.9} />
          </mesh>
        </group>
      ))}
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
      return (
        <group position={[0, 0.57, 0]} castShadow>
          <mesh position={[0, 0, 0]} castShadow>
            <boxGeometry args={[1.08, 0.62, 0.1]} />
            <meshStandardMaterial color="#f2e5c7" roughness={0.9} />
          </mesh>
          <mesh position={[-0.26, -0.02, 0.055]} rotation={[0, 0, -0.64]} castShadow>
            <boxGeometry args={[0.58, 0.04, 0.03]} />
            <meshStandardMaterial color="#dbc89d" roughness={0.92} />
          </mesh>
          <mesh position={[0.26, -0.02, 0.055]} rotation={[0, 0, 0.64]} castShadow>
            <boxGeometry args={[0.58, 0.04, 0.03]} />
            <meshStandardMaterial color="#dbc89d" roughness={0.92} />
          </mesh>
          <Html position={[0, 0.03, 0.085]} center transform distanceFactor={11}>
            <span style={{ fontFamily: 'var(--font-display)', color: '#4a2e18', fontSize: '0.8rem', fontWeight: 900 }}>@</span>
          </Html>
        </group>
      );
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
    <group position={[posX, 0, posZ]} ref={floatingGroupRef}>
      <mesh
        position={[0, 0, 0]}
        receiveShadow
        onPointerOver={() => {
          setIsHovered(true);
        }}
        onPointerOut={() => {
          setIsHovered(false);
        }}
      >
        <boxGeometry args={[TILE_SIZE * 0.92, 0.24, TILE_SIZE * 0.92]} />
        <meshStandardMaterial color="#6e8a57" roughness={0.95} />
      </mesh>
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
          {cell.type !== 'page' ? <Tile x={cell.x} z={cell.z} /> : null}
          {cell.type === 'trees' ? <TreeCluster x={cell.x} z={cell.z} /> : null}
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
