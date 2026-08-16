import { describe, expect, it, vi } from 'vitest';
import * as THREE from 'three';
import { Runtime } from '../runtime';
import { Scene } from '../scene/scene';
import { Actor } from '../scene/actor';
import { TransformComponent, makeTransformProps } from './transform.component';
import { CameraComponent, makeCameraProps } from './camera.component';
import {
  EnvironmentComponent,
  makeDynamicFogSettings,
  makeEnvironmentProps,
} from './environment.component';

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
    PMREMGenerator: vi.fn().mockImplementation(function PMREMGenerator() {
      return {
        fromScene: () => ({ texture: new actual.Texture() }),
        fromEquirectangular: () => ({ texture: new actual.Texture() }),
        dispose: vi.fn(),
      };
    }),
  };
});

describe('EnvironmentComponent dynamic fog', () => {
  it('makeDynamicFogSettings defaults stay disabled', () => {
    expect(makeDynamicFogSettings().enabled).toBe(false);
  });

  it('opens fog far when the camera moves forward, then settles', () => {
    const canvas = document.createElement('canvas');
    const runtime = Runtime.create({ canvas });
    const scene = new Scene('FogHall');
    runtime.loadScene(scene);

    const camActor = new Actor('Main Camera');
    camActor.addComponent(
      new TransformComponent(makeTransformProps({ position: [0, 1.6, 0] })),
    );
    camActor.addComponent(new CameraComponent(makeCameraProps({ isMain: true })));
    scene.add(camActor);

    const envActor = new Actor('Environment');
    envActor.addComponent(new TransformComponent(makeTransformProps()));
    const env = new EnvironmentComponent(
      makeEnvironmentProps({
        fog: {
          enabled: true,
          color: [0.02, 0.02, 0.02],
          near: 2,
          far: 11,
          dynamic: makeDynamicFogSettings({
            enabled: true,
            moveClearance: 8,
            nearClearance: 1,
            openSpeed: 20,
            settleSpeed: 20,
            speedForFullClearance: 2,
          }),
        },
      }),
    );
    envActor.addComponent(env);
    scene.add(envActor);
    scene.enter();

    const fog = scene.threeScene.fog as THREE.Fog;
    expect(fog).toBeInstanceOf(THREE.Fog);
    expect(fog.far).toBeCloseTo(11, 3);

    const cam = camActor.getComponent(CameraComponent)!.camera!;
    const transform = camActor.getComponent(TransformComponent)!;
    // Seed previous position.
    env.onUpdate(1 / 60);
    // Keep moving forward along -Z (default camera looks down -Z).
    for (let i = 0; i < 30; i++) {
      const z = transform.props.position[2] - 0.08;
      transform.setProps({ position: [0, 1.6, z] });
      camActor.object3D.updateMatrixWorld(true);
      env.onUpdate(1 / 60);
    }

    expect(fog.far).toBeGreaterThan(14);

    // Hold still — fog should settle back toward base.
    for (let i = 0; i < 90; i++) env.onUpdate(1 / 60);
    expect(fog.far).toBeLessThan(12.5);
  });
});
