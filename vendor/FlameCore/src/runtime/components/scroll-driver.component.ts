/**
 * Scroll driver component for scroll-linked animation.
 * @module @runtime/components/scroll-driver
 */

import type { ScrollDriverConfig } from '@shared/types/animation';
import { BaseComponent } from '../scene/component';
import { AnimationPlayerComponent } from './animation-player.component';

/** Factory for creating default scroll driver props. */
export function makeScrollDriverProps(
  patch: Partial<Omit<ScrollDriverConfig, '_version'>> & { _version?: 1 } = {},
): ScrollDriverConfig & { _version: 1 } {
  return {
    _version: 1,
    scrollStart: patch.scrollStart ?? 0,
    scrollEnd: patch.scrollEnd ?? 1000,
    clamp: patch.clamp ?? true,
  };
}

/**
 * ScrollDriverComponent binds an AnimationPlayerComponent's progress to
 * the page scroll position.
 * 
 * Attach this to the same actor as an AnimationPlayerComponent to enable
 * scroll-linked animation (scrollytelling).
 */
export class ScrollDriverComponent extends BaseComponent<ScrollDriverConfig & { _version: 1 }> {
  static readonly typeName = 'ScrollDriverComponent';

  private _player: AnimationPlayerComponent | undefined;

  onAttach(actor: Parameters<BaseComponent<ScrollDriverConfig & { _version: 1 }>['onAttach']>[0]): void {
    super.onAttach(actor);
    
    // Find the animation player on this actor
    this._player = actor.getComponent(AnimationPlayerComponent);
    if (!this._player) {
      console.warn('[ScrollDriverComponent] No AnimationPlayerComponent found on actor.');
    }
  }

  onUpdate(_dt: number): void {
    if (!this._player) return;

    // Read current scroll position
    const scrollY = typeof window !== 'undefined' ? window.scrollY : 0;

    // Normalize scroll to [0, 1] based on scrollStart/scrollEnd
    const { scrollStart, scrollEnd, clamp } = this._props;
    const range = scrollEnd - scrollStart;
    let progress = range > 0 ? (scrollY - scrollStart) / range : 0;

    // Clamp if enabled
    if (clamp) {
      progress = Math.max(0, Math.min(1, progress));
    }

    // Set the player's progress (which will update its time)
    this._player.progress = progress;

    // Ensure the player is paused (we're driving it manually)
    if (this._player.state === 'playing') {
      this._player.pause();
    }
  }

  /**
   * Set scroll range at runtime.
   */
  setScrollRange(start: number, end: number): void {
    this.setProps({
      ...this._props,
      scrollStart: start,
      scrollEnd: end,
    });
  }
}
