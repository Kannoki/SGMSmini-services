'use client';

import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { AuthGuard } from './AuthGuard';
import { Navbar } from './Navbar';

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname?.startsWith('/login');

  if (isLoginPage) {
    return (
      <AuthGuard>
        <main className="mx-auto flex min-h-screen w-full max-w-md items-center px-4 py-12">{children}</main>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <div className="relative flex min-h-screen">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.12)_0,_transparent_55%),radial-gradient(circle_at_bottom,_rgba(129,140,248,0.18)_0,_transparent_55%)]" />
        <Navbar />
        <main className="h-screen flex-1 overflow-y-auto px-6 py-6">{children}</main>
      </div>
    </AuthGuard>
  );
}
