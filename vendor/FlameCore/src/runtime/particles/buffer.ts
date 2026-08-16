/**
 * Structure-of-arrays (SoA) storage for live particles within a single
 * emitter. SoA layout avoids per-particle object allocations and keeps the
 * hot simulation loop cache-friendly. Dead particles are removed with an
 * O(1) swap-with-last. See PRD 11 §3.7 (performance).
 */
export class ParticleBuffer {
  readonly capacity: number;
  /** Number of live particles (indices `0..count-1`). */
  count = 0;

  readonly posX: Float32Array;
  readonly posY: Float32Array;
  readonly posZ: Float32Array;
  readonly velX: Float32Array;
  readonly velY: Float32Array;
  readonly velZ: Float32Array;
  readonly r: Float32Array;
  readonly g: Float32Array;
  readonly b: Float32Array;
  readonly a: Float32Array;
  readonly size: Float32Array;
  readonly rotation: Float32Array;
  readonly age: Float32Array;
  readonly life: Float32Array;
  readonly seed: Float32Array;
  /** Initial size captured at spawn, for size-over-life modules. */
  readonly startSize: Float32Array;
  /** Initial color captured at spawn, for color-over-life modules. */
  readonly startR: Float32Array;
  readonly startG: Float32Array;
  readonly startB: Float32Array;
  readonly startA: Float32Array;

  constructor(capacity: number) {
    this.capacity = Math.max(1, Math.floor(capacity));
    const n = this.capacity;
    this.posX = new Float32Array(n);
    this.posY = new Float32Array(n);
    this.posZ = new Float32Array(n);
    this.velX = new Float32Array(n);
    this.velY = new Float32Array(n);
    this.velZ = new Float32Array(n);
    this.r = new Float32Array(n);
    this.g = new Float32Array(n);
    this.b = new Float32Array(n);
    this.a = new Float32Array(n);
    this.size = new Float32Array(n);
    this.rotation = new Float32Array(n);
    this.age = new Float32Array(n);
    this.life = new Float32Array(n);
    this.seed = new Float32Array(n);
    this.startSize = new Float32Array(n);
    this.startR = new Float32Array(n);
    this.startG = new Float32Array(n);
    this.startB = new Float32Array(n);
    this.startA = new Float32Array(n);
  }

  /** Allocate one particle slot. Returns its index, or `-1` when full. */
  spawn(): number {
    if (this.count >= this.capacity) return -1;
    const i = this.count++;
    // Reset to sane defaults; init modules overwrite these.
    this.posX[i] = 0;
    this.posY[i] = 0;
    this.posZ[i] = 0;
    this.velX[i] = 0;
    this.velY[i] = 0;
    this.velZ[i] = 0;
    this.r[i] = 1;
    this.g[i] = 1;
    this.b[i] = 1;
    this.a[i] = 1;
    this.size[i] = 1;
    this.rotation[i] = 0;
    this.age[i] = 0;
    this.life[i] = 1;
    this.seed[i] = Math.random();
    return i;
  }

  /** Remove the particle at `index` via swap-with-last (O(1)). */
  kill(index: number): void {
    const last = this.count - 1;
    if (index < 0 || index > last) return;
    if (index !== last) {
      this.posX[index] = this.posX[last];
      this.posY[index] = this.posY[last];
      this.posZ[index] = this.posZ[last];
      this.velX[index] = this.velX[last];
      this.velY[index] = this.velY[last];
      this.velZ[index] = this.velZ[last];
      this.r[index] = this.r[last];
      this.g[index] = this.g[last];
      this.b[index] = this.b[last];
      this.a[index] = this.a[last];
      this.size[index] = this.size[last];
      this.rotation[index] = this.rotation[last];
      this.age[index] = this.age[last];
      this.life[index] = this.life[last];
      this.seed[index] = this.seed[last];
      this.startSize[index] = this.startSize[last];
      this.startR[index] = this.startR[last];
      this.startG[index] = this.startG[last];
      this.startB[index] = this.startB[last];
      this.startA[index] = this.startA[last];
    }
    this.count--;
  }

  /** Snapshot the spawn-time size/color so over-life modules can reference it. */
  captureStartValues(i: number): void {
    this.startSize[i] = this.size[i];
    this.startR[i] = this.r[i];
    this.startG[i] = this.g[i];
    this.startB[i] = this.b[i];
    this.startA[i] = this.a[i];
  }
}
