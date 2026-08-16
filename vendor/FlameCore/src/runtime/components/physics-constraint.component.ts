import type { SerializedComponentProps } from '@shared/types';
import type { Vec3 } from '@shared/types';
import { BaseComponent } from '../scene/component';

/** Joint type linking two physics bodies. */
export type PhysicsConstraintType = 'fixed' | 'hinge' | 'slider';

/** Serialized {@link PhysicsConstraintComponent} properties (v1). */
export interface PhysicsConstraintProps extends SerializedComponentProps {
  readonly _version: 1;
  /** Actor id of the first body (the anchor). Empty = this actor. */
  bodyA: string;
  /** Actor id of the second body. */
  bodyB: string;
  /** Joint kind. */
  type: PhysicsConstraintType;
  /** Anchor point on body A, in A's local space. */
  anchorA: Vec3;
  /** Anchor point on body B, in B's local space. */
  anchorB: Vec3;
  /** Axis for hinge/slider joints (normalized). */
  axis: Vec3;
  /** Whether to enforce motion limits. */
  enableLimits: boolean;
  /** Lower/upper limits (radians for hinge, metres for slider). */
  limitMin: number;
  limitMax: number;
}

/** Default props factory for {@link PhysicsConstraintComponent}. */
export function makePhysicsConstraintProps(
  patch: Partial<Omit<PhysicsConstraintProps, '_version'>> = {},
): PhysicsConstraintProps {
  return {
    _version: 1,
    bodyA: patch.bodyA ?? '',
    bodyB: patch.bodyB ?? '',
    type: patch.type ?? 'fixed',
    anchorA: patch.anchorA ?? [0, 0, 0],
    anchorB: patch.anchorB ?? [0, 0, 0],
    axis: patch.axis ?? [0, 1, 0],
    enableLimits: patch.enableLimits ?? false,
    limitMin: patch.limitMin ?? -Math.PI,
    limitMax: patch.limitMax ?? Math.PI,
  };
}

/**
 * Declares a physics joint between two actors that own
 * {@link PhysicsBodyComponent}s. The {@link PhysicsSystem} reads this
 * component each frame and creates, updates, or removes the corresponding
 * Rapier joint. When `bodyA` is empty the component's own actor is used as
 * body A. See PRD 4 v2 (constraints & joints).
 */
export class PhysicsConstraintComponent extends BaseComponent<PhysicsConstraintProps> {
  static readonly typeName = 'PhysicsConstraintComponent';

  /** Opaque handle to the Rapier joint. Managed by PhysicsSystem. @internal */
  _jointHandle: number | undefined;

  /**
   * Joint handle queued for removal on the next physics sync when props
   * change. Prevents orphaned Rapier joints. @internal
   */
  _pendingJointRemoval: number | undefined;

  protected onPropsChanged(): void {
    if (this._jointHandle !== undefined) {
      this._pendingJointRemoval = this._jointHandle;
      this._jointHandle = undefined;
    }
  }
}
