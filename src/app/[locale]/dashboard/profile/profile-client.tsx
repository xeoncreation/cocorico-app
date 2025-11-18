"use client";

import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RippleButton } from "@/components/ui/ripple-button";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import {
  Camera,
  Upload,
  Shield,
  Globe,
  Download,
  Loader2,
} from "lucide-react";

const ProfileSchema = z.object({
  display_name: z.string().min(2, "El nombre es obligatorio"),
  bio: z.string().max(180, "Máximo 180 caracteres").optional(),
  instagram: z.string().optional(),
  tiktok: z.string().optional(),
  visibility: z.enum(["public", "private"]),
});

type ProfileFormValues = z.infer<typeof ProfileSchema>;

export default function ProfileClient() {
  const supabase = createClientComponentClient();
  const [plan, setPlan] = useState<"free" | "premium">("free");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [loadingSave, setLoadingSave] = useState(false);
  const [loadingExport, setLoadingExport] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      display_name: "",
      bio: "",
      instagram: "",
      tiktok: "",
      visibility: "public",
    },
  });

  useEffect(() => {
    setPlan(
      document.documentElement.dataset.theme === "premium" ? "premium" : "free"
    );
  }, []);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/me/profile");
      if (!res.ok) return;
      const json = await res.json();
      const p = json.profile;
      if (!p) return;
      form.reset({
        display_name: p.display_name ?? "",
        bio: p.bio ?? "",
        instagram: p.instagram ?? "",
        tiktok: p.tiktok ?? "",
        visibility: p.visibility ?? "public",
      });
      setAvatarUrl(p.avatar_url ?? null);
    })();
  }, [form]);

  const uploadAvatar = async () => {
    if (!avatarFile) return null;
    const ext = avatarFile.name.split(".").pop();
    const filePath = `avatars/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("assets").upload(filePath, avatarFile);
    if (error) {
      console.error(error);
      return null;
    }
    const { data } = supabase.storage.from("assets").getPublicUrl(filePath);
    return data.publicUrl;
  };

  const onSubmit = async (values: ProfileFormValues) => {
    setLoadingSave(true);
    let finalAvatarUrl = avatarUrl;
    if (avatarFile) {
      const uploaded = await uploadAvatar();
      if (uploaded) {
        finalAvatarUrl = uploaded;
        setAvatarUrl(uploaded);
      }
    }
    await fetch("/api/me/profile", {
      method: "POST",
      body: JSON.stringify({
        ...values,
        avatar_url: finalAvatarUrl,
      }),
    });
    setLoadingSave(false);
  };

  const exportData = async () => {
    setLoadingExport(true);
    setTimeout(() => {
      setLoadingExport(false);
      alert("Exportación de datos en preparación (stub).");
    }, 800);
  };

  return (
    <section className="space-y-10">
      <Card
        className={cn(
          "border p-6 rounded-2xl space-y-6 bg-surface/80",
          plan === "premium" && "glass-card glass-card-purple glass-frosted-border"
        )}
      >
        <CardHeader>
          <CardTitle>Foto de perfil</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-surface border flex items-center justify-center overflow-hidden">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <Camera className="w-6 h-6 text-muted-foreground" />
              )}
            </div>
            <div className="space-y-3">
              <Input
                type="file"
                accept="image/*"
                aria-label="Seleccionar avatar"
                onChange={(e) => setAvatarFile(e.target.files?.[0] ?? null)}
              />
              <RippleButton
                type="button"
                disabled={loadingSave}
                onClick={onSubmit.bind(null, form.getValues())}
                className="rounded-xl inline-flex items-center gap-2"
              >
                {loadingSave ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Subiendo…
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" /> Actualizar avatar
                  </>
                )}
              </RippleButton>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card
        className={cn(
          "border p-6 rounded-2xl bg-surface/80",
          plan === "premium" && "glass-card glass-card-purple glass-frosted-border"
        )}
      >
        <CardHeader>
          <CardTitle>Datos personales</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <Input placeholder="Nombre visible" {...form.register("display_name")} />
            <Textarea
              placeholder="Bio (máx. 180 caracteres)"
              rows={3}
              {...form.register("bio")}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs flex items-center gap-1 mb-1">
                  <Globe className="w-3 h-3" /> Instagram
                </label>
                <Input placeholder="@usuario" {...form.register("instagram")} />
              </div>
              <div>
                <label className="text-xs flex items-center gap-1 mb-1">
                  <Globe className="w-3 h-3" /> TikTok
                </label>
                <Input placeholder="@usuario" {...form.register("tiktok")} />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs flex items-center gap-2">
                <Shield className="w-4 h-4" /> Privacidad
              </label>
              <select
                {...form.register("visibility")}
                className="p-2 rounded-lg bg-surface border border-border w-full"
              >
                <option value="public">Perfil público</option>
                <option value="private">Solo tú</option>
              </select>
            </div>
            <RippleButton
              type="submit"
              disabled={loadingSave}
              className="mt-4 rounded-xl w-full h-11"
            >
              {loadingSave ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-1" /> Guardando…
                </>
              ) : (
                "Guardar cambios"
              )}
            </RippleButton>
          </form>
        </CardContent>
      </Card>

      <Card
        className={cn(
          "border p-6 rounded-2xl bg-surface/80",
          plan === "premium" && "glass-card glass-card-blue glass-frosted-border"
        )}
      >
        <CardHeader>
          <CardTitle>Exportar datos (GDPR)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Descarga un archivo con tus datos personales y contenido asociado.
          </p>
          <Button
            type="button"
            onClick={exportData}
            disabled={loadingExport}
            className="rounded-xl inline-flex items-center gap-2"
          >
            {loadingExport ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Preparando…
              </>
            ) : (
              <>
                <Download className="w-4 h-4" /> Exportar ZIP
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </section>
  );
}
