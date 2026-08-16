import type { SerializedComponentProps, Vec3 } from '../types';

/** Serialized scroll trigger registration (shared by scroll-driven components). */
export interface ScrollRangeProps {
  scrollStart: number;
  scrollEnd: number;
  clamp: boolean;
}

/** Serialized {@link CameraPathComponent} properties (v1). */
export interface CameraPathProps extends SerializedComponentProps, ScrollRangeProps {
  readonly _version: 1;
  /** Actor id of the camera to drive (defaults to scene main camera). */
  cameraActorId?: string;
  /** Spline waypoints: camera position in world space. */
  waypoints: readonly Vec3[];
  /** Optional look-at target per waypoint (same length as waypoints). */
  lookAtTargets?: readonly Vec3[];
}

/** Serialized {@link HeroComponent} properties (v1). */
export interface HeroProps extends SerializedComponentProps {
  readonly _version: 1;
  /** Optional particle system asset for background ambience. */
  particleAssetId?: string;
  /** Enable subtle ambient camera drift on the main camera. */
  cameraDriftEnabled: boolean;
  /** Amplitude of camera drift in world units. */
  cameraDriftAmplitude: number;
  /** Drift oscillation speed multiplier. */
  cameraDriftSpeed: number;
  /** Page scroll height when auto page height is enabled. */
  scrollHeightPx: number;
  /** Write scroll height to document.body min-height. */
  applyPageHeight: boolean;
  /** Entrance animation duration in seconds. */
  entranceDuration: number;
}

/** Serialized {@link TextReveal3DComponent} properties (v1). */
export interface TextReveal3DProps extends SerializedComponentProps, ScrollRangeProps {
  readonly _version: 1;
  /** Text content (3D billboard text). */
  text: string;
  /** Font size in pixels. */
  fontSizePx: number;
  /** Foreground color (linear RGB). */
  color: import('../types').RGB;
  /** Reveal mode: all at once or character-by-character. */
  revealMode: 'all' | 'character';
}
