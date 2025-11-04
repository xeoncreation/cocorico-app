"use client";
import { useEffect, useState } from "react";
import { getBadges, Badge } from "@/utils/badges";
import { useTranslations } from "next-intl";

export default function BadgesPage() {
  const t = useTranslations();
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBadges()
      .then(setBadges)
      .catch((err) => {
        console.error("Error cargando badges:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-neutral-600 dark:text-neutral-400">Cargando logros...</p>
      </div>
    );
  }

  if (!badges.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-xl text-neutral-600 dark:text-neutral-400">
          Aún no tienes logros
        </p>
        <p className="text-neutral-500">
          ¡Cocina algo, usa el chat IA, y desbloquea insignias! 🍳
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Tus Logros 🏅</h1>
        <p className="text-neutral-600 dark:text-neutral-400">
          Has desbloqueado {badges.length} {badges.length === 1 ? "insignia" : "insignias"}
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {badges.map((badge) => (
          <div
            key={badge.id}
            className="flex flex-col items-center bg-white dark:bg-neutral-900 border dark:border-neutral-800 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow group"
          >
            <div className="relative mb-3">
              <img
                src={badge.icon_url}
                alt={badge.badge_name}
                className="w-20 h-20 transition-transform group-hover:scale-110"
              />
              {/* Efecto de brillo */}
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            <p className="font-bold text-sm text-center mb-1">
              {badge.badge_name}
            </p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 text-center mb-2">
              {badge.description}
            </p>
            <p className="text-xs text-neutral-400 dark:text-neutral-600">
              {new Date(badge.earned_at).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>

      {/* Sección de próximos logros (opcional) */}
      <div className="mt-12 border-t dark:border-neutral-800 pt-8">
        <h2 className="text-xl font-semibold mb-4">🔒 Próximos logros</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {/* Ejemplos de badges bloqueados */}
          {!badges.some(b => b.badge_code === 'first_recipe') && (
            <LockedBadge
              name="Primera receta"
              description="Publica tu primera receta"
            />
          )}
          {!badges.some(b => b.badge_code === 'chef_10') && (
            <LockedBadge
              name="Cocinero Nivel 10"
              description="Alcanza el nivel 10"
            />
          )}
          {!badges.some(b => b.badge_code === 'ai_explorer') && (
            <LockedBadge
              name="Explorador IA"
              description="Usa el chat IA 50 veces"
            />
          )}
          {!badges.some(b => b.badge_code === 'premium') && (
            <LockedBadge
              name="Usuario Premium"
              description="Activa tu suscripción Premium"
            />
          )}
        </div>
      </div>
    </div>
  );
}

function LockedBadge({ name, description }: { name: string; description: string }) {
  return (
    <div className="flex flex-col items-center bg-neutral-50 dark:bg-neutral-900/50 border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-lg p-4 opacity-60">
      <div className="w-20 h-20 mb-3 flex items-center justify-center">
        <div className="text-5xl">🔒</div>
      </div>
      <p className="font-bold text-sm text-center mb-1">{name}</p>
      <p className="text-xs text-neutral-500 dark:text-neutral-400 text-center">
        {description}
      </p>
    </div>
  );
}
