'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { clearTokens } from '../lib/auth';

type NavItem = {
  id: string;
  href: string;
  label: string;
};

const fixedTopItem: NavItem = {
  id: 'dashboard',
  href: '/dashboard',
  label: 'User Dashboard Page',
};

const fixedBottomItem: NavItem = {
  id: 'setting',
  href: '/setting',
  label: 'Setting',
};

const remoteItems: NavItem[] = [
  { id: 'portfolio', href: '/portfolio', label: 'Portfolio' },
  { id: 'mail', href: '/mail', label: 'Mail Manager' },
];

type HealthResponse = {
  apps: Array<{
    id: string;
    available: boolean;
  }>;
};

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [availableRemotes, setAvailableRemotes] = useState<string[]>([]);

  useEffect(() => {
    let alive = true;
    const fetchStatus = async () => {
      try {
        const res = await fetch('/api/health', { cache: 'no-store' });
        if (!res.ok) {
          return;
        }
        const payload = (await res.json()) as HealthResponse;
        if (!alive) {
          return;
        }
        setAvailableRemotes(payload.apps.filter((item) => item.available).map((item) => item.id));
      } catch {
        if (alive) {
          setAvailableRemotes([]);
        }
      }
    };

    fetchStatus();
    const id = setInterval(fetchStatus, 15000);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, []);

  const visibleRemoteItems = useMemo(
    () => remoteItems.filter((item) => availableRemotes.includes(item.id)),
    [availableRemotes],
  );

  const navItems = [fixedTopItem, ...visibleRemoteItems, fixedBottomItem];

  const handleLogout = () => {
    clearTokens();
    router.replace('/login');
  };

  return (
    <aside className="flex h-screen w-72 flex-col border-r border-slate-800/80 bg-slate-900/90 px-4 py-6">
      <Link href="/dashboard" className="mb-8 flex items-center gap-2 px-2">
        <div className="gradient-border">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-950">
            <span className="bg-gradient-to-tr from-indigo-400 via-sky-400 to-teal-300 bg-clip-text text-lg font-semibold text-transparent">
              M
            </span>
          </div>
        </div>
        <span className="text-sm font-medium text-slate-200">Micro Frontend Demo</span>
      </Link>

      <nav className="flex flex-1 flex-col gap-1 rounded-lg border border-slate-800/70 bg-slate-950/50 p-2 text-sm">
        {navItems.map((item) => {
          const isActive = pathname?.startsWith(item.href);
          const isBottomItem = item.id === fixedBottomItem.id;
          return (
            <Link
              key={item.id}
              href={item.href}
              className={[
                'rounded-md px-3 py-2 transition-colors',
                isActive
                  ? 'bg-slate-100 text-slate-950 shadow-sm'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-slate-50',
                isBottomItem ? 'mt-auto' : '',
              ].join(' ')}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-4 rounded-lg border border-slate-800/70 bg-slate-950/40 p-3">
        <div className="mb-2 text-xs text-slate-400">{visibleRemoteItems.length} remote app(s) available</div>
        <button
          type="button"
          onClick={handleLogout}
          className="w-full rounded-md border border-slate-700 px-3 py-2 text-sm text-slate-200 hover:bg-slate-800"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}

