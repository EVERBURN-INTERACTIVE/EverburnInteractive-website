export interface GameCard {
  title: string;
  subtitle?: string;
  description: string;
  tags: string[];
  status: 'released' | 'in-development' | 'concept';
  link?: string;
}

export interface ProjectCard {
  title: string;
  description: string;
  techStack: string[];
  repoUrl?: string;
  liveUrl?: string;
}

export interface PhilosophyPrinciple {
  title: string;
  description: string;
}

// ─── Our Projects / Games ─────────────────────────────────────────────────────

export const GAMES: GameCard[] = [
  {
    title: 'Marble Party',
    subtitle: 'In Development',
    description:
      'A fast-paced physics-driven multiplayer party game built around chaotic marble racing, unpredictable environments, and dynamic abilities. Players control unique marbles racing through vibrant obstacle-filled courses where momentum, timing, and clever use of abilities determine the winner.',
    tags: ['Multiplayer', 'Physics', 'Party Game', 'PC'],
    status: 'in-development',
  },
];

export const FUTURE_PROJECTS_NOTE =
  'Everburn Interactive is also working on additional projects and long-term IP development that will be revealed in the future. Our goal is to create experiences that push the boundaries of interactive storytelling and gameplay systems.';

// ─── Technology ───────────────────────────────────────────────────────────────

export interface TechBullet {
  label?: string;
  text: string;
}

export interface TechArea {
  title: string;
  intro: string;
  bullets?: TechBullet[];
}

export const TECHNOLOGY_AREAS: TechArea[] = [
  {
    title: 'Building with the Best Tools',
    intro:
      'At Everburn Interactive, we believe that great experiences come from combining strong creative vision with the right technology. Rather than limiting ourselves to a single platform or engine, we work across a wide range of industry-standard tools and development environments to ensure every project is built using the technology that best fits the experience we want to create.',
  },
  {
    title: 'Game Engines',
    intro:
      'We primarily build our interactive experiences using modern game engines that allow for high performance, scalability, and flexibility. Our workflow includes experience with engines such as:',
    bullets: [
      { label: 'Unreal Engine', text: 'for high-fidelity environments, advanced gameplay systems, and immersive interactive worlds' },
      { label: 'Unity', text: 'for flexible cross-platform development and rapid iteration' },
      { text: 'Custom engine tools and internal systems where necessary' },
    ],
  },
  {
    title: '3D Creation and Asset Production',
    intro:
      'Creating believable and engaging worlds requires powerful creative tools. Our art and asset pipelines include software commonly used across the game industry such as:',
    bullets: [
      { label: 'Blender', text: 'for 3D modeling, sculpting, and animation' },
      { text: 'Industry-standard texturing and material workflows' },
      { text: 'Physics-based asset creation and simulation' },
      { text: 'Optimization pipelines to ensure assets perform efficiently in real-time environments' },
    ],
  },
  {
    title: 'Development Tools and Pipelines',
    intro:
      'Game development involves more than just engines and art tools. Our pipeline includes tools for:',
    bullets: [
      { text: 'Version control and collaborative development' },
      { text: 'Scripting and gameplay system development' },
      { text: 'Performance profiling and optimization' },
      { text: 'Cross-platform testing' },
      { text: 'Automation and build management' },
    ],
  },
  {
    title: 'Performance and Player Experience',
    intro:
      'Technology decisions at Everburn are always made with one goal in mind: delivering the best possible experience for players. Every system is designed with attention to:',
    bullets: [
      { text: 'Performance' },
      { text: 'Stability' },
      { text: 'Responsiveness' },
      { text: 'Scalability for future updates' },
    ],
  },
  {
    title: 'Always Exploring',
    intro:
      'The technology landscape evolves quickly, and we continuously explore new tools, techniques, and workflows that can help us create better experiences. Whether it involves new development tools, advanced rendering techniques, or innovative gameplay systems, we remain committed to pushing the boundaries of what interactive experiences can become.',
  },
];

export const TECHNOLOGY_PROJECTS: ProjectCard[] = [
  {
    title: 'Everburn Scene Runtime',
    description:
      'A modular rendering layer for atmosphere-heavy environments with strict performance budgets and deterministic state transitions.',
    techStack: ['TypeScript', 'Next.js', 'Three.js', 'R3F'],
  },
  {
    title: 'Ember Telemetry Toolkit',
    description:
      'A lightweight metrics package for tracking frame pacing, interaction funnels, and route-transition resilience.',
    techStack: ['TypeScript', 'Web Vitals', 'Custom Analytics'],
  },
];

// ─── About Us / Studio ────────────────────────────────────────────────────────

export const STUDIO_TAGLINE = 'We build worlds that feel quiet before they burn.';

export const STUDIO_INTRO =
  'Everburn Interactive is an independent game and technology studio focused on building original interactive experiences, advanced creative tools, and experimental AI-powered systems.';

export const STUDIO_MISSION =
  'Founded with a long-term vision of blending game development, artificial intelligence, and immersive technologies, Everburn explores new ways for players and creators to interact with digital worlds.';

export const STUDIO_DOMAINS: string[] = [
  'Video games',
  'Interactive simulations',
  'AI-powered creative tools',
  'Virtual reality experiences',
  'Advanced developer tooling',
];

export const STUDIO_PHILOSOPHY_INTRO =
  'At Everburn Interactive, we believe that great games are not just products — they are worlds. Every system we build is designed around three core principles:';

export const STUDIO_PRINCIPLES: PhilosophyPrinciple[] = [
  {
    title: 'Player Agency',
    description:
      'Players should feel that their actions matter. Systems should react dynamically and allow emergent gameplay rather than rigid scripted experiences.',
  },
  {
    title: 'Technological Innovation',
    description:
      'We actively explore cutting-edge tools, AI systems, and experimental design approaches to push beyond traditional development boundaries.',
  },
  {
    title: 'Long-Term Worldbuilding',
    description:
      'Our projects are designed with long-term universes in mind, where stories, mechanics, and worlds can evolve over time.',
  },
];

export const STUDIO_VISION_INTRO = 'Everburn Interactive is building toward a future where:';

export const STUDIO_VISION_BULLETS: string[] = [
  'Games feel alive and reactive',
  'AI assists both developers and players',
  'Interactive worlds grow and evolve with their communities',
];

export const STUDIO_VISION_CLOSE =
  'Our long-term goal is to develop both flagship original IPs and powerful tools that empower creators.';

export const STUDIO_STORY: string[] = [
  'Everburn Interactive LLP was formed to chase a specific feeling: interactive spaces that are atmospheric, intentional, and mechanically sharp. We are a compact team that prefers deliberate craft over volume.',
  'Our studio grew from late-night prototypes and long conversations about memory, myth, and play. We focus on projects that reward attention and leave players with a lingering afterimage rather than a checklist of features.',
  'Every release is treated as a long-term world, not a disposable sprint. We iterate patiently, tighten systems relentlessly, and ship when the flame is stable.',
];

export const STUDIO_VISION =
  'Everburn is building a catalog of original worlds connected by craft discipline, systemic depth, and a signature tone of calm intensity.';

export const STUDIO_CURRENT_PROJECTS: Array<{ label: string; href: string }> = [
  { label: 'Marble Party', href: '/games' },
  { label: 'Runtime Technology Notes', href: '/technology' },
];

// ─── Contact Us ───────────────────────────────────────────────────────────────

export const CONTACT_INTRO = 'If you are interested in our projects, technology, or potential collaborations, feel free to reach out.';

export const CONTACT_AUDIENCES: string[] = [
  'Developers',
  'Creators',
  'Collaborators',
  'Communities',
  'Industry partners',
];

export const CONTACT_CONTENT = {
  company: 'Everburn Interactive',
  location: 'Gujarat, India',
  email: 'contact@everburninteractive.com',
  partnerships: 'partnerships@everburn.studio',
  website: 'https://everburninteractive.com',
  social: [
    { label: 'YouTube — @everburninteractive', href: 'https://www.youtube.com/@everburninteractive' },
    { label: 'X — @everburn_games', href: 'https://x.com/everburn_games' },
    { label: 'Twitch — @everburninteractive', href: 'https://www.twitch.tv/everburninteractive' },
  ],
};

export const CONTACT_FOLLOW_NOTE =
  'As our projects grow, more updates and development insights will be shared through our official channels and community platforms. Stay tuned as we continue building new worlds and technologies.';
