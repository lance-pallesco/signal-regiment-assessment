"use client";

import React from "react";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  Pencil,
  Trash2,
  Shield,
  Medal,
  Users,
} from "lucide-react";
import { getInitials } from "@/lib/validations/personnel";

export interface Personnel {
  id: number;
  fullName: string;
  serialNumber: string;
  rank: string;
  rankCategory: string;
  birthday: string | Date;
  gender: string;
  civilStatus: string;
  phone: string;
  email: string;
  address: string;
  unit: string;
  position: string;
  dateOfEnlistment: string | Date;
  status: string;
  photo?: string | null;
}

export interface PersonnelTableProps {
  personnel: Personnel[];
  total: number;
  page: number;
  totalPages: number;
  limit: number;
  isLoading: boolean;
  onPageChange: (newPage: number) => void;
  onLimitChange: (newLimit: number) => void;
  onView: (person: Personnel) => void;
  onEdit: (person: Personnel) => void;
  onDelete: (person: Personnel) => void;
}

export function PersonnelTable({
  personnel,
  total,
  page,
  totalPages,
  limit,
  isLoading,
  onPageChange,
  onLimitChange,
  onView,
  onEdit,
  onDelete,
}: PersonnelTableProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Active":
        return (
          <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20 text-[11px] font-semibold">
            Active
          </Badge>
        );
      case "Reserve":
        return (
          <Badge className="bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30 hover:bg-amber-500/20 text-[11px] font-semibold">
            Reserve
          </Badge>
        );
      case "Retired":
        return (
          <Badge className="bg-slate-500/15 text-slate-700 dark:text-slate-400 border-slate-500/30 hover:bg-slate-500/20 text-[11px] font-semibold">
            Retired
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getRankBadge = (rank: string, category: string) => {
    const isOfficer = category === "Officer";
    return (
      <div className="flex items-center gap-1.5">
        <div
          className={`flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold shrink-0 ${isOfficer
            ? "bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 ring-1 ring-amber-400/40"
            : "bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 ring-1 ring-emerald-600/30"
            }`}
        >
          {isOfficer ? <Medal className="h-3.5 w-3.5" /> : <Shield className="h-3.5 w-3.5" />}
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-bold text-foreground leading-tight">{rank}</span>
          <span className="text-[10px] text-muted-foreground font-medium">{category}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="rounded-2xl border border-border/80 bg-card shadow-xs overflow-hidden">

      {/* Table Container */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-muted/40 border-b border-border">
            <TableRow>
              <TableHead className="text-xs font-bold">Personnel</TableHead>
              <TableHead className="text-xs font-bold">Unit</TableHead>
              <TableHead className="text-xs font-bold">Designation</TableHead>
              <TableHead className="text-xs font-bold">Date Enlisted</TableHead>
              <TableHead className="text-xs font-bold text-center">Status</TableHead>
              <TableHead className="text-xs font-bold text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              Array.from({ length: limit > 10 ? 10 : limit }).map((_, index) => (
                <TableRow key={`skeleton-${index}`}>
                  <TableCell colSpan={7} className="h-14 animate-pulse bg-muted/20" />
                </TableRow>
              ))
            ) : personnel.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                  <div className="flex flex-col items-center justify-center space-y-1.5">
                    <Users className="h-8 w-8 text-muted-foreground/50" />
                    <p className="text-sm font-semibold">No personnel records found</p>
                    <p className="text-xs text-muted-foreground">
                      Try adjusting your search keywords or filter criteria.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              personnel.map((person) => (
                <TableRow key={person.id} className="hover:bg-muted/30 transition-colors">

                  {/* Personnel: Photo / Initials + Name + Serial Number */}
                  <TableCell className="py-3">
                    <div className="flex items-center gap-3">
                      {person.photo ? (
                        <img
                          src={person.photo}
                          alt={person.fullName}
                          className="h-7.5 w-7.5 sm:h-8 sm:w-8 rounded-full object-cover ring-1 ring-border shrink-0"
                        />
                      ) : (
                        <div className="h-7.5 w-7.5 sm:h-8 sm:w-8 rounded-full text-emerald-900 dark:text-emerald-300 font-bold text-[10px] sm:text-[11px] flex items-center justify-center ring-1 ring-emerald-600/30 shrink-0 select-none shadow-2xs">
                          {getInitials(person.fullName)}
                        </div>
                      )}
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs sm:text-sm font-bold text-foreground truncate">
                          {person.fullName}
                        </span>
                        <span className="text-[11px] font-mono text-muted-foreground">
                          SN: <span className="font-semibold text-emerald-700 dark:text-emerald-400">{person.serialNumber}</span>
                        </span>
                      </div>
                    </div>
                  </TableCell>

                  {/* Unit / Battalion */}
                  <TableCell className="py-3">
                    <span className="text-xs font-medium text-foreground">
                      {person.unit}
                    </span>
                  </TableCell>

                  {/* Designation */}
                  <TableCell className="py-3">
                    <span className="text-xs text-muted-foreground font-medium">
                      {person.position}
                    </span>
                  </TableCell>

                  {/* Date of Enlistment */}
                  <TableCell className="py-3">
                    <span className="text-xs text-muted-foreground">
                      {person.dateOfEnlistment
                        ? format(new Date(person.dateOfEnlistment), "MMM dd, yyyy")
                        : "N/A"}
                    </span>
                  </TableCell>

                  {/* Duty Status */}
                  <TableCell className="py-3 text-center">
                    {getStatusBadge(person.status)}
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onView(person)}
                        title="View Dossier"
                        className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(person)}
                        title="Edit Record"
                        className="h-8 w-8 text-muted-foreground hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 cursor-pointer"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(person)}
                        title="Delete Record"
                        className="h-8 w-8 text-muted-foreground hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>

                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination & Summary Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-border bg-muted/20 text-xs text-muted-foreground">

        {/* Total & Page indicator */}
        <div className="flex items-center gap-4">
          <span>
            Showing <strong className="text-foreground">{personnel.length}</strong> of{" "}
            <strong className="text-foreground">{total}</strong> personnel records
          </span>

          {/* Rows per page selector */}
          <div className="flex items-center gap-1.5">
            <span>Rows:</span>
            <select
              value={limit}
              onChange={(e) => onLimitChange(Number(e.target.value))}
              className="rounded-md border border-border bg-background px-2 py-1 text-xs font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-emerald-600"
            >
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={25}>25</option>
            </select>
          </div>
        </div>

        {/* Page navigation controls */}
        <div className="flex items-center gap-1.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1 || isLoading}
            className="h-8 px-2 text-xs gap-1 cursor-pointer"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Previous</span>
          </Button>

          <span className="px-2 text-xs font-bold text-foreground">
            Page {page} of {totalPages}
          </span>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages || isLoading}
            className="h-8 px-2 text-xs gap-1 cursor-pointer"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </Button>
        </div>

      </div>
    </div>
  );
}
