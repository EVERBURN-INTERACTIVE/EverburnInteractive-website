import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader.js';
import { SystemPriority } from '@shared/types';
import { CameraComponent } from '../components/camera.component';
import { ArcadeFxShader, arcadeFxActive } from '../shaders/arcade-fx.shader';
import type { Runtime } from '../runtime';
import type { Scene } from '../scene';
import type { System } from './system';

/**
 * The Rendering system runs last every frame. It iterates each active scene
 * in render order, looks up the scene's main camera, applies scene-level
 * render settings (clear flags, background, fog), and submits the draw to
 * the shared {@link THREE.WebGLRenderer}.
 *
 * When {@link RuntimeContext.fxaaEnabled} is true, or arcade post-FX is
 * active, the first (primary) scene is drawn through an EffectComposer.
 */
export class RenderingSystem implements System {
  readonly name = 'RenderingSystem';
  readonly priority = SystemPriority.RENDERING;

  private _runtime: Runtime | undefined;
  private readonly _clearColor = new THREE.Color();
  private _overrideCamera: THREE.Camera | undefined;
  private _composer: EffectComposer | undefined;
  private _renderPass: RenderPass | undefined;
  private _arcadePass: ShaderPass | undefined;
  private _fxaaPass: ShaderPass | undefined;
  private _composerSize = { w: 0, h: 0 };
  private _composerUsesFxaa = false;

  onRegister(runtime: Runtime): void {
    this._runtime = runtime;
  }

  onUnregister(): void {
    this._disposeComposer();
    this._runtime = undefined;
  }

  /**
   * Override the camera used to render every active scene. Intended for the
   * editor's viewport camera, which is independent of the scene's main
   * camera (the one exported sites will use). Pass `null` to clear.
   */
  setOverrideCamera(camera: THREE.Camera | null | undefined): void {
    this._overrideCamera = camera ?? undefined;
  }

  /** Camera currently overriding scene main cameras, if any. */
  get overrideCamera(): THREE.Camera | undefined {
    return this._overrideCamera;
  }

  onUpdate(_dt: number): void {
    if (!this._runtime) return;
    const { renderer, fxaaEnabled, arcadeFx } = this._runtime.context;
    const useArcade = arcadeFxActive(arcadeFx);
    const useComposer = fxaaEnabled || useArcade;
    const scenes = [...this._runtime.activeScenes]
      .filter((s) => !s.nested)
      .sort((a, b) => a.renderOrder - b.renderOrder);
    if (scenes.length === 0) {
      renderer.clear(true, true, false);
      return;
    }

    for (let i = 0; i < scenes.length; i++) {
      const scene = scenes[i];
      const camera = this._getMainCamera(scene);
      if (!camera) continue;
      this._applySettings(scene, i === 0);
      renderer.autoClear = false;
      if (i === 0 || scene.settings.clearColor || scene.settings.clearDepth) {
        renderer.clear(scene.settings.clearColor, scene.settings.clearDepth, false);
      }

      if (i === 0 && useComposer) {
        this._renderWithComposer(scene.threeScene, camera, fxaaEnabled, useArcade);
      } else {
        if (i === 0 && !useComposer && this._composer) {
          this._disposeComposer();
        }
        renderer.render(scene.threeScene, camera);
      }
    }
  }

  private _renderWithComposer(
    threeScene: THREE.Scene,
    camera: THREE.Camera,
    fxaaEnabled: boolean,
    useArcade: boolean,
  ): void {
    const ctx = this._runtime!.context;
    const renderer = ctx.renderer;
    const size = new THREE.Vector2();
    renderer.getSize(size);
    const w = Math.max(1, Math.floor(size.x));
    const h = Math.max(1, Math.floor(size.y));
    const dpr = renderer.getPixelRatio();

    if (!this._composer || this._composerUsesFxaa !== fxaaEnabled) {
      this._disposeComposer();
      this._composer = new EffectComposer(renderer);
      this._renderPass = new RenderPass(threeScene, camera);
      this._composer.addPass(this._renderPass);
      this._arcadePass = new ShaderPass(ArcadeFxShader);
      this._composer.addPass(this._arcadePass);
      if (fxaaEnabled) {
        this._fxaaPass = new ShaderPass(FXAAShader);
        this._composer.addPass(this._fxaaPass);
      }
      this._composerUsesFxaa = fxaaEnabled;
      this._composerSize = { w: 0, h: 0 };
    } else if (this._renderPass) {
      this._renderPass.scene = threeScene;
      this._renderPass.camera = camera;
    }

    if (this._arcadePass) {
      const u = this._arcadePass.material.uniforms;
      const fx = ctx.arcadeFx;
      u['chromaticAberration'].value = useArcade ? fx.chromaticAberration : 0;
      u['vignette'].value = useArcade ? fx.vignette : 0;
      u['scanline'].value = useArcade ? fx.scanline : 0;
      u['glitch'].value = useArcade ? fx.glitch : 0;
      u['invert'].value = useArcade ? fx.invert : 0;
      u['flash'].value = useArcade ? fx.flash : 0;
      u['time'].value = fx.time;
      u['resolution'].value.set(w * dpr, h * dpr);
    }

    if (this._composerSize.w !== w || this._composerSize.h !== h) {
      this._composer.setSize(w, h);
      this._composer.setPixelRatio(dpr);
      if (this._fxaaPass) {
        this._fxaaPass.material.uniforms['resolution'].value.set(1 / (w * dpr), 1 / (h * dpr));
      }
      this._composerSize = { w, h };
    }

    this._composer.render();
  }

  private _disposeComposer(): void {
    this._composer?.dispose();
    this._composer = undefined;
    this._renderPass = undefined;
    this._arcadePass = undefined;
    this._fxaaPass = undefined;
    this._composerUsesFxaa = false;
    this._composerSize = { w: 0, h: 0 };
  }

  private _applySettings(scene: Scene, isFirst: boolean): void {
    const { renderer } = this._runtime!.context;
    const { background, fog } = scene.settings;
    if (isFirst && background) {
      this._clearColor.set(background);
      renderer.setClearColor(this._clearColor, 1);
      // Do not clobber an HDRI / texture background owned by EnvironmentComponent.
      const currentBg = scene.threeScene.background;
      if (!(currentBg instanceof THREE.Texture)) {
        if (currentBg instanceof THREE.Color) {
          currentBg.copy(this._clearColor);
        } else {
          scene.threeScene.background = this._clearColor.clone();
        }
      }
    } else if (isFirst && background === null) {
      renderer.setClearAlpha(0);
      if (!(scene.threeScene.background instanceof THREE.Texture)) {
        scene.threeScene.background = null;
      }
    }
    if (fog) {
      const existing = scene.threeScene.fog;
      if (existing instanceof THREE.Fog) {
        existing.color.set(fog.color);
        existing.near = fog.near;
        existing.far = fog.far;
      } else {
        scene.threeScene.fog = new THREE.Fog(fog.color, fog.near, fog.far);
      }
    }
    // When settings.fog is absent, leave threeScene.fog alone — EnvironmentComponent
    // may own it. Never force-null it every frame.
  }

  private _getMainCamera(scene: Scene): THREE.Camera | undefined {
    if (this._overrideCamera) return this._overrideCamera;
    const id = scene.mainCameraActorId;
    if (!id) return undefined;
    const actor = scene.findActorById(id);
    return actor?.getComponent(CameraComponent)?.camera;
  }
}
