import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

/**
 * GET /api/community/feed
 * Query params: type, userId, page, limit
 * Returns paginated posts with user info and engagement counts
 */
export async function GET(req: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  const { searchParams } = new URL(req.url);
  
  const type = searchParams.get("type"); // "text" | "recipe" | "photo"
  const userId = searchParams.get("userId");
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "20", 10);
  const offset = (page - 1) * limit;

  let query = supabase
    .from("community_posts")
    .select(`
      *,
      user:user_id (
        id,
        email,
        user_metadata
      )
    `)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  // Filter by type if provided
  if (type && ["text", "recipe", "photo"].includes(type)) {
    query = query.eq("type", type);
  }

  // Filter by userId if provided
  if (userId) {
    query = query.eq("user_id", userId);
  }

  const { data: posts, error } = await query;

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 400 });
  }

  // Format response with user info
  const formatted = posts?.map((post: any) => ({
    id: post.id,
    type: post.type || "text",
    title: post.title || "",
    body: post.body || post.content || "",
    image_url: post.image_url || null,
    recipe_id: post.recipe_id || null,
    created_at: post.created_at,
    likes_count: post.likes_count || 0,
    user: {
      id: post.user?.id || post.user_id,
      username: post.user?.user_metadata?.display_name || post.user?.email?.split("@")[0] || "Anonymous",
      avatar_url: post.user?.user_metadata?.avatar_url || null,
    },
  })) || [];

  return new Response(JSON.stringify({ posts: formatted }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
