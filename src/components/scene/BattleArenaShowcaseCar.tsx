'use client';

import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import { Box3, Group, Vector3 } from 'three';

import {
  BATTLE_ARENA_DEPTH_Z,
  BATTLE_ARENA_GROUND_Y,
} from '@/lib/battleArenaLayout';
import { prepareBattleArenaCarObject } from './battleArenaCarMaterials';

/** glTF export of the Blender Battle Arena showcase car. */
export const BATTLE_ARENA_CAR_URL = '/models/battle-arena-car.glb?v=5';

/** Center of arena — between menu buttons (left) and leaderboard (right). */
const SHOWCASE_POSITION: [number, number, number] = [0, BATTLE_ARENA_GROUND_Y, BATTLE_ARENA_DEPTH_Z];
const TARGET_FOOTPRINT = 9.2;
const ROTATION_SPEED = 0.42;
const FLOAT_AMPLITUDE = 0.07;

interface BattleArenaShowcaseCarProps {
  active: boolean;
}

/** Rotating hero car displayed at the center of the Battle Arena. */
export function BattleArenaShowcaseCar({ active }: BattleArenaShowcaseCarProps) {
  const pivotRef = useRef<Group | null>(null);
  const { scene } = useGLTF(BATTLE_ARENA_CAR_URL);

  const model = useMemo(() => {
    const clone = scene.clone(true);
    clone.updateMatrixWorld(true);

    const bounds = new Box3().setFromObject(clone);
    const size = new Vector3();
    bounds.getSize(size);

    const footprint = Math.max(size.x, size.z);
    const scale = footprint > 0 ? TARGET_FOOTPRINT / footprint : 1;
    clone.scale.setScalar(scale);
    clone.updateMatrixWorld(true);

    const scaledBounds = new Box3().setFromObject(clone);
    const scaledCenter = scaledBounds.getCenter(new Vector3());
    clone.position.set(-scaledCenter.x, -scaledBounds.min.y, -scaledCenter.z);

    prepareBattleArenaCarObject(clone);

    return clone;
  }, [scene]);

  useFrame(({ clock }, delta) => {
    if (!pivotRef.current || !active) {
      return;
    }

    pivotRef.current.rotation.y += delta * ROTATION_SPEED;
    pivotRef.current.position.y =
      SHOWCASE_POSITION[1] + Math.sin(clock.elapsedTime * 1.15) * FLOAT_AMPLITUDE;
  });

  return (
    <group ref={pivotRef} position={SHOWCASE_POSITION} name="BattleArenaShowcaseCar">
      <primitive object={model} />
    </group>
  );
}

useGLTF.preload(BATTLE_ARENA_CAR_URL);
