import { SystemPriority } from '@shared/types';
import type { ParticleSystemComponent } from '../components/particle-system.component';
import type { Runtime } from '../runtime';
import type { System } from './system';

/** Aggregate statistics for the particle system (perf overlay). */
export interface ParticleStats {
  /** Number of registered (active) particle components. */
  components: number;
  /** Total live particles across all components. */
  liveParticles: number;
}

/**
 * The ParticleSystem advances every registered {@link ParticleSystemComponent}
 * once per frame. It is fully opt-in: with no components registered the
 * `onUpdate` hook early-outs and the system does no work and allocates nothing.
 *
 * Priority: 45 — between ANIMATION (40) and RENDERING (50). Animation may move
 * the actor that emits particles, so particles simulate using post-animation
 * transforms and upload their buffers just before the render pass.
 *
 * See PRD 11 (Niagara-style Particle System).
 */
export class ParticleSystem implements System {
  readonly name = 'ParticleSystem';
  readonly priority = SystemPriority.ANIMATION + 5;

  private readonly _components = new Set<ParticleSystemComponent>();

  onRegister(_runtime: Runtime): void {
    /* no per-frame runtime reference needed; components self-register. */
  }

  onUnregister(): void {
    this._components.clear();
  }

  /** Register a {@link ParticleSystemComponent}. */
  register(component: ParticleSystemComponent): void {
    this._components.add(component);
  }

  /** Unregister a {@link ParticleSystemComponent}. */
  unregister(component: ParticleSystemComponent): void {
    this._components.delete(component);
  }

  onUpdate(dt: number): void {
    if (this._components.size === 0) return; // opt-in: no work without components.
    for (const c of this._components) {
      c._tick(dt);
    }
  }

  /** Aggregate stats for the performance overlay. */
  getStats(): ParticleStats {
    let live = 0;
    for (const c of this._components) live += c.liveParticleCount;
    return { components: this._components.size, liveParticles: live };
  }
}
