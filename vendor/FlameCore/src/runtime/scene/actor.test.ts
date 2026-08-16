import { describe, expect, it, vi } from 'vitest';
import { Actor, BaseComponent } from './index';
import type { SerializedComponentProps } from '@shared/types';

interface DummyProps extends SerializedComponentProps {
  readonly _version: 1;
  value: number;
}

class DummyComponent extends BaseComponent<DummyProps> {
  static readonly typeName = 'DummyComponent';
  attached = vi.fn();
  detached = vi.fn();
  updated = vi.fn();
  onAttach(actor: Actor): void {
    super.onAttach(actor);
    this.attached();
  }
  onDetach(): void {
    this.detached();
    super.onDetach();
  }
  onUpdate(dt: number): void {
    this.updated(dt);
  }
}

describe('Actor', () => {
  it('assigns a unique id on construction', () => {
    const a = new Actor('A');
    const b = new Actor('B');
    expect(a.id).not.toEqual(b.id);
    expect(a.id).toMatch(/^actor_/);
  });

  it('adds a component and calls onAttach', () => {
    const actor = new Actor();
    const c = new DummyComponent({ _version: 1, value: 0 });
    actor.addComponent(c);
    expect(c.attached).toHaveBeenCalledTimes(1);
    expect(actor.components).toHaveLength(1);
    expect(actor.getComponent(DummyComponent)).toBe(c);
  });

  it('removes a component and calls onDetach', () => {
    const actor = new Actor();
    const c = new DummyComponent({ _version: 1, value: 0 });
    actor.addComponent(c);
    expect(actor.removeComponent(c)).toBe(true);
    expect(c.detached).toHaveBeenCalledTimes(1);
    expect(actor.components).toHaveLength(0);
  });

  it('parent/child hierarchy attaches Three.js Object3D parents', () => {
    const parent = new Actor('Parent');
    const child = new Actor('Child');
    child.setParent(parent);
    expect(child.parent).toBe(parent);
    expect(parent.children).toContain(child);
    expect(child.object3D.parent).toBe(parent.object3D);
  });

  it('destroy detaches components and destroys children', () => {
    const parent = new Actor();
    const child = new Actor();
    child.setParent(parent);
    const c = new DummyComponent({ _version: 1, value: 0 });
    parent.addComponent(c);
    parent.destroy();
    expect(parent.isDestroyed).toBe(true);
    expect(child.isDestroyed).toBe(true);
    expect(c.detached).toHaveBeenCalledTimes(1);
  });

  it('serializes id, name, and components', () => {
    const actor = new Actor('Hero');
    actor.addComponent(new DummyComponent({ _version: 1, value: 42 }));
    const s = actor.serialize();
    expect(s.name).toBe('Hero');
    expect(s.components).toHaveLength(1);
    expect(s.components[0].props).toMatchObject({ value: 42, _version: 1 });
  });
});
