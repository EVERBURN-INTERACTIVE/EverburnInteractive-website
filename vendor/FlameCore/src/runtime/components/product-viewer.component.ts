/**
 * Product viewer component — orbit-controlled 3D product display for Fiverr
 * product-viewer and configurator gigs.
 * @module @runtime/components/product-viewer
 */

import * as THREE from 'three';
import type { ProductViewerProps } from '@shared/types/product-viewer';
import { BaseComponent } from '../scene/component';
import type { Actor } from '../scene/actor';
import type { Scene } from '../scene/scene';
import { CameraComponent } from './camera.component';
import { getLocalLightProfile } from '../lighting/light-profiles';
import { createPlaceholderMesh } from '../assets/asset-loader';

/** Factory for default product viewer props. */
export function makeProductViewerProps(
  patch: Partial<Omit<ProductViewerProps, '_version'>> = {},
): ProductViewerProps {
  const out: ProductViewerProps = {
    _version: 1,
    lightingPreset: patch.lightingPreset ?? 'studio',
    enableOrbit: patch.enableOrbit ?? true,
    autoRotate: patch.autoRotate ?? true,
    autoRotateSpeed: patch.autoRotateSpeed ?? 0.5,
    minDistance: patch.minDistance ?? 1,
    maxDistance: patch.maxDistance ?? 20,
    showPlaceholderOnError: patch.showPlaceholderOnError ?? true,
  };
  if (patch.meshAssetId) out.meshAssetId = patch.meshAssetId;
  return out;
}

type OrbitControlsLike = {
  enabled: boolean;
  autoRotate: boolean;
  autoRotateSpeed: number;
  minDistance: number;
  maxDistance: number;
  target: THREE.Vector3;
  update(): void;
  dispose(): void;
};

/**
 * Self-contained product viewer: loads a GLTF model, applies a lighting preset,
 * and drives orbit controls on the scene's main camera (or a sibling camera).
 */
export class ProductViewerComponent extends BaseComponent<ProductViewerProps> {
  static readonly typeName = 'ProductViewerComponent';

  private _scene: Scene | undefined;
  private _modelRoot: THREE.Object3D | undefined;
  private _lights: THREE.Object3D[] = [];
  private _controls: OrbitControlsLike | undefined;
  private _loadToken = 0;
  private _loadProgress = 0;

  /** Current mesh load progress in `[0, 1]`. */
  get loadProgress(): number {
    return this._loadProgress;
  }

  onAttach(actor: Actor): void {
    super.onAttach(actor);
    this._showPlaceholder();
  }

  onSceneAttach(scene: Scene): void {
    super.onSceneAttach(scene);
    this._scene = scene;
    this._applyLighting();
    void this._initControls();
    void this._loadModel(scene);
  }

  onSceneDetach(scene: Scene): void {
    this._disposeControls();
    this._disposeLights();
    this._disposeModel();
    this._scene = undefined;
    super.onSceneDetach(scene);
  }

  onDetach(): void {
    this._disposeControls();
    this._disposeLights();
    this._disposeModel();
    super.onDetach();
  }

  onUpdate(dt: number): void {
    if (this._controls) {
      this._controls.autoRotate = this._props.autoRotate;
      this._controls.autoRotateSpeed = this._props.autoRotateSpeed;
      this._controls.update();
    }
    // Gentle idle rotation when controls are disabled but autoRotate is on.
    if (!this._controls && this._props.autoRotate && this._modelRoot) {
      this._modelRoot.rotation.y += this._props.autoRotateSpeed * dt;
    }
  }

  protected onPropsChanged(): void {
    this._applyLighting();
    if (this._controls) {
      this._controls.enabled = this._props.enableOrbit;
      this._controls.autoRotate = this._props.autoRotate;
      this._controls.autoRotateSpeed = this._props.autoRotateSpeed;
      this._controls.minDistance = this._props.minDistance;
      this._controls.maxDistance = this._props.maxDistance;
    }
    if (this._scene) void this._loadModel(this._scene);
  }

  private async _initControls(): Promise<void> {
    if (!this._props.enableOrbit || typeof window === 'undefined') return;
    const camera = this._resolveCamera();
    if (!camera) return;
    const canvas = this._scene?.runtime?.context.canvas;
    if (!canvas) return;

    const mod = await import('three/examples/jsm/controls/OrbitControls.js');
    const controls = new mod.OrbitControls(camera, canvas);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.autoRotate = this._props.autoRotate;
    controls.autoRotateSpeed = this._props.autoRotateSpeed;
    controls.minDistance = this._props.minDistance;
    controls.maxDistance = this._props.maxDistance;
    controls.target.set(0, 0, 0);
    this._controls = controls;
    this._disposables.push({ dispose: () => controls.dispose() });
  }

  private _resolveCamera(): THREE.Camera | undefined {
    if (!this._scene) return undefined;
    const mainId = this._scene.mainCameraActorId;
    if (mainId) {
      const camActor = this._scene.findActorById(mainId);
      const cam = camActor?.getComponent(CameraComponent)?.camera;
      if (cam) return cam;
    }
    for (const a of this._scene.actors) {
      const cam = a.getComponent(CameraComponent)?.camera;
      if (cam) return cam;
    }
    return undefined;
  }

  private async _loadModel(scene: Scene): Promise<void> {
    const token = ++this._loadToken;
    this._disposeModel();
    const { meshAssetId, showPlaceholderOnError } = this._props;
    if (!meshAssetId) {
      this._showPlaceholder();
      return;
    }
    const loader = scene.runtime?.context.loader;
    if (!loader) {
      this._showPlaceholder();
      return;
    }
    this._loadProgress = 0;
    try {
      const root = await loader.loadMesh(meshAssetId, {
        onProgress: (p) => {
          if (token === this._loadToken) this._loadProgress = p;
        },
        fallbackOnError: showPlaceholderOnError,
      });
      if (token !== this._loadToken || !this._actor) return;
      this._modelRoot = root;
      this._actor.object3D.add(root);
      this._loadProgress = 1;
    } catch {
      if (token === this._loadToken && showPlaceholderOnError) {
        this._showPlaceholder();
      }
    }
  }

  private _showPlaceholder(): void {
    if (!this._actor) return;
    this._disposeModel();
    const ph = createPlaceholderMesh(this._props.meshAssetId);
    this._modelRoot = ph;
    this._actor.object3D.add(ph);
  }

  private _applyLighting(): void {
    if (!this._actor) return;
    this._disposeLights();
    const profile = getLocalLightProfile(this._props.lightingPreset);
    if (!profile) return;

    const hemi = new THREE.HemisphereLight(
      profile.skyColor,
      profile.groundColor,
      profile.hemiIntensity,
    );
    const key = new THREE.DirectionalLight(profile.keyColor, profile.keyIntensity);
    key.position.copy(profile.keyDirection).multiplyScalar(5);
    const amb = new THREE.AmbientLight(profile.ambientBoost, profile.ambientIntensity);

    for (const light of [hemi, key, amb]) {
      this._actor.object3D.add(light);
      this._lights.push(light);
    }
  }

  private _disposeModel(): void {
    if (this._modelRoot && this._actor) {
      this._actor.object3D.remove(this._modelRoot);
    }
    this._modelRoot = undefined;
  }

  private _disposeLights(): void {
    if (!this._actor) return;
    for (const l of this._lights) {
      this._actor.object3D.remove(l);
    }
    this._lights = [];
  }

  private _disposeControls(): void {
    this._controls?.dispose();
    this._controls = undefined;
  }
}
