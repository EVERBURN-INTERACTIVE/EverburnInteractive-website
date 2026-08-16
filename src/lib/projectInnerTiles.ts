export const WORLD_PORTFOLIO_URL = 'https://phoenixtblaze.github.io/world-portfolio/';

export type ProjectsInnerView = 'tiles' | 'battle-arena-racing';

export type ProjectsInnerTileAction =
  | 'marble-party-overlay'
  | 'world-portfolio-link'
  | 'battle-arena-racing';

export interface ProjectsInnerTileNavigatePayload {
  action: ProjectsInnerTileAction;
  tileWorldPosition: [number, number, number];
}
