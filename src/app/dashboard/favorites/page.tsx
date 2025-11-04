import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import Link from "next/link";
import Image from "next/image";
import IntlText from "@/components/IntlText";
import EmptyState from "@/components/ui/EmptyState";

export default async function FavoritesPage() {
  const supabase = createServerComponentClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/?auth=required");

  const { data: favs } = await supabase
    .from("favorites")
    .select("recipe_id")
    .eq("user_id", user.id);

  const recipeIds = (favs || []).map((f) => f.recipe_id);
  let recipes: any[] = [];
  if (recipeIds.length) {
    const { data } = await supabase
      .from("recipes")
      .select("id,title,slug,user_id,visibility")
      .in("id", recipeIds)
      .order("title", { ascending: true });
    recipes = data || [];
  }

  return (
    <main className="max-w-3xl mx-auto p-6">
      <div className="flex items-center gap-3 mb-2">
        <Image
          src="/branding/cocorico-mascot-anim-optimized.gif"
          alt="Cocorico animado"
          width={56}
          height={83}
          className="drop-shadow-sm fade-edge-sm"
          unoptimized
        />
        <h1 className="text-2xl font-bold text-amber-800">💛 <IntlText k="favorites.title" fallback="Mis favoritos" /></h1>
      </div>
      {recipes.length === 0 ? (
        <>
          <EmptyState
            title="Sin favoritos todavía"
            subtitle="Toca el corazón 💛 en una receta para guardarla aquí."
            image="/branding/cocorico-mascot-anim-optimized.gif"
          />
          <div className="mt-4" />
        </>
      ) : (
        <ul className="mt-4 space-y-2">
          {recipes.map((r) => (
            <li key={r.id} className="border rounded p-3 hover:bg-neutral-50">
              <Link href={`/r/${r.user_id}/${r.slug}`} className="font-medium">
                {r.title}
              </Link>
              {r.visibility !== "public" && (
                <span className="ml-2 text-xs text-neutral-500">(<IntlText k="favorites.private" fallback="privada" />)</span>
              )}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-10 opacity-95">
        <Image
          src="/branding/banner-home-optimized.gif"
          alt="Cocina saludable con IA"
          width={600}
          height={405}
          className="rounded-xl shadow-md fade-edge-lg"
          unoptimized
        />
      </div>
    </main>
  );
}
