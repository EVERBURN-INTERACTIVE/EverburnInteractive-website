import { describe, expect, it } from 'vitest';
import * as THREE from 'three';
import { Actor } from '../scene/actor';
import { TransformComponent, makeTransformProps } from './transform.component';
import { MeshRendererComponent, makeMeshRendererProps } from './mesh-renderer.component';

describe('MeshRendererComponent', () => {
  it('makeMeshRendererProps returns versioned defaults', () => {
    const p = makeMeshRendererProps();
    expect(p._version).toBe(1);
    expect(p.opacity).toBe(1);
    expect(p.emissiveIntensity).toBe(0);
    expect(p.wireframe).toBe(false);
    expect(p.glitchIntensity).toBe(0);
    expect(p.dissolveProgress).toBe(1);
  });

  it('attaches mesh and applies opacity props', () => {
    const actor = new Actor('Cube');
    actor.addComponent(new TransformComponent(makeTransformProps()));
    const mesh = new MeshRendererComponent(makeMeshRendererProps({ opacity: 0.5 }));
    actor.addComponent(mesh);
    expect(mesh.mesh).toBeDefined();
    mesh.setProps({ opacity: 0.25, emissiveIntensity: 2, wireframe: true });
    expect(mesh.props.opacity).toBe(0.25);
    expect(mesh.props.emissiveIntensity).toBe(2);
    expect(mesh.props.wireframe).toBe(true);
  });

  it('accepts glitch and dissolve effect props', () => {
    const actor = new Actor('Fx');
    actor.addComponent(new TransformComponent(makeTransformProps()));
    const mesh = new MeshRendererComponent(makeMeshRendererProps());
    actor.addComponent(mesh);
    expect(() => mesh.setProps({ glitchIntensity: 0.5, dissolveProgress: 0.8 })).not.toThrow();
    expect(mesh.props.glitchIntensity).toBe(0.5);
    expect(mesh.props.dissolveProgress).toBe(0.8);
  });

  it('rebuilds torus geometry when torusRadius / torusTube change', () => {
    const actor = new Actor('Ring');
    actor.addComponent(new TransformComponent(makeTransformProps()));
    const mesh = new MeshRendererComponent(
      makeMeshRendererProps({ shape: 'torus', torusRadius: 0.5, torusTube: 0.02 }),
    );
    actor.addComponent(mesh);
    const before = mesh.mesh?.geometry;
    expect(before).toBeDefined();
    mesh.setProps({ torusRadius: 0.82, torusTube: 0.03 });
    expect(mesh.props.torusRadius).toBeCloseTo(0.82);
    expect(mesh.props.torusTube).toBeCloseTo(0.03);
    expect(mesh.mesh?.geometry).toBeDefined();
    expect(mesh.mesh?.geometry).not.toBe(before);
  });

  it('passes radialSegments into cone geometry', () => {
    const actor = new Actor('Tree');
    actor.addComponent(new TransformComponent(makeTransformProps()));
    const mesh = new MeshRendererComponent(
      makeMeshRendererProps({ shape: 'cone', radialSegments: 6 }),
    );
    actor.addComponent(mesh);
    expect(mesh.props.radialSegments).toBe(6);
    expect(mesh.mesh?.geometry).toBeDefined();
  });

  it('uses separate emissive RGB when emissive prop is set', () => {
    const actor = new Actor('Glow');
    actor.addComponent(new TransformComponent(makeTransformProps()));
    const mesh = new MeshRendererComponent(
      makeMeshRendererProps({
        color: [0.2, 0.2, 0.2],
        emissive: [0, 1, 1],
        emissiveIntensity: 2,
      }),
    );
    actor.addComponent(mesh);
    const mat = mesh.mesh?.material;
    expect(mat).toBeInstanceOf(THREE.MeshStandardMaterial);
    const standard = mat as THREE.MeshStandardMaterial;
    expect(standard.emissive.r).toBeCloseTo(0, 5);
    expect(standard.emissive.g).toBeCloseTo(1, 5);
    expect(standard.emissive.b).toBeCloseTo(1, 5);
    expect(standard.emissiveIntensity).toBeCloseTo(2, 5);
  });

  it('defaults blending to normal MeshStandardMaterial', () => {
    const actor = new Actor('Solid');
    actor.addComponent(new TransformComponent(makeTransformProps()));
    const mesh = new MeshRendererComponent(makeMeshRendererProps());
    actor.addComponent(mesh);
    expect(mesh.props.blending).toBeUndefined();
    expect(mesh.mesh?.material).toBeInstanceOf(THREE.MeshStandardMaterial);
    const standard = mesh.mesh?.material as THREE.MeshStandardMaterial;
    expect(standard.blending).toBe(THREE.NormalBlending);
  });

  it('open-ended cone rebuilds hollow geometry', () => {
    const actor = new Actor('Beam');
    actor.addComponent(new TransformComponent(makeTransformProps()));
    const mesh = new MeshRendererComponent(
      makeMeshRendererProps({
        shape: 'cone',
        openEnded: true,
        blending: 'additive',
        opacity: 0.3,
      }),
    );
    actor.addComponent(mesh);
    expect(mesh.props.openEnded).toBe(true);
    const mat = mesh.mesh?.material as THREE.MeshBasicMaterial;
    expect(mat.side).toBe(THREE.DoubleSide);
  });
});
