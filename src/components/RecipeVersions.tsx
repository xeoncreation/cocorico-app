"use client";

import { useEffect, useState } from "react";

interface Version {
  id: number;
  variant_type: string;
  content: any;
  created_at: string;
}

export default function RecipeVersions({ baseId }: { baseId: string }) {
  const [versions, setVersions] = useState<Version[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadVersions();
  }, [baseId]);

  async function loadVersions() {
    try {
      const res = await fetch(`/api/versions/list?base=${baseId}`);
      const data = await res.json();
      
      if (res.ok) {
        setVersions(data.rows || []);
      } else {
        setError(data.error || "Error al cargar versiones");
      }
    } catch (err: any) {
      setError(err.message || "Error al cargar versiones");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div className="text-sm text-neutral-500">Cargando versiones...</div>;
  }

  if (error) {
    return <div className="text-sm text-red-600">Error: {error}</div>;
  }

  if (!versions.length) {
    return null;
  }

  return (
    <section className="mt-6 border-t pt-6">
      <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
        <span>🤖</span>
        <span>Versiones generadas por IA</span>
      </h3>
      <ul className="space-y-3">
        {versions.map((v) => (
          <li key={v.id} className="p-4 border rounded-lg bg-neutral-50 hover:bg-amber-50 transition">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-neutral-700">
                {v.variant_type ?? "IA"}
              </span>
              <span className="text-xs text-neutral-500">
                {new Date(v.created_at).toLocaleString()}
              </span>
            </div>
            {v.content && (
              <div className="mt-2 p-3 bg-white rounded border text-sm">
                {typeof v.content === 'string' ? (
                  <pre className="whitespace-pre-wrap font-mono text-xs">{v.content}</pre>
                ) : v.content.text ? (
                  <p className="whitespace-pre-wrap">{v.content.text}</p>
                ) : (
                  <pre className="whitespace-pre-wrap font-mono text-xs">
                    {JSON.stringify(v.content, null, 2)}
                  </pre>
                )}
              </div>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
