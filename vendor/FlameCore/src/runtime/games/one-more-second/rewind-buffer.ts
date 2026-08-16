import { REWIND_HZ, REWIND_SECONDS } from './config';
import type { SimSnapshot } from './types';

/**
 * Ring buffer of simulation snapshots covering roughly {@link REWIND_SECONDS}.
 */
export class RewindBuffer {
  private readonly _cap: number;
  private readonly _slots: Array<SimSnapshot | undefined>;
  private _write = 0;
  private _count = 0;
  private _accum = 0;
  private readonly _dt: number;

  constructor(seconds: number = REWIND_SECONDS, hz: number = REWIND_HZ) {
    this._dt = 1 / hz;
    this._cap = Math.max(2, Math.ceil(seconds * hz) + 2);
    this._slots = new Array<SimSnapshot | undefined>(this._cap);
  }

  /** Seconds currently stored. */
  get duration(): number {
    return this._count * this._dt;
  }

  clear(): void {
    this._write = 0;
    this._count = 0;
    this._accum = 0;
    this._slots.fill(undefined);
  }

  /**
   * Record `snapshot` at `REWIND_HZ`, independent of the game frame rate.
   */
  push(snapshot: SimSnapshot, dt: number): void {
    this._accum += dt;
    while (this._accum >= this._dt) {
      this._accum -= this._dt;
      this._slots[this._write] = snapshot;
      this._write = (this._write + 1) % this._cap;
      if (this._count < this._cap) this._count += 1;
    }
  }

  /** Oldest snapshot still in the buffer, if any. */
  oldest(): SimSnapshot | undefined {
    if (this._count === 0) return undefined;
    const start = (this._write - this._count + this._cap) % this._cap;
    return this._slots[start];
  }

  /** Snapshot closest to `seconds` in the past. */
  at(seconds: number): SimSnapshot | undefined {
    if (this._count === 0) return undefined;
    const steps = Math.min(this._count - 1, Math.max(0, Math.round(seconds / this._dt)));
    const idx = (this._write - 1 - steps + this._cap * 4) % this._cap;
    return this._slots[idx] ?? this.oldest();
  }

  /** Cloned samples from oldest to newest, for playing the map backward. */
  chronological(): SimSnapshot[] {
    if (this._count === 0) return [];
    const start = (this._write - this._count + this._cap) % this._cap;
    const out: SimSnapshot[] = [];
    for (let i = 0; i < this._count; i++) {
      const s = this._slots[(start + i) % this._cap];
      if (s) out.push(cloneSnapshot(s));
    }
    return out;
  }
}

export function cloneSnapshot(s: SimSnapshot): SimSnapshot {
  return {
    phase: s.phase,
    timeAlive: s.timeAlive,
    timeBonus: s.timeBonus ?? 0,
    distance: s.distance,
    score: s.score,
    multiplier: s.multiplier,
    playerX: s.playerX,
    playerVx: s.playerVx,
    halfWidth: s.halfWidth,
    speed: s.speed,
    nextFillZ: s.nextFillZ,
    nextRewindRegenAt: s.nextRewindRegenAt,
    rngState: s.rngState,
    nextId: s.nextId,
    obstacles: s.obstacles.map((o) => ({ ...o })),
    fragments: s.fragments.map((f) => ({ ...f })),
  };
}
