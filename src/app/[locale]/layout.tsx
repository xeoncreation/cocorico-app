import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import Link from "next/link";
import MotionWrapper from "@/components/MotionWrapper";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Toaster } from "sonner";
import { Suspense } from "react";
import AuthButton from "@/components/AuthButton";
import PushNotificationPrompt from "@/components/PushNotificationPrompt";

export default async function LocaleLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  // Explicitly pass the route locale for compatibility across next-intl versions.
  const messages = await getMessages({ locale });
  const t = await getTranslations({ locale });

  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-cocorico-yellow/10 via-white to-cocorico-orange/5 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900" data-locale={locale}>
        {/* Header único consolidado */}
        <header className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm shadow-sm sticky top-0 z-50 border-b border-cocorico-yellow/20 dark:border-neutral-700">
          <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <Link href={`/${locale}`} className="flex items-center gap-2 font-display text-2xl text-cocorico-red dark:text-amber-400 hover:scale-105 transition-transform">
                🐓 Cocorico
              </Link>
              
              {/* Navegación principal - Desktop */}
              <div className="hidden md:flex items-center gap-6">
                <Link 
                  href={`/${locale}/chat`} 
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-cocorico-brown dark:text-neutral-200 hover:bg-cocorico-yellow/20 dark:hover:bg-neutral-700 transition"
                >
                  💬 Chat
                </Link>
                <Link 
                  href={`/${locale}/recipes`} 
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-cocorico-brown dark:text-neutral-200 hover:bg-cocorico-yellow/20 dark:hover:bg-neutral-700 transition"
                >
                  📖 {t("nav.search")}
                </Link>
                <Link 
                  href={`/${locale}/dashboard/favorites`} 
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-cocorico-brown dark:text-neutral-200 hover:bg-cocorico-yellow/20 dark:hover:bg-neutral-700 transition"
                >
                  ⭐ {t("nav.favorites")}
                </Link>
                <Link 
                  href={`/${locale}/dashboard/stats`} 
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-cocorico-brown dark:text-neutral-200 hover:bg-cocorico-yellow/20 dark:hover:bg-neutral-700 transition"
                >
                  📊 Estadísticas
                </Link>
                <Link 
                  href={`/${locale}/learn`} 
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-cocorico-brown dark:text-neutral-200 hover:bg-cocorico-yellow/20 dark:hover:bg-neutral-700 transition"
                >
                  📚 {t("nav.learn")}
                </Link>
              </div>
              
              {/* Controles de usuario */}
              <div className="flex items-center gap-3">
                {/* Selector de idioma */}
                <div className="flex gap-1 bg-neutral-100 dark:bg-neutral-800 rounded-lg p-1">
                  <Link 
                    href={`/es`}
                    className={`px-3 py-1.5 rounded-md text-xs font-semibold transition ${
                      locale === 'es' 
                        ? 'bg-cocorico-red text-white shadow-sm' 
                        : 'text-cocorico-brown dark:text-neutral-300 hover:bg-white dark:hover:bg-neutral-700'
                    }`}
                  >
                    ES
                  </Link>
                  <Link 
                    href={`/en`}
                    className={`px-3 py-1.5 rounded-md text-xs font-semibold transition ${
                      locale === 'en' 
                        ? 'bg-cocorico-red text-white shadow-sm' 
                        : 'text-cocorico-brown dark:text-neutral-300 hover:bg-white dark:hover:bg-neutral-700'
                    }`}
                  >
                    EN
                  </Link>
                </div>
                
                {/* Botón de autenticación */}
                <Suspense fallback={
                  <div className="w-32 h-10 bg-cocorico-yellow/30 dark:bg-neutral-700 rounded-lg animate-pulse" />
                }>
                  <AuthButton />
                </Suspense>
              </div>
            </div>
          </nav>
        </header>

        {/* Contenido principal con animación */}
        <main className="flex-1">
          <ErrorBoundary>
            <MotionWrapper>{children}</MotionWrapper>
          </ErrorBoundary>
        </main>

        {/* Footer único consolidado */}
        <footer className="bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800 mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              {/* Logo y descripción */}
              <div className="flex items-center gap-2 text-center md:text-left">
                <span className="font-display text-xl text-cocorico-red dark:text-amber-400">🐓 Cocorico</span>
                <span className="text-xs text-neutral-500 dark:text-neutral-400">
                  — hecho con ❤️ y un toque de IA
                </span>
              </div>
              
              {/* Enlaces legales */}
              <div className="flex items-center gap-4 text-xs text-neutral-500 dark:text-neutral-400">
                <span>© {new Date().getFullYear()}</span>
                <Link 
                  className="hover:text-cocorico-red dark:hover:text-amber-400 transition" 
                  href={`/${locale}/legal/privacy`}
                >
                  {t("footer.privacy")}
                </Link>
                <Link 
                  className="hover:text-cocorico-red dark:hover:text-amber-400 transition" 
                  href={`/${locale}/legal/terms`}
                >
                  {t("footer.terms")}
                </Link>
              </div>
            </div>
          </div>
        </footer>
        <Toaster position="bottom-center" richColors />
  <PushNotificationPrompt />
      </div>
    </NextIntlClientProvider>
  );
}
