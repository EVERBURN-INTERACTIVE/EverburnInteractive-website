'use client';

import { useAuth } from '@/components/auth/AuthProvider';

import { SharedInternalLayout } from './SharedInternalLayout';

export function ProfilePage() {
  const { user, profile, isConfigured, isLoading, signInWithGoogle } = useAuth();

  return (
    <SharedInternalLayout title="PROFILE">
      <section className="notice-board account-page-panel">
        {!isConfigured ? (
          <>
            <h2>Auth Setup Needed</h2>
            <p>Add the Supabase public project URL and publishable key to enable login.</p>
          </>
        ) : isLoading ? (
          <>
            <h2>Loading Account</h2>
            <p>Checking your current session.</p>
          </>
        ) : user ? (
          <>
            <h2>Player Identity</h2>
            <dl className="account-detail-list">
              <div>
                <dt>Display name</dt>
                <dd>{profile?.display_name ?? user.email?.split('@')[0] ?? 'Everburn Player'}</dd>
              </div>
              <div>
                <dt>Email</dt>
                <dd>{user.email}</dd>
              </div>
            </dl>
          </>
        ) : (
          <>
            <h2>Sign In Required</h2>
            <p>Use Google sign-in to create your Everburn profile.</p>
            <button
              className="account-primary-action"
              type="button"
              onClick={() => {
                void signInWithGoogle();
              }}
            >
              Sign in with Google
            </button>
          </>
        )}
      </section>
    </SharedInternalLayout>
  );
}
