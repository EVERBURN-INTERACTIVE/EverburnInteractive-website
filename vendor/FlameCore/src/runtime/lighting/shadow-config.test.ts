import * as THREE from 'three';
import { describe, expect, it, vi } from 'vitest';
import {
  applyShadowFlags,
  configureLightShadows,
  syncSceneLightShadows,
  resolveCastShadowOpacity,
  DEFAULT_DIRECTIONAL_SHADOW_EXTENT,
} from './shadow-config';
import { QUALITY_PROFILES } from '../quality/quality-manager';
import { Actor } from '../scene/actor';
import { Scene } from '../scene/scene';
import { LightComponent, makeLightProps } from '../components/light.component';
import { MeshRendererComponent, makeMeshRendererProps } from '../components/mesh-renderer.component';
import { TransformComponent, makeTransformProps } from '../components/transform.component';
import { Runtime } from '../runtime';

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
        shadowMap: { enabled: false, type: 0 },
        capabilities: {
          getMaxAnisotropy: (): number => 16,
          isWebGL2: true,
          maxTextureSize: 8192,
        },
        info: {
          render: { calls: 0, triangles: 0 },
          memory: { textures: 0, geometries: 0 },
        },
        outputColorSpace: actual.SRGBColorSpace,
        toneMapping: actual.ACESFilmicToneMapping,
        toneMappingExposure: 1,
        autoClear: true,
        domElement: document.createElement('canvas'),
      };
    }),
  };
});

describe('shadow-config', () => {
  it('configureLightShadows sizes directional ortho frustum and map', () => {
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.castShadow = true;
    configureLightShadows(light, QUALITY_PROFILES.high);
    expect(light.shadow.mapSize.x).toBe(QUALITY_PROFILES.high.shadowMapSize);
    expect(light.shadow.mapSize.y).toBe(QUALITY_PROFILES.high.shadowMapSize);
    const cam = light.shadow.camera as THREE.OrthographicCamera;
    expect(cam.left).toBe(-DEFAULT_DIRECTIONAL_SHADOW_EXTENT);
    expect(cam.right).toBe(DEFAULT_DIRECTIONAL_SHADOW_EXTENT);
    expect(cam.far).toBeGreaterThan(50);
  });

  it('applyShadowFlags walks nested GLTF-like meshes', () => {
    const root = new THREE.Group();
    const child = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshStandardMaterial());
    root.add(child);
    applyShadowFlags(root, true, false);
    expect(child.castShadow).toBe(true);
    expect(child.receiveShadow).toBe(false);
  });

  it('resolveCastShadowOpacity lightens translucent casters by default', () => {
    expect(resolveCastShadowOpacity(true, 1)).toBe(1);
    expect(resolveCastShadowOpacity(true, 0.92)).toBeLessThan(0.35);
    expect(resolveCastShadowOpacity(true, 0.92, 0.18)).toBe(0.18);
    expect(resolveCastShadowOpacity(false, 0.5)).toBe(0);
  });

  it('applyShadowFlags installs dithered depth materials below full opacity', () => {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshStandardMaterial());
    applyShadowFlags(mesh, true, true, 0.2);
    expect(mesh.customDepthMaterial).toBeTruthy();
    expect(mesh.customDistanceMaterial).toBeTruthy();
    applyShadowFlags(mesh, true, true, 1);
    expect(mesh.customDepthMaterial).toBeUndefined();
  });

  it('syncSceneLightShadows only touches casting lights', () => {
    const root = new THREE.Group();
    const casting = new THREE.DirectionalLight();
    casting.castShadow = true;
    const idle = new THREE.DirectionalLight();
    idle.castShadow = false;
    root.add(casting, idle);
    syncSceneLightShadows(root, QUALITY_PROFILES.medium);
    expect(casting.shadow.mapSize.x).toBe(QUALITY_PROFILES.medium.shadowMapSize);
    expect(idle.shadow.mapSize.x).toBe(512); // Three.js default
  });
});

describe('LightComponent shadows', () => {
  it('defaults directional lights to castShadow and configures the map', () => {
    const scene = new Scene('ShadowTest');
    const actor = new Actor('Sun');
    actor.addComponent(new TransformComponent(makeTransformProps({ position: [5, 10, 5] })));
    actor.addComponent(new LightComponent(makeLightProps({ kind: 'directional' })));
    scene.add(actor);

    const light = actor.getComponent(LightComponent)?.light as THREE.DirectionalLight;
    expect(actor.getComponent(LightComponent)?.props.castShadow).toBe(true);
    expect(light.castShadow).toBe(true);
    expect(light.shadow.mapSize.x).toBeGreaterThanOrEqual(1024);
    expect(light.target.parent).toBe(actor.object3D);
  });

  it('does not enable castShadow on ambient lights', () => {
    const props = makeLightProps({ kind: 'ambient' });
    expect(props.castShadow).toBe(false);
  });
});

describe('MeshRendererComponent shadow defaults', () => {
  it('defaults cast and receive on for new meshes', () => {
    const props = makeMeshRendererProps({ shape: 'box' });
    expect(props.castShadow).toBe(true);
    expect(props.receiveShadow).toBe(true);

    const scene = new Scene('MeshShadow');
    const actor = new Actor('Box');
    actor.addComponent(new TransformComponent(makeTransformProps()));
    actor.addComponent(new MeshRendererComponent(props));
    scene.add(actor);
    const mesh = actor.getComponent(MeshRendererComponent)?.mesh;
    expect(mesh?.castShadow).toBe(true);
    expect(mesh?.receiveShadow).toBe(true);
  });
});

describe('Runtime quality shadow sync', () => {
  it('enables renderer shadowMap on medium/high and resizes light maps', () => {
    const canvas = document.createElement('canvas');
    const runtime = Runtime.create({ canvas, qualityPreset: 'high' });
    expect(runtime.context.renderer.shadowMap.enabled).toBe(true);

    const scene = new Scene('Sync');
    const sun = new Actor('Sun');
    sun.addComponent(new TransformComponent(makeTransformProps({ position: [4, 8, 2] })));
    sun.addComponent(new LightComponent(makeLightProps({ kind: 'directional', castShadow: true })));
    scene.add(sun);
    runtime.loadScene(scene);

    const light = sun.getComponent(LightComponent)?.light as THREE.DirectionalLight;
    expect(light.shadow.mapSize.x).toBe(QUALITY_PROFILES.high.shadowMapSize);

    runtime.context.quality.applyProfile('medium');
    expect(runtime.context.renderer.shadowMap.enabled).toBe(true);
    expect(light.shadow.mapSize.x).toBe(QUALITY_PROFILES.medium.shadowMapSize);

    runtime.context.quality.applyProfile('low');
    expect(runtime.context.renderer.shadowMap.enabled).toBe(false);

    runtime.dispose();
  });
});
