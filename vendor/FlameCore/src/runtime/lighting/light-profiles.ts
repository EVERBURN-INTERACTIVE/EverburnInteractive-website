import * as THREE from 'three';

/** Optional MeshPhysicalMaterial extensions for realistic metals. */
export interface LocalLightPhysicalOptions {
  /** Lacquer / clear coat amount in `[0, 1]`. */
  readonly clearcoat?: number;
  /** Clear coat roughness in `[0, 1]`. */
  readonly clearcoatRoughness?: number;
  /** Brushed-metal anisotropy in `[0, 1]`. */
  readonly anisotropy?: number;
  /** Anisotropy tangent rotation in radians. */
  readonly anisotropyRotation?: number;
}

/** Tunable local lighting for one isolated object or archetype. */
export interface LocalLightProfile {
  readonly id: string;
  /** Hemisphere ground / bounce color. */
  readonly groundColor: THREE.ColorRepresentation;
  /** Hemisphere sky color. */
  readonly skyColor: THREE.ColorRepresentation;
  readonly hemiIntensity: number;
  readonly keyColor: THREE.ColorRepresentation;
  readonly keyIntensity: number;
  /** Key light direction in object-local space (normalized). */
  readonly keyDirection: THREE.Vector3;
  /**
   * Flat ambient lift used in the isolated shader's diffuse term.
   * Prefer a neutral/gray here; use {@link fillColor} for probe contrast.
   */
  readonly ambientBoost: THREE.ColorRepresentation;
  readonly ambientIntensity: number;
  /**
   * Cool (or opposing) fill used when baking the PMREM probe.
   * High contrast vs {@link keyColor} keeps metal specular readable.
   */
  readonly fillColor: THREE.ColorRepresentation;
  readonly fillIntensity: number;
  /** Must be > 0 or IBL reflections are silenced. */
  readonly envMapIntensity: number;
  /** When set, isolated bind upgrades clones to MeshPhysicalMaterial. */
  readonly physical?: LocalLightPhysicalOptions;
}

export const HOUSE_LOCAL_LIGHT: LocalLightProfile = {
  id: 'house',
  groundColor: 0x2a241c,
  skyColor: 0xd8e4f8,
  hemiIntensity: 0.48,
  keyColor: 0xfff0d8,
  keyIntensity: 1.05,
  keyDirection: new THREE.Vector3(0.35, 0.85, 0.38).normalize(),
  ambientBoost: 0x9aa0b0,
  ambientIntensity: 0.28,
  fillColor: 0x6a8ec8,
  fillIntensity: 0.55,
  envMapIntensity: 0.85,
};

export const APARTMENT_LOCAL_LIGHT: LocalLightProfile = {
  id: 'apartment-office',
  groundColor: 0x1c2230,
  skyColor: 0xc8d8f0,
  hemiIntensity: 0.42,
  keyColor: 0xf0f2ff,
  keyIntensity: 0.95,
  keyDirection: new THREE.Vector3(0.25, 0.9, 0.32).normalize(),
  ambientBoost: 0x8890a8,
  ambientIntensity: 0.26,
  fillColor: 0x5a78b0,
  fillIntensity: 0.5,
  envMapIntensity: 0.8,
};

/** Studio lighting for product photography and hero shots. */
export const STUDIO_LOCAL_LIGHT: LocalLightProfile = {
  id: 'studio',
  groundColor: 0x101010,
  skyColor: 0xffffff,
  hemiIntensity: 0.6,
  keyColor: 0xfff8f0,
  keyIntensity: 1.25,
  keyDirection: new THREE.Vector3(0.4, 0.75, 0.52).normalize(),
  ambientBoost: 0xe8e8e8,
  ambientIntensity: 0.32,
  fillColor: 0xa8c0e8,
  fillIntensity: 0.65,
  envMapIntensity: 1.0,
};

/** Neutral product-viewer preset with soft fill. */
export const PRODUCT_LOCAL_LIGHT: LocalLightProfile = {
  id: 'product',
  groundColor: 0x222222,
  skyColor: 0xf5f5f5,
  hemiIntensity: 0.52,
  keyColor: 0xfff8f0,
  keyIntensity: 1.05,
  keyDirection: new THREE.Vector3(0.5, 0.7, 0.5).normalize(),
  ambientBoost: 0xd0d0d0,
  ambientIntensity: 0.3,
  fillColor: 0x90a8d0,
  fillIntensity: 0.58,
  envMapIntensity: 0.95,
};

/**
 * High-contrast probe for shiny metals (gold, chrome, brushed steel).
 * Uses MeshPhysicalMaterial clearcoat for lacquered reads.
 */
export const METAL_STUDIO_LOCAL_LIGHT: LocalLightProfile = {
  id: 'metal-studio',
  groundColor: 0x0a0c10,
  skyColor: 0xe8f0ff,
  hemiIntensity: 0.7,
  keyColor: 0xffe8c8,
  keyIntensity: 1.4,
  keyDirection: new THREE.Vector3(0.45, 0.8, 0.4).normalize(),
  ambientBoost: 0xb0b8c8,
  ambientIntensity: 0.22,
  fillColor: 0x4a70b8,
  fillIntensity: 0.75,
  envMapIntensity: 1.25,
  physical: {
    clearcoat: 0.35,
    clearcoatRoughness: 0.12,
  },
};

/** Brushed metal (steel / aluminum) with anisotropy. */
export const BRUSHED_METAL_LOCAL_LIGHT: LocalLightProfile = {
  id: 'brushed-metal',
  groundColor: 0x121418,
  skyColor: 0xdce6f4,
  hemiIntensity: 0.65,
  keyColor: 0xfff2e0,
  keyIntensity: 1.2,
  keyDirection: new THREE.Vector3(0.55, 0.7, 0.35).normalize(),
  ambientBoost: 0xa8b0bc,
  ambientIntensity: 0.24,
  fillColor: 0x5878a8,
  fillIntensity: 0.7,
  envMapIntensity: 1.15,
  physical: {
    anisotropy: 0.7,
    anisotropyRotation: 0,
    clearcoat: 0.05,
    clearcoatRoughness: 0.4,
  },
};

const PROFILE_BY_ID = new Map<string, LocalLightProfile>([
  [HOUSE_LOCAL_LIGHT.id, HOUSE_LOCAL_LIGHT],
  [APARTMENT_LOCAL_LIGHT.id, APARTMENT_LOCAL_LIGHT],
  [STUDIO_LOCAL_LIGHT.id, STUDIO_LOCAL_LIGHT],
  [PRODUCT_LOCAL_LIGHT.id, PRODUCT_LOCAL_LIGHT],
  [METAL_STUDIO_LOCAL_LIGHT.id, METAL_STUDIO_LOCAL_LIGHT],
  [BRUSHED_METAL_LOCAL_LIGHT.id, BRUSHED_METAL_LOCAL_LIGHT],
]);

export function getLocalLightProfile(id: string): LocalLightProfile | undefined {
  return PROFILE_BY_ID.get(id);
}

/**
 * Suggested PBR factors for authored metals. Use as a diagnostic / default
 * when asset roughness is incorrectly high.
 */
export const METAL_MATERIAL_HINTS = {
  /** Mirror-like chrome / polished gold. */
  polished: { metalness: 1, roughness: 0.05 },
  /** Typical product metal. */
  satin: { metalness: 0.95, roughness: 0.22 },
  /** Soft brushed look (pair with anisotropy profile). */
  brushed: { metalness: 1, roughness: 0.35 },
} as const;
