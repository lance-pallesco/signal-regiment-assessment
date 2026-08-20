import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { usePersonnel } from '../hooks/usePersonnel';
import { dashboardService } from '../services/dashboardService';
import type { DashboardMetrics } from '../types';
import PersonnelMetricCards from '../components/personnel/PersonnelMetricCards';
import PersonnelFilters from '../components/personnel/PersonnelFilters';
import PersonnelTable from '../components/personnel/PersonnelTable';
import PersonnelPagination from '../components/personnel/PersonnelPagination';
import PersonnelDetailModal from '../components/personnel/PersonnelDetailModal';
import { Button } from '../components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../components/ui/alert-dialog';
import { UserPlus, Users, Loader2 } from 'lucide-react';

export default function PersonnelListPage() {
  const {
    personnel,
    pagination,
    isLoading,
    filters,
    updateFilters,
    resetFilters,
    selectedPersonnel,
    isDetailOpen,
    setIsDetailOpen,
    viewPersonnel,
    deleteTarget,
    setDeleteTarget,
    confirmDelete,
    executeDelete,
    isDeleting,
  } = usePersonnel({ per_page: 10, page: 1 });

  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [metricsLoading, setMetricsLoading] = useState(true);

  useEffect(() => {
    const loadMetrics = async () => {
      try {
        const res = await dashboardService.getMetrics();
        setMetrics(res);
      } catch {
        // Ignore metrics error
      } finally {
        setMetricsLoading(false);
      }
    };
    loadMetrics();
  }, [personnel]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800">
              <Users className="h-4 w-4" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Personnel Directory
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Military service records, communication specialists, and regimental assignments
          </p>
        </div>

        <NavLink to="/personnel/create">
          <Button className="bg-[#064e3b] hover:bg-[#065f46] text-white font-semibold text-xs h-10 px-4 rounded-xl shadow-sm gap-2 w-full sm:w-auto">
            <UserPlus className="h-4 w-4" />
            <span>Enlist Personnel</span>
          </Button>
        </NavLink>
      </div>

      {/* Summary Stat Metric Cards */}
      <PersonnelMetricCards metrics={metrics} isLoading={metricsLoading} />

      {/* Filter & Search Bar */}
      <PersonnelFilters
        filters={filters}
        onFilterChange={updateFilters}
        onReset={resetFilters}
      />

      {/* Data Table */}
      <PersonnelTable
        personnel={personnel}
        isLoading={isLoading}
        onView={viewPersonnel}
        onDelete={confirmDelete}
      />

      {/* Pagination Footer */}
      <PersonnelPagination
        pagination={pagination}
        onPageChange={(page) => updateFilters({ page })}
        onPerPageChange={(per_page) => updateFilters({ per_page, page: 1 })}
      />

      {/* Full Military Dossier Modal */}
      <PersonnelDetailModal
        personnel={selectedPersonnel}
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
      />

      {/* Delete Confirmation Alert Dialog */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
      >
        <AlertDialogContent className="bg-white border-slate-200 rounded-2xl max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg font-bold text-slate-900">
              Confirm Personnel Discharge / Deletion
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-slate-500 leading-relaxed">
              Are you sure you want to permanently delete the military record for{' '}
              <span className="font-semibold text-slate-800">
                {deleteTarget?.rank} {deleteTarget?.first_name} {deleteTarget?.last_name}
              </span>{' '}
              (Serial No:{' '}
              <span className="font-mono font-semibold text-slate-700">
                {deleteTarget?.serial_number}
              </span>
              )? This action is irreversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 mt-4">
            <AlertDialogCancel
              disabled={isDeleting}
              className="text-xs border-slate-200 text-slate-700"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                executeDelete();
              }}
              disabled={isDeleting}
              className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Confirm Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
