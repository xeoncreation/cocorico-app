import { supabaseServer } from "@/lib/supabase-client";
import Link from "next/link";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

interface PageProps {
  params: { username: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { username } = params;
  
  if (!supabaseServer) {
    return { title: "Usuario no encontrado - Cocorico" };
  }

  const { data } = await (supabaseServer as any)
    .from("user_profiles")
    .select("username, bio, avatar_url")
    .eq("username", username)
    .maybeSingle();

  if (!data) {
    return { title: "Usuario no encontrado - Cocorico" };
  }

  return {
    title: `@${data.username} en Cocorico`,
    description: data.bio || `Perfil de ${data.username} en Cocorico 🐓`,
    openGraph: {
      title: `@${data.username}`,
      description: data.bio || "Perfil de usuario en Cocorico",
      images: [data.avatar_url || "/default-avatar.png"],
    },
  };
}

export default async function PublicUserPage({ params }: PageProps) {
  const { username } = params;

  if (!supabaseServer) {
    return <ErrorView message="Error de conexión" />;
  }

  // Obtener perfil del usuario
  const { data: profile } = await (supabaseServer as any)
    .from("user_profiles")
    .select("user_id, username, avatar_url, bio, level, experience, country")
    .eq("username", username)
    .maybeSingle();

  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-3xl font-semibold mb-3">Usuario no encontrado 🐓</h1>
        <p className="text-neutral-500 mb-4">
          @{username} no existe en Cocorico
        </p>
        <Link href="/" className="text-cocorico-red underline">
          Volver al inicio
        </Link>
      </div>
    );
  }

  // Obtener recetas públicas del usuario
  const { data: recipes } = await (supabaseServer as any)
    .from("recipes")
    .select("id, title, slug, visibility, image_url, created_at")
    .eq("user_id", profile.user_id)
    .eq("visibility", "public")
    .order("created_at", { ascending: false });

  // Obtener badges del usuario
  const { data: badges } = await (supabaseServer as any)
    .from("user_badges")
    .select("badge_name, icon_url, description, earned_at")
    .eq("user_id", profile.user_id)
    .order("earned_at", { ascending: false });

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      {/* Cabecera de perfil */}
      <div className="flex items-start gap-6 mb-10 bg-white dark:bg-neutral-900 rounded-xl shadow p-6 border dark:border-neutral-800">
        <img
          src={profile.avatar_url || "/default-avatar.png"}
          alt={profile.username}
          className="w-28 h-28 rounded-full border-2 border-neutral-200 dark:border-neutral-700 object-cover"
        />
        <div className="flex-1">
          <h1 className="text-4xl font-bold mb-2">@{profile.username}</h1>
          <p className="text-neutral-600 dark:text-neutral-400 mb-3">
            {profile.bio || "Amante de la cocina 🧑‍🍳"}
          </p>
          
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-2xl">⭐</span>
              <span className="font-semibold">Nivel {profile.level}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🔥</span>
              <span className="text-neutral-600 dark:text-neutral-400">
                {profile.experience} XP
              </span>
            </div>
            {profile.country && (
              <div className="flex items-center gap-2">
                <span className="text-xl">🌍</span>
                <span className="text-neutral-600 dark:text-neutral-400">
                  {profile.country}
                </span>
              </div>
            )}
          </div>

          {/* Barra de progreso al siguiente nivel */}
          <div className="mt-4">
            <div className="flex justify-between text-xs text-neutral-500 mb-1">
              <span>Nivel {profile.level}</span>
              <span>Nivel {profile.level + 1}</span>
            </div>
            <div className="bg-neutral-200 dark:bg-neutral-700 rounded-full h-2 overflow-hidden">
              <progress
                value={profile.experience % 100}
                max={100}
                className="w-full h-2 [&::-webkit-progress-bar]:bg-transparent [&::-webkit-progress-value]:bg-gradient-to-r [&::-webkit-progress-value]:from-cocorico-red [&::-webkit-progress-value]:to-orange-500 [&::-moz-progress-bar]:bg-cocorico-red"
                aria-label="Progreso al siguiente nivel"
              />
            </div>
            <p className="text-xs text-neutral-500 mt-1">
              {100 - (profile.experience % 100)} XP para el siguiente nivel
            </p>
          </div>
        </div>
      </div>

      {/* Recetas públicas */}
      <section className="mb-10">
        <h2 className="text-3xl font-bold mb-4">Recetas públicas</h2>
        {recipes && recipes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {recipes.map((r: any) => (
              <Link
                key={r.id}
                href={`/r/${profile.username}/${r.slug}`}
                className="group"
              >
                <div className="border dark:border-neutral-800 rounded-lg overflow-hidden hover:shadow-lg transition-all">
                  <div className="relative h-48 bg-neutral-100 dark:bg-neutral-800">
                    <img
                      src={r.image_url || "/no-image.jpg"}
                      alt={r.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg group-hover:text-cocorico-red transition-colors">
                      {r.title}
                    </h3>
                    <p className="text-xs text-neutral-500 mt-1">
                      {new Date(r.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-neutral-50 dark:bg-neutral-900 border-2 border-dashed dark:border-neutral-800 rounded-lg p-10 text-center">
            <p className="text-neutral-500 text-lg">
              Aún no tiene recetas públicas 🍲
            </p>
          </div>
        )}
      </section>

      {/* Logros */}
      <section>
        <h2 className="text-3xl font-bold mb-4">Logros 🏅</h2>
        {badges && badges.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {badges.map((b: any) => (
              <div
                key={b.badge_name}
                className="flex flex-col items-center bg-white dark:bg-neutral-900 border dark:border-neutral-800 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <img
                  src={b.icon_url}
                  alt={b.badge_name}
                  className="w-16 h-16 mb-2"
                />
                <p className="text-sm font-semibold text-center">{b.badge_name}</p>
                <p className="text-xs text-neutral-500 text-center mt-1">
                  {b.description}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-neutral-50 dark:bg-neutral-900 border-2 border-dashed dark:border-neutral-800 rounded-lg p-10 text-center">
            <p className="text-neutral-500 text-lg">
              Sin logros todavía 🐣
            </p>
          </div>
        )}
      </section>
    </div>
  );
}

function ErrorView({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-semibold mb-3 text-red-500">Error</h1>
      <p className="text-neutral-500 mb-4">{message}</p>
      <Link href="/" className="text-cocorico-red underline">
        Volver al inicio
      </Link>
    </div>
  );
}
