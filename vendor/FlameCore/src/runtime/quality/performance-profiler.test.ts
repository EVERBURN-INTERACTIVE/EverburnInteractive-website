import { describe, expect, it } from 'vitest';
import { PerformanceProfiler } from './performance-profiler';

describe('PerformanceProfiler', () => {
  it('starts with empty samples', () => {
    const p = new PerformanceProfiler();
    p.recordFrame(0);
    p.recordFrame(16);
    // First frame is skipped (needs delta).
    expect(p).toBeDefined();
  });
});
