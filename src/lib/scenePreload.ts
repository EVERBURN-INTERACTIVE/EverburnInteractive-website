import { useGLTF } from '@react-three/drei';
import { useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';

import EverFlame from '@/assets/EverFlame.png';
import { CIRCUIT_PATTERN_URL, STUDIO_BUILDING_URL } from '@/lib/homeSceneAssets';

/** Start campsite GPU assets before the loading overlay is allowed to hide. */
export function preloadHomeSceneAssets(): void {
  if (typeof window === 'undefined') {
    return;
  }

  useGLTF.preload(STUDIO_BUILDING_URL);
  useLoader.preload(TextureLoader, EverFlame.src);
  useLoader.preload(TextureLoader, CIRCUIT_PATTERN_URL);
}
