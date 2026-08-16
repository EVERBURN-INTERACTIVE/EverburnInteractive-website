import * as THREE from 'three';
import type { SerializedComponentProps } from '@shared/types';
import { BaseComponent } from '../scene/component';
import type { Actor } from '../scene/actor';
import type { Scene } from '../scene/scene';
import { CameraComponent } from './camera.component';
import { MeshRendererComponent } from './mesh-renderer.component';
import { RenderingSystem } from '../systems/rendering.system';
import { OneMoreSecondSimulation } from '../games/one-more-second/simulation';
import { OneMoreSecondWorldView } from '../games/one-more-second/world-view';
import { OneMoreSecondHud, readBestTime } from '../games/one-more-second/hud';
import { OneMoreSecondInput } from '../games/one-more-second/input';
import type { SimEvents } from '../games/one-more-second/types';

export interface OneMoreSecondGameProps extends SerializedComponentProps {
  readonly _version: 1;
  /** Master switch. */
  enabled: boolean;
  /** Actor whose mesh is hidden while the pooled player is drawn. */
  playerActorName: string;
}

export function makeOneMoreSecondGameProps(
  patch: Partial<Omit<OneMoreSecondGameProps, '_version'>> = {},
): OneMoreSecondGameProps {
  return {
    _version: 1,
    enabled: patch.enabled ?? true,
    playerActorName: patch.playerActorName ?? 'Player',
  };
}

const EMPTY_EVENTS: SimEvents = {
  nearMiss: false,
  fragment: false,
  crashed: false,
  rewindUsed: false,
  signatureRewind: false,
  restarted: false,
  died: false,
};

const _camPos = new THREE.Vector3();

/**
 * Gating gameplay component for the One More Second arcade runner.
 *
 * Corridor obstacles are pooled Three.js instances (not actors) so an endless
 * run cannot freeze the editor the way a star-field of discrete actors would.
 * Play mode / exported sites run the full game; the editor viewport shows an
 * attract loop until Play clears the fly-camera override.
 */
export class OneMoreSecondGameComponent extends BaseComponent<OneMoreSecondGameProps> {
  static readonly typeName = 'OneMoreSecondGameComponent';

  private _scene: Scene | undefined;
  private _sim: OneMoreSecondSimulation | undefined;
  private _view: OneMoreSecondWorldView | undefined;
  private _hud: OneMoreSecondHud | undefined;
  private _input: OneMoreSecondInput | undefined;
  private _playingSession = false;
  private _baseFov = 62;
  private readonly _shake = new THREE.Vector3();

  constructor(props: OneMoreSecondGameProps) {
    super(makeOneMoreSecondGameProps(props));
  }

  onSceneAttach(scene: Scene): void {
    super.onSceneAttach(scene);
    this._scene = scene;
    if (!this._props.enabled) return;
    this._boot(scene);
  }

  onSceneDetach(scene: Scene): void {
    this._teardown();
    this._scene = undefined;
    super.onSceneDetach(scene);
  }

  onDetach(): void {
    this._teardown();
    super.onDetach();
  }

  onUpdate(dt: number): void {
    if (!this._props.enabled || !this._scene || !this._sim || !this._view) return;
    const playing = this._isPlaySession(this._scene);
    this._input?.setActive(playing);
    if (playing !== this._playingSession) {
      this._playingSession = playing;
      this._sim.start(playing ? 'playing' : 'attract', (Math.random() * 1e9) | 0);
      this._clearArcadeFx();
    }

    const input = this._input?.sample(this._sim.phase) ?? {
      steer: 0,
      rewind: false,
      restart: false,
    };
    const events = playing || this._sim.phase === 'attract'
      ? this._sim.tick(dt, input)
      : EMPTY_EVENTS;
    const readout = this._sim.readout();
    this._view.sync(readout, events, dt);
    this._hud?.sync(readout, events, readout.timeAlive, playing && !this._hasOverrideCamera(this._scene));
    this._driveCamera(readout, dt);
    this._writeArcadeFx(readout, dt);
    this._syncPlayerActor(readout);
  }

  protected onPropsChanged(): void {
    if (!this._scene) return;
    if (!this._props.enabled) this._teardown();
    else if (!this._sim) this._boot(this._scene);
  }

  private _boot(scene: Scene): void {
    this._teardown();
    const runtime = scene.runtime;
    const sim = new OneMoreSecondSimulation((Math.random() * 1e9) | 0);
    const playing = this._isPlaySession(scene);
    sim.setBestTime(readBestTime());
    sim.start(playing ? 'playing' : 'attract');
    this._playingSession = playing;
    this._sim = sim;

    const view = new OneMoreSecondWorldView();
    view.attach(scene.threeScene);
    this._view = view;

    const overlay = runtime?.context.uiOverlay;
    if (overlay) {
      this._hud = new OneMoreSecondHud(
        overlay,
        () => this._input?.queueRewind(),
        () => this._input?.queueRestart(),
        sim.bestTime,
      );
    }
    this._input = new OneMoreSecondInput(runtime?.context.canvas);
    this._hidePlayerMeshes(scene, true);

    const cam = this._mainCamera(scene);
    if (cam instanceof THREE.PerspectiveCamera) this._baseFov = cam.fov;
  }

  private _teardown(): void {
    if (this._scene) this._hidePlayerMeshes(this._scene, false);
    if (this._view && this._scene) this._view.dispose(this._scene.threeScene);
    this._view = undefined;
    this._hud?.dispose();
    this._hud = undefined;
    this._input?.dispose();
    this._input = undefined;
    this._sim = undefined;
    this._clearArcadeFx();
  }

  private _isPlaySession(scene: Scene): boolean {
    return !this._hasOverrideCamera(scene);
  }

  private _hasOverrideCamera(scene: Scene): boolean {
    const rendering = scene.runtime?.getSystem(RenderingSystem);
    return Boolean(rendering?.overrideCamera);
  }

  private _mainCamera(scene: Scene): THREE.Camera | undefined {
    const id = scene.mainCameraActorId;
    if (!id) return undefined;
    return scene.findActorById(id)?.getComponent(CameraComponent)?.camera;
  }

  private _driveCamera(readout: ReturnType<OneMoreSecondSimulation['readout']>, dt: number): void {
    const scene = this._scene;
    if (!scene) return;
    const actorId = scene.mainCameraActorId;
    const actor = actorId ? scene.findActorById(actorId) : undefined;
    const cam = actor?.getComponent(CameraComponent)?.camera;
    if (!actor || !cam) return;

    const shakeAmp = readout.phase === 'crash' ? 0.07 : readout.shake;
    this._shake.set(
      (Math.random() - 0.5) * shakeAmp,
      (Math.random() - 0.5) * shakeAmp * 0.6,
      (Math.random() - 0.5) * shakeAmp * 0.3,
    );
    const tilt = Math.sin(readout.timeAlive * 0.7) * readout.cameraTilt;
    _camPos.set(
      readout.playerX * 0.28 + this._shake.x,
      1.78 + this._shake.y,
      -6.35 + this._shake.z,
    );
    actor.object3D.position.copy(_camPos);
    actor.object3D.up.set(0, 1, 0);
    actor.object3D.rotation.order = 'YXZ';
    // Actor Object3D.lookAt orients +Z at the target. A child Camera looks
    // down -Z, which flipped the play view 180°. Match the fly-camera yaw
    // that already frames the corridor correctly (yaw π looks down +Z).
    const pitch = -0.08;
    const yaw = Math.PI;
    actor.object3D.rotation.set(pitch, yaw, tilt + readout.playerX * 0.012);
    cam.up.set(0, 1, 0);
    cam.rotation.set(0, 0, 0);

    if (cam instanceof THREE.PerspectiveCamera) {
      const target = this._baseFov + readout.fovBoost;
      cam.fov += (target - cam.fov) * Math.min(1, dt * 3);
      cam.updateProjectionMatrix();
    }
  }

  private _writeArcadeFx(readout: ReturnType<OneMoreSecondSimulation['readout']>, dt: number): void {
    const fx = this._scene?.runtime?.context.arcadeFx;
    if (!fx) return;
    if (readout.phase === 'attract') {
      fx.chromaticAberration = 0.015;
      fx.vignette = 0.12;
      fx.scanline = 0.1;
      fx.glitch = 0;
      fx.invert = 0;
      fx.flash = 0;
      fx.time += dt;
      return;
    }
    fx.chromaticAberration = readout.chromatic;
    fx.vignette = readout.vignette;
    fx.scanline = 0.08 + readout.intensity * 0.1;
    fx.glitch = readout.glitch;
    fx.invert = readout.invert;
    fx.flash = readout.flash;
    fx.time += dt;
  }

  private _clearArcadeFx(): void {
    const fx = this._scene?.runtime?.context.arcadeFx;
    if (!fx) return;
    fx.chromaticAberration = 0;
    fx.vignette = 0;
    fx.scanline = 0;
    fx.glitch = 0;
    fx.invert = 0;
    fx.flash = 0;
  }

  private _syncPlayerActor(readout: ReturnType<OneMoreSecondSimulation['readout']>): void {
    const actor = this._scene?.actors.find((a) => a.name === this._props.playerActorName);
    if (!actor) return;
    actor.object3D.position.set(readout.playerX, readout.playerY, readout.playerZ);
  }

  private _hidePlayerMeshes(scene: Scene, hide: boolean): void {
    const actor = scene.actors.find((a) => a.name === this._props.playerActorName);
    if (!actor) return;
    actor.object3D.visible = !hide;
    const visit = (a: Actor): void => {
      const mesh = a.getComponent(MeshRendererComponent);
      if (mesh?.mesh) mesh.mesh.visible = !hide;
      for (const child of a.children) visit(child);
    };
    visit(actor);
  }
}
