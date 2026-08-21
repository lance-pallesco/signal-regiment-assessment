import React from 'react';
import { NavLink } from 'react-router-dom';
import type { Personnel, PersonnelStatus } from '../../types';
import {
  Dialog,
  DialogContent,
  DialogFooter,
} from '../ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';

interface PersonnelDetailModalProps {
  personnel: Personnel | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const statusBadgeStyles: Record<PersonnelStatus, string> = {
  Active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Reserve: 'bg-amber-50 text-amber-700 border-amber-200',
  AWOL: 'bg-rose-50 text-rose-700 border-rose-200',
  Retired: 'bg-blue-50 text-blue-700 border-blue-200',
};

export default function PersonnelDetailModal({
  personnel,
  open,
  onOpenChange,
}: PersonnelDetailModalProps) {
  if (!personnel) return null;

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-white border-slate-200 p-0 overflow-hidden rounded-2xl shadow-2xl">
        {/* Header */}
        <div className="bg-[#064e3b] p-6 text-white relative">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 border-2 border-white/80 shadow-md bg-emerald-800 text-white shrink-0">
                {personnel.photo_url && (
                  <AvatarImage
                    src={personnel.photo_url}
                    alt={`${personnel.first_name} ${personnel.last_name}`}
                    className="h-full w-full object-cover object-center"
                  />
                )}
                <AvatarFallback className="text-lg font-bold text-white bg-emerald-900">
                  {getInitials(personnel.first_name, personnel.last_name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded bg-emerald-900/80 px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-emerald-200">
                    {personnel.rank}
                  </span>
                  <Badge
                    variant="outline"
                    className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border bg-white ${statusBadgeStyles[personnel.status]}`}
                  >
                    {personnel.status}
                  </Badge>
                </div>
                <h2 className="text-xl font-extrabold tracking-tight mt-1 text-white">
                  {personnel.first_name} {personnel.last_name}
                </h2>
                <p className="text-xs text-emerald-200/90 font-mono mt-0.5">
                  Serial No: {personnel.serial_number}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Military Assignment */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Military Assignment
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50/80 p-4 rounded-xl border border-slate-100">
              <div>
                <p className="text-xs text-slate-500 font-medium">Assigned Unit</p>
                <p className="text-sm font-semibold text-slate-900 mt-1">
                  {personnel.unit}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Position / Role</p>
                <p className="text-sm font-semibold text-slate-900 mt-1">
                  {personnel.position}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Date of Enlistment</p>
                <p className="text-sm font-semibold text-slate-900 mt-1">
                  {formatDate(personnel.date_of_enlistment)}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Service Rank</p>
                <p className="text-sm font-semibold text-slate-900 mt-1">
                  {personnel.rank}
                </p>
              </div>
            </div>
          </div>

          <Separator className="bg-slate-100" />

          {/* Personal Demographics */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Personal Demographics
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-slate-500 font-medium">Date of Birth</p>
                <p className="text-sm font-semibold text-slate-900 mt-1">
                  {formatDate(personnel.birthday)}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Gender</p>
                <p className="text-sm font-semibold text-slate-900 mt-1">
                  {personnel.gender}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Civil Status</p>
                <p className="text-sm font-semibold text-slate-900 mt-1">
                  {personnel.civil_status}
                </p>
              </div>
            </div>
          </div>

          <Separator className="bg-slate-100" />

          {/* Contact Information */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Contact Information
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-500 font-medium">Mobile Phone</p>
                  <p className="text-sm font-semibold text-slate-900 mt-1">
                    {personnel.phone}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Military Email</p>
                  <p className="text-sm font-semibold text-slate-900 mt-1">
                    {personnel.email || 'Not Provided'}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Station Address</p>
                <p className="text-sm font-normal text-slate-700 mt-1 leading-relaxed">
                  {personnel.address}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <DialogFooter className="border-t border-slate-100 p-4 bg-slate-50/80 flex items-center justify-between sm:justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="text-xs font-semibold border-slate-200 text-slate-700 hover:bg-white"
          >
            Close
          </Button>
          <NavLink to={`/personnel/${personnel.id}/edit`}>
            <Button className="bg-[#064e3b] hover:bg-[#065f46] text-white text-xs font-semibold px-4 rounded-lg">
              Edit Record
            </Button>
          </NavLink>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
