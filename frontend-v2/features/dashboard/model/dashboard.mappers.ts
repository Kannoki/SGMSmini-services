import type {
  DashboardChartSeries,
  DashboardData,
  DashboardPoint,
  DeviceSegment,
  RecentOrder,
  TrendDirection,
} from './dashboard.types';

export function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}

export function formatCompactNumber(value: number): string {
  return new Intl.NumberFormat('en-US').format(value);
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(value);
}

export function trendBadgeClass(trend: TrendDirection): string {
  return trend === 'up'
    ? 'bg-emerald-500/15 text-emerald-300'
    : 'bg-rose-500/15 text-rose-300';
}

export function createSvgPath(points: DashboardPoint[], width: number, height: number): string {
  if (!points.length) {
    return '';
  }

  const max = Math.max(...points.map((point) => point.value));
  const min = Math.min(...points.map((point) => point.value));
  const range = Math.max(max - min, 1);
  const stepX = points.length > 1 ? width / (points.length - 1) : width;

  return points
    .map((point, index) => {
      const x = index * stepX;
      const normalized = (point.value - min) / range;
      const y = height - normalized * height;
      return `${index === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .join(' ');
}

export function createBars(series: DashboardChartSeries): number[] {
  const max = Math.max(...series.points.map((point) => point.value), 1);
  return series.points.map((point) => (point.value / max) * 100);
}

export function getDeviceTotal(segments: DeviceSegment[]): number {
  return segments.reduce((sum, segment) => sum + segment.value, 0);
}

export function sortOrdersByDate(data: DashboardData): RecentOrder[] {
  return [...data.recentOrders].sort((a, b) => {
    const aDate = Date.parse(a.dateTime);
    const bDate = Date.parse(b.dateTime);
    if (Number.isNaN(aDate) || Number.isNaN(bDate)) {
      return 0;
    }
    return bDate - aDate;
  });
}

