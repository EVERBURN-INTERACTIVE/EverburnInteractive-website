'use client';

import { useEffect, useMemo, useState } from 'react';

import { getCurrentPhase, getPhaseForHour } from '@/lib/timeSystem';
import { TimePhaseConfig } from '@/types/scene';

function getDevHourOverride(): number | null {
  if (process.env.NODE_ENV !== 'development' || typeof window === 'undefined') {
    return null;
  }

  const value = new URLSearchParams(window.location.search).get('time');
  if (!value) {
    return null;
  }

  const hour = Number.parseInt(value, 10);
  if (Number.isNaN(hour) || hour < 0 || hour > 23) {
    return null;
  }

  return hour;
}

export function useTimePhase(): TimePhaseConfig {
  const initial = useMemo(() => {
    const override = getDevHourOverride();
    return override === null ? getCurrentPhase() : getPhaseForHour(override);
  }, []);

  const [phase, setPhase] = useState<TimePhaseConfig>(initial);

  useEffect(() => {
    const updatePhase = (): void => {
      const override = getDevHourOverride();
      setPhase(override === null ? getCurrentPhase() : getPhaseForHour(override));
    };

    updatePhase();
    const timer = window.setInterval(updatePhase, 60_000);
    return () => window.clearInterval(timer);
  }, []);

  return phase;
}