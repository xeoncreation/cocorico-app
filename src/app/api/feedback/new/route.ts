import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  const body = await req.json();

  const { data: session } = await supabase.auth.getUser();
  if (!session?.user) return Response.json({ error: "Not authenticated" }, { status: 401 });

  const { category, title, message, image_url } = body;

  const { data, error } = await supabase.from("feedback_tickets").insert({
    user_id: session.user.id,
    category,
    title,
    message,
    image_url
  }).select("*").single();

  if (error) return Response.json({ error: error.message }, { status: 400 });

  return Response.json({ success: true, ticket: data });
}
