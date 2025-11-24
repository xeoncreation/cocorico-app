"use client";

import { useState } from "react";
import useSWR from "swr";
import { useTranslations } from "next-intl";
import GlassCard from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { Users, TrendingUp, MessageCircle, Heart } from "lucide-react";
import dynamic from "next/dynamic";

const CommunityFilters = dynamic(() => import("@/components/community/CommunityFilters"), {
  ssr: false,
});

interface Post {
  id: string;
  type: "text" | "recipe" | "photo";
  title: string;
  body: string;
  image_url: string | null;
  recipe_id: string | null;
  created_at: string;
  likes_count: number;
  user: {
    id: string;
    username: string;
    avatar_url: string | null;
  };
}

const fetcher = (url: string) => fetch(url).then((r) => {
  if (!r.ok) throw new Error("Failed to fetch");
  return r.json();
});

export default function CommunityClient({ locale }: { locale: string }) {
  const t = useTranslations("Community");
  const [filter, setFilter] = useState<"all" | "text" | "recipe" | "photo">("all");
  const [sortBy, setSortBy] = useState<"recent" | "popular" | "following" | "favorites">("recent");
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const queryParams = new URLSearchParams();
  if (filter !== "all") queryParams.set("type", filter);
  queryParams.set("page", page.toString());
  queryParams.set("limit", "20");

  const { data, error, isLoading } = useSWR<{ posts: Post[] }>(
    `/api/community/feed?${queryParams.toString()}`,
    fetcher,
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    }
  );

  const posts = data?.posts || [];

  // Filter posts by search query
  const filteredPosts = posts.filter(post => 
    searchQuery === "" || 
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.body.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Show placeholder if API fails or returns empty
  if (error || (!isLoading && posts.length === 0)) {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 text-white text-4xl shadow-2xl">
            <Users />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-cocorico-brown dark:text-amber-100">
            {t("title") || "Comunidad Cocorico"}
          </h1>
          <p className="text-lg text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto">
            Comparte tus recetas, progreso y consejos con miles de usuarios que buscan una vida más saludable
          </p>

          {/* Tabs de filtros */}
          <div className="flex justify-center gap-2 pt-4">
            <Button
              variant={sortBy === "recent" ? "default" : "outline"}
              onClick={() => setSortBy("recent")}
              className="gap-2"
            >
              <TrendingUp className="w-4 h-4" />
              Recientes
            </Button>
            <Button
              variant={sortBy === "popular" ? "default" : "outline"}
              onClick={() => setSortBy("popular")}
              className="gap-2"
            >
              <Heart className="w-4 h-4" />
              Populares
            </Button>
            <Button
              variant={sortBy === "favorites" ? "default" : "outline"}
              onClick={() => setSortBy("favorites")}
              className="gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              Mis favoritos
            </Button>
          </div>
        </div>

        {/* Coming Soon Card */}
        <GlassCard className="p-12 text-center space-y-6">
          <div className="text-6xl mb-4">🚧</div>
          <h2 className="text-3xl font-bold text-cocorico-brown dark:text-amber-100">
            ¡Próximamente!
          </h2>
          <p className="text-lg text-neutral-600 dark:text-neutral-300 max-w-xl mx-auto">
            Estamos preparando un espacio increíble donde podrás conectar con otros usuarios, 
            compartir tus logros y aprender juntos.
          </p>
          
          {/* Preview Features */}
          <div className="grid md:grid-cols-3 gap-6 mt-8">
            <div className="space-y-2">
              <div className="text-4xl">📸</div>
              <h3 className="font-bold text-cocorico-brown dark:text-amber-100">Comparte Fotos</h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Presume tus creaciones culinarias
              </p>
            </div>
            <div className="space-y-2">
              <div className="text-4xl">🏆</div>
              <h3 className="font-bold text-cocorico-brown dark:text-amber-100">Desafíos Grupales</h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Participa en retos con la comunidad
              </p>
            </div>
            <div className="space-y-2">
              <div className="text-4xl">💬</div>
              <h3 className="font-bold text-cocorico-brown dark:text-amber-100">Foros Temáticos</h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Debates sobre nutrición y recetas
              </p>
            </div>
          </div>

          <Button 
            className="mt-6 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold"
            onClick={() => alert("¡Gracias por tu interés! Te notificaremos cuando esté disponible.")}
          >
            Notifícame cuando esté lista
          </Button>
        </GlassCard>

        {/* Stats Preview */}
        <div className="grid md:grid-cols-3 gap-6">
          <GlassCard className="p-6 text-center">
            <TrendingUp className="w-12 h-12 mx-auto mb-3 text-green-500" />
            <div className="text-3xl font-bold text-cocorico-brown dark:text-amber-100 mb-1">
              10K+
            </div>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Usuarios activos esperando
            </p>
          </GlassCard>
          <GlassCard className="p-6 text-center">
            <Heart className="w-12 h-12 mx-auto mb-3 text-red-500" />
            <div className="text-3xl font-bold text-cocorico-brown dark:text-amber-100 mb-1">
              50K+
            </div>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Recetas para compartir
            </p>
          </GlassCard>
          <GlassCard className="p-6 text-center">
            <MessageCircle className="w-12 h-12 mx-auto mb-3 text-blue-500" />
            <div className="text-3xl font-bold text-cocorico-brown dark:text-amber-100 mb-1">
              24/7
            </div>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Conversaciones disponibles
            </p>
          </GlassCard>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">{t("title") || "Community Feed"}</h1>

      {/* Filters */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {["all", "text", "recipe", "photo"].map((f) => (
          <button
            key={f}
            onClick={() => {
              setFilter(f as any);
              setPage(1);
            }}
            className={`px-4 py-2 rounded-lg transition ${
              filter === f
                ? "bg-primary text-white"
                : "bg-card text-foreground hover:bg-accent"
            }`}
          >
            {t(`filter_${f}`) || f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Posts */}
      {isLoading && <p className="text-muted-foreground">{t("loading") || "Loading..."}</p>}
      {error && <p className="text-destructive">{t("error") || "Failed to load feed."}</p>}

      <div className="space-y-4">
        {posts.map((post) => (
          <div key={post.id} className="bg-card border border-border rounded-lg p-4 shadow-sm">
            {/* User header */}
            <div className="flex items-center gap-2 mb-3">
              {post.user.avatar_url ? (
                <img
                  src={post.user.avatar_url}
                  alt={post.user.username}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground font-bold">
                  {post.user.username.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="flex-1">
                <p className="font-semibold text-foreground">{post.user.username}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(post.created_at).toLocaleDateString()}
                </p>
              </div>
              <span className="text-xs text-muted-foreground px-2 py-1 bg-accent rounded">
                {post.type}
              </span>
            </div>

            {/* Content */}
            {post.title && <h3 className="font-semibold text-lg mb-1">{post.title}</h3>}
            {post.body && <p className="text-foreground mb-2 whitespace-pre-wrap">{post.body}</p>}
            {post.image_url && (
              <img
                src={post.image_url}
                alt=""
                className="w-full rounded-lg object-cover max-h-96 mb-2"
              />
            )}

            {/* Engagement */}
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <button className="hover:text-primary transition">
                ❤️ {post.likes_count}
              </button>
              <button className="hover:text-primary transition">💬 Comment</button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {posts.length === 20 && (
        <div className="flex justify-center mt-6 gap-2">
          {page > 1 && (
            <button
              onClick={() => setPage(page - 1)}
              className="px-4 py-2 bg-card border border-border rounded-lg hover:bg-accent transition"
            >
              {t("previous") || "Previous"}
            </button>
          )}
          <button
            onClick={() => setPage(page + 1)}
            className="px-4 py-2 bg-card border border-border rounded-lg hover:bg-accent transition"
          >
            {t("next") || "Next"}
          </button>
        </div>
      )}
    </div>
  );
}
