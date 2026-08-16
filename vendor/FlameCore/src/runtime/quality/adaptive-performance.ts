/**
 * Adaptive performance controller — steps quality / physics rate down when
 * frame time stays too high, and recovers when the frame budget returns.
 *
 * WebGL rendering remains on the main thread (browser constraint). This
 * controller keeps the editor interactive by reducing GPU + physics load
 * instead of claiming false multi-threaded rendering.
 *
 * @module @runtime/quality/adaptive-performance
 */

import type { QualityManager, QualityPreset } from './quality-manager';

/** Tunables for {@link AdaptivePerformanceController}. */
export interface AdaptivePerformanceOptions {
  /** Average FPS below this for `downgradeAfterMs` triggers a quality step-down. */
  readonly lowFpsThreshold?: number;
  /** Average FPS above this for `upgradeAfterMs` allows a quality step-up. */
  readonly highFpsThreshold?: number;
  /** How long FPS must stay low before downgrading. */
  readonly downgradeAfterMs?: number;
  /** How long FPS must stay high before upgrading. */
  readonly upgradeAfterMs?: number;
  /** Rolling window length for the FPS average. */
  readonly sampleWindow?: number;
  /** Called when physics simulation rate should change (Hz). */
  readonly onPhysicsRateChange?: (hz: number) => void;
}

const PRESET_ORDER: readonly QualityPreset[] = ['low', 'medium', 'high'];

/**
 * Watches recent FPS and asks {@link QualityManager} to step presets.
 * Also notifies a physics-rate callback (60 → 30 Hz under load).
 */
export class AdaptivePerformanceController {
  private readonly _lowFps: number;
  private readonly _highFps: number;
  private readonly _downgradeAfterMs: number;
  private readonly _upgradeAfterMs: number;
  private readonly _sampleWindow: number;
  private readonly _onPhysicsRateChange?: (hz: number) => void;

  private readonly _samples: number[] = [];
  private _lowSince: number | undefined;
  private _highSince: number | undefined;
  private _enabled = true;
  private _lastPhysicsHz = 60;

  constructor(
    private readonly _quality: QualityManager,
    options: AdaptivePerformanceOptions = {},
  ) {
    this._lowFps = options.lowFpsThreshold ?? 28;
    this._highFps = options.highFpsThreshold ?? 50;
    this._downgradeAfterMs = options.downgradeAfterMs ?? 1500;
    this._upgradeAfterMs = options.upgradeAfterMs ?? 4000;
    this._sampleWindow = options.sampleWindow ?? 45;
    this._onPhysicsRateChange = options.onPhysicsRateChange;
  }

  /** Enable or disable adaptive tuning (manual quality overrides stay intact). */
  set enabled(value: boolean) {
    this._enabled = value;
  }

  get enabled(): boolean {
    return this._enabled;
  }

  /** Record one frame and maybe adjust quality / physics rate. */
  recordFrame(nowMs: number, frameDtSec: number): void {
    if (!this._enabled || !(frameDtSec > 0)) return;
    const fps = 1 / frameDtSec;
    this._samples.push(fps);
    if (this._samples.length > this._sampleWindow) this._samples.shift();
    if (this._samples.length < 10) return;

    const avg = this._samples.reduce((a, b) => a + b, 0) / this._samples.length;
    const preset = this._quality.preset;
    const idx = PRESET_ORDER.indexOf(preset);

    if (avg < this._lowFps) {
      this._highSince = undefined;
      if (this._lowSince === undefined) this._lowSince = nowMs;
      if (nowMs - this._lowSince >= this._downgradeAfterMs && idx > 0) {
        this._quality.applyProfile(PRESET_ORDER[idx - 1]!);
        this._setPhysicsHz(idx - 1 <= 0 ? 30 : 45);
        this._lowSince = nowMs;
        this._samples.length = 0;
      } else if (avg < this._lowFps * 0.75) {
        // Under severe load, cut physics sooner even before a full preset step.
        this._setPhysicsHz(30);
      }
    } else if (avg > this._highFps) {
      this._lowSince = undefined;
      if (this._highSince === undefined) this._highSince = nowMs;
      if (nowMs - this._highSince >= this._upgradeAfterMs && idx >= 0 && idx < PRESET_ORDER.length - 1) {
        this._quality.applyProfile(PRESET_ORDER[idx + 1]!);
        this._setPhysicsHz(idx + 1 >= 2 ? 60 : 45);
        this._highSince = nowMs;
        this._samples.length = 0;
      }
    } else {
      this._lowSince = undefined;
      this._highSince = undefined;
    }
  }

  private _setPhysicsHz(hz: number): void {
    if (hz === this._lastPhysicsHz) return;
    this._lastPhysicsHz = hz;
    this._onPhysicsRateChange?.(hz);
  }
}
