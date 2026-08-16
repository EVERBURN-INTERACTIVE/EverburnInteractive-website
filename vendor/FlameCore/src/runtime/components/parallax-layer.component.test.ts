import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Actor } from '../scene/actor';
import { TransformComponent, makeTransformProps } from './transform.component';
import {
  ParallaxLayerComponent,
  makeParallaxLayerProps,
} from './parallax-layer.component';

function setScroll(y: number): void {
  Object.defineProperty(window, 'scrollY', { value: y, configurable: true });
}

function buildLayer(
  patch: Parameters<typeof makeParallaxLayerProps>[0] = {},
  basePos: [number, number, number] = [0, 0, 0],
): { actor: Actor; transform: TransformComponent; layer: ParallaxLayerComponent } {
  const actor = new Actor();
  const transform = new TransformComponent(makeTransformProps({ position: basePos }));
  actor.addComponent(transform);
  const layer = new ParallaxLayerComponent(makeParallaxLayerProps(patch));
  actor.addComponent(layer);
  return { actor, transform, layer };
}

describe('ParallaxLayerComponent', () => {
  beforeEach(() => setScroll(0));
  afterEach(() => vi.restoreAllMocks());

  it('uses the actor base position when scrollY is at scrollStart', () => {
    const { actor, layer } = buildLayer(
      { scrollStart: 0, scrollEnd: 1000, startOffset: [0, 0, 0], endOffset: [0, -10, 0] },
      [1, 2, 3],
    );
    setScroll(0);
    layer.onUpdate(1 / 60);
    expect(actor.object3D.position.toArray()).toEqual([1, 2, 3]);
  });

  it('linearly interpolates between startOffset and endOffset', () => {
    const { actor, layer } = buildLayer({
      scrollStart: 0,
      scrollEnd: 1000,
      startOffset: [0, 0, 0],
      endOffset: [0, -10, 0],
    });
    setScroll(500);
    layer.onUpdate(1 / 60);
    expect(actor.object3D.position.y).toBeCloseTo(-5);
  });

  it('clamps progress to [0..1] by default', () => {
    const { actor, layer } = buildLayer({
      scrollStart: 0,
      scrollEnd: 100,
      startOffset: [0, 0, 0],
      endOffset: [0, -10, 0],
    });
    setScroll(10_000);
    layer.onUpdate(1 / 60);
    expect(actor.object3D.position.y).toBeCloseTo(-10);
  });

  it('allows over-shoot when clamp = false', () => {
    const { actor, layer } = buildLayer({
      scrollStart: 0,
      scrollEnd: 100,
      startOffset: [0, 0, 0],
      endOffset: [0, -10, 0],
      clamp: false,
    });
    setScroll(200);
    layer.onUpdate(1 / 60);
    expect(actor.object3D.position.y).toBeCloseTo(-20);
  });

  it('depth multiplier scales the offset (negative = inverted)', () => {
    const { actor, layer } = buildLayer({
      scrollStart: 0,
      scrollEnd: 1000,
      startOffset: [0, 0, 0],
      endOffset: [0, -10, 0],
      depth: -0.5,
    });
    setScroll(1000);
    layer.onUpdate(1 / 60);
    expect(actor.object3D.position.y).toBeCloseTo(5);
  });

  it('axis lock restricts motion to a single axis', () => {
    const { actor, layer } = buildLayer({
      scrollStart: 0,
      scrollEnd: 1000,
      startOffset: [0, 0, 0],
      endOffset: [10, 10, 10],
      axis: 'y',
    });
    setScroll(1000);
    layer.onUpdate(1 / 60);
    expect(actor.object3D.position.toArray()).toEqual([0, 10, 0]);
  });

  it('tracks gizmo edits via TransformComponent.setProps', () => {
    const { actor, transform, layer } = buildLayer({
      scrollStart: 0,
      scrollEnd: 1000,
      startOffset: [0, 0, 0],
      endOffset: [0, -10, 0],
    });
    setScroll(500);
    layer.onUpdate(1 / 60);
    expect(actor.object3D.position.y).toBeCloseTo(-5);

    transform.setProps({ position: [1, 1, 1] });
    layer.onUpdate(1 / 60);
    expect(actor.object3D.position.x).toBeCloseTo(1);
    expect(actor.object3D.position.y).toBeCloseTo(1 - 5);
    expect(actor.object3D.position.z).toBeCloseTo(1);
  });

  it('serializes with the correct version tag', () => {
    const c = new ParallaxLayerComponent(makeParallaxLayerProps());
    const s = c.serialize();
    expect(s.type).toBe('ParallaxLayerComponent');
    expect(s.props._version).toBe(1);
  });
});
