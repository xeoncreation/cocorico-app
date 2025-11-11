import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-client";

export async function GET(req: Request) {
  const adminSecret = process.env.ADMIN_SECRET;
  const headerSecret = new URL(req.url).searchParams.get("secret") || (req as any).headers?.get?.("x-admin-secret");

  if (!adminSecret || headerSecret !== adminSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!supabaseServer) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });
  }

  try {
    const { data, error } = await supabaseServer
      .from("user_profiles")
      .select("user_id,email,plan,role,created_at,updated_at")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return NextResponse.json({ users: data ?? [] });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
