// @ts-nocheck - post_likes table not yet in Database type; requires migration
"use client";

import { useState } from "react";
import { supabase } from "@/app/lib/supabase-client";

interface LikeButtonProps {
  postId: number;
  initialLiked: boolean;
  initialCount: number;
  isLoggedIn: boolean;
}

export default function LikeButton({
  postId,
  initialLiked,
  initialCount,
  isLoggedIn,
}: LikeButtonProps) {
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);

  async function toggleLike() {
    if (!isLoggedIn) {
      alert("Debes iniciar sesión para dar me gusta");
      return;
    }

    setLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      if (liked) {
        // Unlike
        const { error } = await supabase
          .from("post_likes")
          .delete()
          .eq("post_id", postId)
          .eq("user_id", user.id);

        if (!error) {
          setCount((c) => Math.max(0, c - 1));
          setLiked(false);
        }
      } else {
        // Like
        const { error } = await supabase
          .from("post_likes")
          .insert({ post_id: postId, user_id: user.id });

        if (!error) {
          setCount((c) => c + 1);
          setLiked(true);
        }
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={toggleLike}
      disabled={loading}
      className="flex items-center gap-2 text-lg hover:scale-110 transition-transform disabled:opacity-50"
    >
      <span className={liked ? "text-red-500" : "text-neutral-400"}>
        {liked ? "❤️" : "🤍"}
      </span>
      <span className="text-sm font-medium">{count}</span>
    </button>
  );
}
