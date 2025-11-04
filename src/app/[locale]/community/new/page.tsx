// @ts-nocheck - Las tablas se crearán al ejecutar la migración SQL
"use client";

import { useState } from "react";
import { supabase } from "@/app/lib/supabase-client";
import { useRouter } from "next/navigation";

export default function NewPostPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [visibility, setVisibility] = useState<"public" | "private">("public");
  const [loading, setLoading] = useState(false);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(selectedFile);
    }
  }

  async function publish() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      alert("Debes iniciar sesión para publicar");
      return;
    }
    if (!file) {
      alert("Sube una imagen primero");
      return;
    }

    setLoading(true);

    try {
      // Subir imagen al bucket recipes (o crea uno específico 'posts')
      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("recipes")
        .upload(`posts/${fileName}`, file);

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("recipes").getPublicUrl(`posts/${fileName}`);

      // Crear post
      const { error: insertError } = await supabase.from("posts").insert({
        user_id: user.id,
        image_url: publicUrl,
        caption: caption.trim() || null,
        visibility,
      });

      if (insertError) throw insertError;

      router.push("/community");
      router.refresh();
    } catch (error: any) {
      console.error("Error publicando:", error);
      alert(error.message || "Error al publicar");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-cocorico-red dark:text-amber-400">
        Nueva publicación 📸
      </h1>

      <div className="space-y-4">
        <div>
          <label htmlFor="image-upload" className="block text-sm font-medium mb-2">Imagen</label>
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-cocorico-yellow file:text-neutral-800 hover:file:bg-amber-300"
          />
          {preview && (
            <div className="mt-3 relative w-full h-64 rounded-lg overflow-hidden border dark:border-neutral-700">
              <img src={preview} alt="Preview" className="w-full h-full object-cover" />
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Descripción</label>
          <textarea
            className="w-full border dark:border-neutral-700 rounded-lg p-3 dark:bg-neutral-800 dark:text-white resize-none"
            rows={4}
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Escribe un pie de foto..."
            maxLength={500}
          />
          <p className="text-xs text-neutral-500 mt-1">{caption.length}/500</p>
        </div>

        <div>
          <label htmlFor="visibility-select" className="block text-sm font-medium mb-2">Visibilidad</label>
          <select
            id="visibility-select"
            value={visibility}
            onChange={(e) => setVisibility(e.target.value as "public" | "private")}
            className="w-full border dark:border-neutral-700 rounded-lg p-2 dark:bg-neutral-800"
          >
            <option value="public">🌍 Pública (todos pueden ver)</option>
            <option value="private">🔒 Privada (solo tú)</option>
          </select>
        </div>

        <div className="flex gap-3">
          <button
            onClick={publish}
            disabled={loading || !file}
            className="flex-1 bg-cocorico-red text-white px-4 py-3 rounded-lg font-semibold hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {loading ? "Publicando..." : "Publicar"}
          </button>
          <button
            onClick={() => router.back()}
            className="px-4 py-3 border dark:border-neutral-700 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
