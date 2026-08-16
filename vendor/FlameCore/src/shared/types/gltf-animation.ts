/**
 * GLTF embedded animation playback types.
 * @module @shared/types/gltf-animation
 */

import type { SerializedComponentProps } from '../types';
import type { PlaybackMode } from './animation';

/** Serialized {@link GltfAnimationComponent} properties. */
export interface GltfAnimationProps extends SerializedComponentProps {
  readonly _version: 1;
  /** Clip name from the source GLTF (preferred over index). */
  clipName?: string;
  /** Clip index when name is absent or ambiguous. */
  clipIndex: number;
  playbackMode: PlaybackMode;
  playbackRate: number;
  autoplay: boolean;
  /** Mixer weight in `[0, 1]`. */
  weight: number;
  /**
   * When set in `[0, 1]`, scrubs the active clip instead of advancing time.
   * Used by scroll drivers and timeline preview.
   */
  normalizedTime?: number;
}
