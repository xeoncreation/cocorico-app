"use client";
import { useState } from "react";
import LiveVision from "./LiveVision";

export default function SmartCamera({ onLabels }: { onLabels?: (labels: string[]) => void }) {
  const [labels, setLabels] = useState<string[]>([]);
  const [mode, setMode] = useState<"local" | "cloud">("local");

  function handleDetect(arr: string[]) {
    setLabels(arr);
    onLabels?.(arr);
  }
  return (
    <div className="mt-6">
      <div className="mb-2 flex items-center gap-2 text-sm">
        <span className="text-neutral-600">Motor:</span>
        <select
          value={mode}
          onChange={(e) => setMode(e.target.value as any)}
          className="border rounded px-2 py-1"
          aria-label="Seleccionar motor de visión"
        >
          <option value="local">Local (TF.js)</option>
          <option value="cloud">Nube (Replicate)</option>
        </select>
      </div>
      <LiveVision mode={mode} onDetect={handleDetect} />
      {labels.length > 0 && (
        <div className="mt-3 bg-yellow-100 dark:bg-yellow-900/30 p-4 rounded-lg shadow">
          <p className="font-medium">🥕 Ingredientes detectados:</p>
          <p>{labels.join(", ")}</p>
        </div>
      )}
    </div>
  );
}
