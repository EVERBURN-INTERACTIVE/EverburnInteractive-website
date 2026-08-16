import { describe, expect, it } from 'vitest';
import {
  ConfiguratorComponent,
  makeConfiguratorProps,
} from './configurator.component';

describe('ConfiguratorComponent', () => {
  it('serializes variants', () => {
    const c = new ConfiguratorComponent(
      makeConfiguratorProps({
        variants: [{ id: 'red', name: 'Red', slots: [{ slotName: 'body', color: [1, 0, 0] }] }],
      }),
    );
    const s = c.serialize();
    expect(s.props.variants).toHaveLength(1);
    expect(s.props._version).toBe(1);
  });
});
