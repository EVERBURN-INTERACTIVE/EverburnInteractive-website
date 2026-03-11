'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface FireTransitionProps {
  active: boolean;
  onCovered?: () => void;
  onComplete?: () => void;
}

export function FireTransition({ active, onCovered, onComplete }: FireTransitionProps) {
  const overlayRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!active || !overlayRef.current) {
      return;
    }

    const timeline = gsap.timeline({
      onComplete,
    });

    timeline
      .set(overlayRef.current, { opacity: 0, display: 'block' })
      .to(overlayRef.current, { opacity: 1, duration: 0.4, ease: 'power2.in' })
      .call(() => onCovered?.())
      .to(overlayRef.current, { opacity: 0, duration: 0.4, ease: 'power2.out' });

    return () => {
      timeline.kill();
    };
  }, [active, onCovered, onComplete]);

  return <div className="fire-transition" ref={overlayRef} aria-hidden />;
}