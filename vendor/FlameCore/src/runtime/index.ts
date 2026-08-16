/**
 * FlameCore runtime entry point. Exports the public surface used by
 * exported sites and by the editor.
 */
export * from './runtime';
export * from './runtime-context';
export * from './host-resolvers';
export * from './scene';
export * from './components';
export * from './systems';
export * from './assets';
export * from './quality';
export * from './particles';
export * from './lighting';
export {
  switchProjectScene,
  type SceneSwitchTransition,
  type SwitchProjectSceneOptions,
} from './project-scene-navigator';
export { createId } from './utils/id';
export { migrate } from './utils/migrate';
export { EventEmitter } from './utils/events';
export { applyEasing, cubicBezier, lerp, lerpVec3, lerpColor } from './utils/easing';
export { interpolateValue, inferAnimatableValueType } from './utils/interpolate';
export {
  AnimatablePropertyRegistry,
  bootstrapAnimatablePropertyRegistry,
  defineAnimatableProperty,
} from './utils/animatable-property-registry';
export {
  MorphTargetAnimatableRegistry,
  type MorphAnimatableDescriptor,
} from './utils/morph-target-registry';
export type {
  AnimatableValue,
  AnimatableValueType,
  AnimatablePropertyDescriptor,
  AnimationClip,
  AnimationTrack,
  AnimationMarker,
  BezierHandle,
  ColorRGBA,
  EasingPreset,
  EasingType,
  Keyframe,
  PlaybackMode,
  QuaternionValue,
  Vec2,
  Vec4,
} from '@shared/types/animation';
export { migrateClipV1ToV2, TRACK_COLORS } from '@shared/types/animation';

import { bootstrapAnimatablePropertyRegistry } from './utils/animatable-property-registry';
bootstrapAnimatablePropertyRegistry();
export type {
  Euler3,
  RGB,
  SerializedComponentProps,
  ComponentMigration,
  Vec3,
} from '@shared/types';
