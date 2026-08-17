"use client";

import React from "react";
import { Search, RotateCcw, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SIGNAL_UNITS, MILITARY_RANKS, DUTY_STATUSES } from "@/lib/validations/personnel";

export interface PersonnelFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  unit: string;
  onUnitChange: (value: string) => void;
  rank: string;
  onRankChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
  onReset: () => void;
}

export function PersonnelFilters({
  search,
  onSearchChange,
  unit,
  onUnitChange,
  rank,
  onRankChange,
  status,
  onStatusChange,
  onReset,
}: PersonnelFiltersProps) {
  const isFiltered = search !== "" || unit !== "ALL" || rank !== "ALL" || status !== "ALL";

  return (
    <div className="bg-card p-4 rounded-xl border border-border/80 shadow-xs space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        
        {/* Search by Name or AFPSN */}
        <div className="relative lg:col-span-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            type="text"
            placeholder="Search by Full Name or AFPSN..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 h-9 text-xs sm:text-sm bg-muted/30 focus-visible:bg-background border-border"
          />
        </div>

        {/* Unit Filter */}
        <div>
          <Select value={unit} onValueChange={onUnitChange}>
            <SelectTrigger className="h-9 text-xs sm:text-sm bg-muted/30 border-border">
              <SelectValue placeholder="All Units / Battalions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Units / Battalions</SelectItem>
              {SIGNAL_UNITS.map((u) => (
                <SelectItem key={u} value={u} className="text-xs">
                  {u}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Rank Filter */}
        <div>
          <Select value={rank} onValueChange={onRankChange}>
            <SelectTrigger className="h-9 text-xs sm:text-sm bg-muted/30 border-border">
              <SelectValue placeholder="All Ranks" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Ranks</SelectItem>
              {MILITARY_RANKS.map((r) => (
                <SelectItem key={r} value={r} className="text-xs">
                  {r}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Status Filter & Reset */}
        <div className="flex items-center gap-2">
          <Select value={status} onValueChange={onStatusChange}>
            <SelectTrigger className="h-9 text-xs sm:text-sm bg-muted/30 border-border flex-1">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Statuses</SelectItem>
              {DUTY_STATUSES.map((s) => (
                <SelectItem key={s} value={s} className="text-xs">
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {isFiltered && (
            <Button
              variant="outline"
              size="sm"
              onClick={onReset}
              className="h-9 px-2.5 text-xs text-muted-foreground hover:text-foreground cursor-pointer shadow-xs shrink-0"
              title="Reset Filters"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>

      </div>
    </div>
  );
}
