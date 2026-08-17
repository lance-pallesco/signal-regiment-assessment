"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { AppNavbar } from "@/components/layout/AppNavbar";
import { DashboardMetrics } from "@/components/dashboard/DashboardMetrics";
import { PersonnelCharts } from "@/components/dashboard/PersonnelCharts";
import { PersonnelFormModal } from "@/components/personnel/PersonnelFormModal";
import { Button } from "@/components/ui/button";
import {
  UserPlus,
  Users,
  Radio,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";

export default function DashboardPage() {
  const [metrics, setMetrics] = useState({
    totalPersonnel: 0,
    activePersonnel: 0,
    reservePersonnel: 0,
    retiredPersonnel: 0,
    officersCount: 0,
    enlistedCount: 0,
    personnelByRank: [],
    personnelByStatus: [],
    personnelByUnit: [],
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const fetchMetrics = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/personnel/metrics");
      if (!res.ok) throw new Error("Failed to load dashboard metrics");
      const data = await res.json();
      setMetrics(data);
    } catch (err: any) {
      console.error(err);
      toast.error("Could not refresh dashboard statistics.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans">
      <AppNavbar />

      <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Top Header Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-emerald-900 via-emerald-800 to-slate-900 text-white rounded-2xl p-6 shadow-md ring-1 ring-emerald-700/50">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-amber-400">
                Philippine Army • Signal Regiment
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              Personnel Information Management System (PIMS)
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/80 leading-relaxed max-w-2xl">
              Regimental command and administrative oversight across battalions, specialized cyber & communications units, and reserve components.
            </p>
          </div>
        </div>

        {/* 1. Stat Cards Metrics */}
        <DashboardMetrics
          totalPersonnel={metrics.totalPersonnel}
          activePersonnel={metrics.activePersonnel}
          reservePersonnel={metrics.reservePersonnel}
          retiredPersonnel={metrics.retiredPersonnel}
          officersCount={metrics.officersCount}
          enlistedCount={metrics.enlistedCount}
        />

        {/* 2. Recharts Visualizations */}
        <PersonnelCharts
          personnelByRank={metrics.personnelByRank}
          personnelByStatus={metrics.personnelByStatus}
          personnelByUnit={metrics.personnelByUnit}
        />

      </main>

      <PersonnelFormModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        personnelToEdit={null}
        onSuccess={fetchMetrics}
      />
    </div>
  );
}
