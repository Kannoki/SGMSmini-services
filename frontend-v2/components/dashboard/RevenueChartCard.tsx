import { DashboardPanel } from './DashboardPanel';
import { MaterialSymbol } from './MaterialSymbol';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

type Series = {
  name: string;
  color: string;
  data: number[];
};

type RevenueChartCardProps = {
  title: string;
  value: string;
  badgeLabel: string;
  badgeClass: string;
  rangeLabel: string;
  series: Series[];
  labels: string[];
};

export function RevenueChartCard({
  title,
  value,
  badgeLabel,
  badgeClass,
  rangeLabel,
  series,
  labels,
}: RevenueChartCardProps) {
  const chartOptions: Highcharts.Options = {
    chart: {
      type: 'spline',
      backgroundColor: 'transparent',
      height: 250,
      spacing: [8, 8, 8, 8],
    },
    title: { text: undefined },
    credits: { enabled: false },
    legend: { enabled: false },
    xAxis: {
      categories: labels,
      tickLength: 0,
      lineWidth: 0,
      labels: { style: { color: '#94a3b8', fontSize: '11px' } },
    },
    yAxis: {
      title: { text: undefined },
      gridLineColor: 'rgba(148,163,184,0.12)',
      labels: { style: { color: '#64748b', fontSize: '11px' } },
    },
    tooltip: {
      shared: true,
      backgroundColor: '#0b1538',
      borderColor: 'rgba(148,163,184,0.3)',
      style: { color: '#e2e8f0' },
    },
    plotOptions: {
      series: {
        marker: { enabled: false },
        lineWidth: 2.4,
      },
      area: {
        fillOpacity: 0.15,
      },
    },
    series: series.map((line, index) => ({
      type: index === 0 ? 'area' : 'spline',
      name: line.name,
      color: line.color,
      data: line.data,
    })),
  };

  return (
    <DashboardPanel className="p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm text-slate-300">{title}</p>
          <div className="mt-1 flex items-end gap-2">
            <p className="text-[35px] font-semibold leading-none text-white">{value}</p>
            <span className={['rounded px-1.5 py-0.5 text-[10px] font-medium', badgeClass].join(' ')}>{badgeLabel}</span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs text-slate-300">
          {series.map((item) => (
            <span key={item.name} className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
              {item.name}
            </span>
          ))}
          <span className="ml-2 flex items-center gap-1 rounded-md border border-indigo-300/20 px-2 py-1 text-slate-300">
            <MaterialSymbol name="calendar_today" className="text-sm" />
            {rangeLabel}
            <MaterialSymbol name="expand_more" className="text-sm" />
          </span>
        </div>
      </div>

      <div className="mt-5 overflow-hidden rounded-lg border border-indigo-300/10 bg-slate-900/20 p-4">
        <HighchartsReact highcharts={Highcharts} options={chartOptions} />
      </div>
    </DashboardPanel>
  );
}

