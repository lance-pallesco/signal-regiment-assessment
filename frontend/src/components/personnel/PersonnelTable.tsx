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
import { Eye, Edit3, Trash2, ShieldAlert, Calendar } from 'lucide-react';

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
    <div className="rounded-2xl border border-slate-200/90 bg-white shadow-sm overflow-hidden">
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
          <TableHeader className="bg-slate-50/70">
            <TableRow className="hover:bg-transparent border-slate-100">
              <TableHead className="w-[140px] text-[11px] font-bold text-slate-500 uppercase tracking-wider pl-6">
                Serial No.
              </TableHead>
              <TableHead className="text-[11px] font-bold text-slate-500 uppercase tracking-wider min-w-[220px]">
                Personnel
              </TableHead>
              <TableHead className="w-[100px] text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Rank
              </TableHead>
              <TableHead className="text-[11px] font-bold text-slate-500 uppercase tracking-wider min-w-[180px]">
                Unit & Role
              </TableHead>
              <TableHead className="w-[120px] text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Status
              </TableHead>
              <TableHead className="w-[140px] text-[11px] font-bold text-slate-500 uppercase tracking-wider">
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
                  <TableCell className="pl-6 py-4">
                    <div className="h-4 w-24 animate-pulse rounded bg-slate-200" />
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 animate-pulse rounded-full bg-slate-200" />
                      <div className="space-y-1.5">
                        <div className="h-4 w-32 animate-pulse rounded bg-slate-200" />
                        <div className="h-3 w-24 animate-pulse rounded bg-slate-100" />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="h-5 w-12 animate-pulse rounded bg-slate-200" />
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="space-y-1.5">
                      <div className="h-4 w-36 animate-pulse rounded bg-slate-200" />
                      <div className="h-3 w-28 animate-pulse rounded bg-slate-100" />
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="h-6 w-16 animate-pulse rounded-full bg-slate-200" />
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="h-4 w-20 animate-pulse rounded bg-slate-200" />
                  </TableCell>
                  <TableCell className="pr-6 py-4">
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
                <TableRow key={person.id} className="border-slate-100 hover:bg-slate-50/70 transition-colors">
                  {/* Serial Number */}
                  <TableCell className="pl-6 py-3.5 font-mono text-xs font-bold text-slate-700">
                    {person.serial_number}
                  </TableCell>

                  {/* Personnel Info */}
                  <TableCell className="py-3.5">
                    <div className="flex items-center gap-3.5">
                      <Avatar className="h-10 w-10 shrink-0 border border-slate-200 shadow-xs bg-emerald-50">
                        {person.photo_url && (
                          <AvatarImage
                            src={person.photo_url}
                            alt={`${person.first_name} ${person.last_name}`}
                            className="h-full w-full object-cover object-center"
                          />
                        )}
                        <AvatarFallback className="text-xs font-bold text-emerald-800 bg-emerald-100">
                          {getInitials(person.first_name, person.last_name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <div className="font-bold text-slate-900 text-sm tracking-tight truncate">
                          {person.first_name} {person.last_name}
                        </div>
                        <div className="text-xs text-slate-500 font-normal truncate mt-0.5">
                          {person.email || person.phone}
                        </div>
                      </div>
                    </div>
                  </TableCell>

                  {/* Rank */}
                  <TableCell className="py-3.5">
                    <Badge variant="outline" className="font-bold text-xs bg-slate-100/90 text-slate-800 border-slate-200">
                      {person.rank}
                    </Badge>
                  </TableCell>

                  {/* Unit & Position */}
                  <TableCell className="py-3.5">
                    <div className="text-sm font-semibold text-slate-800 leading-snug">{person.position}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{person.unit}</div>
                  </TableCell>

                  {/* Status */}
                  <TableCell className="py-3.5">
                    <Badge
                      variant="outline"
                      className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${statusBadgeStyles[person.status]}`}
                    >
                      {person.status}
                    </Badge>
                  </TableCell>

                  {/* Enlisted Date */}
                  <TableCell className="py-3.5 text-xs text-slate-600 font-medium">
                    <span className="inline-flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-slate-400" />
                      {formatDate(person.date_of_enlistment)}
                    </span>
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="pr-6 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {/* View Details */}
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => onView(person)}
                        className="h-8 w-8 rounded-lg text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
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
                          className="h-8 w-8 rounded-lg text-slate-500 hover:text-blue-700 hover:bg-blue-50 transition-colors"
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
                        className="h-8 w-8 rounded-lg text-slate-500 hover:text-rose-700 hover:bg-rose-50 transition-colors"
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
