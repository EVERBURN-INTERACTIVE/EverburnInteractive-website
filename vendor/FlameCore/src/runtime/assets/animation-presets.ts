/**
 * Pure animation clip factories for common motion presets (PRD-11).
 *
 * Every export returns a versioned `AnimationClip` with no runtime side effects.
 */

import type { AnimationClip, AnimatableValue, EasingPreset } from '@shared/types/animation';
import type { RuntimeContext } from '../runtime-context';
import type { Vec3 } from '@shared/types';
import {
  addTrackToClip,
  createAnimationClip,
  createAnimationMarker,
  createAnimationTrack,
  createKeyframe,
} from './animation-clip';

import type { MaskWipeShape } from '../components/mask-wipe.component';

type KeyframeSpec = {
  time: number;
  value: AnimatableValue;
  easing?: EasingPreset;
};

function numberTrack(
  actorId: string,
  componentType: string,
  propertyPath: string,
  keyframes: KeyframeSpec[],
): ReturnType<typeof createAnimationTrack> {
  return createAnimationTrack({
    targetActorId: actorId,
    targetComponentType: componentType,
    targetProperty: propertyPath,
    keyframes: keyframes.map((kf) =>
      createKeyframe({ time: kf.time, value: kf.value, easing: kf.easing ?? 'linear' }),
    ),
  });
}

function booleanTrack(
  actorId: string,
  componentType: string,
  propertyPath: string,
  keyframes: KeyframeSpec[],
): ReturnType<typeof createAnimationTrack> {
  return createAnimationTrack({
    targetActorId: actorId,
    targetComponentType: componentType,
    targetProperty: propertyPath,
    keyframes: keyframes.map((kf) =>
      createKeyframe({
        time: kf.time,
        value: kf.value as boolean,
        easing: kf.easing ?? 'step',
      }),
    ),
  });
}

function vec3AxisTrack(
  actorId: string,
  property: 'position' | 'rotation' | 'scale',
  axis: 0 | 1 | 2,
  keyframes: KeyframeSpec[],
): ReturnType<typeof createAnimationTrack> {
  return numberTrack(actorId, 'TransformComponent', `${property}.${axis}`, keyframes);
}

function buildClip(
  name: string,
  duration: number,
  tracks: ReturnType<typeof createAnimationTrack>[],
  options?: { markers?: ReturnType<typeof createAnimationMarker>[]; tags?: string[] },
): AnimationClip {
  const clip = createAnimationClip({ name, duration, tags: options?.tags });
  for (const track of tracks) addTrackToClip(clip, track);
  if (options?.markers) clip.markers.push(...options.markers);
  return clip;
}

function offsetClipTimes(clip: AnimationClip, offsetSec: number): AnimationClip {
  if (offsetSec === 0) return clip;
  const shifted = createAnimationClip({
    name: clip.name,
    duration: clip.duration + offsetSec,
    tags: [...clip.tags],
  });
  for (const track of clip.tracks) {
    addTrackToClip(
      shifted,
      createAnimationTrack({
        targetActorId: track.targetActorId,
        descriptor: track.descriptor,
        keyframes: track.keyframes.map((kf) =>
          createKeyframe({ time: kf.time + offsetSec, value: kf.value, easing: kf.easing }),
        ),
      }),
    );
  }
  shifted.markers.push(
    ...clip.markers.map((m) =>
      createAnimationMarker({
        time: m.time + offsetSec,
        label: m.label,
        color: m.color,
        eventName: m.eventName,
      }),
    ),
  );
  return shifted;
}

function lookAtEuler(from: Vec3, target: Vec3): Vec3 {
  const dx = target[0] - from[0];
  const dy = target[1] - from[1];
  const dz = target[2] - from[2];
  const yaw = Math.atan2(dx, dz);
  const horiz = Math.hypot(dx, dz);
  const pitch = -Math.atan2(dy, horiz);
  return [pitch, yaw, 0];
}

// --- 2D UI ---

export function createFadeInClip(
  actorId: string,
  componentType: string,
  options?: {
    duration?: number;
    easing?: EasingPreset;
    fromOpacity?: number;
    toOpacity?: number;
  },
): AnimationClip {
  const duration = options?.duration ?? 0.6;
  const easing = options?.easing ?? 'easeInOut';
  return buildClip(`${componentType} Fade In`, duration, [
    numberTrack(actorId, componentType, 'opacity', [
      { time: 0, value: options?.fromOpacity ?? 0, easing },
      { time: duration, value: options?.toOpacity ?? 1, easing },
    ]),
  ]);
}

export function createSlideInClip(
  actorId: string,
  options?: {
    direction?: 'left' | 'right' | 'top' | 'bottom';
    distance?: number;
    duration?: number;
    easing?: EasingPreset;
    componentType?: string;
  },
): AnimationClip {
  const direction = options?.direction ?? 'bottom';
  const distance = options?.distance ?? 40;
  const duration = options?.duration ?? 0.5;
  const easing = options?.easing ?? 'easeOut';
  const componentType = options?.componentType ?? 'UIPanelComponent';
  const isTransform = componentType === 'TransformComponent';
  const propPrefix = isTransform ? 'position' : 'offset';
  const horizontal = direction === 'left' || direction === 'right';
  const axis = horizontal ? 0 : 1;
  const from = direction === 'left' || direction === 'top' ? -distance : distance;
  return buildClip(`Slide In (${direction})`, duration, [
    numberTrack(actorId, componentType, `${propPrefix}.${axis}`, [
      { time: 0, value: from, easing },
      { time: duration, value: 0, easing },
    ]),
  ]);
}

export function createScalePopClip(
  actorId: string,
  options?: {
    duration?: number;
    fromScale?: number;
    overshoot?: number;
    easing?: EasingPreset;
  },
): AnimationClip {
  const duration = options?.duration ?? 0.4;
  const fromScale = options?.fromScale ?? 0.8;
  const overshoot = options?.overshoot ?? 1.05;
  const easing = options?.easing ?? 'easeOut';
  const scaleTracks = ([0, 1, 2] as const).map((axis) =>
    vec3AxisTrack(actorId, 'scale', axis, [
      { time: 0, value: fromScale, easing },
      { time: duration * 0.7, value: overshoot, easing },
      { time: duration, value: 1, easing: 'easeInOut' },
    ]),
  );
  return buildClip('Scale Pop', duration, scaleTracks);
}

export function createStaggerRevealClips(
  actorIds: string[],
  options?: {
    staggerDelay?: number;
    clipFactory?: (actorId: string) => AnimationClip;
  },
): AnimationClip[] {
  const stagger = options?.staggerDelay ?? 0.1;
  const factory = options?.clipFactory ?? ((id) => createFadeInClip(id, 'UIPanelComponent'));
  return actorIds.map((id, index) => {
    const clip = factory(id);
    if (index === 0) return clip;
    return offsetClipTimes(clip, stagger * index);
  });
}

// --- Text ---

export function createTypewriterClip(
  actorId: string,
  options?: {
    duration?: number;
    revealMode?: 'characters' | 'words' | 'lines';
    easing?: EasingPreset;
  },
): AnimationClip {
  const duration = options?.duration ?? 2;
  const easing = options?.easing ?? 'linear';
  return buildClip('Typewriter', duration, [
    numberTrack(actorId, 'TextComponent', 'revealProgress', [
      { time: 0, value: 0, easing },
      { time: duration, value: 1, easing },
    ]),
  ]);
}

export function createWordRevealClip(
  actorId: string,
  options?: { duration?: number; easing?: EasingPreset },
): AnimationClip {
  const duration = options?.duration ?? 1.5;
  const easing = options?.easing ?? 'easeOut';
  return buildClip('Word Reveal', duration, [
    numberTrack(actorId, 'TextComponent', 'revealProgress', [
      { time: 0, value: 0, easing },
      { time: duration, value: 1, easing },
    ]),
  ]);
}

export function createCharacterCascadeClip(
  actorId: string,
  options?: { duration?: number; easing?: EasingPreset },
): AnimationClip {
  const duration = options?.duration ?? 1.2;
  const easing = options?.easing ?? 'easeOut';
  return buildClip('Character Cascade', duration, [
    numberTrack(actorId, 'TextComponent', 'revealProgress', [
      { time: 0, value: 0, easing },
      { time: duration, value: 1, easing },
    ]),
  ]);
}

export function createScrambleDecodeClip(
  actorId: string,
  options?: { duration?: number; stepCount?: number; easing?: EasingPreset },
): AnimationClip {
  const duration = options?.duration ?? 1.5;
  const steps = Math.max(2, options?.stepCount ?? 8);
  const easing = options?.easing ?? 'linear';
  const keyframes: KeyframeSpec[] = [];
  for (let i = 0; i <= steps; i++) {
    keyframes.push({
      time: (duration * i) / steps,
      value: i / steps,
      easing: i === steps ? 'easeOut' : easing,
    });
  }
  return buildClip('Scramble Decode', duration, [
    numberTrack(actorId, 'TextComponent', 'scrambleProgress', keyframes),
  ]);
}

export function createWaveTextClip(
  actorId: string,
  options?: { duration?: number; loop?: boolean },
): AnimationClip {
  const duration = options?.duration ?? 2;
  const loop = options?.loop ?? true;
  return buildClip('Wave Text', duration, [
    numberTrack(actorId, 'TextComponent', 'wavePhase', [
      { time: 0, value: 0, easing: 'linear' },
      { time: duration, value: Math.PI * 2, easing: 'linear' },
    ]),
  ], { tags: loop ? ['loop'] : undefined });
}

// --- Image / Mesh ---

export function createKenBurnsClip(
  actorId: string,
  options?: {
    duration?: number;
    zoomFrom?: number;
    zoomTo?: number;
    panX?: number;
    panY?: number;
    easing?: EasingPreset;
  },
): AnimationClip {
  const duration = options?.duration ?? 8;
  const zoomFrom = options?.zoomFrom ?? 1;
  const zoomTo = options?.zoomTo ?? 1.08;
  const panX = options?.panX ?? 0.02;
  const panY = options?.panY ?? 0.01;
  const easing = options?.easing ?? 'linear';
  const tracks = ([0, 1, 2] as const).flatMap((axis) => [
    vec3AxisTrack(actorId, 'scale', axis, [
      { time: 0, value: zoomFrom, easing },
      { time: duration, value: zoomTo, easing },
    ]),
  ]);
  tracks.push(
    vec3AxisTrack(actorId, 'position', 0, [
      { time: 0, value: 0, easing },
      { time: duration, value: panX, easing },
    ]),
    vec3AxisTrack(actorId, 'position', 1, [
      { time: 0, value: 0, easing },
      { time: duration, value: panY, easing },
    ]),
  );
  return buildClip('Ken Burns', duration, tracks);
}

export function createFadeInMeshClip(
  actorId: string,
  options?: { duration?: number; easing?: EasingPreset },
): AnimationClip {
  const duration = options?.duration ?? 0.8;
  const easing = options?.easing ?? 'easeInOut';
  return buildClip('Mesh Fade In', duration, [
    numberTrack(actorId, 'MeshRendererComponent', 'opacity', [
      { time: 0, value: 0, easing },
      { time: duration, value: 1, easing },
    ]),
  ]);
}

export function createGlitchClip(
  actorId: string,
  options?: { duration?: number; intensity?: number; burstCount?: number },
): AnimationClip {
  const duration = options?.duration ?? 0.6;
  const intensity = options?.intensity ?? 0.5;
  const bursts = Math.max(1, options?.burstCount ?? 4);
  const keyframes: KeyframeSpec[] = [{ time: 0, value: 0, easing: 'step' }];
  for (let i = 0; i < bursts; i++) {
    const t = ((i + 1) / (bursts + 1)) * duration;
    keyframes.push({ time: t, value: intensity, easing: 'step' });
    keyframes.push({ time: Math.min(duration, t + duration * 0.05), value: 0, easing: 'step' });
  }
  keyframes.push({ time: duration, value: 0, easing: 'step' });
  return buildClip('Glitch', duration, [
    numberTrack(actorId, 'MeshRendererComponent', 'glitchIntensity', keyframes),
  ]);
}

export function createPixelDissolveClip(
  actorId: string,
  options?: { duration?: number; direction?: 'in' | 'out' },
): AnimationClip {
  const duration = options?.duration ?? 1.2;
  const direction = options?.direction ?? 'in';
  const from = direction === 'in' ? 0 : 1;
  const to = direction === 'in' ? 1 : 0;
  return buildClip(`Pixel Dissolve ${direction}`, duration, [
    numberTrack(actorId, 'MeshRendererComponent', 'dissolveProgress', [
      { time: 0, value: from, easing: 'easeInOut' },
      { time: duration, value: to, easing: 'easeInOut' },
    ]),
  ]);
}

// --- 3D Object Spawn ---

export function createMaterializeClip(
  actorId: string,
  options?: { duration?: number; particleMarkerName?: string },
): AnimationClip {
  const duration = options?.duration ?? 1.5;
  const hold = duration * 0.6;
  const markers = options?.particleMarkerName
    ? [createAnimationMarker({ time: 0, label: options.particleMarkerName, eventName: options.particleMarkerName })]
    : undefined;
  return buildClip('Materialize', duration, [
    numberTrack(actorId, 'MeshRendererComponent', 'opacity', [
      { time: 0, value: 0, easing: 'linear' },
      { time: hold, value: 0, easing: 'linear' },
      { time: duration, value: 1, easing: 'easeOut' },
    ]),
    numberTrack(actorId, 'MeshRendererComponent', 'dissolveProgress', [
      { time: 0, value: 0, easing: 'easeOut' },
      { time: duration, value: 1, easing: 'easeOut' },
    ]),
  ], { markers });
}

export function createGroundRiseClip(
  actorId: string,
  options?: { duration?: number; riseDistance?: number; easing?: EasingPreset },
  ctx?: RuntimeContext,
): AnimationClip {
  const duration = options?.duration ?? 1;
  const rise = options?.riseDistance ?? 3;
  const easing = options?.easing ?? 'easeOut';
  let fromY = -rise;
  let toY = 0;
  if (ctx) {
    // RuntimeContext does not expose actor transforms directly; delta mode is the portable default.
    void ctx;
  }
  return buildClip('Ground Rise', duration, [
    vec3AxisTrack(actorId, 'position', 1, [
      { time: 0, value: fromY, easing },
      { time: duration, value: toY, easing },
    ]),
  ]);
}

export function createFloatingHoverClip(
  actorId: string,
  options?: { amplitude?: number; period?: number; rotationDeg?: number },
): AnimationClip {
  const amplitude = options?.amplitude ?? 0.15;
  const period = options?.period ?? 2;
  const rotationDeg = options?.rotationDeg ?? 3;
  const rotRad = (rotationDeg * Math.PI) / 180;
  return buildClip(
    'Floating Hover',
    period,
    [
      vec3AxisTrack(actorId, 'position', 1, [
        { time: 0, value: 0, easing: 'easeInOut' },
        { time: period * 0.25, value: amplitude, easing: 'easeInOut' },
        { time: period * 0.5, value: 0, easing: 'easeInOut' },
        { time: period * 0.75, value: -amplitude, easing: 'easeInOut' },
        { time: period, value: 0, easing: 'easeInOut' },
      ]),
      vec3AxisTrack(actorId, 'rotation', 1, [
        { time: 0, value: 0, easing: 'easeInOut' },
        { time: period * 0.5, value: rotRad, easing: 'easeInOut' },
        { time: period, value: 0, easing: 'easeInOut' },
      ]),
    ],
    { tags: ['loop'] },
  );
}

/**
 * Looping bounce with squash-and-stretch and gravity-like easing.
 *
 * Animation principles encoded:
 * - Slow in / slow out on the arc (`easeOutCubic` rising, `easeInCubic` falling)
 * - Squash on contact (Y down, XZ out) with the center dropped so the base stays planted
 * - Stretch in flight (Y up, XZ in) on takeoff and pre-landing
 * - End state matches start so the loop does not pop
 */
export function createBounceClip(
  actorId: string,
  options?: {
    /** Center Y when the ball rests at scale 1. Defaults to 0.5. */
    restY?: number;
    /**
     * Optional ground surface Y. When set, overrides {@link restY} so the
     * mesh underside contacts this plane: restY = groundY + radius.
     */
    groundY?: number;
    /** Peak height above rest center. */
    height?: number;
    /** Visual radius used to keep the bottom planted during squash. */
    radius?: number;
    /** Full bounce cycle length in seconds. */
    duration?: number;
  },
): AnimationClip {
  const duration = options?.duration ?? 0.85;
  const radius = Math.max(0.05, options?.radius ?? 0.5);
  const restY =
    options?.groundY !== undefined
      ? options.groundY + radius
      : (options?.restY ?? 0.5);
  const height = options?.height ?? 1.55;

  // Approximate volume conservation: xz = 1 / sqrt(yScale).
  const squashY = 0.52;
  const squashXZ = 1 / Math.sqrt(squashY);
  const stretchY = 1.32;
  const stretchXZ = 1 / Math.sqrt(stretchY);
  const apexStretchY = 1.06;
  const apexStretchXZ = 1 / Math.sqrt(apexStretchY);

  const plantedY = (yScale: number): number => restY - radius * (1 - yScale);
  const apexY = restY + height;

  const t0 = 0;
  const tTakeoff = duration * 0.14;
  const tApex = duration * 0.5;
  const tPreLand = duration * 0.86;
  const tLand = duration;

  return buildClip(
    'Bounce',
    duration,
    [
      vec3AxisTrack(actorId, 'position', 1, [
        { time: t0, value: plantedY(squashY), easing: 'easeOutCubic' },
        { time: tTakeoff, value: restY + height * 0.22, easing: 'easeOutCubic' },
        { time: tApex, value: apexY, easing: 'easeInCubic' },
        { time: tPreLand, value: restY + height * 0.18, easing: 'easeInCubic' },
        { time: tLand, value: plantedY(squashY), easing: 'linear' },
      ]),
      vec3AxisTrack(actorId, 'scale', 0, [
        { time: t0, value: squashXZ, easing: 'easeOut' },
        { time: tTakeoff, value: stretchXZ, easing: 'easeInOut' },
        { time: tApex, value: apexStretchXZ, easing: 'easeInOut' },
        { time: tPreLand, value: stretchXZ, easing: 'easeIn' },
        { time: tLand, value: squashXZ, easing: 'linear' },
      ]),
      vec3AxisTrack(actorId, 'scale', 1, [
        { time: t0, value: squashY, easing: 'easeOut' },
        { time: tTakeoff, value: stretchY, easing: 'easeInOut' },
        { time: tApex, value: apexStretchY, easing: 'easeInOut' },
        { time: tPreLand, value: stretchY, easing: 'easeIn' },
        { time: tLand, value: squashY, easing: 'linear' },
      ]),
      vec3AxisTrack(actorId, 'scale', 2, [
        { time: t0, value: squashXZ, easing: 'easeOut' },
        { time: tTakeoff, value: stretchXZ, easing: 'easeInOut' },
        { time: tApex, value: apexStretchXZ, easing: 'easeInOut' },
        { time: tPreLand, value: stretchXZ, easing: 'easeIn' },
        { time: tLand, value: squashXZ, easing: 'linear' },
      ]),
    ],
    {
      tags: ['loop'],
      markers: [
        createAnimationMarker({ time: t0, label: 'Impact', eventName: 'bounce_impact' }),
        createAnimationMarker({ time: tApex, label: 'Apex', eventName: 'bounce_apex' }),
      ],
    },
  );
}

/**
 * Convenience alias: bounce clip planted for a unit sphere on `groundY`.
 * Prefer this when authoring bouncing-sphere presets.
 */
export function createBouncingSphereClip(
  actorId: string,
  options?: {
    groundY?: number;
    radius?: number;
    height?: number;
    duration?: number;
  },
): AnimationClip {
  return createBounceClip(actorId, {
    groundY: options?.groundY ?? 0,
    radius: options?.radius ?? 0.5,
    height: options?.height ?? 1.55,
    duration: options?.duration ?? 0.85,
  });
}

export function createOrbitalRotationClip(
  actorId: string,
  options?: { period?: number; axis?: 'x' | 'y' | 'z' },
): AnimationClip {
  const period = options?.period ?? 5;
  const axisMap = { x: 0, y: 1, z: 2 } as const;
  const axis = axisMap[options?.axis ?? 'y'];
  return buildClip('Orbital Rotation', period, [
    vec3AxisTrack(actorId, 'rotation', axis, [
      { time: 0, value: 0, easing: 'linear' },
      { time: period, value: Math.PI * 2, easing: 'linear' },
    ]),
  ], { tags: ['loop'] });
}

// --- Camera ---

export function createCinematicOrbitClip(
  cameraActorId: string,
  options?: { period?: number; radius?: number; targetY?: number; tiltDeg?: number },
): AnimationClip {
  const period = options?.period ?? 12;
  const radius = options?.radius ?? 5;
  const targetY = options?.targetY ?? 0;
  const tiltRad = ((options?.tiltDeg ?? 20) * Math.PI) / 180;
  const posKeyframes: KeyframeSpec[] = [];
  for (let i = 0; i <= 8; i++) {
    const t = (period * i) / 8;
    const angle = (i / 8) * Math.PI * 2;
    posKeyframes.push({ time: t, value: Math.cos(angle) * radius, easing: 'linear' });
  }
  const zKeyframes: KeyframeSpec[] = [];
  for (let i = 0; i <= 8; i++) {
    const t = (period * i) / 8;
    const angle = (i / 8) * Math.PI * 2;
    zKeyframes.push({ time: t, value: Math.sin(angle) * radius, easing: 'linear' });
  }
  return buildClip(
    'Cinematic Orbit',
    period,
    [
      vec3AxisTrack(cameraActorId, 'position', 0, posKeyframes),
      vec3AxisTrack(cameraActorId, 'position', 1, [
        { time: 0, value: targetY + Math.sin(tiltRad) * radius * 0.2, easing: 'linear' },
        { time: period, value: targetY + Math.sin(tiltRad) * radius * 0.2, easing: 'linear' },
      ]),
      vec3AxisTrack(cameraActorId, 'position', 2, zKeyframes),
      vec3AxisTrack(cameraActorId, 'rotation', 1, [
        { time: 0, value: 0, easing: 'linear' },
        { time: period, value: Math.PI * 2, easing: 'linear' },
      ]),
    ],
    { tags: ['loop'] },
  );
}

export function createDollyZoomClip(
  cameraActorId: string,
  options?: {
    duration?: number;
    dollyDistance?: number;
    fovFrom?: number;
    fovTo?: number;
    easing?: EasingPreset;
  },
): AnimationClip {
  const duration = options?.duration ?? 2;
  const dolly = options?.dollyDistance ?? 3;
  const easing = options?.easing ?? 'easeInOut';
  return buildClip('Dolly Zoom', duration, [
    vec3AxisTrack(cameraActorId, 'position', 2, [
      { time: 0, value: 0, easing },
      { time: duration, value: -dolly, easing },
    ]),
    numberTrack(cameraActorId, 'CameraComponent', 'fov', [
      { time: 0, value: options?.fovFrom ?? 75, easing },
      { time: duration, value: options?.fovTo ?? 35, easing },
    ]),
  ]);
}

export function createScrollFlythroughClip(
  cameraActorId: string,
  pathPoints: Array<{
    position: [number, number, number];
    lookAt: [number, number, number];
    scrollT: number;
  }>,
): AnimationClip {
  const duration = Math.max(...pathPoints.map((p) => p.scrollT), 1);
  const posTracks = ([0, 1, 2] as const).map((axis) =>
    numberTrack(
      cameraActorId,
      'TransformComponent',
      `position.${axis}`,
      pathPoints.map((p) => ({
        time: p.scrollT * duration,
        value: p.position[axis],
        easing: 'easeInOut' as EasingPreset,
      })),
    ),
  );
  const rotTracks = ([0, 1, 2] as const).map((axis) =>
    numberTrack(
      cameraActorId,
      'TransformComponent',
      `rotation.${axis}`,
      pathPoints.map((p) => ({
        time: p.scrollT * duration,
        value: lookAtEuler(p.position, p.lookAt)[axis],
        easing: 'easeInOut' as EasingPreset,
      })),
    ),
  );
  return buildClip('Scroll Flythrough', duration, [...posTracks, ...rotTracks]);
}

// --- Logo ---

export function createEnergyChargeClip(
  actorId: string,
  options?: { duration?: number; pulseCount?: number },
): AnimationClip {
  const duration = options?.duration ?? 1.5;
  const pulses = Math.max(1, options?.pulseCount ?? 2);
  const keyframes: KeyframeSpec[] = [
    { time: 0, value: 0, easing: 'easeOut' },
    { time: duration * 0.2, value: 3, easing: 'easeOut' },
    { time: duration * 0.35, value: 1, easing: 'easeInOut' },
  ];
  for (let i = 0; i < pulses; i++) {
    const base = duration * (0.4 + (0.5 * i) / pulses);
    keyframes.push({ time: base, value: 2, easing: 'easeOut' });
    keyframes.push({ time: Math.min(duration, base + duration * 0.1), value: 1, easing: 'easeIn' });
  }
  keyframes.push({ time: duration, value: 1, easing: 'linear' });
  return buildClip('Energy Charge', duration, [
    numberTrack(actorId, 'MeshRendererComponent', 'emissiveIntensity', keyframes),
  ]);
}

export function createWireframeToSolidClip(
  actorId: string,
  options?: { duration?: number; wireframePhaseDuration?: number },
): AnimationClip {
  const duration = options?.duration ?? 2;
  const wireDur = options?.wireframePhaseDuration ?? 0.6;
  return buildClip('Wireframe To Solid', duration, [
    booleanTrack(actorId, 'MeshRendererComponent', 'wireframe', [
      { time: 0, value: true, easing: 'step' },
      { time: wireDur, value: false, easing: 'step' },
    ]),
    numberTrack(actorId, 'MeshRendererComponent', 'opacity', [
      { time: 0, value: 0.3, easing: 'linear' },
      { time: wireDur, value: 0.3, easing: 'linear' },
      { time: duration, value: 1, easing: 'easeInOut' },
    ]),
  ]);
}

// --- Compound presets ---

export function createHeroEntrancePreset(actorIds: {
  camera?: string;
  logo?: string;
  headline?: string;
  ctaButton?: string;
}): AnimationClip[] {
  const clips: AnimationClip[] = [];
  if (actorIds.camera) clips.push(createDollyZoomClip(actorIds.camera));
  if (actorIds.logo) clips.push(offsetClipTimes(createMaterializeClip(actorIds.logo), 0.3));
  if (actorIds.headline) clips.push(offsetClipTimes(createTypewriterClip(actorIds.headline), 0.8));
  if (actorIds.ctaButton) clips.push(offsetClipTimes(createScalePopClip(actorIds.ctaButton), 1.4));
  return clips;
}

export function createProductShowcasePreset(actorIds: {
  product: string;
  camera?: string;
}): AnimationClip[] {
  const clips = [createOrbitalRotationClip(actorIds.product)];
  if (actorIds.camera) clips.push(createCinematicOrbitClip(actorIds.camera));
  return clips;
}

export function createServiceCardHoverClip(actorId: string): AnimationClip {
  return buildClip('Service Card Hover', 0.2, [
    vec3AxisTrack(actorId, 'position', 1, [
      { time: 0, value: 0, easing: 'easeOut' },
      { time: 0.2, value: 0.05, easing: 'easeOut' },
    ]),
    numberTrack(actorId, 'MeshRendererComponent', 'emissiveIntensity', [
      { time: 0, value: 0, easing: 'easeOut' },
      { time: 0.2, value: 0.3, easing: 'easeOut' },
    ]),
  ]);
}

// --- Game Builder ---

export function createCoinPickupClip(actorId: string): AnimationClip {
  return buildClip(
    'Coin Pickup',
    0.5,
    [
      vec3AxisTrack(actorId, 'rotation', 1, [
        { time: 0, value: 0, easing: 'linear' },
        { time: 0.5, value: Math.PI * 2, easing: 'linear' },
      ]),
      vec3AxisTrack(actorId, 'position', 1, [
        { time: 0, value: 0, easing: 'easeInOut' },
        { time: 0.5, value: 0.3, easing: 'easeInOut' },
      ]),
      numberTrack(actorId, 'MeshRendererComponent', 'emissiveIntensity', [
        { time: 0, value: 0.5, easing: 'linear' },
        { time: 0.25, value: 2, easing: 'easeOut' },
        { time: 0.5, value: 0, easing: 'easeIn' },
      ]),
      numberTrack(actorId, 'MeshRendererComponent', 'opacity', [
        { time: 0, value: 1, easing: 'linear' },
        { time: 0.4, value: 1, easing: 'linear' },
        { time: 0.5, value: 0, easing: 'linear' },
      ]),
    ],
    {
      markers: [createAnimationMarker({ time: 0.4, label: 'Collected', eventName: 'coin_collected' })],
    },
  );
}

export function createTreasureChestOpenClip(
  lidActorId: string,
  options?: { duration?: number; lidOpenDeg?: number },
): AnimationClip {
  const duration = options?.duration ?? 1.2;
  const openRad = ((options?.lidOpenDeg ?? -110) * Math.PI) / 180;
  return buildClip(
    'Treasure Chest Open',
    duration,
    [
      vec3AxisTrack(lidActorId, 'rotation', 0, [
        { time: 0, value: 0, easing: 'easeOut' },
        { time: duration, value: openRad, easing: 'easeOut' },
      ]),
    ],
    {
      markers: [
        createAnimationMarker({ time: 0, label: 'Open', eventName: 'chest_open' }),
        createAnimationMarker({ time: 0.3, label: 'Particles', eventName: 'chest_particles' }),
      ],
    },
  );
}

export function createDoorOpenClip(
  doorActorId: string,
  options?: { duration?: number; openDeg?: number; easing?: EasingPreset },
): AnimationClip {
  const duration = options?.duration ?? 0.8;
  const openRad = ((options?.openDeg ?? -90) * Math.PI) / 180;
  const easing = options?.easing ?? 'easeOut';
  return buildClip(
    'Door Open',
    duration,
    [
      vec3AxisTrack(doorActorId, 'rotation', 1, [
        { time: 0, value: 0, easing },
        { time: duration, value: openRad, easing },
      ]),
    ],
    {
      markers: [
        createAnimationMarker({ time: 0.05, label: 'Creak', eventName: 'door_creak' }),
        createAnimationMarker({ time: 0.1, label: 'Shake', eventName: 'camera_shake' }),
      ],
    },
  );
}

export function createEnemyDeathClip(actorId: string): AnimationClip {
  return buildClip(
    'Enemy Death',
    0.6,
    [
      numberTrack(actorId, 'MeshRendererComponent', 'emissiveIntensity', [
        { time: 0, value: 0, easing: 'step' },
        { time: 0.05, value: 5, easing: 'step' },
        { time: 0.1, value: 0, easing: 'step' },
      ]),
      numberTrack(actorId, 'MeshRendererComponent', 'dissolveProgress', [
        { time: 0, value: 1, easing: 'easeIn' },
        { time: 0.6, value: 0, easing: 'easeIn' },
      ]),
      numberTrack(actorId, 'MeshRendererComponent', 'opacity', [
        { time: 0, value: 1, easing: 'linear' },
        { time: 0.6, value: 0, easing: 'linear' },
      ]),
    ],
    {
      markers: [
        createAnimationMarker({ time: 0, label: 'Death FX', eventName: 'enemy_death_particles' }),
        createAnimationMarker({ time: 0, label: 'Death SFX', eventName: 'enemy_death_sound' }),
      ],
    },
  );
}

export function createMaskWipeClip(
  actorId: string,
  options?: {
    duration?: number;
    direction?: 'in' | 'out';
    easing?: EasingPreset;
    shape?: MaskWipeShape;
  },
): AnimationClip {
  const duration = options?.duration ?? 1;
  const direction = options?.direction ?? 'in';
  const easing = options?.easing ?? 'easeInOut';
  const from = direction === 'in' ? 0 : 1;
  const to = direction === 'in' ? 1 : 0;
  void options?.shape;
  return buildClip(`Mask Wipe ${direction}`, duration, [
    numberTrack(actorId, 'MaskWipeComponent', 'progress', [
      { time: 0, value: from, easing },
      { time: duration, value: to, easing },
    ]),
  ]);
}

export function createWeaponSwingTrailClip(
  actorId: string,
  options?: { swingDuration?: number; fadeDuration?: number },
): AnimationClip {
  const swing = options?.swingDuration ?? 0.3;
  const fade = options?.fadeDuration ?? 0.4;
  const duration = swing + fade;
  return buildClip('Weapon Swing Trail', duration, [
    booleanTrack(actorId, 'WeaponTrailComponent', 'enabled', [
      { time: 0, value: false, easing: 'step' },
      { time: 0.001, value: true, easing: 'step' },
      { time: swing, value: true, easing: 'step' },
      { time: swing + 0.001, value: false, easing: 'step' },
    ]),
  ]);
}

/** Animate {@link ArticulationComponent.progress} between two normalized values. */
export function createArticulationProgressClip(
  actorId: string,
  options: {
    name?: string;
    from?: number;
    to?: number;
    duration?: number;
    easing?: EasingPreset;
  },
): AnimationClip {
  const duration = options.duration ?? 0.6;
  const from = options.from ?? 0;
  const to = options.to ?? 1;
  const easing = options.easing ?? 'easeInOut';
  return buildClip(options.name ?? 'Articulation', duration, [
    numberTrack(actorId, 'ArticulationComponent', 'progress', [
      { time: 0, value: from, easing },
      { time: duration, value: to, easing },
    ]),
  ]);
}

/**
 * Sample a full sine cycle as linear keyframes.
 * Linear segments through a dense sine avoid the zero-velocity "pause" that
 * chained `easeInOut` segments create at every keyframe.
 */
function sineLoopKeyframes(
  duration: number,
  center: number,
  amplitude: number,
  options?: { samples?: number; phase?: number },
): KeyframeSpec[] {
  const samples = Math.max(8, options?.samples ?? 24);
  const phase = options?.phase ?? 0;
  const keyframes: KeyframeSpec[] = [];
  for (let i = 0; i <= samples; i++) {
    const u = i / samples;
    keyframes.push({
      time: duration * u,
      value: center + amplitude * Math.sin(u * Math.PI * 2 + phase),
      easing: 'linear',
    });
  }
  return keyframes;
}

/** Constant hold across a clip (linear; value never changes). */
function holdKeyframes(duration: number, value: number): KeyframeSpec[] {
  return [
    { time: 0, value, easing: 'linear' },
    { time: duration, value, easing: 'linear' },
  ];
}

/**
 * Subtle hovering bob for museum downlights / floating props.
 * Loops a sine-smoothed Y offset plus optional tip so fixtures feel alive
 * without pausing at interval boundaries.
 */
export function createHoverClip(
  actorId: string,
  options?: {
    /** Resting world Y (center of the bob). */
    restY?: number;
    /** Peak bob amplitude in meters. */
    amplitude?: number;
    /** Full cycle length in seconds. */
    duration?: number;
    /** Resting X/Z (held constant). Defaults to 0,0 when omitted — prefer passing real values. */
    restX?: number;
    restZ?: number;
    /**
     * Optional tip rotation in radians around X (nod toward -Z) or Z (nod toward +X).
     * Applied as a gentle sine sway around the rest pose (same phase as Y bob).
     */
    tipAxis?: 'x' | 'z';
    tipAmplitude?: number;
    restRotX?: number;
    restRotY?: number;
    restRotZ?: number;
    /** Keyframes per cycle for the sine approximation (default 24). */
    samples?: number;
  },
): AnimationClip {
  const duration = options?.duration ?? 2.8;
  const amp = options?.amplitude ?? 0.06;
  const restY = options?.restY ?? 0;
  const restX = options?.restX ?? 0;
  const restZ = options?.restZ ?? 0;
  const tipAxis = options?.tipAxis;
  const tipAmp = options?.tipAmplitude ?? 0.04;
  const rx = options?.restRotX ?? 0;
  const ry = options?.restRotY ?? 0;
  const rz = options?.restRotZ ?? 0;
  const samples = options?.samples ?? 24;

  const tracks = [
    vec3AxisTrack(actorId, 'position', 0, holdKeyframes(duration, restX)),
    vec3AxisTrack(actorId, 'position', 1, sineLoopKeyframes(duration, restY, amp, { samples })),
    vec3AxisTrack(actorId, 'position', 2, holdKeyframes(duration, restZ)),
  ];

  if (tipAxis === 'x') {
    tracks.push(
      vec3AxisTrack(actorId, 'rotation', 0, sineLoopKeyframes(duration, rx, tipAmp, { samples })),
      vec3AxisTrack(actorId, 'rotation', 1, holdKeyframes(duration, ry)),
      vec3AxisTrack(actorId, 'rotation', 2, holdKeyframes(duration, rz)),
    );
  } else if (tipAxis === 'z') {
    tracks.push(
      vec3AxisTrack(actorId, 'rotation', 0, holdKeyframes(duration, rx)),
      vec3AxisTrack(actorId, 'rotation', 1, holdKeyframes(duration, ry)),
      vec3AxisTrack(actorId, 'rotation', 2, sineLoopKeyframes(duration, rz, tipAmp, { samples })),
    );
  }

  return buildClip('Hover', duration, tracks, { tags: ['hover', 'loop'] });
}

/**
 * Gentle pendulum sway for hanging props (chandeliers, signs).
 * Holds world position; tips rotation around X/Z from a rest pose.
 */
export function createSwayClip(
  actorId: string,
  options?: {
    duration?: number;
    tipAmplitude?: number;
    restX?: number;
    restY?: number;
    restZ?: number;
    restRotX?: number;
    restRotY?: number;
    restRotZ?: number;
  },
): AnimationClip {
  const duration = options?.duration ?? 5.5;
  const tip = options?.tipAmplitude ?? 0.045;
  const restX = options?.restX ?? 0;
  const restY = options?.restY ?? 0;
  const restZ = options?.restZ ?? 0;
  const rx = options?.restRotX ?? 0;
  const ry = options?.restRotY ?? 0;
  const rz = options?.restRotZ ?? 0;
  const t0 = 0;
  const t1 = duration * 0.25;
  const t2 = duration * 0.5;
  const t3 = duration * 0.75;
  const t4 = duration;

  return buildClip(
    'Sway',
    duration,
    [
      vec3AxisTrack(actorId, 'position', 0, [
        { time: t0, value: restX, easing: 'linear' },
        { time: t4, value: restX, easing: 'linear' },
      ]),
      vec3AxisTrack(actorId, 'position', 1, [
        { time: t0, value: restY, easing: 'linear' },
        { time: t4, value: restY, easing: 'linear' },
      ]),
      vec3AxisTrack(actorId, 'position', 2, [
        { time: t0, value: restZ, easing: 'linear' },
        { time: t4, value: restZ, easing: 'linear' },
      ]),
      vec3AxisTrack(actorId, 'rotation', 0, [
        { time: t0, value: rx, easing: 'easeInOut' },
        { time: t1, value: rx + tip, easing: 'easeInOut' },
        { time: t2, value: rx, easing: 'easeInOut' },
        { time: t3, value: rx - tip * 0.85, easing: 'easeInOut' },
        { time: t4, value: rx, easing: 'easeInOut' },
      ]),
      vec3AxisTrack(actorId, 'rotation', 1, [
        { time: t0, value: ry, easing: 'linear' },
        { time: t4, value: ry, easing: 'linear' },
      ]),
      vec3AxisTrack(actorId, 'rotation', 2, [
        { time: t0, value: rz, easing: 'easeInOut' },
        { time: t1, value: rz - tip * 0.55, easing: 'easeInOut' },
        { time: t2, value: rz, easing: 'easeInOut' },
        { time: t3, value: rz + tip * 0.7, easing: 'easeInOut' },
        { time: t4, value: rz, easing: 'easeInOut' },
      ]),
    ],
    { tags: ['sway', 'loop'] },
  );
}

/**
 * Candle / powered-light intensity flicker on {@link LightComponent}.
 */
export function createLightFlickerClip(
  actorId: string,
  options?: {
    /** Nominal intensity at rest. */
    baseIntensity?: number;
    /** Peak relative dip/boost amount (fraction of base). */
    flickerAmount?: number;
    duration?: number;
  },
): AnimationClip {
  const duration = options?.duration ?? 3.2;
  const base = options?.baseIntensity ?? 1;
  const amt = options?.flickerAmount ?? 0.12;
  const keyframes = [
    { time: 0, value: base, easing: 'linear' as const },
    { time: duration * 0.12, value: base * (1 - amt * 0.55), easing: 'linear' as const },
    { time: duration * 0.22, value: base * (1 + amt * 0.25), easing: 'linear' as const },
    { time: duration * 0.38, value: base * (1 - amt * 0.35), easing: 'linear' as const },
    { time: duration * 0.55, value: base, easing: 'linear' as const },
    { time: duration * 0.68, value: base * (1 - amt * 0.9), easing: 'step' as const },
    { time: duration * 0.72, value: base * (1 + amt * 0.15), easing: 'linear' as const },
    { time: duration * 0.88, value: base * (1 - amt * 0.2), easing: 'linear' as const },
    { time: duration, value: base, easing: 'linear' as const },
  ];
  return buildClip(
    'LightFlicker',
    duration,
    [numberTrack(actorId, 'LightComponent', 'intensity', keyframes)],
    { tags: ['flicker', 'loop'] },
  );
}

/**
 * Soft walking bob for a camera (play-mode footfall feel).
 * Holds X/Z; gently lifts Y and nods pitch.
 */
export function createCameraBobClip(
  actorId: string,
  options?: {
    restX?: number;
    restY?: number;
    restZ?: number;
    restRotX?: number;
    restRotY?: number;
    restRotZ?: number;
    amplitude?: number;
    tipAmplitude?: number;
    duration?: number;
  },
): AnimationClip {
  const duration = options?.duration ?? 1.15;
  const amp = options?.amplitude ?? 0.028;
  const tip = options?.tipAmplitude ?? 0.012;
  const restX = options?.restX ?? 0;
  const restY = options?.restY ?? 1.6;
  const restZ = options?.restZ ?? 0;
  const rx = options?.restRotX ?? 0;
  const ry = options?.restRotY ?? 0;
  const rz = options?.restRotZ ?? 0;
  const t0 = 0;
  const t1 = duration * 0.5;
  const t2 = duration;

  return buildClip(
    'CameraBob',
    duration,
    [
      vec3AxisTrack(actorId, 'position', 0, [
        { time: t0, value: restX, easing: 'linear' },
        { time: t2, value: restX, easing: 'linear' },
      ]),
      vec3AxisTrack(actorId, 'position', 1, [
        { time: t0, value: restY, easing: 'easeInOut' },
        { time: t1, value: restY + amp, easing: 'easeInOut' },
        { time: t2, value: restY, easing: 'easeInOut' },
      ]),
      vec3AxisTrack(actorId, 'position', 2, [
        { time: t0, value: restZ, easing: 'linear' },
        { time: t2, value: restZ, easing: 'linear' },
      ]),
      vec3AxisTrack(actorId, 'rotation', 0, [
        { time: t0, value: rx, easing: 'easeInOut' },
        { time: t1, value: rx - tip, easing: 'easeInOut' },
        { time: t2, value: rx, easing: 'easeInOut' },
      ]),
      vec3AxisTrack(actorId, 'rotation', 1, [
        { time: t0, value: ry, easing: 'linear' },
        { time: t2, value: ry, easing: 'linear' },
      ]),
      vec3AxisTrack(actorId, 'rotation', 2, [
        { time: t0, value: rz, easing: 'linear' },
        { time: t2, value: rz, easing: 'linear' },
      ]),
    ],
    { tags: ['camera-bob', 'loop'] },
  );
}

/**
 * Looping hallway walk (ping-pong along Z) with a light footfall bob.
 */
export function createWalkLoopClip(
  actorId: string,
  options?: {
    restX?: number;
    restY?: number;
    zStart?: number;
    zEnd?: number;
    duration?: number;
    bobAmplitude?: number;
  },
): AnimationClip {
  const duration = options?.duration ?? 28;
  const restX = options?.restX ?? 0;
  const restY = options?.restY ?? 1.0;
  const z0 = options?.zStart ?? -18;
  const z1 = options?.zEnd ?? 18;
  const bob = options?.bobAmplitude ?? 0.04;
  const t0 = 0;
  const t1 = duration * 0.5;
  const t2 = duration;

  return buildClip(
    'WalkLoop',
    duration,
    [
      vec3AxisTrack(actorId, 'position', 0, [
        { time: t0, value: restX, easing: 'linear' },
        { time: t2, value: restX, easing: 'linear' },
      ]),
      vec3AxisTrack(actorId, 'position', 1, [
        { time: t0, value: restY, easing: 'easeInOut' },
        { time: duration * 0.125, value: restY + bob, easing: 'easeInOut' },
        { time: duration * 0.25, value: restY, easing: 'easeInOut' },
        { time: duration * 0.375, value: restY + bob, easing: 'easeInOut' },
        { time: t1, value: restY, easing: 'easeInOut' },
        { time: duration * 0.625, value: restY + bob, easing: 'easeInOut' },
        { time: duration * 0.75, value: restY, easing: 'easeInOut' },
        { time: duration * 0.875, value: restY + bob, easing: 'easeInOut' },
        { time: t2, value: restY, easing: 'easeInOut' },
      ]),
      vec3AxisTrack(actorId, 'position', 2, [
        { time: t0, value: z0, easing: 'linear' },
        { time: t1, value: z1, easing: 'linear' },
        { time: t2, value: z0, easing: 'linear' },
      ]),
    ],
    { tags: ['walk', 'loop'] },
  );
}

