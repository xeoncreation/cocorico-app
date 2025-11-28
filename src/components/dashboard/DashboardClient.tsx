"use client";

import { useEffect, useState } from "react";
import { createClientComponentClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Plus, BarChart2, Edit, Trash2, Eye, Camera, MessageSquare, ChefHat, Heart, Search } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import dynamic from "next/dynamic";
import ContinueLearningWidget from "./ContinueLearningWidget";

const ProgressWidget = dynamic(() => import("@/components/dashboard/ProgressWidget"), {
  ssr: false,
});

export default function DashboardClient() {
  const [recipes, setRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const supabase = createClientComponentClient();
  const router = useRouter();
  let locale: string | undefined;
  let t: (k: string) => string = (s) => s;
  try {
    locale = useLocale();
    t = useTranslations();
  } catch {
    locale = undefined;
    t = (s) => s;
  }

  const linkWithLocale = (href: string) => (locale ? `/${locale}${href}` : href);

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
        .order("created_at", { ascending: false })
        .limit(6); // Limit to 6 recent recipes
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
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-4xl lg:text-5xl font-bold text-cocorico-brown dark:text-amber-100 mb-2">
            Hola, {user?.email?.split('@')[0]} 👋
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            ¿Qué vamos a cocinar hoy?
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild className="bg-cocorico-red hover:bg-red-700 text-white rounded-full">
            <Link href={linkWithLocale('/recipes/create')}>
              <Plus className="w-4 h-4 mr-2" />
              Nueva Receta
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Widgets */}
      <ProgressWidget />

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content Column (2/3) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Quick Actions Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <Link href={linkWithLocale('/scanner')} className="group">
              <GlassCard className="p-4 flex flex-col items-center justify-center gap-3 h-full hover:scale-105 transition-transform bg-gradient-to-br from-cocorico-mango/10 to-cocorico-datil/10 border-cocorico-mango/30">
                <div className="w-10 h-10 rounded-full bg-cocorico-mango/20 flex items-center justify-center text-cocorico-mango group-hover:bg-cocorico-mango group-hover:text-white transition-colors">
                  <Camera className="w-5 h-5" />
                </div>
                <span className="text-sm font-semibold text-cocorico-brown dark:text-amber-100">Escanear</span>
              </GlassCard>
            </Link>
            
            <Link href={linkWithLocale('/chat')} className="group">
              <GlassCard className="p-4 flex flex-col items-center justify-center gap-3 h-full hover:scale-105 transition-transform bg-gradient-to-br from-cocorico-red/10 to-cocorico-mango/10 border-cocorico-red/30">
                <div className="w-10 h-10 rounded-full bg-cocorico-red/20 flex items-center justify-center text-cocorico-red group-hover:bg-cocorico-red group-hover:text-white transition-colors">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <span className="text-sm font-semibold text-cocorico-brown dark:text-amber-100">Chat IA</span>
              </GlassCard>
            </Link>

            <Link href={linkWithLocale('/recipes/search')} className="group">
              <GlassCard className="p-4 flex flex-col items-center justify-center gap-3 h-full hover:scale-105 transition-transform bg-gradient-to-br from-cocorico-avocado/10 to-cocorico-turquoise/10 border-cocorico-avocado/30">
                <div className="w-10 h-10 rounded-full bg-cocorico-avocado/20 flex items-center justify-center text-cocorico-avocado group-hover:bg-cocorico-avocado group-hover:text-white transition-colors">
                  <Search className="w-5 h-5" />
                </div>
                <span className="text-sm font-semibold text-cocorico-brown dark:text-amber-100">Explorar</span>
              </GlassCard>
            </Link>

            <Link href={linkWithLocale('/dashboard/favorites')} className="group">
              <GlassCard className="p-4 flex flex-col items-center justify-center gap-3 h-full hover:scale-105 transition-transform bg-gradient-to-br from-cocorico-yellow/10 to-cocorico-orange/10 border-cocorico-yellow/30">
                <div className="w-10 h-10 rounded-full bg-cocorico-yellow/20 flex items-center justify-center text-cocorico-orange group-hover:bg-cocorico-yellow group-hover:text-white transition-colors">
                  <Heart className="w-5 h-5" />
                </div>
                <span className="text-sm font-semibold text-cocorico-brown dark:text-amber-100">Favoritos</span>
              </GlassCard>
            </Link>
          </div>

          {/* Continue Learning */}
          <ContinueLearningWidget />

          {/* Recent Recipes */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-cocorico-brown dark:text-amber-100 flex items-center gap-2">
                <ChefHat className="w-6 h-6" />
                Mis Recetas Recientes
              </h2>
              <Link 
                href={`/${locale}/dashboard/recipes`} 
                className="text-sm font-medium text-cocorico-red hover:underline"
              >
                Ver todas
              </Link>
            </div>

            {recipes.length === 0 ? (
              <GlassCard className="p-12 text-center">
                <div className="w-16 h-16 mx-auto bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mb-4">
                  <ChefHat className="w-8 h-8 text-neutral-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Aún no tienes recetas</h3>
                <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                  ¡Crea tu primera receta y empieza tu colección!
                </p>
                <Button asChild>
                  <Link href={`/${locale}/recipes/create`}>Crear Receta</Link>
                </Button>
              </GlassCard>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                {recipes.map((r) => (
                  <GlassCard key={r.id} className="p-5 group hover:scale-[1.02] transition-transform relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 bg-white/50 dark:bg-black/50 backdrop-blur-sm rounded-bl-xl">
                      <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-white/80 dark:hover:bg-black/80" asChild>
                        <Link href={`/${locale}/recipes/${r.id}/edit`}>
                          <Edit className="w-4 h-4 text-blue-500" />
                        </Link>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 hover:bg-white/80 dark:hover:bg-black/80"
                        onClick={() => handleDelete(r.id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>

                    <Link href={`/${locale}/recipes/${r.id}`} className="block">
                      <div className="flex items-start justify-between mb-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                          r.visibility === 'public' 
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                            : 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-400'
                        }`}>
                          {r.visibility === 'public' ? 'Pública' : 'Privada'}
                        </span>
                        <span className="text-xs text-neutral-500">
                          {new Date(r.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      
                      <h3 className="text-lg font-bold text-cocorico-brown dark:text-amber-100 mb-1 line-clamp-1 group-hover:text-cocorico-red transition-colors">
                        {r.title}
                      </h3>
                      
                      <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400 mt-3">
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" /> Ver
                        </span>
                      </div>
                    </Link>
                  </GlassCard>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Column (1/3) */}
        <div className="space-y-8">
          {/* Premium Promo */}
          <GlassCard className="p-6 bg-gradient-to-br from-amber-500/20 to-orange-500/20 border-amber-500/30">
            <h3 className="text-xl font-bold text-amber-800 dark:text-amber-100 mb-2">
              Cocorico Premium 👑
            </h3>
            <p className="text-sm text-amber-900/80 dark:text-amber-100/80 mb-4">
              Desbloquea recetas ilimitadas, análisis nutricional avanzado y más.
            </p>
            <Button className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white border-0">
              <Link href={`/${locale}/premium`}>Mejorar Plan</Link>
            </Button>
          </GlassCard>

          {/* Community Challenge Mini */}
          <GlassCard className="p-6">
            <h3 className="text-lg font-bold text-cocorico-brown dark:text-amber-100 mb-3">
              Reto Semanal 🏆
            </h3>
            <div className="bg-neutral-100 dark:bg-neutral-800/50 rounded-lg p-3 mb-3">
              <p className="font-medium text-sm">"Maestro de las Salsas"</p>
              <p className="text-xs text-neutral-500 mt-1">Termina en 2 días</p>
            </div>
            <Button variant="outline" className="w-full" asChild>
              <Link href={`/${locale}/community/challenges`}>Ver Retos</Link>
            </Button>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
