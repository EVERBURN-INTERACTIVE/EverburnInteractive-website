import type { User } from '@supabase/supabase-js';

import type { Profile } from '@/lib/supabase/types';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import { getUserDisplayName } from '@/lib/supabase/userDisplayName';

export interface LeaderboardEntry {
  rank: number;
  name: string;
  time: string;
}

export const OMS_LEADERBOARD_LIMIT = 8;
export const OMS_LEADERBOARD_REFRESH_EVENT = 'oms-leaderboard-refresh';

const EMPTY_TIME = '--:--.---';

export const EMPTY_OMS_LEADERBOARD: LeaderboardEntry[] = Array.from(
  { length: OMS_LEADERBOARD_LIMIT },
  (_, index) => ({
    rank: index + 1,
    name: '—',
    time: EMPTY_TIME,
  }),
);

export function formatOmsLeaderboardTime(seconds: number): string {
  const clamped = Math.max(0, Number.isFinite(seconds) ? seconds : 0);
  const totalMs = Math.round(clamped * 1000);
  const minutes = Math.floor(totalMs / 60000);
  const restMs = totalMs % 60000;
  const wholeSeconds = Math.floor(restMs / 1000);
  const ms = restMs % 1000;

  return `${String(minutes).padStart(2, '0')}:${String(wholeSeconds).padStart(2, '0')}.${String(ms).padStart(3, '0')}`;
}

export function padOmsLeaderboard(entries: LeaderboardEntry[]): LeaderboardEntry[] {
  const top = entries.slice(0, OMS_LEADERBOARD_LIMIT);
  if (top.length >= OMS_LEADERBOARD_LIMIT) {
    return top;
  }

  return [
    ...top,
    ...EMPTY_OMS_LEADERBOARD.slice(top.length).map((entry, index) => ({
      ...entry,
      rank: top.length + index + 1,
    })),
  ];
}

export function notifyOmsLeaderboardRefresh(): void {
  if (typeof window === 'undefined') {
    return;
  }

  window.dispatchEvent(new Event(OMS_LEADERBOARD_REFRESH_EVENT));
}

export async function fetchOmsLeaderboard(): Promise<LeaderboardEntry[]> {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) {
    return EMPTY_OMS_LEADERBOARD;
  }

  const { data, error } = await supabase
    .from('one_more_second_scores')
    .select('display_name, best_seconds')
    .order('best_seconds', { ascending: false })
    .order('updated_at', { ascending: true })
    .limit(OMS_LEADERBOARD_LIMIT);

  if (error || !data) {
    if (error) {
      console.error('One More Second leaderboard could not be loaded', error.message);
    }
    return EMPTY_OMS_LEADERBOARD;
  }

  const entries = data.map((row, index) => ({
    rank: index + 1,
    name: row.display_name.trim() || 'Player',
    time: formatOmsLeaderboardTime(Number(row.best_seconds)),
  }));

  return padOmsLeaderboard(entries);
}

export async function submitOmsScore(
  seconds: number,
  user: User | null,
  profile: Profile | null,
): Promise<boolean> {
  const supabase = getSupabaseBrowserClient();
  if (!supabase || !user) {
    return false;
  }

  if (!Number.isFinite(seconds) || seconds < 0) {
    console.error('One More Second score was not saved: invalid time');
    return false;
  }

  const displayName = profile?.display_name?.trim() || getUserDisplayName(user);
  const bestSeconds = Math.round(seconds * 1000) / 1000;
  const { error } = await supabase.from('one_more_second_scores').upsert(
    {
      user_id: user.id,
      display_name: displayName,
      best_seconds: bestSeconds,
    },
    { onConflict: 'user_id' },
  );

  if (error) {
    console.error('One More Second score was not saved', error.message);
    return false;
  }

  notifyOmsLeaderboardRefresh();
  return true;
}
