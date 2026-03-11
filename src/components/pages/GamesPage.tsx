import Image from 'next/image';

import { GAMES, FUTURE_PROJECTS_NOTE } from '@/lib/content';
import MarblePartyImg from '@/assets/MarbleParty.png';

import { SharedInternalLayout } from './SharedInternalLayout';

export function GamesPage() {
  return (
    <SharedInternalLayout title="OUR PROJECTS">
      {GAMES.map((game) => (
        <article key={game.title} className="game-card">
          {game.subtitle ? <p className="game-status">{game.subtitle}</p> : null}
          <h2>{game.title}</h2>
          <p>{game.description}</p>
          <Image
            src={MarblePartyImg}
            alt="Marble Party screenshot"
            className="game-screenshot"
            placeholder="blur"
          />
          <div className="tag-row">
            {game.tags.map((tag) => (
              <span key={tag} className="tag-pill">
                {tag}
              </span>
            ))}
          </div>
        </article>
      ))}
      <section className="future-projects">
        <h2>Future Projects</h2>
        <p>{FUTURE_PROJECTS_NOTE}</p>
      </section>
    </SharedInternalLayout>
  );
}