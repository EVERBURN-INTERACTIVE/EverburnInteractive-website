import type { SerializedComponentProps } from '@shared/types';
import { BaseComponent } from '../scene/component';
import type { Actor } from '../scene/actor';
import type { Scene } from '../scene/scene';
import type { AssetId } from '../assets/types';

/** Anchor on the parent overlay (or panel) the element aligns to. */
export type UIAnchor =
  | 'top-left'
  | 'top'
  | 'top-right'
  | 'left'
  | 'center'
  | 'right'
  | 'bottom-left'
  | 'bottom'
  | 'bottom-right';

/** Pointer-event policy. `'none'` lets clicks fall through to the 3D scene. */
export type UIPointerEvents = 'auto' | 'none';

/**
 * Shared serialized layout / styling fields for every UI component. Kept in
 * a dedicated interface so all components evolve their schemas together.
 */
export interface UIElementCommonProps extends SerializedComponentProps {
  readonly _version: 1;
  /** Anchor of the element relative to its container. */
  anchor: UIAnchor;
  /** Offset in pixels from the anchor along [x, y]. */
  offset: [number, number];
  /** Element size in pixels, or `'auto'` to size to content. */
  width: number | 'auto';
  height: number | 'auto';
  /** Stacking order against other UI elements. */
  zIndex: number;
  /** Element opacity in `[0, 1]`. */
  opacity: number;
  /** Whether the element is visible. */
  visible: boolean;
  /** Pointer-event policy. */
  pointerEvents: UIPointerEvents;
  /** CSS class name(s) appended to `flamecore-ui`. */
  className: string;
  /** Padding in pixels. */
  paddingPx: number;
  /** Border radius in pixels. */
  borderRadiusPx: number;
}

function makeCommon(patch: Partial<Omit<UIElementCommonProps, '_version'>>): UIElementCommonProps {
  return {
    _version: 1,
    anchor: patch.anchor ?? 'center',
    offset: patch.offset ?? [0, 0],
    width: patch.width ?? 'auto',
    height: patch.height ?? 'auto',
    zIndex: patch.zIndex ?? 0,
    opacity: patch.opacity ?? 1,
    visible: patch.visible ?? true,
    pointerEvents: patch.pointerEvents ?? 'auto',
    className: patch.className ?? '',
    paddingPx: patch.paddingPx ?? 0,
    borderRadiusPx: patch.borderRadiusPx ?? 0,
  };
}

function applyCommonStyles(el: HTMLElement, p: UIElementCommonProps): void {
  el.style.position = 'absolute';
  el.style.display = p.visible ? 'block' : 'none';
  el.style.opacity = String(p.opacity);
  el.style.pointerEvents = p.pointerEvents;
  el.style.zIndex = String(p.zIndex);
  el.style.padding = `${p.paddingPx}px`;
  el.style.borderRadius = `${p.borderRadiusPx}px`;
  if (p.width !== 'auto') el.style.width = `${p.width}px`;
  else el.style.width = '';
  if (p.height !== 'auto') el.style.height = `${p.height}px`;
  else el.style.height = '';
  el.className = `flamecore-ui ${p.className}`.trim();
  applyAnchor(el, p.anchor, p.offset);
}

function applyAnchor(el: HTMLElement, anchor: UIAnchor, offset: [number, number]): void {
  el.style.left = '';
  el.style.right = '';
  el.style.top = '';
  el.style.bottom = '';
  el.style.transform = '';
  const [ox, oy] = offset;
  const oxs = `${ox}px`;
  const oys = `${oy}px`;
  switch (anchor) {
    case 'top-left':
      el.style.left = oxs;
      el.style.top = oys;
      break;
    case 'top':
      el.style.left = `calc(50% + ${ox}px)`;
      el.style.top = oys;
      el.style.transform = 'translateX(-50%)';
      break;
    case 'top-right':
      el.style.right = oxs;
      el.style.top = oys;
      break;
    case 'left':
      el.style.left = oxs;
      el.style.top = `calc(50% + ${oy}px)`;
      el.style.transform = 'translateY(-50%)';
      break;
    case 'center':
      el.style.left = `calc(50% + ${ox}px)`;
      el.style.top = `calc(50% + ${oy}px)`;
      el.style.transform = 'translate(-50%, -50%)';
      break;
    case 'right':
      el.style.right = oxs;
      el.style.top = `calc(50% + ${oy}px)`;
      el.style.transform = 'translateY(-50%)';
      break;
    case 'bottom-left':
      el.style.left = oxs;
      el.style.bottom = oys;
      break;
    case 'bottom':
      el.style.left = `calc(50% + ${ox}px)`;
      el.style.bottom = oys;
      el.style.transform = 'translateX(-50%)';
      break;
    case 'bottom-right':
      el.style.right = oxs;
      el.style.bottom = oys;
      break;
  }
}

/**
 * Base class for every DOM-backed UI component. Subclasses construct their
 * own root element type (`<div>`, `<button>`, `<img>`, …) and call
 * {@link _mountElement} from `onAttach`. The base class handles mounting
 * into the runtime's UI overlay and tearing down on detach.
 */
abstract class UIElementBase<P extends UIElementCommonProps> extends BaseComponent<P> {
  protected _element: HTMLElement | undefined;
  protected _parentElement: HTMLElement | undefined;

  onAttach(actor: Actor): void {
    super.onAttach(actor);
  }

  onSceneAttach(scene: Scene): void {
    super.onSceneAttach(scene);
    this._mount(scene);
    if (this._element) applyCommonStyles(this._element, this._props);
    this._applyChildStyles();
  }

  onSceneDetach(scene: Scene): void {
    this._unmount();
    super.onSceneDetach(scene);
  }

  onDetach(): void {
    this._unmount();
    super.onDetach();
  }

  protected onPropsChanged(): void {
    if (this._element) applyCommonStyles(this._element, this._props);
    this._applyChildStyles();
  }

  /** Hook for subclasses to apply their type-specific styling. */
  protected _applyChildStyles(): void {
    /* override in subclass */
  }

  /** Subclasses build their element here. */
  protected abstract _createElement(): HTMLElement;

  private _mount(scene: Scene): void {
    const overlay = scene.runtime?.context.uiOverlay;
    if (!overlay) return;
    // Find a parent UI element (walk up actor hierarchy). When none is found
    // we mount directly into the overlay.
    let parent: HTMLElement = overlay;
    const parentActor = this._actor?.parent;
    if (parentActor) {
      const ui = parentActor.components.find((c) =>
        ['UIPanelComponent', 'UIRootComponent'].includes(c.type),
      ) as { element?: HTMLElement } | undefined;
      if (ui?.element) parent = ui.element;
    }
    this._parentElement = parent;
    if (!this._element) {
      this._element = this._createElement();
    }
    parent.appendChild(this._element);
  }

  private _unmount(): void {
    if (this._element && this._element.parentElement) {
      this._element.parentElement.removeChild(this._element);
    }
    this._parentElement = undefined;
  }

  /** Public accessor used by parent UI containers to locate children. */
  get element(): HTMLElement | undefined {
    return this._element;
  }
}

// -----------------------------------------------------------------------------
// UIRootComponent
// -----------------------------------------------------------------------------

/** Marker component placed on an actor to host a UI sub-tree. */
export interface UIRootProps extends UIElementCommonProps {
  readonly _version: 1;
}
export function makeUIRootProps(patch: Partial<Omit<UIRootProps, '_version'>> = {}): UIRootProps {
  return makeCommon(patch);
}

/**
 * Root marker that designates an actor as the top of a UI tree. Children
 * with `UIPanel`/`UILabel`/… components are mounted into this root's DOM
 * sub-tree rather than the overlay's root.
 */
export class UIRootComponent extends UIElementBase<UIRootProps> {
  static readonly typeName = 'UIRootComponent';
  protected _createElement(): HTMLElement {
    const el = document.createElement('div');
    el.dataset['fcUiRole'] = 'root';
    el.style.position = 'absolute';
    el.style.inset = '0';
    return el;
  }
}

// -----------------------------------------------------------------------------
// UIPanelComponent
// -----------------------------------------------------------------------------

/** Serialized {@link UIPanelComponent} props. */
export interface UIPanelProps extends UIElementCommonProps {
  readonly _version: 1;
  /** Optional CSS color, e.g., `rgba(0,0,0,0.4)`. Empty string disables. */
  backgroundColor: string;
  /** Border (CSS shorthand). */
  border: string;
  /** Backdrop blur in pixels. Mobile-safe values are < 10. */
  backdropBlurPx: number;
}

export function makeUIPanelProps(patch: Partial<Omit<UIPanelProps, '_version'>> = {}): UIPanelProps {
  return {
    ...makeCommon(patch),
    backgroundColor: patch.backgroundColor ?? 'rgba(0,0,0,0.4)',
    border: patch.border ?? '',
    backdropBlurPx: patch.backdropBlurPx ?? 0,
  };
}

/** A styled container (`<div>`) into which other UI components nest. */
export class UIPanelComponent extends UIElementBase<UIPanelProps> {
  static readonly typeName = 'UIPanelComponent';
  protected _createElement(): HTMLElement {
    return document.createElement('div');
  }
  protected _applyChildStyles(): void {
    if (!this._element) return;
    this._element.style.background = this._props.backgroundColor;
    this._element.style.border = this._props.border;
    this._element.style.backdropFilter =
      this._props.backdropBlurPx > 0 ? `blur(${this._props.backdropBlurPx}px)` : '';
  }
}

// -----------------------------------------------------------------------------
// UILabelComponent
// -----------------------------------------------------------------------------

/** Serialized {@link UILabelComponent} props. */
export interface UILabelProps extends UIElementCommonProps {
  readonly _version: 1;
  text: string;
  color: string;
  fontFamily: string;
  fontSizePx: number;
  fontWeight: string;
  lineHeight: number;
  textAlign: 'left' | 'center' | 'right';
  /** Optional font asset; loaded lazily via FontFace API. */
  fontAssetId?: AssetId;
}

export function makeUILabelProps(patch: Partial<Omit<UILabelProps, '_version'>> = {}): UILabelProps {
  const out: UILabelProps = {
    ...makeCommon(patch),
    text: patch.text ?? 'Label',
    color: patch.color ?? '#ffffff',
    fontFamily: patch.fontFamily ?? 'system-ui, sans-serif',
    fontSizePx: patch.fontSizePx ?? 16,
    fontWeight: patch.fontWeight ?? '500',
    lineHeight: patch.lineHeight ?? 1.3,
    textAlign: patch.textAlign ?? 'left',
  };
  if (patch.fontAssetId) out.fontAssetId = patch.fontAssetId;
  return out;
}

/** A `<div>`-backed text label that supports any CSS font. */
export class UILabelComponent extends UIElementBase<UILabelProps> {
  static readonly typeName = 'UILabelComponent';
  private _fontToken = 0;
  protected _createElement(): HTMLElement {
    return document.createElement('div');
  }
  onSceneAttach(scene: Scene): void {
    super.onSceneAttach(scene);
    this._loadFont();
  }
  protected _applyChildStyles(): void {
    if (!this._element) return;
    const p = this._props;
    this._element.textContent = p.text;
    this._element.style.color = p.color;
    this._element.style.fontFamily = p.fontFamily;
    this._element.style.fontSize = `${p.fontSizePx}px`;
    this._element.style.fontWeight = p.fontWeight;
    this._element.style.lineHeight = String(p.lineHeight);
    this._element.style.textAlign = p.textAlign;
    this._element.style.whiteSpace = 'pre-wrap';
  }
  private _loadFont(): void {
    if (!this._props.fontAssetId) return;
    const loader = this._actor?.scene?.runtime?.context.loader;
    if (!loader) return;
    const token = ++this._fontToken;
    void loader
      .loadFont(this._props.fontAssetId)
      .then((family) => {
        if (token !== this._fontToken || !this._element) return;
        this._element.style.fontFamily = `"${family}", ${this._props.fontFamily}`;
      })
      .catch(() => undefined);
  }
}

// -----------------------------------------------------------------------------
// UIButtonComponent
// -----------------------------------------------------------------------------

/** Serialized {@link UIButtonComponent} props. */
export interface UIButtonProps extends UIElementCommonProps {
  readonly _version: 1;
  text: string;
  color: string;
  backgroundColor: string;
  hoverBackgroundColor: string;
  fontFamily: string;
  fontSizePx: number;
  fontWeight: string;
  /** Optional event name dispatched via the scene event bus on click. */
  eventName: string;
  disabled: boolean;
}

export function makeUIButtonProps(
  patch: Partial<Omit<UIButtonProps, '_version'>> = {},
): UIButtonProps {
  return {
    ...makeCommon(patch),
    text: patch.text ?? 'Button',
    color: patch.color ?? '#ffffff',
    backgroundColor: patch.backgroundColor ?? 'rgba(60,90,255,0.95)',
    hoverBackgroundColor: patch.hoverBackgroundColor ?? 'rgba(80,110,255,1)',
    fontFamily: patch.fontFamily ?? 'system-ui, sans-serif',
    fontSizePx: patch.fontSizePx ?? 16,
    fontWeight: patch.fontWeight ?? '600',
    eventName: patch.eventName ?? '',
    disabled: patch.disabled ?? false,
  };
}

/** A `<button>` element that emits a custom event when clicked. */
export class UIButtonComponent extends UIElementBase<UIButtonProps> {
  static readonly typeName = 'UIButtonComponent';

  protected _createElement(): HTMLElement {
    const el = document.createElement('button');
    el.type = 'button';
    el.addEventListener('click', () => this._handleClick());
    el.addEventListener('pointerenter', () => {
      el.style.background = this._props.hoverBackgroundColor;
    });
    el.addEventListener('pointerleave', () => {
      el.style.background = this._props.backgroundColor;
    });
    return el;
  }
  protected _applyChildStyles(): void {
    if (!this._element) return;
    const el = this._element as HTMLButtonElement;
    const p = this._props;
    el.textContent = p.text;
    el.disabled = p.disabled;
    el.style.cursor = p.disabled ? 'not-allowed' : 'pointer';
    el.style.color = p.color;
    el.style.background = p.backgroundColor;
    el.style.fontFamily = p.fontFamily;
    el.style.fontSize = `${p.fontSizePx}px`;
    el.style.fontWeight = p.fontWeight;
    el.style.border = 'none';
    el.style.borderRadius = `${p.borderRadiusPx}px`;
  }
  private _handleClick(): void {
    if (this._props.disabled) return;
    const evtName = this._props.eventName;
    if (!this._actor) return;
    const payload = { actorId: this._actor.id, eventName: evtName };
    // Dispatch to any component on the same actor (e.g., InputListener).
    this._actor.components.forEach((c) => {
      c.onEvent({ name: 'uiClick', payload });
    });
  }
}

// -----------------------------------------------------------------------------
// UIImageComponent
// -----------------------------------------------------------------------------

/** Serialized {@link UIImageComponent} props. */
export interface UIImageProps extends UIElementCommonProps {
  readonly _version: 1;
  /** Texture asset to display. */
  imageAssetId?: AssetId;
  /** Direct image URL fallback used when no asset is set. */
  url: string;
  /** CSS `object-fit` value. */
  fit: 'cover' | 'contain' | 'fill' | 'none';
}

export function makeUIImageProps(
  patch: Partial<Omit<UIImageProps, '_version'>> = {},
): UIImageProps {
  const out: UIImageProps = {
    ...makeCommon(patch),
    url: patch.url ?? '',
    fit: patch.fit ?? 'cover',
  };
  if (patch.imageAssetId) out.imageAssetId = patch.imageAssetId;
  return out;
}

/** An `<img>` element backed by an asset blob URL or a direct URL. */
export class UIImageComponent extends UIElementBase<UIImageProps> {
  static readonly typeName = 'UIImageComponent';
  private _objectUrl: string | undefined;

  protected _createElement(): HTMLElement {
    return document.createElement('img');
  }
  onSceneAttach(scene: Scene): void {
    super.onSceneAttach(scene);
    this._refreshSource();
  }
  protected _applyChildStyles(): void {
    if (!this._element) return;
    const img = this._element as HTMLImageElement;
    img.style.objectFit = this._props.fit;
    this._refreshSource();
  }
  onDetach(): void {
    if (this._objectUrl) URL.revokeObjectURL(this._objectUrl);
    this._objectUrl = undefined;
    super.onDetach();
  }
  private _refreshSource(): void {
    if (!this._element) return;
    const img = this._element as HTMLImageElement;
    if (this._props.imageAssetId) {
      const scene = this._actor?.scene;
      const loader = scene?.runtime?.context.loader;
      // Reuse texture-loader path: fetch the blob URL through AssetLoader's
      // BlobSource. We avoid creating a Three.js texture here.
      void scene?.runtime?.context.assets;
      if (loader) {
        loader.getBlobUrl(this._props.imageAssetId).then((url) => {
          if (!url) return;
          if (this._objectUrl) URL.revokeObjectURL(this._objectUrl);
          this._objectUrl = url;
          img.src = url;
        }).catch(() => undefined);
        return;
      }
    }
    img.src = this._props.url;
  }
}
