import { spawnSync } from 'node:child_process';

const patterns = ['vendor/FlameCore', 'vendor/FlameCore-clone', '.ci-flamecore'];
const result = spawnSync('git', ['ls-files', '--', ...patterns], {
  encoding: 'utf8',
});

if (result.status !== 0) {
  console.error('[guard:flamecore] git ls-files failed.');
  process.exit(result.status === null ? 1 : result.status);
}

const tracked = result.stdout
  .split(/\r?\n/)
  .map((line) => line.trim())
  .filter(Boolean);

if (tracked.length > 0) {
  console.error('[guard:flamecore] Proprietary FlameCore source is tracked in this public repository.');
  console.error(tracked.join('\n'));
  console.error('Remove it with: git rm -r --cached vendor/FlameCore');
  console.error('Do not commit vendor/FlameCore. CI must use FLAMECORE_PAT instead.');
  process.exit(1);
}

console.log('[guard:flamecore] OK: no FlameCore source is tracked.');
