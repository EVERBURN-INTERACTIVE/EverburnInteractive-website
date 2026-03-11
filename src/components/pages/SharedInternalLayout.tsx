import Link from 'next/link';
import type { ReactNode } from 'react';

interface SharedInternalLayoutProps {
  title: string;
  children: ReactNode;
}

export function SharedInternalLayout({ title, children }: SharedInternalLayoutProps) {
  return (
    <main className="internal-page">
      <header className="internal-header">
        <Link href="/" className="back-link">
          ← Return to Camp
        </Link>
        <div className="internal-logo">EVERBURN</div>
      </header>
      <section className="internal-content">
        <h1>{title}</h1>
        {children}
      </section>
    </main>
  );
}