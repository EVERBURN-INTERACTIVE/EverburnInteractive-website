/**
 * Tests for AnimationSystem and AnimationPlayerComponent.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Runtime } from '../runtime';
import { Scene } from '../scene/scene';
import { Actor } from '../scene/actor';
import { TransformComponent, makeTransformProps } from '../components/transform.component';
import {
  AnimationPlayerComponent,
  makeAnimationPlayerProps,
} from '../components/animation-player.component';
import { AnimationSystem } from './animation.system';
import {
  createAnimationClip,
  createAnimationTrack,
  createKeyframe,
} from '../assets/animation-clip';
import { AssetDatabase } from '../assets/asset-database';

// Mock WebGLRenderer so tests run under jsdom without a real WebGL context.
vi.mock('three', async (importOriginal) => {
  const actual = await importOriginal<typeof import('three')>();
  return {
    ...actual,
    WebGLRenderer: vi.fn().mockImplementation(function WebGLRenderer() {
      return {
        setSize: vi.fn(),
        setPixelRatio: vi.fn(),
        setClearColor: vi.fn(),
        setClearAlpha: vi.fn(),
        clear: vi.fn(),
        render: vi.fn(),
        dispose: vi.fn(),
        shadowMap: { enabled: false },
        capabilities: { getMaxAnisotropy: (): number => 16 },
        outputColorSpace: actual.SRGBColorSpace,
        toneMapping: actual.ACESFilmicToneMapping,
        toneMappingExposure: 1,
        autoClear: true,
        domElement: document.createElement('canvas'),
      };
    }),
  };
});

describe('AnimationSystem', () => {
  let runtime: Runtime;
  let scene: Scene;
  let actor: Actor;
  let animSystem: AnimationSystem;
  let assetDb: AssetDatabase;

  beforeEach(() => {
    runtime = Runtime.create({ canvas: document.createElement('canvas') });
    scene = new Scene('TestScene');
    runtime.loadScene(scene);

    actor = new Actor('TestActor');
    actor.addComponent(new TransformComponent(makeTransformProps({ position: [0, 0, 0] })));
    scene.add(actor);

    // Get the AnimationSystem that was registered in Runtime.create()
    animSystem = runtime.systems.find((s) => s.name === 'AnimationSystem') as AnimationSystem;
    expect(animSystem).toBeDefined();

    // Create and set asset database
    assetDb = new AssetDatabase();
    animSystem.setAssetDatabase(assetDb);
  });

  it('should register and unregister animation players', () => {
    const player = actor.addComponent(new AnimationPlayerComponent(makeAnimationPlayerProps()));

    // Player should be registered
    expect((animSystem as any)._activePlayers.size).toBe(1);

    // Detach player
    actor.removeComponent(player);

    // Player should be unregistered
    expect((animSystem as any)._activePlayers.size).toBe(0);
  });

  it('should evaluate animation tracks and update component properties', () => {
    // Create an animation clip that animates position.y from 0 to 10 over 1 second
    const clip = createAnimationClip({
      name: 'TestClip',
      duration: 1.0,
      tracks: [
        createAnimationTrack({
          targetActorId: actor.id,
          targetComponentType: 'TransformComponent',
          targetProperty: 'position.1', // position[1] = y
          keyframes: [
            createKeyframe({ time: 0, value: 0, easing: 'linear' }),
            createKeyframe({ time: 1, value: 10, easing: 'linear' }),
          ],
        }),
      ],
    });

    // Add clip to asset database
    assetDb.add({
      id: clip.id,
      type: 'animation-clip',
      name: clip.name,
      path: '/Animations/test.anim',
      inline: clip,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      _version: 1,
      meta: {},
    });

    // Create player with this clip
    const player = actor.addComponent(
      new AnimationPlayerComponent(makeAnimationPlayerProps({ clipId: clip.id, autoplay: true })),
    );

    // Set clip duration on player
    player.clipDuration = clip.duration;

    // Seek to 0.5 seconds (halfway through animation) and ensure player is playing
    player.seek(0.5);
    expect(player.state).toBe('playing'); // autoplay should have started it

    // Manually trigger animation system update
    animSystem.onUpdate(0.016); // One frame

    // Check that position.y was updated (should be ~5)
    const transform = actor.getComponent(TransformComponent);
    // The animation system should have evaluated the track and updated the position
    expect(transform?.props.position[1]).toBeCloseTo(5, 1);

    // Seek to end
    player.seek(1.0);
    animSystem.onUpdate(0.016);

    // Check that position.y is now 10
    expect(transform?.props.position[1]).toBeCloseTo(10, 1);
  });

  it('should handle playback modes correctly', () => {
    const player = actor.addComponent(
      new AnimationPlayerComponent(
        makeAnimationPlayerProps({ playbackMode: 'loop', autoplay: true }),
      ),
    );

    player.clipDuration = 1.0;

    // Advance past the end of the clip
    player.onUpdate(1.5);

    // In loop mode, time should wrap around
    expect(player.time).toBeCloseTo(0.5, 2);

    // Test ping-pong mode
    player.setPlaybackMode('pingPong');
    player.seek(0);
    player.play();

    // Advance to end
    player.onUpdate(1.0);
    expect(player.time).toBeCloseTo(1.0, 2);

    // Advance more - should reverse
    player.onUpdate(0.5);
    expect(player.time).toBeCloseTo(0.5, 2);
  });

  it('should support variable playback rates', () => {
    const player = actor.addComponent(
      new AnimationPlayerComponent(
        makeAnimationPlayerProps({ playbackRate: 2.0, autoplay: true, playbackMode: 'once' }),
      ),
    );

    player.clipDuration = 2.0; // Increase duration so 1 second advance doesn't wrap

    const initialTime = player.time;
    player.onUpdate(0.5); // 0.5 seconds elapsed

    // At 2x speed, should have advanced by 1 second
    expect(player.time).toBeCloseTo(initialTime + 1.0, 2);
  });
});
