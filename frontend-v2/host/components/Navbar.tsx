'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { clearTokens } from '../lib/auth';

type NavItem = {
  id: string;
  href: string;
  label: string;
  icon: string;
  children?: NavItem[];
};

function MaterialIcon({ name, className }: { name: string; className?: string }) {
  return <span className={['material-symbols-rounded', className].filter(Boolean).join(' ')}>{name}</span>;
}

const fixedTopItem: NavItem = {
  id: 'dashboard',
  href: '/dashboard',
  label: 'User Dashboard Page',
  icon: 'dashboard',
};

const fixedBottomItem: NavItem = {
  id: 'setting',
  href: '/setting',
  label: 'Setting',
  icon: 'settings',
  children: [{ id: 'setting-general', href: '/setting1', label: 'General', icon: 'tune' },{ id: 'setting-general2', href: '/setting2', label: 'General', icon: 'tune' },{ id: 'setting-general3', href: '/setting3', label: 'General', icon: 'tune' }],
};

const remoteItems: NavItem[] = [
  { id: 'portfolio', href: '/portfolio', label: 'Portfolio', icon: 'work' },
  { id: 'mail', href: '/mail', label: 'Mail Manager', icon: 'mail' },
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
  const [expandedIds, setExpandedIds] = useState<Set<string>>(() => new Set());

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

  useEffect(() => {
    if (!pathname) {
      return;
    }

    // Auto-open only when route changes to an item with children.
    // Preserve manual expand/collapse state for existing items.
    setExpandedIds((prev) => {
      const next = new Set(prev);
      for (const item of navItems) {
        if (!item.children?.length) {
          continue;
        }
        const childActive = item.children.some((child) => pathname.startsWith(child.href));
        if (pathname.startsWith(item.href) || childActive) {
          next.add(item.id);
        }
      }
      return next;
    });
  }, [pathname]);

  const handleLogout = () => {
    clearTokens();
    router.replace('/login');
  };

  const toggleExpanded = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
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
          const isBottomItem = item.id === fixedBottomItem.id;
          const isExpanded = expandedIds.has(item.id);
          const hasChildren = Boolean(item.children?.length);
          const isActive =
            pathname?.startsWith(item.href) || item.children?.some((child) => pathname?.startsWith(child.href));
          return (
            <div key={item.id} className={isBottomItem ? 'mt-auto' : ''}>
              <div
                className={[
                  'flex items-center justify-between rounded px-2 py-2 transition-colors',
                  isActive
                    ? 'bg-[rgba(87,93,255,0.4)] text-white'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-slate-50',
                ].join(' ')}
              >
                <div className="flex min-w-0 flex-1 items-center gap-2">
                  <MaterialIcon name={item.icon} className={['text-[24px]', isActive ? 'text-white' : 'text-slate-300'].join(' ')} />
                  <Link href={item.href} className="min-w-0 flex-1 truncate text-sm font-medium leading-[21px]">
                    {item.label}
                  </Link>
                </div>
                {hasChildren ? (
                  <button
                    type="button"
                    onClick={() => toggleExpanded(item.id)}
                    aria-expanded={isExpanded}
                    aria-label={isExpanded ? `Collapse ${item.label}` : `Expand ${item.label}`}
                    className="rounded-md p-1 hover:bg-slate-800/40"
                  >
                    <MaterialIcon
                      name="expand_more"
                      className={[
                        'transition-transform',
                        isExpanded ? 'rotate-180' : '',
                        isActive ? 'text-white' : 'text-slate-300',
                      ]
                        .filter(Boolean)
                        .join(' ')}
                    />
                  </button>
                ) : null}
              </div>

              {hasChildren && isExpanded ? (
                <div className="mt-1 space-y-1 pl-6">
                  {item.children!.map((child) => {
                    const childActive = pathname?.startsWith(child.href);
                    return (
                      <Link
                        key={child.id}
                        href={child.href}
                        className={[
                          'flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors',
                          childActive
                            ? 'bg-slate-100 text-slate-950 shadow-sm'
                            : 'text-slate-300 hover:bg-slate-800/80 hover:text-slate-50',
                        ].join(' ')}
                      >
                        <MaterialIcon name={child.icon} className={childActive ? 'text-slate-950' : 'text-slate-300'} />
                        <span className="min-w-0 flex-1 truncate">{child.label}</span>
                      </Link>
                    );
                  })}
                </div>
              ) : null}
            </div>
          );
        })}
      </nav>

      <div className="mt-4 rounded-lg border border-slate-800/70 bg-slate-950/40 p-3">
        <div className="mb-2 text-xs text-slate-400">{visibleRemoteItems.length} module available!</div>
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

