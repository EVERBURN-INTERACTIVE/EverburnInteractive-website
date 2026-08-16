import {
  ATTRACT_DIFFICULTY_TIME,
  COUNTDOWN_SECONDS,
  CRASH_FREEZE,
  FRAGMENT_CHARGE,
  FRAGMENT_MAX_MULT_TIME,
  FRAGMENT_SCORE,
  LOOKAHEAD,
  MAX_MULTIPLIER,
  MAX_REWINDS,
  NEAR_MISS_SCORE,
  NEAR_MISS_TIME,
  PLAYER_RADIUS,
  PLAYER_Y,
  RECYCLE_Z,
  REWIND_COOLDOWN,
  REWIND_PLAYBACK_SECONDS,
  REWIND_REGEN_INTERVAL,
  SCORE_PER_SECOND,
  STEER_ACCEL,
  STEER_DAMPING,
  STEER_MAX_VX,
} from './config';
import { hitsFragment, hitsObstacle, isNearMiss, makePlayerSphere } from './collision';
import { difficultyAt, type Difficulty } from './difficulty';
import { ensureObstaclesPassable, segmentSpacing } from './passability';
import { applyGatePressure, campFactor, syncAttachedFragments, updateDwell, type DwellState } from './pressure';
import { Mulberry32 } from './rng';
import { RewindBuffer, cloneSnapshot } from './rewind-buffer';
import { buildSegment } from './segments';
import type {
  SimEvents,
  SimFragment,
  SimInput,
  SimObstacle,
  SimReadout,
  SimSnapshot,
  RunPhase,
} from './types';

const EMPTY_EVENTS: SimEvents = {
  nearMiss: false,
  fragment: false,
  crashed: false,
  rewindUsed: false,
  signatureRewind: false,
  restarted: false,
  died: false,
};

function emptyEvents(): SimEvents {
  return { ...EMPTY_EVENTS };
}

/**
 * Headless One More Second simulation. The view layer reads {@link readout}
 * and never mutates these fields directly.
 */
export class OneMoreSecondSimulation {
  private _rng: Mulberry32;
  private readonly _rewind = new RewindBuffer();
  private _phase: RunPhase = 'playing';
  private _timeAlive = 0;
  private _timeBonus = 0;
  private _distance = 0;
  private _score = 0;
  private _multiplier = 1;
  private _playerX = 0;
  private _playerVx = 0;
  private _halfWidth = 3.2;
  private _speed = 16;
  private _nextFillZ = 14;
  private _nextRewindRegenAt = REWIND_REGEN_INTERVAL;
  private _nextId = 1;
  private _obstacles: SimObstacle[] = [];
  private _fragments: SimFragment[] = [];
  private _rewindCharges = MAX_REWINDS;
  private _rewindCooldown = 0;
  private _crashTimer = 0;
  private _invert = 0;
  private _flash = 0;
  private _fxNearMiss = 0;
  private _bestTime = 0;
  private _playback: SimSnapshot[] = [];
  private _playbackAcc = 0;
  private _countdown = 0;
  private readonly _dwell: DwellState = { x: 0, time: 0 };

  constructor(seed: number = 1) {
    this._rng = new Mulberry32(seed);
  }

  get bestTime(): number {
    return this._bestTime;
  }

  setBestTime(value: number): void {
    this._bestTime = Math.max(0, value);
  }

  get rewindCharges(): number {
    return this._rewindCharges;
  }

  get phase(): RunPhase {
    return this._phase;
  }

  /** Begin a run (or attract loop). */
  start(phase: RunPhase = 'playing', seed?: number): void {
    if (seed !== undefined) this._rng = new Mulberry32(seed);
    this._phase = phase;
    this._timeAlive = 0;
    this._timeBonus = 0;
    this._distance = 0;
    this._score = 0;
    this._multiplier = 1;
    this._playerX = 0;
    this._playerVx = 0;
    this._nextFillZ = 10;
    this._nextRewindRegenAt = REWIND_REGEN_INTERVAL;
    this._nextId = 1;
    this._obstacles = [];
    this._fragments = [];
    this._rewindCharges = MAX_REWINDS;
    this._rewindCooldown = 0;
    this._crashTimer = 0;
    this._invert = 0;
    this._flash = 0;
    this._fxNearMiss = 0;
    this._playback = [];
    this._playbackAcc = 0;
    this._countdown = 0;
    this._dwell.x = 0;
    this._dwell.time = 0;
    this._rewind.clear();
    this._fillAhead();
  }

  tick(dt: number, input: SimInput): SimEvents {
    const events = emptyEvents();
    const clamped = Math.min(0.05, Math.max(0, dt));

    this._invert = Math.max(0, this._invert - clamped * 6);
    this._flash = Math.max(0, this._flash - clamped * 4);
    this._fxNearMiss = Math.max(0, this._fxNearMiss - clamped * 3);
    this._rewindCooldown = Math.max(0, this._rewindCooldown - clamped);

    if (this._phase === 'dead') {
      if (input.rewind) {
        this._beginRewind(events, true);
      } else if (input.restart) {
        this.start('playing');
        events.restarted = true;
      }
      return events;
    }

    if (this._phase === 'rewinding') {
      this._tickRewind(clamped);
      return events;
    }

    if (this._phase === 'countdown') {
      this._tickCountdown(clamped);
      return events;
    }

    if (this._phase === 'crash') {
      this._crashTimer -= clamped;
      if (this._crashTimer <= 0) {
        this._phase = 'dead';
        if (this._scoredTime() > this._bestTime) this._bestTime = this._scoredTime();
        events.died = true;
      }
      return events;
    }

    if (this._phase === 'attract') {
      this._advanceWorld(
        clamped,
        { steer: this._attractSteer(), rewind: false, restart: false },
        events,
        true,
      );
      return events;
    }

    if (input.rewind) {
      this._beginRewind(events, false);
      if (events.rewindUsed) return events;
    }

    this._advanceWorld(clamped, input, events, false);
    return events;
  }

  readout(): SimReadout {
    const diff = this._difficulty();
    const signature = this._rewindCharges > 0.05 && this._rewindCharges <= 1.05;
    return {
      phase: this._phase,
      timeAlive: this._timeAlive,
      scoredTime: this._scoredTime(),
      distance: this._distance,
      score: this._score,
      multiplier: this._multiplier,
      rewindCharges: this._rewindCharges,
      rewindCooldown: this._rewindCooldown,
      playerX: this._playerX,
      playerY: PLAYER_Y,
      playerZ: 0,
      halfWidth: this._halfWidth,
      speed: this._speed,
      speedMul: diff.speedMul,
      intensity: diff.intensity,
      shake: diff.shake + this._fxNearMiss * 0.012,
      fovBoost: diff.fovBoost,
      cameraTilt: diff.cameraTilt,
      glitch: diff.glitch,
      chromatic: diff.chromatic + this._fxNearMiss * 0.04,
      vignette: 0.1 + diff.intensity * 0.08,
      invert: this._invert,
      flash: this._flash,
      crashTimer: this._crashTimer,
      countdown: this._phase === 'countdown' ? this._countdown : 0,
      canRewind:
        this._rewindCharges >= 1 &&
        this._rewind.duration > 0.04 &&
        ((this._phase === 'playing' && this._rewindCooldown <= 0) || this._phase === 'dead'),
      signatureCharge: signature,
      obstacles: this._obstacles,
      fragments: this._fragments,
    };
  }

  capture(): SimSnapshot {
    return cloneSnapshot({
      phase: this._phase,
      timeAlive: this._timeAlive,
      timeBonus: this._timeBonus,
      distance: this._distance,
      score: this._score,
      multiplier: this._multiplier,
      playerX: this._playerX,
      playerVx: this._playerVx,
      halfWidth: this._halfWidth,
      speed: this._speed,
      nextFillZ: this._nextFillZ,
      nextRewindRegenAt: this._nextRewindRegenAt,
      rngState: this._rng.state,
      nextId: this._nextId,
      obstacles: this._obstacles,
      fragments: this._fragments,
    });
  }

  restore(snapshot: SimSnapshot, phaseOverride?: RunPhase): void {
    const s = cloneSnapshot(snapshot);
    this._phase = phaseOverride ?? (s.phase === 'crash' || s.phase === 'dead' || s.phase === 'rewinding' || s.phase === 'countdown' ? 'playing' : s.phase);
    this._timeAlive = s.timeAlive;
    this._timeBonus = s.timeBonus ?? 0;
    this._distance = s.distance;
    this._score = s.score;
    this._multiplier = s.multiplier;
    this._playerX = s.playerX;
    this._playerVx = s.playerVx;
    this._halfWidth = s.halfWidth;
    this._speed = s.speed;
    this._nextFillZ = s.nextFillZ;
    this._nextRewindRegenAt = s.nextRewindRegenAt;
    this._rng.state = s.rngState;
    this._nextId = s.nextId;
    this._obstacles = s.obstacles as SimObstacle[];
    this._fragments = s.fragments as SimFragment[];
    this._crashTimer = 0;
    this._dwell.x = this._playerX;
    this._dwell.time = 0;
  }

  private _beginRewind(events: SimEvents, ignoreCooldown: boolean): void {
    if (this._rewindCharges < 1) return;
    if (!ignoreCooldown && this._rewindCooldown > 0) return;
    const frames = this._rewind.chronological();
    if (frames.length === 0) return;
    const signature = this._rewindCharges <= 1.05;
    this._rewindCharges -= 1;
    this._playback = frames;
    this._playbackAcc = 0;
    this._countdown = 0;
    this._rewindCooldown = 0;
    this.restore(frames[frames.length - 1]!, 'rewinding');
    this._invert = signature ? 0.1 : 0.06;
    this._flash = signature ? 0.22 : 0.12;
    events.rewindUsed = true;
    events.signatureRewind = signature;
    this._rewind.clear();
  }

  private _tickRewind(dt: number): void {
    const n = this._playback.length;
    if (n === 0) {
      this._beginCountdown();
      return;
    }
    this._playbackAcc += dt;
    const t = Math.min(1, this._playbackAcc / REWIND_PLAYBACK_SECONDS);
    const idx = Math.round((1 - t) * (n - 1));
    this.restore(this._playback[idx]!, 'rewinding');
    if (t >= 1) this._beginCountdown();
  }

  private _beginCountdown(): void {
    const first = this._playback[0];
    if (first) this.restore(first, 'countdown');
    this._phase = 'countdown';
    this._countdown = COUNTDOWN_SECONDS;
    this._playerVx = 0;
    this._playback = [];
    this._playbackAcc = 0;
  }

  private _tickCountdown(dt: number): void {
    this._countdown = Math.max(0, this._countdown - dt);
    this._playerVx = 0;
    if (this._countdown <= 0) {
      this._phase = 'playing';
      this._rewindCooldown = REWIND_COOLDOWN;
      this._countdown = 0;
    }
  }

  private _difficulty(): Difficulty {
    return difficultyAt(this._phase === 'attract' ? ATTRACT_DIFFICULTY_TIME : this._timeAlive);
  }

  private _scoredTime(): number {
    return this._timeAlive + this._timeBonus;
  }

  /** Steer toward a hole so the title screen never teaches that clipping is OK. */
  private _attractSteer(): number {
    const target = this._chooseSafeX();
    const dx = target - this._playerX;
    return Math.max(-1, Math.min(1, dx / 0.45));
  }

  private _chooseSafeX(): number {
    const r = PLAYER_RADIUS;
    const minX = -this._halfWidth + r + 0.04;
    const maxX = this._halfWidth - r - 0.04;
    const upcoming = this._obstacles.filter((o) => o.z > 0.12 && o.z < 18);
    let bestX = Math.max(minX, Math.min(maxX, this._playerX));
    let best = Number.NEGATIVE_INFINITY;
    const steps = 24;
    for (let i = 0; i <= steps; i++) {
      const x = minX + ((maxX - minX) * i) / steps;
      let score = 0;
      if (upcoming.length === 0) {
        score = 2 - Math.abs(x) * 0.08;
      } else {
        let minWeighted = Infinity;
        for (const o of upcoming) {
          const dx = Math.abs(x - o.x) - o.halfW - r;
          const urgency = 1 / Math.max(0.35, o.z);
          minWeighted = Math.min(minWeighted, dx * urgency);
          if (dx < 0.08) score -= (0.45 - dx) * urgency * 10;
        }
        score += minWeighted * 6;
      }
      score -= Math.abs(x - this._playerX) * 0.35;
      if (score > best) {
        best = score;
        bestX = x;
      }
    }
    return bestX;
  }

  private _unstickAttract(): void {
    const r = PLAYER_RADIUS;
    const near = this._obstacles.filter((o) => o.z > -1.5 && o.z < 1.5);
    if (near.length === 0) return;
    const current = makePlayerSphere(this._playerX, PLAYER_Y, 0);
    if (!near.some((o) => hitsObstacle(current, o))) return;

    const minX = -this._halfWidth + r;
    const maxX = this._halfWidth - r;
    let bestX = this._playerX;
    let best = Number.NEGATIVE_INFINITY;
    const steps = 48;
    for (let i = 0; i <= steps; i++) {
      const x = minX + ((maxX - minX) * i) / steps;
      let clear = Infinity;
      for (const o of near) {
        clear = Math.min(clear, Math.abs(x - o.x) - o.halfW - r);
      }
      const score = clear - Math.abs(x - this._playerX) * 0.02;
      if (score > best) {
        best = score;
        bestX = x;
      }
    }
    this._playerX = bestX;
    this._playerVx = 0;
  }

  private _advanceWorld(dt: number, input: SimInput, events: SimEvents, attract: boolean): void {
    const diff = this._difficulty();
    this._speed = diff.speed;
    this._halfWidth = diff.halfWidth;

    const steer = Math.max(-1, Math.min(1, input.steer));
    this._playerVx += steer * STEER_ACCEL * dt;
    this._playerVx *= Math.exp(-STEER_DAMPING * dt);
    if (this._playerVx > STEER_MAX_VX) this._playerVx = STEER_MAX_VX;
    if (this._playerVx < -STEER_MAX_VX) this._playerVx = -STEER_MAX_VX;
    this._playerX += this._playerVx * dt;
    const maxX = this._halfWidth - PLAYER_RADIUS;
    if (this._playerX > maxX) {
      this._playerX = maxX;
      this._playerVx = 0;
    } else if (this._playerX < -maxX) {
      this._playerX = -maxX;
      this._playerVx = 0;
    }

    const dz = this._speed * dt;
    this._distance += dz;
    this._timeAlive += dt;
    this._nextFillZ -= dz;

    updateDwell(this._dwell, this._playerX, dt);

    for (const o of this._obstacles) {
      o.z -= dz;
    }
    for (const f of this._fragments) {
      f.z -= dz;
    }

    this._obstacles = this._obstacles.filter((o) => o.z > RECYCLE_Z);
    this._fragments = this._fragments.filter((f) => f.z > RECYCLE_Z && !f.collected);

    this._fillAhead();
    applyGatePressure(this._obstacles, this._dwell, dt, this._halfWidth);
    ensureObstaclesPassable(this._obstacles, this._halfWidth);
    for (const o of this._obstacles) {
      o.x = o.xAmp > 0
        ? o.xBase + Math.sin(this._timeAlive * o.xFreq + o.xPhase) * o.xAmp
        : o.xBase;
    }
    syncAttachedFragments(this._obstacles, this._fragments, this._halfWidth);
    if (attract) this._unstickAttract();

    if (!attract) {
      this._score += dt * SCORE_PER_SECOND * this._multiplier;
      if (this._timeAlive >= this._nextRewindRegenAt) {
        this._rewindCharges = Math.min(MAX_REWINDS, this._rewindCharges + 1);
        this._nextRewindRegenAt += REWIND_REGEN_INTERVAL;
      }
    }

    const player = makePlayerSphere(this._playerX, PLAYER_Y, 0);
    for (const f of this._fragments) {
      if (hitsFragment(player, f)) {
        f.collected = true;
        if (!attract) {
          this._score += FRAGMENT_SCORE * this._multiplier;
          this._rewindCharges = Math.min(MAX_REWINDS, this._rewindCharges + FRAGMENT_CHARGE);
          if (this._multiplier >= MAX_MULTIPLIER) {
            this._timeBonus += FRAGMENT_MAX_MULT_TIME;
          }
          events.fragment = true;
        }
      }
    }
    this._fragments = this._fragments.filter((f) => !f.collected);

    if (!attract) {
      for (const o of this._obstacles) {
        if (hitsObstacle(player, o)) {
          this._phase = 'crash';
          this._crashTimer = CRASH_FREEZE;
          this._flash = 0.22;
          this._multiplier = 1;
          events.crashed = true;
          return;
        }
        if (isNearMiss(player, o)) {
          o.nearMissGranted = true;
          this._score += NEAR_MISS_SCORE * this._multiplier;
          this._timeBonus += NEAR_MISS_TIME;
          this._multiplier = Math.min(MAX_MULTIPLIER, this._multiplier + 1);
          this._fxNearMiss = 1;
          events.nearMiss = true;
        }
      }
      this._rewind.push(this.capture(), dt);
    }
  }

  private _fillAhead(): void {
    const diff = this._difficulty();
    let guard = 0;
    while (this._nextFillZ < LOOKAHEAD && guard++ < 24) {
      const gap = segmentSpacing(diff.speed);
      const built = buildSegment(this._nextFillZ, diff, this._rng, () => this._nextId++, {
        dwellX: this._dwell.x,
        camp: campFactor(this._dwell),
      });
      this._obstacles.push(...built.obstacles);
      this._fragments.push(...built.fragments);
      this._nextFillZ += built.length + gap;
    }
  }
}
