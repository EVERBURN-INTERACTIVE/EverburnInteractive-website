'use client';

import { useGLTF } from '@react-three/drei';
import { useMemo } from 'react';
import { Mesh, Object3D } from 'three';

import { SCI_FI_TRACKS_BASE, TRACK_FLAT_ROTATION_X, TRACK_PIECE_SCALE } from '@/lib/battleArenaTrackLayout';
import type { TrackPiecePlacement } from '@/lib/battleArenaTrackLayout';
import { prepareGltfObject } from './TileGlbIcon';

function prepareBackdropObject(root: Object3D): void {
  prepareGltfObject(root);
  root.traverse((child) => {
    if (child instanceof Mesh) {
      child.raycast = () => undefined;
    }
  });
}

interface SciFiTrackPieceProps {
  placement: TrackPiecePlacement;
}

function SciFiTrackPieceLoaded({ placement }: SciFiTrackPieceProps) {
  const url = `${SCI_FI_TRACKS_BASE}/${placement.file}`;
  const { scene } = useGLTF(url);

  const model = useMemo(() => {
    const clone = scene.clone(true);
    prepareBackdropObject(clone);
    return clone;
  }, [scene]);

  return (
    <group
      position={placement.position}
      rotation={[TRACK_FLAT_ROTATION_X, placement.rotationY, 0]}
      scale={TRACK_PIECE_SCALE}
    >
      <primitive object={model} />
    </group>
  );
}

/** Single modular track segment in the Battle Arena backdrop. */
export function SciFiTrackPiece({ placement }: SciFiTrackPieceProps) {
  return <SciFiTrackPieceLoaded placement={placement} />;
}

export function preloadSciFiTrackKit(): void {
  if (typeof window === 'undefined') {
    return;
  }

  const files = new Set([
    'track_straight.glb',
    'track_curveleft_90.glb',
    'track_curveright_90.glb',
    'track_jump.glb',
    'track_boost.glb',
    'track_slow.glb',
  ]);

  files.forEach((file) => {
    useGLTF.preload(`${SCI_FI_TRACKS_BASE}/${file}`);
  });
}
