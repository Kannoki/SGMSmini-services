import type { ReactNode } from 'react';

type SectionTitleProps = {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
};

export function SectionTitle({ title, subtitle, actions }: SectionTitleProps) {
  return (
    <header className="flex flex-wrap items-start justify-between gap-3">
      <div>
        <h2 className="text-[32px] font-semibold leading-tight text-white">{title}</h2>
        {subtitle ? <p className="mt-1 text-sm text-slate-300/80">{subtitle}</p> : null}
      </div>
      {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
    </header>
  );
}

