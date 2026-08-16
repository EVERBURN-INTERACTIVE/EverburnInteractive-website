import { describe, expect, it } from 'vitest';
import { ParticleBuffer } from './buffer';
import { getParticleModule, PARTICLE_MODULES, type ModuleContext } from './modules';

function makeCtx(overrides: Partial<ModuleContext> = {}): ModuleContext {
  return {
    random: () => 0.5,
    gravity: [0, -10, 0],
    globals: new Map(),
    ...overrides,
  };
}

describe('particle modules', () => {
  it('registry exposes known modules and getParticleModule resolves them', () => {
    expect(getParticleModule('VelocityIntegration')).toBe(
      PARTICLE_MODULES.VelocityIntegration,
    );
    expect(getParticleModule('does-not-exist')).toBeUndefined();
  });

  it('InitSizeRandomBetween writes size within range', () => {
    const buf = new ParticleBuffer(1);
    const i = buf.spawn();
    PARTICLE_MODULES.InitSizeRandomBetween.init!(buf, i, { min: 0.2, max: 0.6 }, makeCtx());
    expect(buf.size[i]).toBeCloseTo(0.4); // min + 0.5 * (max-min)
  });

  it('InitColorRandomBetween interpolates and captures start color', () => {
    const buf = new ParticleBuffer(1);
    const i = buf.spawn();
    PARTICLE_MODULES.InitColorRandomBetween.init!(
      buf,
      i,
      { colorA: [0, 0, 0, 1], colorB: [1, 1, 1, 1] },
      makeCtx(),
    );
    expect(buf.r[i]).toBeCloseTo(0.5);
    expect(buf.startR[i]).toBeCloseTo(0.5);
  });

  it('VelocityIntegration advances position by velocity * dt', () => {
    const buf = new ParticleBuffer(1);
    const i = buf.spawn();
    buf.velX[i] = 2;
    PARTICLE_MODULES.VelocityIntegration.update!(buf, i, 0.5, {}, makeCtx());
    expect(buf.posX[i]).toBeCloseTo(1);
  });

  it('ApplyGravity adds gravity to velocity over time', () => {
    const buf = new ParticleBuffer(1);
    const i = buf.spawn();
    PARTICLE_MODULES.ApplyGravity.update!(buf, i, 1, { scale: 1 }, makeCtx());
    expect(buf.velY[i]).toBeCloseTo(-10);
  });

  it('Turbulence nudges velocity with coherent age-based drift', () => {
    const buf = new ParticleBuffer(1);
    const i = buf.spawn();
    buf.age[i] = 1.25;
    PARTICLE_MODULES.Turbulence.update!(
      buf,
      i,
      0.5,
      { strength: 1, frequency: 1, verticalScale: 0.5 },
      makeCtx(),
    );
    const moved = Math.abs(buf.velX[i]) + Math.abs(buf.velY[i]) + Math.abs(buf.velZ[i]);
    expect(moved).toBeGreaterThan(0);
  });

  it('ColorOverLife samples the gradient at age/life', () => {
    const buf = new ParticleBuffer(1);
    const i = buf.spawn();
    buf.age[i] = 0.5;
    buf.life[i] = 1;
    PARTICLE_MODULES.ColorOverLife.update!(
      buf,
      i,
      0,
      {
        stops: [
          { t: 0, rgba: [1, 0, 0, 1] },
          { t: 1, rgba: [0, 0, 1, 0] },
        ],
      },
      makeCtx(),
    );
    expect(buf.r[i]).toBeCloseTo(0.5);
    expect(buf.b[i]).toBeCloseTo(0.5);
    expect(buf.a[i]).toBeCloseTo(0.5);
  });

  it('SizeOverLife multiplies start size by the curve value', () => {
    const buf = new ParticleBuffer(1);
    const i = buf.spawn();
    buf.startSize[i] = 4;
    buf.age[i] = 1;
    buf.life[i] = 1;
    PARTICLE_MODULES.SizeOverLife.update!(
      buf,
      i,
      0,
      {
        stops: [
          { t: 0, value: 1 },
          { t: 1, value: 0.25 },
        ],
      },
      makeCtx(),
    );
    expect(buf.size[i]).toBeCloseTo(1); // 4 * 0.25
  });
});
