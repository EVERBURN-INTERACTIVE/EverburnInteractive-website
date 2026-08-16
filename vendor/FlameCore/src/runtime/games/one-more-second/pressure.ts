import {
  DWELL_GRACE,
  DWELL_RADIUS,
  DWELL_RAMP,
  HOLE_SEEK_SPEED,
  PRESSURE_Z_MIN,
} from './config';
import {
  fitObstacle,
  gateGapWidth,
  groupGates,
  layoutDoubleGate,
} from './passability';
import type { SimFragment, SimObstacle } from './types';

/** Running estimate of where the player has been standing. */
export interface DwellState {
  x: number;
  time: number;
}

/** Hint used when authoring a new segment so the hole is not the camp alley. */
export interface SpawnPressure {
  readonly dwellX: number;
  readonly camp: number;
}

function clamp01(v: number): number {
  return v < 0 ? 0 : v > 1 ? 1 : v;
}

/** Track how long the sphere has stayed near one X. */
export function updateDwell(state: DwellState, playerX: number, dt: number): void {
  if (Math.abs(playerX - state.x) <= DWELL_RADIUS) {
    state.time += dt;
    state.x += (playerX - state.x) * Math.min(1, dt * 3);
  } else {
    state.x = playerX;
    state.time = 0;
  }
}

/** 0 before grace, 1 after the ramp. */
export function campFactor(state: DwellState): number {
  return clamp01((state.time - DWELL_GRACE) / DWELL_RAMP);
}

/**
 * Hole center that is *not* the dwell X. Center-camping alternates sides
 * per gate so the next opening is never a stable alley.
 */
export function desiredHoleX(
  dwellX: number,
  gateId: number,
  halfWidth: number,
  camp: number,
): number {
  const side =
    Math.abs(dwellX) < 0.35 ? (gateId % 2 === 0 ? -1 : 1) : dwellX >= 0 ? -1 : 1;
  const span = Math.max(0.85, halfWidth - gateGapWidth() * 0.5 - 0.9);
  const mag = 0.55 + camp * (span - 0.55);
  return side * mag;
}

function gateZ(members: readonly SimObstacle[]): number {
  let z = members[0]?.z ?? 0;
  for (const o of members) {
    if (o.z < z) z = o.z;
  }
  return z;
}

function moveToward(current: number, target: number, maxDelta: number): number {
  const d = target - current;
  if (Math.abs(d) <= maxDelta) return target;
  return current + Math.sign(d) * maxDelta;
}

/**
 * Slide upcoming holes off the camp, and pull single blockers onto it.
 * Gates closer than {@link PRESSURE_Z_MIN} are left alone.
 */
export function applyGatePressure(
  obstacles: SimObstacle[],
  dwell: DwellState,
  dt: number,
  halfWidth: number,
): void {
  const camp = campFactor(dwell);
  const step = (0.55 + camp * HOLE_SEEK_SPEED) * dt;
  for (const members of groupGates(obstacles)) {
    if (gateZ(members) < PRESSURE_Z_MIN) continue;
    const gateId = members[0]?.gateId || members[0]?.id || 0;
    if (members.length >= 2) {
      const hole = members[0]!.holeX;
      if (camp <= 0 && Math.abs(hole - dwell.x) > 0.75) continue;
      const target = desiredHoleX(dwell.x, gateId, halfWidth, Math.max(camp, 0.25));
      layoutDoubleGate(members, moveToward(hole, target, step), halfWidth);
    } else {
      const o = members[0];
      if (!o || camp <= 0) continue;
      o.xBase = moveToward(o.xBase, dwell.x, step);
      o.xAmp = Math.max(o.xAmp, 0.28 + camp * 0.28);
      o.holeX = o.xBase >= 0 ? -halfWidth * 0.45 : halfWidth * 0.45;
      fitObstacle(o, halfWidth);
    }
  }
}

/** Keep parented fragments in the live hole, not the old center alley. */
export function syncAttachedFragments(
  obstacles: readonly SimObstacle[],
  fragments: SimFragment[],
  halfWidth: number,
): void {
  if (fragments.length === 0) return;
  const byId = new Map<number, SimFragment>();
  for (const f of fragments) byId.set(f.id, f);
  const counts = new Map<number, number>();
  for (const o of obstacles) {
    counts.set(o.gateId, (counts.get(o.gateId) ?? 0) + 1);
  }
  for (const o of obstacles) {
    if (!o.fragmentId) continue;
    const f = byId.get(o.fragmentId);
    if (!f) continue;
    const slide = o.x - o.xBase;
    if ((counts.get(o.gateId) ?? 1) >= 2) {
      f.x = o.holeX + slide;
    } else {
      const leftSpace = o.x - o.halfW + halfWidth;
      const rightSpace = halfWidth - (o.x + o.halfW);
      const side = rightSpace >= leftSpace ? 1 : -1;
      f.x = o.x + side * (o.halfW + 0.55);
    }
    const maxX = halfWidth - f.radius - 0.08;
    if (f.x > maxX) f.x = maxX;
    if (f.x < -maxX) f.x = -maxX;
    f.z = o.z;
  }
}
