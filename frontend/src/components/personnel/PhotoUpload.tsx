import React, { useRef, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { Upload, X, Camera, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';

interface PhotoUploadProps {
  currentPhotoUrl?: string | null;
  onPhotoSelected: (file: File | null) => void;
  initials?: string;
}

export default function PhotoUpload({
  currentPhotoUrl,
  onPhotoSelected,
  initials = 'SP',
}: PhotoUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast.error('Invalid Image Type', {
        description: 'Please upload a JPEG, PNG, or WebP image.',
      });
      return;
    }

    // Validate size (2MB max)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image Too Large', {
        description: 'Photo must be under 2MB.',
      });
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    onPhotoSelected(file);
    toast.success('Photo Attached', {
      description: `${file.name} ready for upload.`,
    });
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    onPhotoSelected(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const displayImage = previewUrl || currentPhotoUrl;

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-xl border border-dashed border-slate-300 bg-slate-50/50 hover:bg-slate-50 transition-colors">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
      />

      {/* Avatar Preview */}
      <div className="relative group">
        <Avatar className="h-24 w-24 border-2 border-slate-200 bg-emerald-50 text-emerald-800 shadow-sm">
          {displayImage && <AvatarImage src={displayImage} alt="Personnel Photo" className="object-cover" />}
          <AvatarFallback className="text-xl font-black text-emerald-800 bg-emerald-100">
            {initials}
          </AvatarFallback>
        </Avatar>

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity"
          title="Change Photo"
        >
          <Camera className="h-6 w-6" />
        </button>
      </div>

      {/* Upload Instructions & Action Buttons */}
      <div className="flex-1 text-center sm:text-left space-y-1.5">
        <h4 className="text-sm font-bold text-slate-800 flex items-center justify-center sm:justify-start gap-1.5">
          <ImageIcon className="h-4 w-4 text-emerald-600" />
          Official Photo (Optional)
        </h4>
        <p className="text-xs text-slate-500">
          Upload standard military portrait in JPG, PNG, or WebP (max. 2MB).
        </p>

        <div className="flex items-center justify-center sm:justify-start gap-2 pt-1">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            className="h-8 text-xs font-semibold border-slate-200 text-slate-700 hover:bg-slate-100 gap-1.5"
          >
            <Upload className="h-3.5 w-3.5" />
            <span>{displayImage ? 'Change Photo' : 'Upload Photo'}</span>
          </Button>

          {previewUrl && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleRemove}
              className="h-8 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 gap-1"
            >
              <X className="h-3.5 w-3.5" />
              <span>Remove</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
