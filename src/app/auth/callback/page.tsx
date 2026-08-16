'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { consumeAuthNextPath } from '@/lib/supabase/auth-redirect';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';

export default function AuthCallbackPage() {
  const router = useRouter();
  const [message, setMessage] = useState('Signing you in...');

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();

    if (!supabase) {
      setMessage('Sign-in is not configured for this site.');
      return;
    }

    let isActive = true;
    const nextPath = consumeAuthNextPath();

    const goNext = () => {
      if (!isActive) {
        return;
      }

      router.replace(nextPath);
    };

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!isActive) {
        return;
      }

      if ((event === 'SIGNED_IN' || event === 'INITIAL_SESSION') && session) {
        goNext();
      }
    });

    void supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (!isActive) {
        return;
      }

      if (error) {
        setMessage('Sign-in failed. Return home and try again.');
        return;
      }

      if (session) {
        goNext();
      }
    });

    const timeout = window.setTimeout(() => {
      if (isActive) {
        setMessage('Sign-in is taking longer than expected. Return home and try again.');
      }
    }, 15000);

    return () => {
      isActive = false;
      subscription.unsubscribe();
      window.clearTimeout(timeout);
    };
  }, [router]);

  return (
    <main className="auth-callback-page">
      <p>{message}</p>
    </main>
  );
}
