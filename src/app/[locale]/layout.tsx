
import { ThemeProvider } from "@/components/ThemeProvider";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import Link from "next/link";
import MotionWrapper from "@/components/MotionWrapper";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Toaster } from "sonner";
import PushNotificationPrompt from "@/components/PushNotificationPrompt";
import UnifiedNavbar from "@/components/navigation/UnifiedNavbar";

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      <ThemeProvider>
        <div className="min-h-screen flex flex-col" data-locale={locale}>
          {/* BLOQUE 1: Unified Navigation Bar - sticky con z-50 */}
          <UnifiedNavbar />
          {/* BLOQUE 2: Main content con padding-top para evitar overlap con navbar sticky 
              UnifiedNavbar tiene sticky top-0 y altura ~60-70px, usamos pt-16 (64px) + mt-1 para separación */}
          <main className="flex-1 pt-16 mt-1">
            <ErrorBoundary>
              <MotionWrapper>{children}</MotionWrapper>
            </ErrorBoundary>
          </main>
          {/* BLOQUE 3: Footer único consolidado con enlaces legales */}
          <footer className="coco-glass border-t-4 border-neutral-400 dark:border-neutral-600 mt-auto shadow-[0_-12px_24px_-4px_rgba(0,0,0,0.4)]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                {/* Logo y descripción */}
                <div className="flex items-center gap-2 text-center md:text-left">
                  <span className="font-display text-xl font-extrabold text-cocorico-red dark:text-amber-400 drop-shadow-md">
                    🐓 Cocorico
                  </span>
                  <span className="text-base font-black text-black dark:text-white drop-shadow-md">
                    — hecho con ❤️ y un toque de IA
                  </span>
                </div>
                {/* Enlaces legales - mayor visibilidad */}
                <div className="flex flex-wrap items-center justify-center gap-4 text-lg font-black">
                  <span className="font-black text-black dark:text-white drop-shadow-md">
                    © {new Date().getFullYear()}
                  </span>
                  <span className="text-neutral-400 dark:text-neutral-600">
                    •
                  </span>
                  <Link
                    className="text-black dark:text-white hover:text-cocorico-red dark:hover:text-amber-400 transition underline-offset-4 hover:underline font-black drop-shadow-md px-3 py-1 rounded-lg hover:bg-white/20 dark:hover:bg-neutral-800/30"
                    href={`/${locale}/legal/privacy`}
                  >
                    📄 Privacidad
                  </Link>
                  <span className="text-neutral-400 dark:text-neutral-600">
                    •
                  </span>
                  <Link
                    className="text-black dark:text-white hover:text-cocorico-red dark:hover:text-amber-400 transition underline-offset-4 hover:underline font-black drop-shadow-md px-3 py-1 rounded-lg hover:bg-white/20 dark:hover:bg-neutral-800/30"
                    href={`/${locale}/legal/terms`}
                  >
                    📄 Términos
                  </Link>
                  <span className="text-neutral-400 dark:text-neutral-600">
                    •
                  </span>
                  <Link
                    className="text-black dark:text-white hover:text-cocorico-red dark:hover:text-amber-400 transition underline-offset-4 hover:underline font-black drop-shadow-md px-3 py-1 rounded-lg hover:bg-white/20 dark:hover:bg-neutral-800/30"
                    href={`/${locale}/legal/cookies`}
                  >
                    🍪 Cookies
                  </Link>
                </div>
              </div>

              {/* Build tag con status de features */}
              <div className="mt-5 pt-5 border-t-4 border-neutral-300 dark:border-neutral-700 flex justify-center">
                <div className="flex items-center gap-3 text-sm font-mono font-black">
                  <span className="px-4 py-2 bg-neutral-300 dark:bg-neutral-700 text-black dark:text-white rounded-md border-2 border-neutral-500 dark:border-neutral-500 shadow-lg">
                    Cocorico v0.1.0
                  </span>
                  <span className="px-4 py-2 bg-green-400 text-green-950 dark:bg-green-600 dark:text-white rounded-md border-2 border-green-700 dark:border-green-400 shadow-lg">
                    Voice: ON
                  </span>
                  <span className="px-4 py-2 bg-green-400 text-green-950 dark:bg-green-600 dark:text-white rounded-md border-2 border-green-700 dark:border-green-400 shadow-lg">
                    Vision: ON
                  </span>
                  <span className="px-4 py-2 bg-amber-400 text-amber-950 dark:bg-amber-600 dark:text-white rounded-md border-2 border-amber-700 dark:border-amber-400 shadow-lg">
                    Food-IQ: ON
                  </span>
                </div>
              </div>
            </div>
          </footer>
        </div>
        <Toaster richColors position="top-center" />
        <PushNotificationPrompt />
      </ThemeProvider>
    </NextIntlClientProvider>
  );
}
