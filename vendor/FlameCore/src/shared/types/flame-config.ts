/** Quality preset ids (mirrors runtime {@link QualityPreset}). */
export type FlameQualityPreset = 'low' | 'medium' | 'high' | 'auto';

/**
 * Client project registry schema for repeatable Fiverr gig workflows.
 * Stored as `flame.config.json` at the root of each site under `src/sites/`.
 */
export interface FlameConfig {
  readonly _version: 1;
  /** Human-readable client or project name. */
  name: string;
  /** URL slug / folder name. */
  slug: string;
  /** Template id used to scaffold this site. */
  templateId: 'landing-page' | 'product-viewer' | 'configurator' | 'scroll-animation' | 'blank';
  /** Brand colors (hex strings). */
  brand: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
  };
  /** Default animation style hint for editor presets. */
  animationStyle: 'subtle' | 'cinematic' | 'playful';
  /** Default camera settings applied on bootstrap. */
  camera: {
    fov: number;
    near: number;
    far: number;
  };
  /** Logical asset folder paths relative to project root. */
  assetPaths: {
    meshes: string;
    textures: string;
    audio: string;
  };
  /** Default lighting preset for product/hero scenes. */
  lightingPreset: 'house' | 'apartment-office' | 'studio' | 'product';
  /** Default quality preset for exported sites. */
  qualityPreset: FlameQualityPreset;
  /** Optional scene asset id to load on bootstrap. */
  defaultSceneId?: string;
}

/** Factory for a default flame.config.json object. */
export function makeFlameConfig(
  patch: Partial<Omit<FlameConfig, '_version'>> & { _version?: 1 } = {},
): FlameConfig {
  return {
    _version: 1,
    name: patch.name ?? 'New Client Site',
    slug: patch.slug ?? 'new-client-site',
    templateId: patch.templateId ?? 'blank',
    brand: patch.brand ?? {
      primary: '#2563eb',
      secondary: '#64748b',
      accent: '#f59e0b',
      background: '#0f172a',
    },
    animationStyle: patch.animationStyle ?? 'subtle',
    camera: patch.camera ?? { fov: 50, near: 0.1, far: 1000 },
    assetPaths: patch.assetPaths ?? {
      meshes: '/Meshes',
      textures: '/Textures',
      audio: '/Audio',
    },
    lightingPreset: patch.lightingPreset ?? 'studio',
    qualityPreset: patch.qualityPreset ?? 'auto',
    ...(patch.defaultSceneId ? { defaultSceneId: patch.defaultSceneId } : {}),
  };
}
