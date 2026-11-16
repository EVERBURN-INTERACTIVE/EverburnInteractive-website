'use client';

import { useLayoutEffect, type ReactNode } from 'react';

import {
  type ProjectsInnerTileAction,
  type ProjectsInnerTileNavigatePayload,
} from '@/lib/projectInnerTiles';

import { BattleArenaColosseum } from './BattleArenaColosseum';
import { PageMarker } from './GridWorld';
import { MarblePartySphere } from './MarblePartySphere';
import { ProductViewerDoor } from './ProductViewerDoor';
import { WorldPortfolioTree } from './WorldPortfolioTree';

interface ProjectsTileWorldProps {
  active: boolean;
  onInnerTileNavigate: (payload: ProjectsInnerTileNavigatePayload) => void;
  onReady?: () => void;
}

interface ProjectInnerTile {
  x: number;
  z: number;
  label: string;
  href: string;
  action: ProjectsInnerTileAction;
  icon: ReactNode;
}

/**
 * Four portfolio-style tiles in a 2×2 grid inside OUR PROJECTS.
 * Half-tile offsets keep the block centered on the camera look-at (0, 0).
 */
const PROJECT_INNER_TILES: ProjectInnerTile[] = [
  {
    x: -0.5,
    z: -0.5,
    label: 'MARBLE PARTY',
    href: '/games',
    action: 'marble-party-overlay',
    icon: <MarblePartySphere />,
  },
  {
    x: 0.5,
    z: -0.5,
    label: 'ONE MORE SECOND',
    href: '/games',
    action: 'battle-arena-racing',
    icon: <BattleArenaColosseum />,
  },
  {
    x: -0.5,
    z: 0.5,
    label: 'MINI CITY',
    href: '/games',
    action: 'mini-city-link',
    icon: <WorldPortfolioTree />,
  },
  {
    x: 0.5,
    z: 0.5,
    label: 'PRODUCT VIEWER',
    href: '/games',
    action: 'product-viewer-link',
    icon: <ProductViewerDoor />,
  },
];

export function ProjectsTileWorld({ active, onInnerTileNavigate, onReady }: ProjectsTileWorldProps) {
  useLayoutEffect(() => {
    onReady?.();
  }, [onReady]);

  return (
    <group name="ProjectsTileWorld">
      {PROJECT_INNER_TILES.map((tile) => (
        <PageMarker
          key={`${tile.x}-${tile.z}-${tile.label}`}
          x={tile.x}
          z={tile.z}
          label={tile.label}
          href={tile.href}
          active={active}
          icon={tile.icon}
          onNavigate={(_href, tileWorldPosition) => {
            onInnerTileNavigate({
              action: tile.action,
              tileWorldPosition,
            });
          }}
        />
      ))}
    </group>
  );
}
