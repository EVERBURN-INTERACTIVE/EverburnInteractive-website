import type { Runtime } from '../runtime';

/**
 * An engine system processes part of the world every frame. Systems are
 * registered with a numeric priority that determines their update order:
 * Input (10) → Gameplay (20) → Physics (30) → Animation (40) → Rendering (50).
 */
export interface System {
  /** Stable name used for diagnostics and lookup. */
  readonly name: string;
  /** Update priority; lower runs first. */
  readonly priority: number;
  /** Called once when the system is added to the runtime. */
  onRegister?(runtime: Runtime): void;
  /** Called once when the system is removed from the runtime. */
  onUnregister?(runtime: Runtime): void;
  /** Per-frame update. */
  onUpdate(dt: number): void;
}
