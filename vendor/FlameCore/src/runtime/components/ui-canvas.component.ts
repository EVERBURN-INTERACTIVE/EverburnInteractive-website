import * as THREE from 'three';
import type { SerializedComponentProps } from '@shared/types';
import { BaseComponent } from '../scene/component';
import type { Actor } from '../scene/actor';
import type { Scene } from '../scene/scene';
import type { AssetId } from '../assets/types';
import { MeshRendererComponent } from './mesh-renderer.component';
import { CameraComponent } from './camera.component';

/**
 * Three.js layer index used for editor-only viewport overlays (the canvas
 * border, gizmo guides, etc). The runtime's gameplay cameras render only
 * layer `0` by default, so anything placed on this layer is invisible in
 * exported sites. The editor's fly-camera enables this layer to make the
 * overlays visible while editing.
 */
export const EDITOR_OVERLAY_LAYER = 1;

// -----------------------------------------------------------------------------
// Anchoring inside the canvas (for child elements)
// -----------------------------------------------------------------------------

/** Anchor of a child element inside its parent {@link UICanvasComponent}. */
export type UICanvasAnchor =
  | 'top-left'
  | 'top'
  | 'top-right'
  | 'left'
  | 'center'
  | 'right'
  | 'bottom-left'
  | 'bottom'
  | 'bottom-right';

/** How a {@link UICanvasComponent} positions itself in the 3D scene. */
export type UICanvasAnchorMode = 'world' | 'camera' | 'parent-face';

// -----------------------------------------------------------------------------
// UICanvasComponent — the canvas root
// -----------------------------------------------------------------------------

/** Serialized {@link UICanvasComponent} properties. */
export interface UICanvasProps extends SerializedComponentProps {
  readonly _version: 1;
  /** Canvas resolution in pixels (also the layout coordinate space for children). */
  widthPx: number;
  heightPx: number;
  /** Plane size in world units. */
  widthWorld: number;
  heightWorld: number;
  /** CSS background fill. Empty string = transparent. */
  backgroundColor: string;
  /** Optional border drawn inside the canvas (CSS color); empty = no border. */
  canvasBorderColor: string;
  /** Optional border thickness in pixels. */
  canvasBorderPx: number;
  /** How the canvas anchors itself in the 3D scene. */
  anchorMode: UICanvasAnchorMode;
  /** When `anchorMode === 'camera'`: distance from the active camera. */
  cameraDistance: number;
  /** When `anchorMode === 'parent-face'`: triangle index on the parent mesh. */
  parentFaceIndex: number;
  /** When `anchorMode === 'parent-face'`: offset along the face normal. */
  faceNormalOffset: number;
  /** Whether the canvas always faces the active camera (billboard). */
  billboard: boolean;
  /** Whole-canvas opacity in `[0, 1]`. */
  opacity: number;
  /** Whether the canvas is visible. */
  visible: boolean;
  /** Whether the editor viewport border is drawn. The border is on the
   * {@link EDITOR_OVERLAY_LAYER} so gameplay cameras never see it. */
  showBorderInEditor: boolean;
  /** Editor border color (linear RGB 0..1). */
  borderColor: [number, number, number];
  /** Whether the plane is rendered double-sided. */
  doubleSided: boolean;
  /** Render order — higher draws on top of other transparent geometry. */
  renderOrder: number;
}

/** Factory producing a fully-defaulted {@link UICanvasProps}. */
export function makeUICanvasProps(
  patch: Partial<Omit<UICanvasProps, '_version'>> = {},
): UICanvasProps {
  return {
    _version: 1,
    widthPx: patch.widthPx ?? 512,
    heightPx: patch.heightPx ?? 512,
    widthWorld: patch.widthWorld ?? 2,
    heightWorld: patch.heightWorld ?? 2,
    backgroundColor: patch.backgroundColor ?? 'rgba(0,0,0,0)',
    canvasBorderColor: patch.canvasBorderColor ?? '',
    canvasBorderPx: patch.canvasBorderPx ?? 0,
    anchorMode: patch.anchorMode ?? 'world',
    cameraDistance: patch.cameraDistance ?? 2,
    parentFaceIndex: patch.parentFaceIndex ?? 0,
    faceNormalOffset: patch.faceNormalOffset ?? 0.01,
    billboard: patch.billboard ?? false,
    opacity: patch.opacity ?? 1,
    visible: patch.visible ?? true,
    showBorderInEditor: patch.showBorderInEditor ?? true,
    borderColor: patch.borderColor ?? [0.3, 0.7, 1],
    doubleSided: patch.doubleSided ?? true,
    renderOrder: patch.renderOrder ?? 10,
  };
}

/**
 * Canvas-based UI root. Owns:
 *
 *  - an off-screen `<canvas>` that child {@link UICanvasElementBase} components
 *    draw into in `layer` order,
 *  - a `THREE.CanvasTexture` uploaded to the GPU,
 *  - a `THREE.Mesh` (textured plane) placed in the 3D scene per {@link UICanvasProps.anchorMode},
 *  - an optional editor-only border ({@link THREE.LineSegments}) on the
 *    {@link EDITOR_OVERLAY_LAYER}.
 *
 * Children are regular actors with `UICanvasText`, `UICanvasImage`,
 * `UICanvasButton`, or `UICanvasLoadingBar` components. Each child component
 * marks the canvas dirty when its props change; the canvas redraws lazily
 * during `onUpdate` and again whenever a child is added/removed.
 *
 * Click handling on `UICanvasButton` children works via raycasting against
 * the plane — UV coordinates are converted to canvas pixels and tested
 * against each button's rect.
 */
export class UICanvasComponent extends BaseComponent<UICanvasProps> {
  // Widened to `string` so subclasses like `CameraCanvasComponent` can
  // override with their own literal type name without TS rejecting the
  // override as incompatible.
  static readonly typeName: string = 'UICanvasComponent';

  protected _canvas: HTMLCanvasElement | undefined;
  protected _ctx2d: CanvasRenderingContext2D | undefined;
  protected _texture: THREE.CanvasTexture | undefined;
  protected _material: THREE.MeshBasicMaterial | undefined;
  protected _geometry: THREE.PlaneGeometry | undefined;
  protected _mesh: THREE.Mesh | undefined;
  protected _borderMesh: THREE.LineSegments | undefined;
  protected _dirty = true;
  private _pointerHandlersBound = false;

  private readonly _onPointerDown = (e: PointerEvent): void => {
    this._handlePointer(e, 'down');
  };
  private readonly _onPointerUp = (e: PointerEvent): void => {
    this._handlePointer(e, 'up');
  };

  /** Underlying Three.js mesh (textured plane). */
  get mesh(): THREE.Mesh | undefined {
    return this._mesh;
  }

  /** The off-screen canvas children draw into; `undefined` in headless envs. */
  get canvasElement(): HTMLCanvasElement | undefined {
    return this._canvas;
  }

  /** Mark the canvas dirty so it re-renders on the next `onUpdate`. */
  markDirty(): void {
    this._dirty = true;
  }

  onAttach(actor: Actor): void {
    super.onAttach(actor);
    if (typeof document === 'undefined') return;
    this._canvas = document.createElement('canvas');
    this._canvas.width = Math.max(1, Math.floor(this._props.widthPx));
    this._canvas.height = Math.max(1, Math.floor(this._props.heightPx));
    try {
      this._ctx2d = this._canvas.getContext('2d') ?? undefined;
    } catch {
      this._ctx2d = undefined;
    }
    this._texture = new THREE.CanvasTexture(this._canvas);
    this._texture.colorSpace = THREE.SRGBColorSpace;
    this._texture.minFilter = THREE.LinearFilter;
    this._texture.magFilter = THREE.LinearFilter;
    this._texture.anisotropy = 4;
    this._material = new THREE.MeshBasicMaterial({
      map: this._texture,
      transparent: true,
      side: this._props.doubleSided ? THREE.DoubleSide : THREE.FrontSide,
      depthWrite: false,
    });
    this._geometry = new THREE.PlaneGeometry(this._props.widthWorld, this._props.heightWorld);
    this._mesh = new THREE.Mesh(this._geometry, this._material);
    this._mesh.renderOrder = this._props.renderOrder;
    this._mesh.userData['actorId'] = actor.id;
    this._mesh.userData['uiCanvasComponent'] = this;
    actor.object3D.add(this._mesh);
    this._buildBorder();
    this._disposables.push(this._geometry, this._material, this._texture);
    this._applyVisibility();
    this._dirty = true;
  }

  onSceneAttach(scene: Scene): void {
    super.onSceneAttach(scene);
    this._bindPointerHandlers();
    this._dirty = true;
  }

  onSceneDetach(scene: Scene): void {
    this._unbindPointerHandlers();
    super.onSceneDetach(scene);
  }

  onDetach(): void {
    this._unbindPointerHandlers();
    if (this._mesh) {
      this._mesh.removeFromParent();
      this._mesh = undefined;
    }
    if (this._borderMesh) {
      this._borderMesh.removeFromParent();
      const geom = this._borderMesh.geometry as THREE.BufferGeometry | undefined;
      const mat = this._borderMesh.material as THREE.Material | undefined;
      geom?.dispose();
      mat?.dispose();
      this._borderMesh = undefined;
    }
    super.onDetach();
  }

  onUpdate(_dt: number): void {
    this._applyAnchor();
    if (this._dirty) {
      this._render();
      this._dirty = false;
    }
  }

  protected onPropsChanged(): void {
    if (!this._mesh || !this._material || !this._geometry || !this._canvas) return;
    // Resize canvas if needed.
    const wPx = Math.max(1, Math.floor(this._props.widthPx));
    const hPx = Math.max(1, Math.floor(this._props.heightPx));
    if (this._canvas.width !== wPx || this._canvas.height !== hPx) {
      this._canvas.width = wPx;
      this._canvas.height = hPx;
    }
    // Resize plane if needed.
    const params = this._geometry.parameters;
    if (params.width !== this._props.widthWorld || params.height !== this._props.heightWorld) {
      this._geometry.dispose();
      this._geometry = new THREE.PlaneGeometry(this._props.widthWorld, this._props.heightWorld);
      this._mesh.geometry = this._geometry;
      this._disposables.push(this._geometry);
      this._rebuildBorderGeometry();
    }
    this._material.side = this._props.doubleSided ? THREE.DoubleSide : THREE.FrontSide;
    this._material.opacity = this._props.opacity;
    this._mesh.renderOrder = this._props.renderOrder;
    this._applyVisibility();
    if (this._borderMesh) {
      this._borderMesh.visible = this._props.showBorderInEditor;
      const mat = this._borderMesh.material as THREE.LineBasicMaterial;
      mat.color.setRGB(...this._props.borderColor);
    }
    this._dirty = true;
  }

  // ---------------------------------------------------------------------------
  // Internal helpers
  // ---------------------------------------------------------------------------

  private _applyVisibility(): void {
    if (this._mesh) this._mesh.visible = this._props.visible;
    if (this._borderMesh) {
      this._borderMesh.visible = this._props.showBorderInEditor && this._props.visible;
    }
  }

  private _buildBorder(): void {
    if (!this._mesh) return;
    const w = this._props.widthWorld / 2;
    const h = this._props.heightWorld / 2;
    const positions = new Float32Array([
      -w, -h, 0,   w, -h, 0,
       w, -h, 0,   w,  h, 0,
       w,  h, 0,  -w,  h, 0,
      -w,  h, 0,  -w, -h, 0,
    ]);
    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const mat = new THREE.LineBasicMaterial({
      color: new THREE.Color().setRGB(...this._props.borderColor),
      transparent: true,
      opacity: 0.9,
      depthTest: false,
    });
    this._borderMesh = new THREE.LineSegments(geom, mat);
    this._borderMesh.layers.set(EDITOR_OVERLAY_LAYER);
    this._borderMesh.renderOrder = this._props.renderOrder + 1;
    this._borderMesh.visible = this._props.showBorderInEditor;
    this._borderMesh.userData['fcEditorOverlay'] = true;
    this._mesh.add(this._borderMesh);
  }

  private _rebuildBorderGeometry(): void {
    if (!this._borderMesh) return;
    const w = this._props.widthWorld / 2;
    const h = this._props.heightWorld / 2;
    const positions = new Float32Array([
      -w, -h, 0,   w, -h, 0,
       w, -h, 0,   w,  h, 0,
       w,  h, 0,  -w,  h, 0,
      -w,  h, 0,  -w, -h, 0,
    ]);
    const oldGeom = this._borderMesh.geometry as THREE.BufferGeometry;
    oldGeom.dispose();
    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    this._borderMesh.geometry = geom;
  }

  /** Apply per-frame anchoring (camera-facing or face-attached). */
  private _applyAnchor(): void {
    if (!this._mesh || !this._actor) return;
    const scene = this._actor.scene;
    if (!scene) return;
    const mode = this._props.anchorMode;

    if (mode === 'camera') {
      const camera = this._resolveCamera(scene);
      if (!camera) return;
      const forward = new THREE.Vector3();
      camera.getWorldDirection(forward);
      const pos = new THREE.Vector3()
        .copy(camera.getWorldPosition(new THREE.Vector3()))
        .addScaledVector(forward, this._props.cameraDistance);
      // Place the actor at this world position (in case parent is non-identity).
      const localPos = this._actor.object3D.parent
        ? this._actor.object3D.parent.worldToLocal(pos.clone())
        : pos;
      this._actor.object3D.position.copy(localPos);
      this._actor.object3D.quaternion.copy(camera.quaternion);
      return;
    }

    if (mode === 'parent-face') {
      this._applyParentFaceAnchor();
      // Fall through so billboard can still apply on top.
    }

    if (this._props.billboard) {
      const camera = this._resolveCamera(scene);
      if (camera) {
        // Orient just the mesh so the actor's transform stays user-editable.
        this._mesh.quaternion.copy(camera.quaternion);
        // Cancel the actor's own rotation contribution.
        const inv = this._actor.object3D.getWorldQuaternion(new THREE.Quaternion()).invert();
        this._mesh.quaternion.premultiply(inv);
      }
    } else {
      this._mesh.quaternion.identity();
    }
  }

  private _applyParentFaceAnchor(): void {
    if (!this._actor || !this._mesh) return;
    const parent = this._actor.parent;
    if (!parent) return;
    const parentMesh = parent.getComponent(MeshRendererComponent)?.mesh;
    if (!parentMesh) return;
    const geom = parentMesh.geometry as THREE.BufferGeometry | undefined;
    if (!geom) return;
    const posAttr = geom.getAttribute('position') as THREE.BufferAttribute | undefined;
    if (!posAttr) return;
    const idx = geom.getIndex();
    const face = Math.max(0, Math.floor(this._props.parentFaceIndex));
    const i = face * 3;
    const a = new THREE.Vector3();
    const b = new THREE.Vector3();
    const c = new THREE.Vector3();
    if (idx) {
      if (i + 2 >= idx.count) return;
      a.fromBufferAttribute(posAttr, idx.getX(i));
      b.fromBufferAttribute(posAttr, idx.getX(i + 1));
      c.fromBufferAttribute(posAttr, idx.getX(i + 2));
    } else {
      if (i + 2 >= posAttr.count) return;
      a.fromBufferAttribute(posAttr, i);
      b.fromBufferAttribute(posAttr, i + 1);
      c.fromBufferAttribute(posAttr, i + 2);
    }
    const center = new THREE.Vector3().addVectors(a, b).add(c).multiplyScalar(1 / 3);
    const normal = new THREE.Vector3()
      .subVectors(b, a)
      .cross(new THREE.Vector3().subVectors(c, a))
      .normalize();
    center.addScaledVector(normal, this._props.faceNormalOffset);
    // The actor lives in scene space; convert from parent-mesh local → actor's
    // parent-local space. The actor's parent is `parent.object3D`, so the
    // computed position in parent-local space is already correct because the
    // mesh shares its actor's transform.
    this._actor.object3D.position.copy(center);
    // Orient z-axis along normal.
    const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal);
    this._actor.object3D.quaternion.copy(q);
  }

  private _resolveCamera(scene: Scene): THREE.Camera | undefined {
    for (const a of scene.actors) {
      const cam = a.getComponent(CameraComponent);
      if (cam && cam.props.isMain) return cam.camera;
    }
    return undefined;
  }

  /** Draw all child UI elements into the 2D canvas. */
  protected _render(): void {
    const ctx = this._ctx2d;
    const canvas = this._canvas;
    if (!ctx || !canvas) return;
    ctx.save();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (this._props.backgroundColor) {
      ctx.fillStyle = this._props.backgroundColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    if (this._props.canvasBorderColor && this._props.canvasBorderPx > 0) {
      ctx.strokeStyle = this._props.canvasBorderColor;
      ctx.lineWidth = this._props.canvasBorderPx;
      const off = this._props.canvasBorderPx / 2;
      ctx.strokeRect(off, off, canvas.width - off * 2, canvas.height - off * 2);
    }
    const children = this._collectElements();
    for (const child of children) {
      ctx.save();
      try {
        const rect = child.computeRect(canvas.width, canvas.height);
        const cx = rect.x + rect.w * child.props.pivot[0];
        const cy = rect.y + rect.h * child.props.pivot[1];
        ctx.globalAlpha = child.props.opacity * this._props.opacity;
        ctx.translate(cx, cy);
        if (child.props.rotationDeg !== 0) {
          ctx.rotate((child.props.rotationDeg * Math.PI) / 180);
        }
        ctx.translate(-cx, -cy);
        child.drawTo(ctx, rect);
      } catch {
        // Drawing failures (e.g., image not loaded) should not crash render.
      }
      ctx.restore();
    }
    ctx.restore();
    if (this._texture) this._texture.needsUpdate = true;
  }

  /** Walk the actor tree and collect canvas elements sorted by `layer` asc. */
  private _collectElements(): UICanvasElementBase<UICanvasElementProps>[] {
    const out: UICanvasElementBase<UICanvasElementProps>[] = [];
    if (!this._actor) return out;
    const walk = (a: Actor): void => {
      for (const c of a.components) {
        if (c instanceof UICanvasElementBase && c.props.visible) {
          out.push(c);
        }
      }
      for (const child of a.children) walk(child);
    };
    for (const child of this._actor.children) walk(child);
    out.sort((p, q) => p.props.layer - q.props.layer);
    return out;
  }

  // ---------------------------------------------------------------------------
  // Pointer / raycast handling for UICanvasButton hits.
  // ---------------------------------------------------------------------------

  private _bindPointerHandlers(): void {
    if (this._pointerHandlersBound) return;
    const runtime = this._actor?.scene?.runtime;
    const canvas = runtime?.context.canvas;
    if (!canvas) return;
    canvas.addEventListener('pointerdown', this._onPointerDown);
    canvas.addEventListener('pointerup', this._onPointerUp);
    this._pointerHandlersBound = true;
  }

  private _unbindPointerHandlers(): void {
    if (!this._pointerHandlersBound) return;
    const runtime = this._actor?.scene?.runtime;
    const canvas = runtime?.context.canvas;
    canvas?.removeEventListener('pointerdown', this._onPointerDown);
    canvas?.removeEventListener('pointerup', this._onPointerUp);
    this._pointerHandlersBound = false;
  }

  private _handlePointer(e: PointerEvent, kind: 'down' | 'up'): void {
    if (!this._mesh || !this._canvas || !this._actor?.scene) return;
    const scene = this._actor.scene;
    const camera = this._resolveCamera(scene);
    if (!camera) return;
    const rendererCanvas = scene.runtime?.context.canvas;
    if (!rendererCanvas) return;
    const rect = rendererCanvas.getBoundingClientRect();
    const ndc = new THREE.Vector2(
      ((e.clientX - rect.left) / rect.width) * 2 - 1,
      -(((e.clientY - rect.top) / rect.height) * 2 - 1),
    );
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(ndc, camera);
    const hits = raycaster.intersectObject(this._mesh, false);
    if (hits.length === 0 || !hits[0].uv) return;
    const uv = hits[0].uv;
    const px = uv.x * this._canvas.width;
    const py = (1 - uv.y) * this._canvas.height;
    const elements = this._collectElements();
    // Hit-test top-most first.
    for (let i = elements.length - 1; i >= 0; i--) {
      const el = elements[i];
      if (!(el instanceof UICanvasButtonComponent)) continue;
      const r = el.computeRect(this._canvas.width, this._canvas.height);
      if (px >= r.x && px <= r.x + r.w && py >= r.y && py <= r.y + r.h) {
        el.handlePointer(kind);
        return;
      }
    }
  }
}

// -----------------------------------------------------------------------------
// Canvas elements — shared base
// -----------------------------------------------------------------------------

/** Pixel rectangle returned by {@link UICanvasElementBase.computeRect}. */
export interface UICanvasElementRect {
  x: number;
  y: number;
  w: number;
  h: number;
}

/** Shared serialized fields for every {@link UICanvasComponent} child. */
export interface UICanvasElementProps extends SerializedComponentProps {
  readonly _version: 1;
  /** Anchor on the parent canvas the element aligns to. */
  anchor: UICanvasAnchor;
  /** Offset in pixels from the anchor along `[x, y]`. */
  offset: [number, number];
  /** Width in pixels. */
  width: number;
  /** Height in pixels. */
  height: number;
  /** Rotation in degrees around the element's pivot. */
  rotationDeg: number;
  /** Pivot inside the element `[0..1, 0..1]` (default 0.5, 0.5). */
  pivot: [number, number];
  /** Layer / stacking order on the canvas (higher draws on top). */
  layer: number;
  /** Element opacity in `[0, 1]`. */
  opacity: number;
  /** Whether the element is rendered. */
  visible: boolean;
}

function makeCanvasElementCommon(
  patch: Partial<Omit<UICanvasElementProps, '_version'>>,
): UICanvasElementProps {
  return {
    _version: 1,
    anchor: patch.anchor ?? 'top-left',
    offset: patch.offset ?? [0, 0],
    width: patch.width ?? 200,
    height: patch.height ?? 80,
    rotationDeg: patch.rotationDeg ?? 0,
    pivot: patch.pivot ?? [0.5, 0.5],
    layer: patch.layer ?? 0,
    opacity: patch.opacity ?? 1,
    visible: patch.visible ?? true,
  };
}

/**
 * Base class for every UI element that draws into a parent
 * {@link UICanvasComponent}'s 2D canvas. Subclasses implement
 * {@link drawTo}.
 *
 * The element does not own any Three.js resources itself — it only mutates
 * the parent's canvas. When its props change, it walks up the actor tree
 * to find the owning canvas and marks it dirty so the next frame redraws.
 */
export abstract class UICanvasElementBase<
  P extends UICanvasElementProps,
> extends BaseComponent<P> {
  onSceneAttach(scene: Scene): void {
    super.onSceneAttach(scene);
    this._markCanvasDirty();
  }

  onSceneDetach(scene: Scene): void {
    this._markCanvasDirty();
    super.onSceneDetach(scene);
  }

  onAttach(actor: Actor): void {
    super.onAttach(actor);
    this._markCanvasDirty();
  }

  onDetach(): void {
    this._markCanvasDirty();
    super.onDetach();
  }

  protected onPropsChanged(): void {
    this._markCanvasDirty();
  }

  /**
   * Find the owning canvas (either {@link UICanvasComponent} or its subclass
   * {@link CameraCanvasComponent}) by walking up the actor tree. We use
   * `instanceof` rather than `getComponent(UICanvasComponent)` because the
   * latter matches on exact `typeName` and would miss `CameraCanvasComponent`.
   */
  findOwningCanvas(): UICanvasComponent | undefined {
    let a: Actor | undefined = this._actor?.parent;
    while (a) {
      for (const c of a.components) {
        if (c instanceof UICanvasComponent) return c;
      }
      a = a.parent;
    }
    return undefined;
  }

  protected _markCanvasDirty(): void {
    this.findOwningCanvas()?.markDirty();
  }

  /** Compute the element's pixel rect inside a `canvasW × canvasH` canvas. */
  computeRect(canvasW: number, canvasH: number): UICanvasElementRect {
    const p = this._props;
    const w = p.width;
    const h = p.height;
    let x = 0;
    let y = 0;
    switch (p.anchor) {
      case 'top-left':     x = p.offset[0];                       y = p.offset[1];                       break;
      case 'top':          x = (canvasW - w) / 2 + p.offset[0];   y = p.offset[1];                       break;
      case 'top-right':    x = canvasW - w - p.offset[0];         y = p.offset[1];                       break;
      case 'left':         x = p.offset[0];                       y = (canvasH - h) / 2 + p.offset[1];   break;
      case 'center':       x = (canvasW - w) / 2 + p.offset[0];   y = (canvasH - h) / 2 + p.offset[1];   break;
      case 'right':        x = canvasW - w - p.offset[0];         y = (canvasH - h) / 2 + p.offset[1];   break;
      case 'bottom-left':  x = p.offset[0];                       y = canvasH - h - p.offset[1];         break;
      case 'bottom':       x = (canvasW - w) / 2 + p.offset[0];   y = canvasH - h - p.offset[1];         break;
      case 'bottom-right': x = canvasW - w - p.offset[0];         y = canvasH - h - p.offset[1];         break;
    }
    return { x, y, w, h };
  }

  /** Draw the element into the given 2D context at the given rect. */
  abstract drawTo(ctx: CanvasRenderingContext2D, rect: UICanvasElementRect): void;
}

// -----------------------------------------------------------------------------
// UICanvasTextComponent
// -----------------------------------------------------------------------------

/** Serialized {@link UICanvasTextComponent} properties. */
export interface UICanvasTextProps extends UICanvasElementProps {
  readonly _version: 1;
  /** Text content. `\n` is honored. */
  text: string;
  /** CSS color. */
  color: string;
  /** CSS font-family. */
  fontFamily: string;
  /** Font size in pixels (canvas-space). */
  fontSizePx: number;
  /** Font weight (`'normal' | 'bold' | '100'..'900'`). */
  fontWeight: string;
  /** Line height multiplier of `fontSizePx`. */
  lineHeight: number;
  /** Horizontal text alignment within the rect. */
  textAlign: 'left' | 'center' | 'right';
  /** Vertical text alignment within the rect. */
  verticalAlign: 'top' | 'middle' | 'bottom';
  /** Optional font asset to use; loaded lazily. */
  fontAssetId?: AssetId;
}

export function makeUICanvasTextProps(
  patch: Partial<Omit<UICanvasTextProps, '_version'>> = {},
): UICanvasTextProps {
  const base = makeCanvasElementCommon(patch);
  const out: UICanvasTextProps = {
    ...base,
    text: patch.text ?? 'Text',
    color: patch.color ?? '#ffffff',
    fontFamily: patch.fontFamily ?? 'system-ui, sans-serif',
    fontSizePx: patch.fontSizePx ?? 32,
    fontWeight: patch.fontWeight ?? '500',
    lineHeight: patch.lineHeight ?? 1.2,
    textAlign: patch.textAlign ?? 'left',
    verticalAlign: patch.verticalAlign ?? 'top',
  };
  if (patch.fontAssetId) out.fontAssetId = patch.fontAssetId;
  return out;
}

/** A text element drawn directly onto the parent canvas. */
export class UICanvasTextComponent extends UICanvasElementBase<UICanvasTextProps> {
  static readonly typeName = 'UICanvasTextComponent';
  private _resolvedFamily: string | undefined;
  private _fontLoadToken = 0;

  onSceneAttach(scene: Scene): void {
    super.onSceneAttach(scene);
    this._loadFontIfNeeded();
  }

  drawTo(ctx: CanvasRenderingContext2D, rect: UICanvasElementRect): void {
    const p = this._props;
    const fam = this._resolvedFamily ? `"${this._resolvedFamily}", ${p.fontFamily}` : p.fontFamily;
    ctx.fillStyle = p.color;
    ctx.font = `${p.fontWeight} ${p.fontSizePx}px ${fam}`;
    ctx.textBaseline = 'top';
    const lines = p.text.split('\n');
    const lh = p.fontSizePx * p.lineHeight;
    const totalH = lines.length * lh;
    let y = rect.y;
    if (p.verticalAlign === 'middle') y = rect.y + (rect.h - totalH) / 2;
    else if (p.verticalAlign === 'bottom') y = rect.y + rect.h - totalH;
    for (const line of lines) {
      const metrics = ctx.measureText(line);
      let x = rect.x;
      if (p.textAlign === 'center') x = rect.x + (rect.w - metrics.width) / 2;
      else if (p.textAlign === 'right') x = rect.x + rect.w - metrics.width;
      ctx.fillText(line, x, y);
      y += lh;
    }
  }

  private _loadFontIfNeeded(): void {
    const id = this._props.fontAssetId;
    if (!id) return;
    const loader = this._actor?.scene?.runtime?.context.loader;
    if (!loader) return;
    const token = ++this._fontLoadToken;
    void loader
      .loadFont(id)
      .then((family) => {
        if (token !== this._fontLoadToken) return;
        this._resolvedFamily = family;
        this._markCanvasDirty();
      })
      .catch(() => undefined);
  }
}

// -----------------------------------------------------------------------------
// UICanvasImageComponent
// -----------------------------------------------------------------------------

/** Serialized {@link UICanvasImageComponent} properties. */
export interface UICanvasImageProps extends UICanvasElementProps {
  readonly _version: 1;
  /** Texture/image asset to display. */
  imageAssetId?: AssetId;
  /** Direct image URL fallback when no asset is set. */
  url: string;
  /** How the image is scaled into the rect. */
  fit: 'cover' | 'contain' | 'fill' | 'none';
  /** Optional tint color (`'#ffffff'` for none). Multiplied via globalCompositeOperation. */
  tintColor: string;
}

export function makeUICanvasImageProps(
  patch: Partial<Omit<UICanvasImageProps, '_version'>> = {},
): UICanvasImageProps {
  const base = makeCanvasElementCommon(patch);
  const out: UICanvasImageProps = {
    ...base,
    url: patch.url ?? '',
    fit: patch.fit ?? 'contain',
    tintColor: patch.tintColor ?? '#ffffff',
  };
  if (patch.imageAssetId) out.imageAssetId = patch.imageAssetId;
  return out;
}

/** An image element drawn directly onto the parent canvas. */
export class UICanvasImageComponent extends UICanvasElementBase<UICanvasImageProps> {
  static readonly typeName = 'UICanvasImageComponent';
  private _image: HTMLImageElement | undefined;
  private _loadedUrl: string | undefined;
  private _loadToken = 0;
  private _objectUrl: string | undefined;

  onSceneAttach(scene: Scene): void {
    super.onSceneAttach(scene);
    void this._refreshImage();
  }

  onDetach(): void {
    if (this._objectUrl) URL.revokeObjectURL(this._objectUrl);
    this._objectUrl = undefined;
    this._image = undefined;
    super.onDetach();
  }

  protected onPropsChanged(): void {
    super.onPropsChanged();
    void this._refreshImage();
  }

  drawTo(ctx: CanvasRenderingContext2D, rect: UICanvasElementRect): void {
    const img = this._image;
    if (!img || !img.width || !img.height) return;
    const p = this._props;
    let dx = rect.x;
    let dy = rect.y;
    let dw = rect.w;
    let dh = rect.h;
    if (p.fit === 'contain' || p.fit === 'cover') {
      const ar = img.width / img.height;
      const rAr = rect.w / rect.h;
      const fit = p.fit === 'contain' ? ar > rAr : ar < rAr;
      if (fit) {
        dw = rect.w;
        dh = rect.w / ar;
      } else {
        dh = rect.h;
        dw = rect.h * ar;
      }
      dx = rect.x + (rect.w - dw) / 2;
      dy = rect.y + (rect.h - dh) / 2;
    } else if (p.fit === 'none') {
      dw = img.width;
      dh = img.height;
      dx = rect.x + (rect.w - dw) / 2;
      dy = rect.y + (rect.h - dh) / 2;
    }
    ctx.drawImage(img, dx, dy, dw, dh);
    if (p.tintColor && p.tintColor !== '#ffffff') {
      ctx.save();
      ctx.globalCompositeOperation = 'multiply';
      ctx.fillStyle = p.tintColor;
      ctx.fillRect(dx, dy, dw, dh);
      ctx.restore();
    }
  }

  private async _refreshImage(): Promise<void> {
    const p = this._props;
    const token = ++this._loadToken;
    let src = p.url;
    if (p.imageAssetId) {
      const loader = this._actor?.scene?.runtime?.context.loader;
      if (loader) {
        const url = await loader.getBlobUrl(p.imageAssetId).catch(() => undefined);
        if (url) {
          if (this._objectUrl && this._objectUrl !== url) URL.revokeObjectURL(this._objectUrl);
          this._objectUrl = url;
          src = url;
        }
      }
    }
    if (token !== this._loadToken || !src) return;
    if (this._loadedUrl === src && this._image) {
      this._markCanvasDirty();
      return;
    }
    if (typeof Image === 'undefined') return;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = (): void => {
      if (token !== this._loadToken) return;
      this._image = img;
      this._loadedUrl = src;
      this._markCanvasDirty();
    };
    img.onerror = (): void => {
      if (token !== this._loadToken) return;
      this._image = undefined;
    };
    img.src = src;
  }
}

// -----------------------------------------------------------------------------
// UICanvasButtonComponent
// -----------------------------------------------------------------------------

/** Serialized {@link UICanvasButtonComponent} properties. */
export interface UICanvasButtonProps extends UICanvasElementProps {
  readonly _version: 1;
  /** Button label text. */
  text: string;
  /** CSS text color. */
  color: string;
  /** CSS background color. */
  backgroundColor: string;
  /** Hover/pressed background color (drawn while pointer is down on the button). */
  hoverBackgroundColor: string;
  /** Font family. */
  fontFamily: string;
  /** Font size in pixels. */
  fontSizePx: number;
  /** Font weight. */
  fontWeight: string;
  /** Border radius in pixels. */
  borderRadiusPx: number;
  /** Optional border (CSS color); empty disables. */
  borderColor: string;
  /** Border width in pixels. */
  borderWidthPx: number;
  /** Event name dispatched via `Actor.onEvent` on click. */
  eventName: string;
  /** When `true`, the button is greyed out and does not emit events. */
  disabled: boolean;
}

export function makeUICanvasButtonProps(
  patch: Partial<Omit<UICanvasButtonProps, '_version'>> = {},
): UICanvasButtonProps {
  const base = makeCanvasElementCommon(patch);
  return {
    ...base,
    text: patch.text ?? 'Button',
    color: patch.color ?? '#ffffff',
    backgroundColor: patch.backgroundColor ?? 'rgba(60,90,255,0.95)',
    hoverBackgroundColor: patch.hoverBackgroundColor ?? 'rgba(90,120,255,1)',
    fontFamily: patch.fontFamily ?? 'system-ui, sans-serif',
    fontSizePx: patch.fontSizePx ?? 20,
    fontWeight: patch.fontWeight ?? '600',
    borderRadiusPx: patch.borderRadiusPx ?? 8,
    borderColor: patch.borderColor ?? '',
    borderWidthPx: patch.borderWidthPx ?? 0,
    eventName: patch.eventName ?? '',
    disabled: patch.disabled ?? false,
  };
}

/** A clickable button drawn onto the canvas. Click hits are detected via
 * raycasting against the parent canvas plane (see {@link UICanvasComponent}). */
export class UICanvasButtonComponent extends UICanvasElementBase<UICanvasButtonProps> {
  static readonly typeName = 'UICanvasButtonComponent';
  /** True while pointer is held over the button. */
  private _pressed = false;

  drawTo(ctx: CanvasRenderingContext2D, rect: UICanvasElementRect): void {
    const p = this._props;
    const bg = this._pressed && !p.disabled ? p.hoverBackgroundColor : p.backgroundColor;
    drawRoundedRect(ctx, rect.x, rect.y, rect.w, rect.h, p.borderRadiusPx);
    ctx.fillStyle = bg;
    ctx.globalAlpha = ctx.globalAlpha * (p.disabled ? 0.5 : 1);
    ctx.fill();
    if (p.borderColor && p.borderWidthPx > 0) {
      ctx.lineWidth = p.borderWidthPx;
      ctx.strokeStyle = p.borderColor;
      ctx.stroke();
    }
    ctx.fillStyle = p.color;
    ctx.font = `${p.fontWeight} ${p.fontSizePx}px ${p.fontFamily}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(p.text, rect.x + rect.w / 2, rect.y + rect.h / 2);
  }

  /** @internal Invoked by {@link UICanvasComponent} when a pointer hit is over this button. */
  handlePointer(kind: 'down' | 'up'): void {
    if (this._props.disabled) return;
    if (kind === 'down') {
      this._pressed = true;
      this._markCanvasDirty();
      return;
    }
    // 'up' — emit click event if we were pressed.
    if (this._pressed && this._actor) {
      const payload = { actorId: this._actor.id, eventName: this._props.eventName };
      this._actor.components.forEach((c) => c.onEvent({ name: 'uiClick', payload }));
    }
    this._pressed = false;
    this._markCanvasDirty();
  }
}

// -----------------------------------------------------------------------------
// UICanvasLoadingBarComponent
// -----------------------------------------------------------------------------

/** Serialized {@link UICanvasLoadingBarComponent} properties. */
export interface UICanvasLoadingBarProps extends UICanvasElementProps {
  readonly _version: 1;
  /** Current progress in `[0, 1]`. */
  value: number;
  /** Track background color. */
  backgroundColor: string;
  /** Fill color. */
  fillColor: string;
  /** Optional border color. */
  borderColor: string;
  /** Border width in pixels. */
  borderWidthPx: number;
  /** Corner radius in pixels (applied to both bg and fill). */
  borderRadiusPx: number;
  /** Whether to draw a percentage / value label on top of the bar. */
  showLabel: boolean;
  /** Label format. */
  labelFormat: 'percent' | 'value';
  /** Number of decimal places when `labelFormat === 'value'`. */
  labelDecimals: number;
  /** Label CSS color. */
  labelColor: string;
  /** Label font family. */
  fontFamily: string;
  /** Label font size in pixels. */
  fontSizePx: number;
  /** Label font weight. */
  fontWeight: string;
  /** Bar fill direction. */
  direction: 'horizontal' | 'vertical';
}

export function makeUICanvasLoadingBarProps(
  patch: Partial<Omit<UICanvasLoadingBarProps, '_version'>> = {},
): UICanvasLoadingBarProps {
  const base = makeCanvasElementCommon({ width: 320, height: 24, ...patch });
  return {
    ...base,
    value: clamp01(patch.value ?? 0),
    backgroundColor: patch.backgroundColor ?? 'rgba(255,255,255,0.15)',
    fillColor: patch.fillColor ?? '#3aa8ff',
    borderColor: patch.borderColor ?? '',
    borderWidthPx: patch.borderWidthPx ?? 0,
    borderRadiusPx: patch.borderRadiusPx ?? 6,
    showLabel: patch.showLabel ?? true,
    labelFormat: patch.labelFormat ?? 'percent',
    labelDecimals: patch.labelDecimals ?? 0,
    labelColor: patch.labelColor ?? '#ffffff',
    fontFamily: patch.fontFamily ?? 'system-ui, sans-serif',
    fontSizePx: patch.fontSizePx ?? 14,
    fontWeight: patch.fontWeight ?? '600',
    direction: patch.direction ?? 'horizontal',
  };
}

/** A horizontal / vertical loading bar element. */
export class UICanvasLoadingBarComponent extends UICanvasElementBase<UICanvasLoadingBarProps> {
  static readonly typeName = 'UICanvasLoadingBarComponent';

  drawTo(ctx: CanvasRenderingContext2D, rect: UICanvasElementRect): void {
    const p = this._props;
    const v = clamp01(p.value);
    // Background track.
    drawRoundedRect(ctx, rect.x, rect.y, rect.w, rect.h, p.borderRadiusPx);
    ctx.fillStyle = p.backgroundColor;
    ctx.fill();
    // Fill.
    if (v > 0) {
      const fx = rect.x;
      let fy = rect.y;
      let fw = rect.w;
      let fh = rect.h;
      if (p.direction === 'horizontal') {
        fw = rect.w * v;
      } else {
        fh = rect.h * v;
        fy = rect.y + (rect.h - fh);
      }
      drawRoundedRect(ctx, fx, fy, fw, fh, p.borderRadiusPx);
      ctx.fillStyle = p.fillColor;
      ctx.fill();
    }
    // Border.
    if (p.borderColor && p.borderWidthPx > 0) {
      drawRoundedRect(ctx, rect.x, rect.y, rect.w, rect.h, p.borderRadiusPx);
      ctx.strokeStyle = p.borderColor;
      ctx.lineWidth = p.borderWidthPx;
      ctx.stroke();
    }
    // Label.
    if (p.showLabel) {
      const label = p.labelFormat === 'percent'
        ? `${Math.round(v * 100)}%`
        : v.toFixed(Math.max(0, Math.floor(p.labelDecimals)));
      ctx.fillStyle = p.labelColor;
      ctx.font = `${p.fontWeight} ${p.fontSizePx}px ${p.fontFamily}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(label, rect.x + rect.w / 2, rect.y + rect.h / 2);
    }
  }
}

// -----------------------------------------------------------------------------
// Drawing helpers
// -----------------------------------------------------------------------------

function clamp01(v: number): number {
  if (Number.isNaN(v)) return 0;
  if (v < 0) return 0;
  if (v > 1) return 1;
  return v;
}

/** Build a rounded-rect path on `ctx` ready to be filled/stroked. */
function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
): void {
  const rr = Math.max(0, Math.min(r, Math.min(w, h) / 2));
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.lineTo(x + w - rr, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + rr);
  ctx.lineTo(x + w, y + h - rr);
  ctx.quadraticCurveTo(x + w, y + h, x + w - rr, y + h);
  ctx.lineTo(x + rr, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - rr);
  ctx.lineTo(x, y + rr);
  ctx.quadraticCurveTo(x, y, x + rr, y);
  ctx.closePath();
}
