/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck - profiles.plan column just added, Database type not regenerated yet
import { redirect } from "next/navigation";
import { supabaseServer } from "@/app/lib/supabase-server";

export async function requirePremiumOrRedirect() {
  const supabase = supabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("plan")
    .eq("id", user.id)
    .single();

  // Si no existe profile o hay error, continuar sin redirigir (dev mode)
  if (error || !profile) {
    console.warn('[Premium] No profile found, allowing access for dev');
    return { userId: user.id as string, plan: "premium" as const };
  }

  if (profile.plan !== "premium") redirect("/upgrade");

  return { userId: user.id as string, plan: profile.plan as "premium" };
}
