import type { Actor } from '../scene/actor';
import { EventEmitter } from '../utils/events';

/**
 * High-level physics event names dispatched to actors (via
 * `Actor.dispatchEvent`) and broadcast on the {@link PhysicsEventBus}.
 *
 * Solid bodies generate `collision*` events; sensor bodies (those whose
 * {@link PhysicsBodyComponent} has `isTrigger: true`) generate `trigger*`
 * events. See PRD 4 v2 (collision & trigger events).
 */
export type PhysicsEventName =
  | 'onCollisionEnter'
  | 'onCollisionStay'
  | 'onCollisionExit'
  | 'onTriggerEnter'
  | 'onTriggerExit';

/** Payload delivered with every physics collision/trigger event. */
export interface PhysicsContactPayload {
  /** The actor receiving the event. */
  readonly self: Actor;
  /** The other actor involved in the contact/overlap. */
  readonly other: Actor;
}

/** Event map for the {@link PhysicsEventBus}. */
export interface PhysicsBusEvents {
  onCollisionEnter: PhysicsContactPayload;
  onCollisionStay: PhysicsContactPayload;
  onCollisionExit: PhysicsContactPayload;
  onTriggerEnter: PhysicsContactPayload;
  onTriggerExit: PhysicsContactPayload;
}

/**
 * Internal channel through which the {@link PhysicsSystem} dispatches
 * collision and trigger events. Advanced systems (e.g. the ParticleSystem's
 * future `SpawnOnCollision` module) can subscribe here without coupling to
 * Rapier internals.
 */
export class PhysicsEventBus extends EventEmitter<PhysicsBusEvents> {}

/** Detailed result of a physics raycast query. See PRD 4 v2 (queries). */
export interface RaycastHit {
  /** The actor owning the hit collider. */
  readonly actor: Actor;
  /** Distance from the ray origin to the hit point, in world units. */
  readonly distance: number;
  /** World-space hit point. */
  readonly point: readonly [number, number, number];
  /** World-space surface normal at the hit point. */
  readonly normal: readonly [number, number, number];
}

/** Snapshot of physics simulation statistics for the performance overlay. */
export interface PhysicsStats {
  /** Number of rigid bodies in the world. */
  readonly bodies: number;
  /** Number of colliders in the world. */
  readonly colliders: number;
  /** Number of active joints/constraints. */
  readonly constraints: number;
  /** Wall-clock time of the last `world.step()` batch, in milliseconds. */
  readonly stepTimeMs: number;
}
