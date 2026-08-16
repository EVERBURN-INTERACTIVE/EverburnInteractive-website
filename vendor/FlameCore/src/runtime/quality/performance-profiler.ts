/**
 * Runtime performance profiler — shareable JSON report for client audits.
 * @module @runtime/quality/performance-profiler
 */

import * as THREE from 'three';
import type { Runtime } from '../runtime';
import type { Scene } from '../scene/scene';

/** Single FPS sample captured during profiling. */
export interface FpsSample {
  readonly timestamp: number;
  readonly fps: number;
  readonly frameMs: number;
}

/** Scene statistics included in the report. */
export interface SceneStats {
  readonly actorCount: number;
  readonly meshCount: number;
  readonly lightCount: number;
  readonly materialCount: number;
  readonly textureCount: number;
}

/** Shareable performance audit report (JSON-serializable). */
export interface PerformanceReport {
  readonly _version: 1;
  readonly generatedAt: string;
  readonly sceneName?: string;
  readonly runtimeVersion: string;
  readonly qualityPreset: string;
  readonly device: DeviceInfo;
  readonly fps: {
    readonly average: number;
    readonly min: number;
    readonly max: number;
    readonly samples: readonly FpsSample[];
  };
  readonly renderer: {
    readonly drawCalls: number;
    readonly triangles: number;
    readonly textures: number;
    readonly geometries: number;
    readonly textureMemoryEstimateMb: number;
  };
  readonly scene: SceneStats;
  readonly hints: readonly string[];
  readonly findings?: readonly string[];
}

/** Device snapshot included in audit reports. */
export interface DeviceInfo {
  readonly userAgent: string;
  readonly viewportWidth: number;
  readonly viewportHeight: number;
  readonly devicePixelRatio: number;
  readonly hardwareConcurrency: number;
}

/** Options for {@link PerformanceProfiler}. */
export interface PerformanceProfilerOptions {
  readonly maxSamples?: number;
}

/**
 * Collects FPS samples and renderer metrics, producing a shareable JSON
 * report suitable for client performance audits (Fiverr Gig 5).
 */
export class PerformanceProfiler {
  private readonly _maxSamples: number;
  private readonly _samples: FpsSample[] = [];
  private _lastTime = 0;

  constructor(options: PerformanceProfilerOptions = {}) {
    this._maxSamples = options.maxSamples ?? 120;
  }

  /** Record one frame sample (call from afterUpdate). */
  recordFrame(now: number): void {
    if (this._lastTime <= 0) {
      this._lastTime = now;
      return;
    }
    const dt = now - this._lastTime;
    this._lastTime = now;
    if (dt <= 0) return;
    const fps = 1000 / dt;
    this._samples.push({ timestamp: now, fps, frameMs: dt });
    if (this._samples.length > this._maxSamples) {
      this._samples.shift();
    }
  }

  /** Reset collected samples. */
  reset(): void {
    this._samples.length = 0;
    this._lastTime = 0;
  }

  /** Generate a snapshot report from the current runtime state. */
  generateReport(
    runtime: Runtime,
    scene?: Scene,
    options: { hints?: readonly string[]; findings?: readonly string[] } = {},
  ): PerformanceReport {
    const renderer = runtime.context.renderer;
    const info = renderer.info;
    const fpsValues = this._samples.map((s) => s.fps);
    const avg = fpsValues.length
      ? fpsValues.reduce((a, b) => a + b, 0) / fpsValues.length
      : 0;

    return {
      _version: 1,
      generatedAt: new Date().toISOString(),
      sceneName: scene?.name,
      runtimeVersion: runtime.version,
      qualityPreset: runtime.context.quality.preset,
      device: collectDeviceInfo(),
      fps: {
        average: Math.round(avg * 10) / 10,
        min: fpsValues.length ? Math.min(...fpsValues) : 0,
        max: fpsValues.length ? Math.max(...fpsValues) : 0,
        samples: [...this._samples],
      },
      renderer: {
        drawCalls: info.render.calls,
        triangles: info.render.triangles,
        textures: info.memory.textures,
        geometries: info.memory.geometries,
        textureMemoryEstimateMb: estimateTextureMemoryMb(renderer),
      },
      scene: scene ? collectSceneStats(scene) : emptySceneStats(),
      hints: [...(options.hints ?? [])],
      ...(options.findings?.length ? { findings: [...options.findings] } : {}),
    };
  }

  /** Export report as formatted JSON string. */
  exportJson(
    runtime: Runtime,
    scene?: Scene,
    options: { hints?: readonly string[]; findings?: readonly string[] } = {},
  ): string {
    return JSON.stringify(this.generateReport(runtime, scene, options), null, 2);
  }
}

function emptySceneStats(): SceneStats {
  return { actorCount: 0, meshCount: 0, lightCount: 0, materialCount: 0, textureCount: 0 };
}

/** Collect browser/device info for audit reports. */
export function collectDeviceInfo(): DeviceInfo {
  if (typeof navigator === 'undefined') {
    return {
      userAgent: 'ssr',
      viewportWidth: 0,
      viewportHeight: 0,
      devicePixelRatio: 1,
      hardwareConcurrency: 0,
    };
  }
  return {
    userAgent: navigator.userAgent,
    viewportWidth: typeof window !== 'undefined' ? window.innerWidth : 0,
    viewportHeight: typeof window !== 'undefined' ? window.innerHeight : 0,
    devicePixelRatio: typeof window !== 'undefined' ? window.devicePixelRatio : 1,
    hardwareConcurrency: navigator.hardwareConcurrency ?? 0,
  };
}

/** Walk the scene graph and count render-related objects. */
export function collectSceneStats(scene: Scene): SceneStats {
  let meshCount = 0;
  let lightCount = 0;
  const materials = new Set<unknown>();
  const textures = new Set<unknown>();

  for (const actor of scene.actors) {
    actor.object3D.traverse((obj) => {
      const o = obj as THREE.Mesh & THREE.Light;
      if (o.isMesh) {
        meshCount++;
        const mat = o.material;
        const mats = Array.isArray(mat) ? mat : mat ? [mat] : [];
        for (const m of mats) {
          materials.add(m);
          const std = m as THREE.MeshStandardMaterial;
          if (std.map) textures.add(std.map);
        }
      }
      if (o.isLight) lightCount++;
    });
  }

  return {
    actorCount: scene.actors.length,
    meshCount,
    lightCount,
    materialCount: materials.size,
    textureCount: textures.size,
  };
}

/** Rough texture memory estimate from renderer.info (MB). */
export function estimateTextureMemoryMb(renderer: THREE.WebGLRenderer): number {
  // Heuristic: ~4 bytes per texel for RGBA8; use texture count * avg 512² as fallback.
  const texCount = renderer.info.memory.textures;
  const avgTexelBytes = 512 * 512 * 4;
  return Math.round((texCount * avgTexelBytes) / (1024 * 1024) * 10) / 10;
}
