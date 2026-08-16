/**
 * Deterministic 32-bit RNG so rewind can restore future spawns.
 */
export class Mulberry32 {
  private _state: number;

  constructor(seed: number) {
    this._state = seed >>> 0;
  }

  /** Current internal state (snapshot / restore). */
  get state(): number {
    return this._state >>> 0;
  }

  set state(value: number) {
    this._state = value >>> 0;
  }

  /** Uniform float in `[0, 1)`. */
  next(): number {
    this._state = (this._state + 0x6d2b79f5) >>> 0;
    let t = Math.imul(this._state ^ (this._state >>> 15), 1 | this._state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  /** Inclusive integer range. */
  int(min: number, max: number): number {
    return min + Math.floor(this.next() * (max - min + 1));
  }

  /** True with probability `p`. */
  chance(p: number): boolean {
    return this.next() < p;
  }

  /** Pick one element. */
  pick<T>(items: readonly T[]): T {
    return items[Math.floor(this.next() * items.length)]!;
  }
}
