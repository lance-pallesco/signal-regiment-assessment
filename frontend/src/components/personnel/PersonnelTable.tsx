import React from 'react';
import { NavLink } from 'react-router-dom';
import type { Personnel, PersonnelStatus } from '../../types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { Eye, Edit3, Trash2, ShieldAlert } from 'lucide-react';

interface PersonnelTableProps {
  personnel: Personnel[];
  isLoading: boolean;
  onView: (personnel: Personnel) => void;
  onDelete: (personnel: Personnel) => void;
}

const statusBadgeStyles: Record<PersonnelStatus, string> = {
  Active: 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100',
  Reserve: 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100',
  AWOL: 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100',
  Retired: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100',
};

export default function PersonnelTable({
  personnel,
  isLoading,
  onView,
  onDelete,
}: PersonnelTableProps) {
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="rounded-xl border border-slate-200/90 bg-white shadow-sm overflow-hidden">
      {/* Table Header Details */}
      <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight">
            Personnel Records
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Active military and signal regiment service roster
          </p>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-slate-50/60">
            <TableRow className="hover:bg-transparent border-slate-100">
              <TableHead className="w-[140px] text-[11px] font-bold text-slate-500 uppercase tracking-wider pl-6">
                Serial No.
              </TableHead>
              <TableHead className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Personnel
              </TableHead>
              <TableHead className="w-[100px] text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Rank
              </TableHead>
              <TableHead className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Unit & Role
              </TableHead>
              <TableHead className="w-[120px] text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Status
              </TableHead>
              <TableHead className="w-[120px] text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Enlisted Date
              </TableHead>
              <TableHead className="w-[120px] text-right text-[11px] font-bold text-slate-500 uppercase tracking-wider pr-6">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              // Loading Skeleton
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index} className="border-slate-100">
                  <TableCell className="pl-6">
                    <div className="h-4 w-24 animate-pulse rounded bg-slate-200" />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 animate-pulse rounded-full bg-slate-200" />
                      <div className="space-y-1">
                        <div className="h-4 w-32 animate-pulse rounded bg-slate-200" />
                        <div className="h-3 w-20 animate-pulse rounded bg-slate-100" />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="h-5 w-12 animate-pulse rounded bg-slate-200" />
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="h-4 w-36 animate-pulse rounded bg-slate-200" />
                      <div className="h-3 w-28 animate-pulse rounded bg-slate-100" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="h-6 w-16 animate-pulse rounded-full bg-slate-200" />
                  </TableCell>
                  <TableCell>
                    <div className="h-4 w-20 animate-pulse rounded bg-slate-200" />
                  </TableCell>
                  <TableCell className="pr-6">
                    <div className="flex justify-end gap-1.5">
                      <div className="h-8 w-8 animate-pulse rounded bg-slate-200" />
                      <div className="h-8 w-8 animate-pulse rounded bg-slate-200" />
                      <div className="h-8 w-8 animate-pulse rounded bg-slate-200" />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : personnel.length === 0 ? (
              // Empty State
              <TableRow>
                <TableCell colSpan={7} className="h-64 text-center">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <ShieldAlert className="h-10 w-10 text-slate-300" />
                    <p className="text-sm font-semibold text-slate-700">No personnel records found</p>
                    <p className="text-xs text-slate-400 max-w-sm">
                      Try adjusting your search query, status, or rank filter options.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              // Personnel Rows
              personnel.map((person) => (
                <TableRow key={person.id} className="border-slate-100 hover:bg-slate-50/60 transition-colors">
                  {/* Serial Number */}
                  <TableCell className="pl-6 font-mono text-xs font-semibold text-slate-700">
                    {person.serial_number}
                  </TableCell>

                  {/* Personnel Info */}
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9 border border-slate-200 bg-emerald-50">
                        {person.photo_url && <AvatarImage src={person.photo_url} alt={person.first_name} />}
                        <AvatarFallback className="text-xs font-bold text-emerald-800">
                          {getInitials(person.first_name, person.last_name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-semibold text-slate-900 text-sm">
                          {person.first_name} {person.last_name}
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono">
                          {person.phone} {person.email ? `• ${person.email}` : ''}
                        </div>
                      </div>
                    </div>
                  </TableCell>

                  {/* Rank */}
                  <TableCell>
                    <Badge variant="outline" className="font-bold text-xs bg-slate-100/80 text-slate-800 border-slate-200">
                      {person.rank}
                    </Badge>
                  </TableCell>

                  {/* Unit & Position */}
                  <TableCell>
                    <div className="text-sm font-medium text-slate-800">{person.position}</div>
                    <div className="text-[11px] text-slate-500">{person.unit}</div>
                  </TableCell>

                  {/* Status */}
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${statusBadgeStyles[person.status]}`}
                    >
                      {person.status}
                    </Badge>
                  </TableCell>

                  {/* Enlisted Date */}
                  <TableCell className="text-xs text-slate-600 font-medium">
                    {formatDate(person.date_of_enlistment)}
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="pr-6 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {/* View Details */}
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => onView(person)}
                        className="h-8 w-8 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50"
                        title="View Full Record"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>

                      {/* Edit Record */}
                      <NavLink to={`/personnel/${person.id}/edit`}>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-slate-500 hover:text-blue-700 hover:bg-blue-50"
                          title="Edit Record"
                        >
                          <Edit3 className="h-4 w-4" />
                        </Button>
                      </NavLink>

                      {/* Delete Record */}
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(person)}
                        className="h-8 w-8 text-slate-500 hover:text-rose-700 hover:bg-rose-50"
                        title="Delete Personnel"
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
    </div>
  );
}
