import * as THREE from 'three';
import type { SerializedComponentProps } from '@shared/types';
import { BaseComponent } from '../scene/component';
import type { Actor } from '../scene/actor';
import { MeshRendererComponent } from './mesh-renderer.component';

export type MaskWipeShape = 'circle' | 'rectangle' | 'diagonal-left' | 'diagonal-right';

export interface MaskWipeProps extends SerializedComponentProps {
  readonly _version: 1;
  progress: number;
  shape: MaskWipeShape;
  softness: number;
}

export function makeMaskWipeProps(
  patch: Partial<Omit<MaskWipeProps, '_version'>> = {},
): MaskWipeProps {
  return {
    _version: 1,
    progress: patch.progress ?? 1,
    shape: patch.shape ?? 'circle',
    softness: patch.softness ?? 0.05,
  };
}

export class MaskWipeComponent extends BaseComponent<MaskWipeProps> {
  static readonly typeName = 'MaskWipeComponent';

  private _meshRenderer: MeshRendererComponent | undefined;
  private _originalMaterial: THREE.Material | undefined;
  private _maskMaterial: THREE.ShaderMaterial | undefined;

  onAttach(actor: Actor): void {
    super.onAttach(actor);
    this._meshRenderer = actor.getComponent(MeshRendererComponent);
    this._rebuildMaterial();
  }

  onDetach(): void {
    this._restoreMaterial();
    super.onDetach();
  }

  protected onPropsChanged(): void {
    this._patchUniforms();
  }

  private _rebuildMaterial(): void {
    const mesh = this._meshRenderer?.mesh;
    if (!mesh) return;
    if (!this._originalMaterial) {
      const mat = mesh.material;
      this._originalMaterial = Array.isArray(mat) ? mat[0] : mat;
    }

    if (!this._maskMaterial) {
      this._maskMaterial = new THREE.ShaderMaterial({
        uniforms: {
          map: { value: (mesh.material as THREE.MeshStandardMaterial).map ?? null },
          progress: { value: this._props.progress },
          softness: { value: this._props.softness },
          shapeMode: { value: this._shapeMode(this._props.shape) },
          baseColor: {
            value: new THREE.Color(
              this._meshRenderer?.props.color[0] ?? 1,
              this._meshRenderer?.props.color[1] ?? 1,
              this._meshRenderer?.props.color[2] ?? 1,
            ),
          },
        },
        vertexShader: /* glsl */ `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: /* glsl */ `
          uniform sampler2D map;
          uniform float progress;
          uniform float softness;
          uniform float shapeMode;
          uniform vec3 baseColor;
          varying vec2 vUv;

          void main() {
            vec4 tex = texture2D(map, vUv);
            vec3 rgb = tex.a > 0.001 ? tex.rgb : baseColor;
            float alpha = tex.a > 0.001 ? tex.a : 1.0;
            float mask = 1.0;
            if (shapeMode < 0.5) {
              float dist = length(vUv - 0.5) * 2.0;
              mask = smoothstep(progress + softness, progress - softness, dist);
            } else if (shapeMode < 1.5) {
              float mx = smoothstep(progress + softness, progress - softness, abs(vUv.x - 0.5) * 2.0);
              float my = smoothstep(progress + softness, progress - softness, abs(vUv.y - 0.5) * 2.0);
              mask = mx * my;
            } else if (shapeMode < 2.5) {
              float d = vUv.x + vUv.y;
              mask = smoothstep(progress * 2.0 - softness, progress * 2.0 + softness, d);
            } else {
              float d = (1.0 - vUv.x) + vUv.y;
              mask = smoothstep(progress * 2.0 - softness, progress * 2.0 + softness, d);
            }
            gl_FragColor = vec4(rgb, alpha * mask);
          }
        `,
        transparent: true,
        side: THREE.DoubleSide,
      });
      this._disposables.push(this._maskMaterial);
    }

    mesh.material = this._maskMaterial;
    this._patchUniforms();
  }

  private _shapeMode(shape: MaskWipeShape): number {
    switch (shape) {
      case 'rectangle':
        return 1;
      case 'diagonal-left':
        return 2;
      case 'diagonal-right':
        return 3;
      case 'circle':
      default:
        return 0;
    }
  }

  private _patchUniforms(): void {
    if (!this._maskMaterial) return;
    this._maskMaterial.uniforms.progress.value = this._props.progress;
    this._maskMaterial.uniforms.softness.value = this._props.softness;
    this._maskMaterial.uniforms.shapeMode.value = this._shapeMode(this._props.shape);
  }

  private _restoreMaterial(): void {
    const mesh = this._meshRenderer?.mesh;
    if (mesh && this._originalMaterial) mesh.material = this._originalMaterial;
    this._originalMaterial = undefined;
  }
}
