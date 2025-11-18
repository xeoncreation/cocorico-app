import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * POST /api/dev/seed
 * Seeds demo data: recipes, modules, progress.
 * Only available in development.
 */
export async function POST() {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json(
      { error: "Seed endpoint only available in development" },
      { status: 403 }
    );
  }

  const supabase = createRouteHandlerClient({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Seed demo recipes
    const demoRecipes = [
      {
        user_id: user.id,
        title: "Tortilla española perfecta",
        slug: "tortilla-espanola-perfecta",
        description: "Receta clásica con patatas y cebolla.",
        ingredients: ["4 huevos", "3 patatas", "1 cebolla", "Aceite de oliva", "Sal"],
        instructions: "Freír patatas y cebolla, batir huevos, mezclar y cocinar.",
        prep_time_minutes: 15,
        cook_time_minutes: 20,
        difficulty: "intermediate",
        visibility: "public",
      },
      {
        user_id: user.id,
        title: "Ensalada César saludable",
        slug: "ensalada-cesar-saludable",
        description: "Versión ligera del clásico César.",
        ingredients: ["Lechuga romana", "Pollo a la plancha", "Queso parmesano", "Pan tostado"],
        instructions: "Cortar ingredientes, mezclar con aderezo.",
        prep_time_minutes: 10,
        cook_time_minutes: 5,
        difficulty: "beginner",
        visibility: "public",
      },
      {
        user_id: user.id,
        title: "Pasta carbonara auténtica",
        slug: "pasta-carbonara-autentica",
        description: "Receta italiana tradicional sin nata.",
        ingredients: ["400g espagueti", "150g guanciale", "3 huevos", "Queso pecorino"],
        instructions: "Cocinar pasta, freír guanciale, mezclar con huevos y queso.",
        prep_time_minutes: 10,
        cook_time_minutes: 15,
        difficulty: "intermediate",
        visibility: "public",
      },
    ];

    const { error: recipeError } = await supabase
      .from("recipes")
      .upsert(demoRecipes, { onConflict: "slug" });

    if (recipeError) {
      console.error("[seed] Recipe insert error:", recipeError);
    }

    // Seed demo learn modules
    const demoModules = [
      {
        title: "Cocina básica: cortes de verduras",
        slug: "cocina-basica-cortes-verduras",
        description: "Aprende los cortes fundamentales de verduras.",
        duration_minutes: 15,
        difficulty: "beginner",
        category: "Técnicas",
        content: "Corte brunoise, juliana, mirepoix...",
      },
      {
        title: "Seguridad en la cocina",
        slug: "seguridad-en-la-cocina",
        description: "Normas de higiene y prevención de riesgos.",
        duration_minutes: 10,
        difficulty: "beginner",
        category: "Fundamentos",
        content: "Lavado de manos, temperaturas seguras, etc.",
      },
      {
        title: "Técnicas de cocción",
        slug: "tecnicas-de-coccion",
        description: "Hervir, asar, freír, vapor y más.",
        duration_minutes: 20,
        difficulty: "intermediate",
        category: "Técnicas",
        content: "Distintos métodos de cocción y cuándo usarlos.",
      },
    ];

    const { error: moduleError } = await supabase
      .from("learn_modules")
      .upsert(demoModules, { onConflict: "slug" });

    if (moduleError) {
      console.error("[seed] Module insert error:", moduleError);
    }

    // Seed demo cooking sessions
    const demoSessions = [
      {
        user_id: user.id,
        recipe_title: "Tortilla española",
        duration_minutes: 35,
        completed: true,
      },
      {
        user_id: user.id,
        recipe_title: "Ensalada César",
        duration_minutes: 15,
        completed: true,
      },
    ];

    const { error: sessionError } = await supabase
      .from("cooking_sessions")
      .insert(demoSessions);

    if (sessionError) {
      console.error("[seed] Session insert error:", sessionError);
    }

    // Award initial XP and trigger badge evaluation
    try {
      const xpRes = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/gamification/xp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: 50 }),
      });
      console.log("[seed] XP awarded:", await xpRes.json());

      const badgeRes = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/dashboard/badges/evaluate`, {
        method: "POST",
      });
      console.log("[seed] Badge evaluation:", await badgeRes.json());
    } catch (gamificationError) {
      console.error("[seed] Gamification error:", gamificationError);
    }

    return NextResponse.json({
      ok: true,
      message: "Demo data seeded successfully",
      recipes: demoRecipes.length,
      modules: demoModules.length,
      sessions: demoSessions.length,
    });
  } catch (err) {
    console.error("[seed] Unexpected error:", err);
    return NextResponse.json(
      { error: "Seed operation failed" },
      { status: 500 }
    );
  }
}
