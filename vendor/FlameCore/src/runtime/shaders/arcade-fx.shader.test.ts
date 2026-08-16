import { describe, expect, it } from 'vitest';
import { arcadeFxActive } from './arcade-fx.shader';

describe('arcadeFxActive', () => {
  it('is false when every knob is zero', () => {
    expect(
      arcadeFxActive({
        chromaticAberration: 0,
        vignette: 0,
        scanline: 0,
        glitch: 0,
        invert: 0,
        flash: 0,
      }),
    ).toBe(false);
  });

  it('is true when rewind invert is visible', () => {
    expect(
      arcadeFxActive({
        chromaticAberration: 0,
        vignette: 0,
        scanline: 0,
        glitch: 0,
        invert: 1,
        flash: 0,
      }),
    ).toBe(true);
  });
});
