'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { MOUSE } from 'three';
import type { OrthographicCamera } from 'three';

import Image from 'next/image';
import type { StaticImageData } from 'next/image';
import MarblePartyImg from '@/assets/MarbleParty.png';

import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { AudioControl } from '@/components/ui/AudioControl';
import { WebGLFallback } from '@/components/ui/WebGLFallback';
import { useIsMobile } from '@/lib/hooks/useIsMobile';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';
import { useTimePhase } from '@/lib/hooks/useTimePhase';
import { getTargetDpr } from '@/lib/performanceMonitor';

const GridWorld = dynamic(() => import('./GridWorld').then((m) => m.GridWorld), { ssr: false });
const FocusTreesDecor = dynamic(() => import('./GridWorld').then((m) => m.FocusTreesDecor), { ssr: false });
const SkyDome = dynamic(() => import('./SkyDome').then((m) => m.SkyDome), { ssr: false });
const Birds = dynamic(() => import('./Birds').then((m) => m.Birds), { ssr: false });
const Stars = dynamic(() => import('./Stars').then((m) => m.Stars), { ssr: false });
const ShootingStars = dynamic(() => import('./ShootingStars').then((m) => m.ShootingStars), { ssr: false });

const CAMERA_POSITION: [number, number, number] = [6, 150, 10];
const FOCUS_ZOOM = 168;
const FOCUS_CAMERA_Y = 6;
const FOCUS_CAMERA_Z_OFFSET = 6;
const CLOCK_DEPRECATION_WARNING = 'THREE.THREE.Clock: This module has been deprecated. Please use THREE.Timer instead.';

interface FocusState {
  href: string;
  tilePosition: [number, number, number];
}

interface FocusSection {
  heading?: string;
  paragraphs?: string[];
  bullets?: string[];
  image?: { src: StaticImageData; alt: string };
}

interface PageFocusContent {
  title: string;
  sections: FocusSection[];
}

const PAGE_FOCUS_CONTENT: Record<string, PageFocusContent> = {
  '/studio': {
    title: 'ABOUT US',
    sections: [
      {
        heading: 'Who We Are',
        paragraphs: [
          'Everburn Interactive is an independent game and technology studio focused on building original interactive experiences, advanced creative tools, and experimental AI-powered systems.',
          'Founded with a long-term vision of blending game development, artificial intelligence, and immersive technologies, Everburn explores new ways for players and creators to interact with digital worlds.',
          'Our work spans multiple domains:',
        ],
        bullets: [
          'Video games',
          'Interactive simulations',
          'AI-powered creative tools',
          'Virtual reality experiences',
          'Advanced developer tooling',
        ],
      },
      {
        heading: 'Player Agency',
        paragraphs: ['Players should feel that their actions matter. Systems should react dynamically and allow emergent gameplay rather than rigid scripted experiences.'],
      },
      {
        heading: 'Technological Innovation',
        paragraphs: ['We actively explore cutting-edge tools, AI systems, and experimental design approaches to push beyond traditional development boundaries.'],
      },
      {
        heading: 'Long-Term Worldbuilding',
        paragraphs: ['Our projects are designed with long-term universes in mind, where stories, mechanics, and worlds can evolve over time.'],
      },
      {
        heading: 'The Vision',
        paragraphs: ['Everburn Interactive is building toward a future where:'],
        bullets: [
          'Games feel alive and reactive',
          'AI assists both developers and players',
          'Interactive worlds grow and evolve with their communities',
        ],
      },
    ],
  },
  '/technology': {
    title: 'TECHNOLOGY',
    sections: [
      {
        heading: 'Building with the Best Tools',
        paragraphs: [
          'At Everburn Interactive, great experiences come from combining strong creative vision with the right technology.',
          'We work across a wide range of industry-standard tools and development environments to ensure every project is built using the technology that best fits the experience we want to create.',
        ],
      },
      {
        heading: 'Game Engines',
        paragraphs: ['We build using modern game engines for high performance, scalability, and flexibility:'],
        bullets: [
          'Unreal Engine — high-fidelity environments and immersive interactive worlds',
          'Unity — flexible cross-platform development and rapid iteration',
          'Custom engine tools and internal systems where necessary',
        ],
      },
      {
        heading: '3D Creation and Asset Production',
        paragraphs: ['Our art and asset pipelines include:'],
        bullets: [
          'Blender — 3D modeling, sculpting, and animation',
          'Industry-standard texturing and material workflows',
          'Physics-based asset creation and simulation',
          'Optimization pipelines for real-time environments',
        ],
      },
      {
        heading: 'Development Pipelines',
        paragraphs: ['Our workflow integrates tools for:'],
        bullets: [
          'Version control and collaborative development',
          'Performance profiling and optimization',
          'Cross-platform testing',
          'Automation and build management',
        ],
      },
      {
        heading: 'Always Exploring',
        paragraphs: [
          'The technology landscape evolves quickly. We continuously explore new tools, techniques, and workflows to push the boundaries of what interactive experiences can become.',
        ],
      },
    ],
  },
  '/games': {
    title: 'OUR PROJECTS',
    sections: [
      {
        heading: 'Marble Party',
        paragraphs: [
          'A fast-paced physics-driven multiplayer party game built around chaotic marble racing, unpredictable environments, and dynamic abilities.',
          'Players control unique marbles racing through vibrant obstacle-filled courses where momentum, timing, and clever use of abilities determine the winner.',
        ],
        image: { src: MarblePartyImg, alt: 'Marble Party screenshot' },
      },
      {
        heading: 'Core Gameplay',
        paragraphs: ['Marble Party blends physics-based racing, party game chaos, and competitive multiplayer across arenas filled with:'],
        bullets: [
          'Ramps and moving platforms',
          'Hazards and environmental traps',
          'Unpredictable physics moments',
          'Skill, strategy, and chaos every race',
        ],
      },
      {
        heading: 'Dynamic Abilities',
        paragraphs: ['Players unlock unique marble abilities that dramatically change race flow:'],
        bullets: [
          'Speed boosts',
          'Environmental manipulation',
          'Defensive abilities',
          'Disruptive power plays',
        ],
      },
      {
        heading: 'A Growing Playground',
        paragraphs: ['Marble Party is designed to expand over time with:'],
        bullets: [
          'New arenas',
          'New marble abilities',
          'New game modes',
          'Seasonal events',
          'Community-driven features',
        ],
      },
      {
        heading: 'Future Projects',
        paragraphs: [
          'Everburn Interactive is also working on additional projects and long-term IP development that will be revealed in the future.',
          'Our goal is to create experiences that push the boundaries of interactive storytelling and gameplay systems.',
        ],
      },
    ],
  },
  '/contact': {
    title: 'CONTACT US',
    sections: [
      {
        heading: 'Get in Touch',
        paragraphs: [
          'Interested in our projects, technology, or potential collaborations? Feel free to reach out.',
          'We welcome conversations with:',
        ],
        bullets: ['Developers', 'Creators', 'Collaborators', 'Communities', 'Industry partners'],
      },
      {
        heading: 'Contact Information',
        paragraphs: [
          'Company: Everburn Interactive',
          'Location: Gujarat, India',
          'Email: contact@everburninteractive.com',
          'Website: everburninteractive.com',
        ],
      },
      {
        heading: 'Follow Development',
        paragraphs: ['Find us on:'],
        bullets: [
          'YouTube — @everburninteractive',
          'X — @everburn_games',
          'Twitch — @everburninteractive',
        ],
      },
    ],
  },
};

function AdaptiveDpr() {
  const { gl } = useThree();
  const fpsWindowRef = useRef<number[]>([]);
  const lastTimeRef = useRef<number>(0);
  const currentDprRef = useRef<number>(
    typeof window !== 'undefined' ? Math.min(window.devicePixelRatio ?? 1, 1.5) : 1,
  );

  useFrame(({ clock }) => {
    const now = clock.elapsedTime;
    const delta = now - lastTimeRef.current;
    lastTimeRef.current = now;

    if (delta <= 0 || delta > 0.5) return;

    const fps = 1 / delta;
    fpsWindowRef.current.push(fps);
    if (fpsWindowRef.current.length > 60) fpsWindowRef.current.shift();

    if (fpsWindowRef.current.length >= 60) {
      const sum = fpsWindowRef.current.reduce((a, b) => a + b, 0);
      const avgFps = sum / fpsWindowRef.current.length;
      const newDpr = getTargetDpr(avgFps, currentDprRef.current, { min: 0.75, max: 1.5 });
      if (newDpr !== currentDprRef.current) {
        currentDprRef.current = newDpr;
        gl.setPixelRatio(newDpr);
      }
    }
  });

  return null;
}

function CameraRig({
  focus,
  resetSignal,
  baseZoom,
  onFocusSettled,
}: {
  focus: FocusState | null;
  resetSignal: number;
  baseZoom: number;
  onFocusSettled: () => void;
}) {
  const { camera } = useThree();
  const [isResetting, setIsResetting] = useState<boolean>(false);
  const hasReportedFocusRef = useRef<boolean>(false);

  useEffect(() => {
    hasReportedFocusRef.current = false;
  }, [focus?.href]);

  useEffect(() => {
    setIsResetting(true);
  }, [resetSignal]);

  useFrame(() => {
    const activeCamera = camera as OrthographicCamera;

    if (!focus && !isResetting) {
      return;
    }

    const targetX = focus ? focus.tilePosition[0] : CAMERA_POSITION[0];
    const targetY = focus ? FOCUS_CAMERA_Y : CAMERA_POSITION[1];
    const targetZ = focus ? focus.tilePosition[2] + FOCUS_CAMERA_Z_OFFSET : CAMERA_POSITION[2];
    const targetZoom = focus ? FOCUS_ZOOM : baseZoom;
    const lerp = focus ? 0.12 : 0.08;

    // eslint-disable-next-line react-hooks/immutability
    activeCamera.position.x += (targetX - activeCamera.position.x) * lerp;
    activeCamera.position.y += (targetY - activeCamera.position.y) * lerp;
    activeCamera.position.z += (targetZ - activeCamera.position.z) * lerp;
    // eslint-disable-next-line react-hooks/immutability
    activeCamera.zoom += (targetZoom - activeCamera.zoom) * lerp;
    activeCamera.lookAt(focus ? focus.tilePosition[0] : 0, 0, focus ? focus.tilePosition[2] : 0);
    activeCamera.updateProjectionMatrix();

    if (focus && !hasReportedFocusRef.current) {
      const focusCloseEnough =
        Math.abs(activeCamera.position.x - focus.tilePosition[0]) < 0.22
        && Math.abs(activeCamera.position.y - FOCUS_CAMERA_Y) < 0.22
        && Math.abs(activeCamera.position.z - (focus.tilePosition[2] + FOCUS_CAMERA_Z_OFFSET)) < 0.22
        && Math.abs(activeCamera.zoom - FOCUS_ZOOM) < 0.45;

      if (focusCloseEnough) {
        hasReportedFocusRef.current = true;
        onFocusSettled();
      }
    }

    if (!focus) {
      const closeEnough =
        Math.abs(activeCamera.position.x - CAMERA_POSITION[0]) < 0.2
        && Math.abs(activeCamera.position.y - CAMERA_POSITION[1]) < 0.2
        && Math.abs(activeCamera.position.z - CAMERA_POSITION[2]) < 0.2
        && Math.abs(activeCamera.zoom - baseZoom) < 0.4;

      if (closeEnough) {
        setIsResetting(false);
      }
    }
  });

  return null;
}

interface SceneCanvasProps {
  isActive: boolean;
}

export function SceneCanvas({ isActive }: SceneCanvasProps) {
  const isMobile = useIsMobile();
  const baseZoom = isMobile ? 62 : 80;
  const timePhase = useTimePhase();
  const reducedMotion = useReducedMotion();
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [focus, setFocus] = useState<FocusState | null>(null);
  const [overlayHref, setOverlayHref] = useState<string | null>(null);
  const [showFocusOverlay, setShowFocusOverlay] = useState<boolean>(false);
  const [focusSettled, setFocusSettled] = useState<boolean>(false);
  const [resetSignal, setResetSignal] = useState<number>(0);
  const settleFallbackTimerRef = useRef<number | null>(null);
  const overlayHideTimerRef = useRef<number | null>(null);
  const panelRef = useRef<HTMLElement | null>(null);
  const [supportsWebGl] = useState<boolean>(() => {
    if (typeof window === 'undefined') {
      return true;
    }

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('webgl2') ?? canvas.getContext('webgl');
    return context !== null;
  });

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setIsLoaded(true);
    }, 650);

    return () => {
      window.clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') {
      return;
    }

    const scopedWindow = window as Window & { __everburnClockWarnFilterInstalled?: boolean };

    if (scopedWindow.__everburnClockWarnFilterInstalled) {
      return;
    }

    const originalWarn = console.warn;
    console.warn = (...args: unknown[]) => {
      if (typeof args[0] === 'string' && args[0].includes(CLOCK_DEPRECATION_WARNING)) {
        return;
      }

      originalWarn(...args);
    };

    scopedWindow.__everburnClockWarnFilterInstalled = true;
  }, []);

  useEffect(() => {
    return () => {
      if (settleFallbackTimerRef.current !== null) {
        window.clearTimeout(settleFallbackTimerRef.current);
      }

      if (overlayHideTimerRef.current !== null) {
        window.clearTimeout(overlayHideTimerRef.current);
      }
    };
  }, []);

  const handleNavigate = useCallback((href: string, tileWorldPosition: [number, number, number]) => {
    if (settleFallbackTimerRef.current !== null) {
      window.clearTimeout(settleFallbackTimerRef.current);
    }

    if (overlayHideTimerRef.current !== null) {
      window.clearTimeout(overlayHideTimerRef.current);
    }

    setOverlayHref(href);
    setFocus({ href, tilePosition: tileWorldPosition });
    setFocusSettled(false);
    setShowFocusOverlay(false);

    // Safety net: if camera-settle callback is missed, allow overlay reveal.
    settleFallbackTimerRef.current = window.setTimeout(() => {
      setFocusSettled(true);
      setShowFocusOverlay(true);
    }, 900);
  }, []);

  const closeFocusOverlay = useCallback(() => {
    if (settleFallbackTimerRef.current !== null) {
      window.clearTimeout(settleFallbackTimerRef.current);
    }

    if (overlayHideTimerRef.current !== null) {
      window.clearTimeout(overlayHideTimerRef.current);
    }

    setFocusSettled(false);
    setShowFocusOverlay(false);
    setFocus(null);
    setResetSignal((current) => current + 1);

    overlayHideTimerRef.current = window.setTimeout(() => {
      setOverlayHref(null);
    }, 320);
  }, []);

  const effectiveShowFocusOverlay = isActive && overlayHref !== null;
  const effectiveFocus = isActive ? focus : null;

  const activeContent = overlayHref ? PAGE_FOCUS_CONTENT[overlayHref] : null;

  // Auto-focus the dialog panel when it becomes visible for keyboard accessibility.
  useEffect(() => {
    if (showFocusOverlay && focusSettled && panelRef.current) {
      panelRef.current.focus();
    }
  }, [showFocusOverlay, focusSettled]);

  const handlePanelKeyDown = useCallback((event: React.KeyboardEvent<HTMLElement>): void => {
    if (event.key === 'Escape') {
      closeFocusOverlay();
      return;
    }

    if (event.key === 'Tab' && panelRef.current) {
      const focusable = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      );

      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey) {
        if (document.activeElement === first) {
          event.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    }
  }, [closeFocusOverlay]);

  if (!supportsWebGl) {
    return <WebGLFallback />;
  }

  return (
    <>
      <main className={`scene-root ${isActive ? 'is-active' : 'is-passive'}`}>
        <Canvas
          frameloop={isActive ? 'always' : 'demand'}
          shadows
          orthographic
          camera={{ position: CAMERA_POSITION, zoom: baseZoom, near: 0.1, far: 200 }}
          dpr={[0.75, 1.5]}
          onCreated={({ camera }) => {
            camera.lookAt(0, 0, 0);
          }}
        >
          <color attach="background" args={[timePhase.skyColorBottom]} />
          <fog attach="fog" args={[timePhase.fogColor, 48, 195]} />
          <SkyDome dimmed={timePhase.phase === 'night'} />
          <ambientLight intensity={Math.max(0.18, timePhase.ambientIntensity * 0.45)} />
          <directionalLight
            position={[8, 18, 3]}
            intensity={timePhase.phase === 'night' ? 0.42 : 1.35}
            castShadow
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
            shadow-camera-near={1}
            shadow-camera-far={90}
            shadow-camera-left={-14}
            shadow-camera-right={14}
            shadow-camera-top={14}
            shadow-camera-bottom={-14}
            shadow-bias={-0.00008}
            shadow-normalBias={0.015}
          />
          <OrbitControls
            enabled={isActive && !effectiveFocus && !isMobile}
            enableRotate={false}
            enableZoom={false}
            enablePan={isActive && !effectiveFocus && !isMobile}
            // Use left-drag panning with damping for smoother camera motion.
            mouseButtons={{ LEFT: MOUSE.PAN, MIDDLE: MOUSE.DOLLY, RIGHT: MOUSE.ROTATE }}
            panSpeed={0.72}
            enableDamping
            dampingFactor={0.14}
            screenSpacePanning
            maxPolarAngle={Math.PI / 2.05}
            minPolarAngle={Math.PI / 2.05}
          />
          <CameraRig
            focus={effectiveFocus}
            resetSignal={resetSignal}
            baseZoom={baseZoom}
            onFocusSettled={() => {
              if (settleFallbackTimerRef.current !== null) {
                window.clearTimeout(settleFallbackTimerRef.current);
              }

              setFocusSettled(true);
              setShowFocusOverlay(true);
            }}
          />
          <AdaptiveDpr />
          {timePhase.starsActive ? <Stars count={420} reducedMotion={reducedMotion} /> : null}
          {timePhase.starsActive ? <ShootingStars /> : null}
          {timePhase.birdsActive ? <Birds count={4} reducedMotion={reducedMotion} /> : null}
          <GridWorld active={isActive} reducedMotion={reducedMotion} onNavigate={handleNavigate} />
        </Canvas>
      </main>
      <LoadingScreen loaded={isLoaded} />
      {effectiveShowFocusOverlay && activeContent ? (
        <section
          className={`tile-focus-overlay ${showFocusOverlay ? 'is-visible' : ''}`}
          aria-label={`${activeContent.title} information`}
          onClick={closeFocusOverlay}
        >
          <FocusTreesDecor />
          <article
            ref={(node) => {
              panelRef.current = node;
            }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="focus-panel-title"
            tabIndex={-1}
            className={`tile-focus-panel ${showFocusOverlay && focusSettled ? 'is-visible' : ''}`}
            onClick={(event) => {
              event.stopPropagation();
            }}
            onKeyDown={handlePanelKeyDown}
          >
            <header className="tile-focus-header">
              <h2 id="focus-panel-title">{activeContent.title}</h2>
              <button
                type="button"
                className="tile-focus-close"
                aria-label="Close panel"
                onClick={closeFocusOverlay}
              >
                ✕
              </button>
            </header>
            <div className="tile-focus-scroll">
              {activeContent.sections.map((section, index) => (
                <div key={index} className="tile-focus-section">
                  {section.heading ? <h3>{section.heading}</h3> : null}
                  {section.paragraphs?.map((paragraph, pIndex) => (
                    <p key={pIndex}>{paragraph}</p>
                  ))}
                  {section.image ? (
                    <Image
                      src={section.image.src}
                      alt={section.image.alt}
                      className="tile-focus-image-block"
                      placeholder="blur"
                    />
                  ) : null}
                  {section.bullets ? (
                    <ul>
                      {section.bullets.map((bullet, bIndex) => (
                        <li key={bIndex}>{bullet}</li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              ))}
            </div>
            <footer className="tile-focus-footer">
              <button type="button" onClick={closeFocusOverlay}>
                ← Back To Grid
              </button>
            </footer>
          </article>
        </section>
      ) : null}
      <AudioControl />
    </>
  );
}