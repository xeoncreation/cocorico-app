// @ts-nocheck - posts, post_likes, post_comments tables not yet in Database type; requires migration
import { supabaseServer } from "@/app/lib/supabase-server";
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import FeedClient from "./feed-client";

export const dynamic = "force-dynamic";

export default async function CommunityPage({
  searchParams,
}: {
  searchParams?: { demo?: string };
}) {
  const { data: { user } } = await supabaseServer().auth.getUser();
  
  const { data: posts, error } = await supabaseServer()
    .from("posts")
    .select(`
      id,
      image_url,
      caption,
      created_at,
      user_profiles!inner(username, avatar_url)
    `)
    .eq("visibility", "public")
    .order("created_at", { ascending: false })
    .limit(30);

  if (error) console.error("Error fetching posts:", error);

  const showDemo = searchParams?.demo === "1" || !posts || posts.length === 0;

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-cocorico-red dark:text-amber-400">
          Comunidad Cocorico 🐓
        </h1>
        {user && (
          <Link
            href="/community/new"
            className="bg-cocorico-red text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
          >
            + Nueva publicación
          </Link>
        )}
      </div>

      {/* Toggle de vista previa */}
      <div className="mb-6 text-sm text-neutral-500">
        {searchParams?.demo === "1" ? (
          <span>
            Modo demo activo ·{" "}
            <Link href="?" className="underline hover:text-neutral-700">
              salir del modo demo
            </Link>
          </span>
        ) : (
          <Link href="?demo=1" className="underline hover:text-neutral-700">
            Activar vista previa de feed (demo)
          </Link>
        )}
      </div>

      {showDemo ? (
        <div className="py-6 space-y-6">
          <div className="text-center py-8">
            <p className="text-xl text-neutral-500 mb-4">
              Aún no hay publicaciones en la comunidad
            </p>
            {user && (
              <Link
                href="/community/new"
                className="inline-block bg-cocorico-yellow text-neutral-800 px-6 py-3 rounded-lg font-medium"
              >
                Sé el primero en publicar
              </Link>
            )}
          </div>
          {/* Fallback UI con contenido de muestra */}
          <FeedClient />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post: any) => (
            <Link key={post.id} href={`/community/${post.id}`}>
              <div className="rounded-xl overflow-hidden border dark:border-neutral-800 hover:shadow-xl transition-all duration-300 bg-white dark:bg-neutral-900">
                {post.image_url && (
                  <div className="relative h-64 w-full bg-neutral-100 dark:bg-neutral-800">
                    <Image
                      src={post.image_url}
                      alt={post.caption || "Publicación"}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                )}
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    {post.user_profiles?.avatar_url ? (
                      <Image
                        src={post.user_profiles.avatar_url}
                        alt={post.user_profiles.username || "Usuario"}
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-cocorico-yellow flex items-center justify-center">
                        👤
                      </div>
                    )}
                    <p className="font-medium text-sm">
                      @{post.user_profiles?.username || "Usuario"}
                    </p>
                  </div>
                  {post.caption && (
                    <p className="text-sm text-neutral-700 dark:text-neutral-300 line-clamp-2">
                      {post.caption}
                    </p>
                  )}
                  <div className="flex gap-3 text-xs mt-3 text-neutral-500">
                    <span>❤️</span>
                    <span>💬</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
