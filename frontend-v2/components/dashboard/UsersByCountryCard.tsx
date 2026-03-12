import { DashboardPanel } from './DashboardPanel';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

type Country = {
  name: string;
  percentLabel: string;
  color: string;
};

type Highlight = {
  x: string;
  y: string;
  size: number;
  tone: 'pink' | 'cyan';
  valueLabel?: string;
  countryLabel?: string;
};

type UsersByCountryCardProps = {
  title: string;
  total: string;
  changeLabel: string;
  countries: Country[];
  highlights: Highlight[];
};

export function UsersByCountryCard({ title, total, changeLabel, countries, highlights }: UsersByCountryCardProps) {
  const chartOptions: Highcharts.Options = {
    chart: {
      type: 'scatter',
      backgroundColor: 'transparent',
      height: 230,
      spacing: [4, 4, 4, 4],
    },
    title: { text: undefined },
    credits: { enabled: false },
    legend: { enabled: false },
    xAxis: {
      min: 0,
      max: 100,
      visible: false,
      gridLineWidth: 0,
      lineWidth: 0,
    },
    yAxis: {
      min: 0,
      max: 100,
      visible: false,
      gridLineWidth: 0,
      lineWidth: 0,
    },
    tooltip: {
      useHTML: true,
      formatter: function formatter() {
        const point = (this as unknown as { point: Highcharts.Point & { valueLabel?: string; countryLabel?: string } }).point;
        if (point.valueLabel) {
          return `<b>${point.valueLabel}</b><br/>${point.countryLabel ?? ''}`;
        }
        return `<b>${point.name}</b>`;
      },
      backgroundColor: '#0b1538',
      borderColor: 'rgba(148,163,184,0.3)',
      style: { color: '#e2e8f0' },
    },
    plotOptions: {
      scatter: {
        marker: {
          symbol: 'circle',
          lineWidth: 0,
        },
      },
      series: {
        animation: false,
      },
    },
    series: [
      {
        type: 'scatter',
        data: highlights.map((highlight, index) => ({
          x: Number.parseFloat(highlight.x),
          y: 100 - Number.parseFloat(highlight.y),
          marker: {
            radius: Math.max(6, Math.round(highlight.size / 2.4)),
            fillColor: highlight.tone === 'pink' ? '#d946ef' : '#22d3ee',
          },
          name: highlight.countryLabel ?? `Marker ${index + 1}`,
          valueLabel: highlight.valueLabel,
          countryLabel: highlight.countryLabel,
        })),
      },
    ],
  };

  return (
    <DashboardPanel className="p-6">
      <div className="grid gap-6 xl:grid-cols-[300px_1fr]">
        <div>
          <p className="text-lg font-semibold text-white">{title}</p>
          <div className="mt-2 flex items-end gap-2">
            <p className="text-[34px] font-semibold leading-none text-white">{total}</p>
            <span className="rounded bg-emerald-500/15 px-1.5 py-0.5 text-[10px] font-medium text-emerald-300">{changeLabel}</span>
          </div>

          <div className="mt-4 space-y-3">
            {countries.map((country) => (
              <div key={country.name}>
                <div className="mb-1 flex items-center justify-between text-xs text-slate-300">
                  <span>{country.name}</span>
                  <span>{country.percentLabel}</span>
                </div>
                <div className="h-1 rounded-full bg-indigo-200/10">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: country.percentLabel,
                      backgroundColor: country.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative min-h-[210px] overflow-hidden rounded-xl border border-indigo-300/10 bg-[#07153a] p-2">
          <HighchartsReact highcharts={Highcharts} options={chartOptions} />
        </div>
      </div>
    </DashboardPanel>
  );
}

