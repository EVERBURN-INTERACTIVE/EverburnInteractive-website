import { describe, expect, it } from 'vitest';
import { RewindBuffer, cloneSnapshot } from './rewind-buffer';
import type { SimSnapshot } from './types';

function snap(t: number): SimSnapshot {
  return {
    phase: 'playing',
    timeAlive: t,
    distance: t * 16,
    score: t * 10,
    multiplier: 1,
    playerX: 0,
    playerVx: 0,
    halfWidth: 3.2,
    speed: 16,
    nextFillZ: 80,
    nextRewindRegenAt: 15,
    rngState: 1,
    nextId: 1,
    obstacles: [],
    fragments: [],
  };
}

describe('RewindBuffer', () => {
  it('returns the oldest sample after filling one second', () => {
    const buf = new RewindBuffer(1, 40);
    for (let i = 0; i < 50; i++) buf.push(snap(i / 40), 1 / 40);
    const oldest = buf.oldest();
    expect(oldest).toBeDefined();
    expect(oldest!.timeAlive).toBeLessThan(0.4);
  });

  it('at(1) is about one second behind the newest sample', () => {
    const buf = new RewindBuffer(1, 40);
    for (let i = 0; i <= 80; i++) buf.push(snap(i / 40), 1 / 40);
    const past = buf.at(1);
    expect(past).toBeDefined();
    expect(past!.timeAlive).toBeGreaterThan(0.8);
    expect(past!.timeAlive).toBeLessThan(1.3);
  });

  it('cloneSnapshot deep-copies obstacles', () => {
    const a = snap(1);
    const copy = cloneSnapshot({
      ...a,
      obstacles: [
        {
          id: 7,
          kind: 'block',
          x: 1,
          y: 1,
          z: 4,
          halfW: 0.5,
          halfH: 0.5,
          halfD: 0.5,
          xBase: 1,
          xAmp: 0,
          xFreq: 0,
          xPhase: 0,
          gateId: 0,
          holeX: 1,
          nearMissGranted: false,
          fragmentId: 0,
        },
      ],
    });
    expect(copy.obstacles[0]).not.toBe(a.obstacles[0]);
    expect(copy.obstacles[0]?.id).toBe(7);
  });

  it('returns chronological samples from oldest to newest', () => {
    const buf = new RewindBuffer(1, 40);
    for (let i = 0; i < 40; i++) buf.push(snap(i / 40), 1 / 40);
    const hist = buf.chronological();
    expect(hist.length).toBeGreaterThan(10);
    expect(hist[0]!.timeAlive).toBeLessThan(hist[hist.length - 1]!.timeAlive);
  });
});
