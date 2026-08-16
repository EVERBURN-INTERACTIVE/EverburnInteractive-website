import * as THREE from 'three';
import type { Actor } from '../scene/actor';
import type { Scene } from '../scene/scene';
import { CameraComponent } from './camera.component';
import {
  UICanvasComponent,
  makeUICanvasProps,
  type UICanvasProps,
} from './ui-canvas.component';

/**
 * Screen-space anchor for the camera canvas plane. Pure HUD positions
 * relative to the camera's near plane in normalized device coordinates.
 */
export type CameraCanvasScreenAnchor =
  | 'top-left'
  | 'top'
  | 'top-right'
  | 'left'
  | 'center'
  | 'right'
  | 'bottom-left'
  | 'bottom'
  | 'bottom-right'
  | 'fill';

/**
 * Serialized properties of a {@link CameraCanvasComponent}. The shape
 * deliberately overlaps with {@link UICanvasProps} so that the canvas
 * children (`UICanvasText` / `Image` / `Button` / `LoadingBar`) draw
 * into a camera canvas exactly the same way they do into a world canvas.
 */
export interface CameraCanvasProps extends UICanvasProps {
  /**
   * Where on the screen the canvas plane is anchored. `'fill'` makes the
   * plane cover the entire viewport.
   */
  screenAnchor: CameraCanvasScreenAnchor;
  /**
   * Pixel offset from the anchor (positive moves toward the screen center).
   * Ignored when `screenAnchor === 'fill'`.
   */
  screenOffsetPx: [number, number];
  /**
   * Canvas plane size in pixels (used when `screenAnchor !== 'fill'`).
   * Determines how large the HUD element appears on screen.
   */
  screenSizePx: [number, number];
  /**
   * Distance from the camera (world units). Kept small so the plane lives
   * just in front of the near plane and isn't clipped by world geometry.
   * Render order takes precedence for HUD layering.
   */
  cameraDistance: number;
}

const HUD_RENDER_ORDER = 10_000;

/** Factory producing fully-defaulted {@link CameraCanvasProps}. */
export function makeCameraCanvasProps(
  patch: Partial<Omit<CameraCanvasProps, '_version'>> = {},
): CameraCanvasProps {
  const base = makeUICanvasProps({
    widthPx: patch.widthPx ?? 512,
    heightPx: patch.heightPx ?? 512,
    // World size kept small; actual screen footprint is driven by screenSizePx.
    widthWorld: patch.widthWorld ?? 0.5,
    heightWorld: patch.heightWorld ?? 0.5,
    backgroundColor: patch.backgroundColor ?? 'rgba(0,0,0,0)',
    canvasBorderColor: patch.canvasBorderColor ?? '',
    canvasBorderPx: patch.canvasBorderPx ?? 0,
    anchorMode: 'camera',
    cameraDistance: patch.cameraDistance ?? 0.5,
    parentFaceIndex: 0,
    faceNormalOffset: 0,
    billboard: false,
    opacity: patch.opacity ?? 1,
    visible: patch.visible ?? true,
    showBorderInEditor: patch.showBorderInEditor ?? true,
    borderColor: patch.borderColor ?? [0.95, 0.55, 0.2],
    doubleSided: false,
    renderOrder: patch.renderOrder ?? HUD_RENDER_ORDER,
  });
  return {
    ...base,
    screenAnchor: patch.screenAnchor ?? 'center',
    screenOffsetPx: patch.screenOffsetPx ?? [0, 0],
    screenSizePx: patch.screenSizePx ?? [320, 160],
  };
}

/**
 * Camera-attached canvas (HUD). Behaves like a {@link UICanvasComponent} for
 * its children and animation, but is restricted to actors that own a
 * {@link CameraComponent}, and is always positioned in screen space relative
 * to that camera. The camera canvas is never selectable in the editor's
 * Create tab unless the active selection is a camera actor.
 *
 * The plane is parented to the {@link CameraComponent.camera} object so the
 * usual scene-graph transforms move it with the camera automatically. Per
 * frame we recompute the local position and scale based on
 * `screenAnchor` / `screenOffsetPx` / `screenSizePx` and the camera's
 * projection so the HUD stays pixel-accurate as the viewport resizes.
 */
export class CameraCanvasComponent extends UICanvasComponent {
  static override readonly typeName = 'CameraCanvasComponent';

  /** Typed accessor for the camera-canvas specific subset of {@link _props}. */
  private get _cprops(): CameraCanvasProps {
    return this._props as CameraCanvasProps;
  }

  private _ownCamera: THREE.Camera | undefined;

  override onAttach(actor: Actor): void {
    super.onAttach(actor);
    if (typeof console !== 'undefined' && !actor.getComponent(CameraComponent)) {
      console.warn(
        '[FlameCore] CameraCanvasComponent attached to an actor without a CameraComponent. ' +
          'Add a CameraComponent first so the canvas can resolve its host camera.',
      );
    }
    // Detach the mesh from the actor's object3D — we'll re-parent it to the
    // camera as soon as we can resolve one (in onSceneAttach / onUpdate).
    const m = this.mesh;
    if (m) m.removeFromParent();
  }

  override onSceneAttach(scene: Scene): void {
    super.onSceneAttach(scene);
    this._attachMeshToOwnCamera();
  }

  override onSceneDetach(scene: Scene): void {
    const m = this.mesh;
    if (m && m.parent) m.removeFromParent();
    this._ownCamera = undefined;
    super.onSceneDetach(scene);
  }

  override onUpdate(_dt: number): void {
    // Ensure the mesh is parented to the camera once both exist.
    if (!this._ownCamera) this._attachMeshToOwnCamera();
    if (this._ownCamera) this._applyScreenAnchor();
    // Drive a redraw of dirty child elements. We deliberately skip the base
    // class's _applyAnchor() (which would move the actor to follow the
    // camera and clash with the host CameraComponent's own placement); the
    // mesh is parented to the camera so it follows automatically.
    if (this._dirty) {
      this._render();
      this._dirty = false;
    }
  }

  private _attachMeshToOwnCamera(): void {
    const actor = this._actor;
    if (!actor) return;
    const cam = actor.getComponent(CameraComponent);
    if (!cam || !cam.camera) return;
    const m = this.mesh;
    if (!m) return;
    if (m.parent !== cam.camera) {
      m.removeFromParent();
      cam.camera.add(m);
    }
    this._ownCamera = cam.camera;
  }

  private _applyScreenAnchor(): void {
    const m = this.mesh;
    const cam = this._ownCamera;
    if (!m || !cam) return;

    const props = this._cprops;
    // Distance in front of the camera (negative Z in camera local space).
    const dist = Math.max(0.001, props.cameraDistance);
    m.position.set(0, 0, -dist);
    m.quaternion.identity();

    if (props.screenAnchor === 'fill') {
      // Match the plane size to the camera frustum at the given distance so
      // it fills the viewport regardless of aspect ratio.
      const { halfW, halfH } = computeFrustumHalfSize(cam, dist);
      m.scale.set((halfW * 2) / props.widthWorld, (halfH * 2) / props.heightWorld, 1);
      return;
    }

    // Compute pixel-to-world ratio at the given distance.
    const { halfW, halfH, viewportW, viewportH } = computeFrustumHalfSize(cam, dist, true);
    if (!viewportW || !viewportH) {
      m.scale.set(1, 1, 1);
      return;
    }
    const worldPerPxX = (halfW * 2) / viewportW;
    const worldPerPxY = (halfH * 2) / viewportH;

    const [sw, sh] = props.screenSizePx;
    m.scale.set((sw * worldPerPxX) / props.widthWorld, (sh * worldPerPxY) / props.heightWorld, 1);

    const halfPlaneW = (sw * worldPerPxX) / 2;
    const halfPlaneH = (sh * worldPerPxY) / 2;
    const [ox, oy] = props.screenOffsetPx;
    let x = 0;
    let y = 0;
    switch (props.screenAnchor) {
      case 'top-left':     x = -halfW + halfPlaneW + ox * worldPerPxX; y =  halfH - halfPlaneH - oy * worldPerPxY; break;
      case 'top':          x =                                ox * worldPerPxX; y =  halfH - halfPlaneH - oy * worldPerPxY; break;
      case 'top-right':    x =  halfW - halfPlaneW - ox * worldPerPxX; y =  halfH - halfPlaneH - oy * worldPerPxY; break;
      case 'left':         x = -halfW + halfPlaneW + ox * worldPerPxX; y =                                oy * worldPerPxY; break;
      case 'center':       x =                                ox * worldPerPxX; y =                                oy * worldPerPxY; break;
      case 'right':        x =  halfW - halfPlaneW - ox * worldPerPxX; y =                                oy * worldPerPxY; break;
      case 'bottom-left':  x = -halfW + halfPlaneW + ox * worldPerPxX; y = -halfH + halfPlaneH + oy * worldPerPxY; break;
      case 'bottom':       x =                                ox * worldPerPxX; y = -halfH + halfPlaneH + oy * worldPerPxY; break;
      case 'bottom-right': x =  halfW - halfPlaneW - ox * worldPerPxX; y = -halfH + halfPlaneH + oy * worldPerPxY; break;
    }
    m.position.set(x, y, -dist);
  }
}

/**
 * Compute the half-width/height of the camera's view frustum at the given
 * distance. Supports perspective and orthographic cameras. When
 * `wantViewport` is true and the camera was constructed with an aspect ratio
 * matching a renderer canvas, this also fills `viewportW` / `viewportH` with
 * the canvas's pixel size, which the caller uses to convert screen-space
 * offsets to world units.
 */
function computeFrustumHalfSize(
  camera: THREE.Camera,
  distance: number,
  wantViewport = false,
): { halfW: number; halfH: number; viewportW: number; viewportH: number } {
  let halfW = 1;
  let halfH = 1;
  if ((camera as THREE.PerspectiveCamera).isPerspectiveCamera) {
    const persp = camera as THREE.PerspectiveCamera;
    const vFov = (persp.fov * Math.PI) / 180;
    halfH = Math.tan(vFov / 2) * distance;
    halfW = halfH * persp.aspect;
  } else if ((camera as THREE.OrthographicCamera).isOrthographicCamera) {
    const ortho = camera as THREE.OrthographicCamera;
    halfW = (ortho.right - ortho.left) / 2;
    halfH = (ortho.top - ortho.bottom) / 2;
  }
  let viewportW = 0;
  let viewportH = 0;
  if (wantViewport && typeof window !== 'undefined') {
    // We don't have a direct handle to the renderer's canvas here; use the
    // window inner size as a reasonable approximation for HUD positioning.
    // Exact pixel mapping is handled by the renderer's pixel-ratio scaling.
    viewportW = window.innerWidth;
    viewportH = window.innerHeight;
  }
  return { halfW, halfH, viewportW, viewportH };
}
