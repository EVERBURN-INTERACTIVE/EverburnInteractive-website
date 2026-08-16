import { describe, expect, it, vi } from 'vitest';
import { OneMoreSecondHud } from './hud';
import type { SimEvents, SimReadout } from './types';

const EMPTY_EVENTS: SimEvents = {
  nearMiss: false,
  fragment: false,
  crashed: false,
  rewindUsed: false,
  signatureRewind: false,
  restarted: false,
  died: false,
};

function deadReadout(canRewind: boolean): SimReadout {
  return {
    phase: 'dead',
    timeAlive: 4.2,
    scoredTime: 4.2,
    distance: 40,
    score: 100,
    multiplier: 1,
    rewindCharges: canRewind ? 1 : 0,
    rewindCooldown: 0,
    playerX: 0,
    playerY: 0.7,
    playerZ: 0,
    halfWidth: 2.7,
    speed: 18,
    speedMul: 1,
    intensity: 0.4,
    shake: 0,
    fovBoost: 0,
    cameraTilt: 0,
    glitch: 0,
    chromatic: 0,
    vignette: 0,
    invert: 0,
    flash: 0,
    crashTimer: 0,
    countdown: 0,
    canRewind,
    signatureCharge: false,
    obstacles: [],
    fragments: [],
  };
}

function attractReadout(): SimReadout {
  return {
    ...deadReadout(false),
    phase: 'attract',
    timeAlive: 0,
    scoredTime: 0,
  };
}

describe('OneMoreSecondHud death card', () => {
  it('shows Back to menu and invokes the callback', () => {
    const host = document.createElement('div');
    const onMenu = vi.fn();
    const hud = new OneMoreSecondHud(host, vi.fn(), vi.fn(), 0, onMenu);
    hud.sync(deadReadout(true), { ...EMPTY_EVENTS, died: true }, 4.2, true);

    const button = hud.root.querySelector('.oms-fail-menu') as HTMLButtonElement;
    expect(button.textContent).toBe('Back to menu');
    expect(button.style.display).not.toBe('none');
    button.click();
    expect(onMenu).toHaveBeenCalledTimes(1);
    hud.dispose();
  });

  it('hides Back to menu when no callback is provided', () => {
    const host = document.createElement('div');
    const hud = new OneMoreSecondHud(host, vi.fn(), vi.fn(), 0);
    hud.sync(deadReadout(false), { ...EMPTY_EVENTS, died: true }, 1, true);
    const button = hud.root.querySelector('.oms-fail-menu') as HTMLButtonElement;
    expect(button.style.display).toBe('none');
    hud.dispose();
  });
});

describe('OneMoreSecondHud help panel', () => {
  it('shows a help button on the attract menu that opens credits and scoring', () => {
    const host = document.createElement('div');
    const hud = new OneMoreSecondHud(host, vi.fn(), vi.fn(), 0);
    hud.sync(attractReadout(), EMPTY_EVENTS, 0, true);

    const button = hud.root.querySelector('.oms-help-btn') as HTMLButtonElement;
    expect(button.style.display).not.toBe('none');
    expect(hud.isHelpOpen).toBe(false);
    button.click();
    expect(hud.isHelpOpen).toBe(true);

    const card = hud.root.querySelector('.oms-help-card')!.textContent ?? '';
    expect(card).toContain('FlameCore');
    expect(card).toContain('0.05');
    expect(card).toContain('Suno');
    expect(card).toContain('ElevenLabs');
    expect(card).toContain('0.50');

    hud.closeHelp();
    expect(hud.isHelpOpen).toBe(false);
    hud.dispose();
  });

  it('hides the help button during a run and closes the panel', () => {
    const host = document.createElement('div');
    const hud = new OneMoreSecondHud(host, vi.fn(), vi.fn(), 0);
    hud.sync(attractReadout(), EMPTY_EVENTS, 0, true);
    hud.openHelp();
    hud.sync(deadReadout(false), { ...EMPTY_EVENTS, died: true }, 1, true);
    const button = hud.root.querySelector('.oms-help-btn') as HTMLButtonElement;
    expect(button.style.display).toBe('none');
    expect(hud.isHelpOpen).toBe(false);
    hud.dispose();
  });

  it('closes help on Escape without leaving the dialog in the DOM broken', () => {
    const host = document.createElement('div');
    const hud = new OneMoreSecondHud(host, vi.fn(), vi.fn(), 0);
    hud.sync(attractReadout(), EMPTY_EVENTS, 0, true);
    hud.openHelp();
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    expect(hud.isHelpOpen).toBe(false);
    hud.dispose();
  });
});

describe('OneMoreSecondHud layout', () => {
  it('stacks the multiplier under the rewind counters', () => {
    const host = document.createElement('div');
    const hud = new OneMoreSecondHud(host, vi.fn(), vi.fn(), 0);
    const stack = hud.root.querySelector('.oms-top-left');
    expect(stack).not.toBeNull();
    const children = Array.from(stack!.children).map((el) => el.className);
    expect(children[0]).toContain('oms-rewinds');
    expect(children[1]).toContain('oms-mult');
    hud.dispose();
  });
});
