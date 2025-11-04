import { supabaseServer } from "@/lib/supabase-client";

type LimitType = "chat" | "recipe";

interface LimitResult {
  ok: boolean;
  error?: string;
  count?: number;
  limit?: number;
}

/**
 * Verifica si un usuario puede realizar una acción según su plan y límites.
 * Usuarios con rol "pro_user" tienen acceso ilimitado.
 * Usuarios "user" tienen límites: 10 chats/mes, 5 recetas totales.
 */
export async function checkUserLimit(userId: string, type: LimitType): Promise<LimitResult> {
  if (!supabaseServer) {
    return { ok: false, error: "Error de configuración del servidor" };
  }

  try {
    // Verificar rol del usuario
    const { data: roleData } = await supabaseServer
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .maybeSingle();

    const role = roleData?.role || "user";

    // Si es usuario pro, permitir siempre
    if (role === "pro_user" || role === "admin") {
      return { ok: true };
    }

    // Usuarios free tienen límites
    if (type === "chat") {
      // Contar chats del último mes
      const oneMonthAgo = new Date();
      oneMonthAgo.setDate(oneMonthAgo.getDate() - 30);

      const { count, error } = await supabaseServer
        .from("messages")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId)
        .gte("created_at", oneMonthAgo.toISOString());

      if (error) {
        console.error("Error contando chats:", error);
        return { ok: false, error: "Error verificando límite de chats" };
      }

      const chatLimit = 10;
      const currentCount = count || 0;

      if (currentCount >= chatLimit) {
        return {
          ok: false,
          error: `Límite de chats alcanzado (${currentCount}/${chatLimit}). Hazte Premium para chats ilimitados.`,
          count: currentCount,
          limit: chatLimit,
        };
      }

      return { ok: true, count: currentCount, limit: chatLimit };
    }

    if (type === "recipe") {
      // Contar recetas guardadas
      const { count, error } = await supabaseServer
        .from("recipes")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId);

      if (error) {
        console.error("Error contando recetas:", error);
        return { ok: false, error: "Error verificando límite de recetas" };
      }

      const recipeLimit = 5;
      const currentCount = count || 0;

      if (currentCount >= recipeLimit) {
        return {
          ok: false,
          error: `Límite de recetas alcanzado (${currentCount}/${recipeLimit}). Hazte Premium para recetas ilimitadas.`,
          count: currentCount,
          limit: recipeLimit,
        };
      }

      return { ok: true, count: currentCount, limit: recipeLimit };
    }

    return { ok: false, error: "Tipo de límite no reconocido" };
  } catch (err: any) {
    console.error("Error en checkUserLimit:", err);
    return { ok: false, error: "Error verificando límite" };
  }
}

/**
 * Obtiene el plan actual del usuario.
 */
export async function getUserPlan(userId: string): Promise<"free" | "premium" | "admin"> {
  if (!supabaseServer) return "free";

  try {
    const { data } = await supabaseServer
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .maybeSingle();

    const role = data?.role || "user";

    if (role === "admin") return "admin";
    if (role === "pro_user") return "premium";
    return "free";
  } catch {
    return "free";
  }
}
