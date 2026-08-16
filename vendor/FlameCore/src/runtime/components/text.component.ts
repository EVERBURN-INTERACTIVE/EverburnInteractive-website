import * as THREE from 'three';
import type { RGB, SerializedComponentProps } from '@shared/types';
import { BaseComponent } from '../scene/component';
import type { Actor } from '../scene/actor';
import type { Scene } from '../scene/scene';
import type { AssetId } from '../assets/types';
import { CameraComponent } from './camera.component';

/** How text is horizontally aligned inside its rendered canvas. */
export type TextAlign = 'left' | 'center' | 'right';

/** How `revealProgress` is interpreted when revealing text. */
export type TextRevealMode = 'all' | 'character' | 'word' | 'line';

/** Anchor on the rendered text mesh that aligns with the actor origin. */
export type TextAnchor =
  | 'top-left'
  | 'top'
  | 'top-right'
  | 'left'
  | 'center'
  | 'right'
  | 'bottom-left'
  | 'bottom'
  | 'bottom-right';

/** Serialized {@link TextComponent} properties. */
export interface TextProps extends SerializedComponentProps {
  readonly _version: 1;
  /** Text content. Supports `\n` for hard line breaks. */
  text: string;
  /**
   * CSS font-family used for rendering. When `fontAssetId` is set the
   * loaded font's family overrides this value.
   */
  fontFamily: string;
  /** Optional font asset; loaded via `FontFace` API on attach. */
  fontAssetId?: AssetId;
  /** Font weight: `'normal'`, `'bold'`, or numeric `'100'..'900'`. */
  fontWeight: string;
  /** Font style. */
  fontStyle: 'normal' | 'italic';
  /** Font size in pixels (canvas-space; world size derived from `widthWorld`). */
  fontSizePx: number;
  /** Line height multiplier of `fontSizePx`. */
  lineHeight: number;
  /** Horizontal alignment. */
  align: TextAlign;
  /** Foreground color (linear RGB 0..1). */
  color: RGB;
  /** Optional background color. When `undefined`, the background is transparent. */
  backgroundColor?: RGB;
  /** Background alpha when `backgroundColor` is set, 0..1. */
  backgroundOpacity: number;
  /**
   * Canvas-space corner radius for the background pill. `0` draws a rectangle.
   */
  backgroundCornerRadiusPx?: number;
  /** Foreground alpha, 0..1. */
  opacity: number;
  /** Outline / stroke width in pixels (0 disables). */
  outlineWidth: number;
  /** Outline color (linear RGB 0..1). */
  outlineColor: RGB;
  /** Extra letter-spacing in pixels (positive = looser). */
  letterSpacingPx: number;
  /** Maximum text width in world units. Drives wrap & plane size. */
  widthWorld: number;
  /** Internal canvas padding, in pixels. */
  paddingPx: number;
  /** Whether to wrap text at `widthWorld`. */
  wrap: boolean;
  /** Whether to billboard (always face the active camera). */
  billboard: boolean;
  /** Render order priority (higher draws on top of mesh geometry). */
  renderOrder: number;
  /** Anchor point on the text plane that aligns with the actor's origin. */
  anchor: TextAnchor;
  /**
   * Progress of the reveal animation in `[0, 1]`. When `revealMode` is
   * `'all'` this only affects opacity; otherwise it controls how much of
   * the text is drawn (typewriter effect).
   */
  revealProgress: number;
  /** Reveal granularity. */
  revealMode: TextRevealMode;
  /**
   * Scramble decode progress in `[0, 1]`. Characters after
   * `floor(scrambleProgress * text.length)` show random glyphs from
   * `scrambleCharSet` until fully decoded at `1`.
   */
  scrambleProgress: number;
  /** Character pool used by the scramble effect. */
  scrambleCharSet: string;
  /** Per-character wave amplitude in pixels (0 disables). */
  waveAmplitude: number;
  /** Wave phase offset — animate for motion. */
  wavePhase: number;
  /** Spatial frequency of the wave across the text. */
  waveFrequency: number;
}

/** Factory for default text props. */
export function makeTextProps(patch: Partial<Omit<TextProps, '_version'>> = {}): TextProps {
  const out: TextProps = {
    _version: 1,
    text: patch.text ?? 'Text',
    fontFamily: patch.fontFamily ?? 'system-ui, sans-serif',
    fontWeight: patch.fontWeight ?? 'normal',
    fontStyle: patch.fontStyle ?? 'normal',
    fontSizePx: patch.fontSizePx ?? 64,
    lineHeight: patch.lineHeight ?? 1.2,
    align: patch.align ?? 'center',
    color: patch.color ?? [1, 1, 1],
    backgroundOpacity: patch.backgroundOpacity ?? 1,
    opacity: patch.opacity ?? 1,
    outlineWidth: patch.outlineWidth ?? 0,
    outlineColor: patch.outlineColor ?? [0, 0, 0],
    letterSpacingPx: patch.letterSpacingPx ?? 0,
    widthWorld: patch.widthWorld ?? 2,
    paddingPx: patch.paddingPx ?? 16,
    wrap: patch.wrap ?? true,
    billboard: patch.billboard ?? true,
    renderOrder: patch.renderOrder ?? 1,
    anchor: patch.anchor ?? 'center',
    revealProgress: patch.revealProgress ?? 1,
    revealMode: patch.revealMode ?? 'all',
    scrambleProgress: patch.scrambleProgress ?? 1,
    scrambleCharSet: patch.scrambleCharSet ?? 'X4@!QAZWSX#%^&*',
    waveAmplitude: patch.waveAmplitude ?? 0,
    wavePhase: patch.wavePhase ?? 0,
    waveFrequency: patch.waveFrequency ?? 2,
  };
  if (patch.fontAssetId) out.fontAssetId = patch.fontAssetId;
  if (patch.backgroundColor) out.backgroundColor = patch.backgroundColor;
  if (patch.backgroundCornerRadiusPx !== undefined) {
    out.backgroundCornerRadiusPx = patch.backgroundCornerRadiusPx;
  }
  return out;
}

/**
 * Renders 2D text into an off-screen `<canvas>`, uploads it as a
 * `THREE.CanvasTexture`, and displays it on a transparent plane.
 *
 * Strengths of this approach:
 *  - Supports any installed or `FontFace`-loaded font (TTF/WOFF/WOFF2).
 *  - Per-glyph reveal (typewriter) is implemented by re-rendering the
 *    canvas when `revealProgress` changes — no per-glyph mesh allocation.
 *  - Cheap to mutate (`text`, `color`, etc.) at runtime / animation time.
 *
 * Trade-offs:
 *  - The text plane is a single quad; it does not support per-glyph
 *    transforms (use multiple `TextComponent` actors for that).
 *  - Very long strings allocate large canvases; the system caps the
 *    canvas dimension at `MAX_CANVAS_DIM` to avoid OOM on mobile.
 */
export class TextComponent extends BaseComponent<TextProps> {
  static readonly typeName = 'TextComponent';

  private static readonly MAX_CANVAS_DIM = 4096;
  /** Pixels per world unit used to size the off-screen canvas. */
  private static readonly PIXELS_PER_WORLD_UNIT = 256;

  private _canvas: HTMLCanvasElement | undefined;
  private _ctx2d: CanvasRenderingContext2D | undefined;
  private _texture: THREE.CanvasTexture | undefined;
  private _material: THREE.MeshBasicMaterial | undefined;
  private _geometry: THREE.PlaneGeometry | undefined;
  private _mesh: THREE.Mesh | undefined;
  private _resolvedFamily: string | undefined;
  private _fontLoadToken = 0;
  private readonly _cameraWorldQuaternion = new THREE.Quaternion();
  private readonly _parentWorldQuaternion = new THREE.Quaternion();

  /** Underlying Three.js mesh (a transparent quad). */
  get mesh(): THREE.Mesh | undefined {
    return this._mesh;
  }

  onAttach(actor: Actor): void {
    super.onAttach(actor);
    if (typeof document === 'undefined') return;
    this._canvas = document.createElement('canvas');
    try {
      this._ctx2d = this._canvas.getContext('2d') ?? undefined;
    } catch {
      // 2D canvas may be unavailable (e.g., jsdom). Mesh will still be created
      // but rendering becomes a no-op.
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
      side: THREE.DoubleSide,
      depthWrite: false,
      // Pills must stay readable under night tone-mapping / low exposure.
      toneMapped: false,
    });
    this._geometry = new THREE.PlaneGeometry(1, 1);
    this._mesh = new THREE.Mesh(this._geometry, this._material);
    this._mesh.renderOrder = this._props.renderOrder;
    this._mesh.userData.actorId = actor.id;
    actor.object3D.add(this._mesh);
    this._disposables.push(this._geometry, this._material, this._texture);
    this._render();
  }

  onSceneAttach(scene: Scene): void {
    super.onSceneAttach(scene);
    this._loadFontIfNeeded();
  }

  onDetach(): void {
    this._fontLoadToken++;
    if (this._mesh) {
      this._mesh.removeFromParent();
      this._mesh = undefined;
    }
    super.onDetach();
  }

  onUpdate(_dt: number): void {
    if (!this._mesh || !this._props.billboard) return;
    const scene = this._actor?.scene;
    const camera = this._resolveCamera(scene);
    if (camera) {
      camera.getWorldQuaternion(this._cameraWorldQuaternion);
      this._mesh.quaternion.copy(this._cameraWorldQuaternion);
      const parent = this._mesh.parent;
      if (parent) {
        parent.getWorldQuaternion(this._parentWorldQuaternion).invert();
        this._mesh.quaternion.premultiply(this._parentWorldQuaternion);
      }
    }
  }

  protected onPropsChanged(): void {
    if (!this._material || !this._mesh) return;
    this._mesh.renderOrder = this._props.renderOrder;
    this._material.opacity = this._props.opacity;
    if (this._props.fontAssetId) this._loadFontIfNeeded();
    this._render();
  }

  /** Force a re-render (e.g., after the font family becomes available). */
  forceRender(): void {
    this._render();
  }

  private _resolveCamera(scene: Scene | undefined): THREE.Camera | undefined {
    if (!scene) return undefined;
    const renderingSystem = scene.runtime?.systems.find((system) => system.name === 'RenderingSystem') as
      | { readonly overrideCamera?: THREE.Camera }
      | undefined;
    if (renderingSystem?.overrideCamera) return renderingSystem.overrideCamera;
    const id = scene.mainCameraActorId;
    if (!id) return undefined;
    const actor = scene.findActorById(id);
    return actor?.getComponent(CameraComponent)?.camera;
  }

  private _loadFontIfNeeded(): void {
    const scene = this._actor?.scene;
    const loader = scene?.runtime?.context.loader;
    if (!loader || !this._props.fontAssetId) return;
    const token = ++this._fontLoadToken;
    void loader
      .loadFont(this._props.fontAssetId)
      .then((family) => {
        if (token !== this._fontLoadToken) return;
        this._resolvedFamily = family;
        this._render();
      })
      .catch(() => {
        // Keep falling back to the system font.
      });
  }

  private _render(): void {
    if (!this._canvas || !this._ctx2d || !this._texture || !this._geometry) return;
    const p = this._props;
    const family = this._resolvedFamily ?? p.fontFamily;

    // Compute the canvas resolution from the world width.
    const pxPerUnit = TextComponent.PIXELS_PER_WORLD_UNIT;
    const targetWidthPx = Math.min(
      TextComponent.MAX_CANVAS_DIM,
      Math.max(64, Math.round(p.widthWorld * pxPerUnit)),
    );
    const innerWidth = Math.max(1, targetWidthPx - p.paddingPx * 2);

    // Layout the text.
    const fontDecl = `${p.fontStyle} ${p.fontWeight} ${p.fontSizePx}px ${family}`;
    this._ctx2d.font = fontDecl;
    const visibleText = this._applyReveal(p.text, p.revealProgress, p.revealMode);
    const displayText = this._applyScramble(visibleText, p.scrambleProgress, p.scrambleCharSet);
    const lines = this._layoutLines(displayText, innerWidth, p.wrap);
    const lineH = p.fontSizePx * p.lineHeight;
    const blockH = lines.length * lineH;
    const targetHeightPx = Math.min(
      TextComponent.MAX_CANVAS_DIM,
      Math.max(p.fontSizePx + p.paddingPx * 2, Math.ceil(blockH + p.paddingPx * 2)),
    );

    if (this._canvas.width !== targetWidthPx) this._canvas.width = targetWidthPx;
    if (this._canvas.height !== targetHeightPx) this._canvas.height = targetHeightPx;

    const ctx = this._ctx2d;
    ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);

    if (p.backgroundColor) {
      ctx.fillStyle = `rgba(${rgb255(p.backgroundColor)}, ${p.backgroundOpacity})`;
      const radius = p.backgroundCornerRadiusPx ?? 0;
      if (radius > 0) {
        fillRoundedRect(ctx, 0, 0, this._canvas.width, this._canvas.height, radius);
      } else {
        ctx.fillRect(0, 0, this._canvas.width, this._canvas.height);
      }
    }

    ctx.font = fontDecl;
    ctx.textBaseline = 'top';
    ctx.fillStyle = `rgb(${rgb255(p.color)})`;
    if (p.outlineWidth > 0) {
      ctx.strokeStyle = `rgb(${rgb255(p.outlineColor)})`;
      ctx.lineWidth = p.outlineWidth;
      ctx.lineJoin = 'round';
    }

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const lineW = this._measureWithSpacing(ctx, line, p.letterSpacingPx);
      let x = p.paddingPx;
      if (p.align === 'center') x = (this._canvas.width - lineW) / 2;
      else if (p.align === 'right') x = this._canvas.width - p.paddingPx - lineW;
      const y = p.paddingPx + i * lineH;
      const charIndexOffset = this._lineStartIndex(displayText, i);
      this._drawLine(
        ctx,
        line,
        x,
        y,
        p.letterSpacingPx,
        p.outlineWidth > 0,
        charIndexOffset,
        p.waveAmplitude,
        p.wavePhase,
        p.waveFrequency,
      );
    }

    this._texture.needsUpdate = true;

    // Resize the plane so it preserves the canvas aspect at the requested world width.
    const widthWorld = p.widthWorld;
    const heightWorld = (targetHeightPx / targetWidthPx) * widthWorld;
    this._geometry.dispose();
    this._geometry = new THREE.PlaneGeometry(widthWorld, heightWorld);
    if (this._mesh) {
      this._mesh.geometry = this._geometry;
      this._applyAnchor(widthWorld, heightWorld);
    }
  }

  private _applyScramble(text: string, progress: number, charset: string): string {
    const p = Math.max(0, Math.min(1, progress));
    if (p >= 1 || !text || !charset) return text;
    const revealCount = Math.floor(text.length * p);
    const pool = charset.length > 0 ? charset : 'X';
    let out = '';
    for (let i = 0; i < text.length; i++) {
      const ch = text[i];
      if (i < revealCount) {
        out += ch;
      } else if (ch === '\n' || ch === ' ') {
        out += ch;
      } else {
        out += pool[this._scrambleIndex(i, ch) % pool.length];
      }
    }
    return out;
  }

  /** Deterministic scramble glyph per character index. */
  private _scrambleIndex(charIndex: number, original: string): number {
    const code = original.charCodeAt(0) || 0;
    return (charIndex * 7919 + code * 31) >>> 0;
  }

  private _lineStartIndex(fullText: string, lineIndex: number): number {
    if (lineIndex <= 0) return 0;
    const lines = fullText.split('\n');
    let idx = 0;
    for (let i = 0; i < lineIndex && i < lines.length; i++) {
      idx += lines[i].length + 1;
    }
    return idx;
  }

  private _applyReveal(text: string, progress: number, mode: TextRevealMode): string {
    const p = Math.max(0, Math.min(1, progress));
    if (mode === 'all' || p >= 1) return text;
    if (p <= 0) return '';
    if (mode === 'character') {
      const n = Math.floor(text.length * p);
      return text.slice(0, n);
    }
    if (mode === 'word') {
      const words = text.split(/(\s+)/);
      const wordIndexes = words
        .map((w, i) => ({ w, i }))
        .filter((x) => x.w.trim().length > 0);
      const target = Math.floor(wordIndexes.length * p);
      const cutoff = wordIndexes[target]?.i ?? words.length;
      return words.slice(0, cutoff).join('');
    }
    // line
    const lines = text.split('\n');
    const target = Math.floor(lines.length * p);
    return lines.slice(0, target).join('\n');
  }

  private _layoutLines(text: string, maxWidthPx: number, wrap: boolean): string[] {
    const ctx = this._ctx2d!;
    const out: string[] = [];
    for (const raw of text.split('\n')) {
      if (!wrap) {
        out.push(raw);
        continue;
      }
      const words = raw.split(' ');
      let current = '';
      for (const word of words) {
        const candidate = current ? `${current} ${word}` : word;
        const w = ctx.measureText(candidate).width;
        if (w <= maxWidthPx || !current) {
          current = candidate;
        } else {
          out.push(current);
          current = word;
        }
      }
      if (current) out.push(current);
      if (!words.length) out.push('');
    }
    return out.length > 0 ? out : [''];
  }

  private _measureWithSpacing(ctx: CanvasRenderingContext2D, line: string, spacing: number): number {
    if (spacing === 0) return ctx.measureText(line).width;
    let w = 0;
    for (const ch of line) w += ctx.measureText(ch).width + spacing;
    return Math.max(0, w - spacing);
  }

  private _drawLine(
    ctx: CanvasRenderingContext2D,
    line: string,
    x: number,
    y: number,
    spacing: number,
    stroke: boolean,
    charIndexOffset = 0,
    waveAmplitude = 0,
    wavePhase = 0,
    waveFrequency = 2,
  ): void {
    if (spacing === 0 && waveAmplitude === 0) {
      if (stroke) ctx.strokeText(line, x, y);
      ctx.fillText(line, x, y);
      return;
    }
    let cx = x;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      const waveY =
        waveAmplitude !== 0
          ? y + waveAmplitude * Math.sin(wavePhase + (charIndexOffset + i) * waveFrequency)
          : y;
      if (stroke) ctx.strokeText(ch, cx, waveY);
      ctx.fillText(ch, cx, waveY);
      cx += ctx.measureText(ch).width + spacing;
    }
  }

  private _applyAnchor(widthWorld: number, heightWorld: number): void {
    if (!this._mesh) return;
    const a = this._props.anchor;
    let ox = 0;
    let oy = 0;
    if (a === 'left' || a === 'top-left' || a === 'bottom-left') ox = widthWorld / 2;
    if (a === 'right' || a === 'top-right' || a === 'bottom-right') ox = -widthWorld / 2;
    if (a === 'top' || a === 'top-left' || a === 'top-right') oy = -heightWorld / 2;
    if (a === 'bottom' || a === 'bottom-left' || a === 'bottom-right') oy = heightWorld / 2;
    this._mesh.position.set(ox, oy, 0);
  }
}

/** Format an `RGB` color as `"r, g, b"` in 0..255 for `rgb()` / `rgba()`. */
function rgb255(c: RGB): string {
  const to = (v: number): number => Math.max(0, Math.min(255, Math.round(v * 255)));
  return `${to(c[0])}, ${to(c[1])}, ${to(c[2])}`;
}

/** Draw a filled rounded rectangle on a 2D canvas context. */
function fillRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
): void {
  const r = Math.max(0, Math.min(radius, width / 2, height / 2));
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + width - r, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + r);
  ctx.lineTo(x + width, y + height - r);
  ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
  ctx.lineTo(x + r, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
  ctx.fill();
}
