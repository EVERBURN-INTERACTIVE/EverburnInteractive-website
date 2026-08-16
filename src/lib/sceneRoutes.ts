/** URL routes for the full-screen 3D campsite experience. Each scene gets its own history entry. */
export const SCENE_HOME = '/';
export const SCENE_PROJECTS = '/projects';
export const SCENE_ONE_MORE_SECOND = '/projects/one-more-second';
/** Previous OMS URL. Still recognized so existing bookmarks open the game. */
export const SCENE_BATTLE_ARENA_LEGACY = '/projects/battle-arena';
export const SCENE_MARBLE_PARTY = '/projects/marble-party';

/** World position of the MARBLE PARTY tile in the projects inner grid (x=-1, z=0). */
export const MARBLE_PARTY_TILE_POSITION: [number, number, number] = [-4, 0, 0];

/** World position of the OUR PROJECTS tile on the campsite grid (x=0, z=1). */
export const OUR_PROJECTS_TILE_POSITION: [number, number, number] = [0, 0, 4];

export const GAMES_OVERLAY_QUERY = 'overlay=games';
export const SCENE_HOME_GAMES_OVERLAY = `/?${GAMES_OVERLAY_QUERY}`;

/** Strip trailing slashes so route checks work with `trailingSlash: true` in Next config. */
export function normalizeScenePathname(pathname: string): string {
  if (!pathname || pathname === '/') {
    return '/';
  }

  return pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
}

export function isSceneCanvasRoute(pathname: string): boolean {
  const path = normalizeScenePathname(pathname);

  return (
    path === SCENE_HOME ||
    path === SCENE_PROJECTS ||
    isOneMoreSecondSceneRoute(path) ||
    path === SCENE_MARBLE_PARTY
  );
}

export function isOneMoreSecondSceneRoute(pathname: string): boolean {
  const path = normalizeScenePathname(pathname);

  return path === SCENE_ONE_MORE_SECOND || path === SCENE_BATTLE_ARENA_LEGACY;
}

export function isProjectsSceneRoute(pathname: string): boolean {
  const path = normalizeScenePathname(pathname);

  return (
    path === SCENE_PROJECTS ||
    isOneMoreSecondSceneRoute(path) ||
    path === SCENE_MARBLE_PARTY
  );
}
