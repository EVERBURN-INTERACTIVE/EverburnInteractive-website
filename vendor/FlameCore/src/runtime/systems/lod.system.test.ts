import { describe, expect, it, vi } from 'vitest';
import * as THREE from 'three';
import { LODComponent, makeLODProps } from '../components/lod.component';
import { pickLevel, LODSystem, LOD_SYSTEM_PRIORITY } from './lod.system';
import { Actor } from '../scene/actor';
import { Scene } from '../scene/scene';
import { Runtime } from '../runtime';
import { CameraComponent, makeCameraProps } from '../components/camera.component';

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
        capabilities: {
          getMaxAnisotropy: (): number => 16,
          isWebGL2: true,
          maxTextureSize: 8192,
        },
        info: { render: { calls: 0, triangles: 0 }, memory: { textures: 0, geometries: 0 } },
        outputColorSpace: actual.SRGBColorSpace,
        toneMapping: actual.ACESFilmicToneMapping,
        toneMappingExposure: 1,
        autoClear: true,
        domElement: document.createElement('canvas'),
      };
    }),
  };
});

describe('LODSystem.pickLevel', () => {
  function makeLOD(maxDistances: number[], hysteresis = 0): LODComponent {
    return new LODComponent(
      makeLODProps({
        levels: maxDistances.map((d) => ({ maxDistance: d })),
        hysteresis,
      }),
    );
  }

  it('picks the first level whose maxDistance contains the camera', () => {
    const lod = makeLOD([10, 25, 60]);
    expect(pickLevel(lod, 5)).toBe(0);
    expect(pickLevel(lod, 20)).toBe(1);
    expect(pickLevel(lod, 50)).toBe(2);
  });

  it('returns the last level when beyond every threshold', () => {
    const lod = makeLOD([10, 25, 60]);
    expect(pickLevel(lod, 1000)).toBe(2);
  });

  it('applies hysteresis when returning to a finer level', () => {
    const lod = makeLOD([10, 25, 60], 2);
    lod.switchToLevel(1, true);
    // Just inside level 0's max but inside the hysteresis band → stay at level 1.
    expect(pickLevel(lod, 9.5)).toBe(1);
    // Cross the hysteresis floor → snap back to level 0.
    expect(pickLevel(lod, 7)).toBe(0);
  });

  it('returns -1 when no levels exist', () => {
    const lod = new LODComponent(makeLODProps({ levels: [] }));
    expect(pickLevel(lod, 0)).toBe(-1);
  });
});

describe('LODSystem priority', () => {
  it('sits between INPUT and GAMEPLAY', () => {
    expect(LOD_SYSTEM_PRIORITY).toBe(15);
  });
});

describe('LODSystem integration', () => {
  it('switches level based on camera distance', () => {
    const canvas = document.createElement('canvas');
    const runtime = Runtime.create({ canvas });
    const scene = new Scene();

    // Camera actor at the origin.
    const camActor = new Actor('cam');
    const cam = new CameraComponent(makeCameraProps({ isMain: true }));
    camActor.addComponent(cam);
    scene.add(camActor);
    scene.mainCameraActorId = camActor.id;

    // LOD actor at (0,0,30) — should pick level 2 (default thresholds 10/25/60).
    const lodActor = new Actor('lod-actor');
    lodActor.object3D.position.set(0, 0, 30);
    const lod = new LODComponent(makeLODProps());
    lodActor.addComponent(lod);
    scene.add(lodActor);

    runtime.loadScene(scene);
    runtime.step(0.016);

    expect(lod.currentLevel).toBe(2);

    // Move closer — expect level 0.
    lodActor.object3D.position.set(0, 0, 5);
    runtime.step(0.016);
    expect(lod.currentLevel).toBe(0);

    runtime.dispose();
  });

  it('respects forcedLevel override and ignores distance', () => {
    const canvas = document.createElement('canvas');
    const runtime = Runtime.create({ canvas });
    const scene = new Scene();

    const camActor = new Actor('cam');
    camActor.addComponent(new CameraComponent(makeCameraProps({ isMain: true })));
    scene.add(camActor);
    scene.mainCameraActorId = camActor.id;

    const lodActor = new Actor('lod-actor');
    lodActor.object3D.position.set(0, 0, 100);
    const lod = new LODComponent(makeLODProps());
    lodActor.addComponent(lod);
    scene.add(lodActor);

    runtime.loadScene(scene);
    lod.setForcedLevel(0);
    runtime.step(0.016);
    // Even though the camera is far, the forced level wins.
    expect(lod.currentLevel).toBe(0);

    runtime.dispose();
  });

  it('uses the rendering system override camera when set', () => {
    const canvas = document.createElement('canvas');
    const runtime = Runtime.create({ canvas });
    const scene = new Scene();

    // Default camera at origin
    const camActor = new Actor('cam');
    camActor.addComponent(new CameraComponent(makeCameraProps({ isMain: true })));
    scene.add(camActor);
    scene.mainCameraActorId = camActor.id;

    const lodActor = new Actor('lod-actor');
    lodActor.object3D.position.set(0, 0, 5);
    const lod = new LODComponent(makeLODProps());
    lodActor.addComponent(lod);
    scene.add(lodActor);

    // Editor-style override camera placed far away.
    const overrideCam = new THREE.PerspectiveCamera(60, 1, 0.1, 1000);
    overrideCam.position.set(0, 0, 100);
    runtime.setOverrideCamera(overrideCam);

    runtime.loadScene(scene);
    runtime.step(0.016);

    // Distance from override camera (100 - 5 = 95) → last level.
    expect(lod.currentLevel).toBe(2);
    runtime.dispose();
  });
});

describe('LODSystem (standalone)', () => {
  it('is a System with the expected name & priority', () => {
    const sys = new LODSystem();
    expect(sys.name).toBe('LODSystem');
    expect(sys.priority).toBe(LOD_SYSTEM_PRIORITY);
  });
});
