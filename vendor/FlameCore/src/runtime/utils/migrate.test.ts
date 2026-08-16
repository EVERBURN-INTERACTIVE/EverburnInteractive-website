import { describe, expect, it } from 'vitest';
import { migrate } from './migrate';
import type { SerializedComponentProps } from '@shared/types';

interface V3 extends SerializedComponentProps {
  readonly _version: 3;
  speed: number;
  enabled: boolean;
}

describe('migrate', () => {
  it('runs migrations until target version is reached', () => {
    const result = migrate<V3>(
      { _version: 1, velocity: 5 },
      [
        (p) => ({ ...p, speed: p.velocity, velocity: undefined }), // v1 -> v2
        (p) => ({ ...p, enabled: true }), // v2 -> v3
      ],
      3,
    );
    expect(result._version).toBe(3);
    expect(result.speed).toBe(5);
    expect(result.enabled).toBe(true);
  });

  it('no-ops when already at target version', () => {
    const out = migrate<V3>({ _version: 3, speed: 1, enabled: false }, [], 3);
    expect(out).toEqual({ _version: 3, speed: 1, enabled: false });
  });

  it('throws when a migration is missing', () => {
    expect(() => migrate({ _version: 1 }, [], 3)).toThrow();
  });
});
