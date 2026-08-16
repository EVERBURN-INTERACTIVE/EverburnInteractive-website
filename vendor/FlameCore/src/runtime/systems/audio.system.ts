import * as THREE from 'three';
import { SystemPriority } from '@shared/types';
import { CameraComponent } from '../components/camera.component';
import type { AudioComponent } from '../components/audio.component';
import type { Runtime } from '../runtime';
import type { System } from './system';

/**
 * The AudioSystem owns the singleton `THREE.AudioListener`, attaches it to
 * the active main camera, resolves audio buffers through the
 * {@link AssetLoader}, and drives playback for every registered
 * {@link AudioComponent}.
 *
 * Web Audio context lifecycle:
 *  - The listener (and therefore its underlying `AudioContext`) is created
 *    lazily on the first `register()` call or first user gesture.
 *  - Browsers require a user gesture to start audio; the system installs a
 *    one-shot `pointerdown` listener on `document` that calls `resume()`.
 *
 * Priority: 35 — between PHYSICS (30) and ANIMATION (40) so spatial audio
 * uses post-physics actor transforms but precedes animation overrides.
 */
export class AudioSystem implements System {
  readonly name = 'AudioSystem';
  readonly priority = SystemPriority.PHYSICS + 5;

  private _runtime: Runtime | undefined;
  private _listener: THREE.AudioListener | undefined;
  private _components = new Set<AudioComponent>();
  private _resumeListenerInstalled = false;
  private _masterVolume = 1;

  /** Lazily-created singleton audio listener. */
  get listener(): THREE.AudioListener | undefined {
    return this._listener;
  }

  /** Master gain applied to every registered audio source. */
  get masterVolume(): number {
    return this._masterVolume;
  }
  setMasterVolume(value: number): void {
    this._masterVolume = Math.max(0, Math.min(1, value));
    if (this._listener) {
      this._listener.setMasterVolume(this._masterVolume);
    }
  }

  onRegister(runtime: Runtime): void {
    this._runtime = runtime;
  }

  onUnregister(): void {
    for (const c of [...this._components]) this.unregister(c);
    this._components.clear();
    if (this._listener) {
      this._listener.removeFromParent();
      this._listener = undefined;
    }
    this._runtime = undefined;
  }

  /** Register an {@link AudioComponent} and (re)load its buffer. */
  register(component: AudioComponent): void {
    this._components.add(component);
    this._ensureListener();
    if (this._listener) {
      component._bindListener(this._listener);
    }
    this._loadBufferFor(component);
  }

  /** Unregister an {@link AudioComponent}. */
  unregister(component: AudioComponent): void {
    this._components.delete(component);
  }

  onUpdate(_dt: number): void {
    if (!this._runtime) return;
    // Make sure the listener is attached to the current main camera so
    // spatial audio reflects camera movement.
    if (this._listener) {
      for (const scene of this._runtime.activeScenes) {
        const id = scene.mainCameraActorId;
        if (!id) continue;
        const cam = scene.findActorById(id)?.getComponent(CameraComponent)?.camera;
        if (cam && this._listener.parent !== cam) {
          this._listener.removeFromParent();
          cam.add(this._listener);
        }
        break;
      }
    }
  }

  /**
   * Re-resolve the buffer for a single component. Called by the component
   * when `audioAssetId` changes or by `register` after first attach.
   */
  reloadBufferFor(component: AudioComponent): void {
    this._loadBufferFor(component);
  }

  private _ensureListener(): void {
    if (this._listener || !this._runtime) return;
    // jsdom & some headless environments don't expose AudioContext.
    const Ctx =
      (globalThis as { AudioContext?: typeof AudioContext }).AudioContext ??
      (globalThis as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return;
    this._listener = new THREE.AudioListener();
    this._listener.setMasterVolume(this._masterVolume);
    this._installResumeOnGesture();
  }

  private _installResumeOnGesture(): void {
    if (this._resumeListenerInstalled) return;
    if (typeof document === 'undefined') return;
    const resume = (): void => {
      const ctx = this._listener?.context;
      if (ctx && ctx.state !== 'running') {
        void ctx.resume();
      }
      // Replay any components that were waiting for the context.
      for (const c of this._components) {
        if (c.audio && c.audio.buffer && c.props.autoplay && !c.isPlaying) {
          c.play();
        }
      }
    };
    document.addEventListener('pointerdown', resume, { once: false, passive: true });
    document.addEventListener('keydown', resume, { once: false, passive: true });
    document.addEventListener('touchstart', resume, { once: false, passive: true });
    this._resumeListenerInstalled = true;
  }

  private _loadBufferFor(component: AudioComponent): void {
    if (!this._runtime || !this._listener) return;
    const id = component.props.audioAssetId;
    if (!id) return;
    const token = component._newBufferToken();
    const ctx = this._listener.context;
    void this._runtime.context.loader
      .loadAudioBuffer(id, ctx)
      .then((buffer) => {
        component._bindBuffer(buffer, token);
      })
      .catch(() => {
        // Silently swallow load errors; the component remains silent.
      });
  }
}
