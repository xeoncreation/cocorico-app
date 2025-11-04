import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import Link from "next/link";
import IntlText from "@/components/IntlText";

export default async function VersionsPage() {
  const supabase = createServerComponentClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/?auth=required");

  const { data: versions } = await supabase
    .from("recipe_versions")
    .select("id, base_recipe_id, variant_type, created_at, content")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const baseIds = Array.from(new Set((versions || []).map((v) => v.base_recipe_id)));
  let baseRecipes: Record<number, any> = {};
  if (baseIds.length) {
    const { data } = await supabase
      .from("recipes")
      .select("id,title,slug,user_id")
      .in("id", baseIds);
    for (const r of data || []) baseRecipes[r.id] = r;
  }

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-amber-800">💾 <IntlText k="versions.title" fallback="Mis versiones IA" /></h1>
      {!versions || versions.length === 0 ? (
        <p className="text-neutral-500 mt-3"><IntlText k="versions.empty" fallback="Aún no has guardado versiones." /></p>
      ) : (
        <ul className="mt-4 space-y-3">
          {versions.map((v: any) => {
            const base = baseRecipes[v.base_recipe_id];
            return (
              <li key={v.id} className="border rounded p-3">
                <div className="text-sm text-neutral-500">
                  {new Date(v.created_at).toLocaleString()} • <IntlText k="versions.type" fallback="Tipo" />: {v.variant_type}
                </div>
                <div className="mt-1">
                  {base ? (
                    <Link href={`/r/${base.user_id}/${base.slug}`} className="font-medium text-amber-800">
                      {base.title}
                    </Link>
                  ) : (
                    <span className="font-medium"><IntlText k="versions.baseDeleted" fallback="Receta base eliminada" /></span>
                  )}
                </div>
                {v.content?.text && (
                  <pre className="mt-2 whitespace-pre-wrap text-xs bg-amber-50 p-2 rounded border">
                    {v.content.text}
                  </pre>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
