"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { RippleButton } from "@/components/ui/ripple-button";

export default function NewPostClient() {
  const [content, setContent] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const submit = async () => {
    if (!content.trim()) return;
    setLoading(true);
    setSuccess(false);
    const fd = new FormData();
    fd.append("content", content.trim());
    if (file) fd.append("image", file);
    const res = await fetch("/api/community/posts", { method: "POST", body: fd });
    setLoading(false);
    if (res.ok) {
      setContent("");
      setFile(null);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    }
  };

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-bold">Crear nueva publicación</h1>
      <div className="glass-card glass-card-purple glass-frosted-border p-6 rounded-2xl space-y-4">
        <Textarea
          placeholder="Comparte algo con la comunidad..."
          rows={4}
          className="rounded-xl"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <Input
          type="file"
          accept="image/*"
          aria-label="Imagen opcional"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />
        <RippleButton
          disabled={!content.trim().length || loading}
          onClick={submit}
          className="h-12 w-full rounded-xl"
        >
          {loading ? "Publicando…" : success ? "Publicado" : "Publicar"}
        </RippleButton>
      </div>
    </section>
  );
}
