import { describe, expect, it, vi } from 'vitest';
import { Runtime } from './runtime';
import { Scene } from './scene/scene';
import { Actor } from './scene/actor';
import './components';
import { TransformComponent, makeTransformProps } from './components/transform.component';
import { switchProjectScene } from './project-scene-navigator';

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

function serializeNamedScene(name: string, id: string): ReturnType<Scene['serialize']> {
  const scene = new Scene(name, id);
  const actor = new Actor(`${name}-actor`);
  actor.addComponent(new TransformComponent(makeTransformProps()));
  scene.add(actor);
  return scene.serialize();
}

describe('switchProjectScene', () => {
  it('replaces the active scene and emits projectSceneSwitched', async () => {
    const canvas = document.createElement('canvas');
    const runtime = Runtime.create({ canvas });
    const sceneA = serializeNamedScene('A', 'scene-a');
    const sceneB = serializeNamedScene('B', 'scene-b');
    runtime.sceneResolver = (id) => (id === 'scene-a' ? sceneA : id === 'scene-b' ? sceneB : undefined);

    const first = new Scene('A', 'scene-a');
    first.add(new Actor('keep'));
    runtime.loadScene(first);

    const events: string[] = [];
    runtime.events.on('projectSceneSwitched', ({ sceneId }) => {
      events.push(sceneId);
    });

    const next = await switchProjectScene(runtime, 'scene-b', { transition: 'cut' });
    expect(next.id).toBe('scene-b');
    expect(runtime.activeScenes.some((s) => s.id === 'scene-b')).toBe(true);
    expect(runtime.activeScenes.some((s) => s.id === 'scene-a')).toBe(false);
    expect(events).toEqual(['scene-b']);

    runtime.dispose();
  });

  it('throws when the resolver is missing or scene id is unknown', async () => {
    const canvas = document.createElement('canvas');
    const runtime = Runtime.create({ canvas });
    await expect(switchProjectScene(runtime, 'x')).rejects.toThrow(/sceneResolver/);
    runtime.sceneResolver = () => undefined;
    await expect(switchProjectScene(runtime, 'missing')).rejects.toThrow(/unknown scene/);
    runtime.dispose();
  });
});
