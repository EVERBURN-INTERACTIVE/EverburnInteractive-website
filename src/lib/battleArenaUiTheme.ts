import { Color, MeshBasicMaterial } from 'three';

/** Shared Battle Arena UI palette — deep red panels with neon blue edge trim. */

/** Deep crimson fill (unlit; reads correctly on the blue sky backdrop). */
export const BATTLE_ARENA_PANEL_BG = '#4a0a0a';
export const BATTLE_ARENA_PANEL_BG_HOVER = '#621212';

export const BATTLE_ARENA_INSET_BG = '#2a0505';
export const BATTLE_ARENA_ROW_BG = '#380808';
export const BATTLE_ARENA_BASE_SLAB = '#1e0404';

export const BATTLE_ARENA_NEON_EDGE = '#00e8ff';
export const BATTLE_ARENA_NEON_EDGE_DIM = '#00b8cc';

const panelColor = new Color(BATTLE_ARENA_PANEL_BG);
const panelHoverColor = new Color(BATTLE_ARENA_PANEL_BG_HOVER);
const panelDisabledColor = new Color('#320808');
const neonColor = new Color(BATTLE_ARENA_NEON_EDGE);
const neonDimColor = new Color(BATTLE_ARENA_NEON_EDGE_DIM);

/** Unlit panel — avoids sky/IBL turning red into gray-purple. */
export function createBattleArenaPanelMaterial(): MeshBasicMaterial {
  return new MeshBasicMaterial({
    color: BATTLE_ARENA_PANEL_BG,
    toneMapped: false,
  });
}

export function createBattleArenaInsetMaterial(): MeshBasicMaterial {
  return new MeshBasicMaterial({
    color: BATTLE_ARENA_INSET_BG,
    toneMapped: false,
  });
}

export function createBattleArenaRowMaterial(): MeshBasicMaterial {
  return new MeshBasicMaterial({
    color: BATTLE_ARENA_ROW_BG,
    toneMapped: false,
    transparent: true,
    opacity: 0.92,
  });
}

export function createBattleArenaBaseSlabMaterial(): MeshBasicMaterial {
  return new MeshBasicMaterial({
    color: BATTLE_ARENA_BASE_SLAB,
    toneMapped: false,
  });
}

/** Bright neon edge lines — always read as cyan regardless of scene lights. */
export function createBattleArenaNeonEdgeMaterial(): MeshBasicMaterial {
  return new MeshBasicMaterial({
    color: BATTLE_ARENA_NEON_EDGE,
    toneMapped: false,
  });
}

export function createBattleArenaNeonGlowMaterial(): MeshBasicMaterial {
  return new MeshBasicMaterial({
    color: BATTLE_ARENA_NEON_EDGE,
    toneMapped: false,
    transparent: true,
    opacity: 0.22,
  });
}

export function applyBattleArenaPanelHover(
  material: MeshBasicMaterial,
  hover: number,
  disabled: boolean,
): void {
  if (disabled) {
    material.color.copy(panelDisabledColor);
    return;
  }

  material.color.copy(panelColor).lerp(panelHoverColor, hover);
}

export function applyBattleArenaNeonPulse(material: MeshBasicMaterial, pulse: number): void {
  material.color.copy(neonDimColor).lerp(neonColor, pulse);
}
