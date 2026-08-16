/**
 * Articulated product / mechanical hinge types.
 * @module @shared/types/articulation
 */

import type { SerializedComponentProps, Vec3 } from '@shared/types';

/** Hinge rotation axis in local space. */
export type ArticulationAxis = 'x' | 'y' | 'z';

/** Serialized {@link ArticulationComponent} properties. */
export interface ArticulationProps extends SerializedComponentProps {
  readonly _version: 1;
  /** Normalized open amount in `[0, 1]` where 0 = closed and 1 = fully open. */
  progress: number;
  /** Local axis the hinge rotates around. */
  axis: ArticulationAxis;
  /** Closed angle in degrees (at progress 0). */
  minAngleDeg: number;
  /** Open angle in degrees (at progress 1). */
  maxAngleDeg: number;
  /** Rest rotation (radians, XYZ Euler) applied before the hinge angle is added. */
  restRotation: Vec3;
  /** Rest position captured when binding or calling captureRestPose. */
  restPosition: Vec3;
  /** Optional pivot offset in local space (reserved for future pivot nodes). */
  pivotOffset: Vec3;
}

/** Serialized {@link ModelPartBindingComponent} properties. */
export interface ModelPartBindingProps extends SerializedComponentProps {
  readonly _version: 1;
  /** Actor id that owns the source GLTF {@link MeshRendererComponent}. */
  sourceActorId: string;
  /**
   * Slash-separated path from the loaded GLTF root to the target node,
   * e.g. `Laptop/Screen` or `watch_clasp`.
   */
  nodePath: string;
  /** When true, reparent the GLTF node under this actor on bind. */
  reparentNode: boolean;
}

/** Serialized {@link ArticulationDriverComponent} properties. */
export interface ArticulationDriverProps extends SerializedComponentProps {
  readonly _version: 1;
  /** Progress while fully closed. */
  closedProgress: number;
  /** Progress while fully open. */
  openProgress: number;
  /** Seconds to ease between closed and open when toggled. */
  transitionDuration: number;
  /** Start in the open pose when the scene loads. */
  startOpen: boolean;
  /** Toggle open/closed when this actor receives a click. */
  toggleOnClick: boolean;
  /** When true, clicking while mid-transition reverses direction. */
  allowInterrupt: boolean;
}
