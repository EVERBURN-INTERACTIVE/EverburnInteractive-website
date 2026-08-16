import { SystemPriority } from '@shared/types';
import type { Runtime } from '../runtime';
import type { System } from './system';

/**
 * The UISystem owns the lifetime of the DOM overlay used by UI components.
 *
 * UI components are responsible for mounting/unmounting their own DOM
 * elements during `onSceneAttach`/`onSceneDetach`; the system primarily
 * exists to (a) ensure the overlay is created at runtime startup, (b)
 * keep it sized/aligned to the WebGL canvas, and (c) provide a place to
 * hook future global UI features (focus management, tab order, etc.).
 *
 * Priority: 45 — runs after Animation (40) so that animation-driven prop
 * mutations are reflected in DOM updates each frame, but before Rendering
 * (50) so the overlay is laid out before the next frame paints.
 */
export class UISystem implements System {
  readonly name = 'UISystem';
  readonly priority = SystemPriority.ANIMATION + 5;

  onRegister(runtime: Runtime): void {
    // Trigger overlay creation eagerly so it exists for the first scene.
    void runtime.context.uiOverlay;
  }

  onUnregister(): void {
    /* nothing to clean up */
  }

  onUpdate(_dt: number): void {
    // The overlay is positioned with CSS `position: absolute; inset: 0;`
    // so no per-frame layout work is required. Components themselves
    // re-apply styles in their `onPropsChanged` hooks.
  }
}
