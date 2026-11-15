/**
 * Hosted Mini City demo (formerly world-portfolio on GitHub Pages).
 * Site-relative so local preview and production share the same path.
 */
export const MINI_CITY_URL = '/projects/mini-city/';

/**
 * Hosted Product Viewer demo (formerly Product-Viewer on GitHub Pages).
 * Site-relative so local preview and production share the same path.
 */
export const PRODUCT_VIEWER_URL = '/projects/product-viewer/';

/** @deprecated Use MINI_CITY_URL. Kept for any lingering imports during migration. */
export const WORLD_PORTFOLIO_URL = MINI_CITY_URL;

export type ProjectsInnerView = 'tiles' | 'battle-arena-racing';

export type ProjectsInnerTileAction =
  | 'marble-party-overlay'
  | 'mini-city-link'
  | 'product-viewer-link'
  | 'battle-arena-racing';

export interface ProjectsInnerTileNavigatePayload {
  action: ProjectsInnerTileAction;
  tileWorldPosition: [number, number, number];
}
