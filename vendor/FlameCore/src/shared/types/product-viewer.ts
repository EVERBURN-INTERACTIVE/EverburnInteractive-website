import type { SerializedComponentProps } from '../types';

/** Built-in lighting preset ids for {@link ProductViewerProps}. */
export type ProductViewerLightingPreset = 'house' | 'apartment-office' | 'studio' | 'product';

/** Serialized {@link ProductViewerComponent} properties (v1). */
export interface ProductViewerProps extends SerializedComponentProps {
  readonly _version: 1;
  /** GLTF/GLB mesh asset to display. */
  meshAssetId?: string;
  /** Lighting preset applied on attach. */
  lightingPreset: ProductViewerLightingPreset;
  /** Enable orbit controls (touch + mouse). */
  enableOrbit: boolean;
  /** Auto-rotate the model when idle. */
  autoRotate: boolean;
  /** Auto-rotate speed in radians per second. */
  autoRotateSpeed: number;
  /** Minimum camera distance (orbit zoom limit). */
  minDistance: number;
  /** Maximum camera distance (orbit zoom limit). */
  maxDistance: number;
  /** Show a placeholder mesh while loading or on error. */
  showPlaceholderOnError: boolean;
}
