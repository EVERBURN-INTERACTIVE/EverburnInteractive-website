/**
 * AnimatablePropertyRegistry — global registry of animatable properties.
 *
 * Components declare their animatable properties at module load (see
 * {@link bootstrapAnimatablePropertyRegistry}). The editor's "Add Track"
 * UI queries this registry; the runtime uses it to validate value types.
 *
 * @module @runtime/utils/animatable-property-registry
 */

import type {
  AnimatablePropertyDescriptor,
  AnimatableValueType,
} from '@shared/types/animation';

class Registry {
  private readonly _byComponent = new Map<string, AnimatablePropertyDescriptor[]>();

  /** Register a property descriptor. Idempotent — a duplicate replaces the prior entry. */
  register(descriptor: AnimatablePropertyDescriptor): void {
    const list = this._byComponent.get(descriptor.componentType) ?? [];
    const idx = list.findIndex((d) => d.propertyPath === descriptor.propertyPath);
    if (idx >= 0) list[idx] = descriptor;
    else list.push(descriptor);
    this._byComponent.set(descriptor.componentType, list);
  }

  /** All descriptors for a component type. */
  list(componentType: string): ReadonlyArray<AnimatablePropertyDescriptor> {
    return this._byComponent.get(componentType) ?? [];
  }

  /** Look up a single descriptor by component + path. */
  get(componentType: string, propertyPath: string): AnimatablePropertyDescriptor | undefined {
    return this._byComponent.get(componentType)?.find((d) => d.propertyPath === propertyPath);
  }

  /** Every registered component type name. */
  componentTypes(): ReadonlyArray<string> {
    return [...this._byComponent.keys()];
  }

  /** Clear all registrations (test-only). */
  clear(): void {
    this._byComponent.clear();
  }
}

/** Process-wide singleton. */
export const AnimatablePropertyRegistry = new Registry();

/** Convenience helper for tests / future codegen. */
export function defineAnimatableProperty(
  componentType: string,
  propertyPath: string,
  valueType: AnimatableValueType,
  label: string,
  range?: { min?: number; max?: number },
): void {
  AnimatablePropertyRegistry.register({
    componentType,
    propertyPath,
    valueType,
    label,
    min: range?.min,
    max: range?.max,
  });
}

/**
 * Register the default set of animatable properties for built-in components.
 * Safe to call multiple times.
 */
export function bootstrapAnimatablePropertyRegistry(): void {
  if (_bootstrapped) return;
  _bootstrapped = true;

  // TransformComponent
  defineAnimatableProperty('TransformComponent', 'position', 'vec3', 'Position');
  defineAnimatableProperty('TransformComponent', 'rotation', 'vec3', 'Rotation');
  defineAnimatableProperty('TransformComponent', 'scale', 'vec3', 'Scale');

  // LightComponent
  defineAnimatableProperty('LightComponent', 'intensity', 'number', 'Intensity', { min: 0, max: 10 });
  defineAnimatableProperty('LightComponent', 'color', 'color', 'Color');
  defineAnimatableProperty('LightComponent', 'distance', 'number', 'Distance', { min: 0, max: 100 });

  // CameraComponent
  defineAnimatableProperty('CameraComponent', 'fov', 'number', 'FOV', { min: 10, max: 120 });
  defineAnimatableProperty('CameraComponent', 'near', 'number', 'Near');
  defineAnimatableProperty('CameraComponent', 'far', 'number', 'Far');

  // MeshRendererComponent — map to actually-existing props.
  defineAnimatableProperty('MeshRendererComponent', 'color', 'color', 'Color');
  defineAnimatableProperty('MeshRendererComponent', 'metalness', 'number', 'Metalness', { min: 0, max: 1 });
  defineAnimatableProperty('MeshRendererComponent', 'roughness', 'number', 'Roughness', { min: 0, max: 1 });
  defineAnimatableProperty('MeshRendererComponent', 'opacity', 'number', 'Opacity', { min: 0, max: 1 });
  defineAnimatableProperty('MeshRendererComponent', 'emissiveIntensity', 'number', 'Emissive', {
    min: 0,
    max: 10,
  });
  defineAnimatableProperty('MeshRendererComponent', 'glitchIntensity', 'number', 'Glitch', {
    min: 0,
    max: 1,
  });
  defineAnimatableProperty('MeshRendererComponent', 'dissolveProgress', 'number', 'Dissolve', {
    min: 0,
    max: 1,
  });
  defineAnimatableProperty('MeshRendererComponent', 'wireframe', 'boolean', 'Wireframe');

  // TextComponent — actual props are `text`, `fontSizePx`, `color`, `opacity`.
  defineAnimatableProperty('TextComponent', 'text', 'string', 'Text');
  defineAnimatableProperty('TextComponent', 'fontSizePx', 'number', 'Font Size', { min: 1 });
  defineAnimatableProperty('TextComponent', 'color', 'color', 'Color');
  defineAnimatableProperty('TextComponent', 'opacity', 'number', 'Opacity', { min: 0, max: 1 });
  defineAnimatableProperty('TextComponent', 'revealProgress', 'number', 'Reveal Progress', {
    min: 0,
    max: 1,
  });
  defineAnimatableProperty('TextComponent', 'scrambleProgress', 'number', 'Scramble Progress', {
    min: 0,
    max: 1,
  });
  defineAnimatableProperty('TextComponent', 'wavePhase', 'number', 'Wave Phase');
  defineAnimatableProperty('TextComponent', 'waveAmplitude', 'number', 'Wave Amplitude');

  defineAnimatableProperty('MaskWipeComponent', 'progress', 'number', 'Wipe Progress', {
    min: 0,
    max: 1,
  });
  defineAnimatableProperty('WeaponTrailComponent', 'enabled', 'boolean', 'Trail Enabled');

  // UIComponent
  defineAnimatableProperty('UIComponent', 'opacity', 'number', 'Opacity', { min: 0, max: 1 });
  defineAnimatableProperty('UIComponent', 'offset', 'vec2', 'Offset');

  // HTML overlay UI (DOM)
  for (const t of [
    'UIRootComponent',
    'UIPanelComponent',
    'UILabelComponent',
    'UIButtonComponent',
    'UIImageComponent',
  ] as const) {
    defineAnimatableProperty(t, 'opacity', 'number', 'Opacity', { min: 0, max: 1 });
    defineAnimatableProperty(t, 'offset', 'vec2', 'Offset');
    defineAnimatableProperty(t, 'borderRadiusPx', 'number', 'Border Radius', { min: 0 });
    defineAnimatableProperty(t, 'paddingPx', 'number', 'Padding', { min: 0 });
  }
  defineAnimatableProperty('UIPanelComponent', 'backgroundColor', 'string', 'Background');
  defineAnimatableProperty('UIPanelComponent', 'backdropBlurPx', 'number', 'Backdrop Blur', { min: 0 });
  defineAnimatableProperty('UILabelComponent', 'text', 'string', 'Text');
  defineAnimatableProperty('UILabelComponent', 'color', 'string', 'Color');
  defineAnimatableProperty('UILabelComponent', 'fontSizePx', 'number', 'Font Size', { min: 1 });
  defineAnimatableProperty('UILabelComponent', 'lineHeight', 'number', 'Line Height', {
    min: 0.5,
    max: 3,
  });
  defineAnimatableProperty('UIButtonComponent', 'text', 'string', 'Text');
  defineAnimatableProperty('UIButtonComponent', 'color', 'string', 'Text Color');
  defineAnimatableProperty('UIButtonComponent', 'backgroundColor', 'string', 'Background');
  defineAnimatableProperty('UIButtonComponent', 'hoverBackgroundColor', 'string', 'Hover Background');
  defineAnimatableProperty('UIButtonComponent', 'fontSizePx', 'number', 'Font Size', { min: 1 });
  defineAnimatableProperty('UIButtonComponent', 'disabled', 'boolean', 'Disabled');

  // UICanvasComponent (root canvas)
  defineAnimatableProperty('UICanvasComponent', 'opacity', 'number', 'Opacity', { min: 0, max: 1 });
  defineAnimatableProperty('UICanvasComponent', 'cameraDistance', 'number', 'Camera Distance');
  defineAnimatableProperty('UICanvasComponent', 'faceNormalOffset', 'number', 'Face Offset');
  defineAnimatableProperty('UICanvasComponent', 'widthWorld', 'number', 'Width (world)', { min: 0.001 });
  defineAnimatableProperty('UICanvasComponent', 'heightWorld', 'number', 'Height (world)', { min: 0.001 });
  defineAnimatableProperty('UICanvasComponent', 'borderColor', 'color', 'Border Color');
  defineAnimatableProperty('UICanvasComponent', 'canvasBorderPx', 'number', 'Canvas Border Width', { min: 0 });

  // CameraCanvasComponent — inherits the UICanvas surface props but also
  // exposes screen-space placement on the camera HUD. We register both
  // the inherited "opacity / colors" set AND the camera-specific knobs
  // so timelines can pan/scale HUDs.
  defineAnimatableProperty('CameraCanvasComponent', 'opacity', 'number', 'Opacity', { min: 0, max: 1 });
  defineAnimatableProperty('CameraCanvasComponent', 'cameraDistance', 'number', 'Camera Distance', { min: 0.01 });
  defineAnimatableProperty('CameraCanvasComponent', 'screenOffsetPx', 'vec2', 'Screen Offset (px)');
  defineAnimatableProperty('CameraCanvasComponent', 'screenSizePx', 'vec2', 'Screen Size (px)');
  defineAnimatableProperty('CameraCanvasComponent', 'borderColor', 'color', 'Border Color');
  defineAnimatableProperty('CameraCanvasComponent', 'canvasBorderPx', 'number', 'Canvas Border Width', { min: 0 });

  // UICanvas child elements — shared animatable properties.
  for (const t of [
    'UICanvasTextComponent',
    'UICanvasImageComponent',
    'UICanvasButtonComponent',
    'UICanvasLoadingBarComponent',
  ]) {
    defineAnimatableProperty(t, 'opacity', 'number', 'Opacity', { min: 0, max: 1 });
    defineAnimatableProperty(t, 'offset', 'vec2', 'Position');
    defineAnimatableProperty(t, 'rotationDeg', 'number', 'Rotation (deg)');
    defineAnimatableProperty(t, 'width', 'number', 'Width', { min: 0 });
    defineAnimatableProperty(t, 'height', 'number', 'Height', { min: 0 });
  }

  // UICanvasTextComponent — full text styling surface so designers can
  // animate any visual aspect of canvas text (colour, size, spacing).
  // Colour fields here are CSS strings, hence valueType 'string'.
  defineAnimatableProperty('UICanvasTextComponent', 'color', 'string', 'Color');
  defineAnimatableProperty('UICanvasTextComponent', 'fontSizePx', 'number', 'Font Size', { min: 1 });
  defineAnimatableProperty('UICanvasTextComponent', 'lineHeight', 'number', 'Line Height', { min: 0.5, max: 3 });

  // UICanvasImageComponent — tint + opacity (size/offset covered above).
  defineAnimatableProperty('UICanvasImageComponent', 'tintColor', 'string', 'Tint');

  // UICanvasButtonComponent — full state styling. All button colours are
  // CSS strings.
  defineAnimatableProperty('UICanvasButtonComponent', 'color', 'string', 'Text Color');
  defineAnimatableProperty('UICanvasButtonComponent', 'backgroundColor', 'string', 'Background');
  defineAnimatableProperty('UICanvasButtonComponent', 'hoverBackgroundColor', 'string', 'Hover Background');
  defineAnimatableProperty('UICanvasButtonComponent', 'borderColor', 'string', 'Border Color');
  defineAnimatableProperty('UICanvasButtonComponent', 'borderWidthPx', 'number', 'Border Width', { min: 0 });
  defineAnimatableProperty('UICanvasButtonComponent', 'fontSizePx', 'number', 'Font Size', { min: 1 });

  // UICanvasLoadingBarComponent — progress + colours (CSS strings).
  defineAnimatableProperty('UICanvasLoadingBarComponent', 'value', 'number', 'Value', { min: 0, max: 1 });
  defineAnimatableProperty('UICanvasLoadingBarComponent', 'fillColor', 'string', 'Fill Color');
  defineAnimatableProperty('UICanvasLoadingBarComponent', 'backgroundColor', 'string', 'Background');

  // ParallaxLayerComponent — authors typically tweak the offsets and depth
  // over a clip to add cinematic parallax variations on top of the scroll
  // motion (e.g., a layer "settles" then resumes after a scroll pause).
  defineAnimatableProperty('ParallaxLayerComponent', 'startOffset', 'vec3', 'Move From');
  defineAnimatableProperty('ParallaxLayerComponent', 'endOffset', 'vec3', 'Move To');
  defineAnimatableProperty('ParallaxLayerComponent', 'depth', 'number', 'Depth / Speed', { min: -2, max: 2 });

  // ArticulationComponent — hinge progress and angle limits for product motion.
  defineAnimatableProperty('ArticulationComponent', 'progress', 'number', 'Open Progress', {
    min: 0,
    max: 1,
  });
  defineAnimatableProperty('ArticulationComponent', 'minAngleDeg', 'number', 'Closed Angle (deg)');
  defineAnimatableProperty('ArticulationComponent', 'maxAngleDeg', 'number', 'Open Angle (deg)');

  defineAnimatableProperty('GltfAnimationComponent', 'normalizedTime', 'number', 'Normalized Time', {
    min: 0,
    max: 1,
  });
}

let _bootstrapped = false;
