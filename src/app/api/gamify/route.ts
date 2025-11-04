import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-client";

export async function POST(req: Request) {
  try {
    if (!supabaseServer) {
      return NextResponse.json({ error: "Supabase no disponible" }, { status: 500 });
    }

    const { data: { user } } = await supabaseServer.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const { type } = await req.json();

    const rewards: Record<string, number> = {
      "recipe_created": 100,
      "ai_chat": 20,
      "challenge_completed": 200,
    };

    const xp = rewards[type] || 0;

    if (xp > 0) {
      // Asegurar que el usuario tiene registro en user_progress
      const { data: existing } = await supabaseServer
        .from("user_progress")
        .select("user_id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (!existing) {
        await supabaseServer.from("user_progress").insert({
          user_id: user.id,
          xp: 0,
          level: 1,
          streak: 0,
        });
      }

      await supabaseServer.rpc("increment_xp", { user_uuid: user.id, gained_xp: xp });
    }

    // Añadir logros por hitos
    if (type === "recipe_created") {
      const { data: progress } = await supabaseServer
        .from("user_progress")
        .select("xp")
        .eq("user_id", user.id)
        .maybeSingle();

      if (progress && progress.xp >= 500 && progress.xp < 600) {
        // Verificar que no tenga ya este logro
        const { data: existingBadge } = await supabaseServer
          .from("user_badges")
          .select("id")
          .eq("user_id", user.id)
          .eq("badge_name", "Chef Novato 🍳")
          .maybeSingle();

        if (!existingBadge) {
          await supabaseServer.from("user_badges").insert({
            user_id: user.id,
            badge_name: "Chef Novato 🍳",
            icon_url: "/badges/chef-novato.png",
            description: "Has cocinado tus primeras recetas",
          });
        }
      }

      // Logro de maestro (nivel 10+)
      if (progress && progress.xp >= 5000 && progress.xp < 5100) {
        const { data: existingBadge } = await supabaseServer
          .from("user_badges")
          .select("id")
          .eq("user_id", user.id)
          .eq("badge_name", "Maestro del Sabor 👨‍🍳")
          .maybeSingle();

        if (!existingBadge) {
          await supabaseServer.from("user_badges").insert({
            user_id: user.id,
            badge_name: "Maestro del Sabor 👨‍🍳",
            icon_url: "/badges/maestro-sabor.png",
            description: "Has alcanzado el nivel 10",
          });
        }
      }
    }

    return NextResponse.json({ success: true, xp });
  } catch (err: any) {
    console.error("Error en gamificación:", err);
    return NextResponse.json({ error: "Error en gamificación" }, { status: 500 });
  }
}
