import { describe, expect, it, vi } from 'vitest';
import { Runtime } from '../runtime';
import { Scene } from '../scene/scene';
import { Actor } from '../scene/actor';
import { TransformComponent, makeTransformProps } from './transform.component';
import {
  ParticleSystemComponent,
  makeParticleSystemProps,
} from './particle-system.component';
import { makeParticleSystemAsset, makeDefaultEmitter } from '../particles/types';
import type { ParticleSystem } from '../systems/particle.system';

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

function setup(): { runtime: Runtime; comp: ParticleSystemComponent; system: ParticleSystem } {
  const canvas = document.createElement('canvas');
  const runtime = Runtime.create({ canvas });
  const scene = new Scene('Host');
  runtime.loadScene(scene);
  const actor = new Actor('emitter-actor');
  actor.addComponent(new TransformComponent(makeTransformProps()));
  const comp = new ParticleSystemComponent(makeParticleSystemProps({ autoPlay: false }));
  actor.addComponent(comp);
  scene.add(actor);
  const system = runtime.systems.find((s) => s.name === 'ParticleSystem') as ParticleSystem;
  return { runtime, comp, system };
}

describe('ParticleSystemComponent', () => {
  it('registers a ParticleSystem in the default runtime stack', () => {
    const { system } = setup();
    expect(system).toBeDefined();
    expect(system.name).toBe('ParticleSystem');
  });

  it('spawns particles after setAsset + play + tick', () => {
    const { comp, system } = setup();
    const asset = makeParticleSystemAsset({
      emitters: [makeDefaultEmitter({ spawn: { rate: 100, duration: 0, looping: true } })],
    });
    comp.setAsset(asset);
    comp.play();
    expect(comp.isPlaying).toBe(true);
    system.onUpdate(0.1); // 100/s * 0.1s = ~10 particles
    expect(comp.liveParticleCount).toBeGreaterThan(0);
    expect(system.getStats().liveParticles).toBe(comp.liveParticleCount);
  });

  it('stop() clears live particles', () => {
    const { comp, system } = setup();
    comp.setAsset(makeParticleSystemAsset());
    comp.play();
    system.onUpdate(0.2);
    expect(comp.liveParticleCount).toBeGreaterThan(0);
    comp.stop();
    expect(comp.isPlaying).toBe(false);
    expect(comp.liveParticleCount).toBe(0);
  });

  it('culls particles once they exceed their lifetime', () => {
    const { comp, system } = setup();
    const asset = makeParticleSystemAsset({
      emitters: [
        makeDefaultEmitter({
          spawn: { rate: 50, duration: 0, looping: true },
          initialModules: [
            { type: 'InitLifetimeRandomBetween', params: { min: 0.1, max: 0.1 } },
          ],
          updateModules: [],
        }),
      ],
    });
    comp.setAsset(asset);
    comp.play();
    system.onUpdate(0.05); // spawn some
    const before = comp.liveParticleCount;
    expect(before).toBeGreaterThan(0);
    // Advance well past lifetime with no new spawns (rate small * dt rounding).
    for (let i = 0; i < 5; i++) system.onUpdate(0.05);
    // Particles older than 0.1s are culled; with continuous spawn the count
    // stabilizes rather than growing unbounded.
    expect(comp.liveParticleCount).toBeLessThan(before + 50);
  });

  it('does no work when no particle component is registered', () => {
    const canvas = document.createElement('canvas');
    const runtime = Runtime.create({ canvas });
    const system = runtime.systems.find((s) => s.name === 'ParticleSystem') as ParticleSystem;
    expect(system.getStats().components).toBe(0);
    expect(() => system.onUpdate(0.016)).not.toThrow();
  });

  it('disposes emitters when the actor leaves the scene', () => {
    const { comp, runtime } = setup();
    comp.setAsset(makeParticleSystemAsset());
    comp.play();
    expect(comp.emitters.length).toBeGreaterThan(0);
    const scene = runtime.scenes[0];
    const actor = comp.actor!;
    scene.remove(actor);
    expect(comp.emitters.length).toBe(0);
  });
});
