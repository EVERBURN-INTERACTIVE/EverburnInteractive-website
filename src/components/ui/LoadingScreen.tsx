'use client';

import { useProgress } from '@react-three/drei';
import Image from 'next/image';

import EverFlameWithName from '@/assets/EverFlame-with-Name.png';

interface LoadingScreenProps {
  loaded: boolean;
}

export function LoadingScreen({ loaded }: LoadingScreenProps) {
  const { progress } = useProgress();

  return (
    <div className={`loading-screen ${loaded ? 'is-loaded' : ''}`}>
      <Image
        src={EverFlameWithName}
        alt="EverFlame logo"
        className="loading-logo"
        priority
      />
      <div className="loading-bar-wrap" aria-label="Loading progress" role="progressbar" aria-valuenow={Math.round(progress)} aria-valuemin={0} aria-valuemax={100}>
        <div className="loading-bar-fill" style={{ transform: `scaleX(${Math.min(progress, 100) / 100})` }} />
      </div>
    </div>
  );
}