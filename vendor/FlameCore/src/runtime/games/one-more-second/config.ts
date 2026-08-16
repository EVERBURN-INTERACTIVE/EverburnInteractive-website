/**
 * Tunables for One More Second. Kept data-driven so difficulty and feel
 * can be iterated without touching the simulation loop.
 */

/** Obstacle spawn columns in local X. Movement is continuous. */
export const SPAWN_X = [-2, 0, 2] as const;

/** Half-width of the playable corridor at t=0. */
export const CORRIDOR_HALF_WIDTH = 3.2;

/** Half-width after the 90s narrowing. Still wide enough for a guaranteed hole. */
export const CORRIDOR_NARROW_HALF_WIDTH = 2.7;

/** Player collision sphere radius. */
export const PLAYER_RADIUS = 0.34;

/** Player hover height (center). */
export const PLAYER_Y = 0.92;

/** Forward travel speed at 1× difficulty, metres per second. */
export const BASE_SPEED = 16;

/** How far ahead of the player new geometry is filled. */
export const LOOKAHEAD = 88;

/** Recycle obstacles once they pass this Z (behind the camera). */
export const RECYCLE_Z = -10;

/** Extra metres the player sphere needs besides its own diameter to fit a hole. */
export const PASS_MARGIN = 0.42;

/** Metres of empty track inserted between obstacle segments at 1× speed. */
export const BASE_GAP = 9;

/** Extra geometric gap on sliding pairs, on top of {@link minHoleWidth}. */
export const GATE_GAP_EXTRA = 0.18;

/** How far the player may drift in X before dwell time resets. */
export const DWELL_RADIUS = 0.45;

/** Seconds in one spot before upcoming holes start fleeing the camper. */
export const DWELL_GRACE = 1.15;

/** Seconds after grace to reach full hole-seek strength. */
export const DWELL_RAMP = 1.1;

/** Do not retarget gates closer than this; the dodge is already committed. */
export const PRESSURE_Z_MIN = 8;

/** Hole / blocker seek speed at full camp, metres per second. */
export const HOLE_SEEK_SPEED = 2.4;

/** Frozen 'seconds alive' used by the title-screen attract loop. */
export const ATTRACT_DIFFICULTY_TIME = 10;

/** Segment length along Z. */
export const SEGMENT_LENGTH = 14;

/** Near-miss padding added to obstacle AABB on X/Z. */
export const NEAR_MISS_PAD = 0.42;

/** Score awarded for a near miss (before multiplier). */
export const NEAR_MISS_SCORE = 25;

/** Seconds added to the scored timer for each near miss. */
export const NEAR_MISS_TIME = 0.05;

/** Score awarded for a time fragment (before multiplier). */
export const FRAGMENT_SCORE = 50;

/** Seconds added to the scored timer when a fragment is grabbed at max multiplier. */
export const FRAGMENT_MAX_MULT_TIME = 0.5;

/** Rewind charge granted by a fragment. */
export const FRAGMENT_CHARGE = 0.5;

/** Starting / maximum rewind charges. */
export const MAX_REWINDS = 3;

/** Seconds between passive rewind charge grants. */
export const REWIND_REGEN_INTERVAL = 15;

/** Seconds of recorded history restored by one rewind. */
export const REWIND_SECONDS = 1;

/** Wall-clock seconds spent playing that history backward. */
export const REWIND_PLAYBACK_SECONDS = 1;

/** Frozen seconds after a rewind before the run continues. */
export const COUNTDOWN_SECONDS = 3;

/** Seconds before another rewind can be used. */
export const REWIND_COOLDOWN = 2;

/** Rewind buffer sample rate. */
export const REWIND_HZ = 40;

/** Crash freeze before the death card. */
export const CRASH_FREEZE = 0.5;

/** Lateral acceleration while holding left/right. */
export const STEER_ACCEL = 58;

/** Peak lateral speed. */
export const STEER_MAX_VX = 13;

/** Exponential damping on lateral velocity. */
export const STEER_DAMPING = 7.5;

/** Time-score units per second at 1× multiplier. */
export const SCORE_PER_SECOND = 10;

/** Maximum score multiplier. */
export const MAX_MULTIPLIER = 4;

/** localStorage key for best seconds-alive. */
export const BEST_TIME_STORAGE_KEY = 'flamecore.one-more-second.best';
