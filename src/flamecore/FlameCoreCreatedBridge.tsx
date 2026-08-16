'use client';

import { useEffect, useRef } from 'react';
import { useThree, type RootState } from '@react-three/fiber';

interface FlameCoreCreatedBridgeProps {
  onCreated?: (state: RootState) => void;
}

/** Invokes SceneCanvas onCreated once the FlameCore-backed R3F store is ready. */
export function FlameCoreCreatedBridge({ onCreated }: FlameCoreCreatedBridgeProps) {
  const state = useThree();
  const calledRef = useRef(false);

  useEffect(() => {
    if (calledRef.current || !onCreated) {
      return;
    }

    calledRef.current = true;
    state.camera.lookAt(0, 0, 0);
    onCreated(state);
  }, [onCreated, state]);

  return null;
}
