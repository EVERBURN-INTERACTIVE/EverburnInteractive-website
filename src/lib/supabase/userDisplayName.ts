import type { User } from '@supabase/supabase-js';

/** Best available public name for leaderboards and the account chip. */
export function getUserDisplayName(user: User): string {
  const metadata = user.user_metadata ?? {};
  const name = metadata.full_name ?? metadata.name ?? metadata.user_name;

  if (typeof name === 'string' && name.trim().length > 0) {
    return name.trim();
  }

  return user.email?.split('@')[0] ?? 'Everburn Player';
}

export function getUserAvatarUrl(user: User): string | null {
  const avatar = user.user_metadata.avatar_url ?? user.user_metadata.picture;
  return typeof avatar === 'string' ? avatar : null;
}
