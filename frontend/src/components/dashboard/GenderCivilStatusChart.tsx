import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Users2 } from 'lucide-react';

interface GenderCivilStatusChartProps {
  data: Array<{ gender: string; civil_status: string; count: number }> | undefined;
  isLoading?: boolean;
}

export default function GenderCivilStatusChart({
  data,
  isLoading,
}: GenderCivilStatusChartProps) {
  // Aggregate data by civil_status with male and female keys
  const civilStatuses = ['Single', 'Married', 'Widowed', 'Separated', 'Divorced'];
  
  const chartData = civilStatuses.map((status) => {
    const maleRecord = (data || []).find(
      (d) => d.civil_status === status && d.gender === 'Male'
    );
    const femaleRecord = (data || []).find(
      (d) => d.civil_status === status && d.gender === 'Female'
    );

    return {
      status,
      Male: maleRecord?.count || 0,
      Female: femaleRecord?.count || 0,
    };
  });

  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string }) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-xl space-y-1">
          <p className="text-xs font-bold text-slate-800 border-b border-slate-100 pb-1">{label} Status</p>
          {payload.map((entry, idx) => (
            <div key={idx} className="flex items-center justify-between gap-3 text-xs">
              <span className="flex items-center gap-1 font-medium" style={{ color: entry.color }}>
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
                {entry.name}:
              </span>
              <span className="font-bold text-slate-900">{entry.value} Personnel</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="rounded-2xl border border-slate-200/90 bg-white shadow-sm overflow-hidden flex flex-col h-full">
      <CardHeader className="p-5 pb-2 border-b border-slate-100 bg-slate-50/40">
        <div className="flex items-center gap-2">
          <Users2 className="h-4 w-4 text-emerald-600" />
          <CardTitle className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Gender & Civil Status
          </CardTitle>
        </div>
        <CardDescription className="text-xs text-slate-500">
          Demographic distribution across marital status and gender categories
        </CardDescription>
      </CardHeader>

      <CardContent className="p-5 flex-1 min-h-[300px]">
        {isLoading ? (
          <div className="flex h-full w-full items-center justify-center">
            <div className="h-48 w-full animate-pulse rounded-xl bg-slate-100" />
          </div>
        ) : chartData.length === 0 ? (
          <div className="flex h-full items-center justify-center text-xs text-slate-400">
            No demographic data available
          </div>
        ) : (
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="status"
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
                <Legend
                  wrapperStyle={{ fontSize: 11, paddingTop: 10 }}
                />
                <Bar dataKey="Male" fill="#064e3b" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Female" fill="#0891b2" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
