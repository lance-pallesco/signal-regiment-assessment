import { useState, useEffect, useCallback } from 'react';
import { personnelService } from '../services/personnelService';
import type { Personnel, PersonnelFilters, PaginatedResponse } from '../types';
import { toast } from 'sonner';

export function usePersonnel(initialFilters: PersonnelFilters = { per_page: 10, page: 1 }) {
  const [filters, setFilters] = useState<PersonnelFilters>(initialFilters);
  const [data, setData] = useState<PaginatedResponse<Personnel> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPersonnel, setSelectedPersonnel] = useState<Personnel | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Personnel | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchPersonnel = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await personnelService.list(filters);
      setData(response);
    } catch (error) {
      toast.error('Failed to load personnel', {
        description: 'Could not fetch records from server.',
      });
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchPersonnel();
  }, [fetchPersonnel]);

  const updateFilters = (newFilters: Partial<PersonnelFilters>) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
      page: newFilters.page !== undefined ? newFilters.page : 1, // reset to page 1 on filter change unless explicitly setting page
    }));
  };

  const resetFilters = () => {
    setFilters({
      search: '',
      status: '',
      rank: '',
      unit: '',
      page: 1,
      per_page: 10,
    });
  };

  const viewPersonnel = (personnel: Personnel) => {
    setSelectedPersonnel(personnel);
    setIsDetailOpen(true);
  };

  const confirmDelete = (personnel: Personnel) => {
    setDeleteTarget(personnel);
  };

  const executeDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await personnelService.delete(deleteTarget.id);
      toast.success('Personnel Deleted', {
        description: `Record for ${deleteTarget.first_name} ${deleteTarget.last_name} (${deleteTarget.serial_number}) removed.`,
      });
      setDeleteTarget(null);
      await fetchPersonnel();
    } catch (error) {
      toast.error('Delete Failed', {
        description: 'Unable to delete personnel record.',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    personnel: data?.data || [],
    pagination: data,
    isLoading,
    filters,
    updateFilters,
    resetFilters,
    refresh: fetchPersonnel,
    selectedPersonnel,
    isDetailOpen,
    setIsDetailOpen,
    viewPersonnel,
    deleteTarget,
    setDeleteTarget,
    confirmDelete,
    executeDelete,
    isDeleting,
  };
}
