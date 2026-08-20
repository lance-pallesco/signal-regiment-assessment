import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { TrendingUp } from 'lucide-react';

interface EnlistmentTrendChartProps {
  data: Array<{ year: number | string; count: number }> | undefined;
  isLoading?: boolean;
}

export default function EnlistmentTrendChart({ data, isLoading }: EnlistmentTrendChartProps) {
  const chartData = (data || [])
    .map((item) => ({
      year: item.year.toString(),
      enlistments: item.count,
    }))
    .sort((a, b) => parseInt(a.year, 10) - parseInt(b.year, 10));

  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-xl">
          <p className="text-xs font-bold text-slate-800">Year {label}</p>
          <p className="text-sm font-extrabold text-[#064e3b] mt-1">
            {payload[0].value} Recruits Enlisted
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
          <TrendingUp className="h-4 w-4 text-emerald-600" />
          <CardTitle className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Yearly Enlistment Trend
          </CardTitle>
        </div>
        <CardDescription className="text-xs text-slate-500">
          Historical military intake and recruitment volume over time
        </CardDescription>
      </CardHeader>

      <CardContent className="p-5 flex-1 min-h-[300px]">
        {isLoading ? (
          <div className="flex h-full w-full items-center justify-center">
            <div className="h-48 w-full animate-pulse rounded-xl bg-slate-100" />
          </div>
        ) : chartData.length === 0 ? (
          <div className="flex h-full items-center justify-center text-xs text-slate-400">
            No historical enlistment data available
          </div>
        ) : (
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 15, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="enlistmentGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#059669" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#059669" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="year"
                  tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }}
                  tickLine={false}
                  axisLine={{ stroke: '#e2e8f0' }}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  tickLine={false}
                  axisLine={{ stroke: '#e2e8f0' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="enlistments"
                  stroke="#064e3b"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#enlistmentGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
