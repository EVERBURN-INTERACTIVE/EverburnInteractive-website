/**
 * Snapshot-friendly simulation types for One More Second.
 * No Three.js — the view layer maps these to meshes.
 */

/** High-level run phase. */
export type RunPhase = 'attract' | 'playing' | 'crash' | 'dead' | 'rewinding' | 'countdown';

/** Obstacle visual / motion class. */
export type ObstacleKind = 'block' | 'moving' | 'wide';

/** A solid blocker in the corridor. */
export interface SimObstacle {
  id: number;
  kind: ObstacleKind;
  x: number;
  y: number;
  z: number;
  halfW: number;
  halfH: number;
  halfD: number;
  /** Base X for moving obstacles. */
  xBase: number;
  xAmp: number;
  xFreq: number;
  xPhase: number;
  /**
   * Shared id for obstacles that form one Z-gate. Doubles use one id so the
   * pair can slide as a rigid hole instead of seeking independently.
   */
  gateId: number;
  /** Center of the passable gap for this gate (before shared sine offset). */
  holeX: number;
  /** True once this obstacle has granted a near-miss. */
  nearMissGranted: boolean;
  /** Optional fragment riding a dangerous offset. */
  fragmentId: number;
}

/** Collectible time fragment. `id` matches `obstacle.fragmentId` when parented. */
export interface SimFragment {
  id: number;
  x: number;
  y: number;
  z: number;
  radius: number;
  collected: boolean;
}

/** Full rewindable simulation snapshot. */
export interface SimSnapshot {
  phase: RunPhase;
  timeAlive: number;
  /** Extra seconds granted by near misses. Not used for difficulty. */
  timeBonus?: number;
  distance: number;
  score: number;
  multiplier: number;
  playerX: number;
  playerVx: number;
  halfWidth: number;
  speed: number;
  nextFillZ: number;
  nextRewindRegenAt: number;
  rngState: number;
  nextId: number;
  obstacles: readonly SimObstacle[];
  fragments: readonly SimFragment[];
}

/** Per-frame player input. */
export interface SimInput {
  /** -1 left, +1 right, 0 none. Analog-capable. */
  steer: number;
  /** Rising-edge rewind request. */
  rewind: boolean;
  /** Any-key / click restart while dead. */
  restart: boolean;
}

/** Events the view/HUD consume for one tick. */
export interface SimEvents {
  nearMiss: boolean;
  fragment: boolean;
  crashed: boolean;
  rewindUsed: boolean;
  signatureRewind: boolean;
  restarted: boolean;
  died: boolean;
}

/** Live simulation read-out (not a snapshot clone). */
export interface SimReadout {
  phase: RunPhase;
  /** Elapsed run time. Drives difficulty, rewind regen, and obstacle motion. */
  timeAlive: number;
  /** HUD / death / leaderboard time: elapsed plus near-miss bonuses. */
  scoredTime: number;
  distance: number;
  score: number;
  multiplier: number;
  rewindCharges: number;
  rewindCooldown: number;
  playerX: number;
  playerY: number;
  playerZ: number;
  halfWidth: number;
  speed: number;
  speedMul: number;
  intensity: number;
  shake: number;
  fovBoost: number;
  cameraTilt: number;
  glitch: number;
  chromatic: number;
  vignette: number;
  invert: number;
  flash: number;
  crashTimer: number;
  /** Remaining freeze after a rewind, 0 when not counting down. */
  countdown: number;
  /** True when a rewind can be started (charge + history). */
  canRewind: boolean;
  signatureCharge: boolean;
  obstacles: readonly SimObstacle[];
  fragments: readonly SimFragment[];
}
