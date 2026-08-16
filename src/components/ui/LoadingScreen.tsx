'use client';

import { useProgress } from '@react-three/drei';
import Image from 'next/image';

import EverFlameWithName from '@/assets/EverFlame-with-Name.png';

interface LoadingScreenProps {
  loaded: boolean;
  /** When set, skips drei useProgress (safe before the R3F host exists). */
  progress?: number;
}

function LoadingScreenChrome({ loaded, progress }: { loaded: boolean; progress: number }) {
  return (
    <div className={`loading-screen ${loaded ? 'is-loaded' : ''}`} aria-hidden={loaded}>
      <Image
        src={EverFlameWithName}
        alt="EverFlame logo"
        className="loading-logo"
        priority
      />
      <div
        className="loading-bar-wrap"
        aria-label="Loading progress"
        role="progressbar"
        aria-valuenow={Math.round(progress)}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div className="loading-bar-fill" style={{ transform: `scaleX(${Math.min(progress, 100) / 100})` }} />
      </div>
    </div>
  );
}

export function LoadingScreen({ loaded, progress: progressOverride }: LoadingScreenProps) {
  if (progressOverride !== undefined) {
    return <LoadingScreenChrome loaded={loaded} progress={progressOverride} />;
  }

  return <LoadingScreenWithProgress loaded={loaded} />;
}

function LoadingScreenWithProgress({ loaded }: { loaded: boolean }) {
  const { progress } = useProgress();
  return <LoadingScreenChrome loaded={loaded} progress={progress} />;
}

/** Early shell loader shown while SceneCanvas is still downloading. */
export function BootLoadingScreen() {
  return <LoadingScreenChrome loaded={false} progress={12} />;
}
