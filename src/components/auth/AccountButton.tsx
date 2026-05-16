'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

import { useAuth } from './AuthProvider';

function GoogleMark() {
  return (
    <svg aria-hidden="true" className="google-mark" viewBox="0 0 24 24">
      <path
        d="M21.6 12.23c0-.78-.07-1.53-.2-2.23H12v4.26h5.38a4.6 4.6 0 0 1-2 3.02v2.5h3.24c1.9-1.75 2.98-4.33 2.98-7.55Z"
        fill="#4285F4"
      />
      <path
        d="M12 22c2.7 0 4.98-.9 6.62-2.43l-3.24-2.5c-.9.6-2.05.96-3.38.96-2.6 0-4.8-1.76-5.59-4.12H3.07v2.58A10 10 0 0 0 12 22Z"
        fill="#34A853"
      />
      <path
        d="M6.41 13.91a6 6 0 0 1 0-3.82V7.51H3.07a10 10 0 0 0 0 8.98l3.34-2.58Z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.98c1.47 0 2.8.51 3.84 1.5l2.86-2.86A9.62 9.62 0 0 0 12 2a10 10 0 0 0-8.93 5.51l3.34 2.58C7.2 7.74 9.4 5.98 12 5.98Z"
        fill="#EA4335"
      />
    </svg>
  );
}

export function AccountButton() {
  const { user, profile, isConfigured, isLoading, signInWithGoogle, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [authMessage, setAuthMessage] = useState('');
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onPointerDown(event: PointerEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  const displayName = profile?.display_name ?? user?.email?.split('@')[0] ?? 'Player';
  const avatarUrl = profile?.avatar_url ?? user?.user_metadata.avatar_url ?? user?.user_metadata.picture;

  if (isLoading) {
    return (
      <div className="account-control" aria-live="polite">
        <button className="account-button" disabled type="button">
          Signing in
        </button>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="account-control">
        <button
          className="account-button google-auth-button"
          title={isConfigured ? 'Sign in with Google' : 'Add Supabase environment variables first'}
          type="button"
          onClick={() => {
            if (isConfigured) {
              setAuthMessage('');
              void signInWithGoogle().catch((error: unknown) => {
                setAuthMessage(error instanceof Error ? error.message : 'Google sign-in could not start.');
                setIsOpen(true);
              });
            } else {
              setAuthMessage(
                'Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY in .env.local, then restart npm run dev.',
              );
              setIsOpen((current) => !current);
            }
          }}
        >
          <GoogleMark />
          <span className="google-auth-label">
            {isConfigured ? 'Sign in / Sign up with Google' : 'Set up Google login'}
          </span>
          <span className="google-auth-label-short">{isConfigured ? 'Google' : 'Setup'}</span>
        </button>
        {authMessage && isOpen ? (
          <div className="account-menu account-setup-menu" role="status">
            {authMessage}
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div ref={menuRef} className="account-control">
      <button
        aria-expanded={isOpen}
        aria-haspopup="menu"
        className="account-button account-button-profile"
        type="button"
        onClick={() => setIsOpen((current) => !current)}
      >
        <span
          aria-hidden="true"
          className="account-avatar"
          style={avatarUrl ? { backgroundImage: `url(${avatarUrl})` } : undefined}
        >
          {!avatarUrl ? displayName.charAt(0).toUpperCase() : null}
        </span>
        <span className="account-name">{displayName}</span>
      </button>

      {isOpen ? (
        <div className="account-menu" role="menu">
          <Link className="account-menu-item" href="/profile" role="menuitem" onClick={() => setIsOpen(false)}>
            Profile
          </Link>
          <button
            className="account-menu-item"
            role="menuitem"
            type="button"
            onClick={() => {
              setIsOpen(false);
              void signOut();
            }}
          >
            Sign out
          </button>
        </div>
      ) : null}
    </div>
  );
}
