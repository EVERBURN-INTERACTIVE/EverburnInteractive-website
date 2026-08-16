import { describe, expect, it } from 'vitest';
import { Actor } from '../scene/actor';
import { ArticulationComponent, makeArticulationProps } from './articulation.component';
import { TransformComponent, makeTransformProps } from './transform.component';

describe('ArticulationComponent', () => {
  it('maps progress to hinge rotation on the transform', () => {
    const actor = new Actor('Lid');
    actor.addComponent(new TransformComponent(makeTransformProps()));
    const articulation = new ArticulationComponent(
      makeArticulationProps({
        progress: 0.5,
        axis: 'x',
        minAngleDeg: 0,
        maxAngleDeg: -90,
        restRotation: [0, 0, 0],
      }),
    );
    actor.addComponent(articulation);

    const transform = actor.getComponent(TransformComponent)!;
    const expected = (-90 * Math.PI) / 180 / 2;
    expect(transform.props.rotation[0]).toBeCloseTo(expected, 4);
  });
});
