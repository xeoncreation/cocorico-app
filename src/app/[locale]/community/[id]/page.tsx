// @ts-nocheck - posts, post_likes, post_comments tables not yet in Database type; requires migration
import { supabaseServer } from "@/app/lib/supabase-server";
import { notFound, redirect } from "next/navigation";
import Image from "next/image";
import LikeButton from "@/components/community/LikeButton";
import CommentBox from "@/components/community/CommentBox";

export const dynamic = "force-dynamic";

export default async function PostPage({ params }: { params: { id: string; locale: string } }) {
  const postId = parseInt(params.id);
  if (isNaN(postId)) notFound();

  const { data: { user } } = await supabaseServer().auth.getUser();

  const { data: post, error } = await supabaseServer()
    .from("posts")
    .select(`
      id,
      image_url,
      caption,
      created_at,
      user_id,
      user_profiles!inner(username, avatar_url)
    `)
    .eq("id", postId)
    .maybeSingle();

  if (error || !post) {
    console.error("Error fetching post:", error);
    notFound();
  }

  // Check visibility
  if (post.visibility === "private" && post.user_id !== user?.id) {
    redirect(`/${params.locale}/community`);
  }

  const { data: comments } = await supabaseServer()
    .from("post_comments")
    .select(`
      id,
      content,
      created_at,
      user_profiles!inner(username, avatar_url)
    `)
    .eq("post_id", postId)
    .order("created_at", { ascending: true });

  const { count: likesCount } = await supabaseServer()
    .from("post_likes")
    .select("*", { count: "exact", head: true })
    .eq("post_id", postId);

  const { data: userLike } = user
    ? await supabaseServer()
        .from("post_likes")
        .select("id")
        .eq("post_id", postId)
        .eq("user_id", user.id)
        .maybeSingle()
    : { data: null };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="border dark:border-neutral-800 rounded-xl overflow-hidden bg-white dark:bg-neutral-900 shadow-lg">
        {post.image_url && (
          <div className="relative w-full h-96 bg-neutral-100 dark:bg-neutral-800">
            <Image
              src={post.image_url}
              alt={post.caption || "Publicación"}
              fill
              className="object-contain"
              priority
            />
          </div>
        )}
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            {post.user_profiles?.avatar_url ? (
              <Image
                src={post.user_profiles.avatar_url}
                alt={post.user_profiles.username || "Usuario"}
                width={40}
                height={40}
                className="rounded-full"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-cocorico-yellow flex items-center justify-center text-xl">
                👤
              </div>
            )}
            <div>
              <p className="font-semibold">@{post.user_profiles?.username || "Usuario"}</p>
              <p className="text-xs text-neutral-500">
                {new Date(post.created_at).toLocaleDateString("es-ES", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
          {post.caption && (
            <p className="text-neutral-700 dark:text-neutral-300 mb-4">{post.caption}</p>
          )}
          <LikeButton
            postId={post.id}
            initialLiked={!!userLike}
            initialCount={likesCount || 0}
            isLoggedIn={!!user}
          />
        </div>
      </div>

      <CommentBox
        postId={post.id}
        initialComments={comments || []}
        isLoggedIn={!!user}
      />
    </div>
  );
}
