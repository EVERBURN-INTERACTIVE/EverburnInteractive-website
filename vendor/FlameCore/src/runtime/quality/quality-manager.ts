import * as THREE from 'three';
import { EventEmitter } from '../utils/events';
import type { RuntimeContext } from '../runtime-context';

/** Built-in quality presets, sorted from cheapest to most expensive. */
export type QualityPreset = 'low' | 'medium' | 'high';

/** Antialiasing strategy applied by the renderer / post stack. */
export type AntialiasMode = 'none' | 'fxaa' | 'msaa4x';

/** Shadow softness strategy. PCF/PCSS both map to THREE.PCFSoftShadowMap. */
export type ShadowSoftness = 'none' | 'pcf' | 'pcss';

/**
 * Effective render-quality settings. A {@link QualityManager} resolves a
 * {@link QualityPreset} into this shape and then applies it to the
 * {@link RuntimeContext} (renderer, render scale, shadow config).
 */
export interface QualitySettings {
  /** Render-target scale relative to the canvas size (0.25–2). */
  renderScale: number;
  /** Square shadow-map size in texels. */
  shadowMapSize: number;
  /** Whether shadows are enabled at all (Low can drop them entirely). */
  shadowsEnabled: boolean;
  /** Shadow filtering / softness mode. */
  shadowSoftness: ShadowSoftness;
  /** Antialiasing strategy. */
  antialias: AntialiasMode;
  /** Whether the (optional) post-processing stack should run. */
  postProcessing: boolean;
  /** Hard cap on `devicePixelRatio` after scaling. */
  maxPixelRatio: number;
}

/** Lookup table of preset → default settings. */
export const QUALITY_PROFILES: Readonly<Record<QualityPreset, QualitySettings>> = Object.freeze({
  low: Object.freeze({
    renderScale: 0.5,
    shadowMapSize: 512,
    shadowsEnabled: false,
    shadowSoftness: 'none',
    antialias: 'none',
    postProcessing: false,
    maxPixelRatio: 1.5,
  }),
  medium: Object.freeze({
    renderScale: 0.75,
    shadowMapSize: 1024,
    shadowsEnabled: true,
    shadowSoftness: 'pcf',
    antialias: 'fxaa',
    postProcessing: false,
    maxPixelRatio: 2,
  }),
  high: Object.freeze({
    renderScale: 1,
    shadowMapSize: 2048,
    shadowsEnabled: true,
    shadowSoftness: 'pcss',
    antialias: 'msaa4x',
    postProcessing: true,
    maxPixelRatio: 2,
  }),
});

/** Events emitted by {@link QualityManager}. */
export interface QualityEvents {
  /** Fired after a preset or override is applied. */
  settingsChanged: {
    preset: QualityPreset;
    settings: QualitySettings;
    source: 'preset' | 'override' | 'auto';
  };
}

/** Constructor options. */
export interface QualityManagerOptions {
  /** Initial preset. Defaults to `'high'`. */
  initialPreset?: QualityPreset;
  /** Manual override map applied on top of the preset. */
  overrides?: Partial<QualitySettings>;
  /** Persistence key used by {@link QualityManager.saveSelection}. */
  storageKey?: string;
}

const DEFAULT_STORAGE_KEY = 'flamecore.quality.preset';

/**
 * Manages render-quality settings and exposes them to the rest of the engine.
 *
 * Usage:
 * ```ts
 * const qm = new QualityManager({ initialPreset: 'medium' });
 * qm.attach(runtime.context);
 * qm.applyProfile(QualityManager.autoDetect(runtime.context.renderer));
 * ```
 *
 * Per PRD 6 §6.2 the manager is the single source of truth for render scale,
 * antialiasing, shadow quality, and post-processing toggles. Components and
 * editor panels subscribe via {@link events} to react to changes.
 */
export class QualityManager {
  readonly events = new EventEmitter<QualityEvents>();

  private _preset: QualityPreset;
  private _overrides: Partial<QualitySettings>;
  private _context: RuntimeContext | undefined;
  private readonly _storageKey: string;

  constructor(options: QualityManagerOptions = {}) {
    this._preset = options.initialPreset ?? 'high';
    this._overrides = { ...(options.overrides ?? {}) };
    this._storageKey = options.storageKey ?? DEFAULT_STORAGE_KEY;
  }

  /** Currently selected preset (independent of any overrides). */
  get preset(): QualityPreset {
    return this._preset;
  }

  /** Current overrides (frozen view). */
  get overrides(): Readonly<Partial<QualitySettings>> {
    return { ...this._overrides };
  }

  /** Resolve the effective settings = preset defaults + overrides. */
  getEffectiveSettings(): QualitySettings {
    return { ...QUALITY_PROFILES[this._preset], ...this._overrides };
  }

  /**
   * Attach to a {@link RuntimeContext} so the manager can push effective
   * settings to the renderer immediately and on every later change.
   *
   * Safe to call multiple times: the previous context is detached first.
   */
  attach(context: RuntimeContext): void {
    this._context = context;
    this._apply('preset');
  }

  /** Detach from the current context (settings stay in memory). */
  detach(): void {
    this._context = undefined;
  }

  /** Switch to a built-in preset and re-apply. */
  applyProfile(preset: QualityPreset): void {
    this._preset = preset;
    // Clear overrides — a preset switch is an explicit "reset" gesture.
    this._overrides = {};
    this._apply('preset');
  }

  /** Set a single override on top of the active preset. */
  setOverride<K extends keyof QualitySettings>(key: K, value: QualitySettings[K]): void {
    this._overrides = { ...this._overrides, [key]: value };
    this._apply('override');
  }

  /** Remove all overrides (preset values reign again). */
  clearOverrides(): void {
    if (Object.keys(this._overrides).length === 0) return;
    this._overrides = {};
    this._apply('preset');
  }

  /**
   * Auto-detect a sensible preset for the current device based on WebGL
   * capabilities and the host display. The renderer argument is optional;
   * when omitted only screen heuristics are used.
   */
  static autoDetect(renderer?: THREE.WebGLRenderer): QualityPreset {
    const isWebGL2 = renderer?.capabilities.isWebGL2 ?? true;
    const maxTexture = renderer?.capabilities.maxTextureSize ?? 4096;
    const screenPx =
      typeof window !== 'undefined' && window.screen
        ? Math.max(window.screen.width, window.screen.height) *
          (typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1)
        : 1920;

    if (!isWebGL2) return 'low';
    if (screenPx < 768) return 'low';
    if (maxTexture < 4096) return 'medium';
    if (screenPx < 1600) return 'medium';
    return 'high';
  }

  /**
   * Convenience: call {@link autoDetect} for the attached context, then
   * apply the resulting profile. Throws if no context is attached.
   */
  autoDetectAndApply(): QualityPreset {
    if (!this._context) {
      throw new Error('QualityManager.autoDetectAndApply: no context attached');
    }
    const preset = QualityManager.autoDetect(this._context.renderer);
    this._preset = preset;
    this._overrides = {};
    this._apply('auto');
    return preset;
  }

  /** Persist the current preset to `localStorage` for next session. */
  saveSelection(): void {
    if (typeof localStorage === 'undefined') return;
    try {
      localStorage.setItem(this._storageKey, this._preset);
    } catch {
      // Ignore quota / private-mode errors.
    }
  }

  /** Load and apply a previously-persisted preset, if any. */
  loadSelection(): QualityPreset | undefined {
    if (typeof localStorage === 'undefined') return undefined;
    try {
      const raw = localStorage.getItem(this._storageKey);
      if (raw === 'low' || raw === 'medium' || raw === 'high') {
        this.applyProfile(raw);
        return raw;
      }
    } catch {
      /* ignore */
    }
    return undefined;
  }

  /** Push the effective settings to the attached renderer. */
  private _apply(source: 'preset' | 'override' | 'auto'): void {
    const settings = this.getEffectiveSettings();
    const ctx = this._context;
    if (ctx) {
      applyQualityToContext(ctx, settings);
    }
    this.events.emit('settingsChanged', { preset: this._preset, settings, source });
  }
}

/**
 * Push `settings` to the renderer owned by `ctx`. Exposed separately so the
 * pipeline / preview tools can apply settings without instantiating a
 * QualityManager.
 *
 * Native MSAA is create-time only (see {@link createTimeAntialias}). Live
 * preset changes update shadows/scale and toggle {@link RuntimeContext.fxaaEnabled}.
 */
export function applyQualityToContext(ctx: RuntimeContext, settings: QualitySettings): void {
  const renderer = ctx.renderer;
  renderer.shadowMap.enabled = settings.shadowsEnabled;
  renderer.shadowMap.type = mapShadowType(settings.shadowSoftness);
  ctx.setMaxPixelRatio(settings.maxPixelRatio);
  ctx.renderScale = settings.renderScale;
  ctx.fxaaEnabled = shouldUseFxaa(settings);
  ctx.resize();
}

/**
 * Whether the WebGLRenderer constructor should enable native MSAA.
 * FXAA / postProcessing paths prefer no MSAA so the post stack owns AA.
 */
export function createTimeAntialias(settings: QualitySettings): boolean {
  if (settings.antialias === 'none') return false;
  if (shouldUseFxaa(settings)) return false;
  return settings.antialias === 'msaa4x';
}

/** Whether RenderingSystem should run the FXAA EffectComposer. */
export function shouldUseFxaa(settings: QualitySettings): boolean {
  if (settings.antialias === 'none') return false;
  if (settings.antialias === 'fxaa') return true;
  // postProcessing:true forces FXAA when AA is not none (e.g. high profile).
  return settings.postProcessing === true;
}

function mapShadowType(s: ShadowSoftness): THREE.ShadowMapType {
  switch (s) {
    case 'pcss':
      // True PCSS needs a custom shader; PCF soft is the reliable built-in
      // approximation. VSM was previously used here but breaks with common
      // transparent casters (clouds, glass) and can wipe visible shadows.
      return THREE.PCFSoftShadowMap;
    case 'pcf':
      return THREE.PCFSoftShadowMap;
    case 'none':
    default:
      return THREE.BasicShadowMap;
  }
}
