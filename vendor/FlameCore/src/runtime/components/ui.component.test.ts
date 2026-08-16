import { describe, expect, it } from 'vitest';
import { Actor } from '../scene/actor';
import { TransformComponent, makeTransformProps } from './transform.component';
import {
  UIButtonComponent,
  UIImageComponent,
  UILabelComponent,
  UIPanelComponent,
  UIRootComponent,
  makeUIButtonProps,
  makeUIImageProps,
  makeUILabelProps,
  makeUIPanelProps,
  makeUIRootProps,
} from './ui.component';

describe('UI components', () => {
  it('factory functions return versioned defaults', () => {
    expect(makeUIRootProps()._version).toBe(1);
    expect(makeUIPanelProps()._version).toBe(1);
    expect(makeUILabelProps()._version).toBe(1);
    expect(makeUIButtonProps()._version).toBe(1);
    expect(makeUIImageProps()._version).toBe(1);
  });

  it('common defaults match the spec', () => {
    const p = makeUIPanelProps();
    expect(p.anchor).toBeDefined();
    expect(p.offset).toHaveLength(2);
    expect(p.visible).toBe(true);
    expect(p.opacity).toBe(1);
    expect(p.pointerEvents).toBe('auto');
  });

  it('UILabel accepts a text override', () => {
    const p = makeUILabelProps({ text: 'Welcome', color: '#ff8800' });
    expect(p.text).toBe('Welcome');
    expect(p.color).toBe('#ff8800');
  });

  it('UIButton has an event name and default disabled = false', () => {
    const p = makeUIButtonProps({ text: 'Go', eventName: 'go' });
    expect(p.text).toBe('Go');
    expect(p.eventName).toBe('go');
    expect(p.disabled).toBe(false);
  });

  it('UIImage accepts asset id and fit override', () => {
    const p = makeUIImageProps({ imageAssetId: 'abc' as never, fit: 'contain' });
    expect(p.imageAssetId).toBe('abc');
    expect(p.fit).toBe('contain');
  });

  it('attaches to an actor without throwing (no scene)', () => {
    const actor = new Actor('UI');
    actor.addComponent(new TransformComponent(makeTransformProps()));
    expect(() => {
      actor.addComponent(new UIRootComponent(makeUIRootProps()));
      actor.addComponent(new UIPanelComponent(makeUIPanelProps()));
      actor.addComponent(new UILabelComponent(makeUILabelProps()));
      actor.addComponent(new UIButtonComponent(makeUIButtonProps()));
      actor.addComponent(new UIImageComponent(makeUIImageProps()));
    }).not.toThrow();
  });
});
