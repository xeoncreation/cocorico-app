import { createRouteHandlerClient } from "@/lib/supabase/client";

export async function GET() {
  const supabase = await createRouteHandlerClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: posts, error } = await supabase
    .from("community_posts")
    .select("id, user_id, content, image_url, likes, created_at")
    .order("created_at", { ascending: false })
    .limit(50);
  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 400 });
  const userIds = posts?.map((p: any) => p.user_id) || [];
  const { data: profiles } = await supabase
    .from("user_profiles")
    .select("id, display_name, avatar_url")
    .in("id", userIds);
  const profileMap: Record<string, any> = {};
  profiles?.forEach((p: any) => { profileMap[p.id] = p; });
  let followingSet = new Set<string>();
  if (user) {
    const { data: following } = await supabase
      .from("community_follows")
      .select("following")
      .eq("follower", user.id);
    following?.forEach((f: any) => followingSet.add(f.following));
  }
  const { data: comments } = await supabase
    .from("community_comments")
    .select("post_id, id");
  const commentCount: Record<string, number> = {};
  comments?.forEach((c: any) => { commentCount[c.post_id] = (commentCount[c.post_id] || 0) + 1; });
  const enriched = posts.map((p: any) => ({
    ...p,
    user: profileMap[p.user_id] || null,
    following: user ? followingSet.has(p.user_id) : false,
    comments: commentCount[p.id] || 0,
  }));
  return new Response(JSON.stringify({ posts: enriched }), { status: 200 });
}

export async function POST(req: Request) {
  const supabase = await createRouteHandlerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return new Response(JSON.stringify({ error: "Not authenticated" }), { status: 401 });
  }

  const contentType = req.headers.get("content-type") || "";
  let content = "";
  let file: File | null = null;

  if (contentType.startsWith("multipart/form-data")) {
    const form = await req.formData();
    content = String(form.get("content") || "").trim();
    const f = form.get("image");
    if (f instanceof File) file = f;
  } else {
    const body = await req.json();
    content = String(body.content || "").trim();
  }

  if (!content) {
    return new Response(JSON.stringify({ error: "Content required" }), { status: 400 });
  }

  let image_url: string | null = null;
  if (file) {
    const ext = file.name.split(".").pop();
    const filePath = `community/${user.id}-${Date.now()}.${ext}`;
    const { error: uploadError } = await supabase.storage.from("assets").upload(filePath, file);
    if (uploadError) {
      return new Response(JSON.stringify({ error: uploadError.message }), { status: 400 });
    }
    const { data } = supabase.storage.from("assets").getPublicUrl(filePath);
    image_url = data.publicUrl;
  }

  const { data: inserted, error } = await supabase
    .from("community_posts")
    .insert({ user_id: user.id, content, image_url })
    .select("id, user_id, content, image_url, likes, created_at")
    .single();

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 400 });
  }

  return new Response(JSON.stringify({ post: inserted }), { status: 201 });
}
