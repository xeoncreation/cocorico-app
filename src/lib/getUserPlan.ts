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

  if (error || !profile) redirect("/upgrade");

  if (profile.plan !== "premium") redirect("/upgrade");

  return { userId: user.id as string, plan: profile.plan as "premium" };
}
