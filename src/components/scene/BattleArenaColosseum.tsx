'use client';

import { TileGlbIcon, preloadTileGlb } from './TileGlbIcon';

/** glTF export of the Blender colosseum / stadium model. */
export const BATTLE_ARENA_COLOSSEUM_URL = '/models/battle-arena-colosseum.glb?v=3';

export interface BattleArenaColosseumProps {
  position?: [number, number, number];
  rotationY?: number;
}

export function BattleArenaColosseum({
  position,
  rotationY = -Math.PI / 6,
}: BattleArenaColosseumProps) {
  return (
    <TileGlbIcon
      url={BATTLE_ARENA_COLOSSEUM_URL}
      position={position}
      rotationY={rotationY}
      targetFootprint={2.85}
    />
  );
}

preloadTileGlb(BATTLE_ARENA_COLOSSEUM_URL);
