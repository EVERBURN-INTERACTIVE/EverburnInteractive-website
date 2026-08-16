import { describe, expect, it } from 'vitest';
import {
  computeScrollProgress,
} from '../systems/scroll-trigger.system';

describe('ScrollTriggerSystem', () => {
  it('computes normalized scroll progress', () => {
    expect(
      computeScrollProgress(500, { scrollStart: 0, scrollEnd: 1000, clamp: true }),
    ).toBe(0.5);
  });

  it('clamps progress when enabled', () => {
    expect(
      computeScrollProgress(2000, { scrollStart: 0, scrollEnd: 1000, clamp: true }),
    ).toBe(1);
  });
});
