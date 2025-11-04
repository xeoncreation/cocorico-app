import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import AnalyticsPing from "@/components/AnalyticsPing";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const supabase = createServerComponentClient({ cookies });
  const { data } = await supabase
    .from("recipes")
    .select("title, description")
    .eq("slug", params.slug)
    .eq("visibility", "public")
    .maybeSingle();

  return {
    title: data ? `${data.title} | Cocorico 🐓` : "Receta | Cocorico",
    description: data?.description || "Receta compartida desde Cocorico, tu asistente de cocina con IA.",
    openGraph: {
      title: data?.title || "Cocorico — Recetas con IA",
      description: data?.description || "Descubre y comparte recetas inteligentes.",
      type: "article",
      images: [
        {
          url: "/og-default.svg",
          width: 1200,
          height: 630,
          alt: "Cocorico",
        },
      ],
    },
  };
}

export default async function PublicRecipePage({ params }: { params: { slug: string } }) {
  const t = await getTranslations();
  const supabase = createServerComponentClient({ cookies });
  const { data } = await supabase
    .from("recipes")
    .select("id, title, description, content_json, difficulty, time")
    .eq("slug", params.slug)
    .eq("visibility", "public")
    .maybeSingle();

  if (!data) return notFound();

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-4 bg-white rounded shadow my-8">
      {/* Analytics ping for public recipe view */}
      <AnalyticsPing slug={params.slug} />
      <h1 className="text-3xl font-bold text-amber-800">{data.title}</h1>
      {data.description && (
        <p className="text-neutral-600 italic">{data.description}</p>
      )}
      
      <div className="flex gap-3 text-sm text-neutral-500">
        <span>⏱️ {data.time || "?"} {t("public.minutes")}</span>
        <span>🥣 {data.difficulty || t("public.unknown")}</span>
      </div>

      <article className="prose max-w-none">
        {data.content_json?.ingredients && (
          <>
            <h2>{t("public.ingredients")}</h2>
            <ul>
              {data.content_json.ingredients.map((i: any, idx: number) => (
                <li key={idx}>
                  {i.quantity} {i.unit} {i.item}{" "}
                  {i.notes && <em>({i.notes})</em>}
                </li>
              ))}
            </ul>
          </>
        )}

        {data.content_json?.steps && (
          <>
            <h2>{t("public.steps")}</h2>
            <ol>
              {data.content_json.steps.map((s: string, idx: number) => (
                <li key={idx}>{s}</li>
              ))}
            </ol>
          </>
        )}

        {data.content_json?.raw && !data.content_json?.ingredients && (
          <pre className="whitespace-pre-line text-sm bg-amber-50 p-3 rounded">
            {data.content_json.raw}
          </pre>
        )}
      </article>

      <p className="text-xs text-neutral-500 mt-6 pt-4 border-t text-center">
        {t("public.sharedBy")}
      </p>
    </main>
  );
}
