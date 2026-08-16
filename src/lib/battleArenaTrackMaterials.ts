import { BackSide, MeshStandardMaterial } from 'three';

import { createCyberNeonFlowPlaneMaterial } from '@/lib/materials/cyberNeonFlowMaterial';

let cyberFloorMaterial: MeshStandardMaterial | null = null;
let cyberVoidMaterial: MeshStandardMaterial | null = null;
let neonBarrierMaterial: MeshStandardMaterial | null = null;
let holoScreenMaterial: MeshStandardMaterial | null = null;
let energyRingMaterial: MeshStandardMaterial | null = null;

/** Main infield — animated cyan/magenta circuit grid. */
export function getCyberArenaFloorMaterial(): MeshStandardMaterial {
  if (!cyberFloorMaterial) {
    cyberFloorMaterial = createCyberNeonFlowPlaneMaterial(14, 8, '#050810');
    cyberFloorMaterial.metalness = 0.55;
    cyberFloorMaterial.roughness = 0.28;
    cyberFloorMaterial.emissiveIntensity = 1.65;
  }

  return cyberFloorMaterial;
}

/** Outer void with subtler neon traces. */
export function getCyberArenaVoidMaterial(): MeshStandardMaterial {
  if (!cyberVoidMaterial) {
    cyberVoidMaterial = createCyberNeonFlowPlaneMaterial(22, 14, '#03040a');
    cyberVoidMaterial.metalness = 0.42;
    cyberVoidMaterial.roughness = 0.38;
    cyberVoidMaterial.emissiveIntensity = 0.95;
  }

  return cyberVoidMaterial;
}

export function getNeonBarrierMaterial(): MeshStandardMaterial {
  if (!neonBarrierMaterial) {
    neonBarrierMaterial = new MeshStandardMaterial({
      color: '#0a1420',
      emissive: '#00e8ff',
      emissiveIntensity: 1.4,
      metalness: 0.72,
      roughness: 0.18,
    });
  }

  return neonBarrierMaterial;
}

export function getNeonBarrierCapMaterial(): MeshStandardMaterial {
  return new MeshStandardMaterial({
    color: '#00f5ff',
    emissive: '#00f5ff',
    emissiveIntensity: 2.2,
    metalness: 0.2,
    roughness: 0.12,
    toneMapped: false,
  });
}

export function getHoloScreenMaterial(): MeshStandardMaterial {
  if (!holoScreenMaterial) {
    holoScreenMaterial = new MeshStandardMaterial({
      color: '#0a1830',
      emissive: '#4488ff',
      emissiveIntensity: 1.1,
      metalness: 0.15,
      roughness: 0.35,
      transparent: true,
      opacity: 0.72,
      side: BackSide,
    });
  }

  return holoScreenMaterial;
}

export function getEnergyRingMaterial(): MeshStandardMaterial {
  if (!energyRingMaterial) {
    energyRingMaterial = new MeshStandardMaterial({
      color: '#12082a',
      emissive: '#aa44ff',
      emissiveIntensity: 1.8,
      metalness: 0.6,
      roughness: 0.22,
      transparent: true,
      opacity: 0.55,
      toneMapped: false,
    });
  }

  return energyRingMaterial;
}

export function getArchBeamMaterial(): MeshStandardMaterial {
  return new MeshStandardMaterial({
    color: '#00d4ff',
    emissive: '#00e8ff',
    emissiveIntensity: 2.4,
    metalness: 0.35,
    roughness: 0.15,
    toneMapped: false,
  });
}

export function getArchPillarMaterial(): MeshStandardMaterial {
  return new MeshStandardMaterial({
    color: '#141428',
    emissive: '#2244aa',
    emissiveIntensity: 0.65,
    metalness: 0.82,
    roughness: 0.2,
  });
}
