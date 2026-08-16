'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

import { rememberProfileReturnPath } from '@/lib/profileReturnPath';

/** Keep the last non-profile page so Profile can close back to it. */
export function ProfileReturnPathTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const search = searchParams.toString();
    rememberProfileReturnPath(search ? `${pathname}?${search}` : pathname);
  }, [pathname, searchParams]);

  return null;
}
