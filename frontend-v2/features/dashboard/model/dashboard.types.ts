export type TrendDirection = 'up' | 'down';

export type OrderStatus = 'paid' | 'pending';

export type ChartSeriesKind = 'line' | 'bar' | 'spark';

export type DashboardPoint = {
  label: string;
  value: number;
};

export type DashboardKpi = {
  id: string;
  title: string;
  value: string;
  changePercent: number;
  trend: TrendDirection;
  icon: string;
};

export type DashboardChartSeries = {
  name: string;
  kind: ChartSeriesKind;
  color: string;
  points: DashboardPoint[];
};

export type RevenueChartData = {
  title: string;
  value: string;
  changePercent: number;
  trend: TrendDirection;
  rangeLabel: string;
  series: DashboardChartSeries[];
};

export type InsightCardData = {
  id: string;
  title: string;
  value: string;
  changePercent: number;
  trend: TrendDirection;
  footerLabel: string;
  actionLabel: string;
  series: DashboardChartSeries;
  liveTag?: string;
};

export type DeviceSegment = {
  label: string;
  value: number;
  color: string;
};

export type RecentOrder = {
  id: string;
  total: number;
  dateTime: string;
  status: OrderStatus;
};

export type CountryTraffic = {
  name: string;
  percent: number;
  color: string;
};

export type MapHighlight = {
  x: string;
  y: string;
  size: number;
  tone: 'pink' | 'cyan';
  valueLabel?: string;
  countryLabel?: string;
};

export type DashboardData = {
  welcomeTitle: string;
  subtitle: string;
  kpis: DashboardKpi[];
  revenue: RevenueChartData;
  insights: InsightCardData[];
  reportsTitle: string;
  deviceTotal: number;
  deviceSegments: DeviceSegment[];
  recentOrders: RecentOrder[];
  countriesTitle: string;
  countryTotal: string;
  countryChangePercent: number;
  countries: CountryTraffic[];
  mapHighlights: MapHighlight[];
};

