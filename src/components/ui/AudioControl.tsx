'use client';

import { useEffect, useRef, useState } from 'react';

import { useIsMobile } from '@/lib/hooks/useIsMobile';

export function AudioControl() {
  const isMobile = useIsMobile();
  const [manualEnabled, setManualEnabled] = useState<boolean | null>(null);
  const [unlocked, setUnlocked] = useState<boolean>(false);
  const contextRef = useRef<AudioContext | null>(null);

  const enabled = manualEnabled ?? !isMobile;

  useEffect(() => {
    const unlock = async (): Promise<void> => {
      if (unlocked) {
        return;
      }

      const context = new AudioContext();
      contextRef.current = context;
      await context.resume();
      setUnlocked(true);
    };

    window.addEventListener('click', unlock, { once: true });
    window.addEventListener('keydown', unlock, { once: true });

    return () => {
      window.removeEventListener('click', unlock);
      window.removeEventListener('keydown', unlock);
      if (contextRef.current) {
        void contextRef.current.close();
      }
    };
  }, [unlocked]);

  return (
    <button
      type="button"
      className="fixed bottom-4 right-4 z-50 rounded-full bg-black/40 p-2 text-orange-300 hover:bg-black/60"
      onClick={() => setManualEnabled(!enabled)}
      aria-label={enabled ? 'Mute ambient audio' : 'Unmute ambient audio'}
    >
      {enabled ? '🔥' : '🔇'}
    </button>
  );
}