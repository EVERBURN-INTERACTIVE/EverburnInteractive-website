/**
 * Hinge articulation — drives transform rotation from a normalized progress value.
 * @module @runtime/components/articulation
 */

import type { ArticulationAxis, ArticulationProps } from '@shared/types/articulation';
import * as THREE from 'three';
import { BaseComponent } from '../scene/component';
import { TransformComponent } from './transform.component';

const DEG2RAD = Math.PI / 180;

/** Factory for default articulation props. */
export function makeArticulationProps(
  patch: Partial<Omit<ArticulationProps, '_version'>> = {},
): ArticulationProps {
  return {
    _version: 1,
    progress: patch.progress ?? 0,
    axis: patch.axis ?? 'x',
    minAngleDeg: patch.minAngleDeg ?? 0,
    maxAngleDeg: patch.maxAngleDeg ?? -110,
    restRotation: patch.restRotation ?? [0, 0, 0],
    restPosition: patch.restPosition ?? [0, 0, 0],
    pivotOffset: patch.pivotOffset ?? [0, 0, 0],
  };
}

/**
 * ArticulationComponent maps `progress` in `[0, 1]` to a hinge angle and writes
 * the result onto the actor's {@link TransformComponent}. Animate `progress`
 * from the timeline, a state machine, or {@link ArticulationDriverComponent}.
 */
export class ArticulationComponent extends BaseComponent<ArticulationProps> {
  static readonly typeName = 'ArticulationComponent';

  /** Capture the current transform as the closed-pose rest pose. */
  captureRestPose(): void {
    const transform = this.actor?.getComponent(TransformComponent);
    if (!transform) return;
    this.setProps({
      ...this._props,
      restRotation: [...transform.props.rotation] as [number, number, number],
      restPosition: [...transform.props.position] as [number, number, number],
    });
  }

  /** @deprecated Use {@link captureRestPose}. */
  captureRestRotation(): void {
    this.captureRestPose();
  }

  onAttach(actor: Parameters<BaseComponent<ArticulationProps>['onAttach']>[0]): void {
    super.onAttach(actor);
    this._apply();
  }

  protected onPropsChanged(): void {
    this._apply();
  }

  onUpdate(_dt: number): void {
    this._apply();
  }

  private _apply(): void {
    const transform = this.actor?.getComponent(TransformComponent);
    if (!transform) return;

    const t = clamp01(this._props.progress);
    const minRad = this._props.minAngleDeg * DEG2RAD;
    const maxRad = this._props.maxAngleDeg * DEG2RAD;
    const angle = minRad + (maxRad - minRad) * t;

    const axisIndex = axisIndexFor(this._props.axis);
    const axisVec = new THREE.Vector3(
      axisIndex === 0 ? 1 : 0,
      axisIndex === 1 ? 1 : 0,
      axisIndex === 2 ? 1 : 0,
    );

    const hingeQuat = new THREE.Quaternion().setFromAxisAngle(axisVec, angle);
    const restEuler = new THREE.Euler(
      this._props.restRotation[0],
      this._props.restRotation[1],
      this._props.restRotation[2],
      'XYZ',
    );
    const restQuat = new THREE.Quaternion().setFromEuler(restEuler);
    const finalQuat = hingeQuat.multiply(restQuat);
    const finalEuler = new THREE.Euler().setFromQuaternion(finalQuat, 'XYZ');

    const pivot = new THREE.Vector3(
      this._props.pivotOffset[0],
      this._props.pivotOffset[1],
      this._props.pivotOffset[2],
    );
    const restPos = new THREE.Vector3(
      this._props.restPosition[0],
      this._props.restPosition[1],
      this._props.restPosition[2],
    );
    const pivotDelta = pivot.clone().applyQuaternion(hingeQuat).sub(pivot);
    const finalPos = restPos.add(pivotDelta);

    transform.setProps({
      position: [finalPos.x, finalPos.y, finalPos.z],
      rotation: [finalEuler.x, finalEuler.y, finalEuler.z],
    });
  }
}

function axisIndexFor(axis: ArticulationAxis): 0 | 1 | 2 {
  switch (axis) {
    case 'x':
      return 0;
    case 'y':
      return 1;
    case 'z':
      return 2;
  }
}

function clamp01(v: number): number {
  return Math.max(0, Math.min(1, v));
}
