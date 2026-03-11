'use client';

import { useCallback, useState } from 'react';

const FIRE_CLICK_KEY = 'everburn_fire_click_count';

export function useFireClickCount() {
  const [count, setCount] = useState<number>(() => {
    if (typeof window === 'undefined') {
      return 0;
    }

    const storedValue = window.sessionStorage.getItem(FIRE_CLICK_KEY);
    if (!storedValue) {
      return 0;
    }

    const parsed = Number.parseInt(storedValue, 10);
    return !Number.isNaN(parsed) && parsed >= 0 ? parsed : 0;
  });

  const persistCount = useCallback((nextCount: number): void => {
    window.sessionStorage.setItem(FIRE_CLICK_KEY, String(nextCount));
    setCount(nextCount);
  }, []);

  const increment = useCallback(() => {
    const nextCount = count + 1;
    persistCount(nextCount);
    return nextCount;
  }, [count, persistCount]);

  const reset = useCallback(() => {
    persistCount(0);
  }, [persistCount]);

  return {
    count,
    increment,
    reset,
  };
}