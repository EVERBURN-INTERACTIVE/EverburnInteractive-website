import { describe, expect, it, vi } from 'vitest';
import { Runtime } from '../runtime';
import { Scene } from '../scene/scene';
import { Actor } from '../scene/actor';
import '../components';
import { TransformComponent, makeTransformProps } from './transform.component';
import {
  SceneSwitcherComponent,
  makeSceneSwitcherProps,
} from './scene-switcher.component';
import { InputListenerComponent } from './input-listener.component';

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

describe('SceneSwitcherComponent', () => {
  it('switches scenes on activate() and respects once', async () => {
    const canvas = document.createElement('canvas');
    const runtime = Runtime.create({ canvas });
    const target = new Scene('Target', 'scene-target');
    target.add(new Actor('t'));
    const targetData = target.serialize();
    runtime.sceneResolver = (id) => (id === 'scene-target' ? targetData : undefined);

    const host = new Scene('Host', 'scene-host');
    const actor = new Actor('switcher');
    actor.addComponent(new TransformComponent(makeTransformProps()));
    const switcher = new SceneSwitcherComponent(
      makeSceneSwitcherProps({
        targetSceneId: 'scene-target',
        trigger: 'manual',
        transition: 'cut',
        once: true,
      }),
    );
    actor.addComponent(switcher);
    runtime.loadScene(host);
    host.add(actor);

    await switcher.activate();
    expect(runtime.activeScenes.some((s) => s.id === 'scene-target')).toBe(true);

    // once=true: second activate is a no-op (busy cleared, but fired stays true)
    const before = [...runtime.activeScenes].map((s) => s.id);
    await switcher.activate();
    expect([...runtime.activeScenes].map((s) => s.id)).toEqual(before);

    runtime.dispose();
  });

  it('auto-attaches InputListener when trigger is click', () => {
    const canvas = document.createElement('canvas');
    const runtime = Runtime.create({ canvas });
    const host = new Scene('Host');
    const actor = new Actor('click-switch');
    actor.addComponent(new TransformComponent(makeTransformProps()));
    const switcher = new SceneSwitcherComponent(
      makeSceneSwitcherProps({ trigger: 'click', targetSceneId: 'x' }),
    );
    actor.addComponent(switcher);
    runtime.loadScene(host);
    host.add(actor);

    expect(actor.getComponent(InputListenerComponent)).toBeDefined();
    runtime.dispose();
  });

  it('fires from uiClick when trigger is uiButton', async () => {
    const canvas = document.createElement('canvas');
    const runtime = Runtime.create({ canvas });
    const target = new Scene('Target', 'scene-ui');
    const targetData = target.serialize();
    runtime.sceneResolver = (id) => (id === 'scene-ui' ? targetData : undefined);

    const host = new Scene('Host', 'scene-host');
    const actor = new Actor('btn');
    actor.addComponent(new TransformComponent(makeTransformProps()));
    const switcher = new SceneSwitcherComponent(
      makeSceneSwitcherProps({
        targetSceneId: 'scene-ui',
        trigger: 'uiButton',
        transition: 'cut',
      }),
    );
    actor.addComponent(switcher);
    runtime.loadScene(host);
    host.add(actor);

    switcher.onEvent({ name: 'uiClick', payload: {} });
    // activate is async; give microtasks a tick
    await Promise.resolve();
    await Promise.resolve();
    expect(runtime.activeScenes.some((s) => s.id === 'scene-ui')).toBe(true);
    runtime.dispose();
  });
});
