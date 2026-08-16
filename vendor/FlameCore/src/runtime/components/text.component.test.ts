import { describe, expect, it } from 'vitest';
import { Actor } from '../scene/actor';
import { TransformComponent, makeTransformProps } from './transform.component';
import { TextComponent, makeTextProps } from './text.component';

describe('TextComponent', () => {
  it('makeTextProps returns versioned defaults', () => {
    const p = makeTextProps();
    expect(p._version).toBe(1);
    expect(p.text).toBeTypeOf('string');
    expect(p.fontSizePx).toBeGreaterThan(0);
    expect(p.color).toHaveLength(3);
    expect(p.revealProgress).toBe(1);
    expect(p.revealMode).toBe('all');
    expect(p.scrambleProgress).toBe(1);
    expect(p.waveAmplitude).toBe(0);
    expect(p.wavePhase).toBe(0);
    expect(p.waveFrequency).toBe(2);
  });

  it('accepts a patch override', () => {
    const p = makeTextProps({ text: 'Hello', fontSizePx: 32, billboard: true, align: 'center' });
    expect(p.text).toBe('Hello');
    expect(p.fontSizePx).toBe(32);
    expect(p.billboard).toBe(true);
    expect(p.align).toBe('center');
  });

  it('attaches to an actor and creates a mesh in DOM environments', () => {
    const actor = new Actor('A');
    actor.addComponent(new TransformComponent(makeTransformProps()));
    const c = new TextComponent(makeTextProps({ text: 'Hi' }));
    actor.addComponent(c);
    expect(c.mesh).toBeDefined();
    expect(c.mesh?.userData.actorId).toBe(actor.id);
  });

  it('setProps updates scramble and wave props without throwing', () => {
    const actor = new Actor('A');
    actor.addComponent(new TransformComponent(makeTransformProps()));
    const c = new TextComponent(makeTextProps());
    actor.addComponent(c);
    expect(() =>
      c.setProps({
        scrambleProgress: 0.5,
        waveAmplitude: 4,
        wavePhase: 1.2,
        waveFrequency: 3,
      }),
    ).not.toThrow();
    expect(c.props.scrambleProgress).toBe(0.5);
    expect(c.props.waveAmplitude).toBe(4);
  });

  it('makeTextProps accepts backgroundCornerRadiusPx', () => {
    const p = makeTextProps({
      backgroundColor: [0.1, 0.2, 0.3],
      backgroundCornerRadiusPx: 12,
    });
    expect(p.backgroundCornerRadiusPx).toBe(12);
  });

  it('setProps updates renderOrder without throwing', () => {
    const actor = new Actor('A');
    actor.addComponent(new TransformComponent(makeTransformProps()));
    const c = new TextComponent(makeTextProps());
    actor.addComponent(c);
    expect(() => c.setProps({ renderOrder: 5, opacity: 0.5 })).not.toThrow();
    expect(c.props.renderOrder).toBe(5);
    expect(c.props.opacity).toBe(0.5);
  });
});
