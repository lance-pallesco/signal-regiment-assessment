"use client";

import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
  CartesianGrid,
} from "recharts";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export interface PersonnelChartsProps {
  personnelByRank: { rank: string; count: number }[];
  personnelByStatus: { status: string; count: number }[];
  personnelByUnit: { unit: string; count: number }[];
}

const STATUS_COLORS: Record<string, string> = {
  Active: "#059669", // Emerald
  Reserve: "#d97706", // Amber
  Retired: "#64748b", // Slate
};

export function PersonnelCharts({
  personnelByRank,
  personnelByStatus,
  personnelByUnit,
}: PersonnelChartsProps) {
  // Shorten unit names for compact horizontal bar chart display
  const formattedUnitData = personnelByUnit.map((item) => ({
    ...item,
    shortName: item.unit
      .replace("Headquarters & Headquarters Company", "HHC Signal Regt")
      .replace("Signal Training School", "STS")
      .replace("Signal Special Operations Battalion", "SSOB")
      .replace("Battalion", "Bn"),
  }));

  // Shorten rank names for chart axis
  const formattedRankData = personnelByRank.slice(0, 10).map((item) => ({
    ...item,
    shortRank: item.rank
      .replace("Brigadier General", "BGEN")
      .replace("Lieutenant Colonel", "LTC")
      .replace("First Lieutenant", "1LT")
      .replace("Second Lieutenant", "2LT")
      .replace("Chief Master Sergeant", "CMS")
      .replace("Senior Master Sergeant", "SMS")
      .replace("Master Sergeant", "MSG")
      .replace("Technical Sergeant", "TSG")
      .replace("Staff Sergeant", "SSG")
      .replace("Private First Class", "PFC")
      .replace("Colonel", "COL")
      .replace("Captain", "CPT")
      .replace("Major", "MAJ")
      .replace("Sergeant", "SGT")
      .replace("Corporal", "CPL")
      .replace("Private", "PVT"),
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* 1. Personnel by Rank (Bar Chart) */}
      <Card className="lg:col-span-2 border-border/80 shadow-xs">
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base font-bold text-foreground">
              Personnel Distribution by Rank
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Officer & Enlisted strength breakdown
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={formattedRankData}
                margin={{ top: 10, right: 10, left: -20, bottom: 25 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                <XAxis
                  dataKey="shortRank"
                  tick={{ fontSize: 11 }}
                  interval={0}
                  angle={-30}
                  textAnchor="end"
                />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--card)",
                    borderColor: "var(--border)",
                    borderRadius: "0.75rem",
                    fontSize: "0.75rem",
                  }}
                  formatter={(value: any, name: any, item: any) => [
                    `${value} personnel`,
                    item.payload.rank,
                  ]}
                />
                <Bar
                  dataKey="count"
                  fill="#065f46"
                  radius={[6, 6, 0, 0]}
                  name="Personnel"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* 2. Duty Status Distribution (Pie / Donut Chart) */}
      <Card className="border-border/80 shadow-xs">
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base font-bold text-foreground">
              Duty Status Breakdown
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Active vs Reserve vs Retired
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="pt-4 flex flex-col items-center justify-center">
          <div className="h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={personnelByStatus}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="count"
                  nameKey="status"
                >
                  {personnelByStatus.map((entry) => (
                    <Cell
                      key={`cell-${entry.status}`}
                      fill={STATUS_COLORS[entry.status] || "#3b82f6"}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--card)",
                    borderColor: "var(--border)",
                    borderRadius: "0.75rem",
                    fontSize: "0.75rem",
                  }}
                  formatter={(value: any) => [`${value} personnel`, "Count"]}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  iconType="circle"
                  formatter={(value) => (
                    <span className="text-xs font-semibold text-foreground">{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* 3. Personnel by Battalion / Unit (Horizontal Bar Chart) */}
      <Card className="lg:col-span-3 border-border/80 shadow-xs">
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base font-bold text-foreground">
              Battalion & Unit Deployments
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Personnel distribution across Signal Regiment battalions and specialized units
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={formattedUnitData}
                layout="vertical"
                margin={{ top: 10, right: 20, left: 40, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} opacity={0.3} />
                <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11 }} />
                <YAxis
                  type="category"
                  dataKey="shortName"
                  tick={{ fontSize: 11 }}
                  width={110}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--card)",
                    borderColor: "var(--border)",
                    borderRadius: "0.75rem",
                    fontSize: "0.75rem",
                  }}
                  formatter={(value: any, name: any, item: any) => [
                    `${value} personnel`,
                    item.payload.unit,
                  ]}
                />
                <Bar
                  dataKey="count"
                  fill="#1d4ed8"
                  radius={[0, 6, 6, 0]}
                  name="Troop Count"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

    </div>
  );
}
