import * as THREE from 'three';
import { AssetDatabase } from './assets/asset-database';
import { AssetLoader, InMemoryBlobSource, type BlobSource } from './assets/asset-loader';
import {
  QualityManager,
  QUALITY_PROFILES,
  createTimeAntialias,
  shouldUseFxaa,
  type QualityPreset,
  type QualitySettings,
} from './quality/quality-manager';

/** Mutable arcade post-process knobs consumed by {@link RenderingSystem}. */
export interface ArcadePostFxState {
  chromaticAberration: number;
  vignette: number;
  scanline: number;
  glitch: number;
  invert: number;
  flash: number;
  time: number;
}

/**
 * Configuration for the shared runtime context. All fields are optional and
 * fall back to sensible defaults suitable for the editor and a basic site.
 */
export interface RuntimeContextOptions {
  /** Canvas element to render into. If omitted, a new canvas is created. */
  canvas?: HTMLCanvasElement;
  /**
   * Whether to enable native MSAA. When omitted, derived from
   * {@link qualityPreset} via {@link createTimeAntialias}.
   */
  antialias?: boolean;
  /** Whether to allow an alpha (transparent) backbuffer. Defaults to `false`. */
  alpha?: boolean;
  /** Render scale relative to the canvas size. Defaults to `1`. */
  renderScale?: number;
  /** Maximum device pixel ratio. Clamped to `[1, 2]`. Defaults to 2. */
  maxPixelRatio?: number;
  /** Optional pre-built asset database to attach. A fresh one is created otherwise. */
  assetDatabase?: AssetDatabase;
  /** Optional blob source used to back the {@link AssetLoader}. */
  blobSource?: BlobSource;
  /** Optional initial quality preset. Defaults to `'high'`. */
  qualityPreset?: QualityPreset;
  /** Optional pre-built {@link QualityManager} (advanced; usually omit). */
  qualityManager?: QualityManager;
}

/**
 * Shared services available to systems and components: the WebGL renderer,
 * the simulation clock, and the target canvas. Exactly one RuntimeContext is
 * created per Runtime instance (see ADR-006).
 */
export class RuntimeContext {
  readonly renderer: THREE.WebGLRenderer;
  readonly canvas: HTMLCanvasElement;
  readonly clock: THREE.Clock;
  /** Project-wide asset record index. */
  readonly assets: AssetDatabase;
  /** GPU-backed asset resolver tied to {@link assets}. */
  readonly loader: AssetLoader;
  /** Quality / performance settings manager. */
  readonly quality: QualityManager;
  /**
   * When true, {@link RenderingSystem} routes through an FXAA EffectComposer.
   * Toggled by {@link applyQualityToContext}; MSAA is create-time only.
   */
  fxaaEnabled = false;
  /**
   * Optional arcade post-process written by gameplay (One More Second).
   * All zeros is a no-op so unrelated scenes pay nothing.
   */
  readonly arcadeFx: ArcadePostFxState = {
    chromaticAberration: 0,
    vignette: 0,
    scanline: 0,
    glitch: 0,
    invert: 0,
    flash: 0,
    time: 0,
  };
  /**
   * DOM overlay used by the UI system to host HTML elements above the WebGL
   * canvas. Lazily created when {@link uiOverlay} is first accessed. Returns
   * `undefined` in headless / SSR environments.
   */
  private _uiOverlay: HTMLElement | undefined;
  private _audioContext: AudioContext | undefined;
  renderScale: number;

  private _maxPixelRatio: number;

  constructor(options: RuntimeContextOptions = {}) {
    const canvas = options.canvas ?? document.createElement('canvas');
    this.canvas = canvas;

    this.assets = options.assetDatabase ?? new AssetDatabase();
    this.loader = AssetLoader.create(this.assets, options.blobSource ?? new InMemoryBlobSource());

    const initialPreset = options.qualityPreset ?? 'high';
    const initialSettings: QualitySettings = QUALITY_PROFILES[initialPreset];
    const antialias =
      options.antialias ?? createTimeAntialias(initialSettings);

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias,
      alpha: options.alpha ?? false,
      powerPreference: 'high-performance',
    });

    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.0;
    this.renderer.shadowMap.enabled = false;

    this._maxPixelRatio = Math.min(2, Math.max(1, options.maxPixelRatio ?? 2));
    this.renderScale = options.renderScale ?? 1;
    this.clock = new THREE.Clock();
    this.resize();

    this.quality =
      options.qualityManager ??
      new QualityManager({ initialPreset: initialPreset });
    this.quality.attach(this);
    this.fxaaEnabled = shouldUseFxaa(this.quality.getEffectiveSettings());
  }

  /** Current maximum device pixel ratio. */
  get maxPixelRatio(): number {
    return this._maxPixelRatio;
  }

  /**
   * Update the device-pixel-ratio cap. Clamped to `[1, 4]` and immediately
   * pushed to the renderer via {@link resize}. Used by
   * `QualityManager` when switching profiles.
   */
  setMaxPixelRatio(value: number): void {
    this._maxPixelRatio = Math.min(4, Math.max(1, value));
  }

  /**
   * Resize the renderer to the canvas's CSS size, applying the configured
   * render scale and clamped device pixel ratio.
   */
  resize(): void {
    const dpr = Math.min(this._maxPixelRatio, window.devicePixelRatio || 1);
    const rect = this.canvas.getBoundingClientRect();
    const width = Math.max(1, Math.floor(rect.width || this.canvas.clientWidth || 1));
    const height = Math.max(1, Math.floor(rect.height || this.canvas.clientHeight || 1));
    this.renderer.setPixelRatio(dpr * this.renderScale);
    this.renderer.setSize(width, height, false);
  }

  /** Tear down GPU resources. The context is unusable afterwards. */
  dispose(): void {
    this.quality.detach();
    this.loader.dispose();
    this.renderer.dispose();
    if (this._uiOverlay && this._uiOverlay.parentElement) {
      this._uiOverlay.parentElement.removeChild(this._uiOverlay);
    }
    this._uiOverlay = undefined;
    if (this._audioContext && this._audioContext.state !== 'closed') {
      void this._audioContext.close();
    }
    this._audioContext = undefined;
  }

  /**
   * DOM overlay positioned above the WebGL canvas. UI components mount into
   * this element. Created lazily and only in DOM environments.
   */
  get uiOverlay(): HTMLElement | undefined {
    if (this._uiOverlay) return this._uiOverlay;
    if (typeof document === 'undefined') return undefined;
    const overlay = document.createElement('div');
    overlay.className = 'fc-ui-overlay';
    overlay.style.position = 'absolute';
    overlay.style.inset = '0';
    overlay.style.pointerEvents = 'none';
    overlay.style.overflow = 'hidden';
    // The overlay is inserted next to the canvas; the host element is
    // expected to use `position: relative` or similar.
    const parent = this.canvas.parentElement;
    if (parent) {
      if (getComputedStyle(parent).position === 'static') {
        parent.style.position = 'relative';
      }
      parent.appendChild(overlay);
    }
    this._uiOverlay = overlay;
    return overlay;
  }

  /**
   * Lazily-created `AudioContext`. Browsers require a user gesture before
   * audio can play; the {@link AudioSystem} handles resumption.
   */
  getAudioContext(): AudioContext | undefined {
    if (this._audioContext) return this._audioContext;
    const Ctx =
      (globalThis as { AudioContext?: typeof AudioContext }).AudioContext ??
      (globalThis as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return undefined;
    this._audioContext = new Ctx();
    return this._audioContext;
  }
}
