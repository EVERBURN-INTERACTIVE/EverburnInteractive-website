/**
 * Reusable hero section: page height, particles, camera drift, entrance.
 * @module @runtime/components/hero
 */

import * as THREE from 'three';
import type { HeroProps } from '@shared/types/scroll';
import { BaseComponent } from '../scene/component';
import type { Scene } from '../scene/scene';
import { CameraComponent } from './camera.component';
import { ParticleSystemComponent, makeParticleSystemProps } from './particle-system.component';

/** Factory for default hero props. */
export function makeHeroProps(
  patch: Partial<Omit<HeroProps, '_version'>> = {},
): HeroProps {
  const out: HeroProps = {
    _version: 1,
    cameraDriftEnabled: patch.cameraDriftEnabled ?? true,
    cameraDriftAmplitude: patch.cameraDriftAmplitude ?? 0.15,
    cameraDriftSpeed: patch.cameraDriftSpeed ?? 0.4,
    scrollHeightPx: patch.scrollHeightPx ?? 3000,
    applyPageHeight: patch.applyPageHeight ?? true,
    entranceDuration: patch.entranceDuration ?? 1.2,
  };
  if (patch.particleAssetId) out.particleAssetId = patch.particleAssetId;
  return out;
}

/**
 * HeroComponent sets up a scrollable hero section with optional particle
 * background, ambient camera drift, and a fade-in entrance animation on
 * child actors.
 */
export class HeroComponent extends BaseComponent<HeroProps> {
  static readonly typeName = 'HeroComponent';

  private _scene: Scene | undefined;
  private _previousMinHeight: string | undefined;
  private _appliedHeight = false;
  private _time = 0;
  private _entranceProgress = 0;
  private _baseCameraPos: [number, number, number] | undefined;

  onSceneAttach(scene: Scene): void {
    super.onSceneAttach(scene);
    this._scene = scene;
    this._applyPageHeight();
    this._setupParticles();
    this._captureCameraBase();
  }

  onSceneDetach(scene: Scene): void {
    this._restorePageHeight();
    this._scene = undefined;
    super.onSceneDetach(scene);
  }

  onDetach(): void {
    this._restorePageHeight();
    super.onDetach();
  }

  onUpdate(dt: number): void {
    this._time += dt;
    if (this._entranceProgress < 1) {
      this._entranceProgress = Math.min(
        1,
        this._entranceProgress + dt / Math.max(0.01, this._props.entranceDuration),
      );
      this._applyEntrance();
    }
    if (this._props.cameraDriftEnabled) {
      this._applyCameraDrift();
    }
  }

  protected onPropsChanged(): void {
    this._applyPageHeight();
  }

  private _setupParticles(): void {
    if (!this._actor || !this._props.particleAssetId) return;
    let comp = this._actor.getComponent(ParticleSystemComponent);
    if (!comp) {
      comp = new ParticleSystemComponent(
        makeParticleSystemProps({
          particleSystemAssetId: this._props.particleAssetId,
          autoPlay: true,
        }),
      );
      this._actor.addComponent(comp);
    }
  }

  private _captureCameraBase(): void {
    const cam = this._resolveMainCamera();
    if (!cam) return;
    this._baseCameraPos = [cam.position.x, cam.position.y, cam.position.z];
  }

  private _applyCameraDrift(): void {
    const cam = this._resolveMainCamera();
    if (!cam || !this._baseCameraPos) return;
    const { cameraDriftAmplitude: amp, cameraDriftSpeed: speed } = this._props;
    cam.position.x = this._baseCameraPos[0] + Math.sin(this._time * speed) * amp;
    cam.position.y = this._baseCameraPos[1] + Math.cos(this._time * speed * 0.7) * amp * 0.5;
  }

  private _applyEntrance(): void {
    if (!this._actor) return;
    const t = easeOutCubic(this._entranceProgress);
    for (const child of this._actor.children) {
      child.object3D.scale.setScalar(0.8 + 0.2 * t);
    }
  }

  private _resolveMainCamera(): THREE.PerspectiveCamera | undefined {
    if (!this._scene) return undefined;
    const id = this._scene.mainCameraActorId;
    if (!id) return undefined;
    const cam = this._scene.findActorById(id)?.getComponent(CameraComponent)?.camera;
    return cam instanceof THREE.PerspectiveCamera ? cam : undefined;
  }

  private _applyPageHeight(): void {
    if (typeof document === 'undefined' || !document.body) return;
    const { applyPageHeight, scrollHeightPx } = this._props;
    if (!applyPageHeight || scrollHeightPx <= 0) {
      this._restorePageHeight();
      return;
    }
    if (!this._appliedHeight) {
      this._previousMinHeight = document.body.style.minHeight;
      this._appliedHeight = true;
    }
    document.body.style.minHeight = `${Math.round(scrollHeightPx)}px`;
  }

  private _restorePageHeight(): void {
    if (!this._appliedHeight || typeof document === 'undefined' || !document.body) return;
    document.body.style.minHeight = this._previousMinHeight ?? '';
    this._appliedHeight = false;
  }
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}
