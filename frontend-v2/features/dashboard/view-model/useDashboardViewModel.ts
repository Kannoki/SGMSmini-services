'use client';

import { useMemo } from 'react';
import { useDashboardController } from '../controller/useDashboardController';
import {
  formatCompactNumber,
  formatCurrency,
  formatPercent,
  sortOrdersByDate,
  trendBadgeClass,
} from '../model/dashboard.mappers';
import type { DashboardChartSeries, DashboardData } from '../model/dashboard.types';

type DashboardViewModelData = {
  welcomeTitle: string;
  subtitle: string;
  kpis: Array<{
    id: string;
    title: string;
    value: string;
    badgeLabel: string;
    badgeClass: string;
    icon: string;
  }>;
  revenue: {
    title: string;
    value: string;
    badgeLabel: string;
    badgeClass: string;
    rangeLabel: string;
    series: Array<DashboardChartSeries & { data: number[] }>;
    labels: string[];
  };
  insights: Array<{
    id: string;
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
  }>;
  reportsTitle: string;
  deviceTotal: string;
  deviceSegments: Array<{
    label: string;
    value: string;
    percent: string;
    color: string;
  }>;
  recentOrders: Array<{
    id: string;
    total: string;
    dateTime: string;
    status: 'paid' | 'pending';
  }>;
  countriesTitle: string;
  countryTotal: string;
  countryChangeLabel: string;
  countries: Array<{
    name: string;
    percentLabel: string;
    color: string;
  }>;
  mapHighlights: DashboardData['mapHighlights'];
};

function createViewData(data: DashboardData): DashboardViewModelData {
  const revenueSeries = data.revenue.series.map((series) => ({
    ...series,
    data: series.points.map((point) => point.value),
  }));

  const revenueLabels = data.revenue.series[0]?.points.map((point) => point.label) ?? [];
  const totalDevice = data.deviceTotal || data.deviceSegments.reduce((sum, segment) => sum + segment.value, 0);

  return {
    welcomeTitle: data.welcomeTitle,
    subtitle: data.subtitle,
    kpis: data.kpis.map((item) => ({
      id: item.id,
      title: item.title,
      value: item.value,
      badgeLabel: formatPercent(item.changePercent),
      badgeClass: trendBadgeClass(item.trend),
      icon: item.icon,
    })),
    revenue: {
      title: data.revenue.title,
      value: data.revenue.value,
      badgeLabel: formatPercent(data.revenue.changePercent),
      badgeClass: trendBadgeClass(data.revenue.trend),
      rangeLabel: data.revenue.rangeLabel,
      series: revenueSeries,
      labels: revenueLabels,
    },
    insights: data.insights.map((insight) => ({
      id: insight.id,
      title: insight.title,
      value: insight.value,
      badgeLabel: formatPercent(insight.changePercent),
      badgeClass: trendBadgeClass(insight.trend),
      footerLabel: insight.footerLabel,
      actionLabel: insight.actionLabel,
      liveTag: insight.liveTag,
      chartKind: insight.series.kind as 'bar' | 'spark',
      color: insight.series.color,
      labels: insight.series.points.map((point) => point.label),
      data: insight.series.points.map((point) => point.value),
    })),
    reportsTitle: data.reportsTitle,
    deviceTotal: formatCompactNumber(totalDevice),
    deviceSegments: data.deviceSegments.map((segment) => ({
      label: segment.label,
      value: formatCompactNumber(segment.value),
      percent: `${Math.round((segment.value / totalDevice) * 100)}%`,
      color: segment.color,
    })),
    recentOrders: sortOrdersByDate(data).map((order) => ({
      id: order.id,
      total: formatCurrency(order.total),
      dateTime: order.dateTime,
      status: order.status,
    })),
    countriesTitle: data.countriesTitle,
    countryTotal: data.countryTotal,
    countryChangeLabel: formatPercent(data.countryChangePercent),
    countries: data.countries.map((country) => ({
      name: country.name,
      percentLabel: `${country.percent}%`,
      color: country.color,
    })),
    mapHighlights: data.mapHighlights,
  };
}

export function useDashboardViewModel() {
  const controller = useDashboardController();

  const viewData = useMemo(() => {
    if (!controller.data) {
      return null;
    }
    return createViewData(controller.data);
  }, [controller.data]);

  return {
    ...controller,
    viewData,
  };
}

