/**
 * Animation system types shared between runtime and editor (v2).
 *
 * v2 keeps full backward compatibility with v1 shapes — the runtime
 * migrates v1 clips on load (see {@link migrateClipV1ToV2}).
 *
 * @module @shared/types/animation
 */

import type { SerializedComponentProps, Vec3 } from '../types';

export type { Vec3 };

// ---------------------------------------------------------------------------
// Animatable values
// ---------------------------------------------------------------------------

export type Vec2 = [number, number];
export type Vec4 = [number, number, number, number];
export type ColorRGBA = { r: number; g: number; b: number; a: number };
export type QuaternionValue = { x: number; y: number; z: number; w: number };

/** Discriminator string for the value carried by a track/keyframe. */
export type AnimatableValueType =
  | 'number'
  | 'vec2'
  | 'vec3'
  | 'vec4'
  | 'color'
  | 'quaternion'
  | 'string'
  | 'boolean';

/** Tagged-union value space. JSON-safe (no class instances). */
export type AnimatableValue =
  | number
  | Vec2
  | Vec3
  | Vec4
  | ColorRGBA
  | QuaternionValue
  | string
  | boolean;

// ---------------------------------------------------------------------------
// Easing
// ---------------------------------------------------------------------------

/** Easing preset names supported by `applyEasing`. */
export type EasingPreset =
  | 'linear'
  | 'easeIn'
  | 'easeOut'
  | 'easeInOut'
  | 'easeInCubic'
  | 'easeOutCubic'
  | 'easeInOutCubic'
  | 'easeInBack'
  | 'easeOutBack'
  | 'easeInOutBack'
  | 'easeInBounce'
  | 'easeOutBounce'
  | 'easeInElastic'
  | 'easeOutElastic'
  | 'step'
  | 'stepStart'
  | 'stepEnd'
  | 'cubic'
  | 'custom';

/** Legacy easing alias retained for v1 serialized clips. */
export type EasingType = EasingPreset;

/** Cubic-bezier handles for a `'custom'` easing curve, in normalized 0..1 space. */
export interface BezierHandle {
  cp1: Vec2;
  cp2: Vec2;
}

// ---------------------------------------------------------------------------
// Keyframes & Tracks
// ---------------------------------------------------------------------------

/** A single keyframe on a property track. */
export interface Keyframe {
  /** Stable id for the editor (auto-generated when omitted). */
  id?: string;
  /** Time in seconds from clip start. */
  time: number;
  /** Value at this keyframe (must match the track's `descriptor.valueType`). */
  value: AnimatableValue;
  /** Easing applied between this keyframe and the next. */
  easing: EasingPreset;
  /** Bezier handles when `easing === 'custom'`. */
  bezierHandles?: BezierHandle;
  /** Editor-only selection marker; never relied on at runtime. */
  selected?: boolean;
}

/**
 * Describes a single animatable property exposed by a component type.
 * Registered via `AnimatablePropertyRegistry`.
 */
export interface AnimatablePropertyDescriptor {
  componentType: string;
  propertyPath: string;
  valueType: AnimatableValueType;
  label: string;
  min?: number;
  max?: number;
}

/** A property track on a clip — keyframes targeting one descriptor on one actor. */
export interface AnimationTrack {
  id: string;
  targetActorId: string;
  targetActorName: string;
  descriptor: AnimatablePropertyDescriptor;
  keyframes: Keyframe[];
  enabled: boolean;
  locked: boolean;
  color: string;

  // --- v1 compat fields (populated by migration) ---
  /** @deprecated Read `descriptor.componentType` instead. */
  targetComponentType?: string;
  /** @deprecated Read `descriptor.propertyPath` instead. */
  targetProperty?: string;
  /**
   * When set, the track targets a node inside the playing actor's
   * {@link MeshRendererComponent} GLTF subtree instead of a FlameCore actor id.
   */
  targetGltfNodePath?: string;
}

/** Named time marker on a clip. */
export interface AnimationMarker {
  id: string;
  time: number;
  label: string;
  color: string;
  /** Optional event name dispatched on the `AnimationSystem` bus. */
  eventName?: string;
}

/** A reusable, versioned animation clip asset. */
export interface AnimationClip extends SerializedComponentProps {
  readonly _version: 2;
  id: string;
  name: string;
  duration: number;
  /** Editor snapping resolution in frames per second. */
  frameRate: number;
  tracks: AnimationTrack[];
  markers: AnimationMarker[];
  tags: string[];
  createdAt: number;
  modifiedAt: number;
}

// ---------------------------------------------------------------------------
// Playback
// ---------------------------------------------------------------------------

export type PlaybackMode = 'once' | 'loop' | 'pingPong';

// ---------------------------------------------------------------------------
// State machines, transitions, scroll driver (unchanged from v1)
// ---------------------------------------------------------------------------

export interface StateMachineState {
  id: string;
  name: string;
  clipId?: string;
  propertyOverrides?: PropertyOverride[];
}

export interface PropertyOverride {
  componentType: string;
  property: string;
  value: AnimatableValue;
}

export interface TransitionTrigger {
  type: 'event' | 'scroll' | 'timer' | 'immediate';
  eventName?: string;
  scrollRange?: [number, number];
  timerDuration?: number;
}

export interface StateTransition {
  fromStateId: string;
  toStateId: string;
  trigger: TransitionTrigger;
  duration: number;
}

export interface StateMachine extends SerializedComponentProps {
  readonly _version: 1;
  states: StateMachineState[];
  transitions: StateTransition[];
  initialStateId: string;
}

export interface ScrollDriverConfig {
  scrollStart: number;
  scrollEnd: number;
  clamp: boolean;
}

// ---------------------------------------------------------------------------
// v1 → v2 migration
// ---------------------------------------------------------------------------

interface AnimationClipV1 {
  _version: 1;
  id: string;
  name: string;
  duration: number;
  tracks: Array<{
    targetActorId: string;
    targetComponentType: string;
    targetProperty: string;
    keyframes: Array<{ time: number; value: AnimatableValue; easing: EasingPreset }>;
  }>;
}

/** Default lane colors handed out to new tracks. */
export const TRACK_COLORS: ReadonlyArray<string> = [
  '#FF6B35',
  '#F7B538',
  '#3DCCC7',
  '#9D8DF1',
  '#FF61A6',
  '#42B883',
  '#5BC0EB',
  '#FF8AAB',
];

function inferValueType(sample: AnimatableValue | undefined): AnimatableValueType {
  if (sample === undefined) return 'number';
  if (typeof sample === 'number') return 'number';
  if (typeof sample === 'string') return 'string';
  if (typeof sample === 'boolean') return 'boolean';
  if (Array.isArray(sample)) {
    const len = (sample as ReadonlyArray<unknown>).length;
    if (len === 2) return 'vec2';
    if (len === 3) return 'vec3';
    if (len === 4) return 'vec4';
  }
  if (typeof sample === 'object' && sample !== null) {
    if ('w' in sample && 'x' in sample) return 'quaternion';
    if ('r' in sample) return 'color';
  }
  return 'number';
}

/**
 * Detect-and-migrate utility. Idempotent: returns clip as-is when already v2.
 */
export function migrateClipV1ToV2(input: AnimationClip | AnimationClipV1): AnimationClip {
  if ((input as AnimationClip)._version === 2) return input as AnimationClip;
  const v1 = input as AnimationClipV1;
  const now = Date.now();
  return {
    _version: 2,
    id: v1.id,
    name: v1.name,
    duration: v1.duration,
    frameRate: 30,
    tracks: v1.tracks.map((t, idx) => ({
      id: `track-${v1.id}-${idx}`,
      targetActorId: t.targetActorId,
      targetActorName: '',
      descriptor: {
        componentType: t.targetComponentType,
        propertyPath: t.targetProperty,
        valueType: inferValueType(t.keyframes[0]?.value),
        label: t.targetProperty,
      },
      keyframes: t.keyframes.map((kf, kfIdx) => ({
        id: `kf-${v1.id}-${idx}-${kfIdx}`,
        time: kf.time,
        value: kf.value,
        easing: kf.easing,
      })),
      enabled: true,
      locked: false,
      color: TRACK_COLORS[idx % TRACK_COLORS.length],
      targetComponentType: t.targetComponentType,
      targetProperty: t.targetProperty,
    })),
    markers: [],
    tags: [],
    createdAt: now,
    modifiedAt: now,
  };
}
