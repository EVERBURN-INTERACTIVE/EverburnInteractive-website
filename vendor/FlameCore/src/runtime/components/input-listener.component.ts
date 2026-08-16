import type { SerializedComponentProps } from '@shared/types';
import { BaseComponent } from '../scene/component';
import type { PointerEvent2D } from '../systems/input.system';

/** Payload delivered to `onPinch`. */
export interface PinchEvent {
  /** Current pinch scale (initial gesture = 1). */
  scale: number;
  /** Center point in NDC `[-1, 1]`. */
  centerNdcX: number;
  centerNdcY: number;
  /** Phase of the gesture. */
  phase: 'start' | 'move' | 'end';
}

/** Serialized input listener properties. */
export interface InputListenerProps extends SerializedComponentProps {
  readonly _version: 1;
  /** Enable the click event. */
  click: boolean;
  /** Enable hover-enter / hover-exit events. */
  hover: boolean;
  /** Enable drag (pointer-down → pointer-move) events. */
  drag: boolean;
  /** Use physics colliders for raycasting instead of mesh geometry. */
  usePhysicsCollider: boolean;
  /** Cursor style to apply when hovering over this actor. */
  cursor: 'default' | 'pointer' | 'grab' | 'grabbing' | 'crosshair';
}

/** Callback type registered on an InputListenerComponent. */
export type InputListenerCallback = (event: PointerEvent2D) => void;

/** Factory for default input listener props. */
export function makeInputListenerProps(
  patch: Partial<Omit<InputListenerProps, '_version'>> = {},
): InputListenerProps {
  return {
    _version: 1,
    click: patch.click ?? true,
    hover: patch.hover ?? true,
    drag: patch.drag ?? false,
    usePhysicsCollider: patch.usePhysicsCollider ?? false,
    cursor: patch.cursor ?? 'default',
  };
}

/**
 * Marks an actor as interactive. The {@link InputSystem} raycasts against
 * scene meshes and dispatches pointer events to actors that own one of these
 * components. User code subscribes via the `onClick`, `onHoverStart`, etc. setters.
 */
export class InputListenerComponent extends BaseComponent<InputListenerProps> {
  static readonly typeName = 'InputListenerComponent';

  /** Click handler set by user code. */
  onClick: InputListenerCallback | undefined;
  /** Hover-start handler (pointer enters the actor). */
  onHoverStart: (() => void) | undefined;
  /** Hover-end handler (pointer leaves the actor). */
  onHoverEnd: (() => void) | undefined;
  /** Pointer-enter handler (alias for onHoverStart). */
  onPointerEnter: (() => void) | undefined;
  /** Pointer-exit handler (alias for onHoverEnd). */
  onPointerExit: (() => void) | undefined;
  /** Pointer-down handler. */
  onPointerDown: InputListenerCallback | undefined;
  /** Pointer-move handler (only fires while pointer is over the actor). */
  onPointerMove: InputListenerCallback | undefined;
  /** Pointer-up handler. */
  onPointerUp: InputListenerCallback | undefined;
  /** Drag handler (pointer-down → pointer-move). */
  onDrag: InputListenerCallback | undefined;
  /** Two-finger pinch gesture handler (mobile / trackpad). */
  onPinch: ((event: PinchEvent) => void) | undefined;

  /** @internal Dispatched by InputSystem. */
  dispatchClick(event: PointerEvent2D): void {
    if (this._props.click) this.onClick?.(event);
  }

  /** @internal */
  dispatchHoverStart(): void {
    if (this._props.hover) {
      this.onHoverStart?.();
      this.onPointerEnter?.();
    }
  }

  /** @internal */
  dispatchHoverEnd(): void {
    if (this._props.hover) {
      this.onHoverEnd?.();
      this.onPointerExit?.();
    }
  }

  /** @internal */
  dispatchPointerDown(event: PointerEvent2D): void {
    this.onPointerDown?.(event);
  }

  /** @internal */
  dispatchPointerMove(event: PointerEvent2D): void {
    if (this._props.hover || this._props.drag) {
      this.onPointerMove?.(event);
    }
  }

  /** @internal */
  dispatchPointerUp(event: PointerEvent2D): void {
    this.onPointerUp?.(event);
  }

  /** @internal */
  dispatchDrag(event: PointerEvent2D): void {
    if (this._props.drag) {
      this.onDrag?.(event);
    }
  }

  /** @internal */
  dispatchPinch(event: PinchEvent): void {
    this.onPinch?.(event);
  }
}
