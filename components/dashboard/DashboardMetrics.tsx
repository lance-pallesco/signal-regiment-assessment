import React from "react";
import { Users, ShieldCheck, UserCheck, Award, Medal } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export interface DashboardMetricsProps {
  totalPersonnel: number;
  activePersonnel: number;
  reservePersonnel: number;
  retiredPersonnel: number;
  officersCount: number;
  enlistedCount: number;
}

export function DashboardMetrics({
  totalPersonnel,
  activePersonnel,
  reservePersonnel,
  retiredPersonnel,
  officersCount,
  enlistedCount,
}: DashboardMetricsProps) {
  const activeRate = totalPersonnel > 0 ? ((activePersonnel / totalPersonnel) * 100).toFixed(1) : "0";

  const cards = [
    {
      title: "Total Personnel",
      value: totalPersonnel,
      description: "Regiment Strength",
      icon: Users,
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-50 dark:bg-blue-950/60",
      border: "border-blue-200/60 dark:border-blue-900/40",
    },
    {
      title: "Active Duty",
      value: activePersonnel,
      description: `${activeRate}% on Active Service`,
      icon: ShieldCheck,
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-50 dark:bg-emerald-950/60",
      border: "border-emerald-200/60 dark:border-emerald-900/40",
    },
    {
      title: "Reserve Forces",
      value: reservePersonnel,
      description: "Ready Reserve Component",
      icon: UserCheck,
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-50 dark:bg-amber-950/60",
      border: "border-amber-200/60 dark:border-amber-900/40",
    },
    {
      title: "Retired Veterans",
      value: retiredPersonnel,
      description: "Honorable Service",
      icon: Award,
      color: "text-purple-600 dark:text-purple-400",
      bg: "bg-purple-50 dark:bg-purple-950/60",
      border: "border-purple-200/60 dark:border-purple-900/40",
    },
    {
      title: "Officers / Enlisted",
      value: `${officersCount} / ${enlistedCount}`,
      description: "Command Structure",
      icon: Medal,
      color: "text-rose-600 dark:text-rose-400",
      bg: "bg-rose-50 dark:bg-rose-950/60",
      border: "border-rose-200/60 dark:border-rose-900/40",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Card
            key={card.title}
            className={`border ${card.border} shadow-xs hover:shadow-md transition-all duration-200`}
          >
            <CardContent className="p-4 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {card.title}
                </p>
                <p className="text-xl sm:text-2xl font-black tracking-tight text-foreground">
                  {card.value}
                </p>
                <p className="text-[11px] text-muted-foreground">{card.description}</p>
              </div>
              <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${card.bg} ${card.color} shrink-0`}>
                <Icon className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
