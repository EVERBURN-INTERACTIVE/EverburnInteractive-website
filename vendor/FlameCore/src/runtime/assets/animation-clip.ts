/**
 * AnimationClip asset factories (v2).
 *
 * Signatures are intentionally backward-compatible with the v1 callers:
 * `createAnimationTrack({ targetActorId, targetComponentType, targetProperty, keyframes })`
 * still works — it now synthesizes the v2 `descriptor`, `id`, and `enabled`
 * fields automatically.
 *
 * @module @runtime/assets/animation-clip
 */

import type {
  AnimatablePropertyDescriptor,
  AnimatableValue,
  AnimationClip,
  AnimationMarker,
  AnimationTrack,
  EasingPreset,
  Keyframe,
} from '@shared/types/animation';
import { TRACK_COLORS, migrateClipV1ToV2 } from '@shared/types/animation';
import { inferAnimatableValueType } from '../utils/interpolate';
import { createId } from '../utils/id';

export { migrateClipV1ToV2 };

/** Create a new v2 animation clip. */
export function createAnimationClip(options: {
  name: string;
  duration: number;
  tracks?: AnimationTrack[];
  markers?: AnimationMarker[];
  frameRate?: number;
  tags?: string[];
}): AnimationClip {
  const now = Date.now();
  return {
    _version: 2,
    id: createId(),
    name: options.name,
    duration: options.duration,
    frameRate: options.frameRate ?? 30,
    tracks: options.tracks ?? [],
    markers: options.markers ?? [],
    tags: options.tags ?? [],
    createdAt: now,
    modifiedAt: now,
  };
}

/**
 * Create a v2 track. Accepts either a full descriptor or the flat
 * `targetComponentType` + `targetProperty` shorthand (which v1 callers use).
 */
export function createAnimationTrack(options: {
  id?: string;
  targetActorId: string;
  targetActorName?: string;
  /** v2 form. */
  descriptor?: AnimatablePropertyDescriptor;
  /** v1 form — synthesizes a descriptor. */
  targetComponentType?: string;
  targetProperty?: string;
  keyframes: Keyframe[];
  enabled?: boolean;
  locked?: boolean;
  color?: string;
}): AnimationTrack {
  const sortedKeyframes = [...options.keyframes].sort((a, b) => a.time - b.time);
  const descriptor: AnimatablePropertyDescriptor = options.descriptor ?? {
    componentType: options.targetComponentType ?? '',
    propertyPath: options.targetProperty ?? '',
    valueType: sortedKeyframes[0] ? inferAnimatableValueType(sortedKeyframes[0].value) : 'number',
    label: options.targetProperty ?? '',
  };
  return {
    id: options.id ?? createId(),
    targetActorId: options.targetActorId,
    targetActorName: options.targetActorName ?? '',
    descriptor,
    keyframes: sortedKeyframes,
    enabled: options.enabled ?? true,
    locked: options.locked ?? false,
    color: options.color ?? TRACK_COLORS[0],
    targetComponentType: descriptor.componentType,
    targetProperty: descriptor.propertyPath,
  };
}

/** Create a keyframe with sensible defaults. */
export function createKeyframe(options: {
  id?: string;
  time?: number;
  value?: AnimatableValue;
  easing?: EasingPreset;
}): Keyframe {
  return {
    id: options.id ?? createId(),
    time: options.time ?? 0,
    value: options.value ?? 0,
    easing: options.easing ?? 'linear',
  };
}

/** Create an animation marker. */
export function createAnimationMarker(options: {
  id?: string;
  time: number;
  label: string;
  color?: string;
  eventName?: string;
}): AnimationMarker {
  return {
    id: options.id ?? createId(),
    time: options.time,
    label: options.label,
    color: options.color ?? '#FFD166',
    eventName: options.eventName,
  };
}

/** Push a track and extend `clip.duration` to cover its last keyframe. */
export function addTrackToClip(clip: AnimationClip, track: AnimationTrack): void {
  clip.tracks.push(track);
  if (track.keyframes.length > 0) {
    const last = track.keyframes[track.keyframes.length - 1].time;
    if (last > clip.duration) clip.duration = last;
  }
  clip.modifiedAt = Date.now();
}

/** Remove a track by index. Idempotent on out-of-range. */
export function removeTrackFromClip(clip: AnimationClip, trackIndex: number): void {
  if (trackIndex < 0 || trackIndex >= clip.tracks.length) return;
  clip.tracks.splice(trackIndex, 1);
  clip.modifiedAt = Date.now();
}

/** Find all keyframes within `tolerance` of `time`. */
export function getKeyframesAtTime(clip: AnimationClip, time: number, tolerance = 0.01): Keyframe[] {
  const result: Keyframe[] = [];
  for (const track of clip.tracks) {
    for (const keyframe of track.keyframes) {
      if (Math.abs(keyframe.time - time) < tolerance) result.push(keyframe);
    }
  }
  return result;
}

/** Validate clip structure. Returns the list of errors. */
export function validateAnimationClip(clip: AnimationClip): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (!clip.id) errors.push('Clip missing id');
  if (!clip.name) errors.push('Clip missing name');
  if (clip.duration <= 0) errors.push('Clip duration must be positive');
  for (let i = 0; i < clip.tracks.length; i++) {
    const track = clip.tracks[i];
    if (!track.targetActorId) errors.push(`Track ${i}: missing targetActorId`);
    if (!track.descriptor?.componentType) errors.push(`Track ${i}: missing descriptor.componentType`);
    if (!track.descriptor?.propertyPath) errors.push(`Track ${i}: missing descriptor.propertyPath`);
    if (track.keyframes.length === 0) errors.push(`Track ${i}: no keyframes`);
    for (let j = 0; j < track.keyframes.length; j++) {
      const kf = track.keyframes[j];
      if (kf.time < 0) errors.push(`Track ${i}, keyframe ${j}: negative time`);
      if (kf.time > clip.duration)
        errors.push(`Track ${i}, keyframe ${j}: time exceeds clip duration`);
    }
  }
  return { valid: errors.length === 0, errors };
}
