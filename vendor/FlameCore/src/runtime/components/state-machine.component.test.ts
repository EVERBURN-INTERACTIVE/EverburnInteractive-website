import { describe, expect, it } from 'vitest';
import { Actor, Scene } from '../scene';
import { StateMachineComponent, makeStateMachineProps } from './state-machine.component';
import { TransformComponent, makeTransformProps } from './transform.component';

describe('StateMachineComponent triggers', () => {
  it('fires timer transitions after elapsed time', () => {
    const a = { id: 's0', name: 'A' };
    const b = { id: 's1', name: 'B' };
    const sm = new StateMachineComponent(
      makeStateMachineProps({
        states: [a, b],
        initialStateId: a.id,
        transitions: [
          {
            fromStateId: a.id,
            toStateId: b.id,
            duration: 0,
            trigger: { type: 'timer', timerDuration: 0.5 },
          },
        ],
      }),
    );
    const scene = new Scene('t');
    const actor = new Actor('x');
    actor.addComponent(new TransformComponent(makeTransformProps()));
    actor.addComponent(sm);
    scene.add(actor);

    expect(sm.currentStateId).toBe(a.id);
    sm.onUpdate(0.4);
    expect(sm.currentStateId).toBe(a.id);
    sm.onUpdate(0.2);
    expect(sm.currentStateId).toBe(b.id);
  });

  it('fires scroll transitions when scrollY is in range', () => {
    const a = { id: 's0', name: 'A' };
    const b = { id: 's1', name: 'B' };
    const sm = new StateMachineComponent(
      makeStateMachineProps({
        states: [a, b],
        initialStateId: a.id,
        transitions: [
          {
            fromStateId: a.id,
            toStateId: b.id,
            duration: 0,
            trigger: { type: 'scroll', scrollRange: [100, 200] },
          },
        ],
      }),
    );
    const scene = new Scene('t');
    const actor = new Actor('x');
    actor.addComponent(new TransformComponent(makeTransformProps()));
    actor.addComponent(sm);
    scene.add(actor);

    Object.defineProperty(window, 'scrollY', { configurable: true, value: 50 });
    sm.onUpdate(0.016);
    expect(sm.currentStateId).toBe(a.id);

    Object.defineProperty(window, 'scrollY', { configurable: true, value: 150 });
    sm.onUpdate(0.016);
    expect(sm.currentStateId).toBe(b.id);
  });
});
