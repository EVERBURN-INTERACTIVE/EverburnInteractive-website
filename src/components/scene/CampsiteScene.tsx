'use client';

import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';

import { SceneErrorBoundary } from '@/components/ui/SceneErrorBoundary';

const SceneCanvas = dynamic(() => import('./SceneCanvas').then((m) => m.SceneCanvas), {
  ssr: false,
});

export function CampsiteScene() {
  const pathname = usePathname();
  const isCampRoute = pathname === '/';

  return (
    <SceneErrorBoundary>
      <SceneCanvas isActive={isCampRoute} />
    </SceneErrorBoundary>
  );
}