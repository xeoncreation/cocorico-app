// supabase/functions/get_theme/index.ts
// Returns asset URLs for a page based on user plan
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

Deno.serve(async (req) => {
  try {
    // 1) Parse input
    let page = "home";
    let plan = "free"; // default plan

    if (req.method === "GET") {
      const url = new URL(req.url);
      page = url.searchParams.get("page") ?? "home";
      plan = url.searchParams.get("plan") ?? "free";
    } else if (req.method === "POST") {
      const data = await req.json().catch(() => ({}));
      page = data?.page ?? "home";
      plan = data?.plan ?? "free";
    }

    // 2) Supabase client with SERVICE ROLE
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const sb = createClient(supabaseUrl, serviceKey);

    // 3) Query page_assets for the requested page
    const { data, error } = await sb
      .from("page_assets")
      .select("page, asset_free, asset_premium")
      .eq("page", page)
      .maybeSingle();

    if (error) {
      throw new Error(error.message);
    }

    // 4) Return appropriate asset based on plan
    const asset = plan === "premium" ? data?.asset_premium : data?.asset_free;

    return new Response(
      JSON.stringify({ 
        ok: true, 
        page,
        plan,
        asset: asset || null,
        fallback: data?.asset_free || null
      }),
      { headers: { "Content-Type": "application/json" }, status: 200 },
    );
  } catch (e) {
    return new Response(
      JSON.stringify({ ok: false, error: String(e) }),
      { headers: { "Content-Type": "application/json" }, status: 500 },
    );
  }
});
