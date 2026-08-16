import { describe, expect, it } from 'vitest';
import { PLAYER_Y, PRESSURE_Z_MIN } from './config';
import { layoutDoubleGate } from './passability';
import {
  applyGatePressure,
  campFactor,
  desiredHoleX,
  syncAttachedFragments,
  updateDwell,
  type DwellState,
} from './pressure';
import type { SimFragment, SimObstacle } from './types';

function obstacle(partial: Partial<SimObstacle> & Pick<SimObstacle, 'id' | 'x'>): SimObstacle {
  return {
    kind: 'block',
    y: PLAYER_Y,
    z: 24,
    halfW: 0.5,
    halfH: 0.88,
    halfD: 0.4,
    xBase: partial.x,
    xAmp: 0.4,
    xFreq: 1,
    xPhase: 0,
    gateId: 1,
    holeX: 0,
    nearMissGranted: false,
    fragmentId: 0,
    ...partial,
  };
}

describe('dwell pressure', () => {
  it('stays at camp 0 until grace, then ramps to 1', () => {
    const dwell: DwellState = { x: 0, time: 0 };
    updateDwell(dwell, 0, 1.0);
    expect(campFactor(dwell)).toBe(0);
    updateDwell(dwell, 0.1, 1.4);
    expect(campFactor(dwell)).toBeGreaterThan(0.2);
    updateDwell(dwell, 0, 2);
    expect(campFactor(dwell)).toBe(1);
  });

  it('resets when the player leaves the dwell radius', () => {
    const dwell: DwellState = { x: 0, time: 3 };
    updateDwell(dwell, 1.2, 0.05);
    expect(dwell.time).toBe(0);
    expect(dwell.x).toBeCloseTo(1.2);
  });

  it('puts the desired hole on the opposite side of a side camp', () => {
    expect(desiredHoleX(1.2, 3, 3.2, 1)).toBeLessThan(-0.7);
    expect(desiredHoleX(-1.2, 3, 3.2, 1)).toBeGreaterThan(0.7);
  });

  it('slides an upcoming double hole off a center camp', () => {
    const left = obstacle({ id: 1, x: -2, xBase: -2, z: PRESSURE_Z_MIN + 12, gateId: 8 });
    const right = obstacle({ id: 2, x: 2, xBase: 2, z: PRESSURE_Z_MIN + 12, gateId: 8 });
    layoutDoubleGate([left, right], 0, 3.2);
    expect(Math.abs(left.holeX)).toBeLessThan(0.2);
    const dwell: DwellState = { x: 0, time: 3 };
    for (let i = 0; i < 90; i++) {
      applyGatePressure([left, right], dwell, 1 / 60, 3.2);
    }
    expect(Math.abs(left.holeX)).toBeGreaterThan(0.55);
    expect(left.holeX).toBe(right.holeX);
    expect(right.xBase - right.halfW - (left.xBase + left.halfW)).toBeGreaterThan(1.0);
  });

  it('does not retarget a gate already in the player face', () => {
    const left = obstacle({ id: 1, x: -2, xBase: -2, z: 3, gateId: 4, holeX: 0 });
    const right = obstacle({ id: 2, x: 2, xBase: 2, z: 3, gateId: 4, holeX: 0 });
    layoutDoubleGate([left, right], 0, 3.2);
    const before = left.holeX;
    applyGatePressure([left, right], { x: 0, time: 4 }, 0.5, 3.2);
    expect(left.holeX).toBeCloseTo(before);
  });

  it('keeps a double-gate fragment in the moving hole', () => {
    const left = obstacle({
      id: 1,
      x: -2,
      xBase: -2,
      z: 20,
      gateId: 5,
      holeX: 1.1,
      fragmentId: 9,
    });
    const right = obstacle({ id: 2, x: 2, xBase: 2, z: 20, gateId: 5, holeX: 1.1 });
    layoutDoubleGate([left, right], 1.1, 3.2);
    left.x = left.xBase + 0.2;
    right.x = right.xBase + 0.2;
    const frag: SimFragment = {
      id: 9,
      x: 0,
      y: PLAYER_Y,
      z: 20,
      radius: 0.28,
      collected: false,
    };
    syncAttachedFragments([left, right], [frag], 3.2);
    expect(Math.abs(frag.x)).toBeGreaterThan(0.7);
    expect(frag.x).toBeCloseTo(left.holeX + 0.2, 5);
  });
});
