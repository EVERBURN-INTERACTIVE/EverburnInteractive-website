import { describe, expect, it } from 'vitest';
import { ParticleBuffer } from './buffer';

describe('ParticleBuffer', () => {
  it('spawns up to capacity then returns -1', () => {
    const buf = new ParticleBuffer(3);
    expect(buf.spawn()).toBe(0);
    expect(buf.spawn()).toBe(1);
    expect(buf.spawn()).toBe(2);
    expect(buf.spawn()).toBe(-1);
    expect(buf.count).toBe(3);
  });

  it('resets a spawned slot to defaults', () => {
    const buf = new ParticleBuffer(2);
    const i = buf.spawn();
    expect(buf.size[i]).toBe(1);
    expect(buf.a[i]).toBe(1);
    expect(buf.age[i]).toBe(0);
    expect(buf.life[i]).toBe(1);
  });

  it('kills via swap-with-last preserving the survivor data', () => {
    const buf = new ParticleBuffer(3);
    const a = buf.spawn();
    const b = buf.spawn();
    const c = buf.spawn();
    buf.posX[a] = 10;
    buf.posX[b] = 20;
    buf.posX[c] = 30;
    buf.kill(a); // c (last) should move into slot a.
    expect(buf.count).toBe(2);
    expect(buf.posX[a]).toBe(30);
    expect(buf.posX[1]).toBe(20);
  });

  it('killing the last element just decrements count', () => {
    const buf = new ParticleBuffer(2);
    buf.spawn();
    const b = buf.spawn();
    buf.posX[b] = 99;
    buf.kill(b);
    expect(buf.count).toBe(1);
  });

  it('captureStartValues snapshots size and color', () => {
    const buf = new ParticleBuffer(1);
    const i = buf.spawn();
    buf.size[i] = 2;
    buf.r[i] = 0.5;
    buf.captureStartValues(i);
    expect(buf.startSize[i]).toBe(2);
    expect(buf.startR[i]).toBe(0.5);
  });
});
