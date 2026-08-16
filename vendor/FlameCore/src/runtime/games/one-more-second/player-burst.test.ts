import { describe, expect, it } from 'vitest';
import { BURST_COUNT, burstScale, spawnPlayerBurst, stepPlayerBurst } from './player-burst';

function seq(seed = 1): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

describe('player burst', () => {
  it('spawns shards at the crash origin with outward velocity', () => {
    const shards = spawnPlayerBurst(1.2, 0.92, 0, seq(7));
    expect(shards).toHaveLength(BURST_COUNT);
    let energy = 0;
    for (const s of shards) {
      expect(s.x).toBeCloseTo(1.2, 5);
      expect(s.y).toBeCloseTo(0.92, 5);
      energy += s.vx * s.vx + s.vy * s.vy + s.vz * s.vz;
    }
    expect(energy).toBeGreaterThan(80);
  });

  it('moves shards and expires them', () => {
    const shards = spawnPlayerBurst(0, 0.92, 0, seq(3));
    const later = stepPlayerBurst(shards, 0.05);
    expect(later.length).toBe(BURST_COUNT);
    expect(later.some((s) => Math.abs(s.x) > 0.02 || Math.abs(s.z) > 0.02)).toBe(true);
    let remaining = later;
    for (let i = 0; i < 80; i++) remaining = stepPlayerBurst(remaining, 0.05);
    expect(remaining).toHaveLength(0);
  });

  it('shrinks shards as they expire', () => {
    const [s] = spawnPlayerBurst(0, 1, 0, seq(2));
    expect(s).toBeDefined();
    const full = burstScale(s!);
    s!.life = s!.maxLife * 0.25;
    expect(burstScale(s!)).toBeLessThan(full);
  });
});
