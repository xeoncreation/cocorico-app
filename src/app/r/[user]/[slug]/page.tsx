import Image from "next/image";
import { notFound } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import Reveal from "@/components/ui/Reveal";
import LegacyPageWrapper from "@/components/layout/LegacyPageWrapper";
import { createServerComponentClient } from "@/lib/supabase/server";

type PublicRecipe = {
  slug: string;
  title: string;
  description?: string | null;
  difficulty?: string | null;
  totalTime?: number | null;
  servings?: number | null;
  image?: string | null;
  ingredients: string[];
  steps: string[];
  author?: string | null;
};

const FALLBACK_RECIPES: Record<string, PublicRecipe> = {
  "pasta-con-verduras": {
    slug: "pasta-con-verduras",
    title: "Pasta con verduras",
    description: "Pasta salteada con verduras frescas y un toque de limón.",
    difficulty: "fácil",
    totalTime: 25,
    servings: 4,
    image: "/branding/banner-home.png",
    ingredients: [
      "200 g de pasta corta",
      "2 tazas de verduras salteadas (pimiento, calabacín, brócoli)",
      "1 cda de aceite de oliva y hierbas frescas",
    ],
    steps: [
      "Hervir la pasta en abundante agua con sal hasta que quede al dente.",
      "Saltear las verduras en aceite de oliva y sazonar.",
      "Mezclar la pasta con las verduras y terminar con hierbas frescas.",
    ],
  },
  "test-recipe": {
    slug: "test-recipe",
    title: "Test Recipe",
    description: "Receta de ejemplo usada en pruebas automáticas.",
    difficulty: "media",
    totalTime: 15,
    servings: 2,
    image: "/branding/cocorico/default.png",
    ingredients: [
      "1 taza de base de prueba",
      "1 cda de especias demo",
      "Sal al gusto",
    ],
    steps: [
      "Preparar todos los ingredientes demo.",
      "Mezclar durante 5 minutos hasta integrar.",
      "Servir inmediatamente y verificar resultados.",
    ],
  },
  "pasta-recipe": {
    slug: "pasta-recipe",
    title: "Pasta con Verduras",
    description: "Receta demo para flujos públicos.",
    difficulty: "fácil",
    totalTime: 20,
    servings: 3,
    image: "/branding/cocorico/happy.png",
    ingredients: [
      "250 g de pasta",
      "Sauce demo y verduras salteadas",
      "Queso rallado para finalizar",
    ],
    steps: [
      "Cocer la pasta hasta que esté lista.",
      "Preparar la salsa demo calentando los ingredientes.",
      "Combinar todo y servir caliente.",
    ],
  },
};

function formatDifficulty(value?: string | null) {
  if (!value) return null;
  const normalized = value.normalize("NFD").replace(/[^a-z]/gi, "").toLowerCase();
  if (normalized.includes("facil") || normalized.includes("easy")) return "fácil";
  if (normalized.includes("media") || normalized.includes("medium")) return "media";
  if (normalized.includes("dificil") || normalized.includes("hard")) return "difícil";
  return value;
}

const toArray = (value: unknown) => (Array.isArray(value) ? value : []);

const normalizeIngredients = (value: unknown, fallback: string[]) => {
  const list = toArray(value)
    .map((entry) => {
      if (!entry) return "";
      if (typeof entry === "string") return entry;
      if (typeof entry === "object") {
        const { quantity, unit, item, text } = entry as Record<string, string>;
        return [quantity, unit, item ?? text]
          .filter(Boolean)
          .join(" ")
          .replace(/\s+/g, " ")
          .trim();
      }
      return "";
    })
    .filter((text) => text.length > 0);
  return list.length > 0 ? list : fallback;
};

const normalizeSteps = (value: unknown, fallback: string[]) => {
  const list = toArray(value)
    .map((entry) => {
      if (!entry) return "";
      if (typeof entry === "string") return entry;
      if (typeof entry === "object") {
        const { text, step } = entry as Record<string, string>;
        return (text ?? step ?? "").trim();
      }
      return "";
    })
    .filter((text) => text.length > 0);
  return list.length > 0 ? list : fallback;
};

async function resolveRecipe(slug: string): Promise<PublicRecipe | null> {
  try {
    const supabase = await createServerComponentClient();
    const { data, error } = await supabase
      .from("recipes")
      .select(
        "slug,title,description,difficulty,total_time,time,servings,image_url,cover_image_url,content_json,ingredients,steps,visibility,is_deleted"
      )
      .eq("slug", slug)
      .eq("visibility", "public")
      .eq("is_deleted", false)
      .maybeSingle();

    if (error) {
      console.warn("[public-recipe] Supabase error, falling back", error.message ?? error);
    }

    if (data) {
      const fallback = FALLBACK_RECIPES[slug];
      const sourceIngredients =
        data.content_json?.ingredients ?? data.ingredients ?? fallback?.ingredients ?? [];
      const sourceSteps =
        data.content_json?.steps ??
        data.steps ??
        data.content_json?.instructions ??
        fallback?.steps ?? [];

      return {
        slug: data.slug ?? fallback?.slug ?? slug,
        title: data.title ?? fallback?.title ?? "Receta",
        description: data.description ?? fallback?.description ?? null,
        difficulty: formatDifficulty(data.difficulty ?? fallback?.difficulty ?? null),
        totalTime: data.total_time ?? data.time ?? fallback?.totalTime ?? null,
        servings: data.servings ?? data.content_json?.servings ?? fallback?.servings ?? null,
        image: data.image_url ?? data.cover_image_url ?? fallback?.image ?? "/branding/banner-home.png",
        ingredients: normalizeIngredients(sourceIngredients, fallback?.ingredients ?? []),
        steps: normalizeSteps(sourceSteps, fallback?.steps ?? []),
        author: fallback?.author ?? null,
      };
    }
  } catch (err) {
    console.warn("[public-recipe] Failed to load recipe", err);
  }

  return FALLBACK_RECIPES[slug] ?? null;
}

export async function generateMetadata({ params }: { params: { user: string; slug: string } }) {
  const fallback = FALLBACK_RECIPES[params.slug];
  const title = fallback ? `${fallback.title} | Cocorico` : `Receta de ${params.user}`;
  const description = fallback?.description ?? "Explora recetas públicas en Cocorico";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [fallback?.image ?? "/branding/banner-home.png"],
    },
  };
}

export default async function RecipePublicPage({ params }: { params: { user: string; slug: string } }) {
  const recipe = await resolveRecipe(params.slug);

  if (!recipe) return notFound();

  const author = recipe.author ?? params.user;

  return (
    <LegacyPageWrapper>
      <main className="max-w-3xl mx-auto p-6">
        <Reveal>
          <h1 className="heading-display text-cocorico-red mb-3">
            {recipe.title}
          </h1>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="body-small text-neutral-500 mb-4">
            Publicado por <span className="font-semibold">{author}</span>
          </p>
        </Reveal>

        <Reveal delay={0.15}>
          {recipe.image && (
            <Image
              src={recipe.image}
              alt={recipe.title}
              width={960}
              height={540}
              priority
              className="rounded-3xl shadow-md mb-6 object-cover"
            />
          )}
        </Reveal>

        <Reveal delay={0.2}>
          <div className="flex flex-wrap gap-4 body-small text-neutral-600 dark:text-neutral-300 mb-8">
            {recipe.totalTime && <span>⏱ {recipe.totalTime} min</span>}
            {recipe.difficulty && <span>🔥 {recipe.difficulty}</span>}
            {recipe.servings && <span>👥 {recipe.servings} porciones</span>}
          </div>
        </Reveal>

        {recipe.description && (
          <Reveal delay={0.25}>
            <Card className="bg-white/70 dark:bg-neutral-900/70">
              <CardContent className="pt-6 text-neutral-700 dark:text-neutral-200 leading-relaxed">
                {recipe.description}
              </CardContent>
            </Card>
          </Reveal>
        )}

        <article className="mt-8 space-y-10">
          <section>
            <Reveal delay={0.3}>
              <h2 className="heading-2 mb-4">Ingredientes</h2>
              <ul className="list-disc list-inside space-y-2 body-regular text-neutral-800 dark:text-neutral-100">
                {recipe.ingredients.map((item, idx) => (
                  <li key={`ingredient-${idx}`}>{item}</li>
                ))}
              </ul>
            </Reveal>
          </section>

          <section>
            <Reveal delay={0.35}>
              <h2 className="heading-2 mb-4">Pasos</h2>
              <ol className="list-decimal list-inside space-y-3 body-regular text-neutral-800 dark:text-neutral-100">
                {recipe.steps.map((step, idx) => (
                  <li key={`step-${idx}`}>{step}</li>
                ))}
              </ol>
            </Reveal>
          </section>
        </article>
      </main>
    </LegacyPageWrapper>
  );
}
