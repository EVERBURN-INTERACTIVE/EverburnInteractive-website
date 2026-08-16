import type { RefObject } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useRef } from 'react';
import type { Group, OrthographicCamera } from 'three';

/** Shared Y/Z for all Battle Arena floating UI and the showcase car. */
export const BATTLE_ARENA_GROUND_Y = 0.35;
export const BATTLE_ARENA_DEPTH_Z = 0.5;

/**
 * Half-widths used when pinning side UI to the viewport.
 * Keep these ≥ actual mesh half-widths so panels stay fully on-screen.
 */
export const BATTLE_ARENA_MENU_HALF_WIDTH = 2.7;
export const BATTLE_ARENA_BOARD_HALF_WIDTH = 3.1;

/** Padding from the viewport edge in world units. */
export const BATTLE_ARENA_EDGE_PADDING = 0.35;

/**
 * Zoom vs campsite camera for the car + menu shell.
 * Previously 0.34 for the large track/stadium backdrop (removed) — that made
 * buttons tiny and pushed the leaderboard off the right edge.
 */
export const BATTLE_ARENA_ZOOM_SCALE = 0.78;

export function getBattleArenaHalfWidth(camera: OrthographicCamera, viewportWidth: number): number {
  const zoom = Math.max(camera.zoom, 0.001);
  return viewportWidth / (2 * zoom);
}

export function getBattleArenaHalfHeight(camera: OrthographicCamera, viewportHeight: number): number {
  const zoom = Math.max(camera.zoom, 0.001);
  return viewportHeight / (2 * zoom);
}

interface BattleArenaSideLayoutProps {
  menuRef?: RefObject<Group | null>;
  boardRef: RefObject<Group | null>;
}

/** Pins the leaderboard to the right viewport edge each frame. */
export function BattleArenaSideLayout({ menuRef, boardRef }: BattleArenaSideLayoutProps) {
  const { camera, size } = useThree();

  useFrame(() => {
    const ortho = camera as OrthographicCamera;
    const halfW = getBattleArenaHalfWidth(ortho, size.width);

    // Fall back to a readable gap when the frustum is still settling.
    const menuEdge = Math.max(
      5.5,
      halfW - BATTLE_ARENA_MENU_HALF_WIDTH - BATTLE_ARENA_EDGE_PADDING,
    );
    const boardEdge = Math.max(
      5.5,
      halfW - BATTLE_ARENA_BOARD_HALF_WIDTH - BATTLE_ARENA_EDGE_PADDING,
    );

    if (menuRef?.current) {
      menuRef.current.position.set(-menuEdge, BATTLE_ARENA_GROUND_Y, BATTLE_ARENA_DEPTH_Z);
    }

    if (boardRef.current) {
      boardRef.current.position.set(boardEdge, BATTLE_ARENA_GROUND_Y, BATTLE_ARENA_DEPTH_Z);
    }
  });

  return null;
}

export function useBattleArenaAnchorRefs(): {
  menuRef: RefObject<Group | null>;
  boardRef: RefObject<Group | null>;
} {
  return {
    menuRef: useRef<Group | null>(null),
    boardRef: useRef<Group | null>(null),
  };
}
