import type { RGB, SerializedComponentProps } from '../types';

/** Material slot override within a configuration variant. */
export interface ConfiguratorSlotOverride {
  /** Mesh material slot name (matches GLTF material name or index as string). */
  slotName: string;
  /** Optional base color override (linear RGB 0..1). */
  color?: RGB;
  /** Optional texture asset id. */
  textureAssetId?: string;
  /** PBR roughness override [0..1]. */
  roughness?: number;
  /** PBR metalness override [0..1]. */
  metalness?: number;
}

/** Named product configuration (color/texture variant). */
export interface ConfiguratorVariant {
  readonly id: string;
  readonly name: string;
  readonly slots: readonly ConfiguratorSlotOverride[];
}

/** Serialized {@link ConfiguratorComponent} properties (v1). */
export interface ConfiguratorProps extends SerializedComponentProps {
  readonly _version: 1;
  /** Actor id of the mesh whose materials are swapped. */
  targetActorId?: string;
  /** Active configuration variant id. */
  activeVariantId?: string;
  /** Named configuration variants. */
  variants: readonly ConfiguratorVariant[];
  /** Show a DOM color-picker overlay in exported sites (when UISystem active). */
  showOptionPanel: boolean;
}
