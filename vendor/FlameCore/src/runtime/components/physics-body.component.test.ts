import { describe, expect, it, beforeEach } from 'vitest';
import { PhysicsBodyComponent, makePhysicsBodyProps } from './physics-body.component';
import { Actor } from '../scene/actor';
import { TransformComponent, makeTransformProps } from './transform.component';

describe('PhysicsBodyComponent', () => {
  let actor: Actor;
  let component: PhysicsBodyComponent;

  beforeEach(() => {
    actor = new Actor('TestActor');
    actor.addComponent(new TransformComponent(makeTransformProps()));
    component = new PhysicsBodyComponent(makePhysicsBodyProps());
  });

  it('creates with default props', () => {
    const props = makePhysicsBodyProps();
    expect(props._version).toBe(1);
    expect(props.bodyType).toBe('dynamic');
    expect(props.shape).toBe('box');
    expect(props.mass).toBe(1);
    expect(props.friction).toBe(0.5);
    expect(props.restitution).toBe(0);
  });

  it('attaches to an actor', () => {
    actor.addComponent(component);
    expect(component.actor).toBe(actor);
    expect(actor.getComponent(PhysicsBodyComponent)).toBe(component);
  });

  it('accepts custom props', () => {
    const customProps = makePhysicsBodyProps({
      bodyType: 'static',
      shape: 'sphere',
      size: [2, 2, 2],
      mass: 10,
      friction: 0.8,
      restitution: 0.5,
      gravityScale: 0,
    });
    const custom = new PhysicsBodyComponent(customProps);
    expect(custom.props.bodyType).toBe('static');
    expect(custom.props.shape).toBe('sphere');
    expect(custom.props.size).toEqual([2, 2, 2]);
    expect(custom.props.mass).toBe(10);
    expect(custom.props.friction).toBe(0.8);
    expect(custom.props.restitution).toBe(0.5);
    expect(custom.props.gravityScale).toBe(0);
  });

  it('setProps updates properties', () => {
    actor.addComponent(component);
    component.setProps({ mass: 5, friction: 0.9 });
    expect(component.props.mass).toBe(5);
    expect(component.props.friction).toBe(0.9);
  });

  it('clears handles when props change', () => {
    actor.addComponent(component);
    component._bodyHandle = 42;
    component._colliderHandle = 43;
    component.setProps({ mass: 10 });
    expect(component._bodyHandle).toBeUndefined();
    expect(component._colliderHandle).toBeUndefined();
  });

  it('serializes correctly', () => {
    const serialized = component.serialize();
    expect(serialized.type).toBe('PhysicsBodyComponent');
    expect(serialized.props._version).toBe(1);
    expect(serialized.props.bodyType).toBe('dynamic');
    expect(serialized.props.shape).toBe('box');
  });

  it('supports all body types', () => {
    const staticProps = makePhysicsBodyProps({ bodyType: 'static' });
    expect(staticProps.bodyType).toBe('static');

    const dynamicProps = makePhysicsBodyProps({ bodyType: 'dynamic' });
    expect(dynamicProps.bodyType).toBe('dynamic');

    const kinematicProps = makePhysicsBodyProps({ bodyType: 'kinematic' });
    expect(kinematicProps.bodyType).toBe('kinematic');
  });

  it('supports all shape types', () => {
    const shapes: Array<'box' | 'sphere' | 'capsule' | 'cylinder' | 'plane'> = [
      'box',
      'sphere',
      'capsule',
      'cylinder',
      'plane',
    ];
    for (const shape of shapes) {
      const props = makePhysicsBodyProps({ shape });
      expect(props.shape).toBe(shape);
    }
  });

  it('supports rotation locks', () => {
    const props = makePhysicsBodyProps({
      lockRotationX: true,
      lockRotationY: false,
      lockRotationZ: true,
    });
    expect(props.lockRotationX).toBe(true);
    expect(props.lockRotationY).toBe(false);
    expect(props.lockRotationZ).toBe(true);
  });

  it('applyImpulse returns gracefully when no system', () => {
    actor.addComponent(component);
    expect(() => component.applyImpulse(1, 0, 0)).not.toThrow();
  });

  it('applyForce returns gracefully when no system', () => {
    actor.addComponent(component);
    expect(() => component.applyForce(1, 0, 0)).not.toThrow();
  });

  it('getLinearVelocity returns [0,0,0] when no system', () => {
    actor.addComponent(component);
    const vel = component.getLinearVelocity();
    expect(vel).toEqual([0, 0, 0]);
  });

  it('getAngularVelocity returns [0,0,0] when no system', () => {
    actor.addComponent(component);
    const vel = component.getAngularVelocity();
    expect(vel).toEqual([0, 0, 0]);
  });
});
