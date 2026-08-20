import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Shield } from 'lucide-react';

interface RankDistributionChartProps {
  data: Array<{ rank: string; count: number }> | undefined;
  isLoading?: boolean;
}

export default function RankDistributionChart({ data, isLoading }: RankDistributionChartProps) {
  const chartData = data || [];

  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-xl">
          <p className="text-xs font-bold text-slate-800">{label} (Rank)</p>
          <p className="text-sm font-extrabold text-[#064e3b] mt-1">
            {payload[0].value} Personnel
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
          <Shield className="h-4 w-4 text-emerald-600" />
          <CardTitle className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Rank Distribution
          </CardTitle>
        </div>
        <CardDescription className="text-xs text-slate-500">
          Enlisted personnel and commissioned officer count across all military ranks
        </CardDescription>
      </CardHeader>

      <CardContent className="p-5 flex-1 min-h-[300px]">
        {isLoading ? (
          <div className="flex h-full w-full items-center justify-center">
            <div className="h-48 w-full animate-pulse rounded-xl bg-slate-100" />
          </div>
        ) : chartData.length === 0 ? (
          <div className="flex h-full items-center justify-center text-xs text-slate-400">
            No rank distribution data available
          </div>
        ) : (
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="rank"
                  tick={{ fontSize: 10, fill: '#64748b', fontWeight: 600 }}
                  interval={0}
                  angle={-45}
                  textAnchor="end"
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
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {chartData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={index % 2 === 0 ? '#064e3b' : '#059669'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
