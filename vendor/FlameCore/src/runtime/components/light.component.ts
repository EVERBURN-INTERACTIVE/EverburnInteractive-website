import * as THREE from 'three';
import type { RGB, SerializedComponentProps } from '@shared/types';
import { BaseComponent } from '../scene/component';
import type { Actor } from '../scene/actor';
import { configureLightShadows } from '../lighting/shadow-config';
import { QUALITY_PROFILES } from '../quality/quality-manager';

/** Supported light types. */
export type LightKind = 'directional' | 'point' | 'spot' | 'hemisphere' | 'ambient';

/** Serialized light properties. */
export interface LightProps extends SerializedComponentProps {
  readonly _version: 1;
  kind: LightKind;
  color: RGB;
  /** Sky color for hemisphere lights. */
  skyColor: RGB;
  intensity: number;
  /** Distance limit for point/spot lights. */
  distance: number;
  /** Cone angle in radians for spot lights. */
  angle: number;
  penumbra: number;
  decay: number;
  castShadow: boolean;
}

/** True when this light kind can cast shadow maps in Three.js. */
function canCastShadows(kind: LightKind): boolean {
  return kind === 'directional' || kind === 'point' || kind === 'spot';
}

/** Factory for default light props. */
export function makeLightProps(patch: Partial<Omit<LightProps, '_version'>> = {}): LightProps {
  const kind = patch.kind ?? 'directional';
  return {
    _version: 1,
    kind,
    color: patch.color ?? [1, 1, 1],
    skyColor: patch.skyColor ?? [0.5, 0.7, 1],
    intensity: patch.intensity ?? 1.0,
    distance: patch.distance ?? 0,
    angle: patch.angle ?? Math.PI / 6,
    penumbra: patch.penumbra ?? 0.1,
    decay: patch.decay ?? 2,
    // Directional lights cast by default so new scenes get grounded lighting
    // without requiring a manual inspector toggle. Quality profiles can still
    // disable the renderer shadow map entirely on Low.
    castShadow: patch.castShadow ?? canCastShadows(kind),
  };
}

/**
 * Adds a `THREE.Light` to the actor and keeps it in sync with the serialized
 * props. Light kind changes rebuild the underlying Three.js object.
 */
export class LightComponent extends BaseComponent<LightProps> {
  static readonly typeName = 'LightComponent';

  private _light: THREE.Light | undefined;

  /** The Three.js light owned by this component, if attached. */
  get light(): THREE.Light | undefined {
    return this._light;
  }

  onAttach(actor: Actor): void {
    super.onAttach(actor);
    this._build();
  }

  onDetach(): void {
    if (this._light) {
      if (
        this._light instanceof THREE.DirectionalLight ||
        this._light instanceof THREE.SpotLight
      ) {
        this._light.target.removeFromParent();
      }
      this._light.removeFromParent();
      this._light = undefined;
    }
    super.onDetach();
  }

  protected onPropsChanged(): void {
    this._rebuild();
  }

  /** Re-apply shadow-map size / frustum from the active quality profile. */
  syncShadowQuality(): void {
    if (!this._light || !this._props.castShadow || !canCastShadows(this._props.kind)) return;
    configureLightShadows(this._light, this._qualityShadowSettings());
  }

  private _rebuild(): void {
    if (this._light && this._actor) {
      if (
        this._light instanceof THREE.DirectionalLight ||
        this._light instanceof THREE.SpotLight
      ) {
        this._actor.object3D.remove(this._light.target);
      }
      this._actor.object3D.remove(this._light);
      this._light = undefined;
    }
    this._build();
  }

  private _qualityShadowSettings(): { shadowMapSize: number; shadowSoftness: 'none' | 'pcf' | 'pcss' } {
    const qm = this._actor?.scene?.runtime?.context.quality;
    if (qm) return qm.getEffectiveSettings();
    return QUALITY_PROFILES.high;
  }

  private _build(): void {
    if (!this._actor) return;
    const c = new THREE.Color().setRGB(
      this._props.color[0],
      this._props.color[1],
      this._props.color[2],
      THREE.LinearSRGBColorSpace,
    );
    const sky = new THREE.Color().setRGB(
      this._props.skyColor[0],
      this._props.skyColor[1],
      this._props.skyColor[2],
      THREE.LinearSRGBColorSpace,
    );
    let light: THREE.Light;
    switch (this._props.kind) {
      case 'point':
        light = new THREE.PointLight(
          c,
          this._props.intensity,
          this._props.distance,
          this._props.decay,
        );
        break;
      case 'spot':
        light = new THREE.SpotLight(
          c,
          this._props.intensity,
          this._props.distance,
          this._props.angle,
          this._props.penumbra,
          this._props.decay,
        );
        break;
      case 'hemisphere':
        light = new THREE.HemisphereLight(sky, c, this._props.intensity);
        break;
      case 'ambient':
        light = new THREE.AmbientLight(c, this._props.intensity);
        break;
      case 'directional':
      default:
        light = new THREE.DirectionalLight(c, this._props.intensity);
        break;
    }
    const wantsShadow = this._props.castShadow && canCastShadows(this._props.kind);
    light.castShadow = wantsShadow;
    this._actor.object3D.add(light);
    // Directional/spot targets must be in the scene graph or their aim never updates.
    if (light instanceof THREE.SpotLight) {
      // Aim along the actor's local -Y (Three Y-up "down") so an unrotated
      // spot points at the floor/pedestal. Actor rotation still tilts the beam.
      this._actor.object3D.add(light.target);
      light.target.position.set(0, -1, 0);
    } else if (light instanceof THREE.DirectionalLight) {
      this._actor.object3D.add(light.target);
      const wp = new THREE.Vector3();
      this._actor.object3D.getWorldPosition(wp);
      // Directional default: aim at world origin from this light's world position.
      light.target.position.set(-wp.x, -wp.y, -wp.z);
    }
    if (wantsShadow) {
      configureLightShadows(light, this._qualityShadowSettings());
    }
    this._light = light;
  }
}
