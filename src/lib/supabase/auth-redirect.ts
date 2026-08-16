function normalizeSiteUrl(url: string) {
  return url.replace(/\/+$/, '');
}

export function getSiteUrl() {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL;

  if (configuredUrl) {
    return normalizeSiteUrl(configuredUrl);
  }

  if (typeof window !== 'undefined') {
    return window.location.origin;
  }

  return 'http://localhost:3000';
}

export function getAuthCallbackUrl() {
  return `${getSiteUrl()}/auth/callback/`;
}

const AUTH_NEXT_STORAGE_KEY = 'everburn-auth-next';

export function isSafeInternalPath(path: string): boolean {
  return path.startsWith('/') && !path.startsWith('//') && !path.includes('\\');
}

/** Remember the current page so Google OAuth can return here after /auth/callback. */
export function rememberAuthNextPath(path?: string): void {
  if (typeof window === 'undefined') {
    return;
  }

  const nextPath = path ?? `${window.location.pathname}${window.location.search}`;
  if (!isSafeInternalPath(nextPath)) {
    return;
  }

  sessionStorage.setItem(AUTH_NEXT_STORAGE_KEY, nextPath);
}

export function consumeAuthNextPath(): string {
  if (typeof window === 'undefined') {
    return '/';
  }

  const stored = sessionStorage.getItem(AUTH_NEXT_STORAGE_KEY);
  sessionStorage.removeItem(AUTH_NEXT_STORAGE_KEY);

  if (stored && isSafeInternalPath(stored)) {
    return stored;
  }

  return '/';
}
