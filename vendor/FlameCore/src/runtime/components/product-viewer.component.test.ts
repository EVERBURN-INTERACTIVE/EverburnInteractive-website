import { describe, expect, it } from 'vitest';
import { Actor } from '../scene/actor';
import {
  ProductViewerComponent,
  makeProductViewerProps,
} from './product-viewer.component';

describe('ProductViewerComponent', () => {
  it('serializes with version 1', () => {
    const c = new ProductViewerComponent(makeProductViewerProps());
    const s = c.serialize();
    expect(s.type).toBe('ProductViewerComponent');
    expect(s.props._version).toBe(1);
    expect(s.props.lightingPreset).toBe('studio');
  });

  it('shows placeholder on attach without mesh asset', () => {
    const actor = new Actor();
    actor.addComponent(new ProductViewerComponent(makeProductViewerProps()));
    expect(actor.object3D.children.length).toBeGreaterThan(0);
  });
});
