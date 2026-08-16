import { describe, expect, it } from 'vitest';
import { difficultyAt } from './difficulty';

describe('difficultyAt', () => {
  it('starts at 1× with a forgiving density', () => {
    const d = difficultyAt(0);
    expect(d.speedMul).toBe(1);
    expect(d.moving).toBe(false);
    expect(d.larger).toBe(false);
    expect(d.density).toBeLessThan(0.5);
  });

  it('follows the documented speed steps', () => {
    expect(difficultyAt(20).speedMul).toBe(1.25);
    expect(difficultyAt(40).speedMul).toBe(1.5);
    expect(difficultyAt(40).moving).toBe(true);
    expect(difficultyAt(60).speedMul).toBe(2);
    expect(difficultyAt(90).speedMul).toBe(2.5);
    expect(difficultyAt(90).larger).toBe(true);
    expect(difficultyAt(90).complex).toBe(true);
  });

  it('keeps accelerating after 120s without washing out the view', () => {
    const a = difficultyAt(120);
    const b = difficultyAt(140);
    expect(b.speedMul).toBeGreaterThan(a.speedMul);
    expect(b.glitch).toBeGreaterThan(a.glitch);
    expect(b.glitch).toBeLessThan(0.2);
    expect(b.chromatic).toBeLessThan(0.2);
    expect(b.shake).toBeLessThan(0.06);
    expect(b.fovBoost).toBeLessThan(8);
  });

  it('narrows the corridor after 90s', () => {
    expect(difficultyAt(90).halfWidth).toBeGreaterThan(difficultyAt(120).halfWidth);
  });
});
