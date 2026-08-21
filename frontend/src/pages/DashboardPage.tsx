import React from 'react';
import { NavLink } from 'react-router-dom';
import { useDashboard } from '../hooks/useDashboard';
import MetricCard from '../components/dashboard/MetricCard';
import RankDistributionChart from '../components/dashboard/RankDistributionChart';
import StatusBreakdownChart from '../components/dashboard/StatusBreakdownChart';
import EnlistmentTrendChart from '../components/dashboard/EnlistmentTrendChart';
import GenderCivilStatusChart from '../components/dashboard/GenderCivilStatusChart';
import { Button } from '../components/ui/button';
import {
  Users,
  UserCheck,
  Clock,
  ShieldAlert,
  Award,
  RotateCcw,
  UserPlus,
  LayoutDashboard,
} from 'lucide-react';

export default function DashboardPage() {
  const { metrics, charts, isLoading, refresh, lastUpdated } = useDashboard();

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800">
              <LayoutDashboard className="h-4 w-4" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Dashboard
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Force readiness metrics, rank stratification, and regimental demographic intelligence
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={refresh}
            disabled={isLoading}
            className="h-10 px-3.5 text-xs font-semibold border-slate-200 bg-white text-slate-700 hover:bg-slate-50 gap-1.5 shadow-xs"
          >
            <RotateCcw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
            <span className="hidden lg:inline text-[10px] text-slate-400 font-mono ml-1">
              ({formatTime(lastUpdated)})
            </span>
          </Button>

          <NavLink to="/personnel/create">
            <Button className="h-10 px-4 bg-[#064e3b] hover:bg-[#065f46] text-white font-semibold text-xs rounded-xl shadow-sm gap-2">
              <UserPlus className="h-4 w-4" />
              <span>Enlist Personnel</span>
            </Button>
          </NavLink>
        </div>
      </div>

      {/* Top 5 Metric Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <MetricCard
          title="Total Strength"
          value={metrics?.total ?? 0}
          subtitle="All recorded personnel"
          icon={Users}
          colorClass="text-slate-900"
          bgClass="bg-white"
          borderClass="border-slate-200/90"
          isLoading={isLoading}
        />
        <MetricCard
          title="Active Duty"
          value={metrics?.active ?? 0}
          subtitle={
            metrics?.total && metrics.total > 0
              ? `${((metrics.active / metrics.total) * 100).toFixed(0)}% combat ready`
              : 'Active operational force'
          }
          icon={UserCheck}
          colorClass="text-emerald-700"
          bgClass="bg-emerald-50/30"
          borderClass="border-emerald-200/70"
          isLoading={isLoading}
        />
        <MetricCard
          title="Reserve Force"
          value={metrics?.reserve ?? 0}
          subtitle="Standby mobilization unit"
          icon={Clock}
          colorClass="text-amber-700"
          bgClass="bg-amber-50/30"
          borderClass="border-amber-200/70"
          isLoading={isLoading}
        />
        <MetricCard
          title="AWOL Status"
          value={metrics?.awol ?? 0}
          subtitle="Unauthorized absence"
          icon={ShieldAlert}
          colorClass="text-rose-700"
          bgClass="bg-rose-50/30"
          borderClass="border-rose-200/70"
          isLoading={isLoading}
        />
        <MetricCard
          title="Honorably Retired"
          value={metrics?.retired ?? 0}
          subtitle="Completed service"
          icon={Award}
          colorClass="text-blue-700"
          bgClass="bg-blue-50/30"
          borderClass="border-blue-200/70"
          isLoading={isLoading}
        />
      </div>

      {/* Analytics Charts 2x2 Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Chart 1: Rank Distribution */}
        <RankDistributionChart
          data={charts?.rank_distribution}
          isLoading={isLoading}
        />

        {/* Chart 2: Status Breakdown Donut */}
        <StatusBreakdownChart
          data={charts?.status_breakdown}
          isLoading={isLoading}
        />

        {/* Chart 3: Historical Enlistment Trend */}
        <EnlistmentTrendChart
          data={charts?.enlistment_trends}
          isLoading={isLoading}
        />

        {/* Chart 4: Civil Status Demographics */}
        <GenderCivilStatusChart
          data={charts?.gender_civil_status}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
