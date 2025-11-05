import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabase";
import Link from "next/link";
import Image from "next/image";
import IntlText from "@/components/IntlText";

export default async function FavoritesPage() {
  if (!supabaseServer) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600">Supabase no configurado</p>
      </div>
    );
  }

  const { data: { user } } = await supabaseServer.auth.getUser();
  if (!user) redirect("/login");

  // Fetch favorites with recipe details and timestamps
  const { data: favs } = await supabaseServer
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
    <main className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-neutral-900 dark:to-neutral-800 py-8 px-4">
      <div className="max-w-4xl mx-auto">
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
              💛 <IntlText k="favorites.title" fallback="Mis Favoritos" />
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400 mt-1">
              <IntlText k="favorites.subtitle" fallback="Recetas que has guardado" />
            </p>
          </div>
        </div>

        {/* Empty State */}
        {recipes.length === 0 ? (
          <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-xl p-12 text-center">
            <div className="mb-6">
              <span className="text-6xl">💔</span>
            </div>
            <h2 className="text-2xl font-semibold text-neutral-800 dark:text-neutral-200 mb-3">
              <IntlText k="favorites.empty.title" fallback="Sin favoritos todavía" />
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 mb-6 max-w-md mx-auto">
              <IntlText
                k="favorites.empty.subtitle"
                fallback="Toca el corazón 💛 en cualquier receta para guardarla aquí."
              />
            </p>
            <Link
              href="/recipes/search"
              className="inline-block px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg transition-colors"
            >
              <IntlText k="favorites.empty.cta" fallback="Explorar recetas" />
            </Link>
          </div>
        ) : (
          /* Recipe Grid */
          <div className="grid gap-4 md:grid-cols-2">
            {recipes.map((recipe: any) => (
              <Link
                key={recipe.id}
                href={`/r/${recipe.user_id}/${recipe.slug}`}
                className="group bg-white dark:bg-neutral-800 rounded-xl shadow-md hover:shadow-xl transition-all overflow-hidden border border-neutral-200 dark:border-neutral-700"
              >
                <div className="p-5">
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
                        <IntlText k="recipe.private" fallback="Privada" />
                      </span>
                    )}
                  </div>

                  <div className="text-xs text-neutral-500 dark:text-neutral-500">
                    <IntlText k="favorites.added" fallback="Guardado el" />{" "}
                    {new Date(recipe.favorited_at).toLocaleDateString("es-ES", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Stats Footer */}
        {recipes.length > 0 && (
          <div className="mt-8 bg-white dark:bg-neutral-800 rounded-xl shadow-md p-6 text-center">
            <p className="text-neutral-600 dark:text-neutral-400">
              <span className="font-semibold text-orange-600 dark:text-orange-400 text-2xl">
                {recipes.length}
              </span>{" "}
              <IntlText
                k="favorites.count"
                fallback={recipes.length === 1 ? "receta favorita" : "recetas favoritas"}
              />
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
