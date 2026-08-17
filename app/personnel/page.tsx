"use client";

import React, { useState, useEffect, useCallback } from "react";
import { AppNavbar } from "@/components/layout/AppNavbar";
import { PersonnelFilters } from "@/components/personnel/PersonnelFilters";
import { PersonnelTable, Personnel } from "@/components/personnel/PersonnelTable";
import { PersonnelFormModal } from "@/components/personnel/PersonnelFormModal";
import { PersonnelDetailModal } from "@/components/personnel/PersonnelDetailModal";
import { DeletePersonnelModal } from "@/components/personnel/DeletePersonnelModal";
import { Button } from "@/components/ui/button";
import { UserPlus, Users } from "lucide-react";
import { toast } from "sonner";

export default function PersonnelPage() {
  const [personnel, setPersonnel] = useState<Personnel[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [unitFilter, setUnitFilter] = useState("ALL");
  const [rankFilter, setRankFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Modals state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [personnelToEdit, setPersonnelToEdit] = useState<Personnel | null>(null);

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [personnelToView, setPersonnelToView] = useState<Personnel | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [personnelToDelete, setPersonnelToDelete] = useState<Personnel | null>(null);

  const fetchPersonnel = useCallback(async () => {
    setIsLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (search.trim()) queryParams.set("search", search.trim());
      if (unitFilter !== "ALL") queryParams.set("unit", unitFilter);
      if (rankFilter !== "ALL") queryParams.set("rank", rankFilter);
      if (statusFilter !== "ALL") queryParams.set("status", statusFilter);
      queryParams.set("page", page.toString());
      queryParams.set("limit", limit.toString());

      const res = await fetch(`/api/personnel?${queryParams.toString()}`);
      if (!res.ok) throw new Error("Failed to load personnel records");
      const data = await res.json();

      setPersonnel(data.data || []);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 1);
    } catch (err: any) {
      console.error(err);
      toast.error("Could not load personnel records.");
    } finally {
      setIsLoading(false);
    }
  }, [search, unitFilter, rankFilter, statusFilter, page, limit]);

  useEffect(() => {
    fetchPersonnel();
  }, [fetchPersonnel]);

  // Handlers
  const handleOpenCreateModal = () => {
    setPersonnelToEdit(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (person: Personnel) => {
    setPersonnelToEdit(person);
    setIsFormModalOpen(true);
  };

  const handleOpenViewModal = (person: Personnel) => {
    setPersonnelToView(person);
    setIsDetailModalOpen(true);
  };

  const handleOpenDeleteModal = (person: Personnel) => {
    setPersonnelToDelete(person);
    setIsDeleteModalOpen(true);
  };

  const handleResetFilters = () => {
    setSearch("");
    setUnitFilter("ALL");
    setRankFilter("ALL");
    setStatusFilter("ALL");
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans">
      <AppNavbar />

      <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Header Title Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-800 text-white shadow-xs">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-foreground">
                Personnel Directory
              </h1>
              <p className="text-xs text-muted-foreground">
                Records Management
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={handleOpenCreateModal}
              className="bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs gap-1.5 shadow-xs cursor-pointer"
            >
              <UserPlus className="h-4 w-4" />
              <span>Enlist Personnel</span>
            </Button>
          </div>
        </div>

        {/* Search & Multi-Filters */}
        <PersonnelFilters
          search={search}
          onSearchChange={(val) => {
            setSearch(val);
            setPage(1);
          }}
          unit={unitFilter}
          onUnitChange={(val) => {
            setUnitFilter(val);
            setPage(1);
          }}
          rank={rankFilter}
          onRankChange={(val) => {
            setRankFilter(val);
            setPage(1);
          }}
          status={statusFilter}
          onStatusChange={(val) => {
            setStatusFilter(val);
            setPage(1);
          }}
          onReset={handleResetFilters}
        />

        {/* Personnel Table with Pagination */}
        <PersonnelTable
          personnel={personnel}
          total={total}
          page={page}
          totalPages={totalPages}
          limit={limit}
          isLoading={isLoading}
          onPageChange={handlePageChange}
          onLimitChange={handleLimitChange}
          onView={handleOpenViewModal}
          onEdit={handleOpenEditModal}
          onDelete={handleOpenDeleteModal}
        />

      </main>

      {/* Modals */}
      <PersonnelFormModal
        open={isFormModalOpen}
        onOpenChange={setIsFormModalOpen}
        personnelToEdit={personnelToEdit}
        onSuccess={fetchPersonnel}
      />

      <PersonnelDetailModal
        open={isDetailModalOpen}
        onOpenChange={setIsDetailModalOpen}
        personnel={personnelToView}
        onEdit={(person) => {
          setPersonnelToEdit(person);
          setIsFormModalOpen(true);
        }}
      />

      <DeletePersonnelModal
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        personnel={personnelToDelete}
        onSuccess={fetchPersonnel}
      />
    </div>
  );
}
