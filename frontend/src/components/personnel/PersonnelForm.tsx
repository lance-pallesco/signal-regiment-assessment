import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Personnel, Rank, PersonnelStatus, Gender, CivilStatus } from '../../types';
import { Card, CardContent } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import PhotoUpload from './PhotoUpload';
import {
  Shield,
  User,
  Phone,
  Building,
  Save,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';

interface PersonnelFormProps {
  initialData?: Partial<Personnel>;
  onSubmit: (formData: FormData) => Promise<void>;
  isSubmitting: boolean;
  submitLabel?: string;
}

const RANKS: Rank[] = [
  'PVT', 'PFC', 'CPL', 'SGT', 'SSG', 'SFC', 'MSG', 'SGM',
  '2LT', '1LT', 'CPT', 'MAJ', 'LTC', 'COL', 'BG', 'MG',
];

const STATUSES: PersonnelStatus[] = ['Active', 'Reserve', 'AWOL', 'Retired'];

const GENDERS: Gender[] = ['Male', 'Female'];

const CIVIL_STATUSES: CivilStatus[] = [
  'Single', 'Married', 'Widowed', 'Separated', 'Divorced',
];

const UNITS = [
  'Signal Company Alpha',
  'Signal Company Bravo',
  'Signal Company Charlie',
  'Signal Battalion HQ',
  '1st Signal Brigade',
  'Cyber Defense Squadron',
  'Electronic Warfare Battalion',
  'Satellite Communications Unit',
];

export default function PersonnelForm({
  initialData,
  onSubmit,
  isSubmitting,
  submitLabel = 'Save Personnel Record',
}: PersonnelFormProps) {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState(initialData?.first_name || '');
  const [lastName, setLastName] = useState(initialData?.last_name || '');
  const [rank, setRank] = useState<Rank>(initialData?.rank || 'PVT');
  const [birthday, setBirthday] = useState(initialData?.birthday || '');
  const [gender, setGender] = useState<Gender>(initialData?.gender || 'Male');
  const [civilStatus, setCivilStatus] = useState<CivilStatus>(initialData?.civil_status || 'Single');
  const [phone, setPhone] = useState(initialData?.phone || '');
  const [email, setEmail] = useState(initialData?.email || '');
  const [address, setAddress] = useState(initialData?.address || '');
  const [unit, setUnit] = useState(initialData?.unit || 'Signal Company Alpha');
  const [position, setPosition] = useState(initialData?.position || '');
  const [dateOfEnlistment, setDateOfEnlistment] = useState(initialData?.date_of_enlistment || '');
  const [status, setStatus] = useState<PersonnelStatus>(initialData?.status || 'Active');
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  // Maximum selectable date is today (disables future dates in native date picker)
  const today = new Date().toISOString().split('T')[0];

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Declarative client-side validation
    const rules: [boolean, string][] = [
      [!firstName.trim() || !lastName.trim(), 'First and Last names are required.'],
      [!birthday, 'Date of Birth is required.'],
      [!dateOfEnlistment, 'Date of Enlistment is required.'],
      [!phone.trim(), 'Contact phone number is required.'],
      [!address.trim(), 'Station or residential address is required.'],
      [!position.trim(), 'Designated position/role is required.'],
    ];

    const error = rules.find(([isInvalid]) => isInvalid);
    if (error) {
      toast.error('Validation Error', { description: error[1] });
      return;
    }

    // Prepare FormData payload
    const formData = new FormData();
    if (initialData?.serial_number) {
      formData.append('serial_number', initialData.serial_number);
    }
    formData.append('first_name', firstName.trim());
    formData.append('last_name', lastName.trim());
    formData.append('rank', rank);
    formData.append('birthday', birthday);
    formData.append('gender', gender);
    formData.append('civil_status', civilStatus);
    formData.append('phone', phone.trim());
    if (email.trim()) {
      formData.append('email', email.trim());
    }
    formData.append('address', address.trim());
    formData.append('unit', unit);
    formData.append('position', position.trim());
    formData.append('date_of_enlistment', dateOfEnlistment);
    formData.append('status', status);

    if (photoFile) {
      formData.append('photo', photoFile);
    }

    await onSubmit(formData);
  };

  const getInitials = () => {
    return `${firstName ? firstName.charAt(0) : 'S'}${lastName ? lastName.charAt(0) : 'P'}`.toUpperCase();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 1. Photo Upload */}
      <Card className="rounded-2xl border border-slate-200/90 bg-white shadow-sm overflow-hidden">
        <CardContent className="p-6">
          <PhotoUpload
            currentPhotoUrl={initialData?.photo_url}
            onPhotoSelected={setPhotoFile}
            initials={getInitials()}
          />
        </CardContent>
      </Card>

      {/* 2. Service Identity & Rank */}
      <Card className="rounded-2xl border border-slate-200/90 bg-white shadow-sm overflow-hidden">
        <div className="border-b border-slate-100 bg-slate-50/50 px-6 py-3.5 flex items-center gap-2">
          <Shield className="h-4 w-4 text-emerald-600" />
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Military Service Identity
          </h3>
        </div>
        <CardContent className="p-6 grid grid-cols-1 gap-5 sm:grid-cols-3">
          {/* First Name */}
          <div>
            <Label className="text-xs font-semibold text-slate-700">
              First Name <span className="text-rose-500">*</span>
            </Label>
            <Input
              type="text"
              placeholder="e.g. Juan"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              disabled={isSubmitting}
              className="mt-1.5 h-10 border-slate-200 bg-slate-50/50 text-sm focus-visible:ring-emerald-600/30"
              required
            />
          </div>

          {/* Last Name */}
          <div>
            <Label className="text-xs font-semibold text-slate-700">
              Last Name <span className="text-rose-500">*</span>
            </Label>
            <Input
              type="text"
              placeholder="e.g. Dela Cruz"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              disabled={isSubmitting}
              className="mt-1.5 h-10 border-slate-200 bg-slate-50/50 text-sm focus-visible:ring-emerald-600/30"
              required
            />
          </div>

          {/* Military Rank */}
          <div>
            <Label className="text-xs font-semibold text-slate-700">
              Military Rank <span className="text-rose-500">*</span>
            </Label>
            <Select
              value={rank}
              onValueChange={(val) => setRank(val as Rank)}
              disabled={isSubmitting}
            >
              <SelectTrigger className="mt-1.5 h-10 border-slate-200 bg-slate-50/50 text-sm font-semibold">
                <SelectValue placeholder="Select Rank" />
              </SelectTrigger>
              <SelectContent className="bg-white border-slate-200 max-h-64">
                {RANKS.map((r) => (
                  <SelectItem key={r} value={r} className="text-xs font-semibold">
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* 3. Military Assignment & Status */}
      <Card className="rounded-2xl border border-slate-200/90 bg-white shadow-sm overflow-hidden">
        <div className="border-b border-slate-100 bg-slate-50/50 px-6 py-3.5 flex items-center gap-2">
          <Building className="h-4 w-4 text-emerald-600" />
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Unit Assignment & Service Status
          </h3>
        </div>
        <CardContent className="p-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {/* Unit / Battalion */}
          <div>
            <Label className="text-xs font-semibold text-slate-700">
              Assigned Unit / Battalion <span className="text-rose-500">*</span>
            </Label>
            <Select
              value={unit}
              onValueChange={setUnit}
              disabled={isSubmitting}
            >
              <SelectTrigger className="mt-1.5 h-10 border-slate-200 bg-slate-50/50 text-sm">
                <SelectValue placeholder="Select Unit" />
              </SelectTrigger>
              <SelectContent className="bg-white border-slate-200">
                {UNITS.map((u) => (
                  <SelectItem key={u} value={u} className="text-xs font-medium">
                    {u}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Position / Role */}
          <div>
            <Label className="text-xs font-semibold text-slate-700">
              Position / Designation <span className="text-rose-500">*</span>
            </Label>
            <Input
              type="text"
              placeholder="e.g. Communications NCO"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              disabled={isSubmitting}
              className="mt-1.5 h-10 border-slate-200 bg-slate-50/50 text-sm focus-visible:ring-emerald-600/30"
              required
            />
          </div>

          {/* Date of Enlistment */}
          <div>
            <Label className="text-xs font-semibold text-slate-700">
              Date of Enlistment <span className="text-rose-500">*</span>
            </Label>
            <Input
              type="date"
              value={dateOfEnlistment}
              max={today}
              onChange={(e) => setDateOfEnlistment(e.target.value)}
              disabled={isSubmitting}
              className="mt-1.5 h-10 border-slate-200 bg-slate-50/50 text-sm focus-visible:ring-emerald-600/30"
              required
            />
          </div>

          {/* Duty Status */}
          <div>
            <Label className="text-xs font-semibold text-slate-700">
              Duty Status <span className="text-rose-500">*</span>
            </Label>
            <Select
              value={status}
              onValueChange={(val) => setStatus(val as PersonnelStatus)}
              disabled={isSubmitting}
            >
              <SelectTrigger className="mt-1.5 h-10 border-slate-200 bg-slate-50/50 text-sm font-semibold">
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent className="bg-white border-slate-200">
                {STATUSES.map((s) => (
                  <SelectItem key={s} value={s} className="text-xs font-medium">
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* 4. Personal Demographics & Contact */}
      <Card className="rounded-2xl border border-slate-200/90 bg-white shadow-sm overflow-hidden">
        <div className="border-b border-slate-100 bg-slate-50/50 px-6 py-3.5 flex items-center gap-2">
          <User className="h-4 w-4 text-emerald-600" />
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Demographics & Contact Details
          </h3>
        </div>
        <CardContent className="p-6 space-y-5">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            {/* Birthday */}
            <div>
              <Label className="text-xs font-semibold text-slate-700">
                Date of Birth <span className="text-rose-500">*</span>
              </Label>
              <Input
                type="date"
                value={birthday}
                max={today}
                onChange={(e) => setBirthday(e.target.value)}
                disabled={isSubmitting}
                className="mt-1.5 h-10 border-slate-200 bg-slate-50/50 text-sm focus-visible:ring-emerald-600/30"
                required
              />
            </div>

            {/* Gender */}
            <div>
              <Label className="text-xs font-semibold text-slate-700">
                Gender <span className="text-rose-500">*</span>
              </Label>
              <Select
                value={gender}
                onValueChange={(val) => setGender(val as Gender)}
                disabled={isSubmitting}
              >
                <SelectTrigger className="mt-1.5 h-10 border-slate-200 bg-slate-50/50 text-sm">
                  <SelectValue placeholder="Select Gender" />
                </SelectTrigger>
                <SelectContent className="bg-white border-slate-200">
                  {GENDERS.map((g) => (
                    <SelectItem key={g} value={g} className="text-xs font-medium">
                      {g}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Civil Status */}
            <div>
              <Label className="text-xs font-semibold text-slate-700">
                Civil Status <span className="text-rose-500">*</span>
              </Label>
              <Select
                value={civilStatus}
                onValueChange={(val) => setCivilStatus(val as CivilStatus)}
                disabled={isSubmitting}
              >
                <SelectTrigger className="mt-1.5 h-10 border-slate-200 bg-slate-50/50 text-sm">
                  <SelectValue placeholder="Select Civil Status" />
                </SelectTrigger>
                <SelectContent className="bg-white border-slate-200">
                  {CIVIL_STATUSES.map((cs) => (
                    <SelectItem key={cs} value={cs} className="text-xs font-medium">
                      {cs}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {/* Phone */}
            <div>
              <Label className="text-xs font-semibold text-slate-700">
                Contact Phone <span className="text-rose-500">*</span>
              </Label>
              <div className="relative mt-1.5">
                <Phone className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  type="text"
                  placeholder="e.g. 09171234567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={isSubmitting}
                  className="h-10 pl-10 border-slate-200 bg-slate-50/50 text-sm font-mono focus-visible:ring-emerald-600/30"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <Label className="text-xs font-semibold text-slate-700">
                Military Email (Optional)
              </Label>
              <Input
                type="email"
                placeholder="e.g. jdelacruz@signal.mil"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
                className="mt-1.5 h-10 border-slate-200 bg-slate-50/50 text-sm focus-visible:ring-emerald-600/30"
              />
            </div>
          </div>

          {/* Address */}
          <div>
            <Label className="text-xs font-semibold text-slate-700">
              Station / Permanent Address <span className="text-rose-500">*</span>
            </Label>
            <Textarea
              placeholder="e.g. Fort Andres Bonifacio, Taguig City, Metro Manila"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              disabled={isSubmitting}
              rows={2}
              className="mt-1.5 border-slate-200 bg-slate-50/50 text-sm focus-visible:ring-emerald-600/30 resize-none"
              required
            />
          </div>
        </CardContent>
      </Card>

      {/* Form Action Controls */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate('/personnel')}
          disabled={isSubmitting}
          className="h-11 px-5 border-slate-200 text-slate-700 font-semibold text-xs rounded-xl"
        >
          Cancel
        </Button>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="h-11 px-6 bg-[#064e3b] hover:bg-[#065f46] text-white font-semibold text-xs rounded-xl shadow-sm gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving Record...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              {submitLabel}
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
