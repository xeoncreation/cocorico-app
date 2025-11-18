import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import Reveal from "@/components/ui/Reveal";
import dynamic from "next/dynamic";
import { RippleButton } from "@/components/ui/ripple-button";
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
    <main className="flex flex-col items-center justify-center min-h-[90vh] text-center px-4 sm:px-6 py-12 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-purple-950 dark:via-pink-900 dark:to-orange-900 relative overflow-hidden">
      <OnboardingModal />
      
      {/* Cocorico Mascot animada */}
      <Reveal>
        <div className="mb-8 relative">
          <Image
            src="/branding/cocorico-mascot.png"
            width={240}
            height={240}
            alt="Cocorico gallo"
            className="drop-shadow-2xl animate-float"
            priority
          />
        </div>
      </Reveal>

      <Reveal delay={0.2}>
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 dark:from-orange-400 dark:via-red-400 dark:to-pink-400 mb-4 tracking-tight">
          {t("home.title")}
        </h1>
      </Reveal>

      <Reveal delay={0.4}>
        <p className="max-w-2xl text-lg sm:text-xl text-orange-900 dark:text-orange-100 mb-8 leading-relaxed font-medium">
          {t("home.description")}
        </p>
      </Reveal>

      <Reveal delay={0.6}>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <RippleButton
            asChild
            className="glass-card glass-card-orange rounded-2xl px-8 py-4 text-lg font-semibold text-white shadow-2xl hover:shadow-3xl transform hover:-translate-y-1"
          >
            <Link href={`/${locale}/chat`}>
              🐓 {t("home.chatButton")}
            </Link>
          </RippleButton>
          <RippleButton
            asChild
            className="glass-card glass-card-purple rounded-2xl px-8 py-4 text-lg font-semibold text-white shadow-2xl hover:shadow-3xl transform hover:-translate-y-1"
          >
            <Link href={`/${locale}/dashboard/favorites`}>
              📖 {t("home.recipesButton")}
            </Link>
          </RippleButton>
        </div>
      </Reveal>

      <Reveal delay={0.8}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mb-12">
          <div className="glass-card glass-card-orange glass-frosted-border p-6 rounded-3xl text-center transform hover:scale-105 transition-transform">
            <div className="text-4xl mb-3">🔍</div>
            <h3 className="font-bold text-lg mb-2 glass-text-premium">Escáner IA</h3>
            <p className="text-sm text-white/80">Identifica ingredientes al instante</p>
          </div>
          <div className="glass-card glass-card-blue glass-frosted-border p-6 rounded-3xl text-center transform hover:scale-105 transition-transform">
            <div className="text-4xl mb-3">👥</div>
            <h3 className="font-bold text-lg mb-2 glass-text-premium">Comunidad</h3>
            <p className="text-sm text-white/80">Comparte tus creaciones</p>
          </div>
          <div className="glass-card glass-card-purple glass-frosted-border p-6 rounded-3xl text-center transform hover:scale-105 transition-transform">
            <div className="text-4xl mb-3">🎯</div>
            <h3 className="font-bold text-lg mb-2 glass-text-premium">Retos</h3>
            <p className="text-sm text-white/80">Desafíate y mejora</p>
          </div>
        </div>
      </Reveal>

      <Reveal delay={1.0}>
        <div className="relative mt-8 opacity-95">
          <div className="glass-card glass-card-orange glass-frosted-border p-2 rounded-3xl inline-block">
            <video
              src="/branding/banner-home.webp.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="rounded-2xl max-w-full h-auto"
              width={500}
              height={400}
            />
          </div>
        </div>
      </Reveal>
    </main>
  );
}
