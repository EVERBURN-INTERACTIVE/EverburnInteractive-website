import * as THREE from 'three';
import type { RGB, SerializedComponentProps } from '@shared/types';
import { BaseComponent } from '../scene/component';
import type { Actor } from '../scene/actor';

export interface WeaponTrailProps extends SerializedComponentProps {
  readonly _version: 1;
  enabled: boolean;
  maxPoints: number;
  width: number;
  color: RGB;
  fadeSpeed: number;
  emissiveIntensity: number;
}

export function makeWeaponTrailProps(
  patch: Partial<Omit<WeaponTrailProps, '_version'>> = {},
): WeaponTrailProps {
  return {
    _version: 1,
    enabled: patch.enabled ?? false,
    maxPoints: patch.maxPoints ?? 32,
    width: patch.width ?? 0.1,
    color: patch.color ?? [1, 0.8, 0.2],
    fadeSpeed: patch.fadeSpeed ?? 2,
    emissiveIntensity: patch.emissiveIntensity ?? 1.5,
  };
}

export class WeaponTrailComponent extends BaseComponent<WeaponTrailProps> {
  static readonly typeName = 'WeaponTrailComponent';

  private _mesh: THREE.Mesh | undefined;
  private _geometry: THREE.BufferGeometry | undefined;
  private _positions: THREE.Vector3[] = [];
  private _writeIndex = 0;
  private _pointCount = 0;

  onAttach(actor: Actor): void {
    super.onAttach(actor);
    const capacity = Math.max(4, this._props.maxPoints);
    this._geometry = new THREE.BufferGeometry();
    const vertexCount = capacity * 2;
    this._geometry.setAttribute(
      'position',
      new THREE.BufferAttribute(new Float32Array(vertexCount * 3), 3),
    );
    this._geometry.setAttribute(
      'color',
      new THREE.BufferAttribute(new Float32Array(vertexCount * 3), 3),
    );
    const material = new THREE.MeshBasicMaterial({
      vertexColors: true,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
    this._mesh = new THREE.Mesh(this._geometry, material);
    this._mesh.visible = false;
    this._mesh.frustumCulled = false;
    actor.object3D.add(this._mesh);
    this._disposables.push(this._geometry, material);
  }

  onDetach(): void {
    if (this._mesh) {
      this._mesh.removeFromParent();
      this._mesh = undefined;
    }
    this._geometry = undefined;
    super.onDetach();
  }

  onUpdate(_dt: number): void {
    if (!this._mesh || !this._geometry || !this._actor) return;
    if (!this._props.enabled) {
      this._mesh.visible = false;
      this._positions = [];
      this._pointCount = 0;
      this._writeIndex = 0;
      return;
    }

    this._mesh.visible = true;
    const world = new THREE.Vector3();
    this._actor.object3D.getWorldPosition(world);

    if (this._positions.length < this._props.maxPoints) {
      this._positions.push(world.clone());
      this._pointCount = this._positions.length;
    } else {
      this._positions[this._writeIndex].copy(world);
      this._writeIndex = (this._writeIndex + 1) % this._props.maxPoints;
      this._pointCount = this._props.maxPoints;
    }

    this._uploadRibbon();
  }

  protected onPropsChanged(): void {
    if (!this._props.enabled && this._mesh) {
      this._mesh.visible = false;
      this._positions = [];
      this._pointCount = 0;
    }
  }

  private _uploadRibbon(): void {
    if (!this._geometry || this._pointCount < 2) return;
    const posAttr = this._geometry.getAttribute('position') as THREE.BufferAttribute;
    const colAttr = this._geometry.getAttribute('color') as THREE.BufferAttribute;
    const halfW = this._props.width * 0.5;
    const [cr, cg, cb] = this._props.color;
    const intensity = this._props.emissiveIntensity;

    let vtx = 0;
    for (let i = 0; i < this._pointCount - 1; i++) {
      const a = this._samplePoint(i);
      const b = this._samplePoint(i + 1);
      const dir = b.clone().sub(a);
      if (dir.lengthSq() < 1e-8) continue;
      dir.normalize();
      const side = new THREE.Vector3(-dir.y, dir.x, -dir.z).normalize().multiplyScalar(halfW);
      if (side.lengthSq() < 1e-8) side.set(halfW, 0, 0);

      const fadeA = 1 - i / Math.max(1, this._pointCount - 1);
      const fadeB = 1 - (i + 1) / Math.max(1, this._pointCount - 1);

      const corners = [
        a.clone().add(side),
        a.clone().sub(side),
        b.clone().add(side),
        b.clone().sub(side),
      ];
      const fades = [fadeA, fadeA, fadeB, fadeB];
      for (let c = 0; c < 4; c++) {
        const p = corners[c];
        const fade = fades[c];
        posAttr.setXYZ(vtx, p.x, p.y, p.z);
        colAttr.setXYZ(vtx, cr * intensity * fade, cg * intensity * fade, cb * intensity * fade);
        vtx++;
      }
    }

    posAttr.needsUpdate = true;
    colAttr.needsUpdate = true;
    this._geometry.setDrawRange(0, vtx);
  }

  private _samplePoint(offsetFromOldest: number): THREE.Vector3 {
    if (this._positions.length < this._props.maxPoints) {
      return this._positions[offsetFromOldest];
    }
    const idx = (this._writeIndex + offsetFromOldest) % this._props.maxPoints;
    return this._positions[idx];
  }
}
