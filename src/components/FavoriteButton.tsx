"use client";

import { useState, useEffect } from "react";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { Heart } from "lucide-react";
import { toast } from "sonner";

let supabase: SupabaseClient<any> | null = null;
function getSupabase(): SupabaseClient<any> | null {
  if (supabase) return supabase;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) {
    if (typeof window !== 'undefined') {
      console.warn('[FavoriteButton] Falta configuración de Supabase (NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY)');
    }
    return null;
  }
  supabase = createClient<any>(url, anon);
  return supabase;
}

export default function FavoriteButton({ recipeId }: { recipeId: number | string }) {
  const [isFav, setIsFav] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkFavorite();
  }, []);

  async function checkFavorite() {
    try {
      const s = getSupabase();
      if (!s) return;
      const {
        data: { user },
      } = await s.auth.getUser();
      if (!user) return;
      const { data, error } = await s
        .from("favorites")
        .select("id")
        .eq("user_id", user.id)
        .eq("recipe_id", recipeId)
        .maybeSingle();
      if (error) {
        // Tabla no existente o falta de permisos
        console.warn("Favorite check error:", error.message);
        return;
      }
      setIsFav(!!data);
    } catch (e) {
      console.warn("Favorite check exception", e);
    }
  }

  async function toggleFavorite() {
    setLoading(true);
    const s = getSupabase();
    if (!s) return toast.error("Configura Supabase en .env.local");
    const {
      data: { user },
    } = await s.auth.getUser();
    if (!user) return toast.error("Inicia sesión para guardar favoritos");

    try {
      if (isFav) {
        const { error } = await s
          .from("favorites")
          .delete()
          .eq("user_id", user.id)
          .eq("recipe_id", recipeId);
        if (error) throw error;
        toast("Eliminado de favoritos 💔");
        setIsFav(false);
      } else {
        const { error } = await s
          .from("favorites")
          .insert({ user_id: user.id, recipe_id: recipeId });
        if (error) throw error;
        toast("Añadido a favoritos 💛");
        setIsFav(true);
      }
    } catch (err: any) {
      const msg = err?.message || "Error de favoritos";
      if (msg.includes("relation") || msg.includes("favorites")) {
        toast.error("Activa las tablas en Supabase (favorites). Ve a supabase/migrations y ejecuta el SQL.");
      } else {
        toast.error(msg);
      }
    }
    setLoading(false);
  }

  return (
    <button
      onClick={toggleFavorite}
      disabled={loading}
      className={`flex items-center gap-1 text-sm ${
        isFav ? "text-amber-700" : "text-neutral-500"
      }`}
    >
      <Heart fill={isFav ? "currentColor" : "none"} size={16} />
      {isFav ? "Favorito" : "Guardar"}
    </button>
  );
}
