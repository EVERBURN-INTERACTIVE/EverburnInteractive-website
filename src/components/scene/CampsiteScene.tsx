'use client';

import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';

import { SceneErrorBoundary } from '@/components/ui/SceneErrorBoundary';
import { BootLoadingScreen } from '@/components/ui/LoadingScreen';
import { isSceneCanvasRoute } from '@/lib/sceneRoutes';

const SceneCanvas = dynamic(() => import('./SceneCanvas').then((m) => m.SceneCanvas), {
  ssr: false,
  loading: () => <BootLoadingScreen />,
});

export function CampsiteScene() {
  const pathname = usePathname();
  const isActive = isSceneCanvasRoute(pathname);

  return (
    <SceneErrorBoundary>
      <SceneCanvas isActive={isActive} />
    </SceneErrorBoundary>
  );
}
