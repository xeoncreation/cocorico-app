import Image from "next/image";
import Wallpaper from "@/components/layout/Wallpaper";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import Reveal from "@/components/ui/Reveal";
import dynamic from "next/dynamic";
import { RippleButton } from "@/components/ui/ripple-button";
import { AppBackground } from "@/components/layout/AppBackground";
// Cargar OnboardingModal sólo en cliente con manejo de errores
const OnboardingModal = dynamic(() => import("@/components/OnboardingModal"), { 
  ssr: false,
  loading: () => null // No mostrar nada mientras carga
});
const ProgressWidget = dynamic(() => import("@/components/dashboard/ProgressWidget"), {
  ssr: false,
  loading: () => null
});
const FloatingActionButton = dynamic(() => import("@/components/ui/FloatingActionButton"), {
  ssr: false,
});
const ContinueSection = dynamic(() => import("@/components/dashboard/ContinueSection"), {
  ssr: false,
  loading: () => null
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
    <>
      <Wallpaper
        imageLight="/branding/HOME-INICIO,  Fondo Campo de Trigo, modo claro.png"
        imageDark="/branding/HOME - INICIO — Campo de trigo nocturno cálido (dark mode).png"
      />
      <AppBackground variantOverride="home-free">
      <main className="flex flex-col items-center justify-center min-h-[90vh] text-center px-4 sm:px-6 py-12 relative overflow-hidden">
      <OnboardingModal />
      <FloatingActionButton />
      
      {/* Continue Section */}
      <div className="w-full max-w-2xl mb-4">
        <ContinueSection locale={locale} />
      </div>
      
      {/* Cocorico Mascot animada */}
      <Reveal>
        <div className="mb-8 relative">
          <img
            src="/branding/cocorico-mascot-anim-optimized.gif"
            width={240}
            height={240}
            alt="Cocorico animado"
            className="drop-shadow-2xl animate-float"
            style={{ borderRadius: '1.5rem', objectFit: 'cover', boxShadow: '0 4px 24px rgba(0,0,0,0.12)' }}
          />
        </div>
      </Reveal>

      <Reveal delay={0.2}>
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cocorico-red via-cocorico-mango to-cocorico-datil dark:from-cocorico-mango dark:via-cocorico-datil dark:to-cocorico-turquoise mb-4 tracking-tight">
          {t("home.title")}
        </h1>
      </Reveal>

      <Reveal delay={0.4}>
        <p className="max-w-2xl text-lg sm:text-xl glass-text-medium mb-8 leading-relaxed">
          {t("home.description")}
        </p>
      </Reveal>

      <Reveal delay={0.6}>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <RippleButton
            asChild
            className="coco-glass px-8 py-4 text-lg"
          >
            <Link href={`/${locale}/chat`}>
              🐓 {t("home.chatButton")}
            </Link>
          </RippleButton>
          <RippleButton
            asChild
            className="coco-glass px-8 py-4 text-lg"
          >
            <Link href={`/${locale}/dashboard/favorites`}>
              📖 {t("home.recipesButton")}
            </Link>
          </RippleButton>
        </div>
      </Reveal>

      {/* Progress Stats - Only shown when logged in */}
      <Reveal delay={0.7}>
        <div className="w-full max-w-5xl mb-12">
          <ProgressWidget />
        </div>
      </Reveal>

      <Reveal delay={0.8}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mb-12">
          <Link href={`/${locale}/scanner`} className="coco-glass p-6 rounded-3xl text-center transform hover:scale-105 transition-transform cursor-pointer">
            <div className="text-4xl mb-3">🔍</div>
            <h3 className="font-bold text-lg mb-2 glass-text-strong relative z-10">Escáner IA</h3>
            <p className="text-sm glass-text-medium relative z-10">Identifica ingredientes al instante</p>
          </Link>
          <Link href={`/${locale}/community`} className="coco-glass p-6 rounded-3xl text-center transform hover:scale-105 transition-transform cursor-pointer">
            <div className="text-4xl mb-3">👥</div>
            <h3 className="font-bold text-lg mb-2 glass-text-strong relative z-10">Comunidad</h3>
            <p className="text-sm glass-text-medium relative z-10">Comparte tus creaciones</p>
          </Link>
          <Link href={`/${locale}/dashboard/challenges`} className="coco-glass p-6 rounded-3xl text-center transform hover:scale-105 transition-transform cursor-pointer">
            <div className="text-4xl mb-3">🎯</div>
            <h3 className="font-bold text-lg mb-2 glass-text-strong relative z-10">Retos</h3>
            <p className="text-sm glass-text-medium relative z-10">Desafíate y mejora</p>
          </Link>
        </div>
      </Reveal>

      <Reveal delay={1.0}>
        <div className="relative mt-8 opacity-95">
          <div className="glass-card glass-card-mango glass-frosted-border p-2 rounded-[2rem] inline-block">
            <video
              src="/branding/banner-home.webp.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="rounded-[1.75rem] max-w-full h-auto"
              width={500}
              height={400}
            />
          </div>
        </div>
      </Reveal>
      </main>
      </AppBackground>
    </>
  );
}
