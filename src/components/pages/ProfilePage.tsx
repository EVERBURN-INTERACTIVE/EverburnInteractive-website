'use client';

import { useEffect, useRef, useState } from 'react';

import { useAuth } from '@/components/auth/AuthProvider';
import {
  createProfilePhotoUrl,
  removeProfilePhoto,
  uploadProfilePhoto,
  validateProfilePhoto,
} from '@/lib/profilePhoto';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';

import { SharedInternalLayout } from './SharedInternalLayout';

export function ProfilePage() {
  const { user, profile, isConfigured, isLoading, signInWithGoogle, refreshProfile } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [photoBusy, setPhotoBusy] = useState(false);
  const [photoMessage, setPhotoMessage] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const customPhotoPath = profile?.custom_avatar_path ?? null;
  const visiblePhotoUrl = customPhotoPath ? photoUrl : null;

  useEffect(() => {
    let cancelled = false;
    if (!customPhotoPath) {
      return;
    }

    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      return;
    }

    void createProfilePhotoUrl(supabase, customPhotoPath).then((url) => {
      if (!cancelled) {
        setPhotoUrl(url);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [customPhotoPath]);

  const handlePhotoSelected = async (file: File | undefined) => {
    if (!file || !user) {
      return;
    }

    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setPhotoError('Photo storage is not configured.');
      return;
    }

    setPhotoBusy(true);
    setPhotoError(null);
    setPhotoMessage(null);

    try {
      const validationError = await validateProfilePhoto(file);
      if (validationError) {
        setPhotoError(validationError);
        return;
      }

      await uploadProfilePhoto(supabase, user.id, file);
      await refreshProfile();
      setPhotoMessage('Profile photo updated. It stays on this page for now.');
    } catch (error) {
      setPhotoError(error instanceof Error ? error.message : 'The photo could not be saved.');
    } finally {
      setPhotoBusy(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemovePhoto = async () => {
    if (!user) {
      return;
    }

    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setPhotoError('Photo storage is not configured.');
      return;
    }

    setPhotoBusy(true);
    setPhotoError(null);
    setPhotoMessage(null);

    try {
      await removeProfilePhoto(supabase, user.id, profile?.custom_avatar_path ?? null);
      await refreshProfile();
      setPhotoUrl(null);
      setPhotoMessage('Profile photo removed.');
    } catch (error) {
      setPhotoError(error instanceof Error ? error.message : 'The photo could not be removed.');
    } finally {
      setPhotoBusy(false);
    }
  };

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
              <div className="profile-photo-block">
                <dt>Profile photo</dt>
                <dd>
                  {visiblePhotoUrl ? (
                    // Signed URLs are owner-only and expire; a plain img avoids Next image-host config.
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      className="profile-photo-preview"
                      src={visiblePhotoUrl}
                      alt="Your profile photo"
                    />
                  ) : (
                    <div className="profile-photo-preview profile-photo-preview--empty" aria-hidden="true">
                      No photo
                    </div>
                  )}
                  <p className="profile-photo-hint">
                    PNG or JPG, at most 1000x1000 pixels and 1MB. This photo is only shown to you here.
                  </p>
                  <div className="profile-photo-actions">
                    <input
                      ref={fileInputRef}
                      className="sr-only"
                      type="file"
                      accept="image/png,image/jpeg,.png,.jpg,.jpeg"
                      disabled={photoBusy}
                      onChange={(event) => {
                        void handlePhotoSelected(event.target.files?.[0]);
                      }}
                    />
                    <button
                      className="account-primary-action"
                      type="button"
                      disabled={photoBusy}
                      onClick={() => {
                        fileInputRef.current?.click();
                      }}
                    >
                      {profile?.custom_avatar_path ? 'Replace photo' : 'Upload photo'}
                    </button>
                    {profile?.custom_avatar_path ? (
                      <button
                        className="account-button"
                        type="button"
                        disabled={photoBusy}
                        onClick={() => {
                          void handleRemovePhoto();
                        }}
                      >
                        Remove photo
                      </button>
                    ) : null}
                  </div>
                  {photoError ? (
                    <p className="profile-photo-status is-error" role="alert">
                      {photoError}
                    </p>
                  ) : null}
                  {photoMessage ? (
                    <p className="profile-photo-status" role="status">
                      {photoMessage}
                    </p>
                  ) : null}
                </dd>
              </div>
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
