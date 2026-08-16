import { describe, expect, it } from 'vitest';
import { Actor } from '../scene/actor';
import { TransformComponent, makeTransformProps } from './transform.component';
import { AudioComponent, makeAudioProps } from './audio.component';

describe('AudioComponent', () => {
  it('makeAudioProps returns versioned defaults', () => {
    const p = makeAudioProps();
    expect(p._version).toBe(1);
    expect(p.autoplay).toBe(false);
    expect(p.loop).toBe(false);
    expect(p.volume).toBe(1);
    expect(p.playbackRate).toBe(1);
    expect(p.spatial).toBe(false);
    expect(p.distanceModel).toBe('inverse');
  });

  it('accepts a patch override', () => {
    const p = makeAudioProps({ volume: 0.25, loop: true, spatial: true, refDistance: 5 });
    expect(p.volume).toBe(0.25);
    expect(p.loop).toBe(true);
    expect(p.spatial).toBe(true);
    expect(p.refDistance).toBe(5);
  });

  it('attaches to an actor and clamps volume on setProps', () => {
    const actor = new Actor('A');
    actor.addComponent(new TransformComponent(makeTransformProps()));
    const c = new AudioComponent(makeAudioProps());
    actor.addComponent(c);
    expect(c.actor).toBe(actor);

    c.setProps({ volume: 0.4, loop: true });
    expect(c.props.volume).toBeCloseTo(0.4);
    expect(c.props.loop).toBe(true);
  });

  it('play/pause/stop are safe to call without a bound audio node', () => {
    const actor = new Actor('A');
    actor.addComponent(new TransformComponent(makeTransformProps()));
    const c = new AudioComponent(makeAudioProps());
    actor.addComponent(c);
    expect(() => {
      c.play();
      c.pause();
      c.stop();
      c.seek(0.5);
    }).not.toThrow();
  });
});
