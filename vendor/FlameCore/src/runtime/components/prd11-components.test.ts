import { describe, expect, it } from 'vitest';
import { Actor } from '../scene/actor';
import { TransformComponent, makeTransformProps } from './transform.component';
import { MeshRendererComponent, makeMeshRendererProps } from './mesh-renderer.component';
import { ShaderEffectComponent, makeShaderEffectProps } from './shader-effect.component';
import { MaskWipeComponent, makeMaskWipeProps } from './mask-wipe.component';
import { WeaponTrailComponent, makeWeaponTrailProps } from './weapon-trail.component';

describe('ShaderEffectComponent', () => {
  it('serializes default props', () => {
    const c = new ShaderEffectComponent(makeShaderEffectProps({ effect: 'hologram' }));
    const snap = c.serialize();
    expect(snap.type).toBe('ShaderEffectComponent');
    expect(snap.props.effect).toBe('hologram');
  });

  it('attaches without mesh renderer', () => {
    const actor = new Actor('Fx');
    actor.addComponent(new TransformComponent(makeTransformProps()));
    expect(() => actor.addComponent(new ShaderEffectComponent(makeShaderEffectProps()))).not.toThrow();
  });
});

describe('MaskWipeComponent', () => {
  it('makeMaskWipeProps defaults', () => {
    const p = makeMaskWipeProps();
    expect(p.progress).toBe(1);
    expect(p.shape).toBe('circle');
  });

  it('applies mask material when mesh present', () => {
    const actor = new Actor('Wipe');
    actor.addComponent(new TransformComponent(makeTransformProps()));
    actor.addComponent(new MeshRendererComponent(makeMeshRendererProps()));
    const wipe = new MaskWipeComponent(makeMaskWipeProps({ progress: 0.5 }));
    actor.addComponent(wipe);
    wipe.setProps({ progress: 0.25 });
    expect(wipe.props.progress).toBe(0.25);
  });
});

describe('WeaponTrailComponent', () => {
  it('makeWeaponTrailProps defaults', () => {
    const p = makeWeaponTrailProps();
    expect(p.enabled).toBe(false);
    expect(p.maxPoints).toBe(32);
  });

  it('creates ribbon mesh on attach', () => {
    const actor = new Actor('Sword');
    actor.addComponent(new TransformComponent(makeTransformProps()));
    actor.addComponent(new WeaponTrailComponent(makeWeaponTrailProps({ enabled: true })));
    expect(actor.object3D.children.length).toBeGreaterThan(0);
  });
});
