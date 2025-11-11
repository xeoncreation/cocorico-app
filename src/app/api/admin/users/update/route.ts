import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-client";

// Basic rate limiting in-memory (dev only). Resets on process restart.
const hits: Record<string, { count: number; ts: number }> = {};
const WINDOW_MS = 60_000; // 1 minute
const MAX_REQ = 30; // 30 requests per IP per window

export async function POST(req: Request) {
  if (req.method !== 'POST') {
    return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 });
  }
  const len = Number(req.headers.get('content-length') || 0);
  if (len > 10_000) {
    return NextResponse.json({ error: 'Payload too large' }, { status: 413 });
  }

  // Rate limit by IP (X-Forwarded-For or remote address placeholder)
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'local';
  const now = Date.now();
  const bucket = hits[ip] || { count: 0, ts: now };
  if (now - bucket.ts > WINDOW_MS) {
    bucket.count = 0;
    bucket.ts = now;
  }
  bucket.count += 1;
  hits[ip] = bucket;
  if (bucket.count > MAX_REQ) {
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
  }

  const adminSecret = process.env.ADMIN_SECRET;
  const headerSecret = req.headers.get("x-admin-secret");
  if (!adminSecret || headerSecret !== adminSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!supabaseServer) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });
  }

  try {
    const body = await req.json();
    const { user_id, plan, role } = body || {};
    if (!user_id) return NextResponse.json({ error: "user_id is required" }, { status: 400 });

    const patch: Record<string, any> = {};
    if (plan !== undefined) {
      if (!['free', 'premium'].includes(plan)) {
        return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
      }
      patch.plan = plan;
    }
    if (role !== undefined) {
      if (!['user', 'admin'].includes(role)) {
        return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
      }
      patch.role = role;
    }
    if (!Object.keys(patch).length) return NextResponse.json({ error: "Nothing to update" }, { status: 400 });

    const { data, error } = await supabaseServer
      .from('user_profiles')
      .update(patch)
      .eq('user_id', user_id)
      .select('user_id,email,plan,role,updated_at')
      .maybeSingle();
    if (error) throw error;

    // Emit a theme refresh event hint (front-end will call triggerThemeRefresh if desired)
    return NextResponse.json({ ok: true, user: data });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
