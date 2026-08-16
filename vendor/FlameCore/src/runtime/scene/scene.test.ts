import { describe, expect, it, vi } from 'vitest';
import { Actor, BaseComponent, Scene } from './index';
import type { SerializedComponentProps } from '@shared/types';

interface CounterProps extends SerializedComponentProps {
  readonly _version: 1;
}

class CounterComponent extends BaseComponent<CounterProps> {
  static readonly typeName = 'CounterComponent';
  updates = 0;
  onUpdate(_dt: number): void {
    this.updates += 1;
  }
}

describe('Scene', () => {
  it('runs init/enter/exit lifecycle hooks once', () => {
    const scene = new Scene('S');
    const init = vi.fn();
    const enter = vi.fn();
    const exit = vi.fn();
    scene.events.on('init', init);
    scene.events.on('enter', enter);
    scene.events.on('exit', exit);
    scene.init();
    scene.init();
    scene.enter();
    scene.enter();
    scene.exit();
    expect(init).toHaveBeenCalledTimes(1);
    expect(enter).toHaveBeenCalledTimes(1);
    expect(exit).toHaveBeenCalledTimes(1);
  });

  it('only updates components while active', () => {
    const scene = new Scene('S');
    const actor = new Actor();
    const counter = new CounterComponent({ _version: 1 });
    actor.addComponent(counter);
    scene.add(actor);
    scene.update(0.016);
    expect(counter.updates).toBe(0); // inactive
    scene.init();
    scene.enter();
    scene.update(0.016);
    scene.update(0.016);
    expect(counter.updates).toBe(2);
  });

  it('serialize round-trips name, id, and actor count', () => {
    const scene = new Scene('Demo');
    scene.add(new Actor('A'));
    scene.add(new Actor('B'));
    const s = scene.serialize();
    expect(s.name).toBe('Demo');
    expect(s.actors).toHaveLength(2);
    expect(s._version).toBe(1);
  });

  it('dispose destroys all actors', () => {
    const scene = new Scene('S');
    const a = new Actor();
    scene.add(a);
    scene.dispose();
    expect(a.isDestroyed).toBe(true);
    expect(scene.actors).toHaveLength(0);
  });
});
