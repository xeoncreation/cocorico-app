"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import GlassCard from "@/components/ui/GlassCard";
import { ImagePlus, Send, CheckCircle2, AlertCircle, X } from "lucide-react";
import Image from "next/image";

export default function NewPostClient() {
  const [content, setContent] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] ?? null;
    setFile(selectedFile);
    
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setPreviewUrl(null);
    }
  };

  const removeImage = () => {
    setFile(null);
    setPreviewUrl(null);
  };

  const submit = async () => {
    if (!content.trim()) return;
    
    setLoading(true);
    setSuccess(false);
    setError(null);
    
    try {
      const fd = new FormData();
      fd.append("content", content.trim());
      if (file) fd.append("image", file);
      
      const res = await fetch("/api/community/posts", { method: "POST", body: fd });
      
      if (res.ok) {
        setContent("");
        setFile(null);
        setPreviewUrl(null);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        const data = await res.json();
        setError(data.error || "Error al publicar");
      }
    } catch (err) {
      setError("Error de red al publicar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="heading-display text-cocorico-brown dark:text-amber-100">
          Crear Publicación
        </h1>
        <p className="body-large text-neutral-600 dark:text-neutral-400">
          Comparte tus recetas, tips y experiencias culinarias con la comunidad
        </p>
      </div>

      {/* Success message */}
      {success && (
        <GlassCard className="p-4 bg-green-50/50 dark:bg-green-950/20 border-green-200/30 dark:border-green-800/30">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
            <div>
              <p className="body-regular font-semibold text-green-800 dark:text-green-200">
                ¡Publicado con éxito!
              </p>
              <p className="body-small text-green-700 dark:text-green-300">
                Tu publicación ya está visible en el feed de la comunidad.
              </p>
            </div>
          </div>
        </GlassCard>
      )}

      {/* Error message */}
      {error && (
        <GlassCard className="p-4 bg-red-50/50 dark:bg-red-950/20 border-red-200/30 dark:border-red-800/30">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
            <div>
              <p className="body-regular font-semibold text-red-800 dark:text-red-200">
                Error al publicar
              </p>
              <p className="body-small text-red-700 dark:text-red-300">{error}</p>
            </div>
          </div>
        </GlassCard>
      )}

      {/* Form */}
      <GlassCard className="p-6 space-y-6">
        {/* Textarea */}
        <div className="space-y-2">
          <label className="body-regular font-semibold text-neutral-800 dark:text-neutral-100">
            ¿Qué quieres compartir?
          </label>
          <Textarea
            placeholder="Comparte tu receta favorita, un tip de cocina, o pregunta algo a la comunidad..."
            rows={6}
            className="rounded-2xl bg-white/50 dark:bg-slate-800/50 border-white/30 dark:border-slate-700/50 resize-none focus:ring-2 focus:ring-cocorico-red body-regular"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <div className="flex justify-between items-center">
            <span className="body-small text-neutral-500 dark:text-neutral-400">
              {content.length} caracteres
            </span>
            <span className="body-small text-neutral-500 dark:text-neutral-400">
              {content.length > 500 ? "⚠️ Intenta ser más conciso" : ""}
            </span>
          </div>
        </div>

        {/* Image upload */}
        <div className="space-y-2">
          <label className="body-regular font-semibold text-neutral-800 dark:text-neutral-100">
            Imagen (opcional)
          </label>
          
          {previewUrl ? (
            <div className="relative rounded-2xl overflow-hidden border-2 border-white/30 dark:border-slate-700/50">
              <Image
                src={previewUrl}
                alt="Preview"
                width={800}
                height={400}
                className="w-full h-64 object-cover"
              />
              <button
                onClick={removeImage}
                className="absolute top-2 right-2 p-2 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors shadow-lg"
                aria-label="Eliminar imagen"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <label className="block cursor-pointer">
              <div className="border-2 border-dashed border-white/30 dark:border-slate-700/50 rounded-2xl p-8 text-center hover:border-cocorico-red hover:bg-cocorico-red/5 transition-colors">
                <ImagePlus className="w-12 h-12 mx-auto mb-3 text-neutral-400 dark:text-neutral-500" />
                <p className="body-regular font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Haz clic para subir una imagen
                </p>
                <p className="body-small text-neutral-500 dark:text-neutral-400">
                  PNG, JPG, GIF hasta 5MB
                </p>
              </div>
              <Input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
          )}
        </div>

        {/* Submit button */}
        <Button
          disabled={!content.trim().length || loading}
          onClick={submit}
          className="w-full h-12 bg-cocorico-red hover:bg-cocorico-red/90 text-white rounded-2xl font-semibold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
              Publicando...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Send className="w-5 h-5" />
              Publicar
            </span>
          )}
        </Button>
      </GlassCard>

      {/* Tips */}
      <GlassCard className="p-4 bg-blue-50/50 dark:bg-blue-950/20 border-blue-200/30 dark:border-blue-800/30">
        <h3 className="heading-3 text-blue-800 dark:text-blue-200 mb-2">💡 Consejos</h3>
        <ul className="body-small text-blue-700 dark:text-blue-300 space-y-1 list-disc list-inside">
          <li>Sé claro y detallado en tus recetas</li>
          <li>Incluye fotos de buena calidad para mayor interacción</li>
          <li>Respeta a los demás miembros de la comunidad</li>
          <li>Evita contenido ofensivo o spam</li>
        </ul>
      </GlassCard>
    </section>
  );
}
