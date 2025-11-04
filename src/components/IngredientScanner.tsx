"use client";
import { useState } from "react";

export default function IngredientScanner() {
  const [image, setImage] = useState<File | null>(null);
  const [result, setResult] = useState<string>("");
  const [loading, setLoading] = useState(false);

  async function analyze() {
    if (!image) return;
    setLoading(true);
    setResult("");
    try {
      const form = new FormData();
      form.append("image", image);
      const res = await fetch("/api/ai/vision", { method: "POST", body: form });
      const data = await res.json();
      setResult(data.answer || data.error || "No se detectaron ingredientes.");
    } catch (e: any) {
      setResult(e?.message || "Error analizando la imagen");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 border rounded-xl bg-white shadow">
      <h2 className="text-xl font-semibold mb-4">📸 Reconocer ingredientes</h2>
      <label className="block mb-2 text-sm text-neutral-700" htmlFor="ingredient-image">Imagen de ingredientes</label>
      <input
        id="ingredient-image"
        title="Selecciona una foto de tus ingredientes"
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files?.[0] || null)}
      />
      <button
        onClick={analyze}
        disabled={!image || loading}
        className="mt-3 px-4 py-2 bg-orange-600 text-white rounded-lg disabled:opacity-50"
      >
        {loading ? "Analizando..." : "Analizar imagen"}
      </button>
      {result && (
        <p className="mt-4 text-neutral-700 whitespace-pre-line">{result}</p>
      )}
    </div>
  );
}
