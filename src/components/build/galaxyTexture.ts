import { CanvasTexture, LinearFilter, RepeatWrapping } from 'three';

function hash(x: number, y: number): number {
  const n = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return n - Math.floor(n);
}

function noise(x: number, y: number): number {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const fx = x - ix;
  const fy = y - iy;
  const ux = fx * fx * (3 - 2 * fx);
  const uy = fy * fy * (3 - 2 * fy);
  const a = hash(ix, iy);
  const b = hash(ix + 1, iy);
  const c = hash(ix, iy + 1);
  const d = hash(ix + 1, iy + 1);
  return a + (b - a) * ux + (c - a) * uy * (1 - ux) + (d - b) * ux * uy;
}

function fbm(x: number, y: number): number {
  let value = 0;
  let amp = 0.5;
  let px = x;
  let py = y;
  for (let i = 0; i < 5; i += 1) {
    value += amp * noise(px, py);
    px *= 2.07;
    py *= 2.07;
    amp *= 0.52;
  }
  return value;
}

/** Procedural Milky-Way style map used on the forge sky and rings. */
export function createGalaxyTexture(width = 1024, height = 512): CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d');
  if (!context) {
    throw new Error('Could not create galaxy texture canvas');
  }

  const image = context.createImageData(width, height);
  const data = image.data;

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const u = x / width;
      const v = y / height;
      const band = Math.exp(-Math.pow((v - 0.5) / 0.16, 2));
      const warp = fbm(u * 4.2, v * 3.4) * 0.22;
      const cloud = fbm(u * 6 + warp, v * 5.5 + warp * 2);
      const arms = 0.45 + 0.55 * Math.sin(u * Math.PI * 6 + cloud * 4);
      const core = Math.exp(-Math.pow((v - 0.5) / 0.28, 2)) * (0.35 + 0.65 * cloud);
      const nebula = Math.max(0, cloud * band * arms);

      const star = hash(x * 0.37, y * 0.91);
      const starBright = star > 0.992 ? (star - 0.992) * 80 : star > 0.97 ? (star - 0.97) * 8 : 0;

      const r = 18 + nebula * 170 + core * 140 + starBright * 255;
      const g = 12 + nebula * 90 + core * 180 + starBright * 240;
      const b = 36 + nebula * 210 + core * 110 + starBright * 255;
      const i = (y * width + x) * 4;
      data[i] = Math.min(255, r);
      data[i + 1] = Math.min(255, g);
      data[i + 2] = Math.min(255, b);
      data[i + 3] = 255;
    }
  }

  context.putImageData(image, 0, 0);

  const texture = new CanvasTexture(canvas);
  texture.wrapS = RepeatWrapping;
  texture.wrapT = RepeatWrapping;
  texture.minFilter = LinearFilter;
  texture.magFilter = LinearFilter;
  texture.needsUpdate = true;
  return texture;
}
