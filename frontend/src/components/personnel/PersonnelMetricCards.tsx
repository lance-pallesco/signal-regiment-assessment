import React from 'react';
import { Card, CardContent } from '../ui/card';
import type { DashboardMetrics } from '../../types';
import { Users, UserCheck, ShieldAlert, Clock, Award } from 'lucide-react';

interface PersonnelMetricCardsProps {
  metrics: DashboardMetrics | null;
  isLoading?: boolean;
}

export default function PersonnelMetricCards({ metrics, isLoading }: PersonnelMetricCardsProps) {
  const cards = [
    {
      title: 'TOTAL PERSONNEL',
      count: metrics?.total ?? 0,
      icon: Users,
      color: 'text-slate-900',
      border: 'border-slate-200',
      bg: 'bg-white',
      accent: 'text-slate-700',
    },
    {
      title: 'ACTIVE DUTY',
      count: metrics?.active ?? 0,
      icon: UserCheck,
      color: 'text-emerald-700',
      border: 'border-emerald-200/80',
      bg: 'bg-emerald-50/40',
      accent: 'text-emerald-600',
    },
    {
      title: 'RESERVE FORCE',
      count: metrics?.reserve ?? 0,
      icon: Clock,
      color: 'text-amber-700',
      border: 'border-amber-200/80',
      bg: 'bg-amber-50/40',
      accent: 'text-amber-600',
    },
    {
      title: 'AWOL STATUS',
      count: metrics?.awol ?? 0,
      icon: ShieldAlert,
      color: 'text-rose-700',
      border: 'border-rose-200/80',
      bg: 'bg-rose-50/40',
      accent: 'text-rose-600',
    },
    {
      title: 'HONORABLY RETIRED',
      count: metrics?.retired ?? 0,
      icon: Award,
      color: 'text-blue-700',
      border: 'border-blue-200/80',
      bg: 'bg-blue-50/40',
      accent: 'text-blue-600',
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 mb-6">
      {cards.map((card) => (
        <Card
          key={card.title}
          className={`rounded-xl border ${card.border} ${card.bg} p-4 shadow-sm transition-all hover:shadow-md`}
        >
          <CardContent className="p-0">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                {card.title}
              </span>
              <card.icon className={`h-4 w-4 ${card.accent}`} />
            </div>
            <div className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl">
              {isLoading ? (
                <div className="h-8 w-12 animate-pulse rounded bg-slate-200" />
              ) : (
                <span className={card.color}>{card.count}</span>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
