"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

import {
  Upload,
  Camera,
  Link as LinkIcon,
  Shield,
  Globe,
  Download,
  Loader2,
} from "lucide-react";

import { cn } from "@/lib/utils";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// ----------------------------
// Zod Schema
// ----------------------------
const ProfileSchema = z.object({
  name: z.string().min(2),
  bio: z.string().max(180).optional(),
  instagram: z.string().optional(),
  tiktok: z.string().optional(),
  visibility: z.enum(["public", "private"]),
});

export default function ProfileClient() {
  const [plan, setPlan] = useState<"free" | "premium">("free");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    setPlan(
      document.documentElement.dataset.theme === "premium" ? "premium" : "free"
    );
  }, []);

  const form = useForm<z.infer<typeof ProfileSchema>>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      name: "",
      bio: "",
      instagram: "",
      tiktok: "",
      visibility: "public",
    },
  });

  const uploadAvatar = async () => {
    if (!avatarFile) return;
    setUploading(true);

    const fileName = `avatar-${Date.now()}`;
    await supabase.storage
      .from("assets")
      .upload(`avatars/${fileName}`, avatarFile);

    setUploading(false);
    alert("Avatar actualizado.");
  };

  return (
    <section className="space-y-10">
      {/* --------------------------- */}
      {/* AVATAR */}
      {/* --------------------------- */}
      <Card
        className={cn(
          "border p-6 rounded-2xl space-y-6 bg-surface/80",
          plan === "premium" &&
            "bg-white/10 backdrop-blur-xl border-white/20 shadow-xl"
        )}
      >
        <CardHeader>
          <CardTitle>Foto de perfil</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-surface border flex items-center justify-center overflow-hidden">
              <Camera className="w-6 h-6 text-muted-foreground" />
            </div>

            <div className="space-y-3">
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setAvatarFile(e.target.files?.[0] || null)}
              />

              <Button
                disabled={uploading}
                onClick={uploadAvatar}
                className="rounded-xl"
              >
                {uploading ? (
                  <>
                    <Loader2 className="animate-spin w-4 h-4 mr-1" /> Subiendo...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-1" /> Actualizar Avatar
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* --------------------------- */}
      {/* DATOS DE PERFIL */}
      {/* --------------------------- */}
      <Card
        className={cn(
          "border p-6 rounded-2xl bg-surface/80 space-y-6",
          plan === "premium" &&
            "bg-white/10 backdrop-blur-xl border-white/20 shadow-xl"
        )}
      >
        <CardHeader>
          <CardTitle>Datos personales</CardTitle>
        </CardHeader>

        <CardContent>
          <form className="space-y-4">
            <Input placeholder="Nombre" {...form.register("name")} />
            <Textarea placeholder="Bio (máx 180 caracteres)" {...form.register("bio")} />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium flex gap-1 mb-1">
                  <InstagramIcon /> Instagram
                </label>
                <Input placeholder="@usuario" {...form.register("instagram")} />
              </div>

              <div>
                <label className="text-xs font-medium flex gap-1 mb-1">
                  <LinkIcon className="w-3 h-3" /> TikTok
                </label>
                <Input placeholder="@usuario" {...form.register("tiktok")} />
              </div>
            </div>

            {/* Privacidad */}
            <div className="space-y-2">
              <label className="text-xs font-medium flex items-center gap-2 mb-1">
                <Shield className="w-4 h-4" /> Privacidad
              </label>

              <select
                {...form.register("visibility")}
                className="p-2 rounded-lg bg-surface border border-border"
              >
                <option value="public">Público</option>
                <option value="private">Privado</option>
              </select>
            </div>

            <Button className="rounded-xl mt-4">Guardar cambios</Button>
          </form>
        </CardContent>
      </Card>

      {/* --------------------------- */}
      {/* EXPORTACIÓN GDPR */}
      {/* --------------------------- */}
      <Card
        className={cn(
          "border p-6 rounded-2xl bg-surface/80 space-y-4",
          plan === "premium" &&
            "bg-white/10 backdrop-blur-xl border-white/20 shadow-xl"
        )}
      >
        <CardHeader>
          <CardTitle>Exportar datos (GDPR)</CardTitle>
        </CardHeader>

        <CardContent>
          <p className="text-sm text-muted-foreground">
            Descarga toda tu información personal y contenido asociado con tu cuenta.
          </p>

          <Button className="mt-3 rounded-xl">
            <Download className="w-4 h-4 mr-1" /> Exportar ZIP
          </Button>
        </CardContent>
      </Card>
    </section>
  );
}

// Ícono pequeño de Instagram
function InstagramIcon() {
  return (
    <svg
      className="w-3 h-3"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M7 2C4.2 2 2 4.2 2 7v10c0 2.8 2.2 5 5 5h10c2.8 0 5-2.2 5-5V7c0-2.8-2.2-5-5-5H7zm10 2c1.7 0 3 1.3 3 3v10c0 1.7-1.3 3-3 3H7c-1.7 0-3-1.3-3-3V7c0-1.7 1.3-3 3-3h10zm-5 3a5 5 0 100 10 5 5 0 000-10zm0 2a3 3 0 110 6 3 3 0 010-6zm4.5-.2a1.3 1.3 0 110 2.6 1.3 1.3 0 010-2.6z" />
    </svg>
  );
}
