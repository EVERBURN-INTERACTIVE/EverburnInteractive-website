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
      'Marble Party is a Twitch-integrated marble racing party game where the audience is not just watching — they are playing. Twitch chat viewers join the race directly through chat commands, controlling their own marbles in real time alongside the streamer. Built on Unreal Engine 5 with server-authoritative physics, every race is chaotic, unpredictable, and entirely shaped by the community in the room.',
    tags: ['Twitch Integration', 'Multiplayer', 'Physics', 'Party Game', 'PC', 'Live Streaming'],
    status: 'in-development',
  },
];

export const FUTURE_PROJECTS_NOTE =
  'Everburn Interactive is actively developing additional original IPs beyond Marble Party. These projects are being built with the same commitment to originality and long-term world design. They will be revealed when the time is right.';

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
    title: 'Built on the Right Foundation',
    intro:
      'Every technology decision at Everburn Interactive starts with a single question: what does this specific experience actually need? We do not default to tools because they are popular. We choose them because they are the right fit for the systems we are building. That is why this site and our browser games run on FlameCore, while Marble Party is built in Unreal Engine 5.',
  },
  {
    title: 'FlameCore Engine',
    intro:
      'FlameCore is our in-house browser 3D engine. It is written in TypeScript on Three.js, with a runtime that ships inside this website, a visual editor for authoring scenes, and an export pipeline for static hosts. We use it for the Everburn Interactive site and for browser games such as One More Second:',
    bullets: [
      { label: 'Runtime', text: 'actor and component scenes with animation, physics, audio, particles, text/UI, and LOD/quality tools' },
      { label: 'Editor and pipeline', text: 'visual authoring, asset and project storage, and export to static HTML, JavaScript, and assets' },
      { label: 'Web stack', text: 'TypeScript and Three.js, with Next.js on this site and Vite for the FlameCore editor' },
      { label: 'Browser games', text: 'WebGL-first experiences that run without a native install, including One More Second' },
    ],
  },
  {
    title: 'Game Engine — Unreal Engine 5',
    intro:
      'For native, physics-heavy live-audience games we use Unreal Engine 5 with C++ as the core programming language. UE5 gives us the performance headroom, physics fidelity, and networking architecture those titles demand. For Marble Party specifically, we build on:',
    bullets: [
      { label: 'Server-authoritative physics', text: 'ensuring every marble behaves consistently for every player and viewer, regardless of their connection' },
      { label: 'Chaos Physics', text: 'for high-fidelity, deterministic marble simulation at scale' },
      { label: 'Custom gameplay systems in C++', text: 'for tight control over performance, netcode, and game state' },
      { label: 'Scalable multiplayer architecture', text: 'designed to handle large simultaneous Twitch audiences without degradation' },
    ],
  },
  {
    title: 'Backend and Live Infrastructure',
    intro:
      'Marble Party is a live-service game built around real-time audience participation. The backend infrastructure is designed to be reliable, scalable, and responsive under streaming conditions:',
    bullets: [
      { label: 'AWS', text: 'as the primary cloud infrastructure for game servers, session management, and data pipelines' },
      { label: 'Twitch EventSub and Chat integration', text: 'for real-time viewer participation directly through Twitch chat commands' },
      { label: 'Custom telemetry systems', text: 'for monitoring session health, physics performance, and player experience in real time' },
    ],
  },
  {
    title: '3D Creation and Asset Production',
    intro:
      'Our art and asset pipelines are built for both quality and performance. Every asset that enters our games is optimized for real-time rendering without sacrificing visual character:',
    bullets: [
      { label: 'Blender', text: 'for 3D modeling, sculpting, and animation' },
      { text: 'Physics-based material workflows' },
      { text: 'LOD and optimization pipelines for real-time performance targets' },
      { text: 'Custom asset tools built to our specific production needs' },
    ],
  },
  {
    title: 'Performance is Not Optional',
    intro:
      'We treat performance as a design constraint, not an afterthought. Every system we build is evaluated against real targets:',
    bullets: [
      { text: 'Frame pacing stability under load' },
      { text: 'Network latency tolerance for live audience sessions' },
      { text: 'Scalability for future content updates without architectural refactoring' },
      { text: 'Cross-platform testing discipline from early in development' },
    ],
  },
  {
    title: 'Always Evolving',
    intro:
      'The technology landscape changes fast. We stay current — not to chase trends, but because better tools mean better experiences. We continuously evaluate new rendering techniques, AI-assisted development workflows, and gameplay systems that can push our projects further than what existing games have attempted.',
  },
];

export const TECHNOLOGY_PROJECTS: ProjectCard[] = [
  {
    title: 'FlameCore Engine',
    description:
      'The in-house browser 3D engine powering this site and games such as One More Second: actor/component scenes, a visual editor, and an export pipeline for static hosts.',
    techStack: ['TypeScript', 'FlameCore', 'Three.js', 'Next.js'],
  },
  {
    title: 'Ember Telemetry Toolkit',
    description:
      'A lightweight metrics package for tracking frame pacing, interaction funnels, and route-transition resilience across live sessions.',
    techStack: ['TypeScript', 'Web Vitals', 'Custom Analytics'],
  },
];

// ─── About Us / Studio ────────────────────────────────────────────────────────

export const STUDIO_TAGLINE = 'We build worlds that feel quiet before they burn.';

export const STUDIO_INTRO =
  'Everburn Interactive is an independent game and technology studio building original interactive experiences from the ground up. We are a DPIIT-recognized startup based in Gujarat, India, founded in 2026 with a long-term focus on original IP, live-audience game design, and systems that do not already exist.';

export const STUDIO_MISSION =
  'Our work begins where existing games end. We look for the experiences that players have not had yet — the mechanics that feel obvious in hindsight but have never been built — and we build them with the craft and patience they deserve.';

export const STUDIO_DOMAINS: string[] = [
  'Twitch-integrated live audience gaming',
  'Physics-driven multiplayer experiences',
  'Original long-term IP development',
  'AI-powered creative and development tools',
  'Immersive interactive world design',
];

export const STUDIO_PHILOSOPHY_INTRO =
  'At Everburn Interactive, we believe the best games are not iterations — they are inventions. Every project is built around four principles that we refuse to compromise on:';

export const STUDIO_PRINCIPLES: PhilosophyPrinciple[] = [
  {
    title: 'Uniqueness in All Aspects',
    description:
      'We do not build what already exists. Before any project moves forward, we ask one question: has anyone made something that feels exactly like this? If the answer is yes, we go deeper. Originality is not a goal we aim for — it is a standard we hold from day one.',
  },
  {
    title: 'Player Agency',
    description:
      'Players and audiences should feel that their presence changes the experience. Whether it is a viewer joining a race through Twitch chat or a player making a split-second decision, our systems are built to react, respond, and reward real participation.',
  },
  {
    title: 'Long-Term Worldbuilding',
    description:
      'Every project at Everburn is designed as a long-term world, not a disposable release. Stories, mechanics, and universes are built with room to grow — because we are building a catalog of original IPs, not a portfolio of one-off games.',
  },
  {
    title: 'Technological Integrity',
    description:
      'Technology decisions are made in service of the experience, never for convenience. We use the tools that the project demands — even when that means going deeper into C++, building custom systems, or rebuilding something from scratch to get it right.',
  },
];

export const STUDIO_VISION_INTRO = 'Everburn Interactive is building toward a future where:';

export const STUDIO_VISION_BULLETS: string[] = [
  'Live audiences are full participants in games, not passive spectators',
  'Original IPs with genuine mechanical identity stand alongside the industry\'s best',
  'AI and interactive technology expand what games are capable of being',
  'A studio built in India earns its place among the world\'s leading game developers',
];

export const STUDIO_VISION_CLOSE =
  'Our long-term goal is to build games and tools that are genuinely unlike anything else — because the experiences worth making are the ones that do not exist yet.';

export const STUDIO_STORY: string[] = [
  'Everburn Interactive LLP was incorporated in February 2026 in Ahmedabad, Gujarat, and received DPIIT recognition as a startup in the Toys and Games sector the same month. We are early-stage and intentional about it.',
  'We started with a specific feeling we wanted to create: a game where a Twitch audience is not watching someone play — they are the players. That idea became Marble Party, and it remains the clearest example of what Everburn builds toward: experiences that have not been done before.',
  'We move deliberately. We build cleanly. We ship when the work is ready, not when the calendar says so.',
];

export const STUDIO_VISION =
  'Everburn is building a catalog of original worlds connected by craft discipline, systemic depth, and an uncompromising commitment to originality.';

export const STUDIO_CURRENT_PROJECTS: Array<{ label: string; href: string }> = [
  { label: 'Marble Party', href: '/games' },
  { label: 'Technology', href: '/technology' },
];

// ─── Contact Us ───────────────────────────────────────────────────────────────

export const CONTACT_INTRO =
  'We are an early-stage independent studio and we are deliberate about who we build with. If our work, our vision, or our technology interests you — we want to hear from you.';

export const CONTACT_AUDIENCES: string[] = [
  'Publishers and platform partners',
  'Streamers and content creators',
  'Developers and technical collaborators',
  'Press and media',
  'Players and community members',
];

export const CONTACT_CONTENT = {
  company: 'Everburn Interactive LLP',
  registration: 'LLPIN: ACV-2902 | DPIIT Recognized Startup',
  location: 'Ahmedabad, Gujarat, India',
  email: 'contact@everburninteractive.com',
  partnerships: 'contact@everburninteractive.com',
  website: 'https://everburninteractive.com',
  social: [
    { label: 'YouTube — @everburninteractive', href: 'https://www.youtube.com/@everburninteractive' },
    { label: 'X — @everburn_games', href: 'https://x.com/everburn_games' },
    { label: 'Twitch — @everburninteractive', href: 'https://www.twitch.tv/everburninteractive' },
  ],
};

export const CONTACT_FOLLOW_NOTE =
  'Marble Party is in active development. Development updates, behind-the-scenes content, and community announcements will be shared across our channels as the project progresses. Follow along and be part of what we are building.';
