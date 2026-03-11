export type TimePhase = 'night' | 'sunrise' | 'day' | 'evening';

export type NavigationSection = 'games' | 'technology' | 'studio' | 'contact';

export interface TimePhaseConfig {
  phase: TimePhase;
  startHour: number;
  endHour: number;
  skyColorTop: string;
  skyColorBottom: string;
  birdsActive: boolean;
  starsActive: boolean;
  ambientIntensity: number;
  fogColor: string;
}

export interface ParticleLimits {
  fire: number;
  embers: number;
  cursorSparks: number;
  stars: number;
  birds: number;
}

export interface ParticleLimitsConfig {
  desktop: ParticleLimits;
  mobile: ParticleLimits;
}

export interface PathConfig {
  section: NavigationSection;
  label: string;
  href: string;
  position: [number, number, number];
  rotation: [number, number, number];
}

export interface SceneState {
  isLoaded: boolean;
  timePhase: TimePhase;
  activeTransition: NavigationSection | null;
  fireClickCount: number;
  audioEnabled: boolean;
  isMobile: boolean;
}

export const PATH_CONFIGS: PathConfig[] = [
  {
    section: 'games',
    label: 'OUR PROJECTS',
    href: '/games',
    position: [0, 0, -25],
    rotation: [Math.PI / 2, 0, 0],
  },
  {
    section: 'technology',
    label: 'TECHNOLOGY',
    href: '/technology',
    position: [25, 0, 0],
    rotation: [Math.PI / 2, 0, Math.PI / 2],
  },
  {
    section: 'studio',
    label: 'ABOUT US',
    href: '/studio',
    position: [-25, 0, 0],
    rotation: [Math.PI / 2, 0, Math.PI / 2],
  },
  {
    section: 'contact',
    label: 'CONTACT US',
    href: '/contact',
    position: [0, 0, 25],
    rotation: [Math.PI / 2, 0, 0],
  },
];

export const PARTICLE_LIMITS: ParticleLimitsConfig = {
  desktop: { fire: 80, embers: 40, cursorSparks: 30, stars: 150, birds: 5 },
  mobile: { fire: 40, embers: 20, cursorSparks: 0, stars: 80, birds: 3 },
};