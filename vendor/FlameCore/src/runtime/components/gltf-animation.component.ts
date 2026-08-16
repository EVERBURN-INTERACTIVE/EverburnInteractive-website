/**
 * Plays embedded GLTF animations via THREE.AnimationMixer (skeletal, quaternion,
 * morph targets). Use alongside {@link MeshRendererComponent} on the same actor.
 * @module @runtime/components/gltf-animation
 */

import * as THREE from 'three';
import type { GltfAnimationProps } from '@shared/types/gltf-animation';
import { BaseComponent } from '../scene/component';
import type { Scene } from '../scene/scene';
import { MeshRendererComponent } from './mesh-renderer.component';

/** Factory for default GLTF animation props. */
export function makeGltfAnimationProps(
  patch: Partial<Omit<GltfAnimationProps, '_version'>> = {},
): GltfAnimationProps {
  const out: GltfAnimationProps = {
    _version: 1,
    clipIndex: patch.clipIndex ?? 0,
    playbackMode: patch.playbackMode ?? 'loop',
    playbackRate: patch.playbackRate ?? 1,
    autoplay: patch.autoplay ?? true,
    weight: patch.weight ?? 1,
  };
  if (patch.clipName) out.clipName = patch.clipName;
  if (patch.normalizedTime !== undefined) out.normalizedTime = patch.normalizedTime;
  return out;
}

/**
 * GltfAnimationComponent drives THREE.AnimationMixer on the loaded GLTF root.
 * Supports armatures, quaternion rotation tracks, and morph targets without
 * converting clips to FlameCore keyframes.
 */
export class GltfAnimationComponent extends BaseComponent<GltfAnimationProps> {
  static readonly typeName = 'GltfAnimationComponent';

  private _mixer: THREE.AnimationMixer | undefined;
  private _action: THREE.AnimationAction | undefined;
  private _activeClip: THREE.AnimationClip | undefined;
  private _root: THREE.Object3D | undefined;
  private _time = 0;
  private _direction = 1;
  private _state: 'stopped' | 'playing' | 'paused' = 'stopped';

  /** Current playback state. */
  get state(): 'stopped' | 'playing' | 'paused' {
    return this._state;
  }

  /** Available clip names from the loaded mesh (empty until GLTF resolves). */
  get availableClipNames(): string[] {
    const mesh = this.actor?.getComponent(MeshRendererComponent);
    return mesh?.gltfAnimations.map((c) => c.name || 'Animation') ?? [];
  }

  onSceneAttach(scene: Scene): void {
    super.onSceneAttach(scene);
    void this._tryInitMixer();
  }

  onSceneDetach(scene: Scene): void {
    this._disposeMixer();
    super.onSceneDetach(scene);
  }

  onDetach(): void {
    this._disposeMixer();
    super.onDetach();
  }

  protected onPropsChanged(): void {
    this._syncAction();
  }

  onUpdate(dt: number): void {
    if (!this._mixer) {
      void this._tryInitMixer();
      return;
    }

    if (this._props.normalizedTime !== undefined && this._activeClip) {
      const t = clamp01(this._props.normalizedTime) * this._activeClip.duration;
      if (this._action) this._action.time = t;
      this._mixer.setTime(t);
      this._mixer.update(0);
      return;
    }

    if (this._state !== 'playing' || !this._action) return;

    const scaled = dt * this._props.playbackRate * this._direction;
    this._mixer.update(scaled);
    this._time = this._action.time;

    if (!this._activeClip) return;
    const dur = this._activeClip.duration;
    if (dur <= 0) return;

    if (this._props.playbackMode === 'once' && this._time >= dur) {
      this._action.time = dur;
      this.pause();
      return;
    }

    if (this._props.playbackMode === 'pingPong') {
      if (this._time >= dur) {
        this._direction = -1;
        this._action.time = dur;
      } else if (this._time <= 0) {
        this._direction = 1;
        this._action.time = 0;
      }
    }
  }

  /** Start playback of the configured clip. */
  play(): void {
    this._syncAction();
    if (!this._action) return;
    this._action.paused = false;
    this._state = 'playing';
  }

  /** Pause playback. */
  pause(): void {
    if (this._action) this._action.paused = true;
    this._state = 'paused';
  }

  /** Stop and reset to the start of the clip. */
  stop(): void {
    if (this._action) {
      this._action.stop();
      this._action.reset();
    }
    this._time = 0;
    this._direction = 1;
    this._state = 'stopped';
  }

  private async _tryInitMixer(): Promise<void> {
    const mesh = this.actor?.getComponent(MeshRendererComponent);
    const root = mesh?.assetRoot;
    if (!root || this._root === root) return;

    this._disposeMixer();
    this._root = root;
    const clips = mesh.gltfAnimations;
    if (clips.length === 0) return;

    this._mixer = new THREE.AnimationMixer(root);
    this._syncAction();
    if (this._props.autoplay) this.play();
  }

  private _syncAction(): void {
    if (!this._mixer) return;
    const mesh = this.actor?.getComponent(MeshRendererComponent);
    const clips = mesh?.gltfAnimations ?? [];
    if (clips.length === 0) return;

    const clip = this._resolveClip(clips);
    if (!clip) return;

    if (this._activeClip !== clip) {
      this._action?.stop();
      const action = this._mixer.clipAction(clip);
      this._action = action;
      this._activeClip = clip;
      action.setLoop(
        this._props.playbackMode === 'loop' || this._props.playbackMode === 'pingPong'
          ? THREE.LoopRepeat
          : THREE.LoopOnce,
        this._props.playbackMode === 'pingPong' ? 2 : Infinity,
      );
      action.clampWhenFinished = this._props.playbackMode === 'once';
    }

    const action = this._action;
    if (!action) return;
    action.setEffectiveWeight(this._props.weight);
    if (this._props.normalizedTime !== undefined) {
      action.time = clamp01(this._props.normalizedTime) * clip.duration;
      this._mixer.setTime(action.time);
    }
  }

  private _resolveClip(clips: ReadonlyArray<THREE.AnimationClip>): THREE.AnimationClip | undefined {
    if (this._props.clipName) {
      const byName = clips.find((c) => (c.name || 'Animation') === this._props.clipName);
      if (byName) return byName;
    }
    return clips[this._props.clipIndex] ?? clips[0];
  }

  private _disposeMixer(): void {
    this._action?.stop();
    this._action = undefined;
    this._mixer?.stopAllAction();
    this._mixer = undefined;
    this._activeClip = undefined;
    this._root = undefined;
    this._state = 'stopped';
  }
}

function clamp01(v: number): number {
  return Math.max(0, Math.min(1, v));
}
