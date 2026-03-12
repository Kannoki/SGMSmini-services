import type { ReactNode } from 'react';

type DashboardPanelProps = {
  children: ReactNode;
  className?: string;
};

export function DashboardPanel({ children, className }: DashboardPanelProps) {
  return (
    <section
      className={[
        'rounded-xl border border-indigo-500/20 bg-[#061847] p-5 shadow-[0_16px_32px_rgba(2,6,23,0.45)]',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </section>
  );
}

