export interface LocalStats {
  gamesPlayed: number;
  wins: number;
  losses: number;
  rating: number;
  lastUpdated: number;
}

const STORAGE_KEY = 'chase_stats_v1';

export function loadStats(): LocalStats {
  const raw = typeof localStorage === 'undefined' ? null : localStorage.getItem(STORAGE_KEY);
  if (!raw) return defaultStats();
  try {
    const parsed = JSON.parse(raw) as LocalStats;
    return { ...defaultStats(), ...parsed };
  } catch {
    return defaultStats();
  }
}

export function saveStats(stats: LocalStats): void {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...stats, lastUpdated: Date.now() }));
}

export function updateAfterGame(stats: LocalStats, didWin: boolean): LocalStats {
  const next: LocalStats = { ...stats };
  next.gamesPlayed += 1;
  if (didWin) {
    next.wins += 1;
    next.rating += 10;
  } else {
    next.losses += 1;
    next.rating = Math.max(0, next.rating - 5);
  }
  next.lastUpdated = Date.now();
  return next;
}

function defaultStats(): LocalStats {
  return {
    gamesPlayed: 0,
    wins: 0,
    losses: 0,
    rating: 1000,
    lastUpdated: Date.now(),
  };
}
