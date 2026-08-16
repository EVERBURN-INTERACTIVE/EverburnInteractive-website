import { describe, expect, it, vi } from 'vitest';
import { Runtime, Scene, type System } from '../index';
import { SystemPriority } from '@shared/types';

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

class OrderRecordingSystem implements System {
  readonly name: string;
  constructor(
    name: string,
    public readonly priority: number,
    private readonly log: string[],
  ) {
    this.name = name;
  }
  onUpdate(): void {
    this.log.push(this.name);
  }
}

describe('Runtime', () => {
  it('updates systems in priority order', () => {
    const canvas = document.createElement('canvas');
    const runtime = Runtime.create({ canvas });
    const log: string[] = [];
    runtime.registerSystem(new OrderRecordingSystem('Animation', SystemPriority.ANIMATION, log));
    runtime.registerSystem(new OrderRecordingSystem('Physics', SystemPriority.PHYSICS, log));

    runtime.step(0.016);
    // Built-in: Input(10), Gameplay(20), then user Physics(30), Animation(40), then Rendering(50)
    // Our recording systems should appear in order Physics → Animation.
    const physicsIdx = log.indexOf('Physics');
    const animIdx = log.indexOf('Animation');
    expect(physicsIdx).toBeGreaterThanOrEqual(0);
    expect(animIdx).toBeGreaterThan(physicsIdx);
    runtime.dispose();
  });

  it('start/stop toggles isRunning', () => {
    const canvas = document.createElement('canvas');
    const runtime = Runtime.create({ canvas });
    expect(runtime.isRunning).toBe(false);
    runtime.start();
    expect(runtime.isRunning).toBe(true);
    runtime.stop();
    expect(runtime.isRunning).toBe(false);
    runtime.dispose();
  });

  it('loadScene initializes and activates the scene', () => {
    const canvas = document.createElement('canvas');
    const runtime = Runtime.create({ canvas });
    const scene = new Scene('S');
    runtime.loadScene(scene);
    expect(scene.isInitialized).toBe(true);
    expect(scene.isActive).toBe(true);
    expect(runtime.activeScenes).toContain(scene);
    runtime.dispose();
  });
});
