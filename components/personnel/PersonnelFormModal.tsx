"use client";

import React, { useState, useEffect, useRef } from "react";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MILITARY_RANKS,
  SIGNAL_UNITS,
  DUTY_STATUSES,
  GENDERS,
  CIVIL_STATUSES,
  OFFICER_RANKS,
  generateSerialNumber,
  getInitials,
} from "@/lib/validations/personnel";
import { Personnel } from "./PersonnelTable";
import { toast } from "sonner";
import { Loader2, Upload, Sparkles, X } from "lucide-react";

export interface PersonnelFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  personnelToEdit: Personnel | null;
  onSuccess: () => void;
}

export function PersonnelFormModal({
  open,
  onOpenChange,
  personnelToEdit,
  onSuccess,
}: PersonnelFormModalProps) {
  const isEditing = !!personnelToEdit;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    fullName: "",
    serialNumber: "",
    rank: "Private",
    birthday: "1995-01-01",
    gender: "Male",
    civilStatus: "Single",
    phone: "+63 9",
    email: "",
    address: "",
    unit: "1st Signal Battalion",
    position: "",
    dateOfEnlistment: "2020-01-01",
    status: "Active",
    photo: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  useEffect(() => {
    if (personnelToEdit) {
      setFormData({
        fullName: personnelToEdit.fullName,
        serialNumber: personnelToEdit.serialNumber,
        rank: personnelToEdit.rank,
        birthday: format(new Date(personnelToEdit.birthday), "yyyy-MM-dd"),
        gender: personnelToEdit.gender,
        civilStatus: personnelToEdit.civilStatus,
        phone: personnelToEdit.phone,
        email: personnelToEdit.email,
        address: personnelToEdit.address,
        unit: personnelToEdit.unit,
        position: personnelToEdit.position,
        dateOfEnlistment: format(new Date(personnelToEdit.dateOfEnlistment), "yyyy-MM-dd"),
        status: personnelToEdit.status,
        photo: personnelToEdit.photo || "",
      });
    } else {
      setFormData({
        fullName: "",
        serialNumber: generateSerialNumber(),
        rank: "Private",
        birthday: "1995-01-01",
        gender: "Male",
        civilStatus: "Single",
        phone: "+63 9",
        email: "",
        address: "",
        unit: "1st Signal Battalion",
        position: "",
        dateOfEnlistment: format(new Date(), "yyyy-MM-dd"),
        status: "Active",
        photo: "",
      });
    }
    setErrors({});
  }, [personnelToEdit, open]);

  const handleGenerateSerialNumber = () => {
    const newSN = generateSerialNumber();
    setFormData((prev) => ({ ...prev, serialNumber: newSN }));
    toast.info(`Generated Serial Number: ${newSN}`);
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!["image/jpeg", "image/png", "image/webp", "image/jpg"].includes(file.type)) {
      toast.error("Please upload a valid image file (JPG, PNG, or WEBP).");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Photo size exceeds 5MB limit.");
      return;
    }

    setIsUploadingPhoto(true);
    try {
      const uploadData = new FormData();
      uploadData.append("file", file);

      const res = await fetch("/api/personnel/upload", {
        method: "POST",
        body: uploadData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to upload photo.");
      }

      setFormData((prev) => ({ ...prev, photo: data.url }));
      toast.success("Photo uploaded successfully.");
    } catch (err: any) {
      toast.error(err.message || "Photo upload failed.");
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handleRemovePhoto = () => {
    setFormData((prev) => ({ ...prev, photo: "" }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const validateForm = () => {
    const errs: Record<string, string> = {};
    if (!formData.fullName.trim()) errs.fullName = "Full name is required.";
    if (!formData.serialNumber.trim()) errs.serialNumber = "Serial Number is required.";
    if (!formData.phone.trim() || formData.phone.length < 7)
      errs.phone = "Valid contact number is required.";
    if (!formData.email.trim() || !formData.email.includes("@"))
      errs.email = "Valid official email is required.";
    if (!formData.address.trim()) errs.address = "Residential address is required.";
    if (!formData.position.trim()) errs.position = "Designation/Role is required.";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const isOfficer = OFFICER_RANKS.some((r) =>
        formData.rank.toLowerCase().includes(r.toLowerCase())
      );
      const rankCategory = isOfficer ? "Officer" : "Enlisted Personnel";

      const payload = {
        fullName: formData.fullName.trim(),
        serialNumber: formData.serialNumber.trim(),
        rank: formData.rank,
        rankCategory,
        birthday: new Date(formData.birthday).toISOString(),
        gender: formData.gender,
        civilStatus: formData.civilStatus,
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        address: formData.address.trim(),
        unit: formData.unit,
        position: formData.position.trim(),
        dateOfEnlistment: new Date(formData.dateOfEnlistment).toISOString(),
        status: formData.status,
        photo: formData.photo || null,
      };

      const url = isEditing
        ? `/api/personnel/${personnelToEdit.id}`
        : "/api/personnel";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.details) {
          const fieldErrors: Record<string, string> = {};
          Object.keys(data.details).forEach((key) => {
            if (data.details[key]._errors?.length) {
              fieldErrors[key] = data.details[key]._errors[0];
            }
          });
          setErrors(fieldErrors);
          throw new Error("Please correct the highlighted form errors.");
        }
        throw new Error(data.error || "Failed to save personnel record.");
      }

      toast.success(
        isEditing
          ? `Record for ${formData.fullName} updated successfully.`
          : `Personnel record for ${formData.fullName} added successfully.`
      );
      onSuccess();
      onOpenChange(false);
    } catch (err: any) {
      toast.error(err.message || "An error occurred while saving record.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-6">
        <DialogHeader className="pb-2 border-b border-border">
          <DialogTitle className="text-lg font-bold text-foreground">
            {isEditing ? "Update Personnel Record" : "Enlist New Military Personnel"}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            {isEditing
              ? "Modify official service record details for this personnel."
              : "Register a soldier or officer into the Signal Regiment database."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          
          {/* Photo Upload Section */}
          <div className="flex items-center gap-4 p-3 rounded-xl bg-muted/40 border border-border">
            <div className="relative shrink-0">
              {formData.photo ? (
                <img
                  src={formData.photo}
                  alt="Personnel Photo"
                  className="h-12 w-12 rounded-full object-cover ring-1.5 ring-emerald-600 shadow-xs"
                />
              ) : (
                <div className="h-12 w-12 rounded-full ring-1 ring-emerald-600/30 text-emerald-800 dark:text-emerald-300 font-bold text-xs flex items-center justify-center ring-1.5 ring-emerald-600/30">
                  {getInitials(formData.fullName || "SR")}
                </div>
              )}
            </div>

            <div className="flex-1 space-y-1">
              <Label className="text-xs font-semibold text-foreground">
                Personnel Photo
              </Label>
              <p className="text-[11px] text-muted-foreground">
                Upload soldier profile photo (JPG, PNG, or WEBP, max 5MB).
              </p>
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploadingPhoto}
                  className="h-7 text-xs font-semibold gap-1.5 cursor-pointer"
                >
                  {isUploadingPhoto ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <Upload className="h-3 w-3" />
                  )}
                  <span>{formData.photo ? "Change Photo" : "Upload Photo"}</span>
                </Button>

                {formData.photo && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleRemovePhoto}
                    className="h-7 text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 gap-1 cursor-pointer"
                  >
                    <X className="h-3 w-3" />
                    <span>Remove</span>
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Section 1: Military Identification */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
              1. Military Identification & Rank
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              
              {/* Full Name */}
              <div className="space-y-1">
                <Label htmlFor="fullName" className="text-xs font-medium">
                  Full Name <span className="text-rose-500">*</span>
                </Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="e.g. Danica Reyes Mercado"
                  className={errors.fullName ? "border-rose-500 text-xs" : "text-xs"}
                />
                {errors.fullName && (
                  <p className="text-[11px] text-rose-500">{errors.fullName}</p>
                )}
              </div>

              {/* Serial Number with Auto-generate */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <Label htmlFor="serialNumber" className="text-xs font-medium">
                    Serial Number <span className="text-rose-500">*</span>
                  </Label>
                  <button
                    type="button"
                    onClick={handleGenerateSerialNumber}
                    className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <Sparkles className="h-3 w-3" />
                    <span>Auto Generate</span>
                  </button>
                </div>
                <Input
                  id="serialNumber"
                  value={formData.serialNumber}
                  onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
                  placeholder="e.g. SR-2026-0001"
                  className={errors.serialNumber ? "border-rose-500 text-xs font-mono" : "text-xs font-mono"}
                />
                {errors.serialNumber && (
                  <p className="text-[11px] text-rose-500">{errors.serialNumber}</p>
                )}
              </div>

              {/* Military Rank */}
              <div className="space-y-1">
                <Label htmlFor="rank" className="text-xs font-medium">
                  Military Rank <span className="text-rose-500">*</span>
                </Label>
                <Select
                  value={formData.rank}
                  onValueChange={(val) => setFormData({ ...formData, rank: val })}
                >
                  <SelectTrigger id="rank" className="text-xs">
                    <SelectValue placeholder="Select Rank" />
                  </SelectTrigger>
                  <SelectContent className="max-h-56">
                    {MILITARY_RANKS.map((r) => (
                      <SelectItem key={r} value={r} className="text-xs">
                        {r}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Duty Status */}
              <div className="space-y-1">
                <Label htmlFor="status" className="text-xs font-medium">
                  Duty Status <span className="text-rose-500">*</span>
                </Label>
                <Select
                  value={formData.status}
                  onValueChange={(val) => setFormData({ ...formData, status: val })}
                >
                  <SelectTrigger id="status" className="text-xs">
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    {DUTY_STATUSES.map((s) => (
                      <SelectItem key={s} value={s} className="text-xs">
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

            </div>
          </div>

          {/* Section 2: Unit Assignment & Position */}
          <div className="space-y-3 pt-1">
            <h4 className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
              2. Unit Assignment & Role
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              
              {/* Unit / Battalion */}
              <div className="space-y-1">
                <Label htmlFor="unit" className="text-xs font-medium">
                  Battalion / Unit Assignment <span className="text-rose-500">*</span>
                </Label>
                <Select
                  value={formData.unit}
                  onValueChange={(val) => setFormData({ ...formData, unit: val })}
                >
                  <SelectTrigger id="unit" className="text-xs">
                    <SelectValue placeholder="Select Battalion" />
                  </SelectTrigger>
                  <SelectContent>
                    {SIGNAL_UNITS.map((u) => (
                      <SelectItem key={u} value={u} className="text-xs">
                        {u}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Position / Designation */}
              <div className="space-y-1">
                <Label htmlFor="position" className="text-xs font-medium">
                  Designation / Role <span className="text-rose-500">*</span>
                </Label>
                <Input
                  id="position"
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  placeholder="e.g. Cyber Defense Specialist"
                  className={errors.position ? "border-rose-500 text-xs" : "text-xs"}
                />
                {errors.position && (
                  <p className="text-[11px] text-rose-500">{errors.position}</p>
                )}
              </div>

              {/* Date of Enlistment */}
              <div className="space-y-1 sm:col-span-2">
                <Label htmlFor="dateOfEnlistment" className="text-xs font-medium">
                  Date of Enlistment <span className="text-rose-500">*</span>
                </Label>
                <Input
                  id="dateOfEnlistment"
                  type="date"
                  value={formData.dateOfEnlistment}
                  onChange={(e) => setFormData({ ...formData, dateOfEnlistment: e.target.value })}
                  className="text-xs"
                />
              </div>

            </div>
          </div>

          {/* Section 3: Personal & Contact Information */}
          <div className="space-y-3 pt-1">
            <h4 className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
              3. Personal Details & Contact
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              
              {/* Birthday */}
              <div className="space-y-1">
                <Label htmlFor="birthday" className="text-xs font-medium">
                  Birthday <span className="text-rose-500">*</span>
                </Label>
                <Input
                  id="birthday"
                  type="date"
                  value={formData.birthday}
                  onChange={(e) => setFormData({ ...formData, birthday: e.target.value })}
                  className="text-xs"
                />
              </div>

              {/* Gender */}
              <div className="space-y-1">
                <Label htmlFor="gender" className="text-xs font-medium">
                  Gender <span className="text-rose-500">*</span>
                </Label>
                <Select
                  value={formData.gender}
                  onValueChange={(val) => setFormData({ ...formData, gender: val })}
                >
                  <SelectTrigger id="gender" className="text-xs">
                    <SelectValue placeholder="Gender" />
                  </SelectTrigger>
                  <SelectContent>
                    {GENDERS.map((g) => (
                      <SelectItem key={g} value={g} className="text-xs">
                        {g}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Civil Status */}
              <div className="space-y-1">
                <Label htmlFor="civilStatus" className="text-xs font-medium">
                  Civil Status <span className="text-rose-500">*</span>
                </Label>
                <Select
                  value={formData.civilStatus}
                  onValueChange={(val) => setFormData({ ...formData, civilStatus: val })}
                >
                  <SelectTrigger id="civilStatus" className="text-xs">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    {CIVIL_STATUSES.map((c) => (
                      <SelectItem key={c} value={c} className="text-xs">
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {/* Phone */}
              <div className="space-y-1">
                <Label htmlFor="phone" className="text-xs font-medium">
                  Contact Phone <span className="text-rose-500">*</span>
                </Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+63 9XX XXX XXXX"
                  className={errors.phone ? "border-rose-500 text-xs" : "text-xs"}
                />
                {errors.phone && (
                  <p className="text-[11px] text-rose-500">{errors.phone}</p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-1">
                <Label htmlFor="email" className="text-xs font-medium">
                  Official Email <span className="text-rose-500">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="soldier@signal.army.mil.ph"
                  className={errors.email ? "border-rose-500 text-xs" : "text-xs"}
                />
                {errors.email && (
                  <p className="text-[11px] text-rose-500">{errors.email}</p>
                )}
              </div>

              {/* Address */}
              <div className="space-y-1 sm:col-span-2">
                <Label htmlFor="address" className="text-xs font-medium">
                  Residential / Barracks Address <span className="text-rose-500">*</span>
                </Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Complete Address (e.g. Fort Bonifacio, Taguig City)"
                  className={errors.address ? "border-rose-500 text-xs" : "text-xs"}
                />
                {errors.address && (
                  <p className="text-[11px] text-rose-500">{errors.address}</p>
                )}
              </div>
            </div>
          </div>

          <DialogFooter className="pt-4 border-t border-border flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isSubmitting}
              className="bg-emerald-800 hover:bg-emerald-900 text-white font-bold gap-1.5 cursor-pointer shadow-xs"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Saving Record...</span>
                </>
              ) : (
                <span>{isEditing ? "Update Personnel" : "Enlist Personnel"}</span>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
