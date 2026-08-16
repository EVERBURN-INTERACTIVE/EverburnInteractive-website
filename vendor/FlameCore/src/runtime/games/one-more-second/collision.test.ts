import { describe, expect, it } from 'vitest';
import { hitsObstacle, isNearMiss, makePlayerSphere } from './collision';
import { PLAYER_Y } from './config';
import type { SimObstacle } from './types';

function block(x: number, z: number, pad = false): SimObstacle {
  return {
    id: 1,
    kind: 'block',
    x,
    y: PLAYER_Y,
    z,
    halfW: 0.5,
    halfH: 0.9,
    halfD: 0.4,
    xBase: x,
    xAmp: 0,
    xFreq: 0,
    xPhase: 0,
    gateId: 0,
    holeX: x,
    nearMissGranted: pad,
    fragmentId: 0,
  };
}

describe('collision', () => {
  it('detects a direct hit in the same lane', () => {
    const player = makePlayerSphere(0, PLAYER_Y, 0);
    expect(hitsObstacle(player, block(0, 0))).toBe(true);
  });

  it('does not hit a far lane', () => {
    const player = makePlayerSphere(0, PLAYER_Y, 0);
    expect(hitsObstacle(player, block(2, 0))).toBe(false);
  });

  it('grants a near miss when skimming a blocker', () => {
    const player = makePlayerSphere(0.9, PLAYER_Y, 0);
    expect(hitsObstacle(player, block(0, 0.2))).toBe(false);
    expect(isNearMiss(player, block(0, 0.2))).toBe(true);
  });

  it('does not repeat near miss on the same obstacle', () => {
    const player = makePlayerSphere(0.9, PLAYER_Y, 0);
    expect(isNearMiss(player, block(0, 0.2, true))).toBe(false);
  });
});
