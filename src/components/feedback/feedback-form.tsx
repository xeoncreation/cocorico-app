"use client";

import { useState } from "react";
import { RippleButton } from "@/components/ui/ripple-button";
import { createClientComponentClient } from "@/lib/supabase/client";

export function FeedbackForm() {
  const supabase = createClientComponentClient();
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  async function uploadImage() {
    if (!file) return null;

    const ext = file.name.split(".").pop();
    const filePath = `feedback/${Date.now()}.${ext}`;

    const { data, error } = await supabase.storage
      .from("assets")
      .upload(filePath, file);

    if (error) return null;

    return supabase.storage.from("assets").getPublicUrl(filePath).data.publicUrl;
  }

  async function submit(e: any) {
    e.preventDefault();
    setLoading(true);

    const form = new FormData(e.target);
    const category = form.get("category");
    const title = form.get("title");
    const message = form.get("message");
    const image_url = await uploadImage();

    await fetch("/api/feedback/new", {
      method: "POST",
      body: JSON.stringify({
        category,
        title,
        message,
        image_url
      })
    });

    setLoading(false);
    e.target.reset();
    setFile(null);
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <select
        name="category"
        aria-label="Categoría de feedback"
        className="w-full rounded-xl bg-surface p-3"
        required
      >
        <option value="bug">Bug 🐞</option>
        <option value="feature">Nueva función ✨</option>
        <option value="improvement">Mejora 🔧</option>
      </select>

      <input
        name="title"
        className="w-full rounded-xl bg-surface p-3"
        placeholder="Título"
        required
      />

      <textarea
        name="message"
        className="w-full rounded-xl bg-surface p-3"
        placeholder="Describe tu sugerencia…"
        required
      />

      <input
        type="file"
        aria-label="Adjuntar captura"
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
      />

      <RippleButton disabled={loading} className="bg-primary text-white">
        Enviar feedback
      </RippleButton>
    </form>
  );
}
