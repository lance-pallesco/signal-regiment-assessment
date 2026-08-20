import api from '../api/axios';
import type { DashboardMetrics, DashboardCharts, ApiResponse } from '../types';

export const dashboardService = {
  async getMetrics(): Promise<DashboardMetrics> {
    const response = await api.get<ApiResponse<DashboardMetrics>>('/api/dashboard/metrics');
    return response.data.data;
  },

  async getCharts(): Promise<DashboardCharts> {
    const response = await api.get<ApiResponse<DashboardCharts>>('/api/dashboard/charts');
    return response.data.data;
  },
};
