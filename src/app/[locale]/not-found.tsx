import { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { AppBackground } from "@/components/layout/AppBackground";
import { Button } from "@/components/ui/button";
import GlassCard from "@/components/ui/GlassCard";

export const metadata: Metadata = {
  title: "Página no encontrada | Cocorico",
  description: "La página que buscas no existe o está en construcción.",
};

export default async function NotFound({ params }: { params?: { locale?: string } }) {
  const locale = params?.locale || "es";
  const t = await getTranslations({ locale }).catch(() => (key: string) => key);

  return (
    <AppBackground variantOverride="home-free">
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <GlassCard className="max-w-2xl w-full p-8 md:p-12 text-center space-y-6">
          {/* Cocorico triste */}
          <div className="flex justify-center">
            <div className="relative w-32 h-32 md:w-40 md:h-40">
              <div className="absolute inset-0 animate-bounce">
                <span className="text-8xl md:text-9xl">🐓</span>
              </div>
            </div>
          </div>

          {/* Título */}
          <div className="space-y-2">
            <h1 className="text-6xl md:text-8xl font-bold text-cocorico-red dark:text-amber-400">
              404
            </h1>
            <h2 className="text-2xl md:text-3xl font-bold text-cocorico-brown dark:text-neutral-100">
              ¡Ups! Esta receta no existe
            </h2>
          </div>

          {/* Descripción */}
          <p className="text-neutral-600 dark:text-neutral-300 text-lg max-w-md mx-auto">
            Parece que Cocorico se ha comido esta página... o quizás aún no la hemos cocinado. 
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button asChild size="lg" className="bg-cocorico-red hover:bg-cocorico-red/90 text-white">
              <Link href={`/${locale}`}>
                🏠 Volver al inicio
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href={`/${locale}/chat`}>
                💬 Hablar con Cocorico
              </Link>
            </Button>
          </div>

          {/* Enlaces útiles */}
          <div className="pt-8 border-t border-neutral-200 dark:border-neutral-700">
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-3">
              ¿Buscabas algo específico?
            </p>
            <div className="flex flex-wrap gap-3 justify-center text-sm">
              <Link href={`/${locale}/recipes`} className="text-cocorico-red hover:underline">
                📖 Ver recetas
              </Link>
              <Link href={`/${locale}/scanner`} className="text-cocorico-red hover:underline">
                📷 Escanear producto
              </Link>
              <Link href={`/${locale}/learn`} className="text-cocorico-red hover:underline">
                🎓 Aprender cocina
              </Link>
              <Link href={`/${locale}/pricing`} className="text-cocorico-red hover:underline">
                ⭐ Ver planes
              </Link>
            </div>
          </div>
        </GlassCard>
      </div>
    </AppBackground>
  );
}
