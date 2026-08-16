'use client';

import type { ReactNode } from 'react';

import {
  type ProjectsInnerTileAction,
  type ProjectsInnerTileNavigatePayload,
} from '@/lib/projectInnerTiles';

import { BattleArenaColosseum } from './BattleArenaColosseum';
import { PageMarker } from './GridWorld';
import { MarblePartySphere } from './MarblePartySphere';
import { WorldPortfolioTree } from './WorldPortfolioTree';

interface ProjectsTileWorldProps {
  active: boolean;
  onInnerTileNavigate: (payload: ProjectsInnerTileNavigatePayload) => void;
}

interface ProjectInnerTile {
  x: number;
  z: number;
  label: string;
  href: string;
  action: ProjectsInnerTileAction;
  icon: ReactNode;
}

/** Three portfolio-style tiles shown inside OUR PROJECTS. */
const PROJECT_INNER_TILES: ProjectInnerTile[] = [
  {
    x: -1,
    z: 0,
    label: 'MARBLE PARTY',
    href: '/games',
    action: 'marble-party-overlay',
    icon: <MarblePartySphere />,
  },
  {
    x: 0,
    z: 0,
    label: 'ONE MORE SECOND',
    href: '/games',
    action: 'battle-arena-racing',
    icon: <BattleArenaColosseum />,
  },
  {
    x: 1,
    z: 0,
    label: 'WORLD PORTFOLIO',
    href: '/games',
    action: 'world-portfolio-link',
    icon: <WorldPortfolioTree />,
  },
];

export function ProjectsTileWorld({ active, onInnerTileNavigate }: ProjectsTileWorldProps) {
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
