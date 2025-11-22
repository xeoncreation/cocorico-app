"use client";

import { useEffect, useState } from "react";
import { createClientComponentClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import XpHud from "@/components/dashboard/XpHud";
import { AppBackground } from "@/components/layout/AppBackground";
import { Button } from "@/components/ui/button";
import { Plus, BarChart2, FlaskConical, Edit, Trash2, Eye } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";

export default function DashboardClient() {
  const [recipes, setRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const supabase = createClientComponentClient();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations();

  useEffect(() => {
    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push(`/${locale}/login`);
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
  }, [supabase, router, locale]);

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar esta receta?")) return;
    
    const { error } = await supabase.from("recipes").delete().eq("id", id);
    if (!error) {
      setRecipes(recipes.filter((r) => r.id !== id));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cocorico-red"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold text-cocorico-brown dark:text-amber-100">
          🐓 {t("nav.dashboard")}
        </h1>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/${locale}/dashboard/stats`}>
              <BarChart2 className="w-4 h-4 mr-2" />
              Estadísticas
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href={`/${locale}/dashboard/lab`}>
              <FlaskConical className="w-4 h-4 mr-2" />
              Lab IA
            </Link>
          </Button>
          <Button className="bg-cocorico-red hover:bg-cocorico-red/90 text-white" asChild>
            <Link href={`/${locale}/recipes/new`}>
              <Plus className="w-4 h-4 mr-2" />
              Nueva Receta
            </Link>
          </Button>
        </div>
      </div>

      {/* XP HUD */}
      <XpHud />

      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-cocorico-brown dark:text-amber-100">
          Mis Recetas ({recipes.length})
        </h2>

        {recipes.length === 0 ? (
          <GlassCard className="p-8 text-center">
            <p className="text-neutral-600 dark:text-neutral-400 mb-4">
              Aún no has creado ninguna receta. ¡Empieza ahora!
            </p>
            <Button asChild>
              <Link href={`/${locale}/recipes/new`}>Crear mi primera receta</Link>
            </Button>
          </GlassCard>
        ) : (
          <div className="grid gap-4">
            {recipes.map((r) => (
              <GlassCard key={r.id} className="p-4 flex items-center justify-between group hover:scale-[1.01] transition-transform">
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/${locale}/recipes/${r.id}`}
                    className="text-lg font-medium text-cocorico-brown dark:text-amber-100 hover:text-cocorico-red dark:hover:text-amber-300 truncate block"
                  >
                    {r.title}
                  </Link>
                  <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                    <span className={`px-2 py-0.5 rounded-full ${
                      r.visibility === 'public' 
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                        : 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-400'
                    }`}>
                      {r.visibility === 'public' ? 'Pública' : 'Privada'}
                    </span>
                    <span>•</span>
                    <span>{new Date(r.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="icon" asChild title="Ver">
                    <Link href={`/${locale}/recipes/${r.id}`}>
                      <Eye className="w-4 h-4 text-neutral-500" />
                    </Link>
                  </Button>
                  <Button variant="ghost" size="icon" asChild title="Editar">
                    <Link href={`/${locale}/recipes/${r.id}/edit`}>
                      <Edit className="w-4 h-4 text-blue-500" />
                    </Link>
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleDelete(r.id)}
                    title="Eliminar"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              </GlassCard>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
