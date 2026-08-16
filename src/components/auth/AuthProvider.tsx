'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { Session, User } from '@supabase/supabase-js';

import { getAuthCallbackUrl, rememberAuthNextPath } from '@/lib/supabase/auth-redirect';
import { createProfilePhotoUrl } from '@/lib/profilePhoto';
import {
  getSupabaseBrowserClient,
  isSupabaseConfigured,
} from '@/lib/supabase/client';
import type { Profile } from '@/lib/supabase/types';
import { getUserAvatarUrl, getUserDisplayName } from '@/lib/supabase/userDisplayName';

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  profilePhotoUrl: string | null;
  isConfigured: boolean;
  isLoading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [signedProfilePhotoUrl, setSignedProfilePhotoUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(isSupabaseConfigured);

  const supabase = getSupabaseBrowserClient();
  const user = session?.user ?? null;

  const refreshProfile = useCallback(async () => {
    if (!supabase || !user) {
      setProfile(null);
      return;
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (!error) {
      setProfile(data);
    }
  }, [supabase, user]);

  const syncProfile = useCallback(
    async (activeUser: User) => {
      if (!supabase) {
        return;
      }

      // Omit custom_avatar_path so Google avatar sync cannot clear an uploaded photo.
      const { data, error } = await supabase
        .from('profiles')
        .upsert(
          {
            user_id: activeUser.id,
            display_name: getUserDisplayName(activeUser),
            avatar_url: getUserAvatarUrl(activeUser),
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'user_id' },
        )
        .select()
        .single();

      if (!error) {
        setProfile(data);
      }
    },
    [supabase],
  );

  useEffect(() => {
    if (!supabase) {
      return;
    }

    let isMounted = true;

    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (!isMounted) {
          return;
        }

        setSession(data.session);
        setIsLoading(false);

        if (data.session?.user) {
          void syncProfile(data.session.user);
        }
      })
      .catch(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);

      if (nextSession?.user) {
        void syncProfile(nextSession.user);
      } else {
        setProfile(null);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [supabase, syncProfile]);

  const signInWithGoogle = useCallback(async () => {
    if (!supabase) {
      return;
    }

    rememberAuthNextPath();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: getAuthCallbackUrl(),
      },
    });

    if (error) {
      throw error;
    }
  }, [supabase]);

  const signOut = useCallback(async () => {
    if (!supabase) {
      return;
    }

    await supabase.auth.signOut();
  }, [supabase]);

  const customAvatarPath = profile?.custom_avatar_path ?? null;
  const profileUpdatedAt = profile?.updated_at ?? null;
  const profilePhotoUrl = customAvatarPath ? signedProfilePhotoUrl : null;

  useEffect(() => {
    if (!supabase || !customAvatarPath) {
      return;
    }

    let cancelled = false;

    const loadSignedUrl = () => {
      void createProfilePhotoUrl(supabase, customAvatarPath).then((url) => {
        if (!cancelled) {
          setSignedProfilePhotoUrl(url);
        }
      });
    };

    loadSignedUrl();
    const refreshTimer = window.setInterval(loadSignedUrl, 45 * 60 * 1000);

    return () => {
      cancelled = true;
      window.clearInterval(refreshTimer);
    };
  }, [customAvatarPath, profileUpdatedAt, supabase]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      session,
      profile,
      profilePhotoUrl,
      isConfigured: isSupabaseConfigured,
      isLoading,
      signInWithGoogle,
      signOut,
      refreshProfile,
    }),
    [user, session, profile, profilePhotoUrl, isLoading, signInWithGoogle, signOut, refreshProfile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return context;
}
