import { EnvironmentComponent, makeEnvironmentProps } from '@runtime/components/environment.component';
import { LightComponent, makeLightProps } from '@runtime/components/light.component';
import {
  ParticleSystemComponent,
  makeParticleSystemProps,
} from '@runtime/components/particle-system.component';
import { TransformComponent, makeTransformProps } from '@runtime/components/transform.component';
import { makeDefaultEmitter, makeParticleSystemAsset } from '@runtime/particles/types';
import { Actor } from '@runtime/scene/actor';
import type { Scene } from '@runtime/scene/scene';

import { createEverburnRuntime, type EverburnFlameCoreBundle } from './createEverburnRuntime';

function addForgeParticles(scene: Scene): void {
  const actor = new Actor('ForgeEmbers');
  actor.addComponent(new TransformComponent(makeTransformProps({ position: [0, 0.35, 0] })));
  const particles = new ParticleSystemComponent(
    makeParticleSystemProps({
      autoPlay: true,
      playbackSpeed: 1,
      emissionRateScale: 1.15,
    }),
  );
  actor.addComponent(particles);
  scene.add(actor);

  const rising = makeDefaultEmitter({
    name: 'RisingEmbers',
    capacity: 120,
    spawn: { rate: 18, duration: 0, looping: true },
    initialModules: [
      { type: 'InitPositionSphere', params: { radius: 0.16 } },
      { type: 'InitVelocityCone', params: { angleDeg: 14, speedMin: 1.8, speedMax: 3.8 } },
      { type: 'InitSizeRandomBetween', params: { min: 0.018, max: 0.045 } },
      {
        type: 'InitColorRandomBetween',
        params: { colorA: [1, 0.92, 0.45, 1], colorB: [1, 0.28, 0.05, 1] },
      },
      { type: 'InitLifetimeRandomBetween', params: { min: 1.1, max: 2.4 } },
    ],
  });

  const ash = makeDefaultEmitter({
    name: 'FallingAsh',
    capacity: 180,
    spawn: { rate: 18, duration: 0, looping: true },
    initialModules: [
      { type: 'InitPositionSphere', params: { radius: 3.4 } },
      { type: 'InitVelocityCone', params: { angleDeg: 50, speedMin: 0.15, speedMax: 0.55 } },
      { type: 'InitSizeRandomBetween', params: { min: 0.02, max: 0.06 } },
      {
        type: 'InitColorRandomBetween',
        params: { colorA: [1, 0.45, 0.12, 0.7], colorB: [0.35, 0.12, 0.04, 0.35] },
      },
      { type: 'InitLifetimeRandomBetween', params: { min: 2.5, max: 5 } },
    ],
  });

  particles.setAsset(
    makeParticleSystemAsset({
      id: 'forge-embers',
      name: 'Forge Embers',
      simulationSpace: 'local',
      emitters: [rising, ash],
      maxParticleBudget: 512,
    }),
  );
  particles.setParameter('gravity', [0, 1.8, 0]);
}

function addForgeLights(scene: Scene): void {
  const hearth = new Actor('ForgeHearthLight');
  hearth.addComponent(new TransformComponent(makeTransformProps({ position: [0, 1.4, 0] })));
  hearth.addComponent(
    new LightComponent(
      makeLightProps({
        kind: 'point',
        color: [1, 0.42, 0.12],
        intensity: 7.4,
        distance: 28,
        decay: 1.6,
        castShadow: false,
      }),
    ),
  );
  scene.add(hearth);

  const rim = new Actor('ForgeRimLight');
  rim.addComponent(new TransformComponent(makeTransformProps({ position: [-6, 8, 4] })));
  rim.addComponent(
    new LightComponent(
      makeLightProps({
        kind: 'directional',
        color: [1, 0.55, 0.28],
        intensity: 0.55,
        castShadow: false,
      }),
    ),
  );
  scene.add(rim);

  const sky = new Actor('ForgeHemisphere');
  sky.addComponent(new TransformComponent(makeTransformProps({ position: [0, 6, 0] })));
  sky.addComponent(
    new LightComponent(
      makeLightProps({
        kind: 'hemisphere',
        color: [0.08, 0.03, 0.02],
        skyColor: [1, 0.38, 0.12],
        intensity: 0.35,
        castShadow: false,
      }),
    ),
  );
  scene.add(sky);
}

function populateForgeActors(scene: Scene): void {
  const env = scene.actors.find((actor) => actor.name === 'Environment');
  const environment = env?.getComponent(EnvironmentComponent);
  environment?.setProps(
    makeEnvironmentProps({
      backgroundMode: 'transparent',
      backgroundColor: [0.02, 0.012, 0.02],
      fog: {
        enabled: false,
        color: [0.02, 0.012, 0.02],
        near: 28,
        far: 80,
      },
      exposure: 1.05,
    }),
  );

  addForgeLights(scene);
  addForgeParticles(scene);
}

/** Boots FlameCore with forge particles and lights. The R3F world owns rings and sky. */
export function createForgeRuntime(canvas: HTMLCanvasElement): EverburnFlameCoreBundle {
  const bundle = createEverburnRuntime(canvas);
  bundle.scene.name = 'Forge';
  bundle.scene.settings.clearColor = false;
  bundle.scene.settings.background = '#050308';

  try {
    populateForgeActors(bundle.scene);
  } catch (error) {
    console.error('[createForgeRuntime] Failed to attach FlameCore forge actors:', error);
  }

  return bundle;
}
