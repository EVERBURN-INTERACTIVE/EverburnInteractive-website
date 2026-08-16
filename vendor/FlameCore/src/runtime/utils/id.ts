/**
 * Generate a short, sufficiently-unique identifier for actors and components.
 * Uses `crypto.randomUUID` when available, falls back to a base36 timestamp + random suffix.
 */
export function createId(prefix = ''): string {
  const id =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
  return prefix ? `${prefix}_${id}` : id;
}
