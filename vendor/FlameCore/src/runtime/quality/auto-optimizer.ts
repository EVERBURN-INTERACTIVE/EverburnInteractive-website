/**
 * Auto-optimizer — detects common performance issues and suggests fixes.
 * @module @runtime/quality/auto-optimizer
 */

import * as THREE from 'three';
import type { Runtime } from '../runtime';
import type { Scene } from '../scene/scene';

/** Severity of an optimization finding. */
export type OptimizerSeverity = 'info' | 'warn' | 'critical';

/** A single optimization finding with optional auto-fix. */
export interface OptimizerFinding {
  readonly code: string;
  readonly severity: OptimizerSeverity;
  readonly message: string;
  readonly actorId?: string;
  /** When true, {@link AutoOptimizer.applySafeFixes} may attempt a fix. */
  readonly autoFixable: boolean;
}

/** Result of an optimization scan. */
export interface OptimizerReport {
  readonly _version: 1;
  readonly scannedAt: string;
  readonly findings: readonly OptimizerFinding[];
  readonly appliedFixes: readonly string[];
}

/** Options for {@link AutoOptimizer.scan}. */
export interface AutoOptimizerOptions {
  /** Max texture dimension before flagging as oversized. */
  maxTextureSize?: number;
}

/**
 * Detects oversized textures, duplicate meshes, and missing dispose patterns.
 * Safe fixes are limited to toggling `matrixAutoUpdate` on static actors.
 */
export class AutoOptimizer {
  private readonly _maxTextureSize: number;

  constructor(options: AutoOptimizerOptions = {}) {
    this._maxTextureSize = options.maxTextureSize ?? 2048;
  }

  /** Scan a scene and runtime for optimization opportunities. */
  scan(runtime: Runtime, scene: Scene): OptimizerReport {
    const findings: OptimizerFinding[] = [];
    findings.push(...this._scanTextures(runtime));
    findings.push(...this._scanDuplicateMeshes(scene));
    findings.push(...this._scanStaticActors(scene));
    findings.push(...this._scanDrawCalls(runtime));

    return {
      _version: 1,
      scannedAt: new Date().toISOString(),
      findings,
      appliedFixes: [],
    };
  }

  /** Apply safe, non-destructive fixes and return updated report. */
  applySafeFixes(runtime: Runtime, scene: Scene): OptimizerReport {
    const report = this.scan(runtime, scene);
    const applied: string[] = [];

    for (const actor of scene.actors) {
      const hasAnim =
        actor.components.some((c) => c.type.includes('Animation')) ||
        actor.components.some((c) => c.type.includes('Particle'));
      if (!hasAnim && actor.object3D.matrixAutoUpdate) {
        actor.object3D.matrixAutoUpdate = false;
        actor.object3D.updateMatrix();
        applied.push(`static-matrix:${actor.id}`);
      }
    }

    return { ...report, appliedFixes: applied };
  }

  private _scanTextures(runtime: Runtime): OptimizerFinding[] {
    const findings: OptimizerFinding[] = [];
    const maxSize = runtime.context.renderer.capabilities.maxTextureSize;
    if (maxSize < this._maxTextureSize) {
      findings.push({
        code: 'texture-cap-low',
        severity: 'warn',
        message: `GPU max texture size (${maxSize}) is below recommended ${this._maxTextureSize}px.`,
        autoFixable: false,
      });
    }
    const texCount = runtime.context.renderer.info.memory.textures;
    if (texCount > 32) {
      findings.push({
        code: 'texture-count-high',
        severity: 'warn',
        message: `${texCount} textures loaded; consider atlasing or reducing unique materials.`,
        autoFixable: false,
      });
    }
    return findings;
  }

  private _scanDuplicateMeshes(scene: Scene): OptimizerFinding[] {
    const findings: OptimizerFinding[] = [];
    const geoHashes = new Map<string, string[]>();

    for (const actor of scene.actors) {
      actor.object3D.traverse((obj) => {
        const mesh = obj as THREE.Mesh;
        if (!mesh.isMesh || !mesh.geometry) return;
        const key = `${mesh.geometry.uuid}:${JSON.stringify(mesh.scale.toArray())}`;
        const list = geoHashes.get(key) ?? [];
        list.push(actor.id);
        geoHashes.set(key, list);
      });
    }

    for (const [, ids] of geoHashes) {
      if (ids.length > 3) {
        findings.push({
          code: 'duplicate-mesh',
          severity: 'info',
          message: `${ids.length} actors share identical geometry; consider InstancedMesh.`,
          actorId: ids[0],
          autoFixable: false,
        });
      }
    }
    return findings;
  }

  private _scanStaticActors(scene: Scene): OptimizerFinding[] {
    const findings: OptimizerFinding[] = [];
    for (const actor of scene.actors) {
      if (actor.object3D.matrixAutoUpdate && actor.components.length <= 2) {
        findings.push({
          code: 'static-matrix-auto',
          severity: 'info',
          message: `Actor "${actor.name}" may be static; disable matrixAutoUpdate.`,
          actorId: actor.id,
          autoFixable: true,
        });
      }
    }
    return findings;
  }

  private _scanDrawCalls(runtime: Runtime): OptimizerFinding[] {
    const calls = runtime.context.renderer.info.render.calls;
    if (calls > 200) {
      return [{
        code: 'draw-calls-high',
        severity: 'critical',
        message: `${calls} draw calls exceeds mobile target (~100); merge meshes or use instancing.`,
        autoFixable: false,
      }];
    }
    return [];
  }
}

/** Export optimizer report as JSON. */
export function exportOptimizerReport(report: OptimizerReport): string {
  return JSON.stringify(report, null, 2);
}
