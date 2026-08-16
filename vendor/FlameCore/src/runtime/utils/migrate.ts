import type { ComponentMigration, SerializedComponentProps } from '@shared/types';

/**
 * Apply a chain of versioned migrations to a serialized props object.
 *
 * Each migration in `migrations` takes the props produced by the previous one
 * (or the original object for index 0) and returns the next-version shape.
 * The runner stops when no more migrations remain.
 */
export function migrate<T extends SerializedComponentProps>(
  raw: Record<string, unknown>,
  migrations: ReadonlyArray<ComponentMigration>,
  targetVersion: number,
): T {
  let current: Record<string, unknown> = { ...raw };
  let version = typeof current._version === 'number' ? current._version : 1;

  while (version < targetVersion) {
    const migration = migrations[version - 1];
    if (!migration) {
      throw new Error(
        `Missing migration from v${version} to v${version + 1} (target v${targetVersion}).`,
      );
    }
    current = migration(current);
    version += 1;
    current._version = version;
  }

  return current as T;
}
