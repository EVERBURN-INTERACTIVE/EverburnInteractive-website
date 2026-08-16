const MOVEMENT_SRC = '/audio/movement.wav';
const STEER_MAX_VX = 13;
const BASE_VOLUME = 0.14;
const STRAFE_VOLUME = 0.5;
const SPEED_VOLUME = 0.12;
const BASE_RATE = 0.84;
const SPEED_RATE = 0.46;
const STRAFE_RATE = 0.18;

/**
 * Looping whoosh for One More Second. Strafe raises volume; forward speed
 * and dodge intensity raise pitch so the same clip covers both axes.
 */
export class OmsMovementLoop {
  private readonly track: HTMLAudioElement;
  private lastX = 0;
  private hasLastX = false;

  constructor() {
    this.track = new Audio(MOVEMENT_SRC);
    this.track.loop = true;
    this.track.preload = 'auto';
    this.track.volume = 0;
    this.track.preservesPitch = false;
  }

  sync(active: boolean, playerX: number, speedMul: number, dt: number): void {
    if (!active) {
      this.stop();
      return;
    }

    const vx = this.hasLastX && dt > 0 ? (playerX - this.lastX) / dt : 0;
    this.lastX = playerX;
    this.hasLastX = true;

    const lateral = Math.min(1, Math.abs(vx) / STEER_MAX_VX);
    const speedT = Math.min(1.2, Math.max(0, speedMul - 1));
    this.track.playbackRate = BASE_RATE + speedT * SPEED_RATE + lateral * STRAFE_RATE;
    this.track.volume = Math.min(
      1,
      BASE_VOLUME + lateral * STRAFE_VOLUME + Math.min(1, speedT / 1.5) * SPEED_VOLUME,
    );

    if (this.track.paused) {
      void this.track.play().catch(() => {
        /* autoplay may block until a click; later frames retry */
      });
    }
  }

  stop(): void {
    this.hasLastX = false;
    if (!this.track.paused) {
      this.track.pause();
    }
    if (this.track.currentTime > 0) {
      try {
        this.track.currentTime = 0;
      } catch {
        /* some browsers reject seek before metadata */
      }
    }
    this.track.volume = 0;
  }

  dispose(): void {
    this.stop();
    this.track.removeAttribute('src');
    this.track.load();
  }
}
