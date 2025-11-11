// @ts-nocheck
// Edge Function: get_theme
// Deploy with: supabase functions deploy get_theme --no-verify-jwt
// Remember to set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY as function env vars (never expose service key in client)
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  try {
    const { user_id } = await req.json();
    if (!user_id) throw new Error('user_id required');

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: profile, error: e1 } = await supabase
      .from("user_profiles")
      .select("plan")
      .eq("user_id", user_id)
      .maybeSingle();
    if (e1) throw e1;
    const plan = profile?.plan || 'free';

    const { data: theme, error: e2 } = await supabase
      .from("visual_themes")
      .select("*")
      .eq("plan", plan)
      .maybeSingle();
    if (e2) throw e2;

    return new Response(JSON.stringify(theme || { plan }), { headers: { "Content-Type": "application/json" } });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), { status: 400 });
  }
});
