import type { SerializedComponentProps } from '@shared/types';
import type { AnimationMarker, PlaybackMode } from '@shared/types/animation';
import { BaseComponent } from '../scene/component';
import { AnimationSystem } from '../systems/animation.system';

/** Playback state of the animation player. */
export type PlaybackState = 'stopped' | 'playing' | 'paused';

/** Serialized animation player properties. */
export interface AnimationPlayerProps extends SerializedComponentProps {
  readonly _version: 1;
  /** ID of the clip asset to play. Resolved by the {@link AnimationSystem}. */
  clipId: string | undefined;
  /** Playback mode: `once`, `loop`, or `pingPong`. */
  playbackMode: PlaybackMode;
  /** Playback rate. `1` = real-time, `2` = double speed, negative = reverse. */
  playbackRate: number;
  /** Auto-start on attach. */
  autoplay: boolean;
  /** Mixer weight in `[0, 1]` — how much this player influences the output. */
  weight: number;
  /** Mixer layer — higher layers override lower ones. */
  layer: number;
  /** When true, this player adds to the lower-layer accumulator. */
  additive: boolean;
}

/** Factory for default animation player props. */
export function makeAnimationPlayerProps(
  patch: Partial<Omit<AnimationPlayerProps, '_version'>> = {},
): AnimationPlayerProps {
  return {
    _version: 1,
    clipId: patch.clipId,
    playbackMode: patch.playbackMode ?? 'loop',
    playbackRate: patch.playbackRate ?? 1,
    autoplay: patch.autoplay ?? true,
    weight: patch.weight ?? 1,
    layer: patch.layer ?? 0,
    additive: patch.additive ?? false,
  };
}

/**
 * AnimationPlayerComponent plays an {@link AnimationClip} on an actor. The
 * {@link AnimationSystem} evaluates the clip and writes interpolated values
 * onto target component props.
 *
 * Supports `once` / `loop` / `pingPong` playback, variable rate, and a
 * mixer-layer + weight pair so multiple players can be blended on the same
 * actor.
 */
export class AnimationPlayerComponent extends BaseComponent<AnimationPlayerProps> {
  static readonly typeName = 'AnimationPlayerComponent';

  /** Fired by the system the first time the playhead crosses each marker. */
  onMarker: ((marker: AnimationMarker) => void) | undefined;
  /** Fired once the clip reaches the end in `once` mode. */
  onComplete: (() => void) | undefined;
  /** Fired each time the clip wraps in `loop` or `pingPong` mode. */
  onLoop: (() => void) | undefined;

  private _state: PlaybackState = 'stopped';
  private _time = 0;
  private _clipDuration = 0;
  private _direction = 1;

  /** Current playback state. */
  get state(): PlaybackState {
    return this._state;
  }

  /** Current playback time in seconds. */
  get time(): number {
    return this._time;
  }

  /** Cached clip duration (set by AnimationSystem on first evaluation). */
  get clipDuration(): number {
    return this._clipDuration;
  }
  set clipDuration(duration: number) {
    this._clipDuration = duration;
  }

  /** Mixer weight `[0, 1]`. */
  get weight(): number {
    return this._props.weight;
  }

  /** Mixer layer (higher overrides lower). */
  get layer(): number {
    return this._props.layer;
  }

  /** True when this player's contributions should be added to lower layers. */
  get additive(): boolean {
    return this._props.additive;
  }

  /** Normalized progress in `[0, 1]`. */
  get progress(): number {
    if (this._clipDuration <= 0) return 0;
    return Math.max(0, Math.min(1, this._time / this._clipDuration));
  }
  set progress(value: number) {
    this.seek(value * this._clipDuration);
  }

  onAttach(actor: Parameters<BaseComponent<AnimationPlayerProps>['onAttach']>[0]): void {
    super.onAttach(actor);
    // Bug fix #3: typed system lookup instead of string-find + `any` cast.
    this._tryRegister(actor.scene);
    this._lastClipId = this._props.clipId;
    if (this._props.autoplay) this.play();
  }

  onSceneAttach(scene: import('../scene/scene').Scene): void {
    super.onSceneAttach(scene);
    // Starter/deserialized actors attach components before the scene has a
    // runtime; registration must happen once `loadScene` binds it.
    this._tryRegister(scene);
    if (this._props.autoplay && this._state !== 'playing') this.play();
  }

  onDetach(): void {
    const animSystem = this.actor?.scene?.runtime?.getSystem(AnimationSystem);
    animSystem?.unregisterPlayer(this);
    super.onDetach();
  }

  private _tryRegister(scene: import('../scene/scene').Scene | undefined): void {
    const animSystem = scene?.runtime?.getSystem(AnimationSystem);
    animSystem?.registerPlayer(this);
  }

  /**
   * Hook called by {@link BaseComponent.setProps}. Keeps playback state in
   * sync with prop changes that originate outside the component itself —
   * for example, the editor's Inspector flipping `autoplay` on, picking a
   * different `clipId`, or swapping `playbackMode`. Without this hook
   * autoplay only fires once during `onAttach`, so toggling it later in
   * the inspector would never start playback.
   */
  protected onPropsChanged(): void {
    const clipChanged = this._lastClipId !== this._props.clipId;
    if (clipChanged) {
      this._lastClipId = this._props.clipId;
      // A new clip invalidates the cached duration and rewinds the player so
      // the next evaluation starts from the new clip's first keyframe.
      this._clipDuration = 0;
      this._time = 0;
      this._direction = 1;
      // Stop current playback when clip changes to avoid playing stale data.
      if (this._state === 'playing') this._state = 'stopped';
    }
    // If autoplay is on and we have a clip and we're not playing, start.
    // This handles: toggling autoplay on, or selecting a clip after autoplay was already on.
    if (this._props.autoplay && this._props.clipId && this._state !== 'playing') {
      this.play();
    }
    // If autoplay is turned off while playing, stop.
    if (!this._props.autoplay && this._state === 'playing') {
      this.stop();
    }
  }

  private _lastClipId: string | undefined = undefined;

  onUpdate(dt: number): void {
    if (this._state !== 'playing') return;
    this._time += dt * this._props.playbackRate * this._direction;
    const mode = this._props.playbackMode;

    if (mode === 'once') {
      if (this._time >= this._clipDuration && this._clipDuration > 0) {
        this._time = this._clipDuration;
        this._state = 'stopped';
        this.onComplete?.();
      } else if (this._time < 0) {
        this._time = 0;
        this._state = 'stopped';
        this.onComplete?.();
      }
      return;
    }

    if (mode === 'loop') {
      if (this._clipDuration > 0) {
        let wrapped = false;
        while (this._time >= this._clipDuration) {
          this._time -= this._clipDuration;
          wrapped = true;
        }
        while (this._time < 0) {
          this._time += this._clipDuration;
          wrapped = true;
        }
        if (wrapped) this.onLoop?.();
      }
      return;
    }

    if (mode === 'pingPong') {
      if (this._time >= this._clipDuration) {
        this._time = this._clipDuration;
        this._direction = -1;
        this.onLoop?.();
      } else if (this._time < 0) {
        this._time = 0;
        this._direction = 1;
        this.onLoop?.();
      }
    }
  }

  /** Start or resume playback. */
  play(): void {
    this._state = 'playing';
  }

  /** Pause at the current time. */
  pause(): void {
    if (this._state === 'playing') this._state = 'paused';
  }

  /** Stop and reset to `t = 0`. */
  stop(): void {
    this._state = 'stopped';
    this._time = 0;
    this._direction = 1;
  }

  /** Jump to an absolute time in seconds (clamped to clip duration). */
  seek(time: number): void {
    this._time = Math.max(0, Math.min(time, this._clipDuration));
  }

  setPlaybackRate(rate: number): void {
    this.setProps({ ...this._props, playbackRate: rate });
  }

  setPlaybackMode(mode: PlaybackMode): void {
    this.setProps({ ...this._props, playbackMode: mode });
  }

  setClip(clipId: string | undefined): void {
    this.setProps({ ...this._props, clipId });
    this.stop();
  }

  setWeight(weight: number): void {
    this.setProps({ ...this._props, weight: Math.max(0, Math.min(1, weight)) });
  }

  setLayer(layer: number): void {
    this.setProps({ ...this._props, layer });
  }
}
