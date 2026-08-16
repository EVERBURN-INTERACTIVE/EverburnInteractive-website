'use client';

import { Suspense, useMemo, useRef, useState } from 'react';
import { Billboard, Text } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { MathUtils, MeshBasicMaterial } from 'three';
import type { Group, Mesh } from 'three';

import {
  BATTLE_ARENA_NEON_EDGE,
  applyBattleArenaNeonPulse,
  applyBattleArenaPanelHover,
  createBattleArenaNeonEdgeMaterial,
  createBattleArenaNeonGlowMaterial,
  createBattleArenaPanelMaterial,
} from '@/lib/battleArenaUiTheme';

const PANEL_WIDTH = 5.1;
const PANEL_HEIGHT = 1.2;
const PANEL_DEPTH = 0.14;
const BUTTON_GAP = 1.45;
const TITLE_FONT_SIZE = 0.36;
const SUBLABEL_FONT_SIZE = 0.19;

interface MenuButtonSpec {
  id: string;
  label: string;
  sublabel?: string;
  disabled?: boolean;
}

const MENU_BUTTONS: MenuButtonSpec[] = [
  { id: 'time-trial', label: 'Time Trial' },
  { id: 'multiplayer', label: 'Multiplayer', sublabel: 'Coming Soon', disabled: true },
  { id: 'cars', label: 'Cars' },
];

interface FloatingMenuButtonProps {
  spec: MenuButtonSpec;
  yOffset: number;
  phase: number;
  active: boolean;
  onSelect?: (id: string) => void;
}

function FloatingMenuButton({ spec, yOffset, phase, active, onSelect }: FloatingMenuButtonProps) {
  const rootRef = useRef<Group | null>(null);
  const panelRef = useRef<Mesh | null>(null);
  const glowRef = useRef<Mesh | null>(null);
  const frameRef = useRef<Mesh | null>(null);
  const labelRef = useRef<Mesh | null>(null);
  const sublabelRef = useRef<Mesh | null>(null);
  const [hovered, setHovered] = useState(false);
  const hoverRef = useRef(0);

  const disableLabelRaycast = (mesh: Mesh | null) => {
    if (mesh) {
      mesh.raycast = () => undefined;
    }
  };

  const panelMaterial = useMemo(() => createBattleArenaPanelMaterial(), []);
  const glowMaterial = useMemo(() => createBattleArenaNeonGlowMaterial(), []);
  const frameMaterial = useMemo(() => createBattleArenaNeonEdgeMaterial(), []);

  useFrame(({ clock }, delta) => {
    if (!rootRef.current) {
      return;
    }

    const t = clock.elapsedTime;
    const bob = Math.sin(t * 1.35 + phase) * 0.11;
    const drift = Math.sin(t * 0.7 + phase * 1.7) * 0.04;
    rootRef.current.position.y = yOffset + bob;
    rootRef.current.position.x = drift;
    rootRef.current.rotation.z = Math.sin(t * 0.9 + phase) * 0.018;

    const targetHover = active && hovered ? (spec.disabled ? 0.22 : 1) : 0;
    hoverRef.current = MathUtils.damp(hoverRef.current, targetHover, 8, delta);

    const hover = hoverRef.current;
    const panelMat = panelRef.current?.material as MeshBasicMaterial | undefined;
    const glowMat = glowRef.current?.material as MeshBasicMaterial | undefined;
    const frameMat = frameRef.current?.material as MeshBasicMaterial | undefined;

    if (panelMat) {
      applyBattleArenaPanelHover(panelMat, hover, Boolean(spec.disabled));
    }

    if (glowMat) {
      glowMat.opacity = 0.18 + hover * 0.22;
    }

    if (frameMat) {
      const pulse = 0.82 + hover * 0.18 + Math.sin(t * 3.2 + phase) * 0.08;
      applyBattleArenaNeonPulse(frameMat, pulse);
    }

    const scale = 1 + hover * 0.045;
    rootRef.current.scale.setScalar(scale);
  });

  const handleClick = () => {
    if (!active || spec.disabled) {
      return;
    }

    onSelect?.(spec.id);
  };

  const titleColor = spec.disabled ? '#b8c2cc' : hovered ? '#f3fbff' : '#d6eeff';
  const sublabelColor = spec.disabled ? '#c9a08a' : '#ffaa78';
  const labelZ = PANEL_DEPTH / 2 + 0.03;

  return (
    <group ref={rootRef} position={[0, yOffset, 0]}>
      <Billboard follow>
        <group
          onPointerOver={(event) => {
            event.stopPropagation();
            if (active) {
              setHovered(true);
              document.body.style.cursor = spec.disabled ? 'not-allowed' : 'pointer';
            }
          }}
          onPointerOut={(event) => {
            event.stopPropagation();
            setHovered(false);
            document.body.style.cursor = 'auto';
          }}
          onClick={(event) => {
            event.stopPropagation();
            handleClick();
          }}
        >
          {/* Under-glow slab */}
          <mesh ref={glowRef} position={[0, -0.06, -0.05]} material={glowMaterial}>
            <boxGeometry args={[PANEL_WIDTH * 1.04, PANEL_HEIGHT * 0.55, PANEL_DEPTH * 0.6]} />
          </mesh>

          {/* Main rectangular panel */}
          <mesh ref={panelRef} material={panelMaterial}>
            <boxGeometry args={[PANEL_WIDTH, PANEL_HEIGHT, PANEL_DEPTH]} />
          </mesh>

          {/* Neon blue edge trim */}
          <mesh ref={frameRef} material={frameMaterial} position={[-PANEL_WIDTH / 2 + 0.06, 0, PANEL_DEPTH / 2 + 0.018]}>
            <boxGeometry args={[0.06, PANEL_HEIGHT * 0.94, 0.035]} />
          </mesh>
          <mesh material={frameMaterial} position={[PANEL_WIDTH / 2 - 0.06, 0, PANEL_DEPTH / 2 + 0.018]}>
            <boxGeometry args={[0.06, PANEL_HEIGHT * 0.94, 0.035]} />
          </mesh>
          <mesh material={frameMaterial} position={[0, PANEL_HEIGHT / 2 - 0.05, PANEL_DEPTH / 2 + 0.018]}>
            <boxGeometry args={[PANEL_WIDTH * 0.94, 0.06, 0.035]} />
          </mesh>
          <mesh material={frameMaterial} position={[0, -PANEL_HEIGHT / 2 + 0.05, PANEL_DEPTH / 2 + 0.018]}>
            <boxGeometry args={[PANEL_WIDTH * 0.94, 0.06, 0.035]} />
          </mesh>

          <Suspense fallback={null}>
            <Text
              ref={labelRef}
              onSync={(mesh) => {
                disableLabelRaycast(mesh as unknown as Mesh);
              }}
              position={[0, spec.sublabel ? 0.15 : 0, labelZ]}
              fontSize={TITLE_FONT_SIZE}
              color={titleColor}
              anchorX="center"
              anchorY="middle"
              maxWidth={PANEL_WIDTH * 0.88}
              textAlign="center"
              letterSpacing={0.06}
              outlineWidth={0.016}
              outlineColor={BATTLE_ARENA_NEON_EDGE}
              outlineOpacity={hovered ? 0.85 : 0.4}
              material-toneMapped={false}
            >
              {spec.label.toUpperCase()}
            </Text>

            {spec.sublabel ? (
              <Text
                ref={sublabelRef}
                onSync={(mesh) => {
                  disableLabelRaycast(mesh as unknown as Mesh);
                }}
                position={[0, -0.25, labelZ]}
                fontSize={SUBLABEL_FONT_SIZE}
                color={sublabelColor}
                anchorX="center"
                anchorY="middle"
                maxWidth={PANEL_WIDTH * 0.88}
                textAlign="center"
                letterSpacing={0.05}
                outlineWidth={0.01}
                outlineColor="#ff8844"
                outlineOpacity={0.35}
                material-toneMapped={false}
              >
                {spec.sublabel.toUpperCase()}
              </Text>
            ) : null}
          </Suspense>

          {/* Invisible hit area for easier hover */}
          <mesh visible={false}>
            <boxGeometry args={[PANEL_WIDTH * 1.08, PANEL_HEIGHT * 1.35, PANEL_DEPTH * 2.5]} />
            <meshBasicMaterial transparent opacity={0} />
          </mesh>
        </group>
      </Billboard>
    </group>
  );
}

interface BattleArenaMenuButtonsProps {
  active: boolean;
  onSelect?: (id: string) => void;
}

/** Floating main-menu style buttons in 3D space for the Battle Arena. */
export function BattleArenaMenuButtons({ active, onSelect }: BattleArenaMenuButtonsProps) {
  const yOffsets = useMemo(() => {
    const center = (MENU_BUTTONS.length - 1) / 2;
    return MENU_BUTTONS.map((_, index) => (center - index) * BUTTON_GAP);
  }, []);

  return (
    <group name="BattleArenaMenuButtons">
      {MENU_BUTTONS.map((spec, index) => (
        <FloatingMenuButton
          key={spec.id}
          spec={spec}
          yOffset={yOffsets[index]}
          phase={index * 1.35}
          active={active}
          onSelect={onSelect}
        />
      ))}
    </group>
  );
}
