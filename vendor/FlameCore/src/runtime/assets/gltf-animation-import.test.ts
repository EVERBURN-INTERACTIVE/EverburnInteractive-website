import { describe, expect, it } from 'vitest';
import * as THREE from 'three';
import { importGltfAnimations } from './gltf-animation-import';
import { bootstrapAnimatablePropertyRegistry } from '../utils/animatable-property-registry';

describe('gltf-animation-import', () => {
  bootstrapAnimatablePropertyRegistry();

  it('converts quaternion rotation tracks to Euler keyframes', () => {
    const times = new Float32Array([0, 1]);
    const values = new Float32Array([
      0, 0, 0, 1,
      0, 0.7071068, 0, 0.7071068,
    ]);
    const track = new THREE.QuaternionKeyframeTrack('Lid.quaternion', times, values);
    const clip = new THREE.AnimationClip('Open', 1, [track]);

    const out = importGltfAnimations({
      clips: [clip],
      actorByNodeName: { Lid: 'actor-lid' },
      namePrefix: 'Test',
    });

    expect(out.length).toBe(1);
    const rotationTrack = out[0].tracks.find((t) => t.descriptor.propertyPath === 'rotation');
    expect(rotationTrack?.keyframes.length).toBe(2);
    const last = rotationTrack?.keyframes[1].value;
    expect(Array.isArray(last)).toBe(true);
    if (Array.isArray(last)) {
      expect(last[1]).toBeCloseTo(Math.PI / 2, 2);
    }
  });

  it('imports morph target influence tracks', () => {
    const times = new Float32Array([0, 1]);
    const values = new Float32Array([0, 1]);
    const track = new THREE.NumberKeyframeTrack('Head.morphTargetInfluences[Smile]', times, values);
    const clip = new THREE.AnimationClip('Morph', 1, [track]);

    const out = importGltfAnimations({
      clips: [clip],
      actorByNodeName: { Head: 'actor-head' },
      namePrefix: 'Test',
    });

    expect(out.length).toBe(1);
    const morphTrack = out[0].tracks.find((t) => t.descriptor.propertyPath.startsWith('morph.'));
    expect(morphTrack?.targetActorId).toBe('actor-head');
    expect(morphTrack?.keyframes[1].value).toBe(1);
  });
});
