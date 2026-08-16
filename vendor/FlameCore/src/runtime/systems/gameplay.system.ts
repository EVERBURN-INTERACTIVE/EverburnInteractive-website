import { SystemPriority } from '@shared/types';
import type { Runtime } from '../runtime';
import type { System } from './system';

/**
 * The Gameplay system delegates per-frame work to active scenes, which in
 * turn invoke `Component.onUpdate(dt)` on every attached component.
 */
export class GameplaySystem implements System {
  readonly name = 'GameplaySystem';
  readonly priority = SystemPriority.GAMEPLAY;

  private _runtime: Runtime | undefined;

  onRegister(runtime: Runtime): void {
    this._runtime = runtime;
  }

  onUnregister(): void {
    this._runtime = undefined;
  }

  onUpdate(dt: number): void {
    if (!this._runtime) return;
    for (const scene of this._runtime.activeScenes) {
      scene.update(dt);
    }
  }
}
