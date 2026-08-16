import * as THREE from 'three';
import type { RGB, SerializedComponentProps } from '@shared/types';
import { BaseComponent } from '../scene/component';
import type { Actor } from '../scene/actor';
import { MeshRendererComponent } from './mesh-renderer.component';
import { createHologramMaterial } from '../shaders/hologram.material';
import { createEnergyShieldMaterial } from '../shaders/energy-shield.material';
import { createPortalMaterial } from '../shaders/portal.material';

export type ShaderEffectKind = 'hologram' | 'energy-shield' | 'portal' | 'none';

export interface ShaderEffectProps extends SerializedComponentProps {
  readonly _version: 1;
  effect: ShaderEffectKind;
  color?: RGB;
  speed?: number;
  intensity?: number;
  scanlineSpeed?: number;
  flickerSpeed?: number;
  hexScale?: number;
  noiseScale?: number;
}

export function makeShaderEffectProps(
  patch: Partial<Omit<ShaderEffectProps, '_version'>> = {},
): ShaderEffectProps {
  const out: ShaderEffectProps = {
    _version: 1,
    effect: patch.effect ?? 'none',
    speed: patch.speed ?? 1,
    intensity: patch.intensity ?? 1,
    scanlineSpeed: patch.scanlineSpeed ?? 1,
    flickerSpeed: patch.flickerSpeed ?? 3,
    hexScale: patch.hexScale ?? 8,
    noiseScale: patch.noiseScale ?? 3,
  };
  if (patch.color) out.color = patch.color;
  return out;
}

export class ShaderEffectComponent extends BaseComponent<ShaderEffectProps> {
  static readonly typeName = 'ShaderEffectComponent';

  private _meshRenderer: MeshRendererComponent | undefined;
  private _originalMaterial: THREE.Material | undefined;
  private _shaderMaterial: THREE.ShaderMaterial | undefined;
  private _time = 0;

  onAttach(actor: Actor): void {
    super.onAttach(actor);
    this._meshRenderer = actor.getComponent(MeshRendererComponent);
    this._applyEffect();
  }

  onDetach(): void {
    this._restoreMaterial();
    super.onDetach();
  }

  onUpdate(dt: number): void {
    if (this._props.effect === 'none' || !this._shaderMaterial) return;
    this._time += dt * (this._props.speed ?? 1);
    this._shaderMaterial.uniforms.time.value = this._time;
  }

  protected onPropsChanged(): void {
    this._applyEffect();
  }

  private _applyEffect(): void {
    const mesh = this._meshRenderer?.mesh;
    if (!mesh) return;

    if (this._props.effect === 'none') {
      this._restoreMaterial();
      return;
    }

    if (!this._originalMaterial) {
      const mat = mesh.material;
      this._originalMaterial = Array.isArray(mat) ? mat[0] : mat;
    }

    const color = new THREE.Color(
      this._props.color?.[0] ?? 0,
      this._props.color?.[1] ?? 1,
      this._props.color?.[2] ?? 1,
    );

    if (!this._shaderMaterial || this._shaderMaterial.userData.effect !== this._props.effect) {
      this._shaderMaterial?.dispose();
      this._shaderMaterial =
        this._props.effect === 'hologram'
          ? createHologramMaterial({
              color,
              scanlineSpeed: this._props.scanlineSpeed,
              flickerSpeed: this._props.flickerSpeed,
            })
          : this._props.effect === 'energy-shield'
            ? createEnergyShieldMaterial({ color, hexScale: this._props.hexScale })
            : createPortalMaterial({ noiseScale: this._props.noiseScale });
      this._shaderMaterial.userData.effect = this._props.effect;
      this._disposables.push(this._shaderMaterial);
    }

    if (this._shaderMaterial.uniforms.opacity) {
      this._shaderMaterial.uniforms.opacity.value = this._props.intensity ?? 1;
    }
    if (this._shaderMaterial.uniforms.color) {
      this._shaderMaterial.uniforms.color.value = color;
    }

    mesh.material = this._shaderMaterial;
  }

  private _restoreMaterial(): void {
    const mesh = this._meshRenderer?.mesh;
    if (mesh && this._originalMaterial) {
      mesh.material = this._originalMaterial;
    }
    this._originalMaterial = undefined;
  }
}
