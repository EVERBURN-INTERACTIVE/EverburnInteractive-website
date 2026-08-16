import { describe, expect, it } from 'vitest';
import { OneMoreSecondGalaxySky } from './galaxy-sky';

describe('OneMoreSecondGalaxySky', () => {
  it('builds nebula and star layers and advances without allocating a scene', () => {
    const sky = new OneMoreSecondGalaxySky();
    expect(sky.root.name).toBe('OneMoreSecondGalaxy');
    expect(sky.root.children.length).toBeGreaterThanOrEqual(3);
    expect(() => sky.sync(1 / 60, 1.4)).not.toThrow();
    sky.dispose();
  });

  it('drops the extra wisp layer on low quality', () => {
    const sky = new OneMoreSecondGalaxySky('low');
    expect(sky.root.children.length).toBe(2);
    sky.dispose();
  });
});
