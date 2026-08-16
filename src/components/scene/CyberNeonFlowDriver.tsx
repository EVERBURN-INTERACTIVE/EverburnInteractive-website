'use client';

import { useFrame } from '@react-three/fiber';

import { tickCyberNeonFlowMaterials } from '@/lib/materials/cyberNeonFlowMaterial';

/** Drives uFlowOffset for all registered M_Cyber_Neon_Flow materials in the scene. */
export function CyberNeonFlowDriver() {
  useFrame(({ clock }) => {
    tickCyberNeonFlowMaterials(clock.elapsedTime);
  });

  return null;
}
