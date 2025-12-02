import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { createRouteHandlerClient } from "@/lib/supabase/client";

function isLikelyJson(req: Request) {
  const type = req.headers.get("content-type") || "";
  const length = Number(req.headers.get("content-length") || "0");
  return type.includes("application/json") && length !== 0;
}

async function readJsonBody(req: Request) {
  if (!isLikelyJson(req)) return null;
  try {
    return await req.json();
  } catch (err) {
    console.warn("Stats payload parse failed", err);
    return null;
  }
}

export async function POST(req: Request) {
  try {
    const payload = await readJsonBody(req);
    if (!payload || typeof payload.event !== "string") {
      // Ignore malformed or analytics-disabled calls instead of throwing 500s
      return NextResponse.json({ ok: true, ignored: true }, { status: 202 });
    }

    const { event, recipe_id, recipe_slug } = payload;
    const supabase = await createRouteHandlerClient();
    
    await supabase.from("stats").insert({ 
      event, 
      recipe_id: recipe_id || null,
      metadata: { slug: recipe_slug }
    });
    
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("Stats error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
