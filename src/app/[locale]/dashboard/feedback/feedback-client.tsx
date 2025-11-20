// src/app/[locale]/dashboard/feedback/feedback-client.tsx
"use client";

import { useState } from "react";
import { RippleButton } from "@/components/ui/ripple-button";
import { createClientComponentClient } from "@/lib/supabase/client";
import useSWR from "swr";
import { motion } from "framer-motion";

export default function FeedbackClient() {
  const supabase = createClientComponentClient();
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const fetcher = (url: string) => fetch(url).then((r) => r.json());
  const { data } = useSWR("/api/feedback/list", fetcher, { refreshInterval: 4000 });

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
    <div className="space-y-10 p-6">
      <h1 className="text-3xl font-bold text-primary">Feedback & Sugerencias</h1>

      <div className="glass-card glass-card-blue glass-frosted-border p-6">
        <form onSubmit={submit} className="space-y-4">
          <select
            name="category"
            title="Categoría de feedback"
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
            aria-label="Adjuntar captura de pantalla"
            title="Adjuntar imagen"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />

          <RippleButton disabled={loading} className="bg-primary text-white">
            Enviar feedback
          </RippleButton>
        </form>
      </div>

      <div className="glass-card glass-card-orange glass-frosted-border p-6">
        <h2 className="text-xl font-semibold mb-4">Historial</h2>
        <div className="space-y-4">
          {data?.data && data.data.map((item: any) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card glass-card-purple glass-frosted-border p-4"
            >
              <div className="flex justify-between items-center">
                <div className="font-semibold">{item.title}</div>
                <div className="text-sm opacity-60">{item.status}</div>
              </div>

              <p className="text-sm mt-2">{item.message}</p>

              {item.image_url && (
                <img src={item.image_url} className="rounded-lg mt-3 max-h-40" alt="feedback" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
