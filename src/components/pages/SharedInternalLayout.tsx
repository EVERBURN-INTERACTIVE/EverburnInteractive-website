import Link from 'next/link';
import type { ReactNode } from 'react';

interface SharedInternalLayoutProps {
  title: string;
  children: ReactNode;
  backHref?: string;
  backLabel?: string;
}

export function SharedInternalLayout({
  title,
  children,
  backHref = '/',
  backLabel = '← Return to Camp',
}: SharedInternalLayoutProps) {
  return (
    <main className="internal-page">
      <header className="internal-header">
        <Link href={backHref} className="back-link">
          {backLabel}
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