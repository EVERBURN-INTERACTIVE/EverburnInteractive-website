import { TECHNOLOGY_AREAS } from '@/lib/content';

import { SharedInternalLayout } from './SharedInternalLayout';

export function TechnologyPage() {
  return (
    <SharedInternalLayout title="TECHNOLOGY">
      {TECHNOLOGY_AREAS.map((area) => (
        <article key={area.title} className="tech-card">
          <h2>{area.title}</h2>
          <p>{area.intro}</p>
          {area.bullets && (
            <ul className="tech-bullet-list">
              {area.bullets.map((bullet, i) => (
                <li key={i}>
                  {bullet.label
                    ? <><strong>{bullet.label}</strong>{` ${bullet.text}`}</>
                    : bullet.text}
                </li>
              ))}
            </ul>
          )}
        </article>
      ))}
    </SharedInternalLayout>
  );
}