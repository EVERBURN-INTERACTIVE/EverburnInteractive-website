import * as THREE from 'three';
import type { RGB, SerializedComponentProps } from '@shared/types';
import { BaseComponent } from '../scene/component';
import type { Actor } from '../scene/actor';
import type { AssetId } from '../assets/types';
import { CameraComponent } from './camera.component';
import { RenderingSystem } from '../systems/rendering.system';

/** How the scene background is drawn. */
export type BackgroundMode = 'color' | 'transparent' | 'hdri';

/** Camera-follow fog that opens while moving and settles when still. */
export interface DynamicFogSettings {
  /** Master switch for velocity-reactive fog. */
  enabled: boolean;
  /** Extra meters of `far` while moving at full speed. */
  moveClearance: number;
  /** Extra meters of `near` while moving (pushes the haze band outward). */
  nearClearance: number;
  /** Blend speed toward the open fog state (1/s). */
  openSpeed: number;
  /** Blend speed back to the resting fog when still (1/s). */
  settleSpeed: number;
  /** Forward camera speed (m/s) that reaches full clearance. */
  speedForFullClearance: number;
}

/** Serialized environment properties. */
export interface EnvironmentProps extends SerializedComponentProps {
  readonly _version: 1;
  backgroundMode: BackgroundMode;
  backgroundColor: RGB;
  /**
   * HDR equirectangular texture asset used when `backgroundMode === 'hdri'`.
   * The HDRI is also used as the scene's image-based lighting environment.
   */
  backgroundHdriAssetId?: AssetId;
  /** Whether to use the HDRI / procedural probe as image-based lighting. */
  useHdriAsEnvironment: boolean;
  /** Background blur amount applied to the HDRI in `[0, 1]`. */
  hdriBlurriness: number;
  /** Optional linear fog. Set `enabled` to false to disable. */
  fog: {
    enabled: boolean;
    color: RGB;
    near: number;
    far: number;
    /**
     * When set and enabled, fog near/far are camera-distance bases that open
     * while the active camera moves forward (hall “clearing” feel).
     */
    dynamic?: DynamicFogSettings;
  };
  /** Tone mapping exposure applied at the renderer. */
  exposure: number;
}

/** Factory for default dynamic-fog settings. */
export function makeDynamicFogSettings(
  patch: Partial<DynamicFogSettings> = {},
): DynamicFogSettings {
  return {
    enabled: patch.enabled ?? false,
    moveClearance: patch.moveClearance ?? 8,
    nearClearance: patch.nearClearance ?? 1.5,
    openSpeed: patch.openSpeed ?? 2.4,
    settleSpeed: patch.settleSpeed ?? 1.1,
    speedForFullClearance: patch.speedForFullClearance ?? 3.5,
  };
}

/** Factory for default environment props. */
export function makeEnvironmentProps(
  patch: Partial<Omit<EnvironmentProps, '_version'>> = {},
): EnvironmentProps {
  const fogPatch = patch.fog;
  const out: EnvironmentProps = {
    _version: 1,
    backgroundMode: patch.backgroundMode ?? 'color',
    backgroundColor: patch.backgroundColor ?? [0.04, 0.05, 0.06],
    useHdriAsEnvironment: patch.useHdriAsEnvironment ?? true,
    hdriBlurriness: patch.hdriBlurriness ?? 0,
    fog: fogPatch
      ? {
          enabled: fogPatch.enabled,
          color: fogPatch.color,
          near: fogPatch.near,
          far: fogPatch.far,
          ...(fogPatch.dynamic
            ? { dynamic: makeDynamicFogSettings(fogPatch.dynamic) }
            : {}),
        }
      : { enabled: false, color: [0.5, 0.5, 0.6], near: 10, far: 80 },
    exposure: patch.exposure ?? 1,
  };
  if (patch.backgroundHdriAssetId) out.backgroundHdriAssetId = patch.backgroundHdriAssetId;
  return out;
}

/**
 * Applies environment settings (background, fog, exposure) to the scene
 * containing this actor. There should normally be only one environment
 * component per scene.
 */
export class EnvironmentComponent extends BaseComponent<EnvironmentProps> {
  static readonly typeName = 'EnvironmentComponent';

  private _hdriTexture: THREE.Texture | undefined;
  private _envMap: THREE.Texture | undefined;
  private _hdriLoadToken = 0;
  private readonly _prevCamPos = new THREE.Vector3();
  private readonly _camForward = new THREE.Vector3();
  private readonly _camDelta = new THREE.Vector3();
  private _hasPrevCamPos = false;
  /** 0 = settled base fog, 1 = fully opened while moving. */
  private _clearance = 0;

  onAttach(actor: Actor): void {
    super.onAttach(actor);
  }

  onSceneAttach(_scene: import('../scene/scene').Scene): void {
    this._apply();
  }

  onSceneDetach(scene: import('../scene/scene').Scene): void {
    scene.threeScene.fog = null;
    scene.threeScene.environment = null;
    this._disposeHdri();
    this._hasPrevCamPos = false;
    this._clearance = 0;
  }

  onDetach(): void {
    this._disposeHdri();
    super.onDetach();
  }

  protected onPropsChanged(): void {
    this._apply();
  }

  onUpdate(dt: number): void {
    if (!this._props.fog.enabled || !this._props.fog.dynamic?.enabled) return;
    const scene = this._actor?.scene;
    if (!scene) return;
    const fogObj = scene.threeScene.fog;
    if (!(fogObj instanceof THREE.Fog)) return;

    const camera = this._resolveActiveCamera(scene);
    if (!camera) return;

    camera.getWorldPosition(this._camDelta);
    const dtSafe = Math.max(1e-4, dt);
    let forwardSpeed = 0;
    if (this._hasPrevCamPos) {
      this._camDelta.sub(this._prevCamPos).divideScalar(dtSafe);
      camera.getWorldDirection(this._camForward);
      forwardSpeed = Math.max(0, this._camDelta.dot(this._camForward));
    }
    camera.getWorldPosition(this._prevCamPos);
    this._hasPrevCamPos = true;

    const dyn = this._props.fog.dynamic;
    const target =
      dyn.speedForFullClearance <= 1e-4
        ? 0
        : Math.min(1, forwardSpeed / dyn.speedForFullClearance);
    const rate = target > this._clearance ? dyn.openSpeed : dyn.settleSpeed;
    const t = 1 - Math.exp(-rate * dtSafe);
    this._clearance += (target - this._clearance) * t;

    const baseNear = this._props.fog.near;
    const baseFar = Math.max(baseNear + 0.5, this._props.fog.far);
    const liveNear = baseNear + dyn.nearClearance * this._clearance;
    const liveFar = Math.max(liveNear + 0.5, baseFar + dyn.moveClearance * this._clearance);
    fogObj.near = liveNear;
    fogObj.far = liveFar;

    const existing = scene.settings.fog;
    if (existing) {
      scene.settings = {
        ...scene.settings,
        fog: { ...existing, near: liveNear, far: liveFar },
      };
    }
  }

  private _resolveActiveCamera(scene: import('../scene/scene').Scene): THREE.Camera | undefined {
    const runtime = scene.runtime;
    const override = runtime?.getSystem(RenderingSystem)?.overrideCamera;
    if (override) return override;
    const id = scene.mainCameraActorId;
    if (!id) return undefined;
    return scene.findActorById(id)?.getComponent(CameraComponent)?.camera;
  }

  private _apply(): void {
    const scene = this._actor?.scene;
    if (!scene) return;
    const p = this._props;
    const runtime = scene.runtime;

    if (runtime) {
      runtime.context.renderer.toneMappingExposure = p.exposure;
    }

    if (p.backgroundMode === 'transparent') {
      scene.settings = { ...scene.settings, background: null };
      scene.threeScene.background = null;
      scene.threeScene.backgroundBlurriness = 0;
      if (!p.useHdriAsEnvironment) {
        scene.threeScene.environment = null;
        this._disposeHdri();
      }
    } else if (p.backgroundMode === 'hdri' && p.backgroundHdriAssetId) {
      // Keep a visible color until the HDRI resolves (never leave a black void).
      const bg = this._colorFromLinearRgb(p.backgroundColor);
      const hex = `#${bg.getHexString()}`;
      scene.settings = { ...scene.settings, background: hex };
      scene.threeScene.background = bg;
      scene.threeScene.backgroundBlurriness = p.hdriBlurriness;
      this._loadHdri(p.backgroundHdriAssetId);
    } else {
      const bg = this._colorFromLinearRgb(p.backgroundColor);
      const hex = `#${bg.getHexString()}`;
      scene.settings = { ...scene.settings, background: hex };
      scene.threeScene.background = bg;
      scene.threeScene.backgroundBlurriness = 0;
      if (p.useHdriAsEnvironment) {
        this._applyProceduralEnvironment(p.backgroundColor);
      } else {
        scene.threeScene.environment = null;
        this._disposeHdri();
      }
    }

    if (p.fog.enabled) {
      const fog = this._colorFromLinearRgb(p.fog.color);
      const fogColor = `#${fog.getHexString()}`;
      const near = p.fog.near;
      const far = Math.max(near + 0.5, p.fog.far);
      scene.settings = {
        ...scene.settings,
        fog: { color: fogColor, near, far },
      };
      const existing = scene.threeScene.fog;
      if (existing instanceof THREE.Fog) {
        existing.color.copy(fog);
        existing.near = near;
        existing.far = far;
      } else {
        scene.threeScene.fog = new THREE.Fog(fog, near, far);
      }
      // Reset clearance blend when authored base distances change.
      this._clearance = 0;
      this._hasPrevCamPos = false;
    } else {
      const { fog: _removed, ...rest } = scene.settings;
      scene.settings = { ...rest };
      scene.threeScene.fog = null;
    }
  }

  /**
   * Build a lightweight PMREM probe from sky/ground colors so metals have
   * something to reflect without requiring an HDRI asset.
   */
  private _applyProceduralEnvironment(skyRgb: RGB): void {
    const scene = this._actor?.scene;
    const runtime = scene?.runtime;
    if (!scene || !runtime) return;

    // Bake after the current frame so the WebGL context is fully current
    // (PMREM during the first attach can silently produce a useless env map).
    const token = ++this._hdriLoadToken;
    requestAnimationFrame(() => {
      if (token !== this._hdriLoadToken || !this._actor?.scene?.runtime) return;
      this._bakeProceduralEnvironment(skyRgb, token);
    });
  }

  private _bakeProceduralEnvironment(skyRgb: RGB, token: number): void {
    const scene = this._actor?.scene;
    const runtime = scene?.runtime;
    if (!scene || !runtime || token !== this._hdriLoadToken) return;

    const sky = this._colorFromLinearRgb(skyRgb);
    const ground = sky.clone().multiplyScalar(0.25);
    ground.offsetHSL(0.05, -0.2, -0.35);

    const probeScene = new THREE.Scene();
    probeScene.background = sky;

    const hemi = new THREE.HemisphereLight(sky, ground, 1.6);
    probeScene.add(hemi);

    const key = new THREE.DirectionalLight(0xffe2b0, 3.2);
    key.position.set(5, 10, 4);
    probeScene.add(key);

    const fill = new THREE.DirectionalLight(0x9ec0ff, 0.65);
    fill.position.set(-4, 3, -2);
    probeScene.add(fill);

    const rim = new THREE.DirectionalLight(0xfff8e8, 1.3);
    rim.position.set(-2, 4, 6);
    probeScene.add(rim);

    const sun = new THREE.Mesh(
      new THREE.SphereGeometry(0.85, 24, 24),
      new THREE.MeshBasicMaterial({ color: 0xfff3d0 }),
    );
    sun.position.set(7, 10, 5);
    probeScene.add(sun);

    // Soft ground plane bounce in the probe (warms metal reflections).
    const groundMesh = new THREE.Mesh(
      new THREE.CircleGeometry(12, 32),
      new THREE.MeshStandardMaterial({ color: 0x3a5a28, roughness: 1, metalness: 0 }),
    );
    groundMesh.rotation.x = -Math.PI / 2;
    groundMesh.position.y = -1;
    probeScene.add(groundMesh);

    this._disposeHdri();
    try {
      const pmrem = new THREE.PMREMGenerator(runtime.context.renderer);
      const envMap = pmrem.fromScene(probeScene, 0.03).texture;
      pmrem.dispose();
      sun.geometry.dispose();
      (sun.material as THREE.Material).dispose();
      groundMesh.geometry.dispose();
      (groundMesh.material as THREE.Material).dispose();
      this._envMap = envMap;
      scene.threeScene.environment = envMap;
      // Force standard materials to pick up the new scene env map.
      scene.threeScene.traverse((obj) => {
        if (!(obj instanceof THREE.Mesh)) return;
        const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
        for (const mat of mats) {
          if (mat instanceof THREE.MeshStandardMaterial) {
            mat.envMapIntensity = Math.max(mat.envMapIntensity, 1.15);
            mat.needsUpdate = true;
          }
        }
      });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn('[EnvironmentComponent] Procedural IBL failed; continuing without env map.', err);
      scene.threeScene.environment = null;
    }
  }

  private _loadHdri(assetId: AssetId): void {
    const scene = this._actor?.scene;
    const runtime = scene?.runtime;
    if (!scene || !runtime) return;
    const token = ++this._hdriLoadToken;
    void this._loadHdriTexture(runtime, assetId)
      .then((texture) => {
        if (token !== this._hdriLoadToken || !this._actor?.scene) return;

        // Clone before PMREM so background and env map do not share a
        // render-target-mutated texture (which can go black).
        const backgroundTex = texture.clone();
        backgroundTex.needsUpdate = true;
        backgroundTex.mapping = THREE.EquirectangularReflectionMapping;
        backgroundTex.colorSpace = THREE.SRGBColorSpace;

        const envSource = texture.clone();
        envSource.needsUpdate = true;
        envSource.mapping = THREE.EquirectangularReflectionMapping;
        envSource.colorSpace = THREE.SRGBColorSpace;

        const pmrem = new THREE.PMREMGenerator(runtime.context.renderer);
        const envMap = pmrem.fromEquirectangular(envSource).texture;
        pmrem.dispose();
        envSource.dispose();

        this._disposeHdri();
        this._hdriTexture = backgroundTex;
        this._envMap = envMap;

        scene.threeScene.background = backgroundTex;
        scene.threeScene.backgroundBlurriness = this._props.hdriBlurriness;
        if (this._props.useHdriAsEnvironment) {
          scene.threeScene.environment = envMap;
        }
      })
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.warn('[EnvironmentComponent] HDRI load failed; using color + procedural IBL.', err);
        if (token !== this._hdriLoadToken || !this._actor?.scene) return;
        const p = this._props;
        scene.threeScene.background = this._colorFromLinearRgb(p.backgroundColor);
        if (p.useHdriAsEnvironment) this._applyProceduralEnvironment(p.backgroundColor);
      });
  }

  private async _loadHdriTexture(
    runtime: import('../runtime').Runtime,
    assetId: AssetId,
  ): Promise<THREE.Texture> {
    const record = runtime.context.assets.get(assetId);
    const mime = (record?.meta as { mimeType?: string } | undefined)?.mimeType ?? '';
    const path = (record?.path ?? record?.name ?? '').toLowerCase();
    const buf = await runtime.context.loader['blobs'].fetch(assetId);
    const isHdr =
      mime.includes('hdr') || mime.includes('radiance') || path.endsWith('.hdr');
    const isExr = mime.includes('exr') || path.endsWith('.exr');

    if (isHdr) {
      const mod = await import('three/examples/jsm/loaders/RGBELoader.js');
      const loader = new mod.RGBELoader();
      const data = loader.parse(buf) as {
        width: number;
        height: number;
        data: Float32Array | Uint8Array;
        header: string;
        gamma: number;
        exposure: number;
        type: THREE.TextureDataType;
      };
      const tex = new THREE.DataTexture(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data.data as any,
        data.width,
        data.height,
        THREE.RGBAFormat,
        data.type,
      );
      tex.needsUpdate = true;
      return tex;
    }

    if (isExr) {
      const mod = await import('three/examples/jsm/loaders/EXRLoader.js');
      const loader = new mod.EXRLoader();
      return new Promise<THREE.Texture>((resolve, reject) => {
        const blob = new Blob([buf]);
        const url = URL.createObjectURL(blob);
        loader.load(
          url,
          (tex) => {
            URL.revokeObjectURL(url);
            resolve(tex);
          },
          undefined,
          (err) => {
            URL.revokeObjectURL(url);
            reject(err);
          },
        );
      });
    }

    // Fall back to a regular LDR texture (JPEG/PNG equirectangular).
    return runtime.context.loader.loadTexture(assetId);
  }

  private _disposeHdri(): void {
    if (this._envMap) {
      this._envMap.dispose();
      this._envMap = undefined;
    }
    if (this._hdriTexture) {
      this._hdriTexture.dispose();
      this._hdriTexture = undefined;
    }
  }

  /** Props store working/linear RGB; Three Color constructors treat channels as sRGB. */
  private _colorFromLinearRgb(c: RGB): THREE.Color {
    return new THREE.Color().setRGB(c[0], c[1], c[2], THREE.LinearSRGBColorSpace);
  }
}
