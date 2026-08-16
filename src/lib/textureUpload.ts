import type { Texture } from 'three';

const pendingImageWatch = new WeakSet<Texture>();
const MAX_IMAGE_WAIT_FRAMES = 180;

/**
 * Three.js warns "Texture marked for update but no image data found" and can
 * leave the WebGL context drawing a blank frame when needsUpdate is set on a
 * Texture whose image has not loaded yet.
 */
export function textureHasImageData(texture: { image?: unknown } | null | undefined): boolean {
  if (!texture) {
    return false;
  }

  const image = texture.image as
    | {
        data?: unknown;
        width?: number;
        height?: number;
        complete?: boolean;
        naturalWidth?: number;
      }
    | undefined
    | null;

  if (image == null) {
    return false;
  }

  if (ArrayBuffer.isView(image) || image instanceof ArrayBuffer) {
    return true;
  }

  if (typeof image.complete === 'boolean' && image.complete === false) {
    return false;
  }

  if (typeof image.naturalWidth === 'number' && image.naturalWidth === 0) {
    return false;
  }

  if (typeof image.width === 'number' && image.width === 0) {
    return false;
  }

  return true;
}

/** Set needsUpdate only when the GPU would actually receive pixels. */
export function markTextureForUpload(texture: Texture | null | undefined): void {
  if (!texture) {
    return;
  }

  if (textureHasImageData(texture)) {
    texture.needsUpdate = true;
    return;
  }

  texture.needsUpdate = false;
  watchTextureImage(texture);
}

function watchTextureImage(texture: Texture): void {
  if (pendingImageWatch.has(texture) || typeof requestAnimationFrame !== 'function') {
    return;
  }

  pendingImageWatch.add(texture);
  let frames = 0;

  const tick = () => {
    if (textureHasImageData(texture)) {
      texture.needsUpdate = true;
      pendingImageWatch.delete(texture);
      return;
    }

    frames += 1;
    if (frames < MAX_IMAGE_WAIT_FRAMES) {
      requestAnimationFrame(tick);
      return;
    }

    pendingImageWatch.delete(texture);
  };

  requestAnimationFrame(tick);
}
