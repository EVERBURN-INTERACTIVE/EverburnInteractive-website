/** One shard of the player sphere after a crash. View-only; not simulated for scoring. */
export interface DebrisShard {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  rx: number;
  ry: number;
  rz: number;
  wx: number;
  wy: number;
  wz: number;
  life: number;
  maxLife: number;
  scale: number;
}

/** How many shards the sphere breaks into. */
export const BURST_COUNT = 28;

/**
 * Scatter shards outward from the player. `rand` is injectable so the burst
 * can be unit-tested without WebGL.
 */
export function spawnPlayerBurst(
  x: number,
  y: number,
  z: number,
  rand: () => number = Math.random,
): DebrisShard[] {
  const out: DebrisShard[] = [];
  for (let i = 0; i < BURST_COUNT; i++) {
    const yaw = rand() * Math.PI * 2;
    const pitch = (rand() - 0.18) * Math.PI;
    const speed = 3.8 + rand() * 7.2;
    const life = 0.95 + rand() * 0.7;
    out.push({
      x,
      y,
      z,
      vx: Math.cos(yaw) * Math.cos(pitch) * speed,
      vy: Math.sin(pitch) * speed + 3.4,
      vz: Math.sin(yaw) * Math.cos(pitch) * speed,
      rx: rand() * Math.PI * 2,
      ry: rand() * Math.PI * 2,
      rz: rand() * Math.PI * 2,
      wx: (rand() - 0.5) * 16,
      wy: (rand() - 0.5) * 16,
      wz: (rand() - 0.5) * 16,
      life,
      maxLife: life,
      scale: 0.06 + rand() * 0.1,
    });
  }
  return out;
}

/** Integrate gravity / bounce and drop dead shards. */
export function stepPlayerBurst(shards: DebrisShard[], dt: number): DebrisShard[] {
  const live: DebrisShard[] = [];
  const g = 15;
  for (const s of shards) {
    s.life -= dt;
    if (s.life <= 0) continue;
    s.vy -= g * dt;
    s.x += s.vx * dt;
    s.y += s.vy * dt;
    s.z += s.vz * dt;
    s.rx += s.wx * dt;
    s.ry += s.wy * dt;
    s.rz += s.wz * dt;
    if (s.y < 0.05) {
      s.y = 0.05;
      s.vy *= -0.28;
      s.vx *= 0.62;
      s.vz *= 0.62;
    }
    live.push(s);
  }
  return live;
}

export function burstScale(s: DebrisShard): number {
  return s.scale * Math.max(0.1, s.life / s.maxLife);
}
