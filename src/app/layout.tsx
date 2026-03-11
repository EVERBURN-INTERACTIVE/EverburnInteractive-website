import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import '@/styles/globals.css';
import { CampsiteScene } from '@/components/scene/CampsiteScene';

export const metadata: Metadata = {
  metadataBase: new URL('https://everburninteractive.com'),
  title: 'Everburn Interactive',
  description: 'Everburn Interactive - an indie game studio forged in fire.',
  openGraph: {
    title: 'Everburn Interactive',
    description: 'Indie game studio. Forged in fire.',
    url: 'https://everburninteractive.com',
    siteName: 'Everburn Interactive',
    images: [{ url: '/og-image.svg', width: 1200, height: 630 }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Everburn Interactive',
    description: 'Indie game studio. Forged in fire.',
    images: ['/og-image.png'],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <CampsiteScene />
        <nav aria-label="Main navigation" className="sr-only focus-within:not-sr-only">
          <a href="/games" className="skip-link">
            Games
          </a>
          <a href="/technology" className="skip-link">
            Technology
          </a>
          <a href="/studio" className="skip-link">
            Studio
          </a>
          <a href="/contact" className="skip-link">
            Contact
          </a>
        </nav>
        <div className="app-content">{children}</div>
      </body>
    </html>
  );
}