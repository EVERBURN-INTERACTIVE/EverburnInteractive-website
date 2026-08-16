import { describe, expect, it } from 'vitest';
import { LODComponent, makeLODProps } from './lod.component';
import { Actor } from '../scene/actor';

describe('LODComponent', () => {
  it('has sensible defaults', () => {
    const props = makeLODProps();
    expect(props._version).toBe(1);
    expect(props.levels.length).toBe(3);
    expect(props.fadeMode).toBe('instant');
    expect(props.hysteresis).toBe(1);
  });

  it('exposes hysteresis and level count getters', () => {
    const comp = new LODComponent(makeLODProps({ hysteresis: 2.5 }));
    expect(comp.hysteresis).toBe(2.5);
    expect(comp.levelCount).toBe(3);
  });

  it('builds a root + per-level groups on attach', () => {
    const actor = new Actor('lod');
    const comp = new LODComponent(makeLODProps());
    actor.addComponent(comp);
    expect(comp.root).toBeDefined();
    expect(comp.root!.children.length).toBe(3);
    expect(comp.root!.children.every((c) => c.visible === false)).toBe(true);
  });

  it('switchToLevel toggles visibility', () => {
    const actor = new Actor('lod');
    const comp = new LODComponent(makeLODProps());
    actor.addComponent(comp);
    comp.switchToLevel(1, true);
    expect(comp.currentLevel).toBe(1);
    expect(comp.root!.children[1].visible).toBe(true);
    expect(comp.root!.children[0].visible).toBe(false);
  });

  it('clamps switchToLevel to the valid range', () => {
    const actor = new Actor('lod');
    const comp = new LODComponent(makeLODProps());
    actor.addComponent(comp);
    comp.switchToLevel(99, true);
    expect(comp.currentLevel).toBe(2);
  });

  it('setForcedLevel pins the current level', () => {
    const actor = new Actor('lod');
    const comp = new LODComponent(makeLODProps());
    actor.addComponent(comp);
    comp.setForcedLevel(2);
    expect(comp.forcedLevel).toBe(2);
    expect(comp.currentLevel).toBe(2);
    comp.setForcedLevel(-1);
    expect(comp.forcedLevel).toBe(-1);
  });

  it('serializes and rebuilds from props', () => {
    const actor = new Actor('lod');
    const comp = new LODComponent(makeLODProps({ hysteresis: 4 }));
    actor.addComponent(comp);
    const snap = comp.serialize();
    expect(snap.type).toBe('LODComponent');
    expect((snap.props as { hysteresis: number }).hysteresis).toBe(4);
  });

  it('getMaxDistance returns Infinity for the last level', () => {
    const comp = new LODComponent(
      makeLODProps({ levels: [{ maxDistance: 5 }, { maxDistance: 20 }] }),
    );
    expect(comp.getMaxDistance(0)).toBe(5);
    expect(comp.getMaxDistance(1)).toBe(20);
    expect(comp.getMaxDistance(99)).toBe(Infinity);
  });
});

