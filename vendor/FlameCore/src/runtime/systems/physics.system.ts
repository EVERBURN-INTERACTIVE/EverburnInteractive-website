import * as THREE from 'three';
import { SystemPriority } from '@shared/types';
import type { PhysicsBodyComponent } from '../components/physics-body.component';
import type { PhysicsConstraintComponent } from '../components/physics-constraint.component';
import { MeshRendererComponent } from '../components/mesh-renderer.component';
import type { Runtime } from '../runtime';
import type { Scene } from '../scene';
import type { Actor } from '../scene/actor';
import type { System } from './system';
import {
  PhysicsEventBus,
  type PhysicsEventName,
  type PhysicsStats,
  type RaycastHit,
} from './physics-events';

/**
 * Rapier WASM module. Lazily loaded via dynamic import when physics is first needed.
 * @internal
 */
let RAPIER: typeof import('@dimforge/rapier3d-compat') | undefined;

/**
 * Load the Rapier3D WASM module. Safe to call multiple times; only loads once.
 * @internal
 */
async function loadRapier(): Promise<typeof import('@dimforge/rapier3d-compat')> {
  if (RAPIER) return RAPIER;
  const module = await import('@dimforge/rapier3d-compat');
  await module.init();
  RAPIER = module;
  return RAPIER;
}

/**
 * The PhysicsSystem manages the Rapier3D physics world and synchronizes it
 * with the runtime scene graph. It runs at a fixed timestep (60 Hz by default),
 * decoupled from the render framerate.
 *
 * Physics WASM is loaded lazily when the first {@link PhysicsBodyComponent} is
 * detected. If no physics bodies exist, the system remains dormant and WASM is
 * never loaded.
 */
export class PhysicsSystem implements System {
  readonly name = 'PhysicsSystem';
  readonly priority = SystemPriority.PHYSICS;

  private _runtime: Runtime | undefined;
  private _world: import('@dimforge/rapier3d-compat').World | undefined;
  private _rapier: typeof import('@dimforge/rapier3d-compat') | undefined;
  private _loaded = false;
  private _loading = false;
  private _accumulator = 0;
  /** Fixed simulation step (seconds). Defaults to 60 Hz; adaptive perf may lower this. */
  private _fixedDt = 1 / 60;
  private _debugEnabled = false;
  private _debugLines: THREE.LineSegments | undefined;

  /** Rapier event queue, created alongside the world. @internal */
  private _eventQueue: import('@dimforge/rapier3d-compat').EventQueue | undefined;

  /** Public bus for collision/trigger events. See PRD 4 v2. */
  readonly events = new PhysicsEventBus();

  /** Pairs currently in contact, keyed `min:max` of collider handles. @internal */
  private readonly _activePairs = new Map<string, { a: number; b: number; trigger: boolean }>();

  /** Last-known simulation statistics. @internal */
  private _stats: PhysicsStats = { bodies: 0, colliders: 0, constraints: 0, stepTimeMs: 0 };

  /** Enable or disable physics debug visualization (wireframe colliders). */
  set debugEnabled(value: boolean) {
    this._debugEnabled = value;
    if (!value && this._debugLines) {
      this._debugLines.parent?.remove(this._debugLines);
      this._debugLines.geometry.dispose();
      (this._debugLines.material as THREE.Material).dispose();
      this._debugLines = undefined;
    }
  }

  get debugEnabled(): boolean {
    return this._debugEnabled;
  }

  /**
   * Set physics simulation rate in Hz (clamped 15–120). Adaptive performance
   * uses this to shed main-thread work when the frame budget is exceeded.
   */
  setSimulationRateHz(hz: number): void {
    const clamped = Math.min(120, Math.max(15, hz));
    this._fixedDt = 1 / clamped;
  }

  /** Current physics simulation rate in Hz. */
  get simulationRateHz(): number {
    return 1 / this._fixedDt;
  }

  onRegister(runtime: Runtime): void {
    this._runtime = runtime;
  }

  onUnregister(_runtime: Runtime): void {
    if (this._world) {
      this._world.free();
      this._world = undefined;
    }
    if (this._eventQueue) {
      this._eventQueue.free();
      this._eventQueue = undefined;
    }
    this._activePairs.clear();
    this.events.clear();
    if (this._debugLines) {
      this._debugLines.parent?.remove(this._debugLines);
      this._debugLines.geometry.dispose();
      (this._debugLines.material as THREE.Material).dispose();
      this._debugLines = undefined;
    }
    this._rapier = undefined;
    this._loaded = false;
    this._runtime = undefined;
  }

  async onUpdate(dt: number): Promise<void> {
    if (!this._runtime) return;

    // Check if any active scene has physics bodies.
    const needsPhysics = this._checkNeedsPhysics();
    if (!needsPhysics) {
      // No physics bodies in any active scene; remain dormant.
      return;
    }

    // Lazy-load Rapier WASM if not already loaded.
    if (!this._loaded && !this._loading) {
      this._loading = true;
      try {
        this._rapier = await loadRapier();
        this._world = new this._rapier.World({ x: 0, y: -9.81, z: 0 });
        this._eventQueue = new this._rapier.EventQueue(true);
        this._loaded = true;
      } catch (err) {
        console.error('[PhysicsSystem] Failed to load Rapier WASM:', err);
        this._loading = false;
        return;
      }
      this._loading = false;
    }

    if (!this._loaded || !this._world || !this._rapier) return;

    // Ensure all bodies/colliders are created for active scenes.
    for (const scene of this._runtime.activeScenes) {
      this._syncBodies(scene);
    }

    // Create/update/remove joints declared by PhysicsConstraintComponents.
    for (const scene of this._runtime.activeScenes) {
      this._syncConstraints(scene);
    }

    // Fixed timestep simulation, draining contact events after each step.
    const stepStart =
      typeof performance !== 'undefined' ? performance.now() : Date.now();
    let stepped = false;
    this._accumulator += dt;
    while (this._accumulator >= this._fixedDt) {
      this._world.step(this._eventQueue);
      this._drainEvents();
      this._accumulator -= this._fixedDt;
      stepped = true;
    }
    if (stepped) {
      const stepEnd =
        typeof performance !== 'undefined' ? performance.now() : Date.now();
      this._emitStayEvents();
      this._stats = {
        bodies: this._world.bodies.len(),
        colliders: this._world.colliders.len(),
        constraints: this._world.impulseJoints.len(),
        stepTimeMs: stepEnd - stepStart,
      };
    }

    // Sync transforms from Rapier back to Three.js actors.
    for (const scene of this._runtime.activeScenes) {
      this._syncTransforms(scene);
    }

    // Update debug visualization if enabled.
    if (this._debugEnabled) {
      this._updateDebugVisualization();
    }
  }

  /**
   * Apply an impulse to a dynamic body at its center of mass.
   * @internal
   */
  applyImpulse(component: PhysicsBodyComponent, x: number, y: number, z: number): void {
    if (!this._world || !this._rapier || component._bodyHandle === undefined) return;
    const body = this._world.getRigidBody(component._bodyHandle);
    if (!body || body.bodyType() !== this._rapier.RigidBodyType.Dynamic) return;
    body.applyImpulse({ x, y, z }, true);
  }

  /**
   * Apply a force to a dynamic body at its center of mass.
   * @internal
   */
  applyForce(component: PhysicsBodyComponent, x: number, y: number, z: number): void {
    if (!this._world || !this._rapier || component._bodyHandle === undefined) return;
    const body = this._world.getRigidBody(component._bodyHandle);
    if (!body || body.bodyType() !== this._rapier.RigidBodyType.Dynamic) return;
    body.addForce({ x, y, z }, true);
  }

  /**
   * Apply a torque impulse to a dynamic body.
   * @internal
   */
  applyTorqueImpulse(component: PhysicsBodyComponent, x: number, y: number, z: number): void {
    if (!this._world || !this._rapier || component._bodyHandle === undefined) return;
    const body = this._world.getRigidBody(component._bodyHandle);
    if (!body || body.bodyType() !== this._rapier.RigidBodyType.Dynamic) return;
    body.applyTorqueImpulse({ x, y, z }, true);
  }

  /**
   * Get the linear velocity of a body.
   * @internal
   */
  getLinearVelocity(component: PhysicsBodyComponent): [number, number, number] {
    if (!this._world || component._bodyHandle === undefined) return [0, 0, 0];
    const body = this._world.getRigidBody(component._bodyHandle);
    if (!body) return [0, 0, 0];
    const v = body.linvel();
    return [v.x, v.y, v.z];
  }

  /**
   * Set the linear velocity of a body.
   * @internal
   */
  setLinearVelocity(component: PhysicsBodyComponent, x: number, y: number, z: number): void {
    if (!this._world || component._bodyHandle === undefined) return;
    const body = this._world.getRigidBody(component._bodyHandle);
    if (!body) return;
    body.setLinvel({ x, y, z }, true);
  }

  /**
   * Get the angular velocity of a body.
   * @internal
   */
  getAngularVelocity(component: PhysicsBodyComponent): [number, number, number] {
    if (!this._world || component._bodyHandle === undefined) return [0, 0, 0];
    const body = this._world.getRigidBody(component._bodyHandle);
    if (!body) return [0, 0, 0];
    const v = body.angvel();
    return [v.x, v.y, v.z];
  }

  /**
   * Set the angular velocity of a body.
   * @internal
   */
  setAngularVelocity(component: PhysicsBodyComponent, x: number, y: number, z: number): void {
    if (!this._world || component._bodyHandle === undefined) return;
    const body = this._world.getRigidBody(component._bodyHandle);
    if (!body) return;
    body.setAngvel({ x, y, z }, true);
  }

  /**
   * Raycast against the physics world. Returns the first hit actor, if any.
   * @param origin Ray origin in world space.
   * @param direction Ray direction (normalized) in world space.
   * @param maxDistance Maximum ray distance.
   * @returns The actor owning the hit collider, or undefined if no hit.
   */
  raycast(
    origin: THREE.Vector3,
    direction: THREE.Vector3,
    maxDistance = 1000,
  ): import('../scene/actor').Actor | undefined {
    if (!this._world || !this._rapier || !this._runtime) return undefined;
    const ray = new this._rapier.Ray(origin, direction);
    const hit = this._world.castRay(ray, maxDistance, true);
    if (!hit) return undefined;
    // Get the collider from the hit - it's a property, not a method
    const colliderHandle = (hit as any).colliderHandle;
    if (colliderHandle === undefined) return undefined;
    const collider = this._world.getCollider(colliderHandle);
    if (!collider) return undefined;
    const bodyHandle = collider.parent()?.handle;
    if (bodyHandle === undefined) return undefined;

    // Find the component that owns this body handle.
    for (const scene of this._runtime.activeScenes) {
      let match: Actor | undefined;
      scene.forEachActor((actor) => {
        if (match) return;
        const comp = actor.getComponent({ typeName: 'PhysicsBodyComponent' } as never) as
          | { _bodyHandle?: number }
          | undefined;
        if (comp && comp._bodyHandle === bodyHandle) match = actor;
      });
      if (match) return match;
    }
    return undefined;
  }

  /**
   * Raycast against the physics world, returning detailed hit information.
   * Extends {@link raycast} with distance, world-space point, and surface
   * normal — used by advanced systems such as impact-spawned particles.
   * See PRD 4 v2 (queries).
   */
  raycastHit(
    origin: THREE.Vector3,
    direction: THREE.Vector3,
    maxDistance = 1000,
  ): RaycastHit | undefined {
    if (!this._world || !this._rapier || !this._runtime) return undefined;
    const dir = direction.clone().normalize();
    const ray = new this._rapier.Ray(origin, dir);
    const hit = this._world.castRayAndGetNormal(ray, maxDistance, true);
    if (!hit) return undefined;
    const colliderHandle = (hit as unknown as { colliderHandle?: number }).colliderHandle;
    if (colliderHandle === undefined) return undefined;
    const actor = this._findActorByColliderHandle(colliderHandle);
    if (!actor) return undefined;
    const distance = hit.timeOfImpact;
    const point: [number, number, number] = [
      origin.x + dir.x * distance,
      origin.y + dir.y * distance,
      origin.z + dir.z * distance,
    ];
    const n = hit.normal;
    return { actor, distance, point, normal: [n.x, n.y, n.z] };
  }

  /** Current simulation statistics for the performance overlay (PRD 6). */
  getStats(): PhysicsStats {
    return this._stats;
  }

  /**
   * Drain the Rapier event queue after a step and dispatch enter/exit
   * collision and trigger events to actors and the {@link PhysicsEventBus}.
   * @private
   */
  private _drainEvents(): void {
    if (!this._eventQueue || !this._world) return;
    this._eventQueue.drainCollisionEvents((h1, h2, started) => {
      const c1 = this._world?.getCollider(h1);
      const c2 = this._world?.getCollider(h2);
      const trigger = (c1?.isSensor() ?? false) || (c2?.isSensor() ?? false);
      const key = pairKey(h1, h2);
      if (started) {
        this._activePairs.set(key, { a: h1, b: h2, trigger });
        this._dispatchPair(h1, h2, trigger ? 'onTriggerEnter' : 'onCollisionEnter');
      } else {
        this._activePairs.delete(key);
        this._dispatchPair(h1, h2, trigger ? 'onTriggerExit' : 'onCollisionExit');
      }
    });
  }

  /** Emit `onCollisionStay` for every solid pair still in contact. @private */
  private _emitStayEvents(): void {
    if (this._activePairs.size === 0) return;
    for (const { a, b, trigger } of this._activePairs.values()) {
      if (trigger) continue;
      this._dispatchPair(a, b, 'onCollisionStay');
    }
  }

  /** Resolve both colliders to actors and dispatch a physics event. @private */
  private _dispatchPair(h1: number, h2: number, name: PhysicsEventName): void {
    const a = this._findActorByColliderHandle(h1);
    const b = this._findActorByColliderHandle(h2);
    if (!a || !b) return;
    a.dispatchEvent({ name, payload: { self: a, other: b } });
    b.dispatchEvent({ name, payload: { self: b, other: a } });
    this.events.emit(name, { self: a, other: b });
  }

  /** Map a Rapier collider handle back to its owning actor. @private */
  private _findActorByColliderHandle(colliderHandle: number): Actor | undefined {
    if (!this._world || !this._runtime) return undefined;
    const collider = this._world.getCollider(colliderHandle);
    const bodyHandle = collider?.parent()?.handle;
    if (bodyHandle === undefined) return undefined;
    for (const scene of this._runtime.activeScenes) {
      let match: Actor | undefined;
      scene.forEachActor((actor) => {
        if (match) return;
        const comp = actor.getComponent({ typeName: 'PhysicsBodyComponent' } as never) as
          | { _bodyHandle?: number }
          | undefined;
        if (comp && comp._bodyHandle === bodyHandle) match = actor;
      });
      if (match) return match;
    }
    return undefined;
  }

  /**
   * Create, update, or remove Rapier joints for every
   * {@link PhysicsConstraintComponent} in the scene. @private
   */
  private _syncConstraints(scene: Scene): void {
    const world = this._world;
    const rapier = this._rapier;
    if (!world || !rapier) return;
    scene.forEachActor((actor) => {
      const constraint = actor.getComponent({
        typeName: 'PhysicsConstraintComponent',
      } as never) as unknown as PhysicsConstraintComponent | undefined;
      if (!constraint) return;

      if (constraint._pendingJointRemoval !== undefined) {
        const stale = world.getImpulseJoint(constraint._pendingJointRemoval);
        if (stale) world.removeImpulseJoint(stale, true);
        constraint._pendingJointRemoval = undefined;
      }

      if (constraint._jointHandle !== undefined) return;

      const props = constraint.props;
      const actorA = props.bodyA ? scene.findActorById(props.bodyA) : actor;
      const actorB = props.bodyB ? scene.findActorById(props.bodyB) : undefined;
      const bodyCompA = actorA?.getComponent({ typeName: 'PhysicsBodyComponent' } as never) as
        | { _bodyHandle?: number }
        | undefined;
      const bodyCompB = actorB?.getComponent({ typeName: 'PhysicsBodyComponent' } as never) as
        | { _bodyHandle?: number }
        | undefined;
      if (bodyCompA?._bodyHandle === undefined || bodyCompB?._bodyHandle === undefined) return;
      const bodyA = world.getRigidBody(bodyCompA._bodyHandle);
      const bodyB = world.getRigidBody(bodyCompB._bodyHandle);
      if (!bodyA || !bodyB) return;

      const a = { x: props.anchorA[0], y: props.anchorA[1], z: props.anchorA[2] };
      const b = { x: props.anchorB[0], y: props.anchorB[1], z: props.anchorB[2] };
      const axis = { x: props.axis[0], y: props.axis[1], z: props.axis[2] };
      let params: import('@dimforge/rapier3d-compat').JointData;
      switch (props.type) {
        case 'hinge':
          params = rapier.JointData.revolute(a, b, axis);
          break;
        case 'slider':
          params = rapier.JointData.prismatic(a, b, axis);
          break;
        case 'fixed':
        default:
          params = rapier.JointData.fixed(
            a,
            { x: 0, y: 0, z: 0, w: 1 },
            b,
            { x: 0, y: 0, z: 0, w: 1 },
          );
          break;
      }
      if (props.enableLimits && props.type !== 'fixed') {
        (params as unknown as { limitsEnabled?: boolean; limits?: [number, number] }).limitsEnabled =
          true;
        (params as unknown as { limits?: [number, number] }).limits = [
          props.limitMin,
          props.limitMax,
        ];
      }
      const joint = world.createImpulseJoint(params, bodyA, bodyB, true);
      constraint._jointHandle = joint.handle;
    });
  }

  /**
   * Check if any active scene has PhysicsBodyComponents.
   * @private
   */
  private _checkNeedsPhysics(): boolean {
    if (!this._runtime) return false;
    for (const scene of this._runtime.activeScenes) {
      let found = false;
      scene.forEachActor((actor) => {
        if (found) return;
        if (actor.getComponent({ typeName: 'PhysicsBodyComponent' } as never)) found = true;
      });
      if (found) return true;
    }
    return false;
  }

  /**
   * Ensure all PhysicsBodyComponents in the scene have corresponding Rapier bodies.
   * @private
   */
  private _syncBodies(scene: Scene): void {
    if (!this._world || !this._rapier) return;

    scene.forEachActor((actor) => {
      const comp = actor.getComponent({ typeName: 'PhysicsBodyComponent' } as never) as
        | { _bodyHandle?: number; _colliderHandle?: number }
        | undefined;
      if (!comp) return;

      if (comp._bodyHandle === undefined || comp._colliderHandle === undefined) {
        this._createBody(comp, actor);
      }
    });
  }

  /**
   * Create a Rapier rigid body and collider for the given component.
   * @private
   */
  private _createBody(
    comp: any,
    actor: import('../scene/actor').Actor,
  ): void {
    if (!this._world || !this._rapier) return;

    // Destroy old body/collider if they exist.
    this._destroyBody(comp);

    const props = comp.props;
    const transform = actor.getComponent({ typeName: 'TransformComponent' } as never) as
      | { props?: { position?: [number, number, number]; rotation?: [number, number, number]; scale?: [number, number, number] } }
      | undefined;
    const scale = transform?.props?.scale ?? [1, 1, 1];
    const sx = Math.abs(scale[0]) || 1;
    const sy = Math.abs(scale[1]) || 1;
    const sz = Math.abs(scale[2]) || 1;

    // Create rigid body descriptor.
    let bodyDesc: import('@dimforge/rapier3d-compat').RigidBodyDesc;
    switch (props.bodyType) {
      case 'static':
        bodyDesc = this._rapier.RigidBodyDesc.fixed();
        break;
      case 'kinematic':
        bodyDesc = this._rapier.RigidBodyDesc.kinematicPositionBased();
        break;
      case 'dynamic':
      default:
        bodyDesc = this._rapier.RigidBodyDesc.dynamic();
        break;
    }

    // Set position and rotation in world space so parented actors simulate correctly.
    actor.object3D.updateWorldMatrix(true, false);
    const worldPos = new THREE.Vector3();
    const worldQuat = new THREE.Quaternion();
    actor.object3D.getWorldPosition(worldPos);
    actor.object3D.getWorldQuaternion(worldQuat);
    bodyDesc.setTranslation(worldPos.x, worldPos.y, worldPos.z);
    bodyDesc.setRotation({
      x: worldQuat.x,
      y: worldQuat.y,
      z: worldQuat.z,
      w: worldQuat.w,
    });

    // Set dynamics properties.
    if (props.bodyType === 'dynamic') {
      bodyDesc.setLinearDamping(props.linearDamping);
      bodyDesc.setAngularDamping(props.angularDamping);
      bodyDesc.setGravityScale(props.gravityScale);
      bodyDesc.setCcdEnabled(true);
      // Lock all rotations if any axis is locked (Rapier's API doesn't support per-axis locks)
      if (props.lockRotationX || props.lockRotationY || props.lockRotationZ) {
        bodyDesc.lockRotations();
      }
    }

    const body = this._world.createRigidBody(bodyDesc);
    comp._bodyHandle = body.handle;

    // Create collider descriptor (scale matches visual transform scale).
    let colliderDesc: import('@dimforge/rapier3d-compat').ColliderDesc;
    switch (props.shape) {
      case 'sphere':
        colliderDesc = this._rapier.ColliderDesc.ball(props.size[0] * Math.max(sx, sy, sz));
        break;
      case 'capsule':
        colliderDesc = this._rapier.ColliderDesc.capsule(
          (props.size[1] / 2) * sy,
          props.size[0] * Math.max(sx, sz),
        );
        break;
      case 'cylinder':
        colliderDesc = this._rapier.ColliderDesc.cylinder(
          (props.size[1] / 2) * sy,
          props.size[0] * Math.max(sx, sz),
        );
        break;
      case 'plane':
        colliderDesc = this._rapier.ColliderDesc.cuboid(
          (props.size[0] / 2) * sx,
          0.005,
          (props.size[2] / 2) * sz,
        );
        break;
      case 'convexMesh': {
        const hull = this._tryConvexHullFromMesh(actor);
        if (hull) {
          colliderDesc = hull;
        } else {
          console.warn(
            `[PhysicsSystem] convexMesh hull failed for "${actor.name}" — falling back to box.`,
          );
          colliderDesc = this._rapier.ColliderDesc.cuboid(
            (props.size[0] / 2) * sx,
            (props.size[1] / 2) * sy,
            (props.size[2] / 2) * sz,
          );
        }
        break;
      }
      case 'box':
      default:
        colliderDesc = this._rapier.ColliderDesc.cuboid(
          (props.size[0] / 2) * sx,
          (props.size[1] / 2) * sy,
          (props.size[2] / 2) * sz,
        );
        break;
    }

    colliderDesc.setFriction(props.friction);
    colliderDesc.setRestitution(props.restitution);

    if (props.bodyType === 'dynamic') {
      colliderDesc.setMass(props.mass);
    }

    // Collision filtering: Rapier packs membership in the high 16 bits and
    // the filter mask in the low 16 bits of a single u32.
    const layer = (props.collisionLayer ?? 1) & 0xffff;
    const mask = (props.collisionMask ?? 0xffff) & 0xffff;
    colliderDesc.setCollisionGroups((layer << 16) | mask);

    // Sensors (triggers) report overlap but apply no contact forces.
    if (props.isTrigger) colliderDesc.setSensor(true);

    // Emit contact/intersection events so the PhysicsEventBus can dispatch them.
    colliderDesc.setActiveEvents(this._rapier.ActiveEvents.COLLISION_EVENTS);

    const collider = this._world.createCollider(colliderDesc, body);
    comp._colliderHandle = collider.handle;
  }

  /**
   * Build a Rapier convex hull from the actor's MeshRenderer geometry.
   * Caps / subsamples dense meshes. Returns undefined on failure.
   */
  private _tryConvexHullFromMesh(
    actor: Actor,
  ): import('@dimforge/rapier3d-compat').ColliderDesc | undefined {
    if (!this._rapier) return undefined;
    const meshComp = actor.getComponent(MeshRendererComponent);
    const root = meshComp?.mesh;
    if (!root) return undefined;

    const MAX_VERTS = 10_000;
    const positions: number[] = [];
    const scratch = new THREE.Vector3();
    root.updateWorldMatrix(true, true);

    root.traverse((obj) => {
      if (!(obj as THREE.Mesh).isMesh) return;
      const mesh = obj as THREE.Mesh;
      const geo = mesh.geometry as THREE.BufferGeometry | undefined;
      const attr = geo?.getAttribute('position');
      if (!attr) return;
      mesh.updateWorldMatrix(true, false);
      for (let i = 0; i < attr.count; i++) {
        scratch.fromBufferAttribute(attr, i);
        scratch.applyMatrix4(mesh.matrixWorld);
        // Convert to actor-local space (collider is body-local).
        actor.object3D.worldToLocal(scratch);
        positions.push(scratch.x, scratch.y, scratch.z);
      }
    });

    const vertCount = positions.length / 3;
    if (vertCount < 4) return undefined;

    let verts = new Float32Array(positions);
    if (vertCount > MAX_VERTS) {
      const step = Math.ceil(vertCount / MAX_VERTS);
      const sampled: number[] = [];
      for (let i = 0; i < vertCount; i += step) {
        sampled.push(positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2]);
      }
      verts = new Float32Array(sampled);
    }

    try {
      const desc = this._rapier.ColliderDesc.convexHull(verts);
      return desc ?? undefined;
    } catch {
      return undefined;
    }
  }

  /**
   * Destroy the Rapier body and collider for the given component.
   * @private
   */
  private _destroyBody(comp: any): void {
    if (!this._world) return;
    if (comp._colliderHandle !== undefined) {
      const collider = this._world.getCollider(comp._colliderHandle);
      if (collider) this._world.removeCollider(collider, true);
      comp._colliderHandle = undefined;
    }
    if (comp._bodyHandle !== undefined) {
      const body = this._world.getRigidBody(comp._bodyHandle);
      if (body) this._world.removeRigidBody(body);
      comp._bodyHandle = undefined;
    }
  }

  /**
   * Sync transforms from Rapier bodies back to Three.js actors.
   * Interpolates position/rotation using the accumulator remainder for smooth rendering.
   * @private
   */
  private _syncTransforms(scene: Scene): void {
    if (!this._world || !this._rapier) return;

    scene.forEachActor((actor) => {
      const comp = actor.getComponent({ typeName: 'PhysicsBodyComponent' } as never) as
        | { _bodyHandle?: number }
        | undefined;
      if (!comp || comp._bodyHandle === undefined) return;
      const body = this._world!.getRigidBody(comp._bodyHandle);
      if (!body) return;

      // Only sync dynamic and kinematic bodies; static bodies don't move.
      const bodyType = body.bodyType();
      if (
        bodyType !== this._rapier!.RigidBodyType.Dynamic &&
        bodyType !== this._rapier!.RigidBodyType.KinematicPositionBased
      ) {
        return;
      }

      const transform = actor.getComponent({ typeName: 'TransformComponent' } as never) as
        | { setProps: (p: { position: [number, number, number]; rotation: [number, number, number] }) => void }
        | undefined;
      if (!transform) return;

      const pos = body.translation();
      const rot = body.rotation();

      const worldPos = new THREE.Vector3(pos.x, pos.y, pos.z);
      const worldQuat = new THREE.Quaternion(rot.x, rot.y, rot.z, rot.w);
      let localPos = worldPos.clone();
      let localQuat = worldQuat.clone();

      const parentObj = actor.parent?.object3D;
      if (parentObj) {
        parentObj.updateWorldMatrix(true, false);
        const invParent = new THREE.Matrix4().copy(parentObj.matrixWorld).invert();
        localPos.applyMatrix4(invParent);
        const parentQuat = new THREE.Quaternion();
        parentObj.getWorldQuaternion(parentQuat);
        localQuat.premultiply(parentQuat.invert());
      }

      const euler = new THREE.Euler().setFromQuaternion(localQuat, 'XYZ');
      transform.setProps({
        position: [localPos.x, localPos.y, localPos.z] as [number, number, number],
        rotation: [euler.x, euler.y, euler.z] as [number, number, number],
      });
    });
  }

  /**
   * Update debug visualization wireframe colliders.
   * @private
   */
  private _updateDebugVisualization(): void {
    if (!this._world || !this._runtime) return;

    const buffers = this._world.debugRender();
    if (!buffers || !buffers.vertices || buffers.vertices.length === 0) return;

    // Get the first active scene to add debug geometry to.
    const scene = this._runtime.activeScenes[0];
    if (!scene) return;

    // Create or update the debug line segments.
    if (!this._debugLines) {
      const geometry = new THREE.BufferGeometry();
      const material = new THREE.LineBasicMaterial({
        color: 0x00ff00,
        linewidth: 1,
        transparent: true,
        opacity: 0.7,
      });
      this._debugLines = new THREE.LineSegments(geometry, material);
      this._debugLines.frustumCulled = false;
      scene.threeScene.add(this._debugLines);
    }

    // Update geometry with Rapier debug data.
    const positions = new Float32Array(buffers.vertices);
    this._debugLines.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    this._debugLines.geometry.computeBoundingSphere();

    // If colors are provided, set them.
    if (buffers.colors && buffers.colors.length > 0) {
      const colors = new Float32Array(buffers.colors);
      this._debugLines.geometry.setAttribute('color', new THREE.BufferAttribute(colors, 4));
      (this._debugLines.material as THREE.LineBasicMaterial).vertexColors = true;
    }
  }
}

/** Build a stable order-independent key for a collider-handle pair. */
function pairKey(h1: number, h2: number): string {
  return h1 < h2 ? `${h1}:${h2}` : `${h2}:${h1}`;
}
