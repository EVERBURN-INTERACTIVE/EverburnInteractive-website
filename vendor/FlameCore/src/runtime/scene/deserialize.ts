import { Actor, type SerializedActor } from './actor';
import { Scene, type SerializedScene } from './scene';
import { instantiateComponent } from './registry';

/**
 * Reconstruct a {@link Scene} from its serialized form, instantiating every
 * actor and component via the component registry. Used by the editor to
 * snapshot/restore scenes for play mode and by the project loader.
 *
 * The scene is returned in its loaded state but not yet `enter()`-ed.
 */
export function deserializeScene(data: SerializedScene): Scene {
  const scene = new Scene(data.name, data.id, data.settings);

  // First pass: create actors with components, attach to scene root.
  const actorsById = new Map<string, Actor>();
  for (const actorData of data.actors) {
    const actor = createActorFromSerialized(actorData);
    actorsById.set(actor.id, actor);
  }

  // Second pass: wire parent links (ensures correct add order).
  for (const actorData of data.actors) {
    const actor = actorsById.get(actorData.id);
    if (!actor) continue;
    if (actorData.parentId) {
      const parent = actorsById.get(actorData.parentId);
      if (parent) {
        // Make sure parent is in scene first (top-level) before reparenting.
        if (!parent.scene) scene.add(parent);
        if (!actor.scene) scene.add(actor);
        actor.setParent(parent);
        continue;
      }
    }
    if (!actor.scene) scene.add(actor);
  }

  return scene;
}

/**
 * Create an {@link Actor} (with all its components attached, but not yet
 * bound to a scene) from a {@link SerializedActor} record.
 */
export function createActorFromSerialized(data: SerializedActor): Actor {
  const actor = new Actor(data.name, data.id);
  for (const c of data.components) {
    const component = instantiateComponent(c.type, c.props);
    actor.addComponent(component);
  }
  return actor;
}
