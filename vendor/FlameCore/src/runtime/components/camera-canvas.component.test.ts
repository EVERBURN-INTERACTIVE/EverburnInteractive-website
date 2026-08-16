import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  Actor,
  CameraCanvasComponent,
  CameraComponent,
  TransformComponent,
  makeCameraCanvasProps,
  makeCameraProps,
  makeTransformProps,
} from '@runtime/index';

describe('CameraCanvasComponent', () => {
  let warnSpy = vi.spyOn(console, 'warn');

  beforeEach(() => {
    warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
  });
  afterEach(() => {
    warnSpy.mockRestore();
  });

  it('warns when attached to an actor without a CameraComponent', () => {
    const actor = new Actor('no-cam');
    actor.addComponent(new TransformComponent(makeTransformProps()));
    actor.addComponent(new CameraCanvasComponent(makeCameraCanvasProps()));
    expect(warnSpy).toHaveBeenCalled();
    const msg = String(warnSpy.mock.calls[0]?.[0] ?? '');
    expect(msg).toMatch(/CameraCanvasComponent/);
    expect(msg).toMatch(/CameraComponent/);
  });

  it('does not warn when the actor already has a CameraComponent', () => {
    const actor = new Actor('cam');
    actor.addComponent(new TransformComponent(makeTransformProps()));
    actor.addComponent(new CameraComponent(makeCameraProps()));
    actor.addComponent(new CameraCanvasComponent(makeCameraCanvasProps()));
    expect(warnSpy).not.toHaveBeenCalled();
  });

  it('reports its specialised typeName', () => {
    expect(CameraCanvasComponent.typeName).toBe('CameraCanvasComponent');
    const c = new CameraCanvasComponent(makeCameraCanvasProps());
    expect(c.type).toBe('CameraCanvasComponent');
  });

  it('produces sensible defaults from makeCameraCanvasProps', () => {
    const props = makeCameraCanvasProps();
    expect(props.screenAnchor).toBeDefined();
    expect(Array.isArray(props.screenOffsetPx)).toBe(true);
    expect(Array.isArray(props.screenSizePx)).toBe(true);
    expect(props.cameraDistance).toBeGreaterThan(0);
  });
});
