import { createId } from '../utils/id';
import { Actor, type SerializedActor } from '../scene/actor';
import { createActorFromSerialized } from '../scene/deserialize';
import type {
  PrefabDescriptor,
  PrefabOverride,
} from './types';

/**
 * Serialize an actor (and all of its descendant actors) into a
 * {@link PrefabDescriptor} suitable for saving as a prefab asset.
 *
 * The resulting descriptor stores each actor in flattened order with new
 * GUIDs scoped to the prefab; the original GUIDs are remapped so the
 * descriptor is self-contained.
 */
export function createPrefabFromActor(root: Actor, name?: string): PrefabDescriptor {
  // Collect the subtree depth-first.
  const collected: Actor[] = [];
  const walk = (a: Actor): void => {
    collected.push(a);
    for (const c of a.children) walk(c);
  };
  walk(root);

  // Remap original ids → fresh ids so the prefab is reusable without clashes.
  const idMap = new Map<string, string>();
  for (const a of collected) idMap.set(a.id, createId('actor'));

  const actors: SerializedActor[] = collected.map((a) => {
    const serialized = a.serialize();
    return {
      id: idMap.get(serialized.id)!,
      name: serialized.name,
      parentId:
        serialized.parentId && idMap.has(serialized.parentId) && a !== root
          ? idMap.get(serialized.parentId)
          : undefined,
      components: serialized.components,
    };
  });

  return {
    id: createId('prefab'),
    name: name ?? root.name,
    actors,
    _version: 1,
  };
}

/**
 * Instantiate a prefab. Returns a freshly-detached root {@link Actor} (and
 * its descendants) ready to be added to a scene. New GUIDs are minted for
 * every actor so multiple instances of the same prefab don't collide.
 *
 * `overrides` are matched against {@link PrefabOverride.actorPath} relative
 * to the prefab root (e.g., `""` = root, `"0/1"` = grandchild) and applied
 * after the actor graph is built.
 */
export function instantiatePrefab(
  descriptor: PrefabDescriptor,
  overrides: ReadonlyArray<PrefabOverride> = [],
): Actor {
  if (descriptor.actors.length === 0) {
    throw new Error(`Prefab "${descriptor.name}" is empty.`);
  }

  // Mint fresh ids; preserve hierarchy.
  const idMap = new Map<string, string>();
  for (const a of descriptor.actors) idMap.set(a.id, createId('actor'));

  const actorsById = new Map<string, Actor>();
  const childrenByPrefabId = new Map<string, string[]>();
  for (const data of descriptor.actors) {
    const fresh: SerializedActor = {
      id: idMap.get(data.id)!,
      name: data.name,
      parentId: data.parentId ? idMap.get(data.parentId) : undefined,
      components: data.components,
    };
    const actor = createActorFromSerialized(fresh);
    actorsById.set(data.id, actor);
    if (data.parentId) {
      const list = childrenByPrefabId.get(data.parentId) ?? [];
      list.push(data.id);
      childrenByPrefabId.set(data.parentId, list);
    }
  }

  // Apply parent links.
  for (const data of descriptor.actors) {
    if (!data.parentId) continue;
    const parent = actorsById.get(data.parentId);
    const child = actorsById.get(data.id);
    if (parent && child) child.setParent(parent);
  }

  const rootData = descriptor.actors[0];
  const root = actorsById.get(rootData.id);
  if (!root) throw new Error('Prefab root actor missing.');

  // Walk to assign prefab-relative paths and apply overrides.
  const pathByActor = new Map<Actor, string>();
  pathByActor.set(root, '');
  const stack: Actor[] = [root];
  while (stack.length > 0) {
    const node = stack.pop()!;
    const path = pathByActor.get(node) ?? '';
    node.children.forEach((child, idx) => {
      pathByActor.set(child, path === '' ? String(idx) : `${path}/${idx}`);
      stack.push(child);
    });
  }
  const actorByPath = new Map<string, Actor>();
  for (const [actor, path] of pathByActor.entries()) actorByPath.set(path, actor);

  for (const override of overrides) {
    const target = actorByPath.get(override.actorPath);
    if (!target) continue;
    for (const c of target.components) {
      if (c.type !== override.componentType) continue;
      c.setProps(override.patch);
      break;
    }
  }

  return root;
}
