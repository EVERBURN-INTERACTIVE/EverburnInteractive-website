'use client';

import { useEffect, useRef } from 'react';

import { useIsMobile } from '@/lib/hooks/useIsMobile';

export function CursorFlame() {
  const isMobile = useIsMobile();
  const flameRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isMobile) return;

    const handleMove = (event: MouseEvent): void => {
      if (flameRef.current) {
        flameRef.current.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
      }
    };

    document.addEventListener('mousemove', handleMove, { passive: true });
    return () => document.removeEventListener('mousemove', handleMove);
  }, [isMobile]);

  if (isMobile) {
    return null;
  }

  return (
    <div
      ref={flameRef}
      aria-hidden
      className="cursor-flame"
    >
      <svg width="25" height="35" viewBox="0 0 25 35" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12.5 1C16 8 22 11 22 19C22 27 17.5 34 12.5 34C7.5 34 3 27 3 19C3 11 9 8 12.5 1Z" fill="#ff6a00" />
      </svg>
    </div>
  );
}