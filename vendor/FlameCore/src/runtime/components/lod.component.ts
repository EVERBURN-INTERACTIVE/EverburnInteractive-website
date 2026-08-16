import * as THREE from 'three';
import type { SerializedComponentProps } from '@shared/types';
import { BaseComponent } from '../scene/component';
import type { Actor } from '../scene/actor';
import type { Scene } from '../scene/scene';
import type { AssetId } from '../assets/types';

/**
 * A single LOD level entry: a mesh asset to render and the maximum camera
 * distance (in world units) at which this level is still considered valid.
 *
 * If `meshAssetId` is empty/undefined, the level is treated as
 * **culled** — i.e. the actor renders nothing at that distance band. This
 * lets authors hide far-away props without an extra "ghost" mesh.
 */
export interface LODLevel {
  /** Optional GUID of a mesh asset; falsy = render nothing at this band. */
  meshAssetId?: AssetId;
  /** Inclusive upper bound for this level (camera units). */
  maxDistance: number;
}

/** Transition strategy between LOD levels. */
export type LODFadeMode = 'instant' | 'fade';

/** Serialized LOD properties. */
export interface LODProps extends SerializedComponentProps {
  readonly _version: 1;
  /** Sorted from nearest to farthest. */
  levels: LODLevel[];
  /** Cross-fade between levels (visual smoothing) or hard switch. */
  fadeMode: LODFadeMode;
  /** Duration (seconds) for `fadeMode === 'fade'`. */
  fadeDuration: number;
  /**
   * Hysteresis (camera units) added to a level's `maxDistance` before
   * switching *back* to a finer level. Prevents flicker at the boundary.
   */
  hysteresis: number;
}

/** Factory for default LOD props. */
export function makeLODProps(patch: Partial<Omit<LODProps, '_version'>> = {}): LODProps {
  return {
    _version: 1,
    levels: patch.levels ?? [
      { maxDistance: 10 },
      { maxDistance: 25 },
      { maxDistance: 60 },
    ],
    fadeMode: patch.fadeMode ?? 'instant',
    fadeDuration: patch.fadeDuration ?? 0.25,
    hysteresis: patch.hysteresis ?? 1,
  };
}

/**
 * Distance-based level-of-detail switcher.
 *
 * Each level is a child `Object3D` (loaded GLTF subtree when `meshAssetId`
 * is set, otherwise an empty group). The {@link LODSystem} computes the
 * camera distance every frame and toggles each child's `visible` flag (or
 * cross-fades opacity when `fadeMode === 'fade'`).
 *
 * Per PRD 6 §6.2, the editor can also force a level via {@link setForcedLevel}
 * for the LOD debug overlay.
 */
export class LODComponent extends BaseComponent<LODProps> {
  static readonly typeName = 'LODComponent';

  /** Currently displayed level index (`-1` while uninitialized). */
  private _currentLevel = -1;
  /** Editor-only forced level; `-1` = follow camera distance. */
  private _forcedLevel = -1;
  /** Cross-fade alpha for the *current* level (1 = fully visible). */
  private _fadeAlpha = 1;
  /** Cross-fade alpha for the *outgoing* level (1 → 0). */
  private _prevFadeAlpha = 0;
  /** Index of the outgoing level during a fade, else `-1`. */
  private _prevLevel = -1;
  /** Container parented to the actor's Object3D; holds one child per level. */
  private _root: THREE.Group | undefined;
  /** Per-level root Object3D (created up-front, swapped in/out by visibility). */
  private readonly _levelRoots: Array<THREE.Object3D | undefined> = [];
  /** Per-level asset-load tokens to ignore stale resolutions. */
  private _loadTokens: number[] = [];

  /** Currently visible LOD level (`-1` if nothing has been resolved yet). */
  get currentLevel(): number {
    return this._currentLevel;
  }

  /** Editor-forced level (`-1` if not forcing). */
  get forcedLevel(): number {
    return this._forcedLevel;
  }

  /** Number of declared levels. */
  get levelCount(): number {
    return this._props.levels.length;
  }

  /** Hysteresis in world units. */
  get hysteresis(): number {
    return this._props.hysteresis;
  }

  /** Root Object3D containing every per-level subtree. */
  get root(): THREE.Object3D | undefined {
    return this._root;
  }

  /** Internal: read the configured `maxDistance` for a level (clamped index). */
  getMaxDistance(levelIndex: number): number {
    const levels = this._props.levels;
    if (levels.length === 0) return Infinity;
    if (levelIndex >= levels.length) return Infinity;
    return levels[levelIndex].maxDistance;
  }

  /**
   * Editor-only: pin the visible level to `index`, or pass `-1` to resume
   * distance-driven switching. Mostly used by the LOD debug overlay.
   */
  setForcedLevel(index: number): void {
    this._forcedLevel = Math.max(-1, Math.min(this._props.levels.length - 1, index));
    if (this._forcedLevel >= 0) {
      this.switchToLevel(this._forcedLevel, /* immediate */ true);
    }
  }

  onAttach(actor: Actor): void {
    super.onAttach(actor);
    this._build();
  }

  onSceneAttach(scene: Scene): void {
    super.onSceneAttach(scene);
    void this._loadAllLevels(scene);
  }

  onDetach(): void {
    this._invalidateLoads();
    if (this._root) {
      this._root.removeFromParent();
      this._root = undefined;
    }
    this._levelRoots.length = 0;
    super.onDetach();
  }

  protected onPropsChanged(): void {
    if (!this._actor) return;
    // Rebuild from scratch — levels list may have changed in arity.
    this._invalidateLoads();
    if (this._root) {
      this._root.removeFromParent();
      this._root = undefined;
    }
    this._levelRoots.length = 0;
    this._currentLevel = -1;
    this._prevLevel = -1;
    this._build();
    const scene = this._actor.scene;
    if (scene) void this._loadAllLevels(scene);
  }

  /**
   * Switch the visible mesh to `targetIndex`. If `immediate` is false and
   * the configured fadeMode is `'fade'`, an opacity cross-fade is started
   * which {@link tickFade} advances each frame.
   *
   * Called by {@link LODSystem}.
   */
  switchToLevel(targetIndex: number, immediate = false): void {
    if (targetIndex === this._currentLevel) return;
    const levels = this._props.levels;
    if (levels.length === 0) return;
    const clamped = Math.max(0, Math.min(levels.length - 1, targetIndex));
    const fading = !immediate && this._props.fadeMode === 'fade' && this._props.fadeDuration > 0;

    if (fading && this._currentLevel >= 0) {
      this._prevLevel = this._currentLevel;
      this._prevFadeAlpha = this._fadeAlpha;
      this._fadeAlpha = 0;
    } else {
      this._prevLevel = -1;
      this._prevFadeAlpha = 0;
      this._fadeAlpha = 1;
    }
    this._currentLevel = clamped;
    this._applyVisibility();
  }

  /** Advance any in-flight cross-fade by `dt` seconds. */
  tickFade(dt: number): void {
    if (this._prevLevel < 0) {
      if (this._fadeAlpha < 1) {
        this._fadeAlpha = Math.min(1, this._fadeAlpha + dt / Math.max(0.001, this._props.fadeDuration));
        this._applyOpacity();
      }
      return;
    }
    const step = dt / Math.max(0.001, this._props.fadeDuration);
    this._fadeAlpha = Math.min(1, this._fadeAlpha + step);
    this._prevFadeAlpha = Math.max(0, this._prevFadeAlpha - step);
    if (this._fadeAlpha >= 1 && this._prevFadeAlpha <= 0) {
      this._prevLevel = -1;
      this._prevFadeAlpha = 0;
    }
    this._applyOpacity();
  }

  // ---------- internals ----------

  private _build(): void {
    if (!this._actor) return;
    const root = new THREE.Group();
    root.name = 'LOD';
    this._actor.object3D.add(root);
    this._root = root;
    this._levelRoots.length = this._props.levels.length;
    this._loadTokens = new Array(this._props.levels.length).fill(0);
    for (let i = 0; i < this._props.levels.length; i++) {
      const group = new THREE.Group();
      group.name = `LOD_L${i}`;
      group.visible = false;
      root.add(group);
      this._levelRoots[i] = group;
    }
  }

  private async _loadAllLevels(scene: Scene): Promise<void> {
    const loader = scene.runtime?.context.loader;
    if (!loader) return;
    const levels = this._props.levels;
    for (let i = 0; i < levels.length; i++) {
      const level = levels[i];
      const target = this._levelRoots[i];
      if (!target) continue;
      const token = ++this._loadTokens[i];
      if (!level.meshAssetId) continue;
      try {
        const src = await loader.loadMesh(level.meshAssetId);
        if (token !== this._loadTokens[i] || !this._levelRoots[i]) return;
        const clone = src.clone(true);
        // Clear any previously-loaded subtree (prop change rebuild).
        for (const child of [...target.children]) target.remove(child);
        target.add(clone);
      } catch {
        // Leave the group empty on load failure.
      }
    }
  }

  private _invalidateLoads(): void {
    for (let i = 0; i < this._loadTokens.length; i++) this._loadTokens[i]++;
  }

  private _applyVisibility(): void {
    for (let i = 0; i < this._levelRoots.length; i++) {
      const root = this._levelRoots[i];
      if (!root) continue;
      const isCurrent = i === this._currentLevel;
      const isPrev = i === this._prevLevel;
      root.visible = isCurrent || isPrev;
    }
    this._applyOpacity();
  }

  private _applyOpacity(): void {
    const fading = this._props.fadeMode === 'fade';
    for (let i = 0; i < this._levelRoots.length; i++) {
      const root = this._levelRoots[i];
      if (!root) continue;
      const alpha = i === this._currentLevel ? this._fadeAlpha : i === this._prevLevel ? this._prevFadeAlpha : 1;
      root.traverse((obj) => {
        const mesh = obj as THREE.Mesh;
        const mat = mesh.material as THREE.Material | THREE.Material[] | undefined;
        if (!mat) return;
        const apply = (m: THREE.Material): void => {
          if (!fading) {
            // Restore defaults — flag changes are cheap and idempotent.
            m.transparent = m.userData.__lodOriginallyTransparent ?? false;
            m.opacity = 1;
          } else {
            if (m.userData.__lodOriginallyTransparent === undefined) {
              m.userData.__lodOriginallyTransparent = m.transparent;
            }
            m.transparent = true;
            m.opacity = alpha;
          }
        };
        if (Array.isArray(mat)) mat.forEach(apply);
        else apply(mat);
      });
    }
  }
}
