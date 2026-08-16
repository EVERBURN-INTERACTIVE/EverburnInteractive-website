import { describe, expect, it } from 'vitest';
import '@runtime/components'; // side-effect: register built-in component types
import {
  TransformComponent,
  getRegisteredComponentType,
  instantiateComponent,
  makeTransformProps,
  registeredComponentTypeNames,
} from '@runtime/index';

describe('component registry', () => {
  it('exposes all built-in types', () => {
    const names = registeredComponentTypeNames();
    for (const expected of [
      'TransformComponent',
      'MeshRendererComponent',
      'CameraComponent',
      'LightComponent',
      'EnvironmentComponent',
      'InputListenerComponent',
      'AnimationPlayerComponent',
    ]) {
      expect(names).toContain(expected);
    }
  });

  it('returns constructors by name', () => {
    expect(getRegisteredComponentType('TransformComponent')).toBe(TransformComponent);
  });

  it('instantiates components from serialized props', () => {
    const props = makeTransformProps({ position: [1, 2, 3] });
    const component = instantiateComponent('TransformComponent', props);
    expect(component).toBeInstanceOf(TransformComponent);
    expect(component.props).toMatchObject({ position: [1, 2, 3] });
  });

  it('throws for unknown component types', () => {
    expect(() => instantiateComponent('nonexistent', { _version: 1 })).toThrowError(
      /unknown type/i,
    );
  });
});
