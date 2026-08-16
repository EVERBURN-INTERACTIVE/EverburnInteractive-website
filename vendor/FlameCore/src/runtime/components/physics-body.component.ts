import type { SerializedComponentProps } from '@shared/types';
import { BaseComponent } from '../scene/component';
import type { Actor } from '../scene/actor';
import type { System } from '../systems/system';

/** Rigid body type for physics simulation. */
export type PhysicsBodyType = 'static' | 'dynamic' | 'kinematic';

/** Collider shape types. */
export type PhysicsShape = 'box' | 'sphere' | 'capsule' | 'cylinder' | 'convexMesh' | 'plane';

/** Serialized physics body properties. */
export interface PhysicsBodyProps extends SerializedComponentProps {
  readonly _version: 1;
  /** Rigid body type: static = immovable, dynamic = full physics, kinematic = script-controlled. */
  bodyType: PhysicsBodyType;
  /** Collider shape. */
  shape: PhysicsShape;
  /** Half-extents for box shape [x, y, z], or single value for sphere/capsule radius. */
  size: [number, number, number];
  /** Mass in kilograms. Only applies to dynamic bodies. */
  mass: number;
  /** Friction coefficient (0 = frictionless, 1 = high friction). */
  friction: number;
  /** Restitution / bounciness (0 = no bounce, 1 = perfect bounce). */
  restitution: number;
  /** Linear damping. Slows down linear velocity over time. */
  linearDamping: number;
  /** Angular damping. Slows down angular velocity over time. */
  angularDamping: number;
  /** Lock rotation on X axis. */
  lockRotationX: boolean;
  /** Lock rotation on Y axis. */
  lockRotationY: boolean;
  /** Lock rotation on Z axis. */
  lockRotationZ: boolean;
  /** Gravity scale multiplier. 0 = ignore gravity, 1 = normal gravity, <0 = reverse. */
  gravityScale: number;
  /**
   * Collision group membership bitmask (1..0xffff). Two colliders interact
   * only when each one's `collisionLayer` intersects the other's
   * `collisionMask`. Defaults to layer 1. See PRD 4 v2 (collision filtering).
   */
  collisionLayer: number;
  /** Collision filter bitmask: which layers this body collides with. */
  collisionMask: number;
  /**
   * When true the collider is a sensor: it reports overlap via
   * `onTriggerEnter`/`onTriggerExit` events but generates no contact forces.
   */
  isTrigger: boolean;
}

/** Factory for default physics body props. */
export function makePhysicsBodyProps(
  patch: Partial<Omit<PhysicsBodyProps, '_version'>> = {},
): PhysicsBodyProps {
  return {
    _version: 1,
    bodyType: patch.bodyType ?? 'dynamic',
    shape: patch.shape ?? 'box',
    size: patch.size ?? [1, 1, 1],
    mass: patch.mass ?? 1,
    friction: patch.friction ?? 0.5,
    restitution: patch.restitution ?? 0,
    linearDamping: patch.linearDamping ?? 0.01,
    angularDamping: patch.angularDamping ?? 0.05,
    lockRotationX: patch.lockRotationX ?? false,
    lockRotationY: patch.lockRotationY ?? false,
    lockRotationZ: patch.lockRotationZ ?? false,
    gravityScale: patch.gravityScale ?? 1,
    collisionLayer: patch.collisionLayer ?? 1,
    collisionMask: patch.collisionMask ?? 0xffff,
    isTrigger: patch.isTrigger ?? false,
  };
}

interface PhysicsSystemApi extends System {
  applyImpulse(component: PhysicsBodyComponent, x: number, y: number, z: number): void;
  applyForce(component: PhysicsBodyComponent, x: number, y: number, z: number): void;
  applyTorqueImpulse(component: PhysicsBodyComponent, x: number, y: number, z: number): void;
  getLinearVelocity(component: PhysicsBodyComponent): [number, number, number];
  setLinearVelocity(component: PhysicsBodyComponent, x: number, y: number, z: number): void;
  getAngularVelocity(component: PhysicsBodyComponent): [number, number, number];
  setAngularVelocity(component: PhysicsBodyComponent, x: number, y: number, z: number): void;
}

/**
 * Adds a Rapier3D physics body and collider to an actor. The PhysicsSystem
 * owns the Rapier World and synchronizes transforms each fixed timestep.
 *
 * The physics body is created when the PhysicsSystem is active and the actor
 * is in the scene. Changing props will recreate the body and collider.
 */
export class PhysicsBodyComponent extends BaseComponent<PhysicsBodyProps> {
  static readonly typeName = 'PhysicsBodyComponent';

  /** Opaque handle to the Rapier RigidBody. Managed by PhysicsSystem. @internal */
  _bodyHandle: number | undefined;

  /** Opaque handle to the Rapier Collider. Managed by PhysicsSystem. @internal */
  _colliderHandle: number | undefined;

  constructor(props: PhysicsBodyProps) {
    // Backfill v2 collision/trigger fields for projects serialized before
    // they existed, so older `.flame` files load without errors.
    super(makePhysicsBodyProps(props));
  }

  onAttach(actor: Actor): void {
    super.onAttach(actor);
    // PhysicsSystem will create the body/collider when the actor enters a scene.
  }

  onDetach(): void {
    // PhysicsSystem will destroy the body/collider when the actor leaves a scene.
    super.onDetach();
  }

  protected onPropsChanged(): void {
    // When props change, PhysicsSystem must rebuild the body/collider.
    // We flag this by clearing the handles. PhysicsSystem checks for this.
    this._bodyHandle = undefined;
    this._colliderHandle = undefined;
  }

  /** Apply an impulse at the body's center of mass. Only works for dynamic bodies. */
  applyImpulse(x: number, y: number, z: number): void {
    this._physicsSystem()?.applyImpulse(this, x, y, z);
  }

  /** Apply a force at the body's center of mass. Only works for dynamic bodies. */
  applyForce(x: number, y: number, z: number): void {
    this._physicsSystem()?.applyForce(this, x, y, z);
  }

  /** Apply a torque impulse to the body. Only works for dynamic bodies. */
  applyTorqueImpulse(x: number, y: number, z: number): void {
    this._physicsSystem()?.applyTorqueImpulse(this, x, y, z);
  }

  /** Get the linear velocity of the body. Returns [0,0,0] if not dynamic. */
  getLinearVelocity(): [number, number, number] {
    return this._physicsSystem()?.getLinearVelocity(this) ?? [0, 0, 0];
  }

  /** Set the linear velocity of the body. Only works for dynamic bodies. */
  setLinearVelocity(x: number, y: number, z: number): void {
    this._physicsSystem()?.setLinearVelocity(this, x, y, z);
  }

  /** Get the angular velocity of the body. Returns [0,0,0] if not dynamic. */
  getAngularVelocity(): [number, number, number] {
    return this._physicsSystem()?.getAngularVelocity(this) ?? [0, 0, 0];
  }

  /** Set the angular velocity of the body. Only works for dynamic bodies. */
  setAngularVelocity(x: number, y: number, z: number): void {
    this._physicsSystem()?.setAngularVelocity(this, x, y, z);
  }

  private _physicsSystem(): PhysicsSystemApi | undefined {
    return this._actor?.scene?.runtime?.systems.find(isPhysicsSystem);
  }
}

function isPhysicsSystem(system: System): system is PhysicsSystemApi {
  return system.name === 'PhysicsSystem';
}
