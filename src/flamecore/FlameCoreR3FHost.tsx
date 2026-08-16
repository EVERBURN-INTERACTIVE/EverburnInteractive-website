'use client';

import { createRoot, events as pointerEvents, extend, type ReconcilerRoot, type RootState } from '@react-three/fiber';
import * as THREE from 'three';
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';

import { createEverburnRuntime, type EverburnFlameCoreBundle } from './createEverburnRuntime';
import { FlameCoreCreatedBridge } from './FlameCoreCreatedBridge';
import { flameCoreHtmlPortalRef } from './flameCoreHtmlPortalRef';
import { FlameCoreStepDriver } from './FlameCoreStepDriver';

let r3fCatalogueReady = false;

type R3FStore = ReturnType<ReconcilerRoot<HTMLCanvasElement>['render']>;

/** Canvas calls extend(THREE) on mount; createRoot hosts must do it explicitly. */
function ensureR3FCatalogue() {
  if (r3fCatalogueReady) {
    return;
  }

  extend(THREE as never);
  r3fCatalogueReady = true;
}

function readContainerSize(container: HTMLDivElement) {
  const rect = container.getBoundingClientRect();
  return {
    width: rect.width,
    height: rect.height,
    top: rect.top,
    left: rect.left,
  };
}

function syncHostLayout(container: HTMLDivElement, state: RootState) {
  state.events?.connect?.(container);
  const { width, height, top, left } = readContainerSize(container);
  if (width > 0 && height > 0) {
    state.setSize(width, height, top, left);
    return true;
  }

  return false;
}

export interface FlameCoreCameraConfig {
  position: [number, number, number];
  zoom: number;
  near: number;
  far: number;
}

export interface FlameCoreR3FHostProps {
  isActive: boolean;
  camera: FlameCoreCameraConfig;
  dpr?: [number, number];
  className?: string;
  onCreated?: (state: RootState) => void;
  /** Fires once the shared WebGL host has a non-zero layout and an R3F store. */
  onReady?: () => void;
  children: ReactNode;
}

/** FlameCore runtime host — R3F scene graph renders through the FlameCore WebGL renderer. */
export function FlameCoreR3FHost({
  isActive,
  camera,
  dpr = [0.75, 1.5],
  className,
  onCreated,
  onReady,
  children,
}: FlameCoreR3FHostProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const bundleRef = useRef<EverburnFlameCoreBundle | null>(null);
  const rootRef = useRef<ReconcilerRoot<HTMLCanvasElement> | null>(null);
  const r3fStoreRef = useRef<R3FStore | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const onCreatedRef = useRef(onCreated);
  const onReadyRef = useRef(onReady);
  const readyNotifiedRef = useRef(false);
  const [bootId, setBootId] = useState(0);
  const [ready, setReady] = useState(false);

  onCreatedRef.current = onCreated;
  onReadyRef.current = onReady;

  const frameloop = isActive ? 'always' : 'demand';

  const cameraConfig = useMemo(
    () => ({
      position: camera.position,
      zoom: camera.zoom,
      near: camera.near,
      far: camera.far,
    }),
    [camera.far, camera.near, camera.position, camera.zoom],
  );

  const notifyReadyIfLaidOut = (container: HTMLDivElement, state: RootState) => {
    if (readyNotifiedRef.current) {
      return;
    }

    if (!syncHostLayout(container, state)) {
      return;
    }

    readyNotifiedRef.current = true;
    onReadyRef.current?.();
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    readyNotifiedRef.current = false;

    const canvas = document.createElement('canvas');
    canvas.className = 'flamecore-canvas';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.display = 'block';
    canvas.style.position = 'relative';
    canvas.style.zIndex = '0';
    container.appendChild(canvas);
    canvasRef.current = canvas;

    ensureR3FCatalogue();

    let disposed = false;
    let bundle: EverburnFlameCoreBundle;
    let root: ReconcilerRoot<HTMLCanvasElement>;

    try {
      bundle = createEverburnRuntime(canvas);
      bundleRef.current = bundle;

      root = createRoot(canvas);
      rootRef.current = root;

      root.configure({
        orthographic: true,
        camera: cameraConfig,
        gl: bundle.runtime.context.renderer as never,
        scene: bundle.scene.threeScene as never,
        events: pointerEvents,
        frameloop,
        dpr,
        shadows: true,
        onCreated: (state) => {
          if (disposed) {
            return;
          }

          syncHostLayout(container, state);
          onCreatedRef.current?.(state);
        },
      });

      setReady(true);
    } catch (error) {
      console.error('[FlameCoreR3FHost] Failed to boot WebGL host:', error);
      canvas.remove();
      canvasRef.current = null;
      bundleRef.current = null;
      rootRef.current = null;
      return;
    }

    const handleContextLost = (event: Event) => {
      event.preventDefault();
      console.warn('[FlameCoreR3FHost] WebGL context lost — remounting host');
      setBootId((value) => value + 1);
    };

    canvas.addEventListener('webglcontextlost', handleContextLost, false);

    return () => {
      disposed = true;
      canvas.removeEventListener('webglcontextlost', handleContextLost, false);

      try {
        root.unmount();
      } catch {
        // Ignore unmount races during remount/HMR.
      }

      try {
        bundle.runtime.dispose();
      } catch {
        // Ignore dispose races during remount/HMR.
      }

      bundleRef.current = null;
      rootRef.current = null;
      r3fStoreRef.current = null;
      canvasRef.current = null;
      flameCoreHtmlPortalRef.current = null;

      if (canvas.parentNode === container) {
        canvas.remove();
      }

      setReady(false);
    };
    // Remount only when bootId changes (context loss). Camera/frameloop update separately.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bootId]);

  useEffect(() => {
    if (!ready || !rootRef.current) {
      return;
    }

    rootRef.current.configure({
      camera: cameraConfig,
      frameloop,
      dpr,
    });
  }, [cameraConfig, dpr, frameloop, ready]);

  useEffect(() => {
    const container = containerRef.current;
    if (!ready || !container) {
      return;
    }

    let rafId = 0;
    let attempts = 0;

    const syncSize = () => {
      const state = r3fStoreRef.current?.getState();
      if (!state) {
        return false;
      }

      return syncHostLayout(container, state);
    };

    const trySyncUntilLaidOut = () => {
      const state = r3fStoreRef.current?.getState();
      if (state) {
        notifyReadyIfLaidOut(container, state);
      }

      if (syncSize() || attempts >= 120) {
        return;
      }

      attempts += 1;
      rafId = window.requestAnimationFrame(trySyncUntilLaidOut);
    };

    trySyncUntilLaidOut();

    const resizeObserver = new ResizeObserver(() => {
      const state = r3fStoreRef.current?.getState();
      if (!state) {
        return;
      }

      notifyReadyIfLaidOut(container, state);
    });
    resizeObserver.observe(container);
    window.addEventListener('resize', syncSize);

    return () => {
      window.cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      window.removeEventListener('resize', syncSize);
    };
  }, [ready, bootId]);

  useEffect(() => {
    if (!ready || !rootRef.current || !bundleRef.current) {
      return;
    }

    const container = containerRef.current;
    const r3fStore = rootRef.current.render(
      <>
        <FlameCoreStepDriver runtime={bundleRef.current.runtime} />
        <FlameCoreCreatedBridge onCreated={onCreatedRef.current} />
        {children}
      </>,
    );

    r3fStoreRef.current = r3fStore;

    if (container) {
      notifyReadyIfLaidOut(container, r3fStore.getState());
    }
  }, [children, ready, bootId]);

  return (
    <div
      ref={containerRef}
      className={className}
      data-flamecore-host=""
      data-flamecore-ready={ready ? 'true' : 'false'}
      data-flamecore-boot={String(bootId)}
      style={{ width: '100%', height: '100%', position: 'relative' }}
    >
      <div
        ref={(node) => {
          flameCoreHtmlPortalRef.current = node;
        }}
        className="flamecore-html-portal"
      />
    </div>
  );
}
