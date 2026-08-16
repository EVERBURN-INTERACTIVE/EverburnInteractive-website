import { describe, expect, it } from 'vitest';
import { OneMoreSecondInput } from './input';

function dispatchPointer(
  target: HTMLElement,
  type: string,
  init: { clientX: number; pointerId: number },
): void {
  const event = new Event(type, { bubbles: true });
  Object.defineProperty(event, 'clientX', { value: init.clientX });
  Object.defineProperty(event, 'pointerId', { value: init.pointerId });
  target.dispatchEvent(event);
}

describe('OneMoreSecondInput', () => {
  it('maps A / ArrowLeft to screen-left, which is world +X when looking down +Z', () => {
    const input = new OneMoreSecondInput();
    input.setActive(true);
    window.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyA', bubbles: true }));
    expect(input.sample('playing').steer).toBe(1);
    window.dispatchEvent(new KeyboardEvent('keyup', { code: 'KeyA', bubbles: true }));
    window.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyD', bubbles: true }));
    expect(input.sample('playing').steer).toBe(-1);
    input.dispose();
  });

  it('does not treat Space as a new-run restart on the death card', () => {
    const input = new OneMoreSecondInput();
    input.setActive(true);
    window.dispatchEvent(new KeyboardEvent('keydown', { code: 'Space', bubbles: true }));
    const sampled = input.sample('dead');
    expect(sampled.rewind).toBe(true);
    expect(sampled.restart).toBe(false);
    input.dispose();
  });

  it('steers from left and right holds on the play surface', () => {
    const root = document.createElement('div');
    root.getBoundingClientRect = () => ({
      x: 0,
      y: 0,
      top: 0,
      left: 0,
      right: 200,
      bottom: 100,
      width: 200,
      height: 100,
      toJSON() {
        return {};
      },
    });
    const input = new OneMoreSecondInput(root);
    input.setActive(true);
    dispatchPointer(root, 'pointerdown', { clientX: 20, pointerId: 1 });
    expect(input.sample('playing').steer).toBe(1);
    dispatchPointer(root, 'pointerup', { clientX: 20, pointerId: 1 });
    dispatchPointer(root, 'pointerdown', { clientX: 160, pointerId: 2 });
    expect(input.sample('playing').steer).toBe(-1);
    input.dispose();
  });
});
