import * as THREE from 'three';
import { createId } from '../utils/id';
import { EventEmitter } from '../utils/events';
import type { Component, ComponentEvent } from './component';
import type { SerializedComponentProps } from '@shared/types';
import type { Scene } from './scene';

/** Minimal constructor shape required by {@link Actor.getComponent}. */
interface ComponentTypeRef<TC extends Component> {
  readonly typeName: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  new (...args: any[]): TC;
}

/** Events emitted by an Actor over its lifetime. */
export interface ActorEvents {
  componentAdded: { actor: Actor; component: Component };
  componentRemoved: { actor: Actor; component: Component };
  destroyed: { actor: Actor };
}

/** Serialized form of an actor, used for project save/load. */
export interface SerializedActor {
  readonly id: string;
  readonly name: string;
  readonly parentId: string | undefined;
  readonly components: ReadonlyArray<{ type: string; props: SerializedComponentProps }>;
}

/**
 * An entity in the scene. Actors own a flat list of components and form a
 * parent/child hierarchy expressed via `THREE.Object3D` for transform chaining.
 */
export class Actor {
  readonly id: string;
  readonly object3D: THREE.Object3D;
  readonly events = new EventEmitter<ActorEvents>();

  name: string;

  private _scene: Scene | undefined;
  private _parent: Actor | undefined;
  private readonly _children: Actor[] = [];
  private readonly _components: Component[] = [];
  private _destroyed = false;

  constructor(name = 'Actor', id: string = createId('actor')) {
    this.id = id;
    this.name = name;
    this.object3D = new THREE.Object3D();
    this.object3D.name = name;
    this.object3D.userData.actorId = id;
  }

  /** The scene this actor currently belongs to, if any. */
  get scene(): Scene | undefined {
    return this._scene;
  }

  /** The parent actor in the hierarchy, if any. */
  get parent(): Actor | undefined {
    return this._parent;
  }

  /** Read-only view of this actor's child actors. */
  get children(): ReadonlyArray<Actor> {
    return this._children;
  }

  /** Read-only view of attached components. */
  get components(): ReadonlyArray<Component> {
    return this._components;
  }

  /** True once {@link destroy} has been called. */
  get isDestroyed(): boolean {
    return this._destroyed;
  }

  /** @internal Used by Scene to bind an actor to itself. */
  _bindScene(scene: Scene | undefined): void {
    this._scene = scene;
  }

  /** Reparent this actor under `parent`, or to the scene root if `undefined`. */
  setParent(parent: Actor | undefined): void {
    if (parent === this._parent) return;
    if (this._parent) {
      const idx = this._parent._children.indexOf(this);
      if (idx >= 0) this._parent._children.splice(idx, 1);
    }
    this._parent = parent;
    if (parent) {
      parent._children.push(this);
      parent.object3D.add(this.object3D);
    } else if (this._scene) {
      this._scene.threeScene.add(this.object3D);
    }
  }

  /**
   * Attach a component instance to this actor. The component's `onAttach`
   * lifecycle hook is invoked immediately. If the actor is already bound to a
   * scene, `onSceneAttach` fires right after so components that depend on
   * scene context can initialize correctly.
   */
  addComponent<TC extends Component<TProps>, TProps extends SerializedComponentProps>(
    component: TC,
  ): TC {
    this._components.push(component);
    component.onAttach(this);
    if (this._scene) component.onSceneAttach(this._scene);
    this.events.emit('componentAdded', { actor: this, component });
    return component;
  }

  /** Remove a component, invoking `onDetach`. Returns true if it was attached. */
  removeComponent(component: Component): boolean {
    const idx = this._components.indexOf(component);
    if (idx < 0) return false;
    this._components.splice(idx, 1);
    if (this._scene) component.onSceneDetach(this._scene);
    component.onDetach();
    this.events.emit('componentRemoved', { actor: this, component });
    return true;
  }

  /**
   * Find the first attached component matching the given constructor.
   * Uses static `typeName` for cheap identification without `instanceof`.
   */
  getComponent<TC extends Component>(ctor: ComponentTypeRef<TC>): TC | undefined {
    const tag = ctor.typeName;
    for (const c of this._components) {
      if (c.type === tag) return c as TC;
    }
    return undefined;
  }

  /** Dispatch a custom event to every component on this actor. */
  dispatchEvent(event: ComponentEvent): void {
    for (const c of this._components) c.onEvent(event);
  }

  /** Tear down this actor: detach all components and destroy children. */
  destroy(): void {
    if (this._destroyed) return;
    this._destroyed = true;
    for (const child of [...this._children]) child.destroy();
    for (const c of [...this._components]) this.removeComponent(c);
    this.setParent(undefined);
    if (this._scene) {
      this._scene.threeScene.remove(this.object3D);
    }
    this.events.emit('destroyed', { actor: this });
    this.events.clear();
    this._scene = undefined;
  }

  /** Produce a JSON-safe snapshot of this actor for project storage. */
  serialize(): SerializedActor {
    return {
      id: this.id,
      name: this.name,
      parentId: this._parent?.id,
      components: this._components.map((c) => c.serialize()),
    };
  }
}
