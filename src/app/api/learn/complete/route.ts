import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

export async function POST(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return new Response(JSON.stringify({ error: "Not authenticated" }), { status: 401 });

  const { module_id } = await req.json();
  if (!module_id) return new Response(JSON.stringify({ error: "Missing module_id" }), { status: 400 });

  const { error } = await supabase.from("module_progress").upsert(
    {
      user_id: user.id,
      module_id,
      status: "completed",
      completed_at: new Date().toISOString(),
    },
    { onConflict: "user_id,module_id" }
  );

  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 400 });

  // Award XP for completing module (25 XP per module)
  try {
    await fetch(`${req.nextUrl.origin}/api/gamification/xp`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Cookie": req.headers.get("cookie") || ""
      },
      body: JSON.stringify({ amount: 25 }),
    });

    // Trigger badge evaluation
    await fetch(`${req.nextUrl.origin}/api/dashboard/badges/evaluate`, {
      method: "POST",
      headers: { 
        "Cookie": req.headers.get("cookie") || ""
      },
    });
  } catch (xpError) {
    console.error("[learn/complete] XP/badge award failed:", xpError);
  }

  return new Response(JSON.stringify({ ok: true }), { status: 200 });
}
