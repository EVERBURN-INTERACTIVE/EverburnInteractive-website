import { useSyncExternalStore } from 'react';

import { normalizeScenePathname } from '@/lib/sceneRoutes';
import { isSafeInternalPath } from '@/lib/supabase/auth-redirect';

const PROFILE_RETURN_STORAGE_KEY = 'everburn-profile-return';
const PROFILE_RETURN_EVENT = 'everburn-profile-return';

function isProfilePath(path: string): boolean {
  return normalizeScenePathname(path.split('?')[0] ?? path) === '/profile';
}

function isAuthPath(path: string): boolean {
  return normalizeScenePathname(path.split('?')[0] ?? path).startsWith('/auth/');
}

export function rememberProfileReturnPath(path: string): void {
  if (typeof window === 'undefined') {
    return;
  }

  if (!isSafeInternalPath(path) || isProfilePath(path) || isAuthPath(path)) {
    return;
  }

  sessionStorage.setItem(PROFILE_RETURN_STORAGE_KEY, path);
  window.dispatchEvent(new Event(PROFILE_RETURN_EVENT));
}

export function readProfileReturnPath(): string {
  if (typeof window === 'undefined') {
    return '/';
  }

  const stored = sessionStorage.getItem(PROFILE_RETURN_STORAGE_KEY);
  if (stored && isSafeInternalPath(stored) && !isProfilePath(stored) && !isAuthPath(stored)) {
    return stored;
  }

  return '/';
}

function subscribeProfileReturnPath(onStoreChange: () => void): () => void {
  window.addEventListener(PROFILE_RETURN_EVENT, onStoreChange);
  return () => window.removeEventListener(PROFILE_RETURN_EVENT, onStoreChange);
}

export function useProfileReturnPath(): string {
  return useSyncExternalStore(subscribeProfileReturnPath, readProfileReturnPath, () => '/');
}

export function getProfileReturnLabel(path: string): string {
  const pathname = path.split('?')[0] ?? path;
  return normalizeScenePathname(pathname) === '/' ? '← Return to Camp' : '← Back';
}
