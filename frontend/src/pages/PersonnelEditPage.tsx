import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, NavLink } from 'react-router-dom';
import { personnelService } from '../services/personnelService';
import type { Personnel } from '../types';
import PersonnelForm from '../components/personnel/PersonnelForm';
import { Button } from '../components/ui/button';
import { ArrowLeft, Edit3, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function PersonnelEditPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [personnel, setPersonnel] = useState<Personnel | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchRecord = async () => {
      setIsLoading(true);
      try {
        const data = await personnelService.get(id);
        setPersonnel(data);
      } catch {
        toast.error('Record Not Found', {
          description: 'Could not load personnel record for editing.',
        });
        navigate('/personnel');
      } finally {
        setIsLoading(false);
      }
    };
    fetchRecord();
  }, [id, navigate]);

  const handleUpdate = async (payload: FormData | Record<string, unknown>) => {
    if (!id) return;
    setIsSubmitting(true);
    try {
      const updated = await personnelService.update(id, payload);
      toast.success('Personnel Record Updated', {
        description: `Changes for ${updated.rank} ${updated.first_name} ${updated.last_name} (${updated.serial_number}) saved.`,
      });
      navigate('/personnel');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string; errors?: Record<string, string[]> } } };
      let description = 'Unable to update personnel record.';
      if (error.response?.data?.errors) {
        const errorEntries = Object.entries(error.response.data.errors);
        if (errorEntries.length > 0) {
          const [, messages] = errorEntries[0];
          if (messages?.[0]) description = messages[0];
        }
      } else if (error.response?.data?.message) {
        description = error.response.data.message;
      }
      toast.error('Update Failed', {
        description,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-96 w-full items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
          <p className="text-xs font-semibold text-slate-500">Loading military personnel record...</p>
        </div>
      </div>
    );
  }

  if (!personnel) return null;

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
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-100 text-blue-800">
              <Edit3 className="h-4 w-4" />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900">
              Edit Personnel Record
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Modify service status, rank, assignment, or demographics for {personnel.serial_number}
          </p>
        </div>
      </div>

      {/* Reusable Form pre-populated */}
      <PersonnelForm
        initialData={personnel}
        onSubmit={handleUpdate}
        isSubmitting={isSubmitting}
        submitLabel="Save Changes"
      />
    </div>
  );
}
