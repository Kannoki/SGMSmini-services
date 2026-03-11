'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState, type ReactNode } from 'react';
import { isAuthenticated, refreshTokens } from '../lib/auth';

export function AuthGuard({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;
    const verify = async () => {
      if (pathname?.startsWith('/login')) {
        if (active) {
          setReady(true);
        }
        return;
      }

      if (isAuthenticated()) {
        if (active) {
          setReady(true);
        }
        return;
      }

      try {
        await refreshTokens();
        if (active) {
          setReady(true);
        }
      } catch {
        router.replace('/login');
      }
    };

    verify();
    return () => {
      active = false;
    };
  }, [pathname, router]);

  if (!ready) {
    return <div className="p-6 text-sm text-slate-300">Loading...</div>;
  }

  return <>{children}</>;
}
