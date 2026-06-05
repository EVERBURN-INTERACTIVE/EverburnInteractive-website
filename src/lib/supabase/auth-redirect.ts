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
