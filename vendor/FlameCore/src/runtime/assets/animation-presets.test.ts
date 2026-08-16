import { describe, expect, it } from 'vitest';
import {
  createFadeInClip,
  createFloatingHoverClip,
  createBounceClip,
  createCameraBobClip,
  createHeroEntrancePreset,
  createHoverClip,
  createLightFlickerClip,
  createScalePopClip,
  createSlideInClip,
  createStaggerRevealClips,
  createSwayClip,
  createTypewriterClip,
  createWalkLoopClip,
} from './animation-presets';

describe('animation-presets', () => {
  it('createTypewriterClip returns _version:2 clip', () => {
    const clip = createTypewriterClip('actor-1');
    expect(clip._version).toBe(2);
    expect(clip.tracks[0].descriptor.componentType).toBe('TextComponent');
    expect(clip.tracks[0].descriptor.propertyPath).toBe('revealProgress');
    expect(clip.tracks[0].keyframes[0].value).toBe(0);
    expect(clip.tracks[0].keyframes[1].value).toBe(1);
  });

  it('createFadeInClip targets provided componentType', () => {
    const clip = createFadeInClip('actor-1', 'UILabelComponent');
    expect(clip.tracks[0].descriptor.componentType).toBe('UILabelComponent');
    expect(clip.tracks[0].descriptor.propertyPath).toBe('opacity');
  });

  it('createSlideInClip left targets offset', () => {
    const clip = createSlideInClip('actor-1', { direction: 'left' });
    expect(clip.tracks[0].descriptor.propertyPath).toBe('offset.0');
  });

  it('createSlideInClip bottom targets offset', () => {
    const clip = createSlideInClip('actor-1', { direction: 'bottom' });
    expect(clip.tracks[0].descriptor.propertyPath).toBe('offset.1');
  });

  it('createStaggerRevealClips staggers start times', () => {
    const clips = createStaggerRevealClips(['a', 'b', 'c'], { staggerDelay: 0.1 });
    expect(clips).toHaveLength(3);
    expect(clips[0].tracks[0].keyframes[0].time).toBe(0);
    expect(clips[1].tracks[0].keyframes[0].time).toBeCloseTo(0.1);
    expect(clips[2].tracks[0].keyframes[0].time).toBeCloseTo(0.2);
  });

  it('createScalePopClip has three keyframes for overshoot', () => {
    const clip = createScalePopClip('actor-1');
    expect(clip.tracks[0].keyframes).toHaveLength(3);
    const values = clip.tracks[0].keyframes.map((k) => k.value);
    expect(values[0]).toBeLessThan(1);
    expect(values[1]).toBeGreaterThan(1);
    expect(values[2]).toBe(1);
  });

  it('createFloatingHoverClip produces looping clip', () => {
    const clip = createFloatingHoverClip('actor-1');
    expect(clip.tags).toContain('loop');
  });

  it('createHoverClip bobs Y with sine-linear curves and optional tip', () => {
    const clip = createHoverClip('actor-1', {
      restX: 1,
      restY: 2,
      restZ: 3,
      restRotX: -0.1,
      amplitude: 0.05,
      duration: 2,
      tipAxis: 'x',
      tipAmplitude: 0.04,
      samples: 8,
    });
    expect(clip.tags).toContain('hover');
    expect(clip.tags).toContain('loop');
    const yTrack = clip.tracks.find((t) => t.descriptor.propertyPath === 'position.1');
    const rxTrack = clip.tracks.find((t) => t.descriptor.propertyPath === 'rotation.0');
    expect(yTrack).toBeTruthy();
    expect(rxTrack).toBeTruthy();
    expect(yTrack!.keyframes).toHaveLength(9);
    expect(yTrack!.keyframes.every((kf) => kf.easing === 'linear')).toBe(true);
    expect(yTrack!.keyframes[0].value).toBeCloseTo(2, 5);
    // Quarter cycle peak of sin(π/2)
    expect(yTrack!.keyframes[2].value).toBeCloseTo(2.05, 5);
    expect(yTrack!.keyframes[yTrack!.keyframes.length - 1].value).toBeCloseTo(2, 5);
    expect(rxTrack!.keyframes[0].value).toBeCloseTo(-0.1, 5);
    expect(rxTrack!.keyframes[2].value).toBeCloseTo(-0.06, 5);
  });

  it('createSwayClip and createLightFlickerClip tag as looping life presets', () => {
    const sway = createSwayClip('a', { duration: 4, tipAmplitude: 0.05 });
    expect(sway.tags).toContain('sway');
    const flicker = createLightFlickerClip('b', { baseIntensity: 2, flickerAmount: 0.2 });
    expect(flicker.tags).toContain('flicker');
    expect(flicker.tracks[0].descriptor.componentType).toBe('LightComponent');
    expect(flicker.tracks[0].descriptor.propertyPath).toBe('intensity');
  });

  it('createCameraBobClip and createWalkLoopClip produce transform tracks', () => {
    const bob = createCameraBobClip('cam', { restY: 1.6, duration: 1 });
    expect(bob.tags).toContain('camera-bob');
    const walk = createWalkLoopClip('v', { zStart: -10, zEnd: 10, duration: 20 });
    expect(walk.tags).toContain('walk');
    const zTrack = walk.tracks.find((t) => t.descriptor.propertyPath === 'position.2');
    expect(zTrack!.keyframes[0].value).toBe(-10);
    expect(zTrack!.keyframes[1].value).toBe(10);
  });

  it('createBounceClip plants the bottom on groundY through squash', () => {
    const groundY = -0.5;
    const radius = 0.5;
    const clip = createBounceClip('actor-1', { groundY, radius, height: 1.5, duration: 1 });
    const yTrack = clip.tracks.find((t) => t.descriptor.propertyPath === 'position.1');
    const scaleY = clip.tracks.find((t) => t.descriptor.propertyPath === 'scale.1');
    expect(yTrack).toBeTruthy();
    expect(scaleY).toBeTruthy();
    const squashY = scaleY!.keyframes[0].value as number;
    const contactCenter = yTrack!.keyframes[0].value as number;
    const bottom = contactCenter - radius * squashY;
    expect(bottom).toBeCloseTo(groundY, 5);
  });

  it('createHeroEntrancePreset returns 4 clips for 4 actors', () => {
    const clips = createHeroEntrancePreset({
      camera: 'cam',
      logo: 'logo',
      headline: 'h1',
      ctaButton: 'cta',
    });
    expect(clips).toHaveLength(4);
  });
});
