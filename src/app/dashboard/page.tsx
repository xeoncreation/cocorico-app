
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { AppBackground } from '@/components/layout/AppBackground'
import XpHud from "@/components/dashboard/XpHud";
import LegacyPageWrapper from "@/components/layout/LegacyPageWrapper";
import Wallpaper from "@/components/layout/Wallpaper";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function DashboardPage() {
  const [recipes, setRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Aquí iría la lógica de carga de recetas y usuario
  }, []);

  return (
    <>
      <Wallpaper
        imageLight="/branding/MIS_RECETAS_MODO_CLARO.jpg"
        imageDark="/branding/MIS_RECETAS_MODO_OSCURO.jpg"
      />
      <LegacyPageWrapper>
        <main className="max-w-4xl mx-auto p-6 space-y-6">
          <h1 className="text-2xl font-bold text-amber-800 glass-text-strong">
            🐓 Mis recetas ({recipes.length})
          </h1>

          {/* XP HUD */}
          <XpHud />

          <div className="flex justify-between">
            {/* ...resto del contenido... */}
          </div>
        </main>
      </LegacyPageWrapper>
    </>
  );
}
                <Link
                  href="/dashboard/stats"
                  className="px-3 py-2 border rounded text-sm text-amber-700 hover:bg-amber-50"
                >
                  Ver estadísticas 📊
                </Link>
                {/* ...resto del contenido... */}
              </div>
            </main>
          </LegacyPageWrapper>
        </>
      );
  return (
    <LegacyPageWrapper>
      <main className="max-w-4xl mx-auto p-6 space-y-6">
        <h1 className="text-2xl font-bold text-amber-800 glass-text-strong">
          🐓 Mis recetas ({recipes.length})
        </h1>

        {/* XP HUD */}
        <XpHud />

        <div className="flex justify-between">
          <Link
            href="/dashboard/stats"
            className="px-3 py-2 border rounded text-sm text-amber-700 hover:bg-amber-50"
          >
            Ver estadísticas 📊
          </Link>
          <div className="flex gap-2">
            <Link
              href="/dashboard/lab"
              className="px-3 py-2 border rounded text-sm text-amber-700 hover:bg-amber-50"
            >
              🧪 Laboratorio IA
            </Link>
            <Link
              href="/dashboard/new"
              className="px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700"
            >
              + Nueva receta
            </Link>
          </div>
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
    </LegacyPageWrapper>
  );
}
