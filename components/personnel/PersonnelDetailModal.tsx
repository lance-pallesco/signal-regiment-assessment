"use client";

import React from "react";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Personnel } from "./PersonnelTable";
import { getInitials } from "@/lib/validations/personnel";

export interface PersonnelDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  personnel: Personnel | null;
  onEdit: (person: Personnel) => void;
}

export function PersonnelDetailModal({
  open,
  onOpenChange,
  personnel,
  onEdit,
}: PersonnelDetailModalProps) {
  if (!personnel) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl p-6">
        <DialogHeader className="pb-3 border-b border-border">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              {personnel.photo ? (
                <img
                  src={personnel.photo}
                  alt={personnel.fullName}
                  className="h-10 w-10 rounded-full object-cover ring-1.5 ring-emerald-600 shrink-0 shadow-xs"
                />
              ) : (
                <div className="h-10 w-10 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 font-bold text-xs flex items-center justify-center ring-1.5 ring-emerald-600/30 shrink-0 shadow-xs">
                  {getInitials(personnel.fullName)}
                </div>
              )}
              <div className="space-y-0.5">
                <DialogTitle className="text-lg font-black text-foreground">
                  {personnel.fullName}
                </DialogTitle>
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-bold text-foreground">
                    {personnel.rank}
                  </span>
                  <span className="text-muted-foreground">•</span>
                  <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">
                    SN: {personnel.serialNumber}
                  </span>
                  <span className="text-muted-foreground">•</span>
                  <span className="text-muted-foreground">{personnel.rankCategory}</span>
                </div>
              </div>
            </div>

            <Badge
              className={
                personnel.status === "Active"
                  ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30"
                  : personnel.status === "Reserve"
                  ? "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30"
                  : "bg-slate-500/15 text-slate-700 dark:text-slate-400 border-slate-500/30"
              }
            >
              {personnel.status}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-2 text-xs">
          
          {/* Unit & Assignment Box */}
          <div className="rounded-xl bg-muted/40 p-3.5 border border-border/80 space-y-2">
            <h4 className="font-bold text-foreground uppercase tracking-wider text-[11px]">
              Current Unit Assignment & Designation
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-muted-foreground">Battalion/Unit:</span>
                <p className="font-bold text-foreground">{personnel.unit}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Designation/Role:</span>
                <p className="font-bold text-foreground">{personnel.position}</p>
              </div>
            </div>
          </div>

          {/* Service & Personal Info Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2.5 rounded-xl border border-border/70 p-3">
              <h5 className="font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider text-[11px]">
                Service Timeline
              </h5>
              
              <div className="space-y-2">
                <div>
                  <span className="text-muted-foreground text-[10px]">Date of Enlistment</span>
                  <p className="font-semibold text-foreground">
                    {personnel.dateOfEnlistment
                      ? format(new Date(personnel.dateOfEnlistment), "MMMM dd, yyyy")
                      : "N/A"}
                  </p>
                </div>

                <div>
                  <span className="text-muted-foreground text-[10px]">Birthday & Gender</span>
                  <p className="font-semibold text-foreground">
                    {personnel.birthday
                      ? format(new Date(personnel.birthday), "MMM dd, yyyy")
                      : "N/A"}{" "}
                    ({personnel.gender})
                  </p>
                </div>

                <div>
                  <span className="text-muted-foreground text-[10px]">Civil Status</span>
                  <p className="font-semibold text-foreground">{personnel.civilStatus}</p>
                </div>
              </div>
            </div>

            <div className="space-y-2.5 rounded-xl border border-border/70 p-3">
              <h5 className="font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider text-[11px]">
                Contact & Residence
              </h5>
              
              <div className="space-y-2">
                <div>
                  <span className="text-muted-foreground text-[10px]">Contact Phone</span>
                  <p className="font-semibold text-foreground">{personnel.phone}</p>
                </div>

                <div>
                  <span className="text-muted-foreground text-[10px]">Official Email</span>
                  <p className="font-semibold text-foreground truncate">
                    {personnel.email}
                  </p>
                </div>

                <div>
                  <span className="text-muted-foreground text-[10px]">Address</span>
                  <p className="font-semibold text-foreground leading-tight">
                    {personnel.address}
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>

        <DialogFooter className="pt-2 border-t border-border flex items-center justify-between">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="cursor-pointer"
          >
            Close
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={() => {
              onOpenChange(false);
              onEdit(personnel);
            }}
            className="bg-emerald-800 hover:bg-emerald-900 text-white font-bold cursor-pointer"
          >
            Edit Record
          </Button>
        </DialogFooter>

      </DialogContent>
    </Dialog>
  );
}
