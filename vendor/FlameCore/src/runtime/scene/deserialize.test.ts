import { describe, expect, it } from 'vitest';
import '@runtime/components';
import {
  Actor,
  CameraComponent,
  MeshRendererComponent,
  Scene,
  TransformComponent,
  deserializeScene,
  makeCameraProps,
  makeMeshRendererProps,
  makeTransformProps,
} from '@runtime/index';

describe('deserializeScene', () => {
  function buildSourceScene(): Scene {
    const scene = new Scene('Source');
    const parent = new Actor('Parent');
    parent.addComponent(new TransformComponent(makeTransformProps({ position: [1, 0, 0] })));
    parent.addComponent(new CameraComponent(makeCameraProps()));
    scene.add(parent);
    const child = new Actor('Child');
    child.addComponent(new TransformComponent(makeTransformProps({ position: [0, 2, 0] })));
    child.addComponent(new MeshRendererComponent(makeMeshRendererProps({ shape: 'box' })));
    scene.add(child);
    child.setParent(parent);
    return scene;
  }

  it('round-trips actors and components', () => {
    const source = buildSourceScene();
    const restored = deserializeScene(source.serialize());
    expect(restored.actors).toHaveLength(2);
    const parent = restored.actors.find((a) => a.name === 'Parent');
    const child = restored.actors.find((a) => a.name === 'Child');
    expect(parent).toBeDefined();
    expect(child?.parent).toBe(parent);
    expect(child?.getComponent(MeshRendererComponent)?.props.shape).toBe('box');
  });

  it('preserves actor IDs across round trip', () => {
    const source = buildSourceScene();
    const serialized = source.serialize();
    const restored = deserializeScene(serialized);
    expect(restored.id).toBe(source.id);
    for (const original of source.actors) {
      const match = restored.findActorById(original.id);
      expect(match).toBeDefined();
      expect(match?.name).toBe(original.name);
    }
  });
});
