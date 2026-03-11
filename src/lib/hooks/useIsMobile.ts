'use client';

import { useEffect, useState } from 'react';

export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(pointer: coarse)');

    const updateState = (): void => {
      setIsMobile(mediaQuery.matches);
    };

    updateState();
    mediaQuery.addEventListener('change', updateState);

    return () => {
      mediaQuery.removeEventListener('change', updateState);
    };
  }, []);

  return isMobile;
}