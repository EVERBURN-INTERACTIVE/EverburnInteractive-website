/**
 * Spline-based camera path driven by scroll progress.
 * @module @runtime/systems/camera-path
 */

import * as THREE from 'three';
import type { Vec3 } from '@shared/types';
import type { Runtime } from '../runtime';
import type { Scene } from '../scene/scene';
import { CameraComponent } from '../components/camera.component';
import { TransformComponent } from '../components/transform.component';
import type { System } from './system';
import { getScrollTriggerSystem } from './scroll-trigger.system';

/** Priority: after scroll trigger, before animation. */
export const CAMERA_PATH_PRIORITY = 25;

/** Camera path registration from a component. */
export interface CameraPathRegistration {
  readonly id: string;
  readonly scene: Scene;
  readonly cameraActorId?: string;
  readonly scrollStart: number;
  readonly scrollEnd: number;
  readonly clamp: boolean;
  readonly waypoints: readonly Vec3[];
  readonly lookAtTargets?: readonly Vec3[];
}

const _pos = new THREE.Vector3();
const _lookAt = new THREE.Vector3();

/**
 * CameraPathSystem interpolates camera position and look-at along waypoint
 * splines based on scroll progress from {@link ScrollTriggerSystem}.
 */
export class CameraPathSystem implements System {
  readonly name = 'CameraPathSystem';
  readonly priority = CAMERA_PATH_PRIORITY;

  private _runtime: Runtime | undefined;
  private readonly _paths = new Map<string, CameraPathRegistration>();

  onRegister(runtime: Runtime): void {
    this._runtime = runtime;
  }

  onUnregister(): void {
    this._paths.clear();
    this._runtime = undefined;
  }

  register(path: CameraPathRegistration): void {
    this._paths.set(path.id, path);
  }

  unregister(id: string): void {
    this._paths.delete(id);
  }

  onUpdate(_dt: number): void {
    if (!this._runtime) return;
    const scrollSys = getScrollTriggerSystem(this._runtime);
    for (const path of this._paths.values()) {
      const progress = scrollSys
        ? scrollSys.computeProgress({
            scrollStart: path.scrollStart,
            scrollEnd: path.scrollEnd,
            clamp: path.clamp,
          })
        : 0;
      this._applyPath(path, progress);
    }
  }

  private _applyPath(path: CameraPathRegistration, t: number): void {
    const wps = path.waypoints;
    if (wps.length === 0) return;

    const camera = this._resolveCamera(path);
    if (!camera) return;

    if (wps.length === 1) {
      _pos.set(wps[0][0], wps[0][1], wps[0][2]);
    } else {
      const scaled = t * (wps.length - 1);
      const idx = Math.min(Math.floor(scaled), wps.length - 2);
      const localT = scaled - idx;
      const a = wps[idx];
      const b = wps[idx + 1];
      _pos.set(
        a[0] + (b[0] - a[0]) * localT,
        a[1] + (b[1] - a[1]) * localT,
        a[2] + (b[2] - a[2]) * localT,
      );
    }

    camera.position.copy(_pos);

    const lookTargets = path.lookAtTargets;
    if (lookTargets && lookTargets.length > 0) {
      const lt = lookTargets[Math.min(Math.floor(t * (lookTargets.length - 1)), lookTargets.length - 1)];
      _lookAt.set(lt[0], lt[1], lt[2]);
      camera.lookAt(_lookAt);
    }

    const transform = this._resolveTransform(path);
    if (transform) {
      transform.setProps({
        ...transform.props,
        position: [_pos.x, _pos.y, _pos.z] as Vec3,
      });
    }
  }

  private _resolveCamera(path: CameraPathRegistration): THREE.Camera | undefined {
    const actorId = path.cameraActorId ?? path.scene.mainCameraActorId;
    if (!actorId) return undefined;
    const actor = path.scene.findActorById(actorId);
    return actor?.getComponent(CameraComponent)?.camera;
  }

  private _resolveTransform(path: CameraPathRegistration): TransformComponent | undefined {
    const actorId = path.cameraActorId ?? path.scene.mainCameraActorId;
    if (!actorId) return undefined;
    return path.scene.findActorById(actorId)?.getComponent(TransformComponent);
  }
}

/** Resolve the CameraPathSystem from a runtime instance. */
export function getCameraPathSystem(runtime: Runtime): CameraPathSystem | undefined {
  return runtime.systems.find((s) => s.name === 'CameraPathSystem') as CameraPathSystem | undefined;
}
