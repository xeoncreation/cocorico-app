

import Wallpaper from "@/components/layout/Wallpaper";
import Link from "next/link";
import Image from "next/image";
import IntlText from "@/components/IntlText";

export default function FavoritesPage() {
  // TODO: Integrar lógica real de favoritos y recetas
  const recipes: any[] = [];
  return (
    <>
      <Wallpaper
        imageLight="/branding/FAVORITOS — Ingredientes premium gourmet, modo claro.png"
        imageDark="/branding/FAVORITOS — Ingredientes premium, modo oscuro.png"
      />
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
              <h1 className="heading-2 text-amber-900 dark:text-amber-100">
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
                    {/* ...más detalles de la receta... */}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
