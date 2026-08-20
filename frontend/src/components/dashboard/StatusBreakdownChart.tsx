import React from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Activity } from 'lucide-react';

interface StatusBreakdownChartProps {
  data: Array<{ status: string; count: number }> | undefined;
  isLoading?: boolean;
}

const STATUS_COLORS: Record<string, { color: string; bg: string; text: string }> = {
  Active: { color: '#059669', bg: 'bg-emerald-50', text: 'text-emerald-700' },
  Reserve: { color: '#d97706', bg: 'bg-amber-50', text: 'text-amber-700' },
  AWOL: { color: '#e11d48', bg: 'bg-rose-50', text: 'text-rose-700' },
  Retired: { color: '#2563eb', bg: 'bg-blue-50', text: 'text-blue-700' },
};

export default function StatusBreakdownChart({ data, isLoading }: StatusBreakdownChartProps) {
  const chartData = (data || []).map((item) => ({
    name: item.status,
    value: item.count,
    color: STATUS_COLORS[item.status]?.color || '#64748b',
  }));

  const total = chartData.reduce((acc, curr) => acc + curr.value, 0);

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ name: string; value: number; payload: { color: string } }> }) => {
    if (active && payload && payload.length) {
      const item = payload[0];
      const pct = total > 0 ? ((item.value / total) * 100).toFixed(1) : '0';
      return (
        <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-xl">
          <div className="flex items-center gap-2">
            <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.payload.color }} />
            <p className="text-xs font-bold text-slate-800">{item.name}</p>
          </div>
          <p className="text-sm font-extrabold text-slate-900 mt-1">
            {item.value} Personnel <span className="text-xs font-normal text-slate-500">({pct}%)</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="rounded-2xl border border-slate-200/90 bg-white shadow-sm overflow-hidden flex flex-col h-full">
      <CardHeader className="p-5 pb-2 border-b border-slate-100 bg-slate-50/40">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-emerald-600" />
          <CardTitle className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Duty Status Breakdown
          </CardTitle>
        </div>
        <CardDescription className="text-xs text-slate-500">
          Proportion of active combat ready, reserve, AWOL, and retired personnel
        </CardDescription>
      </CardHeader>

      <CardContent className="p-5 flex flex-col items-center justify-between flex-1 min-h-[300px]">
        {isLoading ? (
          <div className="flex h-full w-full items-center justify-center">
            <div className="h-48 w-48 animate-pulse rounded-full bg-slate-100" />
          </div>
        ) : chartData.length === 0 ? (
          <div className="flex h-full items-center justify-center text-xs text-slate-400">
            No status data available
          </div>
        ) : (
          <>
            <div className="h-[180px] w-full relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip content={<CustomTooltip />} />
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={52}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xl font-black text-slate-900 leading-none">{total}</span>
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mt-0.5">Total</span>
              </div>
            </div>

            {/* Custom Status Legend List */}
            <div className="w-full grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-100">
              {chartData.map((item) => {
                const pct = total > 0 ? ((item.value / total) * 100).toFixed(0) : '0';
                return (
                  <div
                    key={item.name}
                    className="flex items-center justify-between p-2 rounded-lg bg-slate-50/80 border border-slate-100"
                  >
                    <div className="flex items-center gap-1.5">
                      <div className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-xs font-semibold text-slate-700">{item.name}</span>
                    </div>
                    <span className="text-xs font-bold text-slate-900">
                      {item.value} <span className="text-[10px] text-slate-400 font-normal">({pct}%)</span>
                    </span>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
