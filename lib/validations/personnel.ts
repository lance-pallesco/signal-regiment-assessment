import { z } from "zod";

export const MILITARY_RANKS = [
  "Brigadier General",
  "Colonel",
  "Lieutenant Colonel",
  "Major",
  "Captain",
  "First Lieutenant",
  "Second Lieutenant",
  "Chief Master Sergeant",
  "Senior Master Sergeant",
  "Master Sergeant",
  "Technical Sergeant",
  "Staff Sergeant",
  "Sergeant",
  "Corporal",
  "Private First Class",
  "Private",
] as const;

export const OFFICER_RANKS = [
  "General",
  "Lieutenant General",
  "Major General",
  "Brigadier General",
  "Colonel",
  "Lieutenant Colonel",
  "Major",
  "Captain",
  "First Lieutenant",
  "Second Lieutenant",
];

export const SIGNAL_UNITS = [
  "Headquarters & Headquarters Company",
  "1st Signal Battalion",
  "2nd Signal Battalion",
  "3rd Signal Battalion",
  "Signal Training School",
  "Signal Special Operations Battalion",
  "Cyber Battalion",
] as const;

export const DUTY_STATUSES = ["Active", "Reserve", "Retired"] as const;
export const GENDERS = ["Male", "Female"] as const;
export const CIVIL_STATUSES = ["Single", "Married", "Widowed", "Separated"] as const;

export type MilitaryRank = (typeof MILITARY_RANKS)[number];
export type SignalUnit = (typeof SIGNAL_UNITS)[number];
export type DutyStatus = (typeof DUTY_STATUSES)[number];

export const personnelSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Full name must be at least 2 characters."),
  serialNumber: z
    .string()
    .trim()
    .min(3, "Serial Number is required.")
    .regex(/^[A-Za-z0-9-]+$/, "Serial Number can only contain letters, numbers, and hyphens."),
  rank: z.string().min(1, "Military Rank is required."),
  rankCategory: z.enum(["Officer", "Enlisted Personnel"]).default("Enlisted Personnel"),
  birthday: z.coerce.date({
    message: "Birthday is required and must be a valid date.",
  }),
  gender: z.enum(GENDERS, {
    message: "Gender must be Male or Female.",
  }),
  civilStatus: z.enum(CIVIL_STATUSES, {
    message: "Valid civil status is required.",
  }),
  phone: z
    .string()
    .trim()
    .min(7, "Contact phone number is required."),
  email: z
    .string()
    .trim()
    .email("A valid email address is required."),
  address: z
    .string()
    .trim()
    .min(5, "Complete residential address is required."),
  unit: z.string().min(1, "Unit/Battalion assignment is required."),
  position: z
    .string()
    .trim()
    .min(2, "Position/Designation is required."),
  dateOfEnlistment: z.coerce.date({
    message: "Date of enlistment is required and must be a valid date.",
  }),
  status: z.enum(DUTY_STATUSES, {
    message: "Duty status must be Active, Reserve, or Retired.",
  }),
  photo: z.string().optional().nullable(),
});

export type PersonnelInput = z.infer<typeof personnelSchema>;

/**
 * Generate a standardized unique Serial Number sequence
 * Pattern: SR-YYYY-XXXX (e.g. SR-2026-0042 or random 4-digit code)
 */
export function generateSerialNumber(seq?: number): string {
  const currentYear = new Date().getFullYear();
  if (typeof seq === "number") {
    const pad = String(seq).padStart(4, "0");
    return `SR-${currentYear}-${pad}`;
  }
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `SR-${currentYear}-${randomSuffix}`;
}

/**
 * Extracts initials from soldier full name.
 * Example: "Danica Reyes Mercado" -> "DM"
 */
export function getInitials(name: string): string {
  if (!name || !name.trim()) return "SR";
  
  // Strip common rank prefixes if included in the name string
  const cleanName = name
    .replace(/^(Col\.|Colonel|LTC|MAJ|Major|CPT|Captain|1LT|2LT|CMS|SMS|MSG|TSG|SSG|SGT|Sergeant|CPL|Corporal|PFC|PVT|Private|BGEN)\s+/i, "")
    .trim();

  const parts = cleanName.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "SR";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();

  // First letter of First name + First letter of Last name
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
