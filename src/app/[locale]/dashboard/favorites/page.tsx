import { createServerComponentClient } from "@/lib/supabase/client";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { AppBackground } from "@/components/layout/AppBackground";
import GlassCard from "@/components/ui/GlassCard";
import Wallpaper from "@/components/layout/Wallpaper";

export default async function FavoritesPage({ params: { locale } }: { params: { locale: string } }) {
  const supabase = await createServerComponentClient();
  const t = await getTranslations({ locale, namespace: "favorites" });
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/${locale}/login`);

  // Fetch favorites with recipe details and timestamps
  const { data: favs } = await supabase
    .from("favorites")
    .select(`
      recipe_id,
      created_at,
      recipes:recipe_id (
        id,
        title,
        slug,
        user_id,
        visibility,
        created_at,
        prep_time,
        servings
      )
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const recipes = (favs || [])
    .map((f: any) => ({ ...f.recipes, favorited_at: f.created_at }))
    .filter((r: any) => r?.id);

  return (
    <>
      <Wallpaper
        imageLight="/branding/FAVORITOS_MODO_CLARO.jpg"
        imageDark="/branding/FAVORITOS_MODO_OSCURO.jpg"
      />
      <AppBackground variantOverride="dashboard">
        <div className="max-w-4xl mx-auto py-8 px-4">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Image
              src="/branding/cocorico-mascot-anim-optimized.gif"
              alt="Cocorico animado"
              width={64}
              height={95}
              className="drop-shadow-md"
              unoptimized
            />
            <div>
              <h1 className="text-3xl font-bold text-amber-900 dark:text-amber-100">
                💛 {t("title")}
              </h1>
              <p className="text-neutral-600 dark:text-neutral-400 mt-1">
                {t("subtitle")}
              </p>
            </div>
          </div>

          {/* Empty State */}
          {recipes.length === 0 ? (
            <GlassCard className="p-12 text-center">
              <div className="mb-6">
                <span className="text-6xl">💔</span>
              </div>
              <h2 className="text-2xl font-semibold text-neutral-800 dark:text-neutral-200 mb-3">
                {t("empty.title")}
              </h2>
              <p className="text-neutral-600 dark:text-neutral-400 mb-6 max-w-md mx-auto">
                {t("empty.subtitle")}
              </p>
              <Link
                href={`/${locale}/recipes/search`}
                className="inline-block px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg transition-colors"
              >
                {t("empty.cta")}
              </Link>
            </GlassCard>
          ) : (
            /* Recipe Grid */
            <div className="grid gap-4 md:grid-cols-2">
              {recipes.map((recipe: any) => (
                <Link
                  key={recipe.id}
                  href={`/${locale}/recipes/${recipe.id}`}
                  className="group"
                >
                  <GlassCard className="p-5 h-full hover:scale-[1.02] transition-transform">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors line-clamp-2 flex-1">
                        {recipe.title}
                      </h3>
                      <span className="text-2xl ml-2">💛</span>
                    </div>

                    <div className="flex flex-wrap gap-3 text-sm text-neutral-600 dark:text-neutral-400 mb-3">
                      {recipe.prep_time && (
                        <span className="flex items-center gap-1">
                          ⏱️ {recipe.prep_time} min
                        </span>
                      )}
                      {recipe.servings && (
                        <span className="flex items-center gap-1">
                          🍽️ {recipe.servings} porciones
                        </span>
                      )}
                      {recipe.visibility !== "public" && (
                        <span className="px-2 py-0.5 bg-neutral-200 dark:bg-neutral-700 rounded text-xs">
                          Privada
                        </span>
                      )}
                    </div>

                    <div className="text-xs text-neutral-500 dark:text-neutral-500">
                      Guardado el{" "}
                      {new Date(recipe.favorited_at).toLocaleDateString(locale, {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </div>
                  </GlassCard>
                </Link>
              ))}
            </div>
          )}

          {/* Stats Footer */}
          {recipes.length > 0 && (
            <div className="mt-8 text-center">
              <GlassCard className="p-6 inline-block">
                <p className="text-neutral-600 dark:text-neutral-400">
                  <span className="font-semibold text-orange-600 dark:text-orange-400 text-2xl">
                    {recipes.length}
                  </span>{" "}
                  {recipes.length === 1 ? "receta favorita" : "recetas favoritas"}
                </p>
              </GlassCard>
            </div>
          )}
        </div>
      </AppBackground>
    </>
  );
}
