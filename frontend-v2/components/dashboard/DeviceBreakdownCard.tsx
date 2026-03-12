import { DashboardPanel } from './DashboardPanel';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

type Segment = {
  label: string;
  value: string;
  percent: string;
  color: string;
};

type DeviceBreakdownCardProps = {
  total: string;
  segments: Segment[];
};

export function DeviceBreakdownCard({ total, segments }: DeviceBreakdownCardProps) {
  const chartOptions: Highcharts.Options = {
    chart: {
      type: 'pie',
      backgroundColor: 'transparent',
      height: 200,
      spacing: [0, 0, 0, 0],
    },
    title: { text: undefined },
    credits: { enabled: false },
    tooltip: {
      backgroundColor: '#0b1538',
      borderColor: 'rgba(148,163,184,0.3)',
      style: { color: '#e2e8f0' },
      pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>',
    },
    legend: { enabled: false },
    plotOptions: {
      pie: {
        innerSize: '72%',
        borderWidth: 0,
        dataLabels: { enabled: false },
      },
    },
    series: [
      {
        type: 'pie',
        name: 'Users',
        data: segments.map((segment) => ({
          name: segment.label,
          y: Number.parseInt(segment.percent, 10),
          color: segment.color,
        })),
      },
    ],
  };

  return (
    <DashboardPanel className="h-full p-6">
      <div className="grid gap-5 xl:grid-cols-[220px_1fr]">
        <div className="relative mx-auto w-full max-w-[200px]">
          <HighchartsReact highcharts={Highcharts} options={chartOptions} />
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-[42px] font-semibold leading-none text-white">{total}</p>
            <p className="mt-1 text-sm text-slate-300">Users by device</p>
          </div>
        </div>

        <div className="space-y-3">
          {segments.map((segment) => (
            <div key={segment.label} className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 text-slate-300">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: segment.color }} />
                {segment.label}
              </span>
              <span className="font-medium text-slate-100">
                {segment.value} <span className="ml-1 text-xs text-slate-400">({segment.percent})</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </DashboardPanel>
  );
}

