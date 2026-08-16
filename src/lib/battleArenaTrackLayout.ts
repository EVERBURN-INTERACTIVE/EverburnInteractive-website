/** Modular sci-fi track kit — placements for the Battle Arena backdrop oval. */

export const SCI_FI_TRACKS_BASE = '/models/sci-fi-tracks';

export const TRACK_PIECE_SCALE = 2.72;

/** Local Y is the along-track axis; lay pieces flat on the XZ plane. */
export const TRACK_FLAT_ROTATION_X = -Math.PI / 2;

const STEP = 4 * TRACK_PIECE_SCALE;

export interface TrackPiecePlacement {
  id: string;
  file: string;
  position: [number, number, number];
  rotationY: number;
}

function straightRow(
  prefix: string,
  startX: number,
  z: number,
  count: number,
  rotationY: number,
): TrackPiecePlacement[] {
  return Array.from({ length: count }, (_, index) => ({
    id: `${prefix}-${index}`,
    file: 'track_straight.glb',
    position: [startX + index * STEP, -0.38, z] as [number, number, number],
    rotationY,
  }));
}

/** Stadium oval behind the menu — tuned for the orthographic Battle Arena camera. */
export const BATTLE_ARENA_TRACK_PLACEMENTS: TrackPiecePlacement[] = [
  ...straightRow('back', -31.5, -35.5, 7, Math.PI / 2),
  ...straightRow('front', -31.5, -12.5, 7, Math.PI / 2),

  { id: 'left-0', file: 'track_straight.glb', position: [-37.8, -0.38, -30.8], rotationY: 0 },
  { id: 'left-1', file: 'track_straight.glb', position: [-37.8, -0.38, -20.2], rotationY: 0 },

  { id: 'right-0', file: 'track_straight.glb', position: [37.8, -0.38, -30.8], rotationY: Math.PI },
  { id: 'right-1', file: 'track_straight.glb', position: [37.8, -0.38, -20.2], rotationY: Math.PI },

  { id: 'c-bl', file: 'track_curveleft_90.glb', position: [-35.2, -0.38, -33.8], rotationY: Math.PI / 2 },
  { id: 'c-br', file: 'track_curveright_90.glb', position: [35.2, -0.38, -33.8], rotationY: -Math.PI / 2 },
  { id: 'c-fl', file: 'track_curveright_90.glb', position: [-35.2, -0.38, -14.2], rotationY: Math.PI / 2 },
  { id: 'c-fr', file: 'track_curveleft_90.glb', position: [35.2, -0.38, -14.2], rotationY: -Math.PI / 2 },

  { id: 'boost', file: 'track_boost.glb', position: [0, -0.38, -35.5], rotationY: Math.PI / 2 },
  { id: 'boost-2', file: 'track_boost.glb', position: [-15.9, -0.38, -35.5], rotationY: Math.PI / 2 },
  { id: 'jump', file: 'track_jump.glb', position: [15.9, -0.38, -35.5], rotationY: Math.PI / 2 },
  { id: 'slow', file: 'track_slow.glb', position: [-23.7, -0.38, -12.5], rotationY: Math.PI / 2 },
  { id: 'slow-2', file: 'track_slow.glb', position: [23.7, -0.38, -12.5], rotationY: Math.PI / 2 },
];

export const BATTLE_ARENA_STADIUM = {
  url: '/models/battle-arena-colosseum.glb?v=3',
  position: [0, -4.8, -42] as [number, number, number],
  rotationY: 0,
  targetFootprint: 86,
} as const;

export const BATTLE_ARENA_GROUND = {
  center: [0, -0.52, -24] as [number, number, number],
  size: [96, 58] as [number, number],
} as const;
