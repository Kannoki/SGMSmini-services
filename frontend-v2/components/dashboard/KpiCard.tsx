import { DashboardPanel } from './DashboardPanel';
import { MaterialSymbol } from './MaterialSymbol';

type KpiCardProps = {
  title: string;
  value: string;
  badgeLabel: string;
  badgeClass: string;
  icon: string;
};

export function KpiCard({ title, value, badgeLabel, badgeClass, icon }: KpiCardProps) {
  return (
    <DashboardPanel className="p-4">
      <div className="flex items-center justify-between text-xs text-slate-300">
        <span className="flex items-center gap-1.5">
          <MaterialSymbol name={icon} className="text-base text-slate-300" />
          {title}
        </span>
        <MaterialSymbol name="more_horiz" className="text-base text-slate-300" />
      </div>
      <div className="mt-2 flex items-end gap-2">
        <p className="text-[30px] font-semibold leading-none text-white">{value}</p>
        <span className={['rounded px-1.5 py-0.5 text-[10px] font-medium', badgeClass].join(' ')}>{badgeLabel}</span>
      </div>
    </DashboardPanel>
  );
}

