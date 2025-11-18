import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function GET() {
  const supabase = createRouteHandlerClient({ cookies });

  const { data, error } = await supabase
    .from("feedback_tickets")
    .select("*")
    .order("created_at", { ascending: false });

  return Response.json({ data });
}
