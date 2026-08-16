'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

import { useAuth } from '@/components/auth/AuthProvider';
import { submitOmsScore } from '@/lib/omsLeaderboard';
import { OmsMovementLoop } from '@/lib/omsMovementAudio';
import { bindOmsButtonSfx, playOmsSfx, preloadOmsSfx } from '@/lib/omsSfx';
import { disposeOmsTrackHoops, relayoutOmsTrackHoops } from '@/lib/omsTrackHoops';
import { OneMoreSecondHud, readBestTime } from '@runtime/games/one-more-second/hud';
import { OneMoreSecondInput } from '@runtime/games/one-more-second/input';
import { OneMoreSecondSimulation } from '@runtime/games/one-more-second/simulation';
import { OneMoreSecondWorldView } from '@runtime/games/one-more-second/world-view';

/** Attract menu vs an active run. Chrome hides for the run. */
export type OneMoreSecondChrome = 'attract' | 'run' | 'dead';

const GAMEPLAY_MUSIC_SRC = '/audio/orbital-sprint.mp3';
const MENU_MUSIC_SRC = '/audio/orbital-sprint-menu.mp3';
const MUSIC_VOLUME = 0.45;

interface OneMoreSecondAttractHostProps {
  onChromeChange?: (chrome: OneMoreSecondChrome) => void;
}

function chromeFromPhase(phase: string): OneMoreSecondChrome {
  if (phase === 'attract') {
    return 'attract';
  }
  if (phase === 'dead') {
    return 'dead';
  }
  return 'run';
}

function isCoarsePointer(): boolean {
  return window.matchMedia('(pointer: coarse)').matches;
}

/** Phone or tablet using touch, not a PC with a mouse (including touchscreen laptops). */
function isMobilePlayDevice(): boolean {
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    return false;
  }
  return isCoarsePointer() && window.matchMedia('(hover: none)').matches;
}

function isPortrait(): boolean {
  return window.matchMedia('(orientation: portrait)').matches || window.innerHeight > window.innerWidth;
}

type WebkitDocument = Document & {
  webkitFullscreenElement?: Element | null;
  webkitExitFullscreen?: () => Promise<void> | void;
};

type WebkitElement = HTMLElement & {
  webkitRequestFullscreen?: () => Promise<void> | void;
  webkitRequestFullScreen?: () => Promise<void> | void;
};

function getFullscreenElement(): Element | null {
  const doc = document as WebkitDocument;
  return document.fullscreenElement ?? doc.webkitFullscreenElement ?? null;
}

async function requestElementFullscreen(el: HTMLElement): Promise<void> {
  const node = el as WebkitElement;
  if (typeof node.requestFullscreen === 'function') {
    await node.requestFullscreen({ navigationUI: 'hide' });
    return;
  }
  const webkit = node.webkitRequestFullscreen ?? node.webkitRequestFullScreen;
  if (webkit) {
    await Promise.resolve(webkit.call(node));
  }
}

async function exitDocumentFullscreen(): Promise<void> {
  if (!getFullscreenElement()) {
    return;
  }
  const doc = document as WebkitDocument;
  if (typeof document.exitFullscreen === 'function') {
    await document.exitFullscreen();
    return;
  }
  if (doc.webkitExitFullscreen) {
    await Promise.resolve(doc.webkitExitFullscreen());
  }
}

function tryLockLandscapeOrientation(): void {
  const orientation = screen.orientation as ScreenOrientation & {
    lock?: (mode: string) => Promise<void>;
  };
  void orientation.lock?.('landscape').catch(() => {
    /* iOS and some browsers reject this unless fullscreen already succeeded */
  });
}

async function enterOmsLandscapeFullscreen(host: HTMLElement | null): Promise<void> {
  if (getFullscreenElement()) {
    tryLockLandscapeOrientation();
    return;
  }
  const targets = [host, document.documentElement].filter((node): node is HTMLElement => node != null);
  for (const target of targets) {
    try {
      await requestElementFullscreen(target);
      tryLockLandscapeOrientation();
      if (getFullscreenElement()) {
        return;
      }
    } catch {
      /* iOS often requires a user gesture and may ignore element fullscreen */
    }
  }
}

function preferLowPowerGpu(): boolean {
  const nav = navigator as Navigator & { deviceMemory?: number };
  return isCoarsePointer()
    || Math.min(window.innerWidth, window.innerHeight) < 700
    || (typeof nav.deviceMemory === 'number' && nav.deviceMemory <= 4);
}

function isPlaySurfaceTarget(target: EventTarget | null): boolean {
  if (!(target instanceof Element)) {
    return true;
  }
  return !target.closest('button, a, .oms-help, .oms-fail, .oms-signin-gate, .oms-landscape-gate, .flamecore-badge');
}

/** Boots the FlameCore One More Second attract loop (auto-playing corridor menu). */
export function OneMoreSecondAttractHost({ onChromeChange }: OneMoreSecondAttractHostProps) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const onChromeChangeRef = useRef(onChromeChange);
  onChromeChangeRef.current = onChromeChange;
  const { user, profile, isLoading, isConfigured, signInWithGoogle } = useAuth();
  const userRef = useRef(user);
  const profileRef = useRef(profile);
  const authLoadingRef = useRef(isLoading);
  userRef.current = user;
  profileRef.current = profile;
  authLoadingRef.current = isLoading;
  const [needSignIn, setNeedSignIn] = useState(false);
  const [authMessage, setAuthMessage] = useState('');
  const [needLandscape, setNeedLandscape] = useState(false);
  const setNeedSignInRef = useRef(setNeedSignIn);
  setNeedSignInRef.current = setNeedSignIn;
  const needLandscapeRef = useRef(false);

  useEffect(() => {
    let wantFullscreen = false;

    const updateGate = () => {
      const blocked = isMobilePlayDevice() && isPortrait();
      needLandscapeRef.current = blocked;
      setNeedLandscape(blocked);
    };

    const syncLandscapeChrome = () => {
      updateGate();
      const landscapeMobile = isMobilePlayDevice() && !isPortrait();
      document.documentElement.classList.toggle('oms-mobile-landscape', landscapeMobile);
      if (!landscapeMobile) {
        wantFullscreen = false;
        void exitDocumentFullscreen().catch(() => undefined);
        return;
      }
      if (!wantFullscreen) {
        wantFullscreen = true;
        void enterOmsLandscapeFullscreen(hostRef.current).catch(() => undefined);
      }
    };

    const onGesture = () => {
      if (isMobilePlayDevice() && !isPortrait() && !getFullscreenElement()) {
        void enterOmsLandscapeFullscreen(hostRef.current).catch(() => undefined);
      }
    };

    syncLandscapeChrome();
    window.addEventListener('resize', syncLandscapeChrome);
    window.addEventListener('orientationchange', syncLandscapeChrome);
    window.addEventListener('pointerdown', onGesture, true);
    return () => {
      document.documentElement.classList.remove('oms-mobile-landscape');
      window.removeEventListener('resize', syncLandscapeChrome);
      window.removeEventListener('orientationchange', syncLandscapeChrome);
      window.removeEventListener('pointerdown', onGesture, true);
      void exitDocumentFullscreen().catch(() => undefined);
    };
  }, []);

  useEffect(() => {
    if (user) {
      setNeedSignIn(false);
      setAuthMessage('');
    }
  }, [user]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) {
      return;
    }

    const canvas = document.createElement('canvas');
    canvas.className = 'oms-attract-canvas';
    canvas.setAttribute('tabindex', '0');
    host.appendChild(canvas);

    const hudMount = document.createElement('div');
    hudMount.className = 'oms-attract-hud-mount';
    host.appendChild(hudMount);

    const lowPower = preferLowPowerGpu();
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: !lowPower,
      alpha: false,
      powerPreference: lowPower ? 'low-power' : 'high-performance',
    });
    renderer.setPixelRatio(lowPower ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = lowPower ? 1.05 : 1.15;
    renderer.shadowMap.enabled = !lowPower;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050314);
    scene.fog = new THREE.Fog(0x0a061c, 26, 96);

    const camera = new THREE.PerspectiveCamera(62, 1, 0.1, 480);
    camera.rotation.order = 'YXZ';

    const sun = new THREE.DirectionalLight(0xd7f4ff, 0.85);
    sun.position.set(2.4, 9, -6);
    sun.castShadow = !lowPower;
    scene.add(sun);
    scene.add(new THREE.HemisphereLight(0xb8c8ff, 0x2a1048, 0.5));
    scene.add(new THREE.AmbientLight(0x4a3a78, 0.2));
    if (!lowPower) {
      const magentaFill = new THREE.PointLight(0xff4d9a, 1.1, 80, 1.6);
      magentaFill.position.set(-18, 8, 24);
      const cyanFill = new THREE.PointLight(0x5ce1ff, 0.9, 80, 1.6);
      cyanFill.position.set(16, 6, 40);
      scene.add(magentaFill, cyanFill);
    }

    const sim = new OneMoreSecondSimulation((Math.random() * 1e9) | 0);
    sim.setBestTime(readBestTime());
    sim.start('attract');

    const view = new OneMoreSecondWorldView(lowPower ? 'low' : 'high');
    view.attach(scene);

    const input = new OneMoreSecondInput(host);
    input.setActive(false);

    let playing = false;
    let disposed = false;
    let lastChrome: OneMoreSecondChrome = 'attract';
    let musicMode: 'menu' | 'game' | 'off' | null = null;

    const makeLoop = (src: string) => {
      const track = new Audio(src);
      track.loop = true;
      track.preload = 'auto';
      track.volume = MUSIC_VOLUME;
      return track;
    };

    const menuMusic = makeLoop(MENU_MUSIC_SRC);
    const gameMusic = makeLoop(GAMEPLAY_MUSIC_SRC);
    const movementLoop = new OmsMovementLoop();

    const pauseTrack = (track: HTMLAudioElement) => {
      if (!track.paused) {
        track.pause();
      }
    };

    const stopTrack = (track: HTMLAudioElement) => {
      pauseTrack(track);
      if (track.currentTime > 0) {
        try {
          track.currentTime = 0;
        } catch {
          /* some browsers reject seek before metadata */
        }
      }
    };

    const playTrack = (track: HTMLAudioElement) => {
      if (disposed) {
        return;
      }
      void track.play().catch(() => {
        /* browser autoplay policy; a later click/key retries */
      });
    };

    const applyMusic = (mode: 'menu' | 'game' | 'off') => {
      if (disposed) {
        return;
      }
      if (musicMode !== mode) {
        musicMode = mode;
        if (mode === 'menu') {
          stopTrack(gameMusic);
        } else if (mode === 'game') {
          stopTrack(menuMusic);
        } else {
          stopTrack(menuMusic);
          pauseTrack(gameMusic);
        }
      }
      if (mode === 'menu') {
        playTrack(menuMusic);
      } else if (mode === 'game') {
        playTrack(gameMusic);
      }
    };

    const emitChrome = (phase: string) => {
      const next = chromeFromPhase(phase);
      if (next === lastChrome) {
        return;
      }
      lastChrome = next;
      onChromeChangeRef.current?.(next);
    };

    const returnToMenu = () => {
      playing = false;
      sim.start('attract');
      input.setActive(false);
      emitChrome('attract');
      applyMusic('menu');
    };

    const hud = new OneMoreSecondHud(
      hudMount,
      () => input.queueRewind(),
      () => input.queueRestart(),
      sim.bestTime,
      returnToMenu,
    );
    preloadOmsSfx();
    const unbindButtonSfx = Array.from(hud.root.querySelectorAll('button')).map((button) =>
      bindOmsButtonSfx(button),
    );

    const fit = () => {
      const width = Math.max(1, host.clientWidth);
      const height = Math.max(1, host.clientHeight);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    fit();

    const resize = new ResizeObserver(fit);
    resize.observe(host);

    let raf = 0;
    let last = performance.now();
    let lastCountdownDigit = 0;
    const shake = new THREE.Vector3();
    onChromeChangeRef.current?.('attract');
    applyMusic('menu');

    const beginPlay = () => {
      if (playing || disposed || sim.phase !== 'attract') {
        return;
      }
      if (needLandscapeRef.current) {
        return;
      }
      if (authLoadingRef.current) {
        return;
      }
      if (!userRef.current) {
        setNeedSignInRef.current(true);
        return;
      }
      playing = true;
      sim.start('playing');
      input.setActive(true);
      emitChrome('playing');
      applyMusic('game');
    };

    const onPointerDown = (event: PointerEvent) => {
      if (!isPlaySurfaceTarget(event.target) || hud.isHelpOpen || needLandscapeRef.current) {
        return;
      }
      event.stopPropagation();
      beginPlay();
      if (!playing) {
        applyMusic('menu');
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setNeedSignInRef.current(false);
        if (hud.isHelpOpen) {
          hud.closeHelp();
          return;
        }
        if (!playing) {
          applyMusic('menu');
        }
        return;
      }
      if (hud.isHelpOpen || needLandscapeRef.current) {
        return;
      }
      if (!playing) {
        beginPlay();
        if (!playing) {
          applyMusic('menu');
        }
      }
    };

    host.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('keydown', onKeyDown);

    const driveCamera = (readout: ReturnType<OneMoreSecondSimulation['readout']>, dt: number) => {
      const shakeAmp = readout.phase === 'crash' ? 0.07 : readout.shake;
      shake.set(
        (Math.random() - 0.5) * shakeAmp,
        (Math.random() - 0.5) * shakeAmp * 0.6,
        (Math.random() - 0.5) * shakeAmp * 0.3,
      );
      const tilt = Math.sin(readout.timeAlive * 0.7) * readout.cameraTilt;
      camera.position.set(
        readout.playerX * 0.28 + shake.x,
        1.78 + shake.y,
        -6.35 + shake.z,
      );
      camera.up.set(0, 1, 0);
      camera.rotation.set(-0.08, Math.PI, tilt + readout.playerX * 0.012);
      const targetFov = 62 + readout.fovBoost;
      camera.fov += (targetFov - camera.fov) * Math.min(1, dt * 3);
      camera.updateProjectionMatrix();
    };

    const frame = (now: number) => {
      if (disposed) {
        return;
      }
      if (needLandscapeRef.current) {
        if (playing) {
          input.setActive(false);
        }
        if (musicMode !== 'off') {
          applyMusic('off');
        }
        last = now;
        raf = window.requestAnimationFrame(frame);
        return;
      }
      if (playing && sim.phase === 'playing') {
        input.setActive(true);
      }
      const dt = Math.min(0.05, Math.max(0, (now - last) / 1000));
      last = now;
      const events = sim.tick(dt, input.sample(sim.phase));
      const readout = sim.readout();
      if (events.died && playing) {
        void submitOmsScore(readout.scoredTime, userRef.current, profileRef.current);
      }
      if (playing) {
        if (events.crashed) {
          playOmsSfx('death');
        }
        if (events.fragment) {
          playOmsSfx('fragment');
        }
        if (events.nearMiss) {
          playOmsSfx('nearMiss');
        }
        if (events.rewindUsed) {
          playOmsSfx('rewind');
        }
        if (events.died && !readout.canRewind) {
          playOmsSfx('gameOver');
        }
      }
      if (readout.phase === 'countdown') {
        const digit = Math.max(1, Math.ceil(readout.countdown));
        if (digit !== lastCountdownDigit) {
          lastCountdownDigit = digit;
          playOmsSfx(digit <= 1 ? 'timerFinalTick' : 'timerTick');
        }
      } else {
        lastCountdownDigit = 0;
      }
      emitChrome(readout.phase);
      if (events.restarted) {
        stopTrack(gameMusic);
      }
      if (readout.phase === 'attract') {
        if (musicMode !== 'menu') {
          applyMusic('menu');
        }
      } else if (
        readout.phase === 'crash'
        || readout.phase === 'dead'
        || readout.phase === 'rewinding'
        || readout.phase === 'countdown'
      ) {
        if (musicMode !== 'off') {
          applyMusic('off');
        }
      } else if (musicMode !== 'game' || events.restarted) {
        applyMusic('game');
      }
      movementLoop.sync(
        playing && readout.phase === 'playing',
        readout.playerX,
        readout.speedMul,
        dt,
      );
      view.sync(readout, events, dt);
      relayoutOmsTrackHoops(view.root, readout.distance, readout.halfWidth);
      hud.sync(readout, events, readout.timeAlive, true);
      driveCamera(readout, dt);
      renderer.render(scene, camera);
      raf = window.requestAnimationFrame(frame);
    };
    raf = window.requestAnimationFrame(frame);

    return () => {
      disposed = true;
      stopTrack(menuMusic);
      stopTrack(gameMusic);
      movementLoop.dispose();
      menuMusic.removeAttribute('src');
      gameMusic.removeAttribute('src');
      menuMusic.load();
      gameMusic.load();
      unbindButtonSfx.forEach((unbind) => unbind());
      window.cancelAnimationFrame(raf);
      host.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('keydown', onKeyDown);
      resize.disconnect();
      input.dispose();
      hud.dispose();
      disposeOmsTrackHoops(view.root);
      view.dispose(scene);
      renderer.dispose();
      canvas.remove();
      hudMount.remove();
    };
  }, []);

  return (
    <>
      <div
        ref={hostRef}
        className="oms-attract-host"
        aria-label="One More Second"
      />
      {needLandscape ? (
        <div className="oms-landscape-gate" role="dialog" aria-labelledby="oms-landscape-title">
          <div className="oms-landscape-card">
            <p id="oms-landscape-title">Turn your phone</p>
            <p>Rotate to landscape to play One More Second. Side taps steer once the run starts.</p>
          </div>
        </div>
      ) : null}
      {needSignIn && !user ? (
        <div className="oms-signin-gate" role="dialog" aria-labelledby="oms-signin-title">
          <div className="oms-signin-card">
            <p id="oms-signin-title">Sign in to play</p>
            <p className="oms-signin-copy">
              One More Second needs a Google account so your best time can sit on the leaderboard.
            </p>
            <button
              className="account-button google-auth-button"
              type="button"
              onPointerEnter={() => playOmsSfx('buttonHover')}
              onClick={() => {
                playOmsSfx('buttonClick');
                if (!isConfigured) {
                  setAuthMessage('Sign-in is not configured for this site.');
                  return;
                }
                setAuthMessage('');
                void signInWithGoogle().catch((error: unknown) => {
                  setAuthMessage(
                    error instanceof Error ? error.message : 'Google sign-in could not start.',
                  );
                });
              }}
            >
              Sign in with Google
            </button>
            {authMessage ? (
              <p className="oms-signin-status" role="status">{authMessage}</p>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  );
}
