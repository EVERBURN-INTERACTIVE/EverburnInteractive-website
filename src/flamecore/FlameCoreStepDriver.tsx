'use client';

import { useFrame } from '@react-three/fiber';

import type { Runtime } from '@runtime/runtime';

interface FlameCoreStepDriverProps {
  runtime: Runtime;
}

/** Advances FlameCore systems each frame; R3F performs the WebGL draw. */
export function FlameCoreStepDriver({ runtime }: FlameCoreStepDriverProps) {
  useFrame((_, delta) => {
    runtime.step(delta);
  });

  return null;
}
