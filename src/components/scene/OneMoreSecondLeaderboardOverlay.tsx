'use client';

import type { CSSProperties } from 'react';

import {
  BATTLE_ARENA_INSET_BG,
  BATTLE_ARENA_NEON_EDGE,
  BATTLE_ARENA_PANEL_BG,
  BATTLE_ARENA_ROW_BG,
} from '@/lib/battleArenaUiTheme';
import { useOmsLeaderboard } from '@/lib/hooks/useOmsLeaderboard';

/** DOM leaderboard kept over the One More Second attract view. */
export function OneMoreSecondLeaderboardOverlay() {
  const entries = useOmsLeaderboard(true);

  return (
    <aside className="oms-leaderboard" aria-label="Leaderboard" style={{
      '--oms-board-bg': BATTLE_ARENA_PANEL_BG,
      '--oms-board-inset': BATTLE_ARENA_INSET_BG,
      '--oms-board-row': BATTLE_ARENA_ROW_BG,
      '--oms-board-edge': BATTLE_ARENA_NEON_EDGE,
    } as CSSProperties}>
      <h2>Leaderboard</h2>
      <div className="oms-leaderboard-head">
        <span>#</span>
        <span>Player</span>
        <span>Time</span>
      </div>
      <ol>
        {entries.map((entry, index) => (
          <li key={entry.rank} className={index === 0 ? 'is-first' : undefined}>
            <span>{entry.rank}</span>
            <span>{entry.name}</span>
            <span>{entry.time}</span>
          </li>
        ))}
      </ol>
    </aside>
  );
}
