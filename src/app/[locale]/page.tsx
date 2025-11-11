import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import Reveal from "@/components/ui/Reveal";
import dynamic from "next/dynamic";
// Cargar OnboardingModal sólo en cliente con manejo de errores
const OnboardingModal = dynamic(() => import("@/components/OnboardingModal"), { 
  ssr: false,
  loading: () => null // No mostrar nada mientras carga
});

export default async function LocaleHomePage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  // Seguro: siempre obtener traducciones o usar fallback
  const t = await getTranslations({ locale }).catch((err) => {
    console.error("[home] Error loading translations for", locale, err);
    // Fallback simple que retorna la key
    return (key: string) => key;
  });

  return (
    <main className="flex flex-col items-center justify-center min-h-[90vh] text-center p-6 bg-gradient-to-b from-cocorico-yellow/20 via-white to-cocorico-orange/5 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900 relative">
      <OnboardingModal />
      <Reveal>
        <Image
          src="/branding/cocorico-mascot-anim-optimized.gif"
          width={220}
          height={326}
          alt="Cocorico gallo"
          className="mb-6 drop-shadow-lg fade-edge"
          unoptimized
          priority
        />
      </Reveal>

      <Reveal delay={0.2}>
        <h1 className="text-5xl md:text-6xl font-display text-cocorico-red dark:text-amber-400 mb-3 animate-fade-in">
          {t("home.title")}
        </h1>
      </Reveal>

      <Reveal delay={0.4}>
        <p className="max-w-md text-cocorico-brown dark:text-neutral-300 mb-6 text-lg leading-relaxed">
          {t("home.description")}
        </p>
      </Reveal>

      <Reveal delay={0.6}>
        <div className="flex gap-4 flex-wrap justify-center">
          <Link
            href={`/${locale}/chat`}
            className="px-6 py-3 bg-cocorico-yellow dark:bg-amber-500 text-cocorico-red dark:text-white rounded-lg font-semibold hover:bg-cocorico-orange hover:scale-105 transition-all shadow-md hover:shadow-lg"
          >
            {t("home.chatButton")}
          </Link>
          <Link
            href={`/${locale}/dashboard/favorites`}
            className="px-6 py-3 border-2 border-cocorico-red dark:border-amber-400 text-cocorico-red dark:text-amber-400 rounded-lg font-semibold hover:bg-cocorico-red hover:text-white dark:hover:bg-amber-400 dark:hover:text-neutral-900 hover:scale-105 transition-all shadow-md hover:shadow-lg"
          >
            {t("home.recipesButton")}
          </Link>
        </div>
      </Reveal>

      <Reveal delay={0.8}>
        <div className="mt-10 opacity-90">
          <Image
            src="/branding/banner-home-optimized.gif"
            alt="Cocina saludable con IA"
            width={600}
            height={405}
            className="rounded-xl shadow-md fade-edge-lg hover:shadow-xl transition-shadow"
            unoptimized
            priority={false}
          />
        </div>
      </Reveal>
    </main>
  );
}
