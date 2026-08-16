import * as THREE from 'three';
import type { RGB, SerializedComponentProps } from '@shared/types';
import { BaseComponent } from '../scene/component';
import type { Actor } from '../scene/actor';
import type { Scene } from '../scene/scene';
import type { AssetId } from '../assets/types';
import {
  applyMorphInfluence,
  applyMorphInfluenceOnSubtree,
  decodeMorphStorageKey,
  listGltfMorphTargets,
  type GltfMorphTargetInfo,
} from '../assets/gltf-morph-utils';
import { createGlitchMaterial, patchGlitchMaterial } from '../shaders/glitch.material';
import { createDissolveMaterial, patchDissolveMaterial } from '../shaders/dissolve.material';
import { applyShadowFlags, resolveCastShadowOpacity } from '../lighting/shadow-config';
import { CameraComponent } from './camera.component';

/** Primitive geometry shapes available without importing assets. */
export type PrimitiveShape =
  | 'box'
  | 'sphere'
  | 'plane'
  | 'cylinder'
  | 'cone'
  | 'torus'
  | 'capsule';

/** Serialized mesh renderer properties. */
export interface MeshRendererProps extends SerializedComponentProps {
  readonly _version: 1;
  shape: PrimitiveShape;
  /** Linear RGB in 0..1; converted to sRGB by the material. */
  color: RGB;
  /** PBR metallic factor [0..1]. */
  metalness: number;
  /** PBR roughness factor [0..1]. */
  roughness: number;
  /** Optional uniform scale factor applied to the generated geometry. */
  size: number;
  /** Receive and cast shadows. */
  castShadow: boolean;
  receiveShadow: boolean;
  /**
   * Optional shadow-map write density [0..1]. When unset, opaque meshes use 1
   * and translucent meshes (`opacity` < 1) automatically cast lighter shadows.
   */
  castShadowOpacity?: number;
  /** Material opacity [0..1]. */
  opacity: number;
  /** Emissive intensity multiplier for glow effects. */
  emissiveIntensity: number;
  /** Wireframe overlay mode. */
  wireframe: boolean;
  /** Glitch shader intensity [0..1]; 0 restores standard material. */
  glitchIntensity: number;
  /** Dissolve progress [0..1]; 1 = fully visible. */
  dissolveProgress: number;
  /**
   * Optional GLTF/GLB mesh asset id. When set, the loaded subtree replaces
   * the primitive geometry on attach. Falls back to the primitive on load
   * failure or when the asset is unknown.
   */
  meshAssetId?: AssetId;
  /**
   * Optional base color texture asset id applied to the active material.
   * Ignored when `meshAssetId` is set (the GLTF brings its own materials).
   */
  textureAssetId?: AssetId;
  /**
   * UV repeat applied to {@link textureAssetId} (cloned so the shared
   * AssetLoader cache is not mutated). Defaults to `[1, 1]`.
   */
  textureRepeat?: readonly [number, number];
  /**
   * Serialized morph weights keyed by {@link encodeMorphStorageKey}.
   * Applied to loaded GLTF meshes on change; timeline tracks use `morph.{key}`.
   */
  morphInfluences?: Record<string, number>;
  /**
   * Torus major radius (ring centerline). When unset, geometry uses `0.5`.
   * Changing this rebuilds primitive geometry.
   */
  torusRadius?: number;
  /**
   * Torus tube radius. When unset, geometry uses `0.02` (thin ring).
   * Changing this rebuilds primitive geometry.
   */
  torusTube?: number;
  /**
   * Radial / tubular segment count for cone, cylinder, and torus.
   * Defaults: cone/cylinder `32`, torus tubular `48` (radial fixed at `12` unless set).
   * Changing this rebuilds primitive geometry.
   */
  radialSegments?: number;
  /**
   * When true, cone geometry has no base cap (hollow beam). Rebuilds geometry.
   * Ignored for non-cone shapes.
   */
  openEnded?: boolean;
  /**
   * When `false`, the material ignores scene fog (useful for night stars).
   * Defaults to `true`.
   */
  fog?: boolean;
  /**
   * Optional linear emissive RGB. When unset, emissive copies {@link color}.
   */
  emissive?: RGB;
  /** Blend mode for translucent glow layers. Default `normal`. */
  blending?: 'normal' | 'additive';
  /**
   * When `false`, omit depth writes (additive sprites). When unset, opaque
   * meshes default to `true` and additive blending defaults to `false`.
   */
  depthWrite?: boolean;
  /** Face the active camera each frame (editor + runtime). */
  billboard?: boolean;
  /** When set, draw an {@link EdgesGeometry} line overlay in this linear RGB. */
  edgeColor?: RGB;
}

/** Factory for default mesh renderer props. */
export function makeMeshRendererProps(
  patch: Partial<Omit<MeshRendererProps, '_version'>> = {},
): MeshRendererProps {
  const out: MeshRendererProps = {
    _version: 1,
    shape: patch.shape ?? 'box',
    color: patch.color ?? [0.85, 0.4, 0.2],
    metalness: patch.metalness ?? 0.1,
    roughness: patch.roughness ?? 0.6,
    size: patch.size ?? 1,
    // Default on so newly created meshes participate in the shadow pass;
    // landscape/ground tools still set receive-only explicitly when needed.
    castShadow: patch.castShadow ?? true,
    receiveShadow: patch.receiveShadow ?? true,
    opacity: patch.opacity ?? 1,
    emissiveIntensity: patch.emissiveIntensity ?? 0,
    wireframe: patch.wireframe ?? false,
    glitchIntensity: patch.glitchIntensity ?? 0,
    dissolveProgress: patch.dissolveProgress ?? 1,
  };
  if (patch.meshAssetId) out.meshAssetId = patch.meshAssetId;
  if (patch.textureAssetId) out.textureAssetId = patch.textureAssetId;
  if (patch.textureRepeat) out.textureRepeat = [...patch.textureRepeat];
  if (patch.morphInfluences) out.morphInfluences = { ...patch.morphInfluences };
  if (patch.castShadowOpacity !== undefined) out.castShadowOpacity = patch.castShadowOpacity;
  if (patch.torusRadius !== undefined) out.torusRadius = patch.torusRadius;
  if (patch.torusTube !== undefined) out.torusTube = patch.torusTube;
  if (patch.radialSegments !== undefined) out.radialSegments = patch.radialSegments;
  if (patch.openEnded !== undefined) out.openEnded = patch.openEnded;
  if (patch.fog !== undefined) out.fog = patch.fog;
  if (patch.emissive) out.emissive = [...patch.emissive];
  if (patch.blending) out.blending = patch.blending;
  if (patch.depthWrite !== undefined) out.depthWrite = patch.depthWrite;
  if (patch.billboard !== undefined) out.billboard = patch.billboard;
  if (patch.edgeColor) out.edgeColor = [...patch.edgeColor];
  return out;
}

type EffectMode = 'standard' | 'glitch' | 'dissolve';

/**
 * Attaches a `THREE.Mesh` (built from a primitive shape and a
 * `MeshStandardMaterial`) to its owning actor. Geometry and material are
 * disposed automatically on detach.
 */
export class MeshRendererComponent extends BaseComponent<MeshRendererProps> {
  static readonly typeName = 'MeshRendererComponent';

  private _mesh: THREE.Mesh | undefined;
  private _assetRoot: THREE.Object3D | undefined;
  private _gltfAnimations: THREE.AnimationClip[] = [];
  private _loadToken = 0;
  private _standardMaterial: THREE.MeshStandardMaterial | THREE.MeshBasicMaterial | undefined;
  private _glitchMaterial: THREE.ShaderMaterial | undefined;
  private _dissolveMaterial: THREE.ShaderMaterial | undefined;
  private _effectMode: EffectMode = 'standard';
  private _glitchTime = 0;
  private _activeMap: THREE.Texture | null = null;
  /** Last geometry rebuild key — avoids rebuilding on material-only prop edits. */
  private _geometryKey = '';
  private _edgeLines: THREE.LineSegments | undefined;
  private _edgeSourceGeometryUuid = '';
  private readonly _cameraWorldQuaternion = new THREE.Quaternion();
  private readonly _parentWorldQuaternion = new THREE.Quaternion();

  /** The Three.js mesh owned by this component (placeholder when an asset is loading). */
  get mesh(): THREE.Mesh | undefined {
    return this._mesh;
  }

  /** The loaded asset subtree, when a mesh asset has been resolved. */
  get assetRoot(): THREE.Object3D | undefined {
    return this._assetRoot;
  }

  /** Embedded GLTF animation clips from the last resolved mesh asset. */
  get gltfAnimations(): ReadonlyArray<THREE.AnimationClip> {
    return this._gltfAnimations;
  }

  /** Morph targets discovered on the loaded GLTF subtree (empty for primitives). */
  get morphTargets(): ReadonlyArray<GltfMorphTargetInfo> {
    if (!this._assetRoot) return [];
    return listGltfMorphTargets(this._assetRoot);
  }

  onAttach(actor: Actor): void {
    super.onAttach(actor);
    this._build();
  }

  onSceneAttach(scene: Scene): void {
    super.onSceneAttach(scene);
    void this._refreshAssetBindings(scene);
  }

  onDetach(): void {
    this._loadToken++;
    this._teardownAssetRoot();
    this._disposeEffectMaterials();
    if (this._edgeLines) {
      this._edgeLines.removeFromParent();
      this._edgeLines = undefined;
    }
    if (this._mesh) {
      applyShadowFlags(this._mesh, false, false);
      this._mesh.removeFromParent();
      this._mesh = undefined;
    }
    this._standardMaterial = undefined;
    super.onDetach();
  }

  onUpdate(dt: number): void {
    if (this._props.billboard && this._mesh) {
      const scene = this._actor?.scene;
      const camera = this._resolveCamera(scene);
      if (camera) {
        camera.getWorldQuaternion(this._cameraWorldQuaternion);
        this._mesh.quaternion.copy(this._cameraWorldQuaternion);
        const parent = this._mesh.parent;
        if (parent) {
          parent.getWorldQuaternion(this._parentWorldQuaternion).invert();
          this._mesh.quaternion.premultiply(this._parentWorldQuaternion);
        }
      }
    }

    if (this._effectMode !== 'glitch' || !this._glitchMaterial) return;
    this._glitchTime += dt;
    patchGlitchMaterial(this._glitchMaterial, {
      intensity: this._props.glitchIntensity,
      time: this._glitchTime,
    });
  }

  protected onPropsChanged(): void {
    this._rebuildPrimitiveGeometryIfNeeded();
    this._syncBaseMaterial();
    this._applyMaterialProps();
    this._syncEdgeOverlay();
    this._syncEffectMaterial();
    this._syncMorphInfluences();
    if (this._mesh) {
      this._applyMeshShadows(this._mesh);
      this._mesh.scale.setScalar(this._props.size);
    }
    if (this._assetRoot) {
      this._applyMeshShadows(this._assetRoot);
    }
    const scene = this._actor?.scene;
    if (scene) void this._refreshAssetBindings(scene);
  }

  private _shadowOpacity(): number {
    return resolveCastShadowOpacity(
      this._props.castShadow,
      this._props.opacity,
      this._props.castShadowOpacity,
    );
  }

  private _applyMeshShadows(root: THREE.Object3D): void {
    applyShadowFlags(
      root,
      this._props.castShadow,
      this._props.receiveShadow,
      this._shadowOpacity(),
    );
  }

  private _build(): void {
    if (!this._actor) return;
    const geometry = this._createGeometry(this._props.shape);
    this._geometryKey = this._computeGeometryKey();
    const material = this._createBaseMaterial();
    const mesh = new THREE.Mesh(geometry, material);
    mesh.scale.setScalar(this._props.size);
    this._applyMeshShadows(mesh);
    mesh.userData.actorId = this._actor.id;
    this._actor.object3D.add(mesh);
    this._mesh = mesh;
    this._standardMaterial = material;
    this._disposables.push(geometry, material);
    this._syncEdgeOverlay();
    this._syncEffectMaterial();
  }

  private _computeGeometryKey(): string {
    const p = this._props;
    return [
      p.shape,
      p.torusRadius ?? '',
      p.torusTube ?? '',
      p.radialSegments ?? '',
      p.openEnded ? 'open' : '',
      p.edgeColor ? 'edge' : '',
    ].join('|');
  }

  /** Swap primitive BufferGeometry when shape / torus / segment props change. */
  private _rebuildPrimitiveGeometryIfNeeded(): void {
    if (!this._mesh) return;
    const nextKey = this._computeGeometryKey();
    if (nextKey === this._geometryKey) return;
    const old = this._mesh.geometry;
    const next = this._createGeometry(this._props.shape);
    this._mesh.geometry = next;
    this._geometryKey = nextKey;
    old.dispose();
    const idx = this._disposables.indexOf(old);
    if (idx >= 0) this._disposables[idx] = next;
    else this._disposables.push(next);
  }

  private _usesAdditiveBlending(): boolean {
    return this._props.blending === 'additive';
  }

  private _resolveEmissiveRgb(): RGB {
    return this._props.emissive ?? this._props.color;
  }

  private _resolveDepthWrite(): boolean {
    if (this._props.depthWrite !== undefined) return this._props.depthWrite;
    return !this._usesAdditiveBlending();
  }

  private _createBaseMaterial(): THREE.MeshStandardMaterial | THREE.MeshBasicMaterial {
    const color = new THREE.Color(
      this._props.color[0],
      this._props.color[1],
      this._props.color[2],
    );
    // Hollow open cones need both faces so the beam wall stays visible.
    const doubleSided = Boolean(this._props.openEnded);

    if (this._usesAdditiveBlending()) {
      const material = new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: this._props.opacity,
        wireframe: this._props.wireframe,
        blending: THREE.AdditiveBlending,
        depthWrite: this._resolveDepthWrite(),
        toneMapped: false,
        fog: this._props.fog !== false,
        side: doubleSided ? THREE.DoubleSide : THREE.FrontSide,
      });
      return material;
    }

    const material = new THREE.MeshStandardMaterial({
      color,
      metalness: this._props.metalness,
      roughness: this._props.roughness,
      transparent: this._props.opacity < 1,
      opacity: this._props.opacity,
      wireframe: this._props.wireframe,
      fog: this._props.fog !== false,
      depthWrite: this._resolveDepthWrite(),
      side: doubleSided ? THREE.DoubleSide : THREE.FrontSide,
    });
    if (this._props.emissiveIntensity > 0) {
      const em = this._resolveEmissiveRgb();
      material.emissive.setRGB(em[0], em[1], em[2]);
      material.emissiveIntensity = this._props.emissiveIntensity;
    }
    return material;
  }

  /** Swap MeshStandard vs MeshBasic when blending mode changes. */
  private _syncBaseMaterial(): void {
    if (!this._mesh) return;
    const wantsBasic = this._usesAdditiveBlending();
    const hasBasic = this._standardMaterial instanceof THREE.MeshBasicMaterial;
    if (wantsBasic === hasBasic) return;

    const old = this._standardMaterial;
    const next = this._createBaseMaterial();
    this._standardMaterial = next;
    if (this._effectMode === 'standard') {
      this._mesh.material = next;
    }
    if (old) {
      const idx = this._disposables.indexOf(old);
      if (idx >= 0) this._disposables[idx] = next;
      else this._disposables.push(next);
      old.dispose();
    } else {
      this._disposables.push(next);
    }
  }

  private _applyMaterialProps(): void {
    if (!this._standardMaterial) return;
    const p = this._props;
    const material = this._standardMaterial;

    material.color.setRGB(p.color[0], p.color[1], p.color[2]);
    material.wireframe = p.wireframe;
    material.fog = p.fog !== false;
    material.depthWrite = this._resolveDepthWrite();
    material.transparent =
      p.opacity < 1 || p.dissolveProgress < 1 || this._usesAdditiveBlending();
    material.opacity = p.opacity;

    if (material instanceof THREE.MeshBasicMaterial) {
      material.blending = THREE.AdditiveBlending;
      material.toneMapped = false;
      material.needsUpdate = true;
      return;
    }

    material.metalness = p.metalness;
    material.roughness = p.roughness;
    if (p.emissiveIntensity > 0) {
      const em = this._resolveEmissiveRgb();
      material.emissive.setRGB(em[0], em[1], em[2]);
      material.emissiveIntensity = p.emissiveIntensity;
    } else {
      // Avoid leaving a tinted emissive that can wash metals toward pale yellow.
      material.emissive.setRGB(0, 0, 0);
      material.emissiveIntensity = 0;
    }
    material.needsUpdate = true;
  }

  private _syncEdgeOverlay(): void {
    if (!this._mesh || !this._actor) return;
    const edge = this._props.edgeColor;
    if (!edge) {
      if (this._edgeLines) {
        this._edgeLines.removeFromParent();
        this._edgeLines.geometry.dispose();
        (this._edgeLines.material as THREE.Material).dispose();
        const idx = this._disposables.indexOf(this._edgeLines.geometry);
        if (idx >= 0) this._disposables.splice(idx, 1);
        const midx = this._disposables.indexOf(this._edgeLines.material as THREE.Material);
        if (midx >= 0) this._disposables.splice(midx, 1);
        this._edgeLines = undefined;
        this._edgeSourceGeometryUuid = '';
      }
      return;
    }

    const geomUuid = this._mesh.geometry.uuid;
    const needsRebuild = !this._edgeLines || this._edgeSourceGeometryUuid !== geomUuid;
    if (needsRebuild) {
      if (this._edgeLines) {
        this._edgeLines.removeFromParent();
        this._edgeLines.geometry.dispose();
        (this._edgeLines.material as THREE.Material).dispose();
        const gIdx = this._disposables.indexOf(this._edgeLines.geometry);
        if (gIdx >= 0) this._disposables.splice(gIdx, 1);
        const mIdx = this._disposables.indexOf(this._edgeLines.material as THREE.Material);
        if (mIdx >= 0) this._disposables.splice(mIdx, 1);
      }
      const edgeGeom = new THREE.EdgesGeometry(this._mesh.geometry);
      const edgeMat = new THREE.LineBasicMaterial({
        color: new THREE.Color(edge[0], edge[1], edge[2]),
      });
      this._edgeLines = new THREE.LineSegments(edgeGeom, edgeMat);
      this._mesh.add(this._edgeLines);
      this._disposables.push(edgeGeom, edgeMat);
      this._edgeSourceGeometryUuid = geomUuid;
    } else if (this._edgeLines) {
      const mat = this._edgeLines.material as THREE.LineBasicMaterial;
      mat.color.setRGB(edge[0], edge[1], edge[2]);
      mat.needsUpdate = true;
    }
  }

  private _resolveCamera(scene: Scene | undefined): THREE.Camera | undefined {
    if (!scene) return undefined;
    const renderingSystem = scene.runtime?.systems.find((system) => system.name === 'RenderingSystem') as
      | { readonly overrideCamera?: THREE.Camera }
      | undefined;
    if (renderingSystem?.overrideCamera) return renderingSystem.overrideCamera;
    const id = scene.mainCameraActorId;
    if (!id) return undefined;
    const actor = scene.findActorById(id);
    return actor?.getComponent(CameraComponent)?.camera;
  }

  private _resolveEffectMode(): EffectMode {
    if (this._props.glitchIntensity > 0) return 'glitch';
    if (this._props.dissolveProgress < 1) return 'dissolve';
    return 'standard';
  }

  private _syncEffectMaterial(): void {
    if (!this._mesh || !this._standardMaterial) return;
    const nextMode = this._resolveEffectMode();
    if (nextMode === this._effectMode && nextMode !== 'standard') {
      this._patchActiveEffect();
      return;
    }

    this._effectMode = nextMode;
    if (nextMode === 'standard') {
      this._mesh.material = this._standardMaterial;
      return;
    }

    const baseColor = new THREE.Color(
      this._props.color[0],
      this._props.color[1],
      this._props.color[2],
    );
    const map = this._activeMap;

    if (nextMode === 'glitch') {
      if (!this._glitchMaterial) {
        this._glitchMaterial = createGlitchMaterial(map);
        this._disposables.push(this._glitchMaterial);
      }
      patchGlitchMaterial(this._glitchMaterial, {
        intensity: this._props.glitchIntensity,
        time: this._glitchTime,
        map,
        baseColor,
      });
      this._mesh.material = this._glitchMaterial;
      return;
    }

    if (!this._dissolveMaterial) {
      this._dissolveMaterial = createDissolveMaterial(map);
      this._disposables.push(this._dissolveMaterial);
    }
    patchDissolveMaterial(this._dissolveMaterial, {
      progress: this._props.dissolveProgress,
      map,
      baseColor,
    });
    this._mesh.material = this._dissolveMaterial;
  }

  private _patchActiveEffect(): void {
    if (!this._mesh) return;
    const baseColor = new THREE.Color(
      this._props.color[0],
      this._props.color[1],
      this._props.color[2],
    );
    if (this._effectMode === 'glitch' && this._glitchMaterial) {
      patchGlitchMaterial(this._glitchMaterial, {
        intensity: this._props.glitchIntensity,
        time: this._glitchTime,
        map: this._activeMap,
        baseColor,
      });
    } else if (this._effectMode === 'dissolve' && this._dissolveMaterial) {
      patchDissolveMaterial(this._dissolveMaterial, {
        progress: this._props.dissolveProgress,
        map: this._activeMap,
        baseColor,
      });
    }
  }

  private async _refreshAssetBindings(scene: Scene): Promise<void> {
    const loader = scene.runtime?.context.loader;
    if (!loader) return;
    const token = ++this._loadToken;

    if (this._props.meshAssetId) {
      try {
        const parsed = await loader.loadGltfParsed(this._props.meshAssetId);
        if (token !== this._loadToken || !this._actor) return;
        this._teardownAssetRoot();
        this._gltfAnimations = [...parsed.animations];
        const clone = parsed.scene.clone(true);
        clone.scale.setScalar(this._props.size);
        // Grass blades and similar thin meshes need both faces lit.
        clone.traverse((obj) => {
          if (!(obj instanceof THREE.Mesh)) return;
          const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
          for (const mat of mats) {
            if (mat && 'side' in mat) {
              (mat as THREE.Material).side = THREE.DoubleSide;
            }
          }
        });
        this._toneDownBlownAssetMaterials(clone);
        this._applyMeshShadows(clone);
        if (this._mesh) this._mesh.visible = false;
        this._actor.object3D.add(clone);
        this._assetRoot = clone;
        this._syncMorphInfluences();
      } catch {
        this._gltfAnimations = [];
        // Leave the primitive placeholder in place if loading fails.
      }
    } else if (this._assetRoot) {
      this._teardownAssetRoot();
      if (this._mesh) this._mesh.visible = true;
    }

    if (this._props.textureAssetId && this._mesh && !this._props.meshAssetId) {
      try {
        const texture = await loader.loadTexture(this._props.textureAssetId);
        if (token !== this._loadToken || !this._mesh) return;
        // Clone so per-mesh repeat/wrap does not mutate the shared cache entry.
        const mapped = texture.clone();
        mapped.needsUpdate = true;
        mapped.wrapS = THREE.RepeatWrapping;
        mapped.wrapT = THREE.RepeatWrapping;
        const repeat = this._props.textureRepeat ?? [1, 1];
        mapped.repeat.set(repeat[0], repeat[1]);
        this._activeMap = mapped;
        const mat = this._standardMaterial;
        if (mat) {
          mat.map = mapped;
          mat.needsUpdate = true;
        }
        this._syncEffectMaterial();
      } catch {
        // Leave material flat-color on failure.
      }
    } else if (this._mesh && !this._props.textureAssetId) {
      this._activeMap = null;
      const mat = this._standardMaterial;
      if (mat?.map) {
        mat.map = null;
        mat.needsUpdate = true;
      }
      this._syncEffectMaterial();
    }
  }

  private _teardownAssetRoot(): void {
    if (!this._assetRoot) return;
    // Drop dithered depth materials before releasing the subtree.
    applyShadowFlags(this._assetRoot, false, false);
    this._assetRoot.removeFromParent();
    this._assetRoot = undefined;
    this._gltfAnimations = [];
  }

  /**
   * Studio / metallic GLBs often blow to white under IBL. Match the website
   * StudioBuilding pass lightly: unlit logo maps + darken near-white standards.
   * Scoped to the Everburn studio mesh only — museum marble / other assets keep
   * their authored albedos.
   */
  private _toneDownBlownAssetMaterials(root: THREE.Object3D): void {
    if (this._props.meshAssetId !== 'builtin-mesh-studio-building') return;

    const logoMeshes = new Set(['Everburn_Logo_Sign', 'Logo_Plaque']);
    const logoMaterials = new Set(['Everburn_Logo_Image']);

    root.traverse((obj) => {
      if (!(obj instanceof THREE.Mesh)) return;
      const source = Array.isArray(obj.material) ? obj.material : [obj.material];
      const next = source.map((mat) => {
        if (!(mat instanceof THREE.MeshStandardMaterial)) return mat;

        if (logoMeshes.has(obj.name) || logoMaterials.has(mat.name)) {
          if (mat.map) {
            mat.map.colorSpace = THREE.SRGBColorSpace;
            mat.map.needsUpdate = true;
          }
          return new THREE.MeshBasicMaterial({
            name: mat.name,
            map: mat.map,
            transparent: true,
            depthWrite: false,
            side: THREE.DoubleSide,
            toneMapped: false,
          });
        }

        // Near-white / blown albedos → dark cyber base (website HQ look).
        // Apply even when a map exists: failed/absent textures leave white baseColor.
        if (mat.color.r > 0.65 && mat.color.g > 0.65 && mat.color.b > 0.65) {
          mat.color.setRGB(0.015, 0.055, 0.1);
          mat.metalness = Math.min(mat.metalness, 0.35);
          mat.roughness = Math.max(mat.roughness, 0.6);
          if (mat.emissive) {
            mat.emissive.setRGB(0.0, 0.05, 0.08);
            mat.emissiveIntensity = Math.min(mat.emissiveIntensity || 0, 0.35);
          }
        } else if (mat.metalness > 0.7) {
          mat.metalness = Math.min(mat.metalness, 0.55);
          mat.roughness = Math.max(mat.roughness, 0.35);
        }

        // Named HQ hull meshes from the Everburn studio export.
        if (
          /HQ_(Lower|Upper)_Mass|HQ_(Left|Right)_Wing|HQ_Rear_Volume/.test(obj.name)
        ) {
          mat.color.setRGB(0.02, 0.07, 0.12);
          mat.metalness = 0.25;
          mat.roughness = 0.75;
          mat.emissive.setRGB(0, 0.04, 0.06);
          mat.emissiveIntensity = 0.25;
        }

        return mat;
      });

      obj.material = Array.isArray(obj.material) ? next : next[0];
      if (logoMeshes.has(obj.name)) {
        obj.renderOrder = 3;
        obj.castShadow = false;
        obj.receiveShadow = false;
      }
    });
  }

  private _syncMorphInfluences(): void {
    const influences = this._props.morphInfluences;
    if (!influences || Object.keys(influences).length === 0) return;
    const root = this._assetRoot;
    if (!root) return;
    for (const [key, value] of Object.entries(influences)) {
      if (typeof value !== 'number' || !Number.isFinite(value)) continue;
      const { nodePath, morphName } = decodeMorphStorageKey(key);
      if (nodePath) {
        applyMorphInfluence(root, nodePath, morphName, value);
      } else {
        applyMorphInfluenceOnSubtree(root, morphName, value);
      }
    }
  }

  private _disposeEffectMaterials(): void {
    this._glitchMaterial = undefined;
    this._dissolveMaterial = undefined;
    this._effectMode = 'standard';
  }

  private _createGeometry(shape: PrimitiveShape): THREE.BufferGeometry {
    const radial = this._props.radialSegments;
    switch (shape) {
      case 'sphere':
        return new THREE.SphereGeometry(0.5, 32, 16);
      case 'plane':
        return new THREE.PlaneGeometry(1, 1);
      case 'cylinder':
        return new THREE.CylinderGeometry(0.5, 0.5, 1, radial ?? 32);
      case 'cone':
        return new THREE.ConeGeometry(0.5, 1, radial ?? 32, 1, Boolean(this._props.openEnded));
      case 'torus': {
        const major = this._props.torusRadius ?? 0.5;
        const tube = this._props.torusTube ?? 0.02;
        // Thin ring defaults; radialSegments maps to tubular segments for torus.
        return new THREE.TorusGeometry(major, tube, 12, radial ?? 48);
      }
      case 'capsule':
        return new THREE.CapsuleGeometry(0.4, 0.6, 8, 16);
      case 'box':
      default:
        return new THREE.BoxGeometry(1, 1, 1);
    }
  }
}
