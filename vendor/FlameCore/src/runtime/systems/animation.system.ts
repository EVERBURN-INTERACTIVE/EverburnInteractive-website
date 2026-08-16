/**
 * AnimationSystem — evaluates animation clips and applies property changes.
 *
 * Priority: **40** (after Physics 30, before UI 45 and Rendering 50).
 *
 * Bug fixes in v2:
 *  - `clipDuration` is now populated on the player as soon as the clip
 *    resolves successfully (previously it was never written).
 *  - The asset database is wired automatically in {@link onRegister}; the
 *    legacy {@link setAssetDatabase} setter is preserved as an override hook.
 *  - Player ↔ system handoff is type-safe via {@link Runtime.getSystem}.
 *
 * v2 additions:
 *  - Type-aware interpolation (number / vec2 / vec3 / vec4 / color /
 *    quaternion / string / boolean) via {@link interpolateValue}.
 *  - Bezier-aware easing via {@link applyEasing}.
 *  - Per-actor per-property mixer for stacked players (additive + layered
 *    blending — see {@link mixContributions}).
 *  - Marker events emitted on the system's event bus when the playhead
 *    crosses an {@link AnimationMarker}.
 *  - Editor preview helper {@link previewClipAt} for scrubbing without
 *    affecting any player state.
 *  - Transparent v1 → v2 clip migration on first load.
 *
 * @module @runtime/systems/animation
 */

import type { System } from './system';
import type { Runtime } from '../runtime';
import type { Actor } from '../scene/actor';
import type { Scene } from '../scene/scene';
import type {
  AnimatableValue,
  AnimationClip,
  AnimationMarker,
  AnimationTrack,
} from '@shared/types/animation';
import { migrateClipV1ToV2 } from '@shared/types/animation';
import { AnimationPlayerComponent } from '../components/animation-player.component';
import { MeshRendererComponent } from '../components/mesh-renderer.component';
import { findGltfNodeByPath } from '../assets/gltf-utils';
import {
  applyMorphInfluence,
  decodeMorphStorageKey,
} from '../assets/gltf-morph-utils';
import { applyEasing } from '../utils/easing';
import { interpolateValue } from '../utils/interpolate';
import { EventEmitter } from '../utils/events';
import { AssetDatabase } from '../assets/asset-database';
import { mixContributions, type MixerContribution } from './animation.mixer';

/** Events emitted by the AnimationSystem. */
export interface AnimationSystemEvents {
  markerReached: { player: AnimationPlayerComponent; marker: AnimationMarker };
  clipCompleted: { player: AnimationPlayerComponent };
  clipLooped: { player: AnimationPlayerComponent };
}

/**
 * Top-level animation system. Owns the set of active players, resolves
 * animation clips against the asset database, evaluates each track at the
 * current playhead, and writes the resulting value(s) onto target
 * component props.
 */
export class AnimationSystem implements System {
  readonly name = 'AnimationSystem';
  readonly priority = 40;
  readonly events = new EventEmitter<AnimationSystemEvents>();

  private _runtime: Runtime | undefined;
  private _activePlayers = new Set<AnimationPlayerComponent>();
  private _assetDatabase: AssetDatabase | undefined;
  /** Per-frame mixer scratch buffer: `actorId|component|path` → contributions. */
  private readonly _mixBuckets = new Map<string, MixerContribution[]>();
  /** Per-player last-evaluated time, used to detect marker crossings. */
  private readonly _lastTimeByPlayer = new WeakMap<AnimationPlayerComponent, number>();

  onRegister(runtime: Runtime): void {
    this._runtime = runtime;
    // Bug fix #2: wire the runtime-owned AssetDatabase automatically.
    this._assetDatabase = runtime.context.assets;
  }

  onUnregister(): void {
    this._runtime = undefined;
    this._activePlayers.clear();
    this._mixBuckets.clear();
  }

  /** @internal called by {@link AnimationPlayerComponent.onAttach}. */
  registerPlayer(player: AnimationPlayerComponent): void {
    this._activePlayers.add(player);
  }

  /** @internal called by {@link AnimationPlayerComponent.onDetach}. */
  unregisterPlayer(player: AnimationPlayerComponent): void {
    this._activePlayers.delete(player);
    this._lastTimeByPlayer.delete(player);
  }

  /**
   * Override the asset database used to resolve clip ids. Optional — the
   * runtime's context-owned database is wired automatically in onRegister.
   */
  setAssetDatabase(db: AssetDatabase): void {
    this._assetDatabase = db;
  }

  onUpdate(_dt: number): void {
    if (!this._runtime) return;
    this._mixBuckets.clear();

    // 1) Collect contributions from every active player.
    for (const player of this._activePlayers) {
      if (player.state !== 'playing') continue;
      const clip = this._loadClip(player.props.clipId);
      if (!clip) continue;

      // Bug fix #1: keep the player's cached duration synced with the clip.
      if (player.clipDuration !== clip.duration) player.clipDuration = clip.duration;

      this._collectClipContributions(clip, player);
      this._dispatchMarkers(clip, player);
    }

    // 2) Apply mixed values to component props.
    this._applyMixedContributions();
  }

  /**
   * Editor scrubbing helper. Evaluates the clip at `time` for the supplied
   * scene and writes values immediately without touching any player state.
   */
  previewClipAt(clipId: string, time: number, scene: Scene): void {
    const clip = this._loadClip(clipId);
    if (!clip) return;
    this._mixBuckets.clear();
    for (const track of clip.tracks) {
      if (!track.enabled || track.keyframes.length === 0) continue;
      const value = this._evaluateTrack(track, time);
      if (value === undefined) continue;
      if (track.targetGltfNodePath) {
        const actor = this._findActor([scene], track.targetActorId);
        if (actor) {
          this._applyGltfNodeTrackOnActor(
            actor,
            track.targetGltfNodePath,
            track.descriptor.propertyPath,
            value,
          );
        }
        continue;
      }
      this._addContribution(track, value, 1, 0, false);
    }
    this._applyMixedContributions();
  }

  // --- internals ---------------------------------------------------------

  private _loadClip(clipId: string | undefined): AnimationClip | undefined {
    if (!clipId || !this._assetDatabase) return undefined;
    const asset = this._assetDatabase.get(clipId);
    if (!asset || asset.type !== 'animation-clip' || !asset.inline) return undefined;
    const raw = asset.inline as AnimationClip;
    // Transparent v1 → v2 migration. Subsequent calls are no-ops.
    if ((raw as { _version?: number })._version !== 2) {
      const migrated = migrateClipV1ToV2(raw as never);
      // Mutate the inline in place so the next lookup is already v2.
      Object.assign(raw as object, migrated);
    }
    return raw;
  }

  private _collectClipContributions(clip: AnimationClip, player: AnimationPlayerComponent): void {
    for (const track of clip.tracks) {
      if (!track.enabled || track.keyframes.length === 0) continue;
      const value = this._evaluateTrack(track, player.time);
      if (value === undefined) continue;

      if (track.targetGltfNodePath) {
        const actor = player.actor;
        if (actor) {
          this._applyGltfNodeTrackOnActor(
            actor,
            track.targetGltfNodePath,
            track.descriptor.propertyPath,
            value,
          );
        }
        continue;
      }

      this._addContribution(track, value, player.weight, player.layer, player.additive);
    }
  }

  private _applyGltfNodeTrackOnActor(
    actor: Actor,
    nodePath: string,
    propertyPath: string,
    value: AnimatableValue,
  ): void {
    const mesh = actor.getComponent(MeshRendererComponent);
    const root = mesh?.assetRoot;
    if (!root) return;

    if (propertyPath.startsWith('morph.')) {
      const storageKey = propertyPath.slice('morph.'.length);
      const { morphName } = decodeMorphStorageKey(storageKey);
      applyMorphInfluence(root, nodePath, morphName, value as number);
      if (mesh && typeof value === 'number') {
        const prev = mesh.props.morphInfluences ?? {};
        mesh.setProps({ morphInfluences: { ...prev, [storageKey]: value } });
      }
      return;
    }

    const node = findGltfNodeByPath(root, nodePath);
    if (!node) return;

    if (propertyPath === 'position' && Array.isArray(value) && value.length >= 3) {
      node.position.set(value[0] as number, value[1] as number, value[2] as number);
      return;
    }
    if (propertyPath === 'rotation' && Array.isArray(value) && value.length >= 3) {
      node.rotation.set(value[0] as number, value[1] as number, value[2] as number);
      return;
    }
    if (propertyPath === 'scale' && Array.isArray(value) && value.length >= 3) {
      node.scale.set(value[0] as number, value[1] as number, value[2] as number);
    }
  }

  private _addContribution(
    track: AnimationTrack,
    value: AnimatableValue,
    weight: number,
    layer: number,
    additive: boolean,
  ): void {
    const componentType = track.descriptor.componentType;
    const propertyPath = track.descriptor.propertyPath;
    const key = `${track.targetActorId}|${componentType}|${propertyPath}`;
    let list = this._mixBuckets.get(key);
    if (!list) {
      list = [];
      this._mixBuckets.set(key, list);
    }
    list.push({
      layer,
      weight,
      valueType: track.descriptor.valueType,
      value,
      additive,
    });
  }

  private _applyMixedContributions(): void {
    const scenes = this._runtime?.activeScenes ?? [];
    for (const [key, list] of this._mixBuckets) {
      const final = mixContributions(list);
      if (final === undefined) continue;
      const [actorId, componentType, propertyPath] = key.split('|');
      const actor = this._findActor(scenes, actorId);
      if (!actor) continue;
      const component = actor.components.find((c) => c.type === componentType);
      if (!component) continue;
      if (
        componentType === 'MeshRendererComponent' &&
        propertyPath.startsWith('morph.')
      ) {
        this._applyMeshMorphContribution(
          component as unknown as {
            props: { morphInfluences?: Record<string, number> };
            setProps: (patch: Record<string, unknown>) => void;
          },
          propertyPath,
          final,
        );
        continue;
      }
      // Route through setProps so components (e.g., TransformComponent) get
      // their onPropsChanged() hook and can sync Three.js objects. Mutating
      // `component.props` in place is invisible to the component.
      this._setPropertyByPath(
        component as unknown as {
          props: Record<string, unknown>;
          setProps: (patch: Record<string, unknown>) => void;
        },
        propertyPath,
        final,
      );
    }
  }

  private _findActor(scenes: ReadonlyArray<Scene>, actorId: string): Actor | undefined {
    for (const scene of scenes) {
      const actor = scene.findActorById(actorId);
      if (actor) return actor;
    }
    return undefined;
  }

  private _dispatchMarkers(clip: AnimationClip, player: AnimationPlayerComponent): void {
    if (clip.markers.length === 0) return;
    const prev = this._lastTimeByPlayer.get(player) ?? player.time;
    const curr = player.time;
    this._lastTimeByPlayer.set(player, curr);

    // Only fire markers crossed during forward play. Looping/pingPong wrap is
    // best-effort: when current < previous (a wrap), the late markers fire on
    // the next forward pass.
    if (curr <= prev) return;
    for (const marker of clip.markers) {
      if (marker.time > prev && marker.time <= curr) {
        this.events.emit('markerReached', { player, marker });
        if (marker.eventName && player.onMarker) player.onMarker(marker);
      }
    }
  }

  private _evaluateTrack(track: AnimationTrack, time: number): AnimatableValue | undefined {
    const { keyframes, descriptor } = track;
    if (keyframes.length === 0) return undefined;
    if (time <= keyframes[0].time) return keyframes[0].value;
    if (time >= keyframes[keyframes.length - 1].time)
      return keyframes[keyframes.length - 1].value;

    for (let i = 0; i < keyframes.length - 1; i++) {
      const kf0 = keyframes[i];
      const kf1 = keyframes[i + 1];
      if (time >= kf0.time && time <= kf1.time) {
        const dur = kf1.time - kf0.time;
        const localT = dur > 0 ? (time - kf0.time) / dur : 0;
        const easedT = clamp01(applyEasing(localT, kf0.easing, kf0.bezierHandles));
        return interpolateValue(kf0.value, kf1.value, easedT, descriptor.valueType);
      }
    }
    return undefined;
  }

  private _applyMeshMorphContribution(
    component: {
      props: { morphInfluences?: Record<string, number> };
      setProps: (patch: Record<string, unknown>) => void;
    },
    propertyPath: string,
    value: AnimatableValue,
  ): void {
    if (typeof value !== 'number') return;
    const storageKey = propertyPath.slice('morph.'.length);
    const prev = component.props.morphInfluences ?? {};
    component.setProps({
      morphInfluences: { ...prev, [storageKey]: value },
    });
  }

  private _setPropertyByPath(
    component: { props: Record<string, unknown>; setProps: (patch: Record<string, unknown>) => void },
    path: string,
    value: AnimatableValue,
  ): void {
    const parts = path.split('.');
    // Fast path: top-level prop — shallow patch is enough.
    if (parts.length === 1) {
      const key = parts[0];
      if (!(key in component.props)) return;
      component.setProps({ [key]: value });
      return;
    }
    // Nested path: clone the top-level container, set the leaf, then patch.
    const topKey = parts[0];
    const topVal = component.props[topKey];
    if (topVal === undefined || topVal === null) return;
    const cloned = this._deepClone(topVal);
    let cursor: Record<string, unknown> | unknown[] = cloned as never;
    for (let i = 1; i < parts.length - 1; i++) {
      const next = (cursor as Record<string, unknown>)[parts[i]];
      if (next === undefined || next === null) return;
      cursor = next as Record<string, unknown> | unknown[];
    }
    const finalKey = parts[parts.length - 1];
    if (Array.isArray(cursor)) {
      const index = parseInt(finalKey, 10);
      if (Number.isNaN(index) || index < 0 || index >= cursor.length) return;
      cursor[index] = value;
    } else {
      if (!(finalKey in (cursor as Record<string, unknown>))) return;
      (cursor as Record<string, unknown>)[finalKey] = value;
    }
    component.setProps({ [topKey]: cloned });
  }

  private _deepClone<T>(v: T): T {
    if (typeof structuredClone === 'function') return structuredClone(v);
    return JSON.parse(JSON.stringify(v)) as T;
  }
}

function clamp01(value: number): number {
  return Math.max(0, Math.min(1, value));
}
