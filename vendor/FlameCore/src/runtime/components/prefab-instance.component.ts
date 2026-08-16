import type { SerializedComponentProps } from '@shared/types';
import { BaseComponent } from '../scene/component';
import type { Actor } from '../scene/actor';
import type { Scene } from '../scene/scene';
import { instantiatePrefab } from '../assets/prefab';
import type { AssetId, PrefabOverride } from '../assets/types';

/** Serialized props for a {@link PrefabInstanceComponent}. */
export interface PrefabInstanceProps extends SerializedComponentProps {
  readonly _version: 1;
  /** GUID of the prefab asset to instantiate. */
  prefabId: AssetId;
  /** Per-instance overrides applied to the instantiated subtree. */
  overrides: ReadonlyArray<PrefabOverride>;
  /**
   * When true (default), the prefab is expanded into real child actors when
   * the component attaches to a scene. Disable if you want the component to
   * be a pure marker (e.g., in a prefab editor view).
   */
  expandOnAttach: boolean;
}

/** Build default props for a {@link PrefabInstanceComponent}. */
export function makePrefabInstanceProps(
  patch: Partial<Omit<PrefabInstanceProps, '_version'>> = {},
): PrefabInstanceProps {
  return {
    _version: 1,
    prefabId: patch.prefabId ?? '',
    overrides: patch.overrides ?? [],
    expandOnAttach: patch.expandOnAttach ?? true,
  };
}

/**
 * Marks an actor as an instance of a prefab asset. On scene-attach the
 * component resolves the prefab from the active scene's runtime and adds
 * the prefab's actors as children of the owning actor.
 *
 * Expansion is one-shot per attach: editing the prefab asset later does not
 * automatically rebuild already-expanded instances (a separate
 * `PrefabManager.refresh()` rebuilds them on demand).
 */
export class PrefabInstanceComponent extends BaseComponent<PrefabInstanceProps> {
  static readonly typeName = 'PrefabInstanceComponent';

  private _expanded = false;

  onSceneAttach(scene: Scene): void {
    super.onSceneAttach(scene);
    if (!this._props.expandOnAttach) return;
    if (this._expanded) return;
    this._expand(scene);
  }

  onSceneDetach(scene: Scene): void {
    super.onSceneDetach(scene);
    this._expanded = false;
  }

  /** Force-expand the prefab into this actor's children (idempotent). */
  expand(): void {
    const scene = this._actor?.scene;
    if (!scene) return;
    this._expand(scene);
  }

  /**
   * Dispose expanded children and rebuild from the latest prefab asset,
   * re-applying instance overrides.
   */
  rebuild(): boolean {
    const scene = this._actor?.scene;
    const actor = this._actor;
    if (!scene || !actor) return false;
    for (const child of [...actor.children]) {
      removeChildSubtree(scene, child);
    }
    this._expanded = false;
    this._expand(scene);
    return this._expanded;
  }

  private _expand(scene: Scene): void {
    const runtime = scene.runtime;
    const database = runtime?.context.assets;
    if (!database || !this._actor) return;
    // If children were already deserialized from a prior expansion, don't
    // duplicate them — treat the prefab instance as already expanded.
    if (this._actor.children.length > 0) {
      this._expanded = true;
      return;
    }

    const record = database.get(this._props.prefabId);
    if (!record || record.type !== 'prefab' || !record.inline) return;
    const descriptor = record.inline as import('../assets/types').PrefabDescriptor;
    const root = instantiatePrefab(descriptor, [...this._props.overrides]);
    root.setParent(this._actor);
    addActorRecursively(scene, root);
    this._expanded = true;
  }
}

function addActorRecursively(scene: Scene, actor: Actor): void {
  if (!actor.scene) scene.add(actor);
  for (const c of actor.children) addActorRecursively(scene, c);
}

function removeChildSubtree(scene: Scene, actor: Actor): void {
  for (const child of [...actor.children]) {
    removeChildSubtree(scene, child);
  }
  scene.remove(actor);
  actor.setParent(undefined);
}
