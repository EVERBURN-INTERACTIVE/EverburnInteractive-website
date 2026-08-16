/**
 * Runtime material swapping for product configurators.
 * @module @runtime/systems/material
 */

import * as THREE from 'three';
import type { ConfiguratorSlotOverride } from '@shared/types/configurator';
import type { Runtime } from '../runtime';
import type { AssetId } from '../assets/types';
import type { System } from './system';

/** Priority: after gameplay so mesh roots are attached. */
export const MATERIAL_SYSTEM_PRIORITY = 22;

/** Registered material target keyed by actor id. */
export interface MaterialTarget {
  readonly actorId: string;
  readonly root: THREE.Object3D;
  /** slotName -> material reference */
  readonly slots: Map<string, THREE.MeshStandardMaterial>;
}

/**
 * MaterialSystem enables runtime material swapping (color, texture, PBR
 * factors) without rebuilding the scene graph. Used by {@link ConfiguratorComponent}.
 */
export class MaterialSystem implements System {
  readonly name = 'MaterialSystem';
  readonly priority = MATERIAL_SYSTEM_PRIORITY;

  private _runtime: Runtime | undefined;
  private readonly _targets = new Map<string, MaterialTarget>();

  onRegister(runtime: Runtime): void {
    this._runtime = runtime;
  }

  onUnregister(): void {
    this._targets.clear();
    this._runtime = undefined;
  }

  onUpdate(_dt: number): void {
    // Material swaps are event-driven; no per-frame work.
  }

  /**
   * Register an Object3D subtree for material slot management.
   * Walks meshes and indexes materials by mesh name and material name.
   */
  registerTarget(actorId: string, root: THREE.Object3D): void {
    const slots = new Map<string, THREE.MeshStandardMaterial>();
    root.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      if (!mesh.isMesh || !mesh.material) return;
      const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      mats.forEach((m, idx) => {
        if (!(m instanceof THREE.MeshStandardMaterial)) return;
        const slotKey = m.name || `${mesh.name || 'mesh'}_${idx}`;
        slots.set(slotKey, m);
      });
    });
    this._targets.set(actorId, { actorId, root, slots });
  }

  /** Remove a previously registered target. */
  unregisterTarget(actorId: string): void {
    this._targets.delete(actorId);
  }

  /** List registered slot names for a target actor. */
  getSlotNames(actorId: string): string[] {
    const t = this._targets.get(actorId);
    return t ? [...t.slots.keys()] : [];
  }

  /** Apply a single slot override. */
  async applySlotOverride(
    actorId: string,
    override: ConfiguratorSlotOverride,
  ): Promise<void> {
    const target = this._targets.get(actorId);
    if (!target) return;
    const mat = target.slots.get(override.slotName);
    if (!mat) return;

    if (override.color) {
      mat.color.setRGB(override.color[0], override.color[1], override.color[2]);
    }
    if (override.roughness !== undefined) mat.roughness = override.roughness;
    if (override.metalness !== undefined) mat.metalness = override.metalness;
    if (override.textureAssetId && this._runtime) {
      const tex = await this._runtime.context.loader.loadTexture(
        override.textureAssetId as AssetId,
      );
      mat.map = tex;
      mat.needsUpdate = true;
    }
  }

  /** Apply multiple slot overrides (a full variant). */
  async applyVariant(
    actorId: string,
    overrides: readonly ConfiguratorSlotOverride[],
  ): Promise<void> {
    for (const o of overrides) {
      await this.applySlotOverride(actorId, o);
    }
  }
}

/** Resolve the MaterialSystem from a runtime instance. */
export function getMaterialSystem(runtime: Runtime): MaterialSystem | undefined {
  return runtime.systems.find((s) => s.name === 'MaterialSystem') as MaterialSystem | undefined;
}
