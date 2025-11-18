"use client";

import { useState } from "react";
import useSWR from "swr";
import { useTranslations } from "next-intl";

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

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function CommunityClient({ locale }: { locale: string }) {
  const t = useTranslations("Community");
  const [filter, setFilter] = useState<"all" | "text" | "recipe" | "photo">("all");
  const [page, setPage] = useState(1);

  const queryParams = new URLSearchParams();
  if (filter !== "all") queryParams.set("type", filter);
  queryParams.set("page", page.toString());
  queryParams.set("limit", "20");

  const { data, error, isLoading } = useSWR<{ posts: Post[] }>(
    `/api/community/feed?${queryParams.toString()}`,
    fetcher
  );

  const posts = data?.posts || [];

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
