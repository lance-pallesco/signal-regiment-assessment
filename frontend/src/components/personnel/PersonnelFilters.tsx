import React from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import type { PersonnelFilters as FilterType, Rank, PersonnelStatus } from '../../types';
import { Search, RotateCcw } from 'lucide-react';

interface PersonnelFiltersProps {
  filters: FilterType;
  onFilterChange: (newFilters: Partial<FilterType>) => void;
  onReset: () => void;
}

const RANKS: Rank[] = [
  'PVT', 'PFC', 'CPL', 'SGT', 'SSG', 'SFC', 'MSG', 'SGM',
  '2LT', '1LT', 'CPT', 'MAJ', 'LTC', 'COL', 'BG', 'MG',
];

const STATUSES: PersonnelStatus[] = ['Active', 'Reserve', 'AWOL', 'Retired'];

const UNITS = [
  'Signal Company Alpha',
  'Signal Company Bravo',
  'Signal Company Charlie',
  'Signal Battalion HQ',
  '1st Signal Brigade',
  'Cyber Defense Squadron',
  'Electronic Warfare Battalion',
  'Satellite Communications Unit',
];

export default function PersonnelFilters({
  filters,
  onFilterChange,
  onReset,
}: PersonnelFiltersProps) {
  return (
    <div className="rounded-xl border border-slate-200/90 bg-white p-3 sm:p-4 shadow-sm mb-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            type="text"
            placeholder="Search by name or serial number (e.g. SIG-2018, Santos)..."
            value={filters.search || ''}
            onChange={(e) => onFilterChange({ search: e.target.value })}
            className="h-10 w-full rounded-lg border-slate-200 bg-slate-50/50 pl-10 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:border-emerald-600 focus-visible:ring-emerald-600/20"
          />
        </div>

        {/* Dropdowns Group */}
        <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center sm:gap-2.5">
          {/* Status Select */}
          <Select
            value={filters.status || 'ALL'}
            onValueChange={(val) => onFilterChange({ status: val === 'ALL' ? '' : (val as PersonnelStatus) })}
          >
            <SelectTrigger className="h-10 w-full sm:w-[140px] rounded-lg border-slate-200 bg-white text-xs font-medium text-slate-700">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent className="bg-white border-slate-200">
              <SelectItem value="ALL" className="text-xs font-medium">All Statuses</SelectItem>
              {STATUSES.map((status) => (
                <SelectItem key={status} value={status} className="text-xs font-medium">
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Rank Select */}
          <Select
            value={filters.rank || 'ALL'}
            onValueChange={(val) => onFilterChange({ rank: val === 'ALL' ? '' : (val as Rank) })}
          >
            <SelectTrigger className="h-10 w-full sm:w-[130px] rounded-lg border-slate-200 bg-white text-xs font-medium text-slate-700">
              <SelectValue placeholder="All Ranks" />
            </SelectTrigger>
            <SelectContent className="bg-white border-slate-200">
              <SelectItem value="ALL" className="text-xs font-medium">All Ranks</SelectItem>
              {RANKS.map((rank) => (
                <SelectItem key={rank} value={rank} className="text-xs font-medium">
                  {rank}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Unit Select */}
          <Select
            value={filters.unit || 'ALL'}
            onValueChange={(val) => onFilterChange({ unit: val === 'ALL' ? '' : val })}
          >
            <SelectTrigger className="h-10 w-full sm:w-[180px] rounded-lg border-slate-200 bg-white text-xs font-medium text-slate-700 truncate">
              <SelectValue placeholder="All Units" />
            </SelectTrigger>
            <SelectContent className="bg-white border-slate-200">
              <SelectItem value="ALL" className="text-xs font-medium">All Units</SelectItem>
              {UNITS.map((unit) => (
                <SelectItem key={unit} value={unit} className="text-xs font-medium">
                  {unit}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Reset Filters Button */}
          <Button
            type="button"
            variant="ghost"
            onClick={onReset}
            className="h-10 px-3 text-xs font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 gap-1.5"
            title="Reset Filters"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
