'use client';

import { useCallback, useEffect, useState } from 'react';
import { dashboardMockData } from '../model/dashboard.mock';
import type { DashboardData } from '../model/dashboard.types';

export type DashboardControllerState = {
  data: DashboardData | null;
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  refresh: () => Promise<void>;
};

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export function useDashboardController(): DashboardControllerState {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = useCallback(async (refreshing: boolean) => {
    if (refreshing) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }

    setError(null);

    try {
      // Mocked API latency. Replace with real network call later.
      await wait(refreshing ? 450 : 650);
      setData(dashboardMockData);
    } catch {
      setError('Unable to load dashboard data.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void fetchDashboard(false);
  }, [fetchDashboard]);

  const refresh = useCallback(async () => {
    await fetchDashboard(true);
  }, [fetchDashboard]);

  return {
    data,
    isLoading,
    isRefreshing,
    error,
    refresh,
  };
}

