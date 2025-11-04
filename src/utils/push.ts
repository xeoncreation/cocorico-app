import { supabase } from "@/app/lib/supabase-client";

export async function savePushToken(token: string) {
  if (!token) return;
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    console.log("❌ No hay usuario logueado para guardar token push");
    return;
  }

  // Intentar actualizar user_metadata (más simple que crear tabla nueva)
  const { error } = await supabase.auth.updateUser({
    data: { push_token: token }
  });

  if (error) {
    console.error("Error guardando token push:", error);
  } else {
    console.log("✅ Token push guardado en user metadata");
  }
}

export async function getPushToken(userId: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  
  return user.user_metadata?.push_token || null;
}
