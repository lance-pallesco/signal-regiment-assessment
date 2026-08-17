"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Personnel } from "./PersonnelTable";
import { toast } from "sonner";

export interface DeletePersonnelModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  personnel: Personnel | null;
  onSuccess: () => void;
}

export function DeletePersonnelModal({
  open,
  onOpenChange,
  personnel,
  onSuccess,
}: DeletePersonnelModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!personnel) return null;

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/personnel/${personnel.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete record");
      }

      toast.success(
        `Personnel record for ${personnel.fullName} has been removed.`
      );
      onSuccess();
      onOpenChange(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to delete personnel record.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-6">
        <DialogHeader className="space-y-1.5 text-left">
          <DialogTitle className="text-lg font-bold text-foreground">
            Delete Personnel Record
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Are you sure you want to remove this record from the Signal Regiment database? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        {/* Clean Personnel Summary Card */}
        <div className="rounded-xl bg-muted/40 border border-border/80 p-4 space-y-2.5 my-3 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Full Name:</span>
            <span className="font-bold text-foreground text-sm">{personnel.fullName}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Rank & Category:</span>
            <span className="font-semibold text-foreground">{personnel.rank} ({personnel.rankCategory})</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Serial Number:</span>
            <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">{personnel.serialNumber}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Unit:</span>
            <span className="font-medium text-foreground text-right">{personnel.unit}</span>
          </div>
        </div>

        <DialogFooter className="flex items-center justify-end gap-2 pt-2 border-t border-border/60">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
            className="cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            type="button"
            size="sm"
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-rose-600 hover:bg-rose-700 text-white font-bold gap-1.5 cursor-pointer shadow-xs"
          >
            {isDeleting ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Deleting...</span>
              </>
            ) : (
              <span>Delete Record</span>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
