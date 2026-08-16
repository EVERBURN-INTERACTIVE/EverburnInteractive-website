import { NEAR_MISS_PAD, PLAYER_RADIUS } from './config';
import type { SimFragment, SimObstacle } from './types';

export interface Sphere {
  x: number;
  y: number;
  z: number;
  r: number;
}

/** Squared distance from sphere center to closest point on an AABB. */
export function sphereAabbDistanceSq(
  s: Sphere,
  x: number,
  y: number,
  z: number,
  halfW: number,
  halfH: number,
  halfD: number,
): number {
  const cx = s.x < x - halfW ? x - halfW : s.x > x + halfW ? x + halfW : s.x;
  const cy = s.y < y - halfH ? y - halfH : s.y > y + halfH ? y + halfH : s.y;
  const cz = s.z < z - halfD ? z - halfD : s.z > z + halfD ? z + halfD : s.z;
  const dx = s.x - cx;
  const dy = s.y - cy;
  const dz = s.z - cz;
  return dx * dx + dy * dy + dz * dz;
}

export function sphereHitsAabb(
  s: Sphere,
  x: number,
  y: number,
  z: number,
  halfW: number,
  halfH: number,
  halfD: number,
): boolean {
  return sphereAabbDistanceSq(s, x, y, z, halfW, halfH, halfD) <= s.r * s.r;
}

export function hitsObstacle(player: Sphere, o: SimObstacle): boolean {
  return sphereHitsAabb(player, o.x, o.y, o.z, o.halfW, o.halfH, o.halfD);
}

/**
 * True when the real AABB misses but an inflated one hits, and the obstacle
 * is in the passing window (near the player on Z).
 */
export function isNearMiss(player: Sphere, o: SimObstacle): boolean {
  if (o.nearMissGranted) return false;
  if (o.z < -0.6 || o.z > 1.35) return false;
  if (hitsObstacle(player, o)) return false;
  return sphereHitsAabb(
    player,
    o.x,
    o.y,
    o.z,
    o.halfW + NEAR_MISS_PAD,
    o.halfH + NEAR_MISS_PAD * 0.4,
    o.halfD + NEAR_MISS_PAD,
  );
}

export function hitsFragment(player: Sphere, f: SimFragment): boolean {
  if (f.collected) return false;
  const dx = player.x - f.x;
  const dy = player.y - f.y;
  const dz = player.z - f.z;
  const r = player.r + f.radius;
  return dx * dx + dy * dy + dz * dz <= r * r;
}

export function makePlayerSphere(x: number, y: number, z = 0): Sphere {
  return { x, y, z, r: PLAYER_RADIUS };
}
