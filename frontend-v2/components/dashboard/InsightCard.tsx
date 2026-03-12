import { DashboardPanel } from './DashboardPanel';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

type InsightCardProps = {
  title: string;
  value: string;
  badgeLabel: string;
  badgeClass: string;
  footerLabel: string;
  actionLabel: string;
  liveTag?: string;
  chartKind: 'bar' | 'spark';
  color: string;
  labels: string[];
  data: number[];
};

export function InsightCard({
  title,
  value,
  badgeLabel,
  badgeClass,
  footerLabel,
  actionLabel,
  liveTag,
  chartKind,
  color,
  labels,
  data,
}: InsightCardProps) {
  const chartOptions: Highcharts.Options = {
    chart: {
      type: chartKind === 'bar' ? 'column' : 'spline',
      backgroundColor: 'transparent',
      height: 86,
      spacing: [4, 0, 4, 0],
    },
    title: { text: undefined },
    credits: { enabled: false },
    legend: { enabled: false },
    xAxis: {
      categories: labels,
      visible: false,
      lineWidth: 0,
      tickLength: 0,
    },
    yAxis: {
      title: { text: undefined },
      visible: false,
      gridLineWidth: 0,
    },
    tooltip: {
      backgroundColor: '#0b1538',
      borderColor: 'rgba(148,163,184,0.3)',
      style: { color: '#e2e8f0' },
    },
    plotOptions: {
      series: {
        animation: false,
      },
      column: {
        borderWidth: 0,
        pointPadding: 0.1,
        groupPadding: 0.06,
        borderRadius: 2,
      },
      spline: {
        marker: { enabled: false },
        lineWidth: 2.5,
      },
    },
    series: [
      {
        type: chartKind === 'bar' ? 'column' : 'spline',
        color,
        data,
      },
    ],
  };

  return (
    <DashboardPanel className="h-full p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-300">{title}</p>
      </div>
      <div className="mt-1 flex items-end gap-2">
        <p className="text-[34px] font-semibold leading-none text-white">{value}</p>
        <span className={['rounded px-1.5 py-0.5 text-[10px] font-medium', badgeClass].join(' ')}>{badgeLabel}</span>
      </div>

      <div className="mt-4 rounded border border-indigo-300/10 bg-slate-900/20 p-2">
        <HighchartsReact highcharts={Highcharts} options={chartOptions} />
      </div>

      <div className="mt-4 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 text-slate-300">
          {liveTag ? <span className="rounded bg-emerald-500/15 px-1.5 py-0.5 text-[10px] text-emerald-300">{liveTag}</span> : null}
          <span>{footerLabel}</span>
        </div>
        <button type="button" className="text-fuchsia-300 transition-colors hover:text-fuchsia-200">
          {actionLabel}
        </button>
      </div>
    </DashboardPanel>
  );
}

