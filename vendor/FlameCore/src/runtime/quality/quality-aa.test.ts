import { describe, expect, it } from 'vitest';
import {
  createTimeAntialias,
  shouldUseFxaa,
  QUALITY_PROFILES,
  applyQualityToContext,
} from './quality-manager';
import { RuntimeContext } from '../runtime-context';
import { vi } from 'vitest';

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

describe('quality AA helpers', () => {
  it('maps presets to MSAA / FXAA correctly', () => {
    expect(createTimeAntialias(QUALITY_PROFILES.low)).toBe(false);
    expect(shouldUseFxaa(QUALITY_PROFILES.low)).toBe(false);

    expect(createTimeAntialias(QUALITY_PROFILES.medium)).toBe(false);
    expect(shouldUseFxaa(QUALITY_PROFILES.medium)).toBe(true);

    // high: postProcessing forces FXAA, so no create-time MSAA
    expect(createTimeAntialias(QUALITY_PROFILES.high)).toBe(false);
    expect(shouldUseFxaa(QUALITY_PROFILES.high)).toBe(true);
  });

  it('applyQualityToContext sets fxaaEnabled', () => {
    const ctx = new RuntimeContext({ canvas: document.createElement('canvas'), qualityPreset: 'low' });
    expect(ctx.fxaaEnabled).toBe(false);
    applyQualityToContext(ctx, QUALITY_PROFILES.medium);
    expect(ctx.fxaaEnabled).toBe(true);
    ctx.dispose();
  });
});
