import * as THREE from 'three';
import { SystemPriority } from '@shared/types';
import { CameraComponent } from '../components/camera.component';
import { InputListenerComponent, type PinchEvent } from '../components/input-listener.component';
import type { Runtime } from '../runtime';
import type { Actor, Scene } from '../scene';
import type { System } from './system';

/**
 * Coarse pointer event payload delivered to {@link InputListenerComponent}s.
 * Coordinates are in normalized device space (-1..1) at the time of the event.
 */
export interface PointerEvent2D {
  ndcX: number;
  ndcY: number;
  button: number;
  type: 'down' | 'up' | 'move';
}

/**
 * The Input system listens for pointer events on the runtime canvas and
 * dispatches interaction events to actors carrying {@link InputListenerComponent}.
 * Supports both mesh-based and physics-based raycasting.
 */
export class InputSystem implements System {
  readonly name = 'InputSystem';
  readonly priority = SystemPriority.INPUT;

  private _runtime: Runtime | undefined;
  private readonly _raycaster = new THREE.Raycaster();
  private readonly _ndc = new THREE.Vector2();
  private _hoveredActorId: string | undefined;
  private _pendingEvents: PointerEvent2D[] = [];
  private _pendingPinches: PinchEvent[] = [];
  private _pointerDownActorId: string | undefined;
  private _isDragging = false;
  /** Active touch pointers (pointerId -> client coords). */
  private readonly _pointers = new Map<number, { clientX: number; clientY: number }>();
  /** Distance between the two active pointers when the pinch started. */
  private _pinchStartDist = 0;
  /** Actor that the pinch gesture is bound to (first pointer-down hit). */
  private _pinchActorId: string | undefined;

  private readonly _onPointerDown = (e: PointerEvent): void => {
    this._pointers.set(e.pointerId, { clientX: e.clientX, clientY: e.clientY });
    this._maybeStartPinch();
    this._queue(e, 'down');
  };
  private readonly _onPointerUp = (e: PointerEvent): void => {
    this._maybeEndPinch();
    this._pointers.delete(e.pointerId);
    this._queue(e, 'up');
  };
  private readonly _onPointerMove = (e: PointerEvent): void => {
    if (this._pointers.has(e.pointerId)) {
      this._pointers.set(e.pointerId, { clientX: e.clientX, clientY: e.clientY });
    }
    this._maybeUpdatePinch();
    this._queue(e, 'move');
  };

  onRegister(runtime: Runtime): void {
    this._runtime = runtime;
    const canvas = runtime.context.canvas;
    canvas.addEventListener('pointerdown', this._onPointerDown);
    canvas.addEventListener('pointerup', this._onPointerUp);
    canvas.addEventListener('pointermove', this._onPointerMove);
  }

  onUnregister(runtime: Runtime): void {
    const canvas = runtime.context.canvas;
    canvas.removeEventListener('pointerdown', this._onPointerDown);
    canvas.removeEventListener('pointerup', this._onPointerUp);
    canvas.removeEventListener('pointermove', this._onPointerMove);
    this._pendingEvents = [];
    this._runtime = undefined;
  }

  onUpdate(_dt: number): void {
    if (!this._runtime) return;
    const events = this._pendingEvents;
    this._pendingEvents = [];
    const pinches = this._pendingPinches;
    this._pendingPinches = [];

    for (const scene of this._runtime.activeScenes) {
      const camera = this._getMainCamera(scene);
      if (!camera) continue;

      // Dispatch queued pinch events to the bound actor.
      if (this._pinchActorId && pinches.length > 0) {
        const actor = scene.findActorById(this._pinchActorId);
        const listener = actor?.getComponent(InputListenerComponent);
        if (listener) for (const p of pinches) listener.dispatchPinch(p);
      }

      // Process each event.
      for (const ev of events) {
        this._ndc.set(ev.ndcX, ev.ndcY);
        this._raycaster.setFromCamera(this._ndc, camera);
        const hit = this._raycast(scene);

        if (ev.type === 'down') {
          this._pointerDownActorId = hit?.id;
          this._isDragging = false;
          if (hit) {
            const listener = hit.getComponent(InputListenerComponent);
            listener?.dispatchPointerDown(ev);
          }
        } else if (ev.type === 'up') {
          const wasDown = this._pointerDownActorId;
          this._pointerDownActorId = undefined;
          if (hit) {
            const listener = hit.getComponent(InputListenerComponent);
            listener?.dispatchPointerUp(ev);
            // Click = pointer-down and pointer-up on the same actor.
            if (wasDown === hit.id && !this._isDragging) {
              listener?.dispatchClick(ev);
            }
          }
          this._isDragging = false;
        } else if (ev.type === 'move') {
          // Update hover state.
          this._updateHover(hit);
          
          // Dispatch pointer-move.
          if (hit) {
            const listener = hit.getComponent(InputListenerComponent);
            listener?.dispatchPointerMove(ev);
          }

          // If pointer is down, this is a drag.
          if (this._pointerDownActorId) {
            this._isDragging = true;
            const dragActor = scene.findActorById(this._pointerDownActorId);
            const listener = dragActor?.getComponent(InputListenerComponent);
            listener?.dispatchDrag(ev);
          }
        }
      }
    }
  }

  private _queue(e: PointerEvent, type: PointerEvent2D['type']): void {
    if (!this._runtime) return;
    const canvas = this._runtime.context.canvas;
    const rect = canvas.getBoundingClientRect();
    const ndcX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const ndcY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    this._pendingEvents.push({ ndcX, ndcY, button: e.button, type });
  }

  private _getMainCamera(scene: Scene): THREE.Camera | undefined {
    const id = scene.mainCameraActorId;
    if (!id) return undefined;
    const actor = scene.findActorById(id);
    const cam = actor?.getComponent(CameraComponent);
    return cam?.camera;
  }

  private _raycast(scene: Scene): Actor | undefined {
    // First, check if any actor with InputListenerComponent wants physics raycasting.
    let usePhysics = false;
    for (const actor of scene.actors) {
      const listener = actor.getComponent(InputListenerComponent);
      if (listener && listener.props.usePhysicsCollider) {
        usePhysics = true;
        break;
      }
    }

    // If physics raycasting is requested, try it first.
    if (usePhysics) {
      const physicsSystem = this._runtime?.systems.find((s) => s.name === 'PhysicsSystem') as
        | { raycast?: (o: THREE.Vector3, d: THREE.Vector3) => Actor | undefined }
        | undefined;
      if (physicsSystem?.raycast) {
        const origin = new THREE.Vector3();
        const direction = new THREE.Vector3();
        this._raycaster.ray.at(0, origin);
        direction.copy(this._raycaster.ray.direction).normalize();
        const physicsHit = physicsSystem.raycast(origin, direction);
        if (physicsHit) {
          const listener = physicsHit.getComponent(InputListenerComponent);
          if (listener && listener.props.usePhysicsCollider) {
            return physicsHit;
          }
        }
      }
    }

    // Fall back to mesh raycasting.
    const hits = this._raycaster.intersectObject(scene.threeScene, true);
    for (const hit of hits) {
      let obj: THREE.Object3D | null = hit.object;
      while (obj) {
        const actorId = obj.userData.actorId as string | undefined;
        if (actorId) {
          const actor = scene.findActorById(actorId);
          const listener = actor?.getComponent(InputListenerComponent);
          if (listener && !listener.props.usePhysicsCollider) {
            return actor;
          }
        }
        obj = obj.parent;
      }
    }
    return undefined;
  }

  private _updateHover(hit: Actor | undefined): void {
    const newId = hit?.id;
    if (newId === this._hoveredActorId) {
      // Update cursor if still hovering.
      if (hit && this._runtime) {
        const listener = hit.getComponent(InputListenerComponent);
        if (listener) {
          this._runtime.context.canvas.style.cursor = listener.props.cursor;
        }
      }
      return;
    }

    // Hover state changed.
    if (this._hoveredActorId && this._runtime) {
      for (const scene of this._runtime.activeScenes) {
        const prev = scene.findActorById(this._hoveredActorId);
        prev?.getComponent(InputListenerComponent)?.dispatchHoverEnd();
      }
      // Reset cursor.
      this._runtime.context.canvas.style.cursor = '';
    }

    this._hoveredActorId = newId;
    if (hit && this._runtime) {
      const listener = hit.getComponent(InputListenerComponent);
      listener?.dispatchHoverStart();
      if (listener) {
        this._runtime.context.canvas.style.cursor = listener.props.cursor;
      }
    }
  }

  private _maybeStartPinch(): void {
    if (this._pointers.size !== 2) return;
    this._pinchStartDist = this._currentPointerDistance();
    this._pinchActorId = this._pointerDownActorId;
    this._pendingPinches.push({
      scale: 1,
      ...this._currentPinchCenterNdc(),
      phase: 'start',
    });
  }

  private _maybeUpdatePinch(): void {
    if (this._pointers.size !== 2 || this._pinchStartDist <= 0) return;
    const dist = this._currentPointerDistance();
    this._pendingPinches.push({
      scale: dist / this._pinchStartDist,
      ...this._currentPinchCenterNdc(),
      phase: 'move',
    });
  }

  private _maybeEndPinch(): void {
    if (this._pointers.size !== 2 || this._pinchStartDist <= 0) return;
    const dist = this._currentPointerDistance();
    this._pendingPinches.push({
      scale: dist / this._pinchStartDist,
      ...this._currentPinchCenterNdc(),
      phase: 'end',
    });
    this._pinchStartDist = 0;
    this._pinchActorId = undefined;
  }

  private _currentPointerDistance(): number {
    const it = this._pointers.values();
    const a = it.next().value;
    const b = it.next().value;
    if (!a || !b) return 0;
    const dx = a.clientX - b.clientX;
    const dy = a.clientY - b.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }

  private _currentPinchCenterNdc(): { centerNdcX: number; centerNdcY: number } {
    const canvas = this._runtime?.context.canvas;
    if (!canvas) return { centerNdcX: 0, centerNdcY: 0 };
    const it = this._pointers.values();
    const a = it.next().value;
    const b = it.next().value;
    if (!a || !b) return { centerNdcX: 0, centerNdcY: 0 };
    const cx = (a.clientX + b.clientX) / 2;
    const cy = (a.clientY + b.clientY) / 2;
    const rect = canvas.getBoundingClientRect();
    return {
      centerNdcX: ((cx - rect.left) / rect.width) * 2 - 1,
      centerNdcY: -(((cy - rect.top) / rect.height) * 2 - 1),
    };
  }
}
