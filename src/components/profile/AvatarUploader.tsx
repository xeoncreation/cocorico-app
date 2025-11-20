"use client";

import { useState, useRef } from "react";
import { createClientComponentClient } from "@/lib/supabase/client";
import { useTranslations } from "next-intl";

interface AvatarUploaderProps {
  currentUrl: string | null;
  onUploadComplete?: (url: string) => void;
}

export default function AvatarUploader({ currentUrl, onUploadComplete }: AvatarUploaderProps) {
  const t = useTranslations("Profile");
  const supabase = createClientComponentClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentUrl);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type and size
    if (!file.type.startsWith("image/")) {
      setError(t("avatar_error_type") || "Please select an image file.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setError(t("avatar_error_size") || "Image must be less than 2MB.");
      return;
    }

    setError(null);
    setUploading(true);

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Generate unique filename
      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;

      // Upload to Supabase storage
      const { data, error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(data.path);

      const publicUrl = urlData.publicUrl;

      // Update user metadata
      const { error: updateError } = await supabase.auth.updateUser({
        data: { avatar_url: publicUrl },
      });

      if (updateError) throw updateError;

      setPreview(publicUrl);
      onUploadComplete?.(publicUrl);
    } catch (err: any) {
      console.error("Avatar upload error:", err);
      setError(err.message || t("avatar_error_upload") || "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Avatar preview */}
      <div className="relative w-32 h-32">
        {preview ? (
          <img
            src={preview}
            alt="Avatar"
            className="w-full h-full rounded-full object-cover border-4 border-border shadow-lg"
          />
        ) : (
          <div className="w-full h-full rounded-full bg-muted flex items-center justify-center text-muted-foreground text-4xl font-bold border-4 border-border shadow-lg">
            ?
          </div>
        )}
        {uploading && (
          <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-white border-t-transparent"></div>
          </div>
        )}
      </div>

      {/* Upload button */}
      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
        className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {uploading
          ? t("avatar_uploading") || "Uploading..."
          : t("avatar_change") || "Change Avatar"}
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        aria-label="Upload avatar image"
        title="Upload avatar"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Error message */}
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}

      {/* Help text */}
      <p className="text-xs text-muted-foreground text-center max-w-xs">
        {t("avatar_help") || "JPG, PNG or GIF. Max 2MB."}
      </p>
    </div>
  );
}
