// @ts-nocheck - post_comments table not yet in Database type; requires migration
"use client";

import { useState } from "react";
import { supabase } from "@/app/lib/supabase-client";
import Image from "next/image";

interface Comment {
  id: number;
  content: string;
  created_at: string;
  user_profiles: {
    username: string;
    avatar_url: string | null;
  };
}

interface CommentBoxProps {
  postId: number;
  initialComments: Comment[];
  isLoggedIn: boolean;
}

export default function CommentBox({
  postId,
  initialComments,
  isLoggedIn,
}: CommentBoxProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendComment() {
    if (!isLoggedIn) {
      alert("Debes iniciar sesión para comentar");
      return;
    }
    if (!text.trim()) return;

    setLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("post_comments")
        .insert({ post_id: postId, user_id: user.id, content: text.trim() })
        .select(
          `
          id,
          content,
          created_at,
          user_profiles!inner(username, avatar_url)
        `
        )
        .single();

      if (error) throw error;

      if (data) {
        setComments([...comments, data]);
        setText("");
      }
    } catch (error: any) {
      console.error("Error sending comment:", error);
      alert(error.message || "Error al enviar comentario");
    } finally {
      setLoading(false);
    }
  }

  function handleKeyPress(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendComment();
    }
  }

  return (
    <div className="mt-6">
      <h2 className="text-lg font-semibold mb-4">
        Comentarios ({comments.length})
      </h2>

      {/* Input de comentario */}
      <div className="flex items-start gap-3 mb-6">
        <textarea
          className="flex-1 border dark:border-neutral-700 rounded-lg p-3 dark:bg-neutral-800 dark:text-white resize-none"
          placeholder={
            isLoggedIn
              ? "Escribe un comentario..."
              : "Inicia sesión para comentar"
          }
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={!isLoggedIn || loading}
          rows={2}
          maxLength={500}
        />
        <button
          onClick={sendComment}
          disabled={!isLoggedIn || loading || !text.trim()}
          className="px-4 py-2 bg-cocorico-red text-white rounded-lg font-medium hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {loading ? "..." : "Enviar"}
        </button>
      </div>

      {/* Lista de comentarios */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-center text-neutral-500 py-8">
            Aún no hay comentarios. ¡Sé el primero!
          </p>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="border-t dark:border-neutral-800 pt-4"
            >
              <div className="flex items-start gap-3">
                {comment.user_profiles?.avatar_url ? (
                  <Image
                    src={comment.user_profiles.avatar_url}
                    alt={comment.user_profiles.username}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-cocorico-yellow flex items-center justify-center text-sm">
                    👤
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-semibold">
                      @{comment.user_profiles?.username || "Usuario"}
                    </p>
                    <span className="text-xs text-neutral-500">
                      {new Date(comment.created_at).toLocaleDateString("es-ES", {
                        day: "numeric",
                        month: "short",
                      })}
                    </span>
                  </div>
                  <p className="text-sm text-neutral-700 dark:text-neutral-300">
                    {comment.content}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
