import { describe, expect, it, vi } from 'vitest';
import { Runtime } from '../runtime';
import { Scene, type SerializedScene } from '../scene/scene';
import { Actor } from '../scene/actor';
// Side-effect import: registers all built-in component types so the nested
// scene deserializer can recreate TransformComponent et al.
import '../components';
import { TransformComponent, makeTransformProps } from './transform.component';
import {
  SceneInstanceComponent,
  makeSceneInstanceProps,
} from './scene-instance.component';

// Mock WebGLRenderer so tests run under jsdom without a real WebGL context.
vi.mock('three', async (importOriginal) => {
  const actual = await importOriginal<typeof import('three')>();
  return {
    ...actual,
    WebGLRenderer: vi.fn().mockImplementation(function WebGLRenderer() {
      return {
        setSize: vi.fn(),
        setPixelRatio: vi.fn(),
        setClearColor: vi.fn(),
        setClearAlpha: vi.fn(),
        clear: vi.fn(),
        render: vi.fn(),
        dispose: vi.fn(),
        shadowMap: { enabled: false },
        capabilities: { getMaxAnisotropy: (): number => 16 },
        outputColorSpace: actual.SRGBColorSpace,
        toneMapping: actual.ACESFilmicToneMapping,
        toneMappingExposure: 1,
        autoClear: true,
        domElement: document.createElement('canvas'),
      };
    }),
  };
});

function makeChildSceneAsset(id: string, actorName = 'child-actor'): SerializedScene {
  const child = new Scene('Child', `scene-${id}`);
  const actor = new Actor(actorName);
  actor.addComponent(new TransformComponent(makeTransformProps()));
  child.add(actor);
  return { ...child.serialize() };
}

describe('SceneInstanceComponent', () => {
  it('instantiates and registers a nested sub-scene as embedded', () => {
    const canvas = document.createElement('canvas');
    const runtime = Runtime.create({ canvas });
    const childAsset = makeChildSceneAsset('A');
    runtime.sceneResolver = (assetId) => (assetId === 'A' ? childAsset : undefined);

    const host = new Scene('Host');
    const actor = new Actor('host-actor');
    actor.addComponent(new TransformComponent(makeTransformProps()));
    const instance = new SceneInstanceComponent(
      makeSceneInstanceProps({ sceneAssetId: 'A', mode: 'embedded' }),
    );
    actor.addComponent(instance);
    runtime.loadScene(host);
    host.add(actor);

    expect(instance.isLoaded).toBe(true);
    expect(instance.instance?.nested).toBe(true);
    expect(runtime.activeScenes).toContain(instance.instance);
    // Sub-scene's threeScene is parented under the host actor.
    expect(actor.object3D.children).toContain(instance.instance?.threeScene);

    runtime.dispose();
  });

  it('refuses cyclic nesting', () => {
    const canvas = document.createElement('canvas');
    const runtime = Runtime.create({ canvas });
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);

    // Asset "A" contains an actor that nests "A" again.
    const recursive = new Scene('Recursive', 'scene-A');
    const inner = new Actor('inner');
    inner.addComponent(new TransformComponent(makeTransformProps()));
    inner.addComponent(
      new SceneInstanceComponent(makeSceneInstanceProps({ sceneAssetId: 'A' })),
    );
    recursive.add(inner);
    const asset = recursive.serialize();
    runtime.sceneResolver = (assetId) => (assetId === 'A' ? asset : undefined);

    const host = new Scene('Host');
    const actor = new Actor('host-actor');
    actor.addComponent(new TransformComponent(makeTransformProps()));
    actor.addComponent(
      new SceneInstanceComponent(makeSceneInstanceProps({ sceneAssetId: 'A' })),
    );
    runtime.loadScene(host);
    host.add(actor);

    // First level loads; the second level (cycle) must be refused.
    expect(
      warn.mock.calls.some((c) => String(c[0]).includes('cyclic nesting detected')),
    ).toBe(true);
    warn.mockRestore();
    runtime.dispose();
  });

  it('degrades gracefully when the resolver cannot find the scene', () => {
    const canvas = document.createElement('canvas');
    const runtime = Runtime.create({ canvas });
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    runtime.sceneResolver = () => undefined;

    const host = new Scene('Host');
    const actor = new Actor('host-actor');
    actor.addComponent(new TransformComponent(makeTransformProps()));
    const instance = new SceneInstanceComponent(
      makeSceneInstanceProps({ sceneAssetId: 'missing' }),
    );
    actor.addComponent(instance);
    runtime.loadScene(host);
    host.add(actor);

    expect(instance.isLoaded).toBe(false);
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
    runtime.dispose();
  });

  it('unloads the sub-scene when the host actor is removed', () => {
    const canvas = document.createElement('canvas');
    const runtime = Runtime.create({ canvas });
    runtime.sceneResolver = () => makeChildSceneAsset('A');

    const host = new Scene('Host');
    const actor = new Actor('host-actor');
    actor.addComponent(new TransformComponent(makeTransformProps()));
    const instance = new SceneInstanceComponent(
      makeSceneInstanceProps({ sceneAssetId: 'A' }),
    );
    actor.addComponent(instance);
    runtime.loadScene(host);
    host.add(actor);
    const sub = instance.instance;
    expect(sub).toBeDefined();

    host.remove(actor);
    expect(instance.isLoaded).toBe(false);
    expect(runtime.activeScenes).not.toContain(sub);

    runtime.dispose();
  });
});
