import { PLAYER_Y, SEGMENT_LENGTH } from './config';
import { layoutAllGates, layoutDoubleGate, minSegmentGap } from './passability';
import { desiredHoleX, type SpawnPressure } from './pressure';
import type { Mulberry32 } from './rng';
import type { Difficulty } from './difficulty';
import type { ObstacleKind, SimFragment, SimObstacle } from './types';

export interface SegmentBuild {
  readonly obstacles: SimObstacle[];
  readonly fragments: SimFragment[];
  readonly length: number;
}

export type { SpawnPressure };

type TemplateId = 'empty' | 'center' | 'left' | 'right' | 'double' | 'stagger';

const TEMPLATES: readonly TemplateId[] = ['empty', 'center', 'left', 'right', 'double'];

function laneX(lane: -1 | 0 | 1): number {
  // Inset from the old ±2 columns so fitObstacle still allows a side slide.
  return lane * 1.2;
}

function blockSize(diff: Difficulty, kind: ObstacleKind): { halfW: number; halfH: number; halfD: number } {
  const scale = diff.larger ? 1.12 : 1;
  if (kind === 'wide') {
    return { halfW: 0.95 * scale, halfH: 0.95 * scale, halfD: 0.42 * scale };
  }
  return { halfW: 0.5 * scale, halfH: 0.88 * scale, halfD: 0.4 * scale };
}

function makeObstacle(
  id: number,
  lane: -1 | 0 | 1,
  z: number,
  diff: Difficulty,
  rng: Mulberry32,
  kind: ObstacleKind,
  motion?: { amp: number; freq: number; phase: number },
): SimObstacle {
  const size = blockSize(diff, kind);
  const x = kind === 'wide' ? 0 : laneX(lane);
  const amp = motion?.amp ?? 0.32 + rng.next() * 0.28;
  const freq = motion?.freq ?? 0.9 + rng.next() * 0.85;
  const phase = motion?.phase ?? rng.next() * Math.PI * 2;
  return {
    id,
    kind: amp > 0.01 ? 'moving' : kind,
    x,
    y: PLAYER_Y,
    z,
    halfW: size.halfW,
    halfH: size.halfH,
    halfD: size.halfD,
    xBase: x,
    xAmp: amp,
    xFreq: freq,
    xPhase: phase,
    gateId: id,
    holeX: x,
    nearMissGranted: false,
    fragmentId: 0,
  };
}

function maybeFragmentAt(
  rng: Mulberry32,
  x: number,
  z: number,
  owner: SimObstacle,
  nextId: () => number,
  diff: Difficulty,
): SimFragment | undefined {
  const p = diff.intensity < 0.2 ? 0.08 : 0.16;
  if (!rng.chance(p)) return undefined;
  const id = nextId();
  owner.fragmentId = id;
  return {
    id,
    x,
    y: PLAYER_Y + 0.15,
    z,
    radius: 0.28,
    collected: false,
  };
}

function laneTowardDwell(dwellX: number): -1 | 0 | 1 {
  if (dwellX < -0.75) return -1;
  if (dwellX > 0.75) return 1;
  return 0;
}

/**
 * Build one corridor segment at world-Z `z0` (front of the segment).
 * Dual blocks are one sliding gate; the hole is biased off the dwell X.
 */
export function buildSegment(
  z0: number,
  diff: Difficulty,
  rng: Mulberry32,
  nextId: () => number,
  pressure?: SpawnPressure,
): SegmentBuild {
  const obstacles: SimObstacle[] = [];
  const fragments: SimFragment[] = [];

  if (!rng.chance(diff.density)) {
    return { obstacles, fragments, length: SEGMENT_LENGTH * 0.65 };
  }

  const camp = pressure?.camp ?? 0;
  const dwellX = pressure?.dwellX ?? 0;
  let template: TemplateId = rng.pick(TEMPLATES);
  if (template === 'empty') template = rng.pick(['center', 'left', 'right']);
  if (diff.complex && rng.chance(0.3)) template = 'stagger';
  if (camp > 0.45) {
    template = rng.chance(0.55) ? 'double' : 'center';
    if (template === 'center' && Math.abs(dwellX) > 0.75) {
      template = dwellX < 0 ? 'left' : 'right';
    }
  }

  const allowWide = diff.larger && diff.halfWidth >= 2.95 && rng.chance(0.18);
  const kind: ObstacleKind = allowWide ? 'wide' : 'block';
  const staggerZ = Math.max(5, minSegmentGap(diff.speed) * 0.45);

  const pushSingle = (lane: -1 | 0 | 1, z: number, k: ObstacleKind): void => {
    const occupy = camp > 0.4 ? laneTowardDwell(dwellX) : lane;
    const o = makeObstacle(nextId(), occupy, z, diff, rng, k);
    if (camp > 0.4) {
      o.xBase = dwellX;
      o.x = dwellX;
      o.holeX = dwellX >= 0 ? -diff.halfWidth * 0.45 : diff.halfWidth * 0.45;
    }
    obstacles.push(o);
    const side = o.xBase >= 0 ? -1 : 1;
    const fragX = o.xBase + side * (o.halfW + 0.55);
    const frag = maybeFragmentAt(rng, fragX, o.z, o, nextId, diff);
    if (frag) fragments.push(frag);
  };

  const pushDouble = (z: number): void => {
    const motion = {
      amp: 0.4 + rng.next() * 0.22,
      freq: 0.85 + rng.next() * 0.7,
      phase: rng.next() * Math.PI * 2,
    };
    const left = makeObstacle(nextId(), -1, z, diff, rng, 'block', motion);
    const right = makeObstacle(nextId(), 1, z, diff, rng, 'block', motion);
    left.gateId = right.gateId = left.id;
    const holeX =
      camp > 0.3
        ? desiredHoleX(dwellX, left.gateId, diff.halfWidth, camp)
        : (rng.chance(0.5) ? -1 : 1) * (0.8 + rng.next() * 0.45);
    layoutDoubleGate([left, right], holeX, diff.halfWidth);
    obstacles.push(left, right);
    const frag = maybeFragmentAt(rng, left.holeX, z, left, nextId, diff);
    if (frag) fragments.push(frag);
  };

  switch (template) {
    case 'center':
      pushSingle(0, z0 + 4, kind);
      break;
    case 'left':
      pushSingle(-1, z0 + 4, 'block');
      break;
    case 'right':
      pushSingle(1, z0 + 4, 'block');
      break;
    case 'double':
      pushDouble(z0 + 4);
      break;
    case 'stagger':
      pushSingle(-1, z0 + 3, 'block');
      pushSingle(1, z0 + 3 + staggerZ, 'block');
      break;
    default:
      break;
  }

  layoutAllGates(obstacles, diff.halfWidth);
  const length = template === 'stagger' ? 4 + staggerZ + 4 : SEGMENT_LENGTH;
  return { obstacles, fragments, length };
}
