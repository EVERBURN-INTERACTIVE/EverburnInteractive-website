import { describe, expect, it, vi } from 'vitest';
import { QualityManager, QUALITY_PROFILES, applyQualityToContext } from './quality-manager';
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
        shadowMap: { enabled: false },
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

describe('QualityManager', () => {
  it('exposes preset defaults in cheap → expensive order', () => {
    expect(QUALITY_PROFILES.low.renderScale).toBeLessThan(QUALITY_PROFILES.medium.renderScale);
    expect(QUALITY_PROFILES.medium.renderScale).toBeLessThan(QUALITY_PROFILES.high.renderScale);
    expect(QUALITY_PROFILES.low.shadowsEnabled).toBe(false);
    expect(QUALITY_PROFILES.high.shadowsEnabled).toBe(true);
  });

  it('applies the initial preset on construction', () => {
    const qm = new QualityManager({ initialPreset: 'medium' });
    expect(qm.preset).toBe('medium');
    expect(qm.getEffectiveSettings()).toEqual(QUALITY_PROFILES.medium);
  });

  it('honors per-setting overrides', () => {
    const qm = new QualityManager({ initialPreset: 'low' });
    qm.setOverride('renderScale', 1);
    expect(qm.getEffectiveSettings().renderScale).toBe(1);
    expect(qm.getEffectiveSettings().shadowsEnabled).toBe(false);
  });

  it('emits settingsChanged on profile switch', () => {
    const qm = new QualityManager({ initialPreset: 'low' });
    const spy = vi.fn();
    qm.events.on('settingsChanged', spy);
    qm.applyProfile('high');
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy.mock.calls[0][0].preset).toBe('high');
  });

  it('clearOverrides reverts to preset defaults', () => {
    const qm = new QualityManager({ initialPreset: 'medium' });
    qm.setOverride('renderScale', 2);
    qm.clearOverrides();
    expect(qm.getEffectiveSettings()).toEqual(QUALITY_PROFILES.medium);
  });

  it('autoDetect returns "low" for missing WebGL2', () => {
    const fakeRenderer = {
      capabilities: { isWebGL2: false, maxTextureSize: 8192 },
    } as unknown as Parameters<typeof QualityManager.autoDetect>[0];
    expect(QualityManager.autoDetect(fakeRenderer)).toBe('low');
  });

  it('autoDetect returns "medium" when maxTextureSize < 4096', () => {
    // Force a large screen so the screen-size heuristic doesn't override.
    const originalScreen = window.screen;
    Object.defineProperty(window, 'screen', {
      configurable: true,
      value: { width: 1920, height: 1080 },
    });
    try {
      const fakeRenderer = {
        capabilities: { isWebGL2: true, maxTextureSize: 2048 },
      } as unknown as Parameters<typeof QualityManager.autoDetect>[0];
      expect(QualityManager.autoDetect(fakeRenderer)).toBe('medium');
    } finally {
      Object.defineProperty(window, 'screen', { configurable: true, value: originalScreen });
    }
  });

  it('applies settings to context on attach', () => {
    const canvas = document.createElement('canvas');
    const runtime = Runtime.create({ canvas });
    // Runtime.create attached a default QualityManager — assert renderer matches profile.
    const settings = runtime.context.quality.getEffectiveSettings();
    expect(runtime.context.renderer.shadowMap.enabled).toBe(settings.shadowsEnabled);
    runtime.dispose();
  });

  it('applyQualityToContext mutates the renderer directly', () => {
    const canvas = document.createElement('canvas');
    const runtime = Runtime.create({ canvas });
    applyQualityToContext(runtime.context, QUALITY_PROFILES.low);
    expect(runtime.context.renderer.shadowMap.enabled).toBe(false);
    expect(runtime.context.renderScale).toBe(QUALITY_PROFILES.low.renderScale);
    runtime.dispose();
  });
});
