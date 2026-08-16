import { BASE_GAP, GATE_GAP_EXTRA, PASS_MARGIN, PLAYER_RADIUS, STEER_MAX_VX } from './config';
import type { SimObstacle } from './types';

/**
 * Minimum hole width (world metres) the player sphere can actually fit through.
 * Always strictly larger than the sphere so a skilled dodge remains possible.
 */
export function minHoleWidth(): number {
  return PLAYER_RADIUS * 2 + PASS_MARGIN;
}

/**
 * Max obstacle half-width that still leaves a passable hole against a wall
 * (worst case: a centered blocker).
 */
export function maxObstacleHalfWidth(halfWidth: number): number {
  return Math.max(0.32, halfWidth - minHoleWidth());
}

/**
 * Forward spacing required so the player can change lanes before the next gate.
 * Grows with speed so late-game never asks for an instant full-width cross.
 */
export function minSegmentGap(speed: number): number {
  const laneChange = 2.6;
  const travelT = laneChange / STEER_MAX_VX;
  const reactT = 0.34;
  return (travelT + reactT) * Math.max(8, speed);
}

/**
 * Shrink / clamp an obstacle so at least one hole stays open at this corridor
 * width, including the extremes of a moving blocker.
 */
export function fitObstacle(o: SimObstacle, halfWidth: number): void {
  const maxHw = maxObstacleHalfWidth(halfWidth);
  if (o.halfW > maxHw) o.halfW = maxHw;

  const maxCenter = halfWidth - 0.08;
  if (o.xBase > maxCenter) o.xBase = maxCenter;
  if (o.xBase < -maxCenter) o.xBase = -maxCenter;

  // Keep the opposite side of the corridor open at both travel extremes.
  const reach = Math.abs(o.xBase) + o.halfW;
  const maxAmp = Math.max(0, halfWidth - minHoleWidth() - reach);
  if (o.xAmp > maxAmp) o.xAmp = maxAmp;

  const lo = o.xBase - o.xAmp;
  const hi = o.xBase + o.xAmp;
  if (o.xAmp > 0) {
    if (o.x < lo) o.x = lo;
    if (o.x > hi) o.x = hi;
  } else {
    o.x = o.xBase;
  }
}

/**
 * Width of the largest hole a player center can occupy given obstacles that
 * overlap this Z (treated as a 2D gate).
 */
export function largestHoleWidth(
  halfWidth: number,
  obstacles: readonly SimObstacle[],
): number {
  const minX = -halfWidth + PLAYER_RADIUS;
  const maxX = halfWidth - PLAYER_RADIUS;
  if (obstacles.length === 0) return maxX - minX;

  const blocked: Array<{ lo: number; hi: number }> = obstacles.map((o) => ({
    lo: o.x - o.halfW - PLAYER_RADIUS,
    hi: o.x + o.halfW + PLAYER_RADIUS,
  }));
  blocked.sort((a, b) => a.lo - b.lo);

  let cursor = minX;
  let best = 0;
  for (const b of blocked) {
    if (b.lo > cursor) best = Math.max(best, b.lo - cursor);
    cursor = Math.max(cursor, b.hi);
  }
  if (maxX > cursor) best = Math.max(best, maxX - cursor);
  return best;
}

/** Geometric gap between a sliding pair, large enough for the player sphere. */
export function gateGapWidth(): number {
  return minHoleWidth() + GATE_GAP_EXTRA;
}

/**
 * Group obstacles that share a gate. Missing/zero `gateId` falls back to a
 * unique key so legacy test fixtures stay independent.
 */
export function groupGates(obstacles: readonly SimObstacle[]): SimObstacle[][] {
  const map = new Map<number, SimObstacle[]>();
  for (const o of obstacles) {
    const key = o.gateId !== 0 ? o.gateId : -o.id;
    const list = map.get(key);
    if (list) list.push(o);
    else map.set(key, [o]);
  }
  return [...map.values()];
}

/**
 * Place a left/right pair around `holeX` so the gap stays passable and both
 * walls share amplitude/phase. Independent `fitObstacle` would zero that amp
 * because each wall's reach looks like it seals the corridor.
 */
export function layoutDoubleGate(
  members: SimObstacle[],
  holeX: number,
  halfWidth: number,
): void {
  if (members.length < 2) {
    if (members[0]) fitObstacle(members[0], halfWidth);
    return;
  }
  if (members.length > 2) {
    for (const o of members) fitObstacle(o, halfWidth);
    return;
  }

  const left = members[0]!.xBase <= members[1]!.xBase ? members[0]! : members[1]!;
  const right = left === members[0] ? members[1]! : members[0]!;
  const gap = gateGapWidth();
  const wallPad = 0.06;
  const maxHw = maxObstacleHalfWidth(halfWidth);
  left.halfW = Math.min(left.halfW, maxHw);
  right.halfW = Math.min(right.halfW, maxHw);

  const pairFits = (): boolean => {
    const minH = -halfWidth + gap / 2 + 2 * left.halfW + wallPad;
    const maxH = halfWidth - gap / 2 - 2 * right.halfW - wallPad;
    return minH <= maxH - 0.02;
  };
  while (!pairFits() && (left.halfW > 0.32 || right.halfW > 0.32)) {
    if (left.halfW >= right.halfW) left.halfW = Math.max(0.32, left.halfW - 0.04);
    else right.halfW = Math.max(0.32, right.halfW - 0.04);
  }

  const minH = -halfWidth + gap / 2 + 2 * left.halfW + wallPad;
  const maxH = halfWidth - gap / 2 - 2 * right.halfW - wallPad;
  const clamped = Math.max(minH, Math.min(maxH, holeX));

  left.xBase = clamped - gap / 2 - left.halfW;
  right.xBase = clamped + gap / 2 + right.halfW;

  const sharedFreq = left.xFreq || right.xFreq;
  const sharedPhase = left.xPhase;
  const requestedAmp = Math.max(left.xAmp, right.xAmp);
  const room = Math.max(0, Math.min(clamped - minH, maxH - clamped));
  const amp = Math.min(requestedAmp, room);

  left.xFreq = right.xFreq = sharedFreq;
  left.xPhase = right.xPhase = sharedPhase;
  left.xAmp = right.xAmp = amp;
  left.holeX = right.holeX = clamped;
  const gid = left.gateId || right.gateId || left.id;
  left.gateId = right.gateId = gid;
}

/** Fit singles independently; keep sliding pairs as one passable hole. */
export function layoutAllGates(
  obstacles: readonly SimObstacle[],
  halfWidth: number,
): void {
  for (const members of groupGates(obstacles)) {
    if (members.length >= 2) {
      layoutDoubleGate(members, members[0]!.holeX, halfWidth);
    } else if (members[0]) {
      fitObstacle(members[0], halfWidth);
    }
  }
}

export function ensureObstaclesPassable(
  obstacles: readonly SimObstacle[],
  halfWidth: number,
): void {
  layoutAllGates(obstacles, halfWidth);
}

/** Empty Z between segments: grows with speed so a full-width dodge stays possible. */
export function segmentSpacing(speed: number): number {
  return Math.max(minSegmentGap(speed), BASE_GAP * 0.85);
}

function expandMovingGate(group: readonly SimObstacle[]): SimObstacle[][] {
  const moving = group.filter((o) => o.xAmp > 0);
  const statics = group.filter((o) => o.xAmp <= 0);
  if (moving.length === 0) return [group.slice()];
  const out: SimObstacle[][] = [];
  for (const sign of [-1, 0, 1] as const) {
    out.push([
      ...statics,
      ...moving.map((o) => ({ ...o, x: o.xBase + sign * o.xAmp })),
    ]);
  }
  return out;
}

/**
 * True when every Z-clustered gate still has a hole the player sphere can fit,
 * including the travel extremes of moving blockers.
 */
export function everyGatePassable(
  obstacles: readonly SimObstacle[],
  halfWidth: number,
  zBucket = 1.25,
): boolean {
  const buckets = new Map<number, SimObstacle[]>();
  for (const o of obstacles) {
    const key = Math.round(o.z / zBucket);
    const list = buckets.get(key) ?? [];
    list.push(o);
    buckets.set(key, list);
  }
  const minCenterHole = PASS_MARGIN * 0.5;
  for (const group of buckets.values()) {
    for (const variant of expandMovingGate(group)) {
      if (largestHoleWidth(halfWidth, variant) < minCenterHole) return false;
    }
  }
  return true;
}
