import { describe, expect, it } from 'vitest';
import { interpolateValue, lerpCssColorString } from './interpolate';

describe('lerpCssColorString', () => {
  it('lerps hex colors', () => {
    expect(lerpCssColorString('#000000', '#ffffff', 0.5)).toBe('rgb(128, 128, 128)');
  });

  it('lerps rgb() colors', () => {
    expect(lerpCssColorString('rgb(0, 0, 0)', 'rgb(100, 0, 0)', 0.5)).toBe('rgb(50, 0, 0)');
  });

  it('returns undefined for non-colors', () => {
    expect(lerpCssColorString('hello', 'world', 0.5)).toBeUndefined();
  });
});

describe('interpolateValue string colors', () => {
  it('lerps CSS color strings mid-track', () => {
    const mid = interpolateValue('#000', '#fff', 0.5, 'string');
    expect(mid).toBe('rgb(128, 128, 128)');
  });

  it('steps non-color strings', () => {
    expect(interpolateValue('a', 'b', 0.4, 'string')).toBe('a');
    expect(interpolateValue('a', 'b', 0.6, 'string')).toBe('b');
  });
});
