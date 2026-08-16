import { describe, expect, it } from 'vitest';
import { CORRIDOR_NARROW_HALF_WIDTH, PASS_MARGIN, PLAYER_RADIUS } from './config';
import { difficultyAt } from './difficulty';
import {
  everyGatePassable,
  fitObstacle,
  groupGates,
  largestHoleWidth,
  layoutDoubleGate,
  maxObstacleHalfWidth,
  minHoleWidth,
  minSegmentGap,
  segmentSpacing,
} from './passability';
import { Mulberry32 } from './rng';
import { buildSegment } from './segments';
import type { SimObstacle } from './types';

function block(partial: Partial<SimObstacle> & Pick<SimObstacle, 'x' | 'halfW'>): SimObstacle {
  return {
    id: 1,
    kind: 'block',
    y: 0.92,
    z: 4,
    halfH: 0.8,
    halfD: 0.4,
    xBase: partial.x,
    xAmp: 0,
    xFreq: 0,
    xPhase: 0,
    gateId: 0,
    holeX: partial.x,
    nearMissGranted: false,
    fragmentId: 0,
    ...partial,
  };
}

describe('passability', () => {
  it('keeps a hole wider than the player sphere', () => {
    expect(minHoleWidth()).toBeGreaterThan(PLAYER_RADIUS * 2);
  });

  it('caps a centered blocker so a pocket remains after the corridor narrows', () => {
    const half = CORRIDOR_NARROW_HALF_WIDTH;
    const o = block({ x: 0, halfW: 3, xBase: 0, kind: 'wide' });
    fitObstacle(o, half);
    expect(o.halfW).toBeLessThanOrEqual(maxObstacleHalfWidth(half));
    expect(largestHoleWidth(half, [o])).toBeGreaterThanOrEqual(PASS_MARGIN * 0.5);
  });

  it('clamps moving amplitude so the far extreme still leaves a hole', () => {
    const half = CORRIDOR_NARROW_HALF_WIDTH;
    const o = block({
      x: 0,
      xBase: 0,
      halfW: 0.7,
      xAmp: 4,
      kind: 'moving',
    });
    fitObstacle(o, half);
    const left = { ...o, x: o.xBase - o.xAmp };
    const right = { ...o, x: o.xBase + o.xAmp };
    expect(largestHoleWidth(half, [left])).toBeGreaterThan(0);
    expect(largestHoleWidth(half, [right])).toBeGreaterThan(0);
  });

  it('widens inter-segment gaps as speed increases', () => {
    expect(minSegmentGap(40)).toBeGreaterThan(minSegmentGap(16));
    expect(segmentSpacing(40)).toBeGreaterThan(segmentSpacing(16));
  });

  it('never authors an impassable gate across the difficulty curve', () => {
    for (const t of [0, 45, 90, 120, 180]) {
      const diff = difficultyAt(t);
      for (let seed = 1; seed <= 80; seed++) {
        const rng = new Mulberry32(seed * 17 + t);
        let id = 1;
        const built = buildSegment(10, diff, rng, () => id++);
        expect(
          everyGatePassable(built.obstacles, diff.halfWidth),
          `t=${t} seed=${seed}`,
        ).toBe(true);
      }
    }
  });

  it('keeps a sliding double passable at every hole phase', () => {
    const half = CORRIDOR_NARROW_HALF_WIDTH;
    for (const holeX of [-1.1, -0.6, 0, 0.6, 1.1]) {
      const left = block({
        id: 1,
        x: -2,
        xBase: -2,
        halfW: 0.5,
        gateId: 9,
        holeX,
        xAmp: 0.5,
        xFreq: 1,
        xPhase: 0,
      });
      const right = block({
        id: 2,
        x: 2,
        xBase: 2,
        halfW: 0.5,
        gateId: 9,
        holeX,
        xAmp: 0.5,
        xFreq: 1,
        xPhase: 0,
      });
      layoutDoubleGate([left, right], holeX, half);
      expect(everyGatePassable([left, right], half), `holeX=${holeX}`).toBe(true);
      for (const sign of [-1, 0, 1] as const) {
        const a = { ...left, x: left.xBase + sign * left.xAmp };
        const b = { ...right, x: right.xBase + sign * right.xAmp };
        expect(largestHoleWidth(half, [a, b])).toBeGreaterThan(PASS_MARGIN * 0.5);
      }
    }
  });

  it('does not park double-gate holes and fragments on a center camp', () => {
    const diff = difficultyAt(50);
    let doubles = 0;
    let fragmentsInAlley = 0;
    let fragmentsChecked = 0;
    for (let seed = 1; seed <= 220; seed++) {
      const rng = new Mulberry32(seed * 31);
      let id = 1;
      const built = buildSegment(10, diff, rng, () => id++, { dwellX: 0, camp: 1 });
      expect(everyGatePassable(built.obstacles, diff.halfWidth)).toBe(true);
      for (const members of groupGates(built.obstacles)) {
        if (members.length < 2) continue;
        doubles += 1;
        const hole = members[0]!.holeX;
        expect(Math.abs(hole)).toBeGreaterThan(0.45);
        for (const o of members) {
          if (!o.fragmentId) continue;
          const f = built.fragments.find((fr) => fr.id === o.fragmentId);
          if (!f) continue;
          fragmentsChecked += 1;
          if (Math.abs(f.x) < 0.35) fragmentsInAlley += 1;
          expect(Math.abs(f.x - hole)).toBeLessThan(0.4);
        }
      }
    }
    expect(doubles).toBeGreaterThan(10);
    expect(fragmentsInAlley).toBe(0);
  });
});
