import {
  STUDIO_TAGLINE,
  STUDIO_INTRO,
  STUDIO_MISSION,
  STUDIO_DOMAINS,
  STUDIO_PHILOSOPHY_INTRO,
  STUDIO_PRINCIPLES,
  STUDIO_VISION_INTRO,
  STUDIO_VISION_BULLETS,
  STUDIO_VISION_CLOSE,
} from '@/lib/content';

import { SharedInternalLayout } from './SharedInternalLayout';

export function StudioPage() {
  return (
    <SharedInternalLayout title="ABOUT US">
      <p className="studio-tagline">{STUDIO_TAGLINE}</p>

      <h2>Who We Are</h2>
      <p>{STUDIO_INTRO}</p>
      <p>{STUDIO_MISSION}</p>
      <p>Our work spans multiple domains including:</p>
      <ul>
        {STUDIO_DOMAINS.map((domain) => (
          <li key={domain}>{domain}</li>
        ))}
      </ul>

      <h2>Our Philosophy</h2>
      <p>{STUDIO_PHILOSOPHY_INTRO}</p>
      {STUDIO_PRINCIPLES.map((principle) => (
        <div key={principle.title} className="principle-card">
          <h3>{principle.title}</h3>
          <p>{principle.description}</p>
        </div>
      ))}

      <h2>The Vision</h2>
      <p>{STUDIO_VISION_INTRO}</p>
      <ul>
        {STUDIO_VISION_BULLETS.map((bullet) => (
          <li key={bullet}>{bullet}</li>
        ))}
      </ul>
      <p>{STUDIO_VISION_CLOSE}</p>
    </SharedInternalLayout>
  );
}