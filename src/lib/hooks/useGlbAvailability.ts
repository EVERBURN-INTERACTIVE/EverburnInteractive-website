'use client';

import { useEffect, useState } from 'react';

/** Returns null while checking, true if the glb exists, false if missing. */
export function useGlbAvailability(url: string): boolean | null {
  const bareUrl = url.split('?')[0];
  const [available, setAvailable] = useState<boolean | null>(null);

  useEffect(() => {
    let cancelled = false;
    setAvailable(null);

    fetch(bareUrl, { method: 'HEAD' })
      .then((response) => {
        if (!cancelled) {
          setAvailable(response.ok);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setAvailable(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [bareUrl]);

  return available;
}
