import React from 'react';
import { Card, CardContent } from '../ui/card';
import type { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon: LucideIcon;
  colorClass: string;
  bgClass: string;
  borderClass: string;
  isLoading?: boolean;
}

export default function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  colorClass,
  bgClass,
  borderClass,
  isLoading,
}: MetricCardProps) {
  return (
    <Card className={`rounded-2xl border ${borderClass} ${bgClass} p-5 shadow-sm transition-all hover:shadow-md`}>
      <CardContent className="p-0">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold tracking-wider text-slate-500 uppercase">
            {title}
          </span>
          <div className={`flex h-9 w-9 items-center justify-center rounded-xl bg-white shadow-xs border border-slate-100 ${colorClass}`}>
            <Icon className="h-4 w-4" />
          </div>
        </div>

        <div className="mt-3">
          {isLoading ? (
            <div className="h-9 w-16 animate-pulse rounded bg-slate-200" />
          ) : (
            <div className={`text-3xl font-black tracking-tight ${colorClass}`}>
              {value}
            </div>
          )}
          {subtitle && (
            <p className="mt-1 text-xs text-slate-500 font-medium">
              {subtitle}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
