import { useCallback, useEffect, useState } from 'react';

import type { LeaderboardEntry } from '@/lib/omsLeaderboard';
import {
  EMPTY_OMS_LEADERBOARD,
  OMS_LEADERBOARD_REFRESH_EVENT,
  fetchOmsLeaderboard,
} from '@/lib/omsLeaderboard';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';

export function useOmsLeaderboard(active: boolean): LeaderboardEntry[] {
  const [entries, setEntries] = useState<LeaderboardEntry[]>(EMPTY_OMS_LEADERBOARD);

  const load = useCallback(async () => {
    const next = await fetchOmsLeaderboard();
    setEntries(next);
  }, []);

  useEffect(() => {
    if (!active) {
      return;
    }

    void load();

    const onRefresh = () => {
      void load();
    };
    window.addEventListener(OMS_LEADERBOARD_REFRESH_EVENT, onRefresh);

    const supabase = getSupabaseBrowserClient();
    const channel = supabase
      ?.channel('oms-leaderboard')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'one_more_second_scores' },
        () => {
          void load();
        },
      )
      .subscribe();

    return () => {
      window.removeEventListener(OMS_LEADERBOARD_REFRESH_EVENT, onRefresh);
      if (channel && supabase) {
        void supabase.removeChannel(channel);
      }
    };
  }, [active, load]);

  return entries;
}
