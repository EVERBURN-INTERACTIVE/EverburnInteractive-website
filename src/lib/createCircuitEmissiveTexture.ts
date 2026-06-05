import { CanvasTexture, RepeatWrapping, SRGBColorSpace } from 'three';

const TEXTURE_SIZE = 1024;

function drawSegment(
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  width: number,
): void {
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  ctx.strokeStyle = 'rgba(55, 190, 255, 0.22)';
  ctx.lineWidth = width + 10;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();

  ctx.strokeStyle = 'rgba(90, 228, 255, 0.55)';
  ctx.lineWidth = width + 3;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();

  ctx.strokeStyle = '#b8f6ff';
  ctx.lineWidth = width;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

function drawNode(ctx: CanvasRenderingContext2D, x: number, y: number, radius: number): void {
  const glow = ctx.createRadialGradient(x, y, 0, x, y, radius * 4.5);
  glow.addColorStop(0, 'rgba(200, 245, 255, 1)');
  glow.addColorStop(0.25, 'rgba(80, 210, 255, 0.65)');
  glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(x, y, radius * 4.5, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#d8fbff';
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
}

/** Tileable circuit-board emissive map: black base, bright cyan traces + nodes. */
export function createCircuitEmissiveTexture(): CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = TEXTURE_SIZE;
  canvas.height = TEXTURE_SIZE;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Could not create circuit emissive texture canvas');
  }

  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, TEXTURE_SIZE, TEXTURE_SIZE);

  const s = TEXTURE_SIZE;
  const busX = s * 0.06;

  // Vertical bus trunk
  drawSegment(ctx, busX, s * 0.12, busX, s * 0.88, 2.4);

  // Horizontal bus lines branching from trunk (reference-style bundle)
  const busLines = [0.22, 0.36, 0.5, 0.64, 0.78];
  busLines.forEach((t, index) => {
    const y = s * t;
    const reach = s * (0.38 + index * 0.08);
    drawSegment(ctx, busX, y, reach, y, index === 2 ? 2.2 : 1.6);

    // 45° branch upward
    drawSegment(ctx, reach, y, reach + s * 0.1, y - s * 0.1, 1.4);
    drawSegment(ctx, reach + s * 0.1, y - s * 0.1, reach + s * 0.28, y - s * 0.1, 1.2);
    drawNode(ctx, reach + s * 0.28, y - s * 0.1, 3.5);

    // 90° branch downward on alternating lines
    if (index % 2 === 0) {
      drawSegment(ctx, reach, y, reach, y + s * 0.12, 1.3);
      drawSegment(ctx, reach, y + s * 0.12, reach + s * 0.18, y + s * 0.12, 1.2);
      drawNode(ctx, reach + s * 0.18, y + s * 0.12, 3);
    }
  });

  // Secondary sparse traces (minimal, not grid-heavy)
  drawSegment(ctx, s * 0.55, s * 0.18, s * 0.72, s * 0.18, 1.2);
  drawSegment(ctx, s * 0.72, s * 0.18, s * 0.82, s * 0.28, 1.1);
  drawNode(ctx, s * 0.82, s * 0.28, 3.2);

  drawSegment(ctx, s * 0.48, s * 0.72, s * 0.68, s * 0.72, 1.2);
  drawSegment(ctx, s * 0.68, s * 0.72, s * 0.78, s * 0.62, 1.1);
  drawNode(ctx, s * 0.78, s * 0.62, 3);

  drawSegment(ctx, s * 0.62, s * 0.45, s * 0.62, s * 0.58, 1.1);
  drawNode(ctx, s * 0.62, s * 0.58, 2.8);

  const texture = new CanvasTexture(canvas);
  texture.wrapS = RepeatWrapping;
  texture.wrapT = RepeatWrapping;
  texture.colorSpace = SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}
