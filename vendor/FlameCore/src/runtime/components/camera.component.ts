import * as THREE from 'three';
import type { SerializedComponentProps } from '@shared/types';
import { BaseComponent } from '../scene/component';
import type { Actor } from '../scene/actor';

/** Type of camera projection. */
export type CameraProjection = 'perspective' | 'orthographic';

/** Serialized camera properties. */
export interface CameraProps extends SerializedComponentProps {
  readonly _version: 1;
  projection: CameraProjection;
  /** Vertical field of view in degrees (perspective only). */
  fov: number;
  /** Half-height of the ortho view (orthographic only). */
  orthoSize: number;
  near: number;
  far: number;
  /** Mark this camera as the active main camera for its scene. */
  isMain: boolean;
}

/** Factory for default camera props. */
export function makeCameraProps(patch: Partial<Omit<CameraProps, '_version'>> = {}): CameraProps {
  return {
    _version: 1,
    projection: patch.projection ?? 'perspective',
    fov: patch.fov ?? 50,
    orthoSize: patch.orthoSize ?? 5,
    near: patch.near ?? 0.1,
    far: patch.far ?? 1000,
    isMain: patch.isMain ?? true,
  };
}

/**
 * Owns a `THREE.PerspectiveCamera` or `THREE.OrthographicCamera`. When
 * `isMain` is true, the component tags itself as the scene's main camera so
 * the Rendering and Input systems know what to use.
 */
export class CameraComponent extends BaseComponent<CameraProps> {
  static readonly typeName = 'CameraComponent';

  private _camera: THREE.Camera | undefined;

  /** The Three.js camera owned by this component, if attached. */
  get camera(): THREE.Camera | undefined {
    return this._camera;
  }

  onAttach(actor: Actor): void {
    super.onAttach(actor);
    this._build();
  }

  onSceneAttach(scene: import('../scene/scene').Scene): void {
    if (this._props.isMain) {
      scene.mainCameraActorId = this._actor?.id;
    }
  }

  onSceneDetach(scene: import('../scene/scene').Scene): void {
    if (scene.mainCameraActorId === this._actor?.id) {
      scene.mainCameraActorId = undefined;
    }
  }

  onDetach(): void {
    this._camera = undefined;
    super.onDetach();
  }

  /** Update camera aspect when the canvas resizes. */
  updateAspect(width: number, height: number): void {
    if (!this._camera) return;
    const aspect = height === 0 ? 1 : width / height;
    if (this._camera instanceof THREE.PerspectiveCamera) {
      this._camera.aspect = aspect;
      this._camera.updateProjectionMatrix();
    } else if (this._camera instanceof THREE.OrthographicCamera) {
      const size = this._props.orthoSize;
      this._camera.left = -size * aspect;
      this._camera.right = size * aspect;
      this._camera.top = size;
      this._camera.bottom = -size;
      this._camera.updateProjectionMatrix();
    }
  }

  protected onPropsChanged(): void {
    // Rebuild the camera if projection or core params changed.
    if (!this._actor) return;
    if (this._camera) {
      this._actor.object3D.remove(this._camera);
      this._camera = undefined;
    }
    this._build();
    const scene = this._actor.scene;
    if (scene && this._props.isMain) {
      scene.mainCameraActorId = this._actor.id;
    }
  }

  private _build(): void {
    if (!this._actor) return;
    if (this._props.projection === 'perspective') {
      this._camera = new THREE.PerspectiveCamera(
        this._props.fov,
        1,
        this._props.near,
        this._props.far,
      );
    } else {
      const s = this._props.orthoSize;
      this._camera = new THREE.OrthographicCamera(-s, s, s, -s, this._props.near, this._props.far);
    }
    this._actor.object3D.add(this._camera);
  }
}
