import { createServerComponentClient } from "@/lib/supabase/client";
import { redirect } from "next/navigation";
import Link from "next/link";
import GlassCard from "@/components/ui/GlassCard";
import Wallpaper from "@/components/layout/Wallpaper";
import { ArrowRight } from "lucide-react";

export default async function CommunityPage({ params }: { params: { locale: string } }) {
  const supabase = await createServerComponentClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect(`/${params.locale}/login`);

  // Fetch recent public recipes for feed preview
  const { data: recentRecipes } = await supabase
    .from("recipes")
    .select("id, title, created_at, user_id")
    .eq("visibility", "public")
    .order("created_at", { ascending: false })
    .limit(3);

  return (
    <>
      <Wallpaper
        imageLight="/branding/COMUNIDAD_MODO_CLARO.png"
        imageDark="/branding/COMUNIDAD_MODO_OSCURO.png"
      />
      <div className="space-y-8">
      {/* Welcome Section */}
      <GlassCard className="p-8 text-center">
        <h1 className="heading-display text-4xl md:text-5xl mb-4 glass-text-strong">
          🌟 Bienvenido a la Comunidad Cocorico
        </h1>
        <p className="body-large text-lg glass-text-medium max-w-2xl mx-auto">
          Comparte recetas, participa en retos y conecta con otros amantes de la cocina
        </p>
      </GlassCard>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <GlassCard className="p-6 text-center">
          <div className="heading-1 text-3xl text-cocorico-red dark:text-cocorico-mango mb-2">2.4K+</div>
          <div className="body-small glass-text-medium">👥 Miembros Activos</div>
        </GlassCard>
        <GlassCard className="p-6 text-center">
          <div className="heading-1 text-3xl text-cocorico-orange dark:text-cocorico-yellow mb-2">8.7K+</div>
          <div className="body-small glass-text-medium">🍲 Recetas Compartidas</div>
        </GlassCard>
        <GlassCard className="p-6 text-center">
          <div className="heading-1 text-3xl text-cocorico-avocado dark:text-cocorico-turquoise mb-2">145+</div>
          <div className="body-small glass-text-medium">🏆 Retos Completados</div>
        </GlassCard>
        <GlassCard className="p-6 text-center">
          <div className="text-3xl font-bold text-cocorico-datil dark:text-cocorico-mango mb-2">34K+</div>
          <div className="text-sm glass-text-medium">💬 Mensajes de Chat</div>
        </GlassCard>
      </div>

      {/* Feed Preview */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold glass-text-strong">📰 Feed de Recetas</h2>
          <Link
            href={`/${params.locale}/community/feed`}
            className="flex items-center gap-2 text-amber-600 dark:text-amber-400 hover:underline font-semibold"
          >
            Ver todas <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        
        <div className="grid gap-4 md:grid-cols-3">
          {recentRecipes && recentRecipes.length > 0 ? (
            recentRecipes.map((recipe: any) => (
              <GlassCard key={recipe.id} className="p-6 hover:scale-105 transition-transform">
                <h3 className="font-bold text-lg mb-2 glass-text-strong">{recipe.title}</h3>
                <p className="text-sm glass-text-soft mb-4">
                  {new Date(recipe.created_at).toLocaleDateString(params.locale)}
                </p>
                <Link
                  href={`/${params.locale}/recipes/${recipe.id}`}
                  className="text-amber-600 dark:text-amber-400 hover:underline text-sm font-semibold"
                >
                  Ver receta →
                </Link>
              </GlassCard>
            ))
          ) : (
            <GlassCard className="p-6 col-span-3 text-center">
              <p className="glass-text-medium">No hay recetas públicas aún. ¡Sé el primero en compartir!</p>
            </GlassCard>
          )}
        </div>
      </section>

      {/* Challenges Preview */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold glass-text-strong">🏆 Retos Activos</h2>
          <Link
            href={`/${params.locale}/community/challenges`}
            className="flex items-center gap-2 text-amber-600 dark:text-amber-400 hover:underline font-semibold"
          >
            Ver todos <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2">
          <GlassCard className="p-6">
            <div className="flex items-start gap-4">
              <div className="text-4xl">🔍</div>
              <div className="flex-1">
                <h3 className="font-bold text-lg mb-2 glass-text-strong">Explorador de Alimentos</h3>
                <p className="text-sm glass-text-medium mb-3">Escanea 5 productos esta semana</p>
                <div className="w-full bg-white/20 dark:bg-slate-800/40 rounded-full h-2">
                  <div className="bg-amber-500 h-2 rounded-full" style={{ width: "40%" }}></div>
                </div>
                <p className="text-xs glass-text-soft mt-2">2 de 5 completados</p>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <div className="flex items-start gap-4">
              <div className="text-4xl">🥗</div>
              <div className="flex-1">
                <h3 className="font-bold text-lg mb-2 glass-text-strong">Chef Saludable</h3>
                <p className="text-sm glass-text-medium mb-3">Cocina 3 recetas saludables</p>
                <div className="w-full bg-white/20 dark:bg-slate-800/40 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: "33%" }}></div>
                </div>
                <p className="text-xs glass-text-soft mt-2">1 de 3 completados</p>
              </div>
            </div>
          </GlassCard>
        </div>
      </section>

      {/* Leaderboard Preview */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold glass-text-strong">📊 Ranking Semanal</h2>
          <Link
            href={`/${params.locale}/community/leaderboard`}
            className="flex items-center gap-2 text-amber-600 dark:text-amber-400 hover:underline font-semibold"
          >
            Ver completo <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        
        <div className="grid gap-3 md:grid-cols-3">
          <GlassCard className="p-5 bg-gradient-to-br from-yellow-400/20 to-amber-500/20 border-amber-400/40">
            <div className="flex items-center gap-4">
              <div className="text-5xl">🥇</div>
              <div className="flex-1">
                <div className="text-sm glass-text-soft mb-1">1º Lugar</div>
                <h4 className="font-bold text-lg glass-text-strong">ChefMaster👩‍🍳</h4>
                <p className="text-sm text-amber-600 dark:text-amber-400 font-semibold">2,840 XP</p>
              </div>
            </div>
          </GlassCard>
          
          <GlassCard className="p-5 bg-gradient-to-br from-gray-400/20 to-gray-500/20 border-gray-400/40">
            <div className="flex items-center gap-4">
              <div className="text-5xl">🥈</div>
              <div className="flex-1">
                <div className="text-sm glass-text-soft mb-1">2º Lugar</div>
                <h4 className="font-bold text-lg glass-text-strong">CocinaFeliz🎉</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-semibold">2,105 XP</p>
              </div>
            </div>
          </GlassCard>
          
          <GlassCard className="p-5 bg-gradient-to-br from-orange-600/20 to-amber-700/20 border-orange-500/40">
            <div className="flex items-center gap-4">
              <div className="text-5xl">🥉</div>
              <div className="flex-1">
                <div className="text-sm glass-text-soft mb-1">3º Lugar</div>
                <h4 className="font-bold text-lg glass-text-strong">RecetasAbuela👵</h4>
                <p className="text-sm text-orange-600 dark:text-orange-400 font-semibold">1,920 XP</p>
              </div>
            </div>
          </GlassCard>
        </div>
      </section>

      {/* Chat Access */}
      <section>
        <GlassCard className="p-8 text-center bg-gradient-to-br from-purple-500/20 to-pink-500/20">
          <div className="text-5xl mb-4">💬</div>
          <h2 className="text-2xl font-bold mb-3 glass-text-strong">Chat de la Comunidad</h2>
          <p className="glass-text-medium mb-6 max-w-md mx-auto">
            Conecta con otros miembros, comparte tips y haz preguntas
          </p>
          <Link
            href={`/${params.locale}/community/chat`}
            className="inline-block px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-full hover:scale-105 transition-transform shadow-lg"
          >
            Ir al Chat →
          </Link>
        </GlassCard>
      </section>
      </div>
    </>
  );
}
