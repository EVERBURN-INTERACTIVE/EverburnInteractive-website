import type { Metadata } from 'next';

import { BuildLanding } from '@/components/build/BuildLanding';

export const metadata: Metadata = {
  title: 'Start a website | Everburn Interactive',
  description:
    'A few short questions about the website you need. Everburn Interactive will use them to plan your project.',
  openGraph: {
    title: 'Start a website | Everburn Interactive',
    description: 'Tell us about your website in a few short questions.',
    url: 'https://everburninteractive.com/build/',
  },
};

export default function BuildPage() {
  return <BuildLanding />;
}
