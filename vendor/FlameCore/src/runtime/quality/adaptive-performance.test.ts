import { describe, expect, it, vi } from 'vitest';
import { QualityManager } from './quality-manager';
import { AdaptivePerformanceController } from './adaptive-performance';

describe('AdaptivePerformanceController', () => {
  it('downgrades quality after sustained low FPS', () => {
    const qm = new QualityManager({ initialPreset: 'high' });
    const onPhysics = vi.fn();
    const ap = new AdaptivePerformanceController(qm, {
      lowFpsThreshold: 30,
      downgradeAfterMs: 100,
      sampleWindow: 12,
      onPhysicsRateChange: onPhysics,
    });

    let t = 1000;
    for (let i = 0; i < 20; i++) {
      t += 50; // 20 FPS
      ap.recordFrame(t, 0.05);
    }
    expect(qm.preset).toBe('medium');
    expect(onPhysics).toHaveBeenCalled();
  });

  it('does nothing while disabled', () => {
    const qm = new QualityManager({ initialPreset: 'high' });
    const ap = new AdaptivePerformanceController(qm, {
      lowFpsThreshold: 30,
      downgradeAfterMs: 50,
      sampleWindow: 10,
    });
    ap.enabled = false;
    let t = 0;
    for (let i = 0; i < 20; i++) {
      t += 50;
      ap.recordFrame(t, 0.05);
    }
    expect(qm.preset).toBe('high');
  });
});
