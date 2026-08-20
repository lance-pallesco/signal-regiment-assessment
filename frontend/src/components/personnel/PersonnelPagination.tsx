import React from 'react';
import type { PaginatedResponse, Personnel } from '../../types';
import { Button } from '../ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PersonnelPaginationProps {
  pagination: PaginatedResponse<Personnel> | null;
  onPageChange: (page: number) => void;
  onPerPageChange: (perPage: number) => void;
}

export default function PersonnelPagination({
  pagination,
  onPageChange,
  onPerPageChange,
}: PersonnelPaginationProps) {
  if (!pagination || pagination.total === 0) return null;

  const { current_page, last_page, total, per_page } = pagination;
  const from = (current_page - 1) * per_page + 1;
  const to = Math.min(current_page * per_page, total);

  // Generate page numbers
  const pages: number[] = [];
  const maxButtons = 5;
  let startPage = Math.max(1, current_page - 2);
  const endPage = Math.min(last_page, startPage + maxButtons - 1);

  if (endPage - startPage + 1 < maxButtons) {
    startPage = Math.max(1, endPage - maxButtons + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 px-2">
      {/* Left Details & Per Page Select */}
      <div className="flex items-center gap-3 text-xs text-slate-500">
        <span>
          Showing <span className="font-semibold text-slate-900">{from}</span> to{' '}
          <span className="font-semibold text-slate-900">{to}</span> of{' '}
          <span className="font-semibold text-slate-900">{total}</span> personnel
        </span>

        <div className="flex items-center gap-1.5 ml-2">
          <span className="hidden sm:inline text-slate-400">Rows per page:</span>
          <Select
            value={per_page.toString()}
            onValueChange={(val) => onPerPageChange(parseInt(val, 10))}
          >
            <SelectTrigger className="h-8 w-16 border-slate-200 bg-white text-xs font-semibold text-slate-700">
              <SelectValue placeholder="10" />
            </SelectTrigger>
            <SelectContent className="bg-white border-slate-200">
              <SelectItem value="10" className="text-xs">10</SelectItem>
              <SelectItem value="15" className="text-xs">15</SelectItem>
              <SelectItem value="25" className="text-xs">25</SelectItem>
              <SelectItem value="50" className="text-xs">50</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Right Pagination Buttons */}
      <div className="flex items-center gap-1">
        {/* Previous */}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onPageChange(current_page - 1)}
          disabled={current_page <= 1}
          className="h-8 px-2.5 text-xs font-medium border-slate-200 text-slate-700 disabled:opacity-40"
        >
          <ChevronLeft className="h-3.5 w-3.5 mr-1" />
          <span className="hidden sm:inline">Prev</span>
        </Button>

        {/* Page numbers */}
        {pages.map((p) => (
          <Button
            key={p}
            type="button"
            variant={p === current_page ? 'default' : 'outline'}
            size="sm"
            onClick={() => onPageChange(p)}
            className={`h-8 w-8 p-0 text-xs font-semibold ${
              p === current_page
                ? 'bg-[#064e3b] text-white hover:bg-[#065f46] border-[#064e3b]'
                : 'border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {p}
          </Button>
        ))}

        {/* Next */}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onPageChange(current_page + 1)}
          disabled={current_page >= last_page}
          className="h-8 px-2.5 text-xs font-medium border-slate-200 text-slate-700 disabled:opacity-40"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="h-3.5 w-3.5 ml-1" />
        </Button>
      </div>
    </div>
  );
}
