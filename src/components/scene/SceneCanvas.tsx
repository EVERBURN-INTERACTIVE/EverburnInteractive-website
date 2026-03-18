'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { MathUtils } from 'three';
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

const CAMERA_POSITION: [number, number, number] = [6, 5, 10];
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
          'Everburn Interactive is an independent game and technology studio building original interactive experiences from the ground up.',
          'We are a DPIIT-recognized startup based in Ahmedabad, Gujarat, India. Incorporated in February 2026 with a long-term focus on original IP, live-audience game design, and systems that are unique.',
          'Our work spans:',
        ],
        bullets: [
          'Twitch-integrated live audience gaming',
          'Physics-driven multiplayer experiences',
          'Original long-term IP development',
          'AI-powered creative and development tools',
          'Immersive interactive world design',
        ],
      },
      {
        heading: 'Uniqueness in All Aspects',
        paragraphs: [
          'We do not build what already exists. Before any project moves forward, we ask one question: has anyone made something that feels exactly like this? If the answer is yes, we go deeper. Originality and Creativity are not goals we aim for, they are standards we hold ourselves to from day one.',
        ],
      },
      {
        heading: 'Player Agency',
        paragraphs: [
          'Players and audiences should feel that their presence changes the experience. Our systems are built to react, respond and let players shape the outcome of the systems we build.',
        ],
      },
      {
        heading: 'Long-Term Worldbuilding',
        paragraphs: [
          'Every project at Everburn is designed as a long-term world, not a disposable release. Stories, mechanics, and universes are built with room to grow because we are building a catalog of original IPs, not a portfolio of one-off games.',
        ],
      },
      {
        heading: 'Technological Integrity',
        paragraphs: [
          'Technology decisions are made in service of the experience, never for convenience. We use the tools that the projects demand, even when that means going deeper into C++, building custom systems, or rebuilding something from scratch to get it right.',
        ],
      },
      {
        heading: 'The Vision',
        paragraphs: ['Everburn Interactive is building toward a future where:'],
        bullets: [
          'Audiences can be full participants in the games, not passive spectators',
          'Original IPs with genuine mechanical identity stand alongside the industry\'s best',
          'AI and interactive technology expand what games are capable of being',
          'A studio built in India earns its place among the world\'s leading game developers',
        ],
      },
    ],
  },

  '/technology': {
    title: 'TECHNOLOGY',
    sections: [
      {
        heading: 'Built on the Right Foundation',
        paragraphs: [
          'Every technology decision at Everburn starts with one question: what does this specific experience actually need?',
          'We do not default to tools because they are popular. We choose them because they are the right fit for what we are building.',
        ],
      },
      {
        heading: 'Game Engine:Unreal Engine 5',
        paragraphs: ['Our primary engine is Unreal Engine 5, built on C++. For Marble Party specifically:'],
        bullets: [
          'Server-authoritative physics for consistent marble simulation for every player and viewer',
          'Chaos Physics for high-fidelity, deterministic simulation at scale',
          'Custom gameplay systems in C++ for tight control over performance and netcode',
          'Scalable multiplayer architecture for handling large simultaneous Twitch audiences',
        ],
      },
      {
        heading: 'Backend and Live Infrastructure',
        paragraphs: ['Marble Party is a live-service game built for real-time audience participation:'],
        bullets: [
          'Cloud infrastructure for game servers and session management',
          'Twitch EventSub and Chat integration for real-time viewer participation',
          'Custom telemetry systems for monitoring session health, physics performance, and player experience',
        ],
      },
      {
        heading: '3D Creation and Asset Production',
        paragraphs: ['Every asset that enters our games is built for performance without sacrificing character:'],
        bullets: [
          'Blender for 3D modeling, sculpting, and animation',
          'Physics-based material workflows',
          'LOD and optimization pipelines for real-time performance targets',
          'Custom asset tools built to our production needs',
        ],
      },
      {
        heading: 'Performance is Not Optional',
        paragraphs: ['We treat performance as a design constraint, not an afterthought:'],
        bullets: [
          'Frame pacing stability under load',
          'Network latency tolerance for live audience sessions',
          'Scalability for future content without architectural refactoring',
          'Cross-platform testing discipline from early in development',
        ],
      },
      {
        heading: 'Always Evolving',
        paragraphs: [
          'We continuously evaluate new rendering techniques, AI-assisted development workflows, and gameplay systems that push our projects further than what existing games have attempted.',
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
          'Marble Party is a Twitch-integrated marble racing party game where the audience is not just watching. They are playing!',
          'Twitch chat viewers join the race directly through chat commands, controlling their own marbles in real time alongside the streamer. Every race is shaped entirely by the community in the room.',
        ],
        image: { src: MarblePartyImg, alt: 'Marble Party screenshot' },
      },
      {
        heading: 'Built for Live Audiences',
        paragraphs: ['The core innovation: Twitch chat is the controller. Viewers participate by:'],
        bullets: [
          'Joining races directly from chat commands',
          'Control their marble powerups and boosts in realtime',
          'Competing against other viewers and the streamer simultaneously',
          'Shaping the outcome of every race just by being in the stream',
        ],
      },
      {
        heading: 'The Game',
        paragraphs: ['Built on Unreal Engine 5 with server-authoritative physics:'],
        bullets: [
          'Physics-driven marble racing across vibrant obstacle courses',
          'Dynamic abilities that change race flow. Boosts, disruptions, defenses and many more in development! ',
          'Ramps, moving platforms, hazards, and environmental traps',
          'Competitive multiplayer with chaos built into every race',
        ],
      },
      {
        heading: 'A Growing World',
        paragraphs: ['Marble Party is designed to expand over time:'],
        bullets: [
          'New arenas and course environments',
          'New marble abilities and cosmetics',
          'New game modes',
          'Seasonal events and community-driven features',
        ],
      },
      {
        heading: 'Future Projects',
        paragraphs: [
          'Everburn Interactive is actively developing additional original IPs beyond Marble Party.',
          'These projects are being built with the same commitment to originality and long-term world design. They will be revealed when the time is right.',
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
          'We are an early-stage independent studio and we are deliberate about who we build with.',
          'If our work, our vision, or our technology interests you, we want to hear from you!',
          'We welcome conversations with:',
        ],
        bullets: [
          'Publishers and platform partners',
          'Streamers and content creators',
          'Developers and technical collaborators',
          'Press and media',
          'Players and community members',
        ],
      },
      {
        heading: 'Contact Information',
        paragraphs: [
          'Company: Everburn Interactive LLP',
          'Recognition: DPIIT Recognized Startup | LLPIN: ACV-2902',
          'Location: Ahmedabad, Gujarat, India',
          'Email: contact@everburninteractive.com',
          'Business: partnerships@everburn.studio',
        ],
      },
      {
        heading: 'Follow Development',
        paragraphs: [
          'Marble Party is in active development. Updates, behind-the-scenes content, and community announcements are shared across our channels.',
          'Find us on:',
        ],
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
  onResetComplete,
}: {
  focus: FocusState | null;
  resetSignal: number;
  baseZoom: number;
  onFocusSettled: () => void;
  onResetComplete: () => void;
}) {
  const { camera } = useThree();
  const isAnimatingRef = useRef<boolean>(false);
  const hasReportedFocusRef = useRef<boolean>(false);
  const isInitialMountRef = useRef<boolean>(true);

  useEffect(() => {
    hasReportedFocusRef.current = false;
    if (focus) {
      isAnimatingRef.current = true;
    }
  }, [focus]);

  useEffect(() => {
    // Skip the initial mount — camera is already at CAMERA_POSITION from Canvas init.
    if (isInitialMountRef.current) {
      isInitialMountRef.current = false;
      return;
    }
    isAnimatingRef.current = true;
  }, [resetSignal]);

  useFrame((_, delta) => {
    if (!isAnimatingRef.current) return;

    const activeCamera = camera as OrthographicCamera;
    const targetX = focus ? focus.tilePosition[0] : CAMERA_POSITION[0];
    const targetY = focus ? FOCUS_CAMERA_Y : CAMERA_POSITION[1];
    const targetZ = focus ? focus.tilePosition[2] + FOCUS_CAMERA_Z_OFFSET : CAMERA_POSITION[2];
    const targetZoom = focus ? FOCUS_ZOOM : baseZoom;
    const lambda = focus ? 6 : 4;

    activeCamera.position.x = MathUtils.damp(activeCamera.position.x, targetX, lambda, delta);
    activeCamera.position.y = MathUtils.damp(activeCamera.position.y, targetY, lambda, delta);
    activeCamera.position.z = MathUtils.damp(activeCamera.position.z, targetZ, lambda, delta);
    activeCamera.zoom = MathUtils.damp(activeCamera.zoom, targetZoom, lambda, delta);
    activeCamera.lookAt(focus ? focus.tilePosition[0] : 0, 0, focus ? focus.tilePosition[2] : 0);
    activeCamera.updateProjectionMatrix();

    if (focus && !hasReportedFocusRef.current) {
      const focusCloseEnough =
        Math.abs(activeCamera.position.x - targetX) < 0.22
        && Math.abs(activeCamera.position.y - targetY) < 0.22
        && Math.abs(activeCamera.position.z - targetZ) < 0.22
        && Math.abs(activeCamera.zoom - targetZoom) < 0.45;

      if (focusCloseEnough) {
        hasReportedFocusRef.current = true;
        isAnimatingRef.current = false;
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
        isAnimatingRef.current = false;
        onResetComplete();
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
  const baseZoom = isMobile ? 42 : 80;
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
  const controlsRef = useRef<React.ComponentRef<typeof OrbitControls>>(null);
  const [isResettingCamera, setIsResettingCamera] = useState<boolean>(false);
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
    setIsResettingCamera(true);
    setResetSignal((current) => current + 1);

    overlayHideTimerRef.current = window.setTimeout(() => {
      setOverlayHref(null);
    }, 320);
  }, []);

  const handleResetComplete = useCallback(() => {
    setIsResettingCamera(false);
    if (controlsRef.current) {
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();
    }
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
            ref={controlsRef}
            enabled={isActive && !effectiveFocus && !isResettingCamera}
            enableRotate={isActive && !effectiveFocus && !isResettingCamera}
            enableZoom={false}
            enablePan={false}
            enableDamping
            dampingFactor={0.14}
            rotateSpeed={0.5}
            minPolarAngle={0}
            maxPolarAngle={Math.PI / 2}
          />
          <CameraRig
            focus={effectiveFocus}
            resetSignal={resetSignal}
            baseZoom={baseZoom}
            onResetComplete={handleResetComplete}
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