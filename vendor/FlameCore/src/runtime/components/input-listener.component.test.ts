import { describe, expect, it, beforeEach, vi } from 'vitest';
import { InputListenerComponent, makeInputListenerProps } from './input-listener.component';
import type { PointerEvent2D } from '../systems/input.system';
import { Actor } from '../scene/actor';

describe('InputListenerComponent', () => {
  let actor: Actor;
  let component: InputListenerComponent;

  beforeEach(() => {
    actor = new Actor('TestActor');
    component = new InputListenerComponent(makeInputListenerProps());
  });

  it('creates with default props', () => {
    const props = makeInputListenerProps();
    expect(props._version).toBe(1);
    expect(props.click).toBe(true);
    expect(props.hover).toBe(true);
    expect(props.drag).toBe(false);
    expect(props.usePhysicsCollider).toBe(false);
    expect(props.cursor).toBe('default');
  });

  it('accepts custom props', () => {
    const props = makeInputListenerProps({
      click: false,
      hover: false,
      drag: true,
      usePhysicsCollider: true,
      cursor: 'pointer',
    });
    expect(props.click).toBe(false);
    expect(props.hover).toBe(false);
    expect(props.drag).toBe(true);
    expect(props.usePhysicsCollider).toBe(true);
    expect(props.cursor).toBe('pointer');
  });

  it('attaches to an actor', () => {
    actor.addComponent(component);
    expect(component.actor).toBe(actor);
    expect(actor.getComponent(InputListenerComponent)).toBe(component);
  });

  it('serializes correctly', () => {
    const serialized = component.serialize();
    expect(serialized.type).toBe('InputListenerComponent');
    expect(serialized.props._version).toBe(1);
    expect(serialized.props.click).toBe(true);
  });

  it('dispatches click event when enabled', () => {
    const onClick = vi.fn();
    component.onClick = onClick;
    actor.addComponent(component);

    const event: PointerEvent2D = { ndcX: 0, ndcY: 0, button: 0, type: 'down' };
    component.dispatchClick(event);

    expect(onClick).toHaveBeenCalledWith(event);
  });

  it('does not dispatch click when disabled', () => {
    const onClick = vi.fn();
    component.onClick = onClick;
    component.setProps({ click: false });
    actor.addComponent(component);

    const event: PointerEvent2D = { ndcX: 0, ndcY: 0, button: 0, type: 'down' };
    component.dispatchClick(event);

    expect(onClick).not.toHaveBeenCalled();
  });

  it('dispatches hover start and pointer enter', () => {
    const onHoverStart = vi.fn();
    const onPointerEnter = vi.fn();
    component.onHoverStart = onHoverStart;
    component.onPointerEnter = onPointerEnter;
    actor.addComponent(component);

    component.dispatchHoverStart();

    expect(onHoverStart).toHaveBeenCalled();
    expect(onPointerEnter).toHaveBeenCalled();
  });

  it('dispatches hover end and pointer exit', () => {
    const onHoverEnd = vi.fn();
    const onPointerExit = vi.fn();
    component.onHoverEnd = onHoverEnd;
    component.onPointerExit = onPointerExit;
    actor.addComponent(component);

    component.dispatchHoverEnd();

    expect(onHoverEnd).toHaveBeenCalled();
    expect(onPointerExit).toHaveBeenCalled();
  });

  it('dispatches pointer down event', () => {
    const onPointerDown = vi.fn();
    component.onPointerDown = onPointerDown;
    actor.addComponent(component);

    const event: PointerEvent2D = { ndcX: 0, ndcY: 0, button: 0, type: 'down' };
    component.dispatchPointerDown(event);

    expect(onPointerDown).toHaveBeenCalledWith(event);
  });

  it('dispatches pointer up event', () => {
    const onPointerUp = vi.fn();
    component.onPointerUp = onPointerUp;
    actor.addComponent(component);

    const event: PointerEvent2D = { ndcX: 0, ndcY: 0, button: 0, type: 'up' };
    component.dispatchPointerUp(event);

    expect(onPointerUp).toHaveBeenCalledWith(event);
  });

  it('dispatches pointer move event when hover enabled', () => {
    const onPointerMove = vi.fn();
    component.onPointerMove = onPointerMove;
    component.setProps({ hover: true });
    actor.addComponent(component);

    const event: PointerEvent2D = { ndcX: 0.5, ndcY: 0.5, button: 0, type: 'move' };
    component.dispatchPointerMove(event);

    expect(onPointerMove).toHaveBeenCalledWith(event);
  });

  it('dispatches pointer move event when drag enabled', () => {
    const onPointerMove = vi.fn();
    component.onPointerMove = onPointerMove;
    component.setProps({ hover: false, drag: true });
    actor.addComponent(component);

    const event: PointerEvent2D = { ndcX: 0.5, ndcY: 0.5, button: 0, type: 'move' };
    component.dispatchPointerMove(event);

    expect(onPointerMove).toHaveBeenCalledWith(event);
  });

  it('dispatches drag event when enabled', () => {
    const onDrag = vi.fn();
    component.onDrag = onDrag;
    component.setProps({ drag: true });
    actor.addComponent(component);

    const event: PointerEvent2D = { ndcX: 0.2, ndcY: 0.3, button: 0, type: 'move' };
    component.dispatchDrag(event);

    expect(onDrag).toHaveBeenCalledWith(event);
  });

  it('does not dispatch drag when disabled', () => {
    const onDrag = vi.fn();
    component.onDrag = onDrag;
    component.setProps({ drag: false });
    actor.addComponent(component);

    const event: PointerEvent2D = { ndcX: 0.2, ndcY: 0.3, button: 0, type: 'move' };
    component.dispatchDrag(event);

    expect(onDrag).not.toHaveBeenCalled();
  });

  it('supports all cursor types', () => {
    const cursors: Array<'default' | 'pointer' | 'grab' | 'grabbing' | 'crosshair'> = [
      'default',
      'pointer',
      'grab',
      'grabbing',
      'crosshair',
    ];
    for (const cursor of cursors) {
      const props = makeInputListenerProps({ cursor });
      expect(props.cursor).toBe(cursor);
    }
  });
});
