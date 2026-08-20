import React, { useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { personnelService } from '../services/personnelService';
import PersonnelForm from '../components/personnel/PersonnelForm';
import { Button } from '../components/ui/button';
import { ArrowLeft, UserPlus } from 'lucide-react';
import { toast } from 'sonner';

export default function PersonnelCreatePage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreate = async (formData: FormData) => {
    setIsSubmitting(true);
    try {
      const created = await personnelService.create(formData);
      toast.success('Personnel Enlisted Successfully', {
        description: `Service record for ${created.rank} ${created.first_name} ${created.last_name} (${created.serial_number}) registered.`,
      });
      navigate('/personnel');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string; errors?: Record<string, string[]> } } };
      let description = 'Unable to enlist personnel. Please check required fields.';
      if (error.response?.data?.errors) {
        const firstError = Object.values(error.response.data.errors)[0];
        if (firstError?.[0]) description = firstError[0];
      } else if (error.response?.data?.message) {
        description = error.response.data.message;
      }
      toast.error('Enlistment Failed', {
        description,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center gap-4">
        <NavLink to="/personnel">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-10 w-10 rounded-xl border-slate-200 bg-white hover:bg-slate-50"
            title="Back to Personnel Directory"
          >
            <ArrowLeft className="h-4 w-4 text-slate-700" />
          </Button>
        </NavLink>

        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800">
              <UserPlus className="h-4 w-4" />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900">
              Enlist New Personnel
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Register a military communications officer or enlisted specialist into the regiment
          </p>
        </div>
      </div>

      {/* Reusable Form */}
      <PersonnelForm
        onSubmit={handleCreate}
        isSubmitting={isSubmitting}
        submitLabel="Complete Enlistment"
      />
    </div>
  );
}
