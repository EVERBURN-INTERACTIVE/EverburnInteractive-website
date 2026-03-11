export interface DprBounds {
  min: number;
  max: number;
}

export function getTargetDpr(currentFps: number, currentDpr: number, bounds: DprBounds): number {
  if (currentFps < 45) {
    return Math.max(bounds.min, Number((currentDpr - 0.05).toFixed(2)));
  }

  if (currentFps > 58) {
    return Math.min(bounds.max, Number((currentDpr + 0.05).toFixed(2)));
  }

  return currentDpr;
}