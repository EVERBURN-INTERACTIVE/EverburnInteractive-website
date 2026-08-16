'use client';



import { Suspense, useMemo } from 'react';



import {

  BATTLE_ARENA_GROUND,

  BATTLE_ARENA_TRACK_PLACEMENTS,

} from '@/lib/battleArenaTrackLayout';

import {

  getCyberArenaFloorMaterial,

  getCyberArenaVoidMaterial,

} from '@/lib/battleArenaTrackMaterials';



import { BattleArenaAtmosphere } from './BattleArenaAtmosphere';

import { BattleArenaFuturisticAccents } from './BattleArenaFuturisticAccents';

import { BattleArenaStadiumBackdrop } from './BattleArenaStadiumBackdrop';

import { SciFiTrackPiece, preloadSciFiTrackKit } from './SciFiTrackPiece';



interface BattleArenaTrackBackgroundProps {

  active: boolean;

}



if (typeof window !== 'undefined') {

  preloadSciFiTrackKit();

}



/** Futuristic neon racing circuit — cyber grid, stadium, barriers, and holograms. */

export function BattleArenaTrackBackground({ active }: BattleArenaTrackBackgroundProps) {

  const cyberFloorMaterial = useMemo(() => getCyberArenaFloorMaterial(), []);

  const cyberVoidMaterial = useMemo(() => getCyberArenaVoidMaterial(), []);



  if (!active) {

    return null;

  }



  const [groundX, groundY, groundZ] = BATTLE_ARENA_GROUND.center;

  const [groundW, groundD] = BATTLE_ARENA_GROUND.size;



  return (

    <group name="BattleArenaTrackBackground">

      <BattleArenaAtmosphere active={active} />

      <BattleArenaFuturisticAccents />



      {/* Outer cyber void */}

      <mesh

        position={[groundX, groundY - 0.12, groundZ]}

        rotation={[-Math.PI / 2, 0, 0]}

        receiveShadow

        material={cyberVoidMaterial}

        onUpdate={(self) => {

          self.raycast = () => undefined;

        }}

      >

        <planeGeometry args={[groundW * 1.55, groundD * 1.65]} />

      </mesh>



      {/* Animated neon circuit floor */}

      <mesh

        position={[groundX, groundY, groundZ]}

        rotation={[-Math.PI / 2, 0, 0]}

        receiveShadow

        material={cyberFloorMaterial}

        onUpdate={(self) => {

          self.raycast = () => undefined;

        }}

      >

        <planeGeometry args={[groundW, groundD]} />

      </mesh>



      <Suspense fallback={null}>

        <BattleArenaStadiumBackdrop />

        {BATTLE_ARENA_TRACK_PLACEMENTS.map((placement) => (

          <SciFiTrackPiece key={placement.id} placement={placement} />

        ))}

      </Suspense>

    </group>

  );

}


