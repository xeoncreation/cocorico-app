"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function DashboardPage() {
  const [recipes, setRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        window.location.href = "/";
        return;
      }
      setUser(user);
      const { data, error } = await supabase
        .from("recipes")
        .select("id, title, visibility, slug, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (!error) setRecipes(data || []);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <p className="p-6">Cargando tus recetas...</p>;

  return (
    <main className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-amber-800">
        🐓 Mis recetas ({recipes.length})
      </h1>

      <div className="flex justify-between">
        <Link
          href="/dashboard/stats"
          className="px-3 py-2 border rounded text-sm text-amber-700 hover:bg-amber-50"
        >
          Ver estadísticas 📊
        </Link>
        <Link
          href="/dashboard/new"
          className="px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700"
        >
          + Nueva receta
        </Link>
      </div>

      {recipes.length === 0 ? (
        <p className="text-neutral-600">
          Aún no has creado ninguna receta. ¡Empieza ahora!
        </p>
      ) : (
        <ul className="divide-y divide-neutral-200">
          {recipes.map((r) => (
            <li
              key={r.id}
              className="py-3 flex items-center justify-between text-sm"
            >
              <Link
                href={`/r/${user.id}/${r.slug}`}
                className="text-amber-800 hover:underline"
              >
                {r.title}
              </Link>
              <div className="flex gap-3 text-neutral-500">
                <span>{r.visibility}</span>
                <Link
                  href={`/dashboard/edit/${r.id}`}
                  className="hover:text-amber-700"
                >
                  ✏️ Editar
                </Link>
                <Link
                  href={`/dashboard/delete/${r.id}`}
                  className="hover:text-red-700"
                >
                  🗑️ Eliminar
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
