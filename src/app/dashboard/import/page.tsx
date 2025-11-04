"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function ImportRecipePage() {
  const [url, setUrl] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState("");
  const router = useRouter();

  async function handleImport(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setOutput("");

    try {
      const formData = new FormData();
      if (url) formData.append("url", url);
      if (image) formData.append("image", image);

      const res = await fetch("/api/import", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error desconocido");

      setOutput(data.cleanedText);
      toast.success("Receta importada con éxito");
    } catch (err: any) {
      toast.error("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  async function saveToRecipes() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return toast.error("Debes iniciar sesión.");

    const { error } = await supabase.from("recipes").insert({
      user_id: user.id,
      title: output.split("\n")[0] || "Nueva receta importada",
      description: "Importada automáticamente",
      content_json: { raw: output },
      visibility: "private",
    });

    if (error) return toast.error(error.message);
    toast.success("Receta guardada en tu panel");
    router.push("/dashboard");
  }

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-amber-800">
        📥 Importar receta
      </h1>
      <form onSubmit={handleImport} className="space-y-4">
        <Input
          type="url"
          placeholder="Pega una URL (opcional)"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <div>
          <label className="block text-sm font-medium mb-1">O sube una foto 📸</label>
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files?.[0] || null)}
          />
        </div>

        <Button type="submit" disabled={loading}>
          {loading ? "Importando..." : "Importar"}
        </Button>
      </form>

      {output && (
        <section className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-2">Vista previa</h2>
          <Textarea
            value={output}
            onChange={(e) => setOutput(e.target.value)}
            rows={12}
          />
          <div className="flex justify-end mt-3">
            <Button onClick={saveToRecipes}>Guardar en mis recetas</Button>
          </div>
        </section>
      )}
    </main>
  );
}
