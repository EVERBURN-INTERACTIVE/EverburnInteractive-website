/**
 * Serialized types for the FlameCore "Simple Parallax" authoring layer.
 *
 * The parallax system is intentionally a thin, opinionated wrapper around
 * the existing runtime: a layer reads page scroll, normalizes it to a
 * `[0..1]` progress over a configurable scroll range, and adds a
 * Vec3 offset to its actor on top of whatever its `TransformComponent`
 * already holds. No animation clip, track, or driver is required.
 *
 * @module @shared/types/parallax
 */

import type { SerializedComponentProps, Vec3 } from '../types';

/**
 * Axis (or set of axes) that a parallax layer is allowed to move on.
 *
 * - `'x'` / `'y'` / `'z'` restrict motion to that single axis. The other
 *   axes report zero offset, which is the common case for purely vertical
 *   page scrolls (`'y'`) or depth-pushes (`'z'`).
 * - `'all'` applies the full Vec3 offset on every axis.
 */
export type ParallaxAxis = 'x' | 'y' | 'z' | 'all';

/**
 * Serialized properties for {@link ParallaxLayerComponent}.
 *
 * Authoring model: the user picks two world-space offsets — `startOffset`
 * (where the layer sits at `scrollStart` pixels) and `endOffset` (where it
 * sits at `scrollEnd` pixels) — plus an optional `depth` multiplier and
 * axis lock. The runtime linearly interpolates between them based on
 * `window.scrollY`.
 */
export interface ParallaxLayerProps extends SerializedComponentProps {
  readonly _version: 1;
  /** Page scroll position (px) where interpolation begins. */
  scrollStart: number;
  /** Page scroll position (px) where interpolation ends. */
  scrollEnd: number;
  /**
   * Multiplier applied to the interpolated offset. Conventionally:
   *  - `0`     → static (layer ignores scroll)
   *  - `0.25`  → subtle background drift
   *  - `0.5`   → mid-ground
   *  - `1`     → full foreground motion
   *  - negative values move the layer in the opposite direction (parallax
   *    "inversion" — useful for distant backdrops moving against the camera)
   */
  depth: number;
  /** World-space offset added to the actor at scroll = `scrollStart`. */
  startOffset: Vec3;
  /** World-space offset added to the actor at scroll = `scrollEnd`. */
  endOffset: Vec3;
  /**
   * When `true`, the scroll progress is clamped to `[0..1]` so the layer
   * does not drift past its end position. When `false`, the layer keeps
   * moving linearly as the user scrolls further — useful for continuous
   * backgrounds.
   */
  clamp: boolean;
  /** Restrict the offset to a single axis. Defaults to all-axis. */
  axis: ParallaxAxis;
}

/**
 * Serialized properties for {@link ParallaxStoryComponent}.
 *
 * A "story" is the top-level coordinator for a parallax page: it owns the
 * overall scroll length (in pixels) so the document body is actually
 * scrollable. It does not store sections or layers itself — those are
 * regular actors with `ParallaxLayerComponent` attached. Splitting the
 * concern keeps the data model trivial and means deleting a story actor
 * never orphans authoring data.
 */
export interface ParallaxStoryProps extends SerializedComponentProps {
  readonly _version: 1;
  /**
   * Total scroll length the page should expose, in CSS pixels. The
   * component sets `document.body.style.minHeight` so the user has room
   * to scroll. Set to `0` to disable the page-height adjustment (e.g.
   * when the host page manages its own layout).
   */
  scrollHeightPx: number;
  /**
   * When `true`, the component writes `document.body.style.minHeight` on
   * attach and clears it on detach. When `false`, the component records
   * its configuration but never touches the DOM — useful for embedded
   * scenarios.
   */
  applyPageHeight: boolean;
}
