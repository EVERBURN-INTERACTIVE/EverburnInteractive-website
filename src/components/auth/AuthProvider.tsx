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

import {
  getSupabaseBrowserClient,
  isSupabaseConfigured,
} from '@/lib/supabase/client';
import type { Profile } from '@/lib/supabase/types';

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  isConfigured: boolean;
  isLoading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function getDisplayName(user: User) {
  const metadata = user.user_metadata;
  const name = metadata.full_name ?? metadata.name ?? metadata.user_name;

  if (typeof name === 'string' && name.trim().length > 0) {
    return name.trim();
  }

  return user.email?.split('@')[0] ?? 'Everburn Player';
}

function getAvatarUrl(user: User) {
  const avatar = user.user_metadata.avatar_url ?? user.user_metadata.picture;
  return typeof avatar === 'string' ? avatar : null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
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

      const { data, error } = await supabase
        .from('profiles')
        .upsert(
          {
            user_id: activeUser.id,
            display_name: getDisplayName(activeUser),
            avatar_url: getAvatarUrl(activeUser),
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

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/`,
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

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      session,
      profile,
      isConfigured: isSupabaseConfigured,
      isLoading,
      signInWithGoogle,
      signOut,
      refreshProfile,
    }),
    [user, session, profile, isLoading, signInWithGoogle, signOut, refreshProfile],
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
