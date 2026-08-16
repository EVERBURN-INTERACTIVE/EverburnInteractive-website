import { existsSync } from 'node:fs';
import path from 'node:path';

const RUNTIME_MARKER = path.join('src', 'runtime', 'runtime.ts');

export function resolveFlameCoreRoot(projectRoot) {
  const vendor = path.join(projectRoot, 'vendor', 'FlameCore');
  const sibling = path.resolve(projectRoot, '..', '..', 'FlameCore');

  if (existsSync(path.join(vendor, RUNTIME_MARKER))) {
    return vendor;
  }

  if (existsSync(path.join(sibling, RUNTIME_MARKER))) {
    return sibling;
  }

  throw new Error(
    'FlameCore is required. Clone it as a sibling at ../../FlameCore or run npm install with FLAMECORE_PAT.',
  );
}
