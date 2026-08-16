import { afterEach, describe, expect, it } from 'vitest';
import { Actor } from '../scene/actor';
import {
  ParallaxStoryComponent,
  makeParallaxStoryProps,
} from './parallax-story.component';

describe('ParallaxStoryComponent', () => {
  afterEach(() => {
    document.body.style.minHeight = '';
  });

  it('sets document.body min-height on attach', () => {
    const actor = new Actor();
    actor.addComponent(
      new ParallaxStoryComponent(makeParallaxStoryProps({ scrollHeightPx: 4000 })),
    );
    expect(document.body.style.minHeight).toBe('4000px');
  });

  it('restores previous min-height on detach', () => {
    document.body.style.minHeight = '500px';
    const actor = new Actor();
    const c = new ParallaxStoryComponent(makeParallaxStoryProps({ scrollHeightPx: 2000 }));
    actor.addComponent(c);
    expect(document.body.style.minHeight).toBe('2000px');
    actor.removeComponent(c);
    expect(document.body.style.minHeight).toBe('500px');
  });

  it('updates min-height when scrollHeightPx changes', () => {
    const actor = new Actor();
    const c = new ParallaxStoryComponent(makeParallaxStoryProps({ scrollHeightPx: 1000 }));
    actor.addComponent(c);
    c.setScrollHeight(7500);
    expect(document.body.style.minHeight).toBe('7500px');
  });

  it('does not touch the DOM when applyPageHeight is false', () => {
    document.body.style.minHeight = '123px';
    const actor = new Actor();
    actor.addComponent(
      new ParallaxStoryComponent(
        makeParallaxStoryProps({ scrollHeightPx: 9999, applyPageHeight: false }),
      ),
    );
    expect(document.body.style.minHeight).toBe('123px');
  });

  it('serializes with the correct version tag', () => {
    const c = new ParallaxStoryComponent(makeParallaxStoryProps());
    const s = c.serialize();
    expect(s.type).toBe('ParallaxStoryComponent');
    expect(s.props._version).toBe(1);
  });
});
