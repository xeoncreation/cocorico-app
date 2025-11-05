"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Post {
  id: number;
  user_id: string;
  image_url: string;
  description: string;
  created_at: string;
  post_likes: { count: number }[];
  post_comments: { count: number }[];
}

export default function CommunityPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newPost, setNewPost] = useState({ image_url: "", description: "" });
  const [publishing, setPublishing] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    try {
      const res = await fetch("/api/posts");
      if (res.ok) {
        const data = await res.json();
        setPosts(data.posts || []);
      }
    } catch (err) {
      console.error("Error cargando posts:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handlePublish() {
    if (!newPost.image_url && !newPost.description) {
      alert("Añade una imagen o descripción");
      return;
    }

    setPublishing(true);
    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPost),
      });

      if (res.ok) {
        setShowModal(false);
        setNewPost({ image_url: "", description: "" });
        fetchPosts();
      } else {
        alert("Error al publicar");
      }
    } catch (err) {
      console.error("Error publicando:", err);
      alert("Error al publicar");
    } finally {
      setPublishing(false);
    }
  }

  async function handleLike(postId: number) {
    try {
      await fetch(`/api/posts/${postId}/like`, { method: "POST" });
      fetchPosts();
    } catch (err) {
      console.error("Error al dar like:", err);
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-6 text-center">
        <p className="text-neutral-500 dark:text-neutral-400">Cargando comunidad...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold text-neutral-900 dark:text-white">
          Comunidad Cocorico 🐓
        </h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-gradient-to-r from-orange-500 to-red-600 text-white font-semibold px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
        >
          📸 Publicar
        </button>
      </div>

      {posts.length === 0 ? (
        <div className="bg-neutral-50 dark:bg-neutral-800 p-8 rounded-xl border border-neutral-200 dark:border-neutral-700 text-center">
          <p className="text-neutral-500 dark:text-neutral-400">
            Aún no hay publicaciones. ¡Sé el primero en compartir!
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-neutral-900 rounded-xl shadow-lg border border-neutral-200 dark:border-neutral-700 overflow-hidden"
            >
              {post.image_url && (
                <img
                  src={post.image_url}
                  alt="Post"
                  className="w-full h-96 object-cover"
                />
              )}
              <div className="p-4">
                <p className="text-neutral-800 dark:text-neutral-200 mb-3">
                  {post.description}
                </p>
                <div className="flex items-center gap-4 text-sm text-neutral-500 dark:text-neutral-400">
                  <button
                    onClick={() => handleLike(post.id)}
                    className="flex items-center gap-1 hover:text-red-500 transition-colors"
                  >
                    ❤️ {post.post_likes?.[0]?.count || 0}
                  </button>
                  <span className="flex items-center gap-1">
                    💬 {post.post_comments?.[0]?.count || 0}
                  </span>
                  <span className="ml-auto">
                    {new Date(post.created_at).toLocaleDateString("es-ES")}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white dark:bg-neutral-900 p-6 rounded-xl shadow-2xl max-w-lg w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold mb-4 text-neutral-900 dark:text-white">
                Nueva publicación
              </h2>
              <input
                type="text"
                placeholder="URL de la imagen"
                className="w-full p-3 border border-neutral-300 dark:border-neutral-600 rounded-lg mb-3 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
                value={newPost.image_url}
                onChange={(e) => setNewPost({ ...newPost, image_url: e.target.value })}
              />
              <textarea
                placeholder="Escribe una descripción..."
                className="w-full p-3 border border-neutral-300 dark:border-neutral-600 rounded-lg mb-4 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
                rows={4}
                value={newPost.description}
                onChange={(e) => setNewPost({ ...newPost, description: e.target.value })}
              />
              <div className="flex gap-3">
                <button
                  onClick={handlePublish}
                  disabled={publishing}
                  className="flex-1 bg-gradient-to-r from-orange-500 to-red-600 text-white font-semibold px-6 py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {publishing ? "Publicando..." : "Publicar"}
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="px-6 py-3 border-2 border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 font-medium rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
