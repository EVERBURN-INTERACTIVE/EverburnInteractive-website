'use client';

import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import {
  BackSide,
  Color,
  Mesh,
  MeshStandardMaterial,
  ShaderMaterial,
} from 'three';

import {
  getArchBeamMaterial,
  getArchPillarMaterial,
  getEnergyRingMaterial,
  getHoloScreenMaterial,
  getNeonBarrierCapMaterial,
  getNeonBarrierMaterial,
} from '@/lib/battleArenaTrackMaterials';

const TRACK_CENTER: [number, number, number] = [0, -0.35, -24];
const BARRIER_RX = 41;
const BARRIER_RZ = 23;
const BARRIER_COUNT = 44;

function disableRaycast(mesh: Mesh) {
  mesh.raycast = () => undefined;
}

interface HoloScreenSpec {
  id: string;
  position: [number, number, number];
  rotationY: number;
  scale: [number, number];
}

const HOLO_SCREENS: HoloScreenSpec[] = [
  { id: 'holo-l', position: [-46, 4.5, -28], rotationY: Math.PI / 2, scale: [7.5, 4.2] },
  { id: 'holo-r', position: [46, 4.5, -28], rotationY: -Math.PI / 2, scale: [7.5, 4.2] },
  { id: 'holo-back', position: [0, 5.5, -44], rotationY: 0, scale: [12, 3.8] },
];

/** Synthwave gradient hemisphere replacing a realistic sky. */
function SynthwaveSkyDome() {
  const material = useMemo(() => {
    return new ShaderMaterial({
      side: BackSide,
      depthWrite: false,
      uniforms: {
        uTop: { value: new Color('#06020f') },
        uHorizon: { value: new Color('#4a1868') },
        uGlow: { value: new Color('#00c8e8') },
      },
      vertexShader: `
        varying vec3 vWorldPos;
        void main() {
          vec4 worldPos = modelMatrix * vec4(position, 1.0);
          vWorldPos = worldPos.xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 uTop;
        uniform vec3 uHorizon;
        uniform vec3 uGlow;
        varying vec3 vWorldPos;
        void main() {
          float h = clamp((vWorldPos.y + 12.0) / 85.0, 0.0, 1.0);
          vec3 sky = mix(uHorizon, uTop, pow(h, 0.65));
          float rim = pow(1.0 - h, 3.2);
          sky += uGlow * rim * 0.35;
          gl_FragColor = vec4(sky, 1.0);
        }
      `,
    });
  }, []);

  return (
    <mesh position={[0, 8, -32]} scale={160} material={material} renderOrder={-10}>
      <sphereGeometry args={[1, 40, 24, 0, Math.PI * 2, 0, Math.PI * 0.52]} />
    </mesh>
  );
}

/** Neon barrier posts, finish arch, holograms, and energy ring around the circuit. */
export function BattleArenaFuturisticAccents() {
  const ringRef = useRef<Mesh | null>(null);
  const holoRefs = useRef<Array<MeshStandardMaterial | null>>([]);
  const archBeamRef = useRef<MeshStandardMaterial | null>(null);
  const barrierMaterial = useMemo(() => getNeonBarrierMaterial(), []);
  const barrierCapMaterial = useMemo(() => getNeonBarrierCapMaterial(), []);
  const holoMaterials = useMemo(
    () => HOLO_SCREENS.map(() => getHoloScreenMaterial().clone()),
    [],
  );
  const ringMaterial = useMemo(() => getEnergyRingMaterial(), []);
  const archBeamMaterial = useMemo(() => getArchBeamMaterial(), []);
  const archPillarMaterial = useMemo(() => getArchPillarMaterial(), []);

  const barrierPosts = useMemo(() => {
    const [cx, , cz] = TRACK_CENTER;
    return Array.from({ length: BARRIER_COUNT }, (_, index) => {
      const angle = (index / BARRIER_COUNT) * Math.PI * 2;
      const x = cx + Math.cos(angle) * BARRIER_RX;
      const z = cz + Math.sin(angle) * BARRIER_RZ;
      const rotY = -angle + Math.PI / 2;
      return { id: `barrier-${index}`, position: [x, -0.35, z] as [number, number, number], rotY };
    });
  }, []);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;

    if (ringRef.current) {
      ringRef.current.rotation.y = t * 0.12;
      ringRef.current.rotation.x = Math.sin(t * 0.35) * 0.08;
    }

    holoRefs.current.forEach((mat, index) => {
      if (!mat) {
        return;
      }

      const pulse = 0.75 + Math.sin(t * 2.2 + index * 1.4) * 0.25;
      mat.emissiveIntensity = 0.9 * pulse;
      mat.opacity = 0.55 + pulse * 0.22;
    });

    if (archBeamRef.current) {
      archBeamRef.current.emissiveIntensity = 2.1 + Math.sin(t * 3.5) * 0.45;
    }
  });

  return (
    <group name="BattleArenaFuturisticAccents">
      <SynthwaveSkyDome />

      {/* Energy halo over the circuit */}
      <mesh
        ref={ringRef}
        position={TRACK_CENTER}
        rotation={[Math.PI / 2, 0, 0]}
        material={ringMaterial}
        onUpdate={(self) => disableRaycast(self)}
      >
        <torusGeometry args={[28, 0.18, 12, 96]} />
      </mesh>
      <mesh
        position={[TRACK_CENTER[0], TRACK_CENTER[1] + 0.05, TRACK_CENTER[2]]}
        rotation={[Math.PI / 2, 0, 0]}
        onUpdate={(self) => disableRaycast(self)}
      >
        <torusGeometry args={[28, 0.04, 8, 96]} />
        <meshStandardMaterial
          color="#00e8ff"
          emissive="#00f5ff"
          emissiveIntensity={2.5}
          toneMapped={false}
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* Finish-line arch */}
      <group position={[0, -0.35, -35.8]}>
        <mesh position={[-9.5, 2.5, 0]} material={archPillarMaterial} onUpdate={(self) => disableRaycast(self)}>
          <boxGeometry args={[0.55, 5.2, 0.55]} />
        </mesh>
        <mesh position={[9.5, 2.5, 0]} material={archPillarMaterial} onUpdate={(self) => disableRaycast(self)}>
          <boxGeometry args={[0.55, 5.2, 0.55]} />
        </mesh>
        <mesh
          position={[0, 5.1, 0]}
          material={archBeamMaterial}
          onUpdate={(self) => {
            disableRaycast(self);
            archBeamRef.current = self.material as MeshStandardMaterial;
          }}
        >
          <boxGeometry args={[20.5, 0.35, 0.45]} />
        </mesh>
        <mesh position={[-9.5, 5.1, 0]} material={archBeamMaterial} onUpdate={(self) => disableRaycast(self)}>
          <boxGeometry args={[0.5, 0.5, 0.5]} />
        </mesh>
        <mesh position={[9.5, 5.1, 0]} material={archBeamMaterial} onUpdate={(self) => disableRaycast(self)}>
          <boxGeometry args={[0.5, 0.5, 0.5]} />
        </mesh>
        <pointLight position={[0, 5.5, 1.5]} color="#00e8ff" intensity={3.5} distance={28} decay={2} />
      </group>

      {/* Barrier wall */}
      {barrierPosts.map((post) => (
        <group key={post.id} position={post.position} rotation={[0, post.rotY, 0]}>
          <mesh material={barrierMaterial} onUpdate={(self) => disableRaycast(self)}>
            <boxGeometry args={[0.14, 1.35, 0.14]} />
          </mesh>
          <mesh position={[0, 0.78, 0]} material={barrierCapMaterial} onUpdate={(self) => disableRaycast(self)}>
            <boxGeometry args={[0.22, 0.12, 0.22]} />
          </mesh>
        </group>
      ))}

      {/* Holographic billboards */}
      {HOLO_SCREENS.map((screen, index) => (
        <group key={screen.id} position={screen.position} rotation={[0, screen.rotationY, 0]}>
          <mesh
            material={holoMaterials[index]}
            onUpdate={(self) => {
              disableRaycast(self);
              holoRefs.current[index] = self.material as MeshStandardMaterial;
            }}
          >
            <planeGeometry args={screen.scale} />
          </mesh>
          <mesh position={[0, 0, -0.08]} onUpdate={(self) => disableRaycast(self)}>
            <planeGeometry args={[screen.scale[0] + 0.3, screen.scale[1] + 0.3]} />
            <meshBasicMaterial color="#00e8ff" transparent opacity={0.12} side={BackSide} toneMapped={false} />
          </mesh>
        </group>
      ))}

      {/* Vertical energy pylons at corners */}
      {(
        [
          [-38, -33],
          [38, -33],
          [-38, -15],
          [38, -15],
        ] as Array<[number, number]>
      ).map(([x, z], index) => (
        <group key={`pylon-${index}`} position={[x, -0.35, z]}>
          <mesh onUpdate={(self) => disableRaycast(self)}>
            <cylinderGeometry args={[0.12, 0.18, 8.5, 8]} />
            <meshStandardMaterial
              color="#101828"
              emissive={index % 2 === 0 ? '#00c8ff' : '#c040ff'}
              emissiveIntensity={1.2}
              metalness={0.85}
              roughness={0.15}
            />
          </mesh>
          <pointLight
            position={[0, 4.5, 0]}
            color={index % 2 === 0 ? '#00e8ff' : '#cc66ff'}
            intensity={2.8}
            distance={32}
            decay={2}
          />
        </group>
      ))}
    </group>
  );
}
