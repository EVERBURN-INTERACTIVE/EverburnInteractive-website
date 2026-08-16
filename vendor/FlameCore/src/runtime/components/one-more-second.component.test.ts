import { describe, expect, it, vi } from 'vitest';
import * as THREE from 'three';
import { Runtime } from '../runtime';
import { Scene } from '../scene/scene';
import { Actor } from '../scene/actor';
import '../components';
import { TransformComponent, makeTransformProps } from './transform.component';
import { CameraComponent, makeCameraProps } from './camera.component';
import {
  OneMoreSecondGameComponent,
  makeOneMoreSecondGameProps,
} from './one-more-second.component';

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
        getSize: (v: { set(x: number, y: number): void }): void => {
          v.set(64, 64);
        },
        getPixelRatio: (): number => 1,
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

describe('OneMoreSecondGameComponent', () => {
  it('serializes versioned props', () => {
    const props = makeOneMoreSecondGameProps({ playerActorName: 'Hero' });
    expect(props._version).toBe(1);
    expect(props.enabled).toBe(true);
    expect(props.playerActorName).toBe('Hero');
  });

  it('boots a world view and survives an update tick', () => {
    const canvas = document.createElement('canvas');
    const runtime = Runtime.create({ canvas });
    const scene = new Scene('OMS');
    const actor = new Actor('GameController');
    actor.addComponent(new TransformComponent(makeTransformProps()));
    actor.addComponent(new OneMoreSecondGameComponent(makeOneMoreSecondGameProps()));
    runtime.loadScene(scene);
    scene.add(actor);
    expect(() => scene.update(1 / 60)).not.toThrow();
    expect(scene.threeScene.children.some((c) => c.name === 'OneMoreSecondWorld')).toBe(true);
    runtime.dispose();
  });

  it('orients the play camera down the +Z corridor', () => {
    const canvas = document.createElement('canvas');
    const runtime = Runtime.create({ canvas });
    const scene = new Scene('OMS');
    runtime.loadScene(scene);

    const camActor = new Actor('Camera');
    camActor.addComponent(new TransformComponent(makeTransformProps({ rotation: [0, 0, 0] })));
    camActor.addComponent(new CameraComponent(makeCameraProps({ isMain: true, fov: 62 })));
    scene.add(camActor);

    const actor = new Actor('GameController');
    actor.addComponent(new TransformComponent(makeTransformProps()));
    actor.addComponent(new OneMoreSecondGameComponent(makeOneMoreSecondGameProps()));
    scene.add(actor);

    scene.update(1 / 60);
    expect(camActor.object3D.rotation.y).toBeCloseTo(Math.PI, 5);
    const dir = new THREE.Vector3();
    camActor.getComponent(CameraComponent)!.camera!.getWorldDirection(dir);
    expect(dir.z).toBeGreaterThan(0.9);

    runtime.dispose();
  });
});
