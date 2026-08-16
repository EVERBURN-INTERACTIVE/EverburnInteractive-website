import type { SimEvents, SimReadout } from './types';
import {
  BEST_TIME_STORAGE_KEY,
  FRAGMENT_MAX_MULT_TIME,
  FRAGMENT_SCORE,
  MAX_MULTIPLIER,
  NEAR_MISS_SCORE,
  NEAR_MISS_TIME,
  SCORE_PER_SECOND,
} from './config';

const STYLE_ID = 'oms-hud-style';

const CSS = `
.oms-hud {
  position: absolute; inset: 0; pointer-events: none;
  font-family: "Segoe UI", "Eurostile", "DIN Alternate", sans-serif;
  color: #d7fbff; letter-spacing: 0.18em;
  text-transform: uppercase; user-select: none;
}
.oms-hud * { box-sizing: border-box; }
.oms-time {
  position: absolute; top: 28px; left: 50%; transform: translateX(-50%);
  font-size: 42px; font-weight: 700; letter-spacing: 0.22em;
  text-shadow: 0 0 18px #5ce1ff, 0 0 42px #1aa3c4;
}
.oms-rewinds {
  display: flex; gap: 8px; align-items: center;
  font-size: 13px;
}
.oms-top-left {
  position: absolute; top: 28px; left: 32px;
  display: flex; flex-direction: column; align-items: flex-start; gap: 10px;
}
.oms-mult {
  font-size: 18px; color: #ffd56a; letter-spacing: 0.28em;
  text-shadow: 0 0 12px #ffb020;
}
.oms-pip {
  width: 16px; height: 16px; transform: rotate(45deg);
  border: 1px solid #5ce1ff; box-shadow: 0 0 8px #5ce1ff;
  background: transparent;
}
.oms-pip.on { background: #5ce1ff; }
.oms-pip.half { background: linear-gradient(180deg, #5ce1ff 50%, transparent 50%); }
.oms-one-more {
  color: #ff4d7a; letter-spacing: 0.32em; font-size: 14px; font-weight: 700;
  text-shadow: 0 0 16px #ff2d6a; animation: omsPulse 0.9s ease-in-out infinite;
}
.oms-popup {
  position: absolute; left: 50%; top: 38%; transform: translate(-50%, -50%);
  font-size: 22px; letter-spacing: 0.4em; opacity: 0; transition: opacity 80ms linear;
  text-shadow: 0 0 16px currentColor;
}
.oms-popup.show { opacity: 1; }
.oms-hint {
  position: absolute; bottom: 28px; left: 50%; transform: translateX(-50%);
  font-size: 11px; letter-spacing: 0.42em; color: #8ad7e8; opacity: 0.75;
}
.oms-fail {
  position: absolute; inset: 0; display: none; align-items: center; justify-content: center;
  background: rgba(2, 4, 10, 0.55); pointer-events: auto; cursor: default;
}
.oms-fail.show { display: flex; }
.oms-fail-card {
  text-align: center; border: 1px solid rgba(92, 225, 255, 0.35);
  padding: 48px 64px; background: rgba(4, 8, 18, 0.82);
  box-shadow: 0 0 80px rgba(92, 225, 255, 0.12);
}
.oms-fail-time {
  font-size: 64px; letter-spacing: 0.12em; line-height: 1;
  text-shadow: 0 0 24px #5ce1ff;
}
.oms-fail-label { margin-top: 12px; font-size: 12px; letter-spacing: 0.5em; color: #8ad7e8; }
.oms-fail-best { margin-top: 22px; font-size: 13px; letter-spacing: 0.36em; color: #ffd56a; }
.oms-fail-cta {
  margin-top: 22px; font-size: 14px; letter-spacing: 0.46em; color: #ffffff;
  animation: omsPulse 1.1s ease-in-out infinite;
  pointer-events: auto; cursor: pointer;
  background: transparent; border: 1px solid rgba(92, 225, 255, 0.45);
  padding: 12px 22px; font-family: inherit; text-transform: uppercase;
}
.oms-fail-rewind {
  border-color: rgba(255, 77, 122, 0.7); color: #ff8aa8;
}
.oms-fail-menu {
  border-color: rgba(138, 215, 232, 0.45); color: #b8e4f0;
  animation: none;
}
.oms-fail-actions {
  margin-top: 28px; display: flex; flex-direction: column; gap: 12px; align-items: center;
}
.oms-fail-hint {
  margin-top: 16px; font-size: 10px; letter-spacing: 0.4em; color: #8ad7e8; opacity: 0.7;
}
.oms-countdown {
  position: absolute; left: 50%; top: 46%; transform: translate(-50%, -50%);
  font-size: 120px; font-weight: 700; letter-spacing: 0.12em; display: none;
  text-shadow: 0 0 28px #5ce1ff, 0 0 80px #1aa3c4;
}
.oms-countdown.show { display: block; }
.oms-rewind-banner {
  position: absolute; left: 50%; top: 18%; transform: translateX(-50%);
  font-size: 18px; letter-spacing: 0.5em; display: none; color: #ff4d7a;
  text-shadow: 0 0 18px #ff2d6a;
}
.oms-rewind-banner.show { display: block; }
.oms-rewind-btn {
  position: absolute; right: 24px; bottom: 5.6rem; pointer-events: auto; cursor: pointer;
  width: 72px; height: 72px; border-radius: 50%;
  border: 1px solid #5ce1ff; background: rgba(8, 16, 32, 0.7);
  color: #5ce1ff; letter-spacing: 0.12em; font-size: 10px;
  text-transform: uppercase; font-family: inherit;
}
.oms-rewind-btn.pulse { animation: omsPulse 0.8s ease-in-out infinite; border-color: #ff4d7a; color: #ff4d7a; }
.oms-attract {
  position: absolute; left: 50%; top: 46%; transform: translate(-50%, -50%);
  text-align: center; pointer-events: none;
}
.oms-title {
  font-size: 34px; letter-spacing: 0.46em; text-shadow: 0 0 24px #5ce1ff;
}
.oms-sub { margin-top: 16px; font-size: 11px; letter-spacing: 0.5em; color: #8ad7e8; }
.oms-hint-touch { display: none; }
@media (pointer: coarse) {
  .oms-time { font-size: 28px; top: 14px; }
  .oms-top-left { top: 14px; left: 14px; }
  .oms-hint-kbd { display: none; }
  .oms-hint-touch { display: inline; }
}
@media (max-height: 430px) {
  .oms-time { font-size: 26px; top: 10px; }
  .oms-top-left { top: 10px; left: 12px; }
}
.oms-help-btn {
  position: absolute; left: 24px; bottom: 24px; pointer-events: auto; cursor: pointer;
  width: 52px; height: 52px; border-radius: 50%;
  border: 1px solid #5ce1ff; background: rgba(8, 16, 32, 0.78);
  color: #5ce1ff; font-size: 22px; font-weight: 700; letter-spacing: 0;
  font-family: inherit; text-transform: none;
  box-shadow: 0 0 18px rgba(92, 225, 255, 0.28);
}
.oms-help-btn:hover { filter: brightness(1.25); }
.oms-help {
  position: absolute; inset: 0; display: none; align-items: center; justify-content: center;
  background: rgba(2, 4, 12, 0.72); pointer-events: auto; cursor: default;
  padding: 24px 16px;
}
.oms-help.show { display: flex; }
.oms-help-card {
  position: relative; width: min(38rem, 100%); max-height: min(78vh, 42rem);
  overflow-y: auto; text-align: left; text-transform: none; letter-spacing: 0.03em;
  border: 1px solid rgba(92, 225, 255, 0.4); padding: 28px 28px 24px;
  background: rgba(4, 8, 18, 0.94); box-shadow: 0 0 80px rgba(92, 225, 255, 0.16);
  color: #d7fbff;
}
.oms-help-card h2 {
  margin: 0 0 18px; font-size: 15px; letter-spacing: 0.38em; text-transform: uppercase;
  text-shadow: 0 0 16px #5ce1ff;
}
.oms-help-card h3 {
  margin: 18px 0 8px; font-size: 11px; letter-spacing: 0.32em; text-transform: uppercase;
  color: #5ce1ff;
}
.oms-help-card p, .oms-help-card li {
  margin: 0; font-size: 13px; line-height: 1.55; color: #b8e4f0; letter-spacing: 0.02em;
}
.oms-help-card ul { margin: 8px 0 0; padding-left: 1.15rem; }
.oms-help-card li { margin-top: 6px; }
.oms-help-close {
  position: absolute; top: 12px; right: 12px; pointer-events: auto; cursor: pointer;
  background: transparent; border: 1px solid rgba(92, 225, 255, 0.45);
  color: #8ad7e8; font-family: inherit; text-transform: uppercase;
  letter-spacing: 0.28em; font-size: 10px; padding: 8px 12px;
}
@keyframes omsPulse {
  0%, 100% { opacity: 1; filter: brightness(1); }
  50% { opacity: 0.45; filter: brightness(1.6); }
}
`;

function ensureStyle(): void {
  if (typeof document === 'undefined') return;
  let el = document.getElementById(STYLE_ID);
  if (!el) {
    el = document.createElement('style');
    el.id = STYLE_ID;
    document.head.appendChild(el);
  }
  el.textContent = CSS;
}

function fmt(n: number): string {
  return n.toFixed(2);
}

/**
 * Minimal arcade HUD. Self-contained CSS so exported sites do not need editor styles.
 */
export class OneMoreSecondHud {
  readonly root: HTMLElement;
  private readonly _time: HTMLElement;
  private readonly _mult: HTMLElement;
  private readonly _rewinds: HTMLElement;
  private readonly _popup: HTMLElement;
  private readonly _hint: HTMLElement;
  private readonly _fail: HTMLElement;
  private readonly _failTime: HTMLElement;
  private readonly _failBest: HTMLElement;
  private readonly _failRewind: HTMLButtonElement;
  private readonly _failRun: HTMLButtonElement;
  private readonly _failMenu: HTMLButtonElement;
  private readonly _failHint: HTMLElement;
  private readonly _countdown: HTMLElement;
  private readonly _rewindBanner: HTMLElement;
  private readonly _rewindBtn: HTMLButtonElement;
  private readonly _attract: HTMLElement;
  private readonly _helpBtn: HTMLButtonElement;
  private readonly _help: HTMLElement;
  private readonly _hasMenu: boolean;
  private _popupUntil = 0;
  private _best: number;

  constructor(
    host: HTMLElement,
    onRewind: () => void,
    onRestart: () => void,
    best: number,
    onMenu?: () => void,
  ) {
    ensureStyle();
    this._best = best;
    this.root = document.createElement('div');
    this.root.className = 'oms-hud';
    this.root.innerHTML = `
      <div class="oms-time">0.00</div>
      <div class="oms-top-left">
        <div class="oms-rewinds"></div>
        <div class="oms-mult">×1</div>
      </div>
      <div class="oms-popup"></div>
      <div class="oms-hint"><span class="oms-hint-kbd">A D dodge&nbsp;&nbsp;&nbsp;space rewind</span><span class="oms-hint-touch">tap left / right&nbsp;&nbsp;&nbsp;rewind below</span></div>
      <div class="oms-rewind-banner">Rewinding</div>
      <div class="oms-countdown">3</div>
      <div class="oms-attract">
        <div class="oms-title">One More Second</div>
        <div class="oms-sub">Press Play</div>
      </div>
      <button type="button" class="oms-help-btn" data-fc-ui-role="button" aria-label="About this game">?</button>
      <div class="oms-help" role="dialog" aria-modal="true" aria-labelledby="oms-help-title" hidden>
        <div class="oms-help-card">
          <button type="button" class="oms-help-close" data-fc-ui-role="button">Close</button>
          <h2 id="oms-help-title">One More Second</h2>
          <h3>The game</h3>
          <p>An endless neon corridor. Stay alive as long as you can. Dodge gates, skim blockers, grab time fragments, and spend rewind charges when a hit is about to land.</p>
          <ul>
            <li>A / D or arrows to dodge. On a phone, hold the left or right side of the screen</li>
            <li>Space or the rewind button to rewind the last second</li>
            <li>Enter or One More Run to start again</li>
            <li>Phones play in landscape only</li>
          </ul>
          <h3>Built on FlameCore</h3>
          <p>This run is a FlameCore engine trial: a headless simulation, pooled instanced meshes, rewind snapshots, HUD overlay, audio, particles, and a live galaxy shader. It is here to prove what the browser runtime can do without a native install.</p>
          <h3>How the score works</h3>
          <p>The public leaderboard ranks your best time, not the point counter. The clock is seconds survived, plus ${NEAR_MISS_TIME.toFixed(2)}s for every near miss. Fragments refill rewind charge and add points. At max multiplier they also add ${FRAGMENT_MAX_MULT_TIME.toFixed(2)}s to the clock.</p>
          <ul>
            <li>${SCORE_PER_SECOND} points per second, multiplied by your current multiplier</li>
            <li>Near miss: +${NEAR_MISS_TIME.toFixed(2)}s on the clock, +${NEAR_MISS_SCORE} points times multiplier, and the multiplier goes up (max ${MAX_MULTIPLIER})</li>
            <li>Fragment: +${FRAGMENT_SCORE} points times multiplier, plus rewind charge. At ×${MAX_MULTIPLIER}, also +${FRAGMENT_MAX_MULT_TIME.toFixed(2)}s</li>
            <li>A crash resets the multiplier. Only your best time is saved to the board.</li>
          </ul>
          <h3>Credits</h3>
          <p>Music by Suno. Sound effects by ElevenLabs.</p>
        </div>
      </div>
      <div class="oms-fail">
        <div class="oms-fail-card">
          <div class="oms-fail-time">0.00</div>
          <div class="oms-fail-label">Seconds Alive</div>
          <div class="oms-fail-best">Best: 0.00</div>
          <div class="oms-fail-actions">
            <button type="button" class="oms-fail-cta oms-fail-rewind" data-fc-ui-role="button">Rewind the hit</button>
            <button type="button" class="oms-fail-cta oms-fail-run" data-fc-ui-role="button">One More Run</button>
            <button type="button" class="oms-fail-cta oms-fail-menu" data-fc-ui-role="button">Back to menu</button>
          </div>
          <div class="oms-fail-hint">Space rewind · Enter new run</div>
        </div>
      </div>
      <button type="button" class="oms-rewind-btn" data-fc-ui-role="button">Rewind</button>
    `;
    host.appendChild(this.root);
    this._time = this.root.querySelector('.oms-time')!;
    this._mult = this.root.querySelector('.oms-mult')!;
    this._rewinds = this.root.querySelector('.oms-rewinds')!;
    this._popup = this.root.querySelector('.oms-popup')!;
    this._hint = this.root.querySelector('.oms-hint')!;
    this._fail = this.root.querySelector('.oms-fail')!;
    this._failTime = this.root.querySelector('.oms-fail-time')!;
    this._failBest = this.root.querySelector('.oms-fail-best')!;
    this._failRewind = this.root.querySelector('.oms-fail-rewind')!;
    this._failRun = this.root.querySelector('.oms-fail-run')!;
    this._failMenu = this.root.querySelector('.oms-fail-menu')!;
    this._failHint = this.root.querySelector('.oms-fail-hint')!;
    this._countdown = this.root.querySelector('.oms-countdown')!;
    this._rewindBanner = this.root.querySelector('.oms-rewind-banner')!;
    this._rewindBtn = this.root.querySelector('.oms-rewind-btn')!;
    this._attract = this.root.querySelector('.oms-attract')!;
    this._helpBtn = this.root.querySelector('.oms-help-btn')!;
    this._help = this.root.querySelector('.oms-help')!;
    this._hasMenu = Boolean(onMenu);
    this._helpBtn.style.display = 'none';
    this._failMenu.style.display = this._hasMenu ? '' : 'none';
    this._rewindBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      onRewind();
    });
    this._failRewind.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      onRewind();
    });
    this._failRun.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      onRestart();
    });
    this._failMenu.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      onMenu?.();
    });
    this._helpBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.openHelp();
    });
    this._help.querySelector('.oms-help-close')!.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.closeHelp();
    });
    this._help.addEventListener('click', (e) => {
      if (e.target === this._help) {
        this.closeHelp();
      }
    });
    this._help.addEventListener('pointerdown', (e) => e.stopPropagation());
    window.addEventListener('keydown', this._onHelpKey, true);
  }

  sync(readout: SimReadout, events: SimEvents, now: number, exported: boolean): void {
    const attract = readout.phase === 'attract';
    this._attract.style.display = attract ? 'block' : 'none';
    this._attract.querySelector('.oms-sub')!.textContent = exported ? 'Click / any key' : 'Press Play';
    this._time.style.opacity = attract ? '0' : '1';
    this._mult.style.opacity = attract ? '0' : '1';
    this._rewinds.style.opacity = attract ? '0' : '1';
    this._hint.style.opacity = attract ? '0' : readout.timeAlive < 6 ? '0.75' : '0';

    this._time.textContent = fmt(readout.scoredTime);
    this._mult.textContent = `×${readout.multiplier}`;
    this._mult.style.opacity = attract ? '0' : readout.multiplier > 1 ? '1' : '0.55';

    this._renderCharges(readout);

    if (events.nearMiss) this._showPopup(`+${NEAR_MISS_TIME.toFixed(2)}s  Near Miss`, '#5ce1ff', now);
    if (events.fragment) {
      this._showPopup(
        readout.multiplier >= MAX_MULTIPLIER
          ? `+${FRAGMENT_MAX_MULT_TIME.toFixed(2)}s  fragment`
          : `+${FRAGMENT_SCORE}  fragment`,
        '#ffe566',
        now,
      );
    }
    if (events.signatureRewind) this._showPopup('One More Second', '#ff4d7a', now);
    this._popup.classList.toggle('show', now < this._popupUntil);

    const dead = readout.phase === 'dead';
    const rewinding = readout.phase === 'rewinding';
    const counting = readout.phase === 'countdown';
    this._fail.classList.toggle('show', dead);
    if (dead || events.died) {
      this._best = Math.max(this._best, readout.scoredTime);
      this._failTime.textContent = fmt(readout.scoredTime);
      this._failBest.textContent = `Best: ${fmt(this._best)}`;
      this.persistBest(this._best);
    }
    this._failRewind.style.display = dead && readout.canRewind ? 'inline-block' : 'none';
    this._failMenu.style.display = dead && this._hasMenu ? 'inline-block' : 'none';
    this._failHint.style.display = dead ? 'block' : 'none';
    this._failHint.textContent = readout.canRewind
      ? 'Space rewind · Enter new run'
      : 'Enter new run';

    this._rewindBanner.classList.toggle('show', rewinding);
    this._countdown.classList.toggle('show', counting);
    if (counting) {
      const n = Math.max(1, Math.ceil(readout.countdown));
      this._countdown.textContent = String(n);
    }

    const hideRewindBtn = attract || dead || rewinding || counting;
    this._rewindBtn.classList.toggle('pulse', readout.signatureCharge && !hideRewindBtn);
    this._rewindBtn.style.display = hideRewindBtn ? 'none' : 'block';
    this._rewindBtn.disabled = !readout.canRewind;
    this._rewindBtn.style.opacity = this._rewindBtn.disabled ? '0.35' : '1';
    this._helpBtn.style.display = attract ? 'block' : 'none';
    if (!attract && this.isHelpOpen) {
      this.closeHelp();
    }
  }

  get isHelpOpen(): boolean {
    return this._help.classList.contains('show');
  }

  openHelp(): void {
    this._help.classList.add('show');
    this._help.removeAttribute('hidden');
  }

  closeHelp(): void {
    this._help.classList.remove('show');
    this._help.setAttribute('hidden', '');
  }

  persistBest(value: number): void {
    this._best = Math.max(this._best, value);
    try {
      localStorage.setItem(BEST_TIME_STORAGE_KEY, String(this._best));
    } catch {
      /* private mode */
    }
  }

  get best(): number {
    return this._best;
  }

  dispose(): void {
    window.removeEventListener('keydown', this._onHelpKey, true);
    this.root.remove();
  }

  private readonly _onHelpKey = (e: KeyboardEvent): void => {
    if (!this.isHelpOpen) {
      return;
    }
    e.stopImmediatePropagation();
    if (e.key === 'Escape') {
      e.preventDefault();
      this.closeHelp();
    }
  };

  private _showPopup(text: string, color: string, now: number): void {
    this._popup.textContent = text;
    this._popup.style.color = color;
    this._popupUntil = now + 0.55;
  }

  private _renderCharges(readout: SimReadout): void {
    if (readout.signatureCharge) {
      this._rewinds.innerHTML = `<span class="oms-one-more">One More Second</span>`;
      return;
    }
    const full = Math.floor(readout.rewindCharges);
    const half = readout.rewindCharges - full >= 0.45;
    const pips: string[] = [];
    for (let i = 0; i < 3; i++) {
      let cls = 'oms-pip';
      if (i < full) cls += ' on';
      else if (i === full && half) cls += ' half';
      pips.push(`<span class="${cls}"></span>`);
    }
    this._rewinds.innerHTML = pips.join('');
  }
}

export function readBestTime(): number {
  try {
    const raw = localStorage.getItem(BEST_TIME_STORAGE_KEY);
    const n = raw ? Number(raw) : 0;
    return Number.isFinite(n) ? n : 0;
  } catch {
    return 0;
  }
}
