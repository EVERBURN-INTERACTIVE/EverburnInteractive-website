import * as THREE from 'three';
import { createId } from '../utils/id';
import { EventEmitter } from '../utils/events';
import type { Actor, SerializedActor } from './actor';
import type { Runtime } from '../runtime';
import type { QualityPreset } from '../quality/quality-manager';

/** Lifecycle events emitted by a Scene. */
export interface SceneEvents {
  init: { scene: Scene };
  enter: { scene: Scene };
  exit: { scene: Scene };
  update: { scene: Scene; dt: number };
  actorAdded: { scene: Scene; actor: Actor };
  actorRemoved: { scene: Scene; actor: Actor };
}

/** Per-scene render configuration. */
export interface SceneSettings {
  /** Background: `null` clears to transparent. Strings are CSS-style colors. */
  background: string | null;
  /** Clear flags applied before rendering. */
  clearColor: boolean;
  clearDepth: boolean;
  /** Optional fog (linear) — set `undefined` to disable. */
  fog?: { color: string; near: number; far: number };
  /**
   * Per-scene quality override. `'auto'` keeps the app-wide preset chosen
   * by `QualityManager.autoDetect`; any other value applies that profile
   * to the runtime when the scene activates.
   */
  qualityPreset?: QualityPreset | 'auto';
}

/** Serialized scene for project save/load. */
export interface SerializedScene {
  readonly id: string;
  readonly name: string;
  readonly settings: SceneSettings;
  readonly actors: ReadonlyArray<SerializedActor>;
  readonly _version: 1;
}

const DEFAULT_SETTINGS: SceneSettings = {
  background: '#0b0d10',
  clearColor: true,
  clearDepth: true,
};

/**
 * A self-contained 3D experience. A scene owns a `THREE.Scene`, a list of
 * top-level actors, and per-scene render settings. Multiple scenes may be
 * active simultaneously (e.g., a base scene + an overlay), each rendered by
 * the {@link RenderingSystem} in priority order.
 */
export class Scene {
  readonly id: string;
  readonly threeScene: THREE.Scene;
  readonly events = new EventEmitter<SceneEvents>();

  name: string;
  settings: SceneSettings;

  /** Render order; lower values render first. Used by RenderingSystem. */
  renderOrder = 0;

  /** Tag identifying the main camera actor (set by CameraComponent). */
  mainCameraActorId: string | undefined;

  /** Runtime currently driving this scene, if any. Set by `Runtime.loadScene`. */
  runtime: Runtime | undefined;

  /**
   * When true, this scene is a nested sub-scene instantiated by a
   * {@link SceneInstanceComponent}. Nested scenes are updated by all systems
   * like any other active scene, but the {@link RenderingSystem} skips them:
   * their `threeScene` is parented under the host actor's `Object3D` and is
   * therefore drawn as part of the host scene's render pass. Defaults to
   * `false`. See PRD 1 (Nested Scene System).
   */
  nested = false;

  /**
   * Set of scene-asset GUIDs in this scene's ancestor chain (including its
   * own source asset id when known). Used by {@link SceneInstanceComponent}
   * to detect and break cyclic nesting. @internal
   */
  _ancestorAssetIds: ReadonlySet<string> = new Set<string>();

  private readonly _actors: Actor[] = [];
  private _initialized = false;
  private _active = false;

  constructor(name = 'Untitled', id: string = createId('scene'), settings?: Partial<SceneSettings>) {
    this.id = id;
    this.name = name;
    this.threeScene = new THREE.Scene();
    this.threeScene.name = name;
    this.settings = { ...DEFAULT_SETTINGS, ...settings };
  }

  /** Read-only view of all actors owned by this scene. */
  get actors(): ReadonlyArray<Actor> {
    return this._actors;
  }

  /** True after `init()` has run. */
  get isInitialized(): boolean {
    return this._initialized;
  }

  /** True between `enter()` and `exit()`. */
  get isActive(): boolean {
    return this._active;
  }

  /** Add a top-level actor to this scene. */
  add(actor: Actor): Actor {
    if (actor.scene === this) return actor;
    this._actors.push(actor);
    actor._bindScene(this);
    if (!actor.parent) {
      this.threeScene.add(actor.object3D);
    }
    for (const c of actor.components) c.onSceneAttach(this);
    this.events.emit('actorAdded', { scene: this, actor });
    return actor;
  }

  /** Remove an actor subtree from this scene. */
  remove(actor: Actor): void {
    if (!this._actors.includes(actor)) return;
    const subtree = collectActorSubtree(actor);
    for (const node of subtree) {
      const idx = this._actors.indexOf(node);
      if (idx < 0) continue;
      for (const c of node.components) c.onSceneDetach(this);
      this._actors.splice(idx, 1);
      this.threeScene.remove(node.object3D);
      node._bindScene(undefined);
      this.events.emit('actorRemoved', { scene: this, actor: node });
    }
  }

  /** Find an actor by id (linear scan; O(n)). */
  findActorById(id: string): Actor | undefined {
    return this._actors.find((a) => a.id === id);
  }

  /**
   * Visit every actor in the scene exactly once, depth-first from each root.
   * Prefer this over iterating {@link actors} directly when child actors may
   * also appear in the flat list (preset import, deserialization).
   */
  forEachActor(visitor: (actor: Actor) => void): void {
    const seen = new Set<string>();
    const visit = (actor: Actor): void => {
      if (seen.has(actor.id)) return;
      seen.add(actor.id);
      visitor(actor);
      for (const child of actor.children) visit(child);
    };
    for (const actor of this._actors) {
      if (!actor.parent) visit(actor);
    }
    for (const actor of this._actors) {
      if (!seen.has(actor.id)) visit(actor);
    }
  }

  /** First-time initialization hook. Called once before `enter`. */
  init(): void {
    if (this._initialized) return;
    this._initialized = true;
    this.events.emit('init', { scene: this });
  }

  /** Activate the scene (begin update + render). */
  enter(): void {
    if (this._active) return;
    this._active = true;
    this.events.emit('enter', { scene: this });
  }

  /** Deactivate the scene. */
  exit(): void {
    if (!this._active) return;
    this._active = false;
    this.events.emit('exit', { scene: this });
  }

  /** Advance one frame: invokes per-component update via the gameplay system. */
  update(dt: number): void {
    if (!this._active) return;
    for (const actor of this._actors) {
      if (actor.isDestroyed) continue;
      for (const c of actor.components) c.onUpdate(dt);
    }
    this.events.emit('update', { scene: this, dt });
  }

  /** Dispose all actors and clear Three.js resources. */
  dispose(): void {
    for (const actor of [...this._actors]) actor.destroy();
    this._actors.length = 0;
    this.threeScene.clear();
    this.events.clear();
    this._initialized = false;
    this._active = false;
  }

  serialize(): SerializedScene {
    return {
      id: this.id,
      name: this.name,
      settings: this.settings,
      actors: this._actors.filter((a) => !a.isDestroyed).map((a) => a.serialize()),
      _version: 1,
    };
  }
}

function collectActorSubtree(root: Actor): Actor[] {
  const out: Actor[] = [root];
  for (const child of root.children) out.push(...collectActorSubtree(child));
  return out;
}
