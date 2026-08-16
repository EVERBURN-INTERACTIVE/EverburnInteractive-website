import * as THREE from 'three';
import { LODComponent } from '../components/lod.component';
import { CameraComponent } from '../components/camera.component';
import type { Runtime } from '../runtime';
import type { Scene } from '../scene/scene';
import type { Actor } from '../scene/actor';
import { RenderingSystem } from './rendering.system';
import type { System } from './system';

/**
 * Priority for the LOD pass. Runs after Input (10) but before Gameplay (20)
 * so that scripts can read `LODComponent.currentLevel` reliably.
 */
export const LOD_SYSTEM_PRIORITY = 15;

const _camPos = new THREE.Vector3();
const _actorPos = new THREE.Vector3();

/**
 * Distance-driven LOD switcher. Once per frame it walks every active scene,
 * picks the appropriate level for each {@link LODComponent}, and tells the
 * component to switch.
 *
 * Implementation detail: when the editor injects an override camera (e.g.
 * the fly camera), distances are measured from that camera so the LOD
 * preview matches what the user sees. When the override is cleared,
 * distances fall back to the scene's main camera.
 */
export class LODSystem implements System {
  readonly name = 'LODSystem';
  readonly priority = LOD_SYSTEM_PRIORITY;

  private _runtime: Runtime | undefined;
  private _debugEnabled = false;

  onRegister(runtime: Runtime): void {
    this._runtime = runtime;
  }

  onUnregister(): void {
    this._runtime = undefined;
  }

  /** Enable colored overlays/log info for the editor debug view. */
  set debugEnabled(value: boolean) {
    this._debugEnabled = value;
  }
  get debugEnabled(): boolean {
    return this._debugEnabled;
  }

  onUpdate(dt: number): void {
    if (!this._runtime) return;
    for (const scene of this._runtime.activeScenes) {
      this._updateScene(scene, dt);
    }
  }

  private _updateScene(scene: Scene, dt: number): void {
    const camera = this._resolveCamera(scene);
    if (!camera) {
      // Without a camera nothing to do, but keep fade ticking so any
      // in-flight cross-fade completes deterministically.
      forEachLOD(scene, (_, lod) => lod.tickFade(dt));
      return;
    }
    camera.getWorldPosition(_camPos);

    forEachLOD(scene, (actor, lod) => {
      lod.tickFade(dt);
      if (lod.forcedLevel >= 0) return; // editor override
      actor.object3D.getWorldPosition(_actorPos);
      const dist = _actorPos.distanceTo(_camPos);
      const targetLevel = pickLevel(lod, dist);
      if (targetLevel !== lod.currentLevel) {
        lod.switchToLevel(targetLevel);
      }
    });
  }

  private _resolveCamera(scene: Scene): THREE.Camera | undefined {
    const renderSystem = this._runtime?.getSystem(RenderingSystem);
    const override = renderSystem?.overrideCamera;
    if (override) return override;
    const id = scene.mainCameraActorId;
    if (!id) return undefined;
    const actor = scene.findActorById(id);
    return actor?.getComponent(CameraComponent)?.camera;
  }
}

/**
 * Pick the appropriate LOD level for a given camera distance, honoring the
 * component's `hysteresis` to avoid flicker at boundaries.
 */
export function pickLevel(lod: LODComponent, distance: number): number {
  const count = lod.levelCount;
  if (count === 0) return -1;
  const current = lod.currentLevel;
  const hyst = Math.max(0, lod.hysteresis);

  for (let i = 0; i < count; i++) {
    const max = lod.getMaxDistance(i);
    // Apply hysteresis only when this level is "below" (finer than) the current one:
    // require the camera to come *inside* by `hyst` units before snapping back.
    const effectiveMax = current > i ? max - hyst : max;
    if (distance <= effectiveMax) return i;
  }
  return count - 1;
}

/** Internal helper: invoke `fn` for every actor with an `LODComponent`. */
function forEachLOD(scene: Scene, fn: (actor: Actor, lod: LODComponent) => void): void {
  for (const actor of scene.actors) {
    if (actor.isDestroyed) continue;
    const lod = actor.getComponent(LODComponent);
    if (lod) fn(actor, lod);
    // Recurse into children — LOD authors often nest props.
    walkChildren(actor, fn);
  }
}

function walkChildren(actor: Actor, fn: (actor: Actor, lod: LODComponent) => void): void {
  for (const child of actor.children) {
    const lod = child.getComponent(LODComponent);
    if (lod) fn(child, lod);
    walkChildren(child, fn);
  }
}
