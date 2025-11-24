"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import { useTranslations, useLocale } from "next-intl";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Menu } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import LanguageSelector from "@/components/LanguageSelector";
import type { User } from "@supabase/supabase-js";

/**
 * UnifiedNavbar - Componente de navegación consolidado
 * 
 * Combina las mejores características de:
 * - Navbar.tsx (manejo de auth de Supabase)
 * - SiteHeader.tsx (i18n con next-intl, componentes shadcn)
 * - LocaleNavbar.tsx (soporte de locale en rutas)
 * 
 * Características:
 * - ✅ Internacionalización completa con next-intl
 * - ✅ Autenticación con Supabase
 * - ✅ Responsive (desktop + mobile con Sheet)
 * - ✅ Indicador visual de ruta activa
 * - ✅ Menú desplegable de usuario
 * - ✅ Theme toggle y language selector integrados
 */

interface NavLink {
  href: string;
  labelKey: string;
  icon: string;
}

const mainNavLinks: NavLink[] = [
  { href: "/", labelKey: "nav.home", icon: "🏠" },
  { href: "/chat", labelKey: "nav.chat", icon: "💬" },
  { href: "/scanner", labelKey: "nav.scanner", icon: "📷" },
  { href: "/recipes", labelKey: "nav.recipes", icon: "📖" },
  { href: "/community", labelKey: "nav.community", icon: "👥" },
];

const userMenuLinks: NavLink[] = [
  { href: "/dashboard", labelKey: "nav.dashboard", icon: "📊" },
  { href: "/voice-chat", labelKey: "nav.voiceChat", icon: "🎙️" },
  { href: "/learn", labelKey: "nav.learn", icon: "🎓" },
  { href: "/dashboard/challenges", labelKey: "nav.challenges", icon: "🏆" },
  { href: "/dashboard/achievements", labelKey: "nav.achievements", icon: "🏅" },
  { href: "/dashboard/favorites", labelKey: "nav.favorites", icon: "⭐" },
  { href: "/pricing", labelKey: "nav.pricing", icon: "💎" },
  { href: "/dashboard/feedback", labelKey: "nav.feedback", icon: "📝" },
  { href: "/settings", labelKey: "nav.settings", icon: "⚙️" },
];

export default function UnifiedNavbar() {
  const [user, setUser] = useState<User | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false);
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations();
  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Auth state management
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setMenuOpen(false);
    setMobileSheetOpen(false);
  };

  // Helper: prepend locale to href
  const withLocale = (href: string) => {
    // Si ya tiene locale, no duplicar
    if (href.startsWith(`/${locale}`)) return href;
    return `/${locale}${href}`;
  };

  // Helper: check if route is active
  const isActive = (href: string) => {
    const fullPath = withLocale(href);
    if (fullPath === `/${locale}`) return pathname === `/${locale}`;
    return pathname?.startsWith(fullPath);
  };

  // Helper: nav link classes - estilo liquid glass individual
  const navLinkClass = (href: string) => {
    const active = isActive(href);
    return `
      flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-bold
      transition-all duration-200 drop-shadow-lg backdrop-blur-md
      border shadow-md hover:shadow-xl hover:scale-105
      ${
        active
          ? "bg-cocorico-red/30 dark:bg-amber-500/30 text-cocorico-red dark:text-amber-400 font-black border-cocorico-red/50 dark:border-amber-400/50"
          : "bg-white/40 dark:bg-neutral-900/40 text-neutral-900 dark:text-white border-white/60 dark:border-neutral-700/60 hover:bg-cocorico-yellow/40 dark:hover:bg-neutral-800/50 hover:text-cocorico-red dark:hover:text-amber-400"
      }
    `.trim();
  };

  return (
    <nav className="flex items-center justify-between px-4 sm:px-6 py-3 bg-transparent backdrop-blur-xl sticky top-0 z-50">
      {/* Logo - botón liquid glass */}
      <Link
        href={withLocale("/")}
        className="font-display text-2xl font-black text-cocorico-red dark:text-amber-400 hover:scale-105 transition-transform drop-shadow-2xl px-4 py-2 rounded-2xl bg-white/40 dark:bg-neutral-900/40 backdrop-blur-md border border-white/60 dark:border-neutral-700/60 shadow-lg hover:shadow-2xl"
        aria-label={t("nav.home")}
      >
        🐓 Cocorico
      </Link>

      {/* Desktop Navigation */}
      <div className="hidden lg:flex items-center gap-1">
        {mainNavLinks.map((link) => (
          <Link
            key={link.href}
            href={withLocale(link.href)}
            className={navLinkClass(link.href)}
            aria-current={isActive(link.href) ? "page" : undefined}
          >
            <span aria-hidden="true">{link.icon}</span>
            <span>{t(link.labelKey as any)}</span>
          </Link>
        ))}
      </div>

      {/* Right side controls */}
      <div className="flex items-center gap-3">
        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Language Selector */}
        <div className="hidden sm:block">
          <LanguageSelector compact />
        </div>

        {/* User menu or Login */}
        {user ? (
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-2 rounded-2xl coco-glass px-4 py-2.5 text-sm font-bold hover:scale-105"
              aria-label="User menu"
              aria-expanded={menuOpen}
              aria-haspopup="true"
            >
              <div className="w-6 h-6 rounded-full bg-cocorico-red text-white flex items-center justify-center text-xs font-bold" aria-hidden="true">
                {user.email?.[0]?.toUpperCase() || "U"}
              </div>
              <span className="hidden md:inline max-w-[120px] truncate">
                {user.email}
              </span>
            </button>

            {/* Dropdown menu */}
            {menuOpen && (
              <>
                {/* Backdrop to close menu */}
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setMenuOpen(false)}
                  aria-hidden="true"
                />
                <div 
                  className="absolute right-0 mt-2 w-56 coco-glass rounded-md shadow-lg py-1 z-50"
                  role="menu"
                >
                  {userMenuLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={withLocale(link.href)}
                      className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
                      onClick={() => setMenuOpen(false)}
                      role="menuitem"
                    >
                      <span aria-hidden="true">{link.icon}</span>
                      <span>{t(link.labelKey as any)}</span>
                    </Link>
                  ))}
                  <Separator className="my-1" />
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 text-left px-4 py-2 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-700 text-red-600 dark:text-red-400 transition-colors"
                    role="menuitem"
                  >
                    <span aria-hidden="true">🚪</span>
                    <span>{t("nav.logout")}</span>
                  </button>
                </div>
              </>
            )}
          </div>
        ) : (
          <Link
            href={withLocale("/login")}
            className="text-sm font-bold px-4 py-2.5 rounded-2xl coco-glass hover:text-cocorico-red dark:hover:text-amber-400 transition-all hover:scale-105 drop-shadow-lg"
          >
            {t("nav.login")}
          </Link>
        )}

        {/* Mobile menu button */}
        <div className="lg:hidden">
          <Sheet open={mobileSheetOpen} onOpenChange={setMobileSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" aria-label="Menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <div className="py-4 flex flex-col gap-4">
                {/* Logo in mobile menu */}
                <div className="px-1 pb-2 font-display text-xl font-black text-cocorico-red dark:text-amber-400">
                  🐓 Cocorico
                </div>
                <Separator />

                {/* Main navigation */}
                <nav className="flex flex-col gap-2">
                  {mainNavLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={withLocale(link.href)}
                      className={`flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-bold coco-glass ${isActive(link.href) ? "ring-2 ring-cocorico-red/40 dark:ring-amber-400/40 font-black" : "hover:ring-2 hover:ring-cocorico-yellow/40 dark:hover:ring-neutral-800/40"}`}
                      onClick={() => setMobileSheetOpen(false)}
                      aria-current={isActive(link.href) ? "page" : undefined}
                    >
                      <span aria-hidden="true">{link.icon}</span>
                      <span>{t(link.labelKey as any)}</span>
                    </Link>
                  ))}
                </nav>

                <Separator />

                {/* User section in mobile */}
                {user ? (
                  <div className="flex flex-col gap-2">
                    <div className="px-3 py-2 text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase">
                      {t("nav.account")}
                    </div>
                    {userMenuLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={withLocale(link.href)}
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-bold text-neutral-900 dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800"
                        onClick={() => setMobileSheetOpen(false)}
                      >
                        <span aria-hidden="true">{link.icon}</span>
                        <span>{t(link.labelKey as any)}</span>
                      </Link>
                    ))}
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 text-left"
                    >
                      <span aria-hidden="true">🚪</span>
                      <span>{t("nav.logout")}</span>
                    </button>
                  </div>
                ) : (
                  <Link
                    href={withLocale("/login")}
                    className="flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold coco-glass"
                    onClick={() => setMobileSheetOpen(false)}
                  >
                    {t("nav.login")}
                  </Link>
                )}

                <Separator />

                {/* Language selector in mobile */}
                <div className="px-3">
                  <LanguageSelector />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
