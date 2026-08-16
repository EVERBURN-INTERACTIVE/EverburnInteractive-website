import { cpSync, existsSync, lstatSync, mkdirSync, rmSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const vendorDir = path.join(projectRoot, 'vendor', 'FlameCore');
const vendorMarker = path.join(vendorDir, 'src', 'runtime', 'runtime.ts');
const siblingDir = path.resolve(projectRoot, '..', '..', 'FlameCore');
const siblingMarker = path.join(siblingDir, 'src', 'runtime', 'runtime.ts');
const envRoot = process.env.FLAMECORE_ROOT?.trim();

function hasFlameCore(markerPath) {
  return existsSync(markerPath);
}

function vendorInstallIsValid() {
  if (!hasFlameCore(vendorMarker)) {
    return false;
  }

  try {
    return !lstatSync(vendorDir).isSymbolicLink();
  } catch {
    return false;
  }
}

function copyRuntimeTree(sourceRoot) {
  if (existsSync(vendorDir)) {
    rmSync(vendorDir, { recursive: true, force: true });
  }

  mkdirSync(path.join(vendorDir, 'src'), { recursive: true });
  cpSync(path.join(sourceRoot, 'src', 'runtime'), path.join(vendorDir, 'src', 'runtime'), {
    recursive: true,
  });
  cpSync(path.join(sourceRoot, 'src', 'shared'), path.join(vendorDir, 'src', 'shared'), {
    recursive: true,
  });

  console.log(`[ensure-flamecore] Copied FlameCore runtime into vendor/FlameCore from ${sourceRoot}`);
}

function cloneFlameCore() {
  const token = process.env.FLAMECORE_PAT?.trim();
  if (!token) {
    return false;
  }

  const cloneTarget = path.join(projectRoot, 'vendor', 'FlameCore-clone');
  if (existsSync(cloneTarget)) {
    rmSync(cloneTarget, { recursive: true, force: true });
  }

  mkdirSync(path.join(projectRoot, 'vendor'), { recursive: true });
  const cloneUrl = `https://x-access-token:${token}@github.com/PhoenixtBlaze/FlameCore.git`;
  console.log('[ensure-flamecore] Cloning FlameCore for a private CI vendor copy …');

  const result = spawnSync(
    'git',
    ['clone', '--depth', '1', cloneUrl, cloneTarget],
    { stdio: 'inherit', shell: process.platform === 'win32' },
  );

  if (result.status !== 0 || !hasFlameCore(path.join(cloneTarget, 'src', 'runtime', 'runtime.ts'))) {
    return false;
  }

  copyRuntimeTree(cloneTarget);
  rmSync(cloneTarget, { recursive: true, force: true });
  return hasFlameCore(vendorMarker);
}

if (vendorInstallIsValid()) {
  process.exit(0);
}

if (envRoot && hasFlameCore(path.join(envRoot, 'src', 'runtime', 'runtime.ts'))) {
  copyRuntimeTree(envRoot);
  process.exit(0);
}

if (hasFlameCore(siblingMarker)) {
  copyRuntimeTree(siblingDir);
  process.exit(0);
}

if (cloneFlameCore()) {
  process.exit(0);
}

console.error('[ensure-flamecore] FlameCore is required but not available.');
console.error('  Local dev: clone FlameCore as a sibling at ../../FlameCore');
console.error('  CI: set FLAMECORE_PAT (read access to the private FlameCore repo).');
process.exit(1);
