import { useState, useEffect, useCallback } from 'react';
import { dashboardService } from '../services/dashboardService';
import type { DashboardMetrics, DashboardCharts } from '../types';
import { toast } from 'sonner';

export function useDashboard() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [charts, setCharts] = useState<DashboardCharts | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const fetchDashboardData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [metricsData, chartsData] = await Promise.all([
        dashboardService.getMetrics(),
        dashboardService.getCharts(),
      ]);
      setMetrics(metricsData);
      setCharts(chartsData);
      setLastUpdated(new Date());
    } catch {
      toast.error('Dashboard Error', {
        description: 'Unable to fetch analytics data from server.',
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return {
    metrics,
    charts,
    isLoading,
    refresh: fetchDashboardData,
    lastUpdated,
  };
}
