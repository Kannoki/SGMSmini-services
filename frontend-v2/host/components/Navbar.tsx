import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

type NavItem = {
  href: string;
  label: string;
};

const navItems: NavItem[] = [
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/mail', label: 'Mail Manager' },
];

export function Navbar(): ReactNode {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/portfolio" className="flex items-center gap-2">
          <div className="gradient-border">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-950">
              <span className="bg-gradient-to-tr from-indigo-400 via-sky-400 to-teal-300 bg-clip-text text-lg font-semibold text-transparent">
                M
              </span>
            </div>
          </div>
          <span className="hidden text-sm font-medium text-slate-200 sm:inline">Micro Frontend Demo</span>
        </Link>

        <nav className="flex items-center gap-1 rounded-full border border-slate-800/80 bg-slate-900/60 px-1 py-1 text-xs sm:text-sm">
          {navItems.map((item) => {
            const isActive = pathname?.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={[
                  'rounded-full px-3 py-1.5 transition-colors',
                  isActive
                    ? 'bg-slate-100 text-slate-950 shadow-sm'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-slate-50',
                ].join(' ')}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}

