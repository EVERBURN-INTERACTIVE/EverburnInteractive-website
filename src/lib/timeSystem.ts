import { TimePhaseConfig } from '@/types/scene';

export const TIME_PHASES: TimePhaseConfig[] = [
  {
    phase: 'night',
    startHour: 0,
    endHour: 5,
    skyColorTop: '#020111',
    skyColorBottom: '#0a1a3a',
    birdsActive: false,
    starsActive: true,
    ambientIntensity: 0.05,
    fogColor: '#0a1a3a',
  },
  {
    phase: 'sunrise',
    startHour: 5,
    endHour: 8,
    skyColorTop: '#df8b58',
    skyColorBottom: '#c08a69',
    birdsActive: true,
    starsActive: false,
    ambientIntensity: 0.3,
    fogColor: '#a97d63',
  },
  {
    phase: 'day',
    startHour: 8,
    endHour: 18,
    skyColorTop: '#5da2c8',
    skyColorBottom: '#4f7898',
    birdsActive: true,
    starsActive: false,
    ambientIntensity: 0.8,
    fogColor: '#4a6f8c',
  },
  {
    phase: 'evening',
    startHour: 18,
    endHour: 21,
    skyColorTop: '#ff9966',
    skyColorBottom: '#663399',
    birdsActive: true,
    starsActive: false,
    ambientIntensity: 0.2,
    fogColor: '#663399',
  },
];

export function getPhaseForHour(hour: number): TimePhaseConfig {
  const normalizedHour = ((hour % 24) + 24) % 24;

  if (normalizedHour >= 21 || normalizedHour < 5) {
    return TIME_PHASES[0];
  }

  const config = TIME_PHASES.find(
    (phase) => normalizedHour >= phase.startHour && normalizedHour < phase.endHour,
  );

  return config ?? TIME_PHASES[0];
}

export function getCurrentPhase(): TimePhaseConfig {
  return getPhaseForHour(new Date().getHours());
}