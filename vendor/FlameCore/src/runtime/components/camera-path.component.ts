/**
 * Camera path component — scroll-driven spline camera animation.
 * @module @runtime/components/camera-path
 */

import type { CameraPathProps } from '@shared/types/scroll';
import { BaseComponent } from '../scene/component';
import type { Scene } from '../scene/scene';
import { getCameraPathSystem } from '../systems/camera-path.system';

/** Factory for default camera path props. */
export function makeCameraPathProps(
  patch: Partial<Omit<CameraPathProps, '_version'>> = {},
): CameraPathProps {
  const out: CameraPathProps = {
    _version: 1,
    scrollStart: patch.scrollStart ?? 0,
    scrollEnd: patch.scrollEnd ?? 2000,
    clamp: patch.clamp ?? true,
    waypoints: patch.waypoints ?? [
      [0, 2, 8],
      [0, 1.5, 4],
      [0, 1, 2],
    ],
  };
  if (patch.cameraActorId) out.cameraActorId = patch.cameraActorId;
  if (patch.lookAtTargets) out.lookAtTargets = patch.lookAtTargets;
  return out;
}

/**
 * Registers a scroll-driven camera path with {@link CameraPathSystem}.
 */
export class CameraPathComponent extends BaseComponent<CameraPathProps> {
  static readonly typeName = 'CameraPathComponent';

  private _scene: Scene | undefined;
  private _pathId = '';

  onSceneAttach(scene: Scene): void {
    super.onSceneAttach(scene);
    this._scene = scene;
    this._pathId = `${this._actor?.id ?? 'unknown'}:camera-path`;
    this._register();
  }

  onSceneDetach(scene: Scene): void {
    this._unregister();
    this._scene = undefined;
    super.onSceneDetach(scene);
  }

  protected onPropsChanged(): void {
    this._unregister();
    this._register();
  }

  private _register(): void {
    const runtime = this._scene?.runtime;
    if (!runtime || !this._scene) return;
    const sys = getCameraPathSystem(runtime);
    if (!sys) return;
    sys.register({
      id: this._pathId,
      scene: this._scene,
      cameraActorId: this._props.cameraActorId,
      scrollStart: this._props.scrollStart,
      scrollEnd: this._props.scrollEnd,
      clamp: this._props.clamp,
      waypoints: this._props.waypoints,
      lookAtTargets: this._props.lookAtTargets,
    });
  }

  private _unregister(): void {
    const runtime = this._scene?.runtime;
    if (!runtime || !this._pathId) return;
    getCameraPathSystem(runtime)?.unregister(this._pathId);
  }
}
