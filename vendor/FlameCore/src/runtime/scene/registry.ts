import type { SerializedComponentProps } from '@shared/types';
import type { Component, ComponentConstructor } from './component';

/**
 * Process-wide registry mapping a component `typeName` to its constructor.
 *
 * Components register themselves via {@link registerComponentType} (typically
 * from their defining module). The editor and project loader use the
 * registry to recreate components from serialized data without hard-coding
 * each component type.
 */
const REGISTRY = new Map<string, ComponentConstructor<Component<SerializedComponentProps>>>();

/**
 * Register a component constructor under its static `typeName`.
 * Re-registration with the same constructor is a no-op; conflicts throw.
 */
export function registerComponentType<TC extends Component<TProps>, TProps extends SerializedComponentProps>(
  ctor: ComponentConstructor<TC, TProps>,
): void {
  const existing = REGISTRY.get(ctor.typeName);
  if (existing && existing !== (ctor as unknown as ComponentConstructor<Component<SerializedComponentProps>>)) {
    throw new Error(
      `Component type "${ctor.typeName}" is already registered to a different constructor.`,
    );
  }
  REGISTRY.set(
    ctor.typeName,
    ctor as unknown as ComponentConstructor<Component<SerializedComponentProps>>,
  );
}

/**
 * Look up a previously-registered component constructor by its `typeName`.
 * Returns `undefined` when the type is unknown.
 */
export function getRegisteredComponentType(
  typeName: string,
): ComponentConstructor<Component<SerializedComponentProps>> | undefined {
  return REGISTRY.get(typeName);
}

/** Read-only iterable of every registered component type name. */
export function registeredComponentTypeNames(): ReadonlyArray<string> {
  return [...REGISTRY.keys()];
}

/**
 * Instantiate a component from its serialized form. Throws if the
 * component's `type` was never registered (a project may reference a
 * component that has since been removed from the build).
 */
export function instantiateComponent(
  type: string,
  props: SerializedComponentProps,
): Component<SerializedComponentProps> {
  const ctor = REGISTRY.get(type);
  if (!ctor) {
    throw new Error(`Cannot instantiate component: unknown type "${type}".`);
  }
  return new ctor(props);
}

/** @internal Test helper — clear the registry. Do not call from production code. */
export function _clearComponentRegistryForTests(): void {
  REGISTRY.clear();
}
