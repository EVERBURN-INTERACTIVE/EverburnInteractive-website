import { describe, expect, it, vi } from 'vitest';
import { Runtime, wireRuntimeResolvers } from './index';
import { AssetDatabase } from './assets/asset-database';
import { Scene, type SerializedScene } from './scene/scene';
import { Actor } from './scene/actor';
import './components';
import { TransformComponent, makeTransformProps } from './components/transform.component';
import {
  SceneInstanceComponent,
  makeSceneInstanceProps,
} from './components/scene-instance.component';
import { makeParticleSystemAsset } from './particles/types';
import type { SerializedAssetRecord } from './assets/types';
import { createId } from './utils/id';

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
  const child = new Scene('Child', id);
  const actor = new Actor(actorName);
  actor.addComponent(new TransformComponent(makeTransformProps()));
  child.add(actor);
  return { ...child.serialize() };
}

describe('wireRuntimeResolvers', () => {
  it('resolves nested scenes from project.scenes by id', () => {
    const canvas = document.createElement('canvas');
    const runtime = Runtime.create({ canvas });
    const childAsset = makeChildSceneAsset('scene-child-a');
    const scenes = [childAsset];

    wireRuntimeResolvers(runtime, {
      scenes,
      assetDatabase: new AssetDatabase(),
    });

    const host = new Scene('Host');
    const actor = new Actor('host-actor');
    actor.addComponent(new TransformComponent(makeTransformProps()));
    actor.addComponent(
      new SceneInstanceComponent(
        makeSceneInstanceProps({ sceneAssetId: 'scene-child-a', mode: 'embedded' }),
      ),
    );
    runtime.loadScene(host);
    host.add(actor);

    expect(runtime.sceneResolver?.('scene-child-a')).toEqual(childAsset);
    expect(runtime.sceneResolver?.('missing')).toBeUndefined();

    const instance = actor.getComponent(SceneInstanceComponent);
    expect(instance?.isLoaded).toBe(true);

    runtime.dispose();
  });

  it('resolves particle-system assets from assetDatabase inline data', () => {
    const canvas = document.createElement('canvas');
    const runtime = Runtime.create({ canvas });
    const assetId = createId();
    const particleAsset = makeParticleSystemAsset({ id: assetId, name: 'Fire' });
    const record: SerializedAssetRecord<'particle-system'> = {
      id: assetId,
      type: 'particle-system',
      name: 'Fire',
      path: '/Particles/fire',
      inline: particleAsset,
      meta: { emitterCount: 1 },
      createdAt: Date.now(),
      updatedAt: Date.now(),
      _version: 1,
    };
    const db = new AssetDatabase({ records: [record] });

    wireRuntimeResolvers(runtime, {
      scenes: [],
      assetDatabase: db,
    });

    expect(runtime.particleResolver?.(assetId)).toEqual(particleAsset);
    expect(runtime.particleResolver?.('unknown')).toBeUndefined();

    runtime.dispose();
  });

  it('uses getScenes for live project updates', () => {
    const canvas = document.createElement('canvas');
    const runtime = Runtime.create({ canvas });
    let scenes: SerializedScene[] = [];

    wireRuntimeResolvers(runtime, {
      getScenes: () => scenes,
      assetDatabase: new AssetDatabase(),
    });

    expect(runtime.sceneResolver?.('dynamic-scene')).toBeUndefined();

    scenes = [makeChildSceneAsset('dynamic-scene')];
    expect(runtime.sceneResolver?.('dynamic-scene')).toBeDefined();

    runtime.dispose();
  });
});
