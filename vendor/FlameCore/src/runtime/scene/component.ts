import type { SerializedComponentProps } from '@shared/types';
import type { Actor } from './actor';

/**
 * Public interface every component must implement. Components are owned by
 * exactly one Actor and may be attached/detached during the actor's lifetime.
 *
 * The generic parameter `TProps` is the serialized property bag for the
 * component; it must extend {@link SerializedComponentProps}.
 */
export interface Component<TProps extends SerializedComponentProps = SerializedComponentProps> {
  /** Static type tag used for serialization and component lookup. */
  readonly type: string;
  /** The current property bag. Treat as immutable; use `setProps` to update. */
  readonly props: TProps;
  /** The actor that currently owns this component (undefined before attach). */
  readonly actor: Actor | undefined;

  /** Called when the component is attached to an actor in an active scene. */
  onAttach(actor: Actor): void;
  /** Called when the component is detached or its owning actor is destroyed. */
  onDetach(): void;
  /** Called when the owning actor is added to a scene (after `onAttach`). */
  onSceneAttach(scene: import('./scene').Scene): void;
  /** Called when the owning actor is removed from a scene. */
  onSceneDetach(scene: import('./scene').Scene): void;
  /** Called every frame during the gameplay update phase. */
  onUpdate(dt: number): void;
  /** Called when the runtime dispatches a custom event to this component. */
  onEvent(event: ComponentEvent): void;

  /** Replace or patch the component's serialized props. */
  setProps(patch: Partial<TProps>): void;
  /** Return a JSON-safe copy of the component for project serialization. */
  serialize(): SerializedComponent<TProps>;
}

/** Payload dispatched to a component via `Component.onEvent`. */
export interface ComponentEvent<T = unknown> {
  readonly name: string;
  readonly payload: T;
}

/** Constructor signature used to create components from their props. */
export interface ComponentConstructor<
  TComponent extends Component<TProps>,
  TProps extends SerializedComponentProps = SerializedComponentProps,
> {
  readonly typeName: string;
  new (props: TProps): TComponent;
}

/** JSON shape produced by `Component.serialize`. */
export interface SerializedComponent<TProps extends SerializedComponentProps = SerializedComponentProps> {
  readonly type: string;
  readonly props: TProps;
}

/**
 * Abstract helper that implements the common boilerplate of {@link Component}.
 * Concrete components extend this class and override the lifecycle hooks they
 * need. The static `typeName` of the concrete class is used as the runtime tag.
 */
export abstract class BaseComponent<TProps extends SerializedComponentProps>
  implements Component<TProps>
{
  static readonly typeName: string = 'BaseComponent';

  protected _props: TProps;
  protected _actor: Actor | undefined;
  protected readonly _disposables: Array<{ dispose(): void }> = [];

  constructor(props: TProps) {
    this._props = props;
  }

  get type(): string {
    return (this.constructor as unknown as { typeName: string }).typeName;
  }

  get props(): TProps {
    return this._props;
  }

  get actor(): Actor | undefined {
    return this._actor;
  }

  onAttach(actor: Actor): void {
    this._actor = actor;
  }

  onDetach(): void {
    for (const d of this._disposables) d.dispose();
    this._disposables.length = 0;
    this._actor = undefined;
  }

  // Default no-op hooks; subclasses override as needed.
  onUpdate(_dt: number): void {
    /* override in subclass */
  }

  onSceneAttach(_scene: import('./scene').Scene): void {
    /* override in subclass */
  }

  onSceneDetach(_scene: import('./scene').Scene): void {
    /* override in subclass */
  }

  onEvent(_event: ComponentEvent): void {
    /* override in subclass */
  }

  setProps(patch: Partial<TProps>): void {
    this._props = { ...this._props, ...patch };
    this.onPropsChanged();
  }

  /** Hook for subclasses to react to prop updates (e.g., refresh Three.js objects). */
  protected onPropsChanged(): void {
    /* override in subclass */
  }

  serialize(): SerializedComponent<TProps> {
    return { type: this.type, props: this._props };
  }
}
