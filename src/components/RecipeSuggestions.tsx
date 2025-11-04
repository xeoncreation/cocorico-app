"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import VersionManager from "@/components/VersionManager";

export default function RecipeSuggestions({ 
  recipeText, 
  recipeId 
}: { 
  recipeText: string; 
  recipeId?: number;
}) {
  const [loading, setLoading] = useState(false);
  const [suggestion, setSuggestion] = useState("");
  const [currentType, setCurrentType] = useState("");

  async function getSuggestion(type: string) {
    setLoading(true);
    setSuggestion("");
  setCurrentType(type);
    try {
      const res = await fetch("/api/suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, recipe: recipeText }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error");
      setSuggestion(data.answer);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mt-6 border-t pt-4 space-y-3">
      <h2 className="font-semibold text-amber-800">✨ Sugerencias de Cocorico</h2>
      <div className="flex flex-wrap gap-2">
        {["saludable", "económica", "vegetariana", "acompañamiento"].map((type) => (
          <Button
            key={type}
            onClick={() => getSuggestion(type)}
            disabled={loading}
            variant="outline"
            size="sm"
          >
            {loading ? "Pensando..." : `Versión ${type}`}
          </Button>
        ))}
      </div>

      {suggestion && (
        <div className="bg-white border rounded p-4 mt-3 text-sm leading-relaxed text-neutral-700 whitespace-pre-line">
          {suggestion}
          {recipeId && (
            <VersionManager 
              baseId={recipeId} 
              suggestion={suggestion} 
              variantType={currentType} 
            />
          )}
        </div>
      )}
    </section>
  );
}
