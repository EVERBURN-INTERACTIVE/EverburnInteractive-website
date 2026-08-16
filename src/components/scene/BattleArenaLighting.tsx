'use client';

import { Environment } from '@react-three/drei';

interface BattleArenaLightingProps {
  active: boolean;
}

/** IBL + fill lights so metallic car materials match Blender (dark metal needs reflections). */
export function BattleArenaLighting({ active }: BattleArenaLightingProps) {
  if (!active) {
    return null;
  }

  return (
    <>
      <Environment preset="night" environmentIntensity={0.9} />
      <directionalLight position={[-6, 10, 4]} intensity={0.95} color="#9ecbff" />
      <directionalLight position={[5, 8, -5]} intensity={0.65} color="#ffd0a8" />
      <pointLight position={[0, 5, 8]} intensity={1.4} distance={40} decay={2} />
    </>
  );
}
