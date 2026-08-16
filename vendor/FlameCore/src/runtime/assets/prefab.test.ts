import { describe, expect, it } from 'vitest';
import '@runtime/components';
import {
  Actor,
  TransformComponent,
  makeTransformProps,
} from '@runtime/index';
import { createPrefabFromActor, instantiatePrefab } from './prefab';

function makeTree(): Actor {
  const root = new Actor('Root');
  root.addComponent(new TransformComponent(makeTransformProps({ position: [1, 2, 3] })));
  const child = new Actor('Child');
  child.addComponent(new TransformComponent(makeTransformProps({ position: [4, 5, 6] })));
  child.setParent(root);
  const grandchild = new Actor('GrandChild');
  grandchild.addComponent(new TransformComponent(makeTransformProps()));
  grandchild.setParent(child);
  return root;
}

describe('createPrefabFromActor / instantiatePrefab', () => {
  it('serializes the subtree into a descriptor with remapped ids', () => {
    const root = makeTree();
    const descriptor = createPrefabFromActor(root, 'MyPrefab');
    expect(descriptor.name).toBe('MyPrefab');
    expect(descriptor.actors).toHaveLength(3);
    expect(descriptor.actors[0]?.parentId).toBeUndefined();
    // All ids should differ from the source actor ids.
    const sourceIds = new Set([root.id, ...root.children.map((c) => c.id)]);
    for (const a of descriptor.actors) {
      expect(sourceIds.has(a.id)).toBe(false);
    }
  });

  it('round-trips back into a fresh actor tree with the same shape', () => {
    const root = makeTree();
    const descriptor = createPrefabFromActor(root);
    const instance = instantiatePrefab(descriptor);
    expect(instance.children.length).toBe(1);
    expect(instance.children[0]?.children.length).toBe(1);
    // Fresh ids on each instantiation.
    expect(instance.id).not.toBe(descriptor.actors[0]?.id);
  });

  it('applies path-targeted overrides to the instance', () => {
    const root = makeTree();
    const descriptor = createPrefabFromActor(root);
    const instance = instantiatePrefab(descriptor, [
      {
        actorPath: '0',
        componentType: 'TransformComponent',
        patch: { position: [9, 9, 9] },
      },
    ]);
    const child = instance.children[0]!;
    const transform = child.getComponent(TransformComponent)!;
    expect(transform.props.position).toEqual([9, 9, 9]);
  });
});
