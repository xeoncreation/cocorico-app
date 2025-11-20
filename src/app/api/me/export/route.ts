import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = createRouteHandlerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return new Response(JSON.stringify({ error: "Not authenticated" }), { status: 401 });
  }
  // Placeholder stub; would enqueue background job to build ZIP
  return new Response(JSON.stringify({ status: "pending", message: "Export job queued" }), { status: 200 });
}
