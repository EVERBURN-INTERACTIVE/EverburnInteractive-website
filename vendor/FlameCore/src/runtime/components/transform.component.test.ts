import { describe, expect, it } from 'vitest';
import { Actor, TransformComponent, makeTransformProps } from '../index';

describe('TransformComponent', () => {
  it('applies position/rotation/scale on attach', () => {
    const actor = new Actor();
    const t = new TransformComponent(
      makeTransformProps({ position: [1, 2, 3], rotation: [0.1, 0.2, 0.3], scale: [2, 2, 2] }),
    );
    actor.addComponent(t);
    const o = actor.object3D;
    expect(o.position.toArray()).toEqual([1, 2, 3]);
    expect(o.scale.toArray()).toEqual([2, 2, 2]);
    expect(o.rotation.x).toBeCloseTo(0.1);
    expect(o.rotation.y).toBeCloseTo(0.2);
    expect(o.rotation.z).toBeCloseTo(0.3);
  });

  it('setProps updates the actor transform live', () => {
    const actor = new Actor();
    const t = new TransformComponent(makeTransformProps());
    actor.addComponent(t);
    t.setPosition(5, 0, 0);
    expect(actor.object3D.position.x).toBe(5);
  });

  it('serializes with the correct version tag', () => {
    const t = new TransformComponent(makeTransformProps());
    const s = t.serialize();
    expect(s.type).toBe('TransformComponent');
    expect(s.props._version).toBe(1);
  });
});
