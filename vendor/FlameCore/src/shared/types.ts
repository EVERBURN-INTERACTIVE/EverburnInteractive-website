/**
 * Shared, side-effect-free types used by both the runtime and editor.
 * This module must not import from `three`, the runtime, or the editor.
 */

/** A serialized 3D vector. */
export type Vec3 = readonly [number, number, number];

/** A serialized Euler rotation in radians. */
export type Euler3 = readonly [number, number, number];

/** A serialized RGB color in the 0..1 range. */
export type RGB = readonly [number, number, number];

/**
 * Base shape that every serialized component property bag must satisfy.
 * The `_version` field is bumped on any breaking schema change and is used
 * by the migration runner to upgrade older project files.
 */
export interface SerializedComponentProps {
  readonly _version: number;
}

/**
 * A migration function transforms a previous-version props object into the
 * next-version shape. Migrations are registered per-component and run in
 * ascending order until `_version` matches the current schema.
 */
export type ComponentMigration = (props: Record<string, unknown>) => Record<string, unknown>;

/** Coarse classification of engine systems, used for priority ordering. */
export const SystemPriority = {
  INPUT: 10,
  GAMEPLAY: 20,
  PHYSICS: 30,
  ANIMATION: 40,
  RENDERING: 50,
} as const;

export type SystemPriorityValue = (typeof SystemPriority)[keyof typeof SystemPriority];
