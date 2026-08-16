import { describe, expect, it } from 'vitest';
import { ATTRACT_DIFFICULTY_TIME, COUNTDOWN_SECONDS, FRAGMENT_MAX_MULT_TIME, MAX_MULTIPLIER, MAX_REWINDS, NEAR_MISS_TIME, PLAYER_Y, REWIND_REGEN_INTERVAL } from './config';
import { hitsObstacle, makePlayerSphere } from './collision';
import { difficultyAt } from './difficulty';
import { everyGatePassable, layoutDoubleGate } from './passability';
import { OneMoreSecondSimulation } from './simulation';
import type { SimObstacle } from './types';

function makeSafe(sim: OneMoreSecondSimulation): void {
  const s = sim.capture();
  sim.restore({
    ...s,
    obstacles: [],
    fragments: [],
    nextFillZ: 10_000,
  });
}

function skipCinematic(sim: OneMoreSecondSimulation): void {
  for (let i = 0; i < 360; i++) {
    if (sim.phase === 'playing' || sim.phase === 'dead' || sim.phase === 'attract') return;
    sim.tick(1 / 60, { steer: 0, rewind: false, restart: false });
  }
}

function hold(sim: OneMoreSecondSimulation, seconds: number, steer = 0): void {
  const steps = Math.ceil(seconds * 60);
  const dt = seconds / steps;
  for (let i = 0; i < steps; i++) {
    sim.tick(dt, { steer, rewind: false, restart: false });
  }
}

describe('OneMoreSecondSimulation', () => {
  it('starts with three rewind charges and a living player', () => {
    const sim = new OneMoreSecondSimulation(42);
    sim.start('playing');
    const r = sim.readout();
    expect(r.phase).toBe('playing');
    expect(r.rewindCharges).toBe(MAX_REWINDS);
    expect(r.obstacles.length).toBeGreaterThan(0);
  });

  it('accumulates time and score while surviving', () => {
    const sim = new OneMoreSecondSimulation(7);
    sim.start('playing');
    makeSafe(sim);
    hold(sim, 1.2);
    const r = sim.readout();
    expect(r.timeAlive).toBeGreaterThan(1.1);
    expect(r.score).toBeGreaterThan(8);
    expect(r.distance).toBeGreaterThan(10);
  });

  it('clamps the player inside the corridor', () => {
    const sim = new OneMoreSecondSimulation(3);
    sim.start('playing');
    makeSafe(sim);
    hold(sim, 2, 1);
    expect(sim.readout().playerX).toBeLessThanOrEqual(sim.readout().halfWidth);
  });

  it('plays the map backward then counts down before continuing', () => {
    const sim = new OneMoreSecondSimulation(99);
    sim.start('playing');
    makeSafe(sim);
    hold(sim, 1.25);
    const before = sim.readout().timeAlive;
    const beforeDist = sim.readout().distance;
    const ev = sim.tick(1 / 60, { steer: 0, rewind: true, restart: false });
    expect(ev.rewindUsed).toBe(true);
    expect(sim.rewindCharges).toBe(MAX_REWINDS - 1);
    expect(sim.phase).toBe('rewinding');
    expect(sim.readout().timeAlive).toBeGreaterThan(before - 0.2);

    const distances: number[] = [sim.readout().distance];
    for (let i = 0; i < 70; i++) {
      sim.tick(1 / 60, { steer: 0, rewind: false, restart: false });
      distances.push(sim.readout().distance);
    }
    expect(distances[distances.length - 1]!).toBeLessThan(beforeDist);
    expect(sim.phase).toBe('countdown');
    expect(sim.readout().countdown).toBeGreaterThan(2);

    hold(sim, COUNTDOWN_SECONDS + 0.15);
    expect(sim.phase).toBe('playing');
    expect(sim.readout().timeAlive).toBeLessThan(before - 0.6);
    expect(sim.readout().rewindCooldown).toBeGreaterThan(0);
  });

  it('rejects rewind during cooldown after the countdown finishes', () => {
    const sim = new OneMoreSecondSimulation(5);
    sim.start('playing');
    makeSafe(sim);
    hold(sim, 1.2);
    sim.tick(1 / 60, { steer: 0, rewind: true, restart: false });
    skipCinematic(sim);
    const charges = sim.rewindCharges;
    const ev = sim.tick(1 / 60, { steer: 0, rewind: true, restart: false });
    expect(ev.rewindUsed).toBe(false);
    expect(sim.rewindCharges).toBe(charges);
  });

  it('regenerates a charge after 15 seconds', () => {
    const sim = new OneMoreSecondSimulation(11);
    sim.start('playing');
    makeSafe(sim);
    hold(sim, 1.2);
    sim.tick(1 / 60, { steer: 0, rewind: true, restart: false });
    skipCinematic(sim);
    expect(sim.rewindCharges).toBe(MAX_REWINDS - 1);
    hold(sim, REWIND_REGEN_INTERVAL + 0.2);
    expect(sim.rewindCharges).toBe(MAX_REWINDS);
  });

  it('restarts from the death card on any restart input', () => {
    const sim = new OneMoreSecondSimulation(1);
    sim.start('playing');
    // Force a crash by teleporting into a blocker via restore.
    const snap = sim.capture();
    const blocker = snap.obstacles[0];
    if (blocker) {
      sim.restore({
        ...snap,
        playerX: blocker.x,
        obstacles: [{ ...blocker, z: 0, x: blocker.x }],
      });
    }
    sim.tick(1 / 60, { steer: 0, rewind: false, restart: false });
    expect(['crash', 'dead', 'playing']).toContain(sim.phase);
    if (sim.phase === 'crash') {
      hold(sim, 0.6);
    }
    if (sim.phase === 'dead') {
      const ev = sim.tick(1 / 60, { steer: 0, rewind: false, restart: true });
      expect(ev.restarted).toBe(true);
      expect(sim.phase).toBe('playing');
    }
  });

  it('rewinds the hit from the death card instead of starting a new run', () => {
    const sim = new OneMoreSecondSimulation(9);
    sim.start('playing');
    makeSafe(sim);
    hold(sim, 1.3);
    const before = sim.readout().timeAlive;
    const snap = sim.capture();
    sim.restore({
      ...snap,
      playerX: 0,
      obstacles: [
        {
          id: 99,
          kind: 'block',
          x: 0,
          y: PLAYER_Y,
          z: 0,
          halfW: 2,
          halfH: 1,
          halfD: 1,
          xBase: 0,
          xAmp: 0,
          xFreq: 0,
          xPhase: 0,
          gateId: 0,
          holeX: 0,
          nearMissGranted: false,
          fragmentId: 0,
        },
      ],
    });
    sim.tick(1 / 60, { steer: 0, rewind: false, restart: false });
    if (sim.phase === 'crash') hold(sim, 0.6);
    expect(sim.phase).toBe('dead');
    const ev = sim.tick(1 / 60, { steer: 0, rewind: true, restart: false });
    expect(ev.rewindUsed).toBe(true);
    expect(ev.restarted).toBe(false);
    expect(sim.phase).toBe('rewinding');
    skipCinematic(sim);
    expect(sim.phase).toBe('playing');
    expect(sim.readout().timeAlive).toBeLessThan(before);
  });

  it('attract mode does not spend lives on collisions', () => {
    const sim = new OneMoreSecondSimulation(2);
    sim.start('attract');
    hold(sim, 4);
    expect(sim.phase).toBe('attract');
    expect(sim.readout().score).toBe(0);
  });

  it('attract never overlaps the player sphere with obstacles', () => {
    for (const seed of [1, 2, 3, 7, 11, 42, 99]) {
      const sim = new OneMoreSecondSimulation(seed);
      sim.start('attract');
      for (let i = 0; i < 480; i++) {
        sim.tick(1 / 60, { steer: 0, rewind: false, restart: false });
        const r = sim.readout();
        const player = makePlayerSphere(r.playerX, r.playerY, r.playerZ);
        for (const o of r.obstacles) {
          expect(hitsObstacle(player, o), `seed ${seed} frame ${i} id ${o.id}`).toBe(false);
        }
      }
    }
  });

  it('freezes attract difficulty so the title screen does not ramp to late-game', () => {
    const sim = new OneMoreSecondSimulation(8);
    sim.start('attract');
    hold(sim, 8);
    const expected = difficultyAt(ATTRACT_DIFFICULTY_TIME);
    expect(sim.readout().speed).toBeCloseTo(expected.speed, 5);
    expect(sim.readout().halfWidth).toBeCloseTo(expected.halfWidth, 5);
  });

  it('keeps late-game filled gates passable', () => {
    const sim = new OneMoreSecondSimulation(21);
    sim.start('playing');
    const snap = sim.capture();
    sim.restore({
      ...snap,
      timeAlive: 130,
      obstacles: [],
      fragments: [],
      nextFillZ: 8,
    });
    sim.tick(1 / 60, { steer: 0, rewind: false, restart: false });
    const r = sim.readout();
    expect(everyGatePassable(r.obstacles, r.halfWidth)).toBe(true);
  });

  it('slides an upcoming double hole off a player who camps at x=0', () => {
    const sim = new OneMoreSecondSimulation(21);
    sim.start('playing');
    const snap = sim.capture();
    const left: SimObstacle = {
      id: 1,
      kind: 'moving',
      x: -2,
      y: PLAYER_Y,
      z: 52,
      halfW: 0.5,
      halfH: 0.88,
      halfD: 0.4,
      xBase: -2,
      xAmp: 0.45,
      xFreq: 1,
      xPhase: 0,
      gateId: 11,
      holeX: 0,
      nearMissGranted: false,
      fragmentId: 0,
    };
    const right: SimObstacle = {
      ...left,
      id: 2,
      x: 2,
      xBase: 2,
    };
    layoutDoubleGate([left, right], 0, snap.halfWidth);
    sim.restore({
      ...snap,
      playerX: 0,
      playerVx: 0,
      obstacles: [left, right],
      fragments: [],
      nextFillZ: 10_000,
    });
    hold(sim, 2.4);
    expect(sim.phase).toBe('playing');
    const pair = sim.readout().obstacles.filter((o) => o.gateId === 11);
    expect(pair.length).toBe(2);
    expect(Math.abs(pair[0]!.holeX)).toBeGreaterThan(0.55);
    expect(everyGatePassable(pair, sim.readout().halfWidth)).toBe(true);
  });

  it('adds half a second to the scored timer for each near miss', () => {
    const sim = new OneMoreSecondSimulation(1);
    sim.start('playing');
    makeSafe(sim);
    hold(sim, 0.2);
    const snap = sim.capture();
    sim.restore({
      ...snap,
      playerX: 0.9,
      playerVx: 0,
      obstacles: [
        {
          id: 99,
          kind: 'block',
          x: 0,
          y: PLAYER_Y,
          z: 0.2,
          halfW: 0.5,
          halfH: 0.9,
          halfD: 0.4,
          xBase: 0,
          xAmp: 0,
          xFreq: 0,
          xPhase: 0,
          gateId: 0,
          holeX: 0,
          nearMissGranted: false,
          fragmentId: 0,
        },
      ],
      fragments: [],
      nextFillZ: 10_000,
    });

    const elapsedBefore = sim.readout().timeAlive;
    const events = sim.tick(1 / 60, { steer: 0, rewind: false, restart: false });
    expect(events.nearMiss).toBe(true);
    expect(sim.readout().scoredTime).toBeCloseTo(elapsedBefore + 1 / 60 + NEAR_MISS_TIME, 5);
    expect(sim.readout().speed).toBeCloseTo(difficultyAt(sim.readout().timeAlive).speed, 5);

    const scored = sim.readout().scoredTime;
    sim.tick(1 / 60, { steer: 0, rewind: false, restart: false });
    expect(sim.readout().scoredTime).toBeCloseTo(scored + 1 / 60, 5);
  });

  it('adds half a second when a fragment is collected at max multiplier', () => {
    const sim = new OneMoreSecondSimulation(1);
    sim.start('playing');
    makeSafe(sim);
    hold(sim, 0.2);
    const snap = sim.capture();
    sim.restore({
      ...snap,
      multiplier: MAX_MULTIPLIER,
      playerX: 0,
      playerVx: 0,
      obstacles: [],
      fragments: [
        {
          id: 7,
          x: 0,
          y: PLAYER_Y,
          z: 0,
          radius: 0.4,
          collected: false,
        },
      ],
      nextFillZ: 10_000,
    });
    const elapsedBefore = sim.readout().timeAlive;
    const events = sim.tick(1 / 60, { steer: 0, rewind: false, restart: false });
    expect(events.fragment).toBe(true);
    expect(sim.readout().scoredTime).toBeCloseTo(elapsedBefore + 1 / 60 + FRAGMENT_MAX_MULT_TIME, 5);
  });

  it('does not add fragment time when the multiplier is below max', () => {
    const sim = new OneMoreSecondSimulation(1);
    sim.start('playing');
    makeSafe(sim);
    hold(sim, 0.2);
    const snap = sim.capture();
    sim.restore({
      ...snap,
      multiplier: 2,
      playerX: 0,
      playerVx: 0,
      obstacles: [],
      fragments: [
        {
          id: 8,
          x: 0,
          y: PLAYER_Y,
          z: 0,
          radius: 0.4,
          collected: false,
        },
      ],
      nextFillZ: 10_000,
    });
    const elapsedBefore = sim.readout().timeAlive;
    const events = sim.tick(1 / 60, { steer: 0, rewind: false, restart: false });
    expect(events.fragment).toBe(true);
    expect(sim.readout().scoredTime).toBeCloseTo(elapsedBefore + 1 / 60, 5);
  });
});
