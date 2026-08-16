/**
 * Parallax story component — page-level coordinator for the Simple Parallax
 * authoring path.
 *
 * Responsibilities:
 *  - Ensure the host page is tall enough to scroll the full story.
 *  - Provide a single, discoverable anchor in the hierarchy so users have
 *    one place to set "how long is my scroll page".
 *
 * The component does not own layers or sections; those are regular actors
 * elsewhere in the scene with {@link ParallaxLayerComponent} attached.
 *
 * @module @runtime/components/parallax-story
 */

import type { ParallaxStoryProps } from '@shared/types/parallax';
import { BaseComponent } from '../scene/component';
import type { Actor } from '../scene/actor';

/** Factory for default parallax story props. */
export function makeParallaxStoryProps(
  patch: Partial<Omit<ParallaxStoryProps, '_version'>> = {},
): ParallaxStoryProps {
  return {
    _version: 1,
    scrollHeightPx: patch.scrollHeightPx ?? 3000,
    applyPageHeight: patch.applyPageHeight ?? true,
  };
}

/**
 * Owns the page-scroll height for a parallax story.
 *
 * On attach (or whenever `scrollHeightPx` / `applyPageHeight` changes), the
 * component writes a `min-height` style to `document.body` so the user can
 * actually scroll. The previous value is captured and restored on detach so
 * the editor's host page does not stay stretched after a parallax scene is
 * unloaded.
 */
export class ParallaxStoryComponent extends BaseComponent<ParallaxStoryProps> {
  static readonly typeName = 'ParallaxStoryComponent';

  /** Body min-height captured on attach so we can restore it on detach. */
  private _previousMinHeight: string | undefined;
  /** True once we have applied a min-height (controls whether to restore). */
  private _appliedHeight = false;

  onAttach(actor: Actor): void {
    super.onAttach(actor);
    this._applyPageHeight();
  }

  onDetach(): void {
    this._restorePageHeight();
    super.onDetach();
  }

  protected onPropsChanged(): void {
    this._applyPageHeight();
  }

  /**
   * Convenience setter used by editor presets ("Cinematic = 5000px",
   * "Short story = 2000px", etc.).
   */
  setScrollHeight(px: number): void {
    this.setProps({ scrollHeightPx: Math.max(0, px) });
  }

  private _applyPageHeight(): void {
    const body = readBody();
    if (!body) return;
    const { applyPageHeight, scrollHeightPx } = this._props;
    if (!applyPageHeight || scrollHeightPx <= 0) {
      this._restorePageHeight();
      return;
    }
    if (!this._appliedHeight) {
      this._previousMinHeight = body.style.minHeight;
      this._appliedHeight = true;
    }
    body.style.minHeight = `${Math.round(scrollHeightPx)}px`;
  }

  private _restorePageHeight(): void {
    if (!this._appliedHeight) return;
    const body = readBody();
    if (body) body.style.minHeight = this._previousMinHeight ?? '';
    this._appliedHeight = false;
    this._previousMinHeight = undefined;
  }
}

function readBody(): HTMLElement | undefined {
  if (typeof document === 'undefined' || !document.body) return undefined;
  return document.body;
}
