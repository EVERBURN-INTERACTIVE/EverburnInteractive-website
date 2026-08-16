import * as THREE from 'three';
import type { SerializedComponentProps } from '@shared/types';
import { BaseComponent } from '../scene/component';
import type { Actor } from '../scene/actor';
import type { Scene } from '../scene/scene';
import type { AssetId } from '../assets/types';

/**
 * Serialized {@link AudioComponent} properties.
 *
 * v1 schema. A component may be spatial (positional, falls off with
 * distance, follows the actor's transform) or non-spatial (UI / music).
 */
export interface AudioProps extends SerializedComponentProps {
  readonly _version: 1;
  /** Audio asset to play. When undefined the component is silent. */
  audioAssetId?: AssetId;
  /** Start playback automatically on first user gesture. */
  autoplay: boolean;
  /** Loop playback indefinitely. */
  loop: boolean;
  /** Linear volume in `[0, 1]`. */
  volume: number;
  /** Playback rate (`1` = real-time). Clamped to `[0.1, 4]`. */
  playbackRate: number;
  /** When true, the audio source is positional (3D) and uses the listener. */
  spatial: boolean;
  /** Inner reference distance (`PositionalAudio.setRefDistance`). */
  refDistance: number;
  /** Maximum distance after which volume stops dropping (`setMaxDistance`). */
  maxDistance: number;
  /** Rolloff factor (`setRolloffFactor`). */
  rolloffFactor: number;
  /** Distance model (`setDistanceModel`). */
  distanceModel: 'linear' | 'inverse' | 'exponential';
  /** Stereo pan for non-spatial sources in `[-1, 1]`. */
  pan: number;
}

/** Default props factory. */
export function makeAudioProps(patch: Partial<Omit<AudioProps, '_version'>> = {}): AudioProps {
  const out: AudioProps = {
    _version: 1,
    autoplay: patch.autoplay ?? false,
    loop: patch.loop ?? false,
    volume: patch.volume ?? 1,
    playbackRate: patch.playbackRate ?? 1,
    spatial: patch.spatial ?? false,
    refDistance: patch.refDistance ?? 1,
    maxDistance: patch.maxDistance ?? 100,
    rolloffFactor: patch.rolloffFactor ?? 1,
    distanceModel: patch.distanceModel ?? 'inverse',
    pan: patch.pan ?? 0,
  };
  if (patch.audioAssetId) out.audioAssetId = patch.audioAssetId;
  return out;
}

/**
 * AudioComponent plays an {@link AudioAssetRecord} at the actor's location.
 *
 * The component instantiates a `THREE.Audio` or `THREE.PositionalAudio`
 * depending on `props.spatial`, registers it with the parent actor, and
 * lets the {@link AudioSystem} drive playback. The Web Audio context is
 * lazy-created by the system on the first user gesture (browser policy).
 *
 * Lifecycle:
 *  - `onAttach` -> adds an empty `THREE.Audio` to the actor's `Object3D`.
 *  - `onSceneAttach` -> asks the system to (re)bind/listen for context.
 *  - `onDetach` -> stops and removes the audio source.
 *
 * Playback control: `play()`, `pause()`, `stop()`, `seek(t)`. Property
 * changes propagate to the underlying Three.js node via `onPropsChanged`.
 */
export class AudioComponent extends BaseComponent<AudioProps> {
  static readonly typeName = 'AudioComponent';

  private _audio: THREE.Audio | THREE.PositionalAudio | undefined;
  private _panner: StereoPannerNode | undefined;
  private _bufferToken = 0;
  /** Set when the user pressed play before the buffer was ready. */
  private _wantsPlay = false;

  /** Underlying Three.js audio node (positional or non-positional). */
  get audio(): THREE.Audio | THREE.PositionalAudio | undefined {
    return this._audio;
  }

  /** True while the audio is actively playing. */
  get isPlaying(): boolean {
    return this._audio?.isPlaying ?? false;
  }

  onAttach(actor: Actor): void {
    super.onAttach(actor);
  }

  onSceneAttach(scene: Scene): void {
    super.onSceneAttach(scene);
    const system = scene.runtime?.systems.find((s) => s.name === 'AudioSystem') as
      | { register: (c: AudioComponent) => void }
      | undefined;
    system?.register(this);
  }

  onSceneDetach(scene: Scene): void {
    const system = scene.runtime?.systems.find((s) => s.name === 'AudioSystem') as
      | { unregister: (c: AudioComponent) => void }
      | undefined;
    system?.unregister(this);
    this._teardown();
    super.onSceneDetach(scene);
  }

  onDetach(): void {
    this._teardown();
    super.onDetach();
  }

  /**
   * Attach the component to the system's listener and (re)build the
   * underlying audio node. Called by {@link AudioSystem.register}.
   * @internal
   */
  _bindListener(listener: THREE.AudioListener): void {
    if (!this._actor) return;
    if (this._audio) {
      this._teardown();
    }
    const audio = this._props.spatial
      ? new THREE.PositionalAudio(listener)
      : new THREE.Audio(listener);
    audio.setLoop(this._props.loop);
    audio.setVolume(this._props.volume);
    audio.setPlaybackRate(this._props.playbackRate);
    if (audio instanceof THREE.PositionalAudio) {
      audio.setRefDistance(this._props.refDistance);
      audio.setMaxDistance(this._props.maxDistance);
      audio.setRolloffFactor(this._props.rolloffFactor);
      audio.setDistanceModel(this._props.distanceModel);
    }
    this._actor.object3D.add(audio);
    this._audio = audio;
    this._applyPan();
  }

  /**
   * Bind a decoded {@link AudioBuffer}. Called by {@link AudioSystem} after
   * the asset has been loaded. Resumes playback if `play()` was queued.
   * @internal
   */
  _bindBuffer(buffer: AudioBuffer, token: number): void {
    if (!this._audio || token !== this._bufferToken) return;
    this._audio.setBuffer(buffer);
    if (this._wantsPlay || this._props.autoplay) {
      this._wantsPlay = false;
      this._safePlay();
    }
  }

  /** Bump the binding token (called on prop changes that swap the asset). */
  _newBufferToken(): number {
    return ++this._bufferToken;
  }

  /** Get the current binding token. */
  get bufferToken(): number {
    return this._bufferToken;
  }

  /** Start (or resume) playback. Idempotent. */
  play(): void {
    if (!this._audio || !this._audio.buffer) {
      this._wantsPlay = true;
      return;
    }
    this._safePlay();
  }

  /** Pause playback (keeps position). */
  pause(): void {
    this._wantsPlay = false;
    if (this._audio?.isPlaying) this._audio.pause();
  }

  /** Stop playback and reset to 0. */
  stop(): void {
    this._wantsPlay = false;
    if (this._audio?.isPlaying || this._audio?.buffer) this._audio.stop();
  }

  /** Seek to a time in seconds (recreates the playback when actively playing). */
  seek(time: number): void {
    if (!this._audio) return;
    this._audio.offset = Math.max(0, time);
    if (this._audio.isPlaying) {
      this._audio.stop();
      this._safePlay();
    }
  }

  protected onPropsChanged(): void {
    if (!this._audio) return;
    this._audio.setLoop(this._props.loop);
    this._audio.setVolume(this._props.volume);
    this._audio.setPlaybackRate(this._props.playbackRate);
    if (this._audio instanceof THREE.PositionalAudio) {
      this._audio.setRefDistance(this._props.refDistance);
      this._audio.setMaxDistance(this._props.maxDistance);
      this._audio.setRolloffFactor(this._props.rolloffFactor);
      this._audio.setDistanceModel(this._props.distanceModel);
    }
    this._applyPan();
    // Notify the system so it can re-resolve the buffer when the asset changes.
    const scene = this._actor?.scene;
    const system = scene?.runtime?.systems.find((s) => s.name === 'AudioSystem') as
      | { reloadBufferFor: (c: AudioComponent) => void }
      | undefined;
    system?.reloadBufferFor(this);
  }

  private _safePlay(): void {
    if (!this._audio || !this._audio.buffer) return;
    try {
      if (!this._audio.isPlaying) this._audio.play();
    } catch {
      // Some browsers throw when the AudioContext is suspended; the
      // system will retry on the next user gesture.
      this._wantsPlay = true;
    }
  }

  private _applyPan(): void {
    if (!this._audio || this._audio instanceof THREE.PositionalAudio) return;
    const ctx = (this._audio as THREE.Audio).context;
    // Lazily insert a StereoPannerNode in front of the gain node so that
    // mono audio can still be panned without recreating the source.
    if (!this._panner) {
      if (typeof ctx.createStereoPanner !== 'function') return;
      this._panner = ctx.createStereoPanner();
      const gain = (this._audio as THREE.Audio).getOutput();
      gain.disconnect();
      gain.connect(this._panner);
      this._panner.connect(ctx.destination);
    }
    this._panner.pan.value = Math.max(-1, Math.min(1, this._props.pan));
  }

  private _teardown(): void {
    if (this._audio) {
      if (this._audio.isPlaying) this._audio.stop();
      this._audio.removeFromParent();
      this._audio.disconnect();
      this._audio = undefined;
    }
    this._panner = undefined;
  }
}
