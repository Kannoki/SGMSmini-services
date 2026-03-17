'use client';

import Link from 'next/link';
import type { SettingTile } from '../../model/setting';

const tiles: SettingTile[] = [
  {
    id: 'cron-expendsion',
    label: 'Clon Manager',
    href: '/setting/cron-expendsion',
    icon: 'schedule',
    className: 'bg-rose-500/15 border-rose-500/30 hover:bg-rose-500/20',
  },
  // {
  //   id: 'letter-manager',
  //   label: 'Mail Manager',
  //   href: '/mail',
  //   icon: 'mail',
  //   className: 'bg-sky-500/15 border-sky-500/30 hover:bg-sky-500/20',
  // },
  // {
  //   id: 'portfolio',
  //   label: 'Portfolio',
  //   href: '/portfolio',
  //   icon: 'work',
  //   className: 'bg-emerald-500/15 border-emerald-500/30 hover:bg-emerald-500/20',
  // },
];

function TileIcon({ name }: { name: string }) {
  return <span className="material-symbols-rounded text-[40px] leading-none text-slate-100">{name}</span>;
}

export default function SettingPage() {
  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Setting</h1>
        <p className="text-sm text-slate-300">Choose an app to configure.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {tiles.map((tile) => (
          <Link
            key={tile.id}
            href={tile.href}
            className={[
              'group relative flex aspect-square flex-col items-center justify-center gap-3 rounded-2xl border p-4 transition-colors',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/70',
              tile.className,
            ].join(' ')}
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-950/40 ring-1 ring-slate-800/70 transition-transform group-hover:-translate-y-0.5">
              <TileIcon name={tile.icon} />
            </div>
            <div className="text-center">
              <div className="text-sm font-semibold text-slate-100">{tile.label}</div>
              <div className="mt-0.5 text-xs text-slate-300">{tile.href}</div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
