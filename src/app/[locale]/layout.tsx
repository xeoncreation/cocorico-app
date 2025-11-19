import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import Link from "next/link";
import MotionWrapper from "@/components/MotionWrapper";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Toaster } from "sonner";
import { Suspense } from "react";
import AuthButton from "@/components/AuthButton";
import PushNotificationPrompt from "@/components/PushNotificationPrompt";
import MobileNav from "@/components/MobileNav";
import LanguageSelector from "@/components/LanguageSelector";
import LocaleNavbar from "@/components/LocaleNavbar";

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
      <div className="min-h-screen flex flex-col" data-locale={locale}>
        {/* Header único consolidado */}
        <header className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm shadow-sm sticky top-0 z-50 border-b border-cocorico-yellow/20 dark:border-neutral-700">
          <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <Link href={`/${locale}`} className="flex items-center gap-2 font-display text-2xl text-cocorico-red dark:text-amber-400 hover:scale-105 transition-transform">
                🐓 Cocorico
              </Link>
              
              {/* Navegación principal - Desktop */}
              <LocaleNavbar locale={locale} />
              
              {/* Controles de usuario */}
              <div className="flex items-center gap-3">
                {/* Selector de idioma con búsqueda */}
                <LanguageSelector compact />
                
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
                  Privacidad
                </Link>
                <Link 
                  className="hover:text-cocorico-red dark:hover:text-amber-400 transition" 
                  href={`/${locale}/legal/terms`}
                >
                  Términos
                </Link>
                <Link 
                  className="hover:text-cocorico-red dark:hover:text-amber-400 transition" 
                  href={`/${locale}/legal/cookies`}
                >
                  Cookies
                </Link>
              </div>
            </div>
            
            {/* Build tag con status de features */}
            <div className="mt-4 pt-4 border-t border-neutral-100 dark:border-neutral-800 flex justify-center">
              <div className="flex items-center gap-3 text-xs font-mono text-neutral-400 dark:text-neutral-500">
                <span className="px-2 py-1 bg-neutral-100 dark:bg-neutral-800 rounded">Cocorico v0.1.0</span>
                <span className="px-2 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded">
                  Voice: ON
                </span>
                <span className="px-2 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded">
                  Vision: ON
                </span>
                <span className="px-2 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded">
                  Food-IQ: ON
                </span>
              </div>
            </div>
          </div>
        </footer>
        <Toaster position="bottom-center" richColors />
        <PushNotificationPrompt />
        <MobileNav />
      </div>
    </NextIntlClientProvider>
  );
}
