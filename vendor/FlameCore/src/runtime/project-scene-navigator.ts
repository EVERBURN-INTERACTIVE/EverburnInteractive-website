/**
 * Top-level project scene switching for exported sites and play mode.
 *
 * Unlike {@link SceneInstanceComponent} (nested overlays), this replaces the
 * active non-nested scene with another {@link SerializedScene} from the
 * project table resolved via {@link Runtime.sceneResolver}.
 *
 * @module @runtime/project-scene-navigator
 */

import type { Scene } from './scene/scene';
import { deserializeScene } from './scene/deserialize';
import type { Runtime } from './runtime';

/** Transition style when switching project scenes. */
export type SceneSwitchTransition = 'cut' | 'fade';

/** Options for {@link switchProjectScene}. */
export interface SwitchProjectSceneOptions {
  /** Visual transition. Default `cut`. */
  readonly transition?: SceneSwitchTransition;
  /** Fade duration in seconds when `transition === 'fade'`. Default `0.35`. */
  readonly fadeDuration?: number;
}

/**
 * Replace every active non-nested scene with the project scene identified by
 * `sceneId`. Nested sub-scenes are disposed with their hosts.
 *
 * Requires {@link Runtime.sceneResolver} to return the serialized scene.
 */
export async function switchProjectScene(
  runtime: Runtime,
  sceneId: string,
  options: SwitchProjectSceneOptions = {},
): Promise<Scene> {
  const resolver = runtime.sceneResolver;
  if (!resolver) {
    throw new Error('switchProjectScene: Runtime.sceneResolver is not set.');
  }
  const data = resolver(sceneId);
  if (!data) {
    throw new Error(`switchProjectScene: unknown scene id "${sceneId}".`);
  }

  const transition = options.transition ?? 'cut';
  const fadeDuration = Math.max(0.05, options.fadeDuration ?? 0.35);

  if (transition === 'fade') {
    await runFadeOverlay(fadeDuration, 'out');
  }

  const toDispose = [...runtime.activeScenes].filter((s) => !s.nested);
  for (const scene of toDispose) {
    runtime.unloadScene(scene);
    scene.dispose();
  }

  const next = deserializeScene(data);
  runtime.loadScene(next);

  if (transition === 'fade') {
    await runFadeOverlay(fadeDuration, 'in');
  }

  runtime.events.emit('projectSceneSwitched', { scene: next, sceneId });
  return next;
}

const OVERLAY_ID = 'flamecore-scene-fade';

function runFadeOverlay(durationSec: number, direction: 'in' | 'out'): Promise<void> {
  if (typeof document === 'undefined') return Promise.resolve();

  let el = document.getElementById(OVERLAY_ID) as HTMLDivElement | null;
  if (!el) {
    el = document.createElement('div');
    el.id = OVERLAY_ID;
    el.setAttribute('aria-hidden', 'true');
    Object.assign(el.style, {
      position: 'fixed',
      inset: '0',
      background: '#000',
      pointerEvents: 'none',
      zIndex: '99999',
      opacity: direction === 'out' ? '0' : '1',
      transition: `opacity ${durationSec}s ease`,
    });
    document.body.appendChild(el);
  } else {
    el.style.transition = `opacity ${durationSec}s ease`;
  }

  // Force style flush so the transition runs.
  void el.offsetWidth;
  el.style.opacity = direction === 'out' ? '1' : '0';

  return new Promise((resolve) => {
    window.setTimeout(() => {
      if (direction === 'in' && el?.parentElement) {
        el.remove();
      }
      resolve();
    }, durationSec * 1000 + 16);
  });
}
