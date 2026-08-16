'use client';

import { Suspense, useLayoutEffect, useMemo, useRef } from 'react';
import { Billboard, Text } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { DoubleSide, Mesh, MeshBasicMaterial } from 'three';
import type { Group } from 'three';

import {
  BATTLE_ARENA_NEON_EDGE,
  applyBattleArenaNeonPulse,
  createBattleArenaInsetMaterial,
  createBattleArenaNeonEdgeMaterial,
  createBattleArenaPanelMaterial,
  createBattleArenaRowMaterial,
} from '@/lib/battleArenaUiTheme';
import type { LeaderboardEntry } from '@/lib/omsLeaderboard';

const BOARD_WIDTH = 5.8;
const BOARD_HEIGHT = 7.6;
/** Keep UI flat — thick boxes show double bottom edges in the isometric view. */
const FACE_Z = 0.01;
const FRAME_Z = 0.02;
const FRAME_THICKNESS = 0.07;
const FLOAT_PHASE = 2.15;

const DEFAULT_ENTRIES: LeaderboardEntry[] = Array.from({ length: 8 }, (_, index) => ({
  rank: index + 1,
  name: '—',
  time: '--:--.---',
}));

const COLUMN_X = {
  rank: -2.1,
  name: -0.3,
  time: 1.75,
} as const;

interface BattleArenaLeaderboardProps {
  active: boolean;
  entries?: LeaderboardEntry[];
}

function disableTextRaycast(mesh: Mesh | null) {
  if (mesh) {
    mesh.raycast = () => undefined;
  }
}

/** Floating sci-fi leaderboard for One More Second. */
export function BattleArenaLeaderboard({
  active,
  entries = DEFAULT_ENTRIES,
}: BattleArenaLeaderboardProps) {
  const floatRef = useRef<Group | null>(null);
  const boardMeshesRef = useRef<Group | null>(null);
  const frameRef = useRef<Mesh | null>(null);

  const panelMaterial = useMemo(() => {
    const material = createBattleArenaPanelMaterial();
    material.side = DoubleSide;
    return material;
  }, []);
  const frameMaterial = useMemo(() => createBattleArenaNeonEdgeMaterial(), []);
  const insetMaterial = useMemo(() => {
    const material = createBattleArenaInsetMaterial();
    material.side = DoubleSide;
    return material;
  }, []);
  const rowMaterial = useMemo(() => {
    const material = createBattleArenaRowMaterial();
    material.side = DoubleSide;
    return material;
  }, []);

  useLayoutEffect(() => {
    boardMeshesRef.current?.traverse((child) => {
      if (child instanceof Mesh) {
        child.raycast = () => undefined;
        child.castShadow = false;
        child.receiveShadow = false;
      }
    });
  }, [entries]);

  useFrame(({ clock }) => {
    if (!floatRef.current) {
      return;
    }

    const t = clock.elapsedTime;
    const phase = FLOAT_PHASE;
    const bob = Math.sin(t * 1.35 + phase) * 0.11;
    const drift = Math.sin(t * 0.7 + phase * 1.7) * 0.04;

    floatRef.current.position.y = bob;
    floatRef.current.position.x = drift;
    // Do not rotate Z — it fights Billboard and exaggerates edge artifacts.

    const breathe = 1 + Math.sin(t * 1.15 + phase) * 0.012;
    floatRef.current.scale.setScalar(breathe);

    const frameMat = frameRef.current?.material as MeshBasicMaterial | undefined;
    if (frameMat) {
      const pulse = 0.85 + Math.sin(t * 3.2 + phase) * 0.1;
      applyBattleArenaNeonPulse(frameMat, pulse);
    }
  });

  const rowCount = Math.max(entries.length, 1);
  const titleY = BOARD_HEIGHT / 2 - 0.55;
  const headerY = titleY - 0.62;
  const rowsTop = headerY - 0.42;
  const rowsBottom = -BOARD_HEIGHT / 2 + 0.42;
  const rowStep = (rowsTop - rowsBottom) / rowCount;
  const rowHeight = Math.min(0.4, rowStep * 0.7);
  const firstRowY = rowsTop - rowStep * 0.5;
  const contentTop = rowsTop + 0.08;
  const contentBottom = rowsBottom - 0.08;
  const contentHeight = contentTop - contentBottom;
  const contentCenterY = (contentTop + contentBottom) / 2;

  return (
    <group ref={floatRef} name="BattleArenaLeaderboard">
      <Billboard follow>
        <group ref={boardMeshesRef}>
          <mesh material={panelMaterial} position={[0, 0, 0]}>
            <planeGeometry args={[BOARD_WIDTH, BOARD_HEIGHT]} />
          </mesh>

          <mesh position={[0, contentCenterY, FACE_Z]} material={insetMaterial}>
            <planeGeometry args={[BOARD_WIDTH * 0.88, contentHeight]} />
          </mesh>

          {entries.map((entry, index) => {
            const rowY = firstRowY - index * rowStep;
            return (
              <mesh
                key={`row-bg-${entry.rank}`}
                position={[0, rowY, FACE_Z + 0.001]}
                material={rowMaterial}
              >
                <planeGeometry args={[BOARD_WIDTH * 0.84, rowHeight]} />
              </mesh>
            );
          })}

          {/* Neon frame — flat bars on the face, not thick boxes */}
          <mesh
            ref={frameRef}
            material={frameMaterial}
            position={[-BOARD_WIDTH / 2 + FRAME_THICKNESS / 2, 0, FRAME_Z]}
          >
            <planeGeometry args={[FRAME_THICKNESS, BOARD_HEIGHT]} />
          </mesh>
          <mesh
            material={frameMaterial}
            position={[BOARD_WIDTH / 2 - FRAME_THICKNESS / 2, 0, FRAME_Z]}
          >
            <planeGeometry args={[FRAME_THICKNESS, BOARD_HEIGHT]} />
          </mesh>
          <mesh
            material={frameMaterial}
            position={[0, BOARD_HEIGHT / 2 - FRAME_THICKNESS / 2, FRAME_Z]}
          >
            <planeGeometry args={[BOARD_WIDTH, FRAME_THICKNESS]} />
          </mesh>
          <mesh
            material={frameMaterial}
            position={[0, -BOARD_HEIGHT / 2 + FRAME_THICKNESS / 2, FRAME_Z]}
          >
            <planeGeometry args={[BOARD_WIDTH, FRAME_THICKNESS]} />
          </mesh>

          <Suspense fallback={null}>
            <Text
              onSync={(mesh) => {
                disableTextRaycast(mesh as unknown as Mesh);
              }}
              position={[0, titleY, FRAME_Z + 0.01]}
              fontSize={0.44}
              color="#f3fbff"
              anchorX="center"
              anchorY="middle"
              letterSpacing={0.08}
              outlineWidth={0.014}
              outlineColor={BATTLE_ARENA_NEON_EDGE}
              outlineOpacity={0.65}
              material-toneMapped={false}
            >
              LEADERBOARD
            </Text>

            <Text
              onSync={(mesh) => {
                disableTextRaycast(mesh as unknown as Mesh);
              }}
              position={[COLUMN_X.rank, headerY, FRAME_Z + 0.01]}
              fontSize={0.18}
              color={BATTLE_ARENA_NEON_EDGE}
              anchorX="center"
              anchorY="middle"
              letterSpacing={0.05}
              material-toneMapped={false}
            >
              #
            </Text>
            <Text
              onSync={(mesh) => {
                disableTextRaycast(mesh as unknown as Mesh);
              }}
              position={[COLUMN_X.name, headerY, FRAME_Z + 0.01]}
              fontSize={0.18}
              color={BATTLE_ARENA_NEON_EDGE}
              anchorX="left"
              anchorY="middle"
              letterSpacing={0.05}
              material-toneMapped={false}
            >
              PLAYER
            </Text>
            <Text
              onSync={(mesh) => {
                disableTextRaycast(mesh as unknown as Mesh);
              }}
              position={[COLUMN_X.time, headerY, FRAME_Z + 0.01]}
              fontSize={0.18}
              color={BATTLE_ARENA_NEON_EDGE}
              anchorX="right"
              anchorY="middle"
              letterSpacing={0.05}
              material-toneMapped={false}
            >
              TIME
            </Text>

            {entries.map((entry, index) => {
              const rowY = firstRowY - index * rowStep;
              const rowColor = index === 0 ? '#fff4c8' : '#d6eeff';

              return (
                <group key={`leaderboard-row-${entry.rank}`}>
                  <Text
                    onSync={(mesh) => {
                      disableTextRaycast(mesh as unknown as Mesh);
                    }}
                    position={[COLUMN_X.rank, rowY, FRAME_Z + 0.01]}
                    fontSize={0.23}
                    color={rowColor}
                    anchorX="center"
                    anchorY="middle"
                    material-toneMapped={false}
                  >
                    {String(entry.rank)}
                  </Text>
                  <Text
                    onSync={(mesh) => {
                      disableTextRaycast(mesh as unknown as Mesh);
                    }}
                    position={[COLUMN_X.name, rowY, FRAME_Z + 0.01]}
                    fontSize={0.23}
                    color={rowColor}
                    anchorX="left"
                    anchorY="middle"
                    maxWidth={2.4}
                    material-toneMapped={false}
                  >
                    {entry.name}
                  </Text>
                  <Text
                    onSync={(mesh) => {
                      disableTextRaycast(mesh as unknown as Mesh);
                    }}
                    position={[COLUMN_X.time, rowY, FRAME_Z + 0.01]}
                    fontSize={0.23}
                    color={rowColor}
                    anchorX="right"
                    anchorY="middle"
                    material-toneMapped={false}
                  >
                    {entry.time}
                  </Text>
                </group>
              );
            })}
          </Suspense>
        </group>
      </Billboard>
    </group>
  );
}
