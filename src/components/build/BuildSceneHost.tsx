'use client';

import { useMemo } from 'react';

import { createForgeRuntime } from '@/flamecore';
import { FlameCoreR3FHost } from '@/flamecore/FlameCoreR3FHost';
import type { BuildInquiry, ChapterId } from '@/lib/buildInquiry';
import { useIsMobile } from '@/lib/hooks/useIsMobile';

import { BuildWorld } from './BuildWorld';

const FORGE_CAMERA = {
  position: [0.2, 2.15, 9.4] as [number, number, number],
  zoom: 1,
  fov: 42,
  near: 0.12,
  far: 120,
};

export interface BuildSceneHostProps {
  chapter: ChapterId;
  inquiry: BuildInquiry;
  progress: number;
  reducedMotion: boolean;
  hoverKey: string;
  onIgnite: () => void;
  onReady: () => void;
}

export function BuildSceneHost({
  chapter,
  inquiry,
  progress,
  reducedMotion,
  hoverKey,
  onIgnite,
  onReady,
}: BuildSceneHostProps) {
  const isMobile = useIsMobile();
  const dpr: [number, number] = useMemo(() => (isMobile ? [0.75, 1.25] : [1, 1.75]), [isMobile]);

  return (
    <div className="build-scene">
      <FlameCoreR3FHost
        isActive
        orthographic={false}
        camera={FORGE_CAMERA}
        dpr={dpr}
        createRuntime={createForgeRuntime}
        onReady={onReady}
      >
        <BuildWorld
          chapter={chapter}
          inquiry={inquiry}
          progress={progress}
          reducedMotion={reducedMotion}
          isMobile={isMobile}
          hoverKey={hoverKey}
          onIgnite={onIgnite}
        />
      </FlameCoreR3FHost>
    </div>
  );
}
