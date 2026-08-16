import type { Euler3, SerializedComponentProps, Vec3 } from '@shared/types';
import { BaseComponent } from '../scene/component';
import type { Actor } from '../scene/actor';

/** Serialized transform properties. */
export interface TransformProps extends SerializedComponentProps {
  readonly _version: 1;
  position: Vec3;
  rotation: Euler3;
  scale: Vec3;
}

/** Convenience factory for default transform props. */
export function makeTransformProps(patch: Partial<Omit<TransformProps, '_version'>> = {}): TransformProps {
  return {
    _version: 1,
    position: patch.position ?? [0, 0, 0],
    rotation: patch.rotation ?? [0, 0, 0],
    scale: patch.scale ?? [1, 1, 1],
  };
}

/**
 * The TransformComponent writes position/rotation/scale into the actor's
 * shared `THREE.Object3D`. Most actors should have exactly one of these.
 */
export class TransformComponent extends BaseComponent<TransformProps> {
  static readonly typeName = 'TransformComponent';

  onAttach(actor: Actor): void {
    super.onAttach(actor);
    this._apply();
  }

  protected onPropsChanged(): void {
    this._apply();
  }

  /** Convenience setter that updates only the position. */
  setPosition(x: number, y: number, z: number): void {
    this.setProps({ position: [x, y, z] });
  }

  private _apply(): void {
    if (!this._actor) return;
    const o = this._actor.object3D;
    const { position, rotation, scale } = this._props;
    o.position.set(position[0], position[1], position[2]);
    o.rotation.set(rotation[0], rotation[1], rotation[2]);
    o.scale.set(scale[0], scale[1], scale[2]);
  }
}
