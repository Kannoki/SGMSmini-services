'use client';

import {
  DeviceBreakdownCard,
  InsightCard,
  KpiCard,
  MaterialSymbol,
  RecentOrdersCard,
  RevenueChartCard,
  SectionTitle,
  UsersByCountryCard,
} from '@shared/components/dashboard';
import { useDashboardViewModel } from '../view-model/useDashboardViewModel';

function DashboardLoading() {
  return (
    <section className="space-y-4">
      <div className="h-12 w-72 animate-pulse rounded-md bg-slate-800" />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-24 animate-pulse rounded-xl bg-slate-800" />
        ))}
      </div>
      <div className="h-80 animate-pulse rounded-xl bg-slate-800" />
    </section>
  );
}

function HeaderActions({ onRefresh, isRefreshing }: { onRefresh: () => void; isRefreshing: boolean }) {
  return (
    <>
      <button type="button" className="rounded-md bg-indigo-950 px-3 py-1.5 text-xs font-medium text-slate-100 hover:bg-indigo-900">
        Export data
      </button>
      <button
        type="button"
        onClick={onRefresh}
        className="inline-flex items-center gap-1 rounded-md bg-fuchsia-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-fuchsia-500"
      >
        <MaterialSymbol name={isRefreshing ? 'sync' : 'add'} className={['text-sm', isRefreshing ? 'animate-spin' : ''].join(' ')} />
        {isRefreshing ? 'Refreshing' : 'Create report'}
      </button>
    </>
  );
}

export function DashboardScreen() {
  const { viewData, isLoading, error, refresh, isRefreshing } = useDashboardViewModel();

  if (isLoading || !viewData) {
    return <DashboardLoading />;
  }

  if (error) {
    return (
      <section className="rounded-xl border border-rose-500/40 bg-rose-500/10 p-6 text-rose-100">
        <h2 className="text-xl font-semibold">Dashboard failed to load</h2>
        <p className="mt-2 text-sm text-rose-200/90">{error}</p>
        <button type="button" onClick={() => void refresh()} className="mt-4 rounded-md bg-rose-500/20 px-3 py-1.5 text-sm hover:bg-rose-500/30">
          Retry
        </button>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <SectionTitle title={viewData.welcomeTitle} subtitle={viewData.subtitle} actions={<HeaderActions onRefresh={() => void refresh()} isRefreshing={isRefreshing} />} />

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {viewData.kpis.map((kpi) => (
          <KpiCard key={kpi.id} title={kpi.title} value={kpi.value} badgeLabel={kpi.badgeLabel} badgeClass={kpi.badgeClass} icon={kpi.icon} />
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[2fr_1fr]">
        <RevenueChartCard
          title={viewData.revenue.title}
          value={viewData.revenue.value}
          badgeLabel={viewData.revenue.badgeLabel}
          badgeClass={viewData.revenue.badgeClass}
          rangeLabel={viewData.revenue.rangeLabel}
          series={viewData.revenue.series}
          labels={viewData.revenue.labels}
        />
        <div className="grid gap-4">
          {viewData.insights.map((insight) => (
            <InsightCard
              key={insight.id}
              title={insight.title}
              value={insight.value}
              badgeLabel={insight.badgeLabel}
              badgeClass={insight.badgeClass}
              footerLabel={insight.footerLabel}
              actionLabel={insight.actionLabel}
              liveTag={insight.liveTag}
              chartKind={insight.chartKind}
              color={insight.color}
              labels={insight.labels}
              data={insight.data}
            />
          ))}
        </div>
      </div>

      <div className="pt-1">
        <SectionTitle title={viewData.reportsTitle} actions={<HeaderActions onRefresh={() => void refresh()} isRefreshing={isRefreshing} />} />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <DeviceBreakdownCard total={viewData.deviceTotal} segments={viewData.deviceSegments} />
        <RecentOrdersCard orders={viewData.recentOrders} />
      </div>

      <UsersByCountryCard
        title={viewData.countriesTitle}
        total={viewData.countryTotal}
        changeLabel={viewData.countryChangeLabel}
        countries={viewData.countries}
        highlights={viewData.mapHighlights}
      />
    </section>
  );
}

