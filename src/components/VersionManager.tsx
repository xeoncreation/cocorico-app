"use client";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function VersionManager({ 
  baseId, 
  suggestion, 
  variantType 
}: { 
  baseId: number; 
  suggestion: string; 
  variantType: string;
}) {
  async function saveVersion() {
    try {
      const res = await fetch("/api/versions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          base_recipe_id: baseId,
          variant_type: variantType,
          content: { text: suggestion },
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success("Versión guardada con éxito 🐓");
    } catch (err: any) {
      toast.error(err.message);
    }
  }

  return (
    <div className="flex justify-end mt-3">
      <Button onClick={saveVersion} size="sm" variant="secondary">
        Guardar como versión IA 💾
      </Button>
    </div>
  );
}
