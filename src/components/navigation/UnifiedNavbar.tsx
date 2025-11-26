"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
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
 * - ✅ Dropdowns controlados por estado (click) para mejor UX
 */

interface NavLink {
  href: string;
  labelKey: string;
  icon: string;
}

const mainNavLinks: NavLink[] = [
  { href: "/", labelKey: "nav.home", icon: "🏠" },
  { href: "/recipes", labelKey: "nav.recipes", icon: "📖" },
];

const scannerMenu = {
  label: "Scanner",
  items: [
    { href: "/scanner", label: "Escanear", icon: "📷" },
    { href: "/scanner/history", label: "Historial", icon: "📋" },
  ],
};

const communityMenu = {
  label: "Comunidad",
  items: [
    { href: "/community", label: "Inicio", icon: "🏠" },
    { href: "/community/feed", label: "Feed", icon: "📰" },
    { href: "/community/challenges", label: "Retos", icon: "🏆" },
    { href: "/community/chat", label: "Chat", icon: "💬" },
  ],
};

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
  { href: "/community/feed", labelKey: "nav.feed", icon: "📰" },
  { href: "/community/challenges", labelKey: "nav.challenges", icon: "🏆" },
  { href: "/community/chat", labelKey: "nav.communityChat", icon: "🗨️" },
  { href: "/premium", labelKey: "nav.premium", icon: "⭐" },
];

export default function UnifiedNavbar() {
  const [user, setUser] = useState<User | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scannerOpen, setScannerOpen] = useState(false);
  const [communityOpen, setCommunityOpen] = useState(false);
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false);
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations();
  
  // Refs for click outside handling
  const scannerRef = useRef<HTMLDivElement>(null);
  const communityRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

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

  // Click outside handler
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (scannerRef.current && !scannerRef.current.contains(event.target as Node)) {
        setScannerOpen(false);
      }
      if (communityRef.current && !communityRef.current.contains(event.target as Node)) {
        setCommunityOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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

  // Helper: nav link classes - estilo liquid glass "water drop" con halo luminoso
  const navLinkClass = (href: string) => {
    const active = isActive(href);
    return `
      flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-bold
      transition-all duration-300 backdrop-blur-xl border
      ${
        active
          ? "bg-white/20 dark:bg-white/10 text-cocorico-red dark:text-amber-400 border-white/30 shadow-[0_0_15px_rgba(229,57,53,0.3)] dark:shadow-[0_0_15px_rgba(251,191,36,0.3)]"
          : "bg-white/5 dark:bg-black/5 text-neutral-800 dark:text-neutral-200 border-white/10 hover:bg-white/10 dark:hover:bg-white/5 hover:border-white/30 hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] hover:scale-105"
      }
    `.trim();
  };

  // Helper: Dropdown button classes
  const dropdownBtnClass = (isOpen: boolean) => `
    flex items-center gap-2 px-3 py-2.5 rounded-l-2xl text-sm font-bold
    transition-all duration-300 backdrop-blur-xl border-y border-l border-r-0
    bg-white/5 dark:bg-black/5 text-neutral-800 dark:text-neutral-200 border-white/10
    hover:bg-white/10 dark:hover:bg-white/5 hover:border-white/30 hover:shadow-[0_0_20px_rgba(255,255,255,0.4)]
    ${isOpen ? "bg-white/10 dark:bg-white/10 shadow-[0_0_15px_rgba(255,255,255,0.2)]" : ""}
  `.trim();

  const dropdownArrowClass = (isOpen: boolean) => `
    flex items-center px-2 py-2.5 rounded-r-2xl text-sm font-bold
    transition-all duration-300 backdrop-blur-xl border
    bg-white/5 dark:bg-black/5 text-neutral-800 dark:text-neutral-200 border-white/10
    hover:bg-white/10 dark:hover:bg-white/5 hover:border-white/30 hover:shadow-[0_0_20px_rgba(255,255,255,0.4)]
    ${isOpen ? "bg-white/10 dark:bg-white/10" : ""}
  `.trim();

  return (
    <nav className="flex items-center justify-between px-4 sm:px-6 py-3 sticky top-0 z-50 bg-white/5 dark:bg-black/5 backdrop-blur-2xl border-b border-white/10 shadow-sm transition-all duration-300">
      {/* Logo - botón liquid glass */}
      <Link
        href={withLocale("/")}
        className="font-display text-2xl font-black text-cocorico-red dark:text-amber-400 hover:scale-105 transition-all duration-300 drop-shadow-2xl px-4 py-2 rounded-2xl bg-white/10 dark:bg-white/5 backdrop-blur-xl border border-white/20 hover:shadow-[0_0_25px_rgba(229,57,53,0.4)] dark:hover:shadow-[0_0_25px_rgba(251,191,36,0.4)]"
        aria-label={t("nav.home")}
      >
        🐓 Cocorico
      </Link>

      {/* Desktop Navigation */}
      <div className="hidden lg:flex items-center gap-1">
        {/* Main links */}
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
        
        {/* Scanner split-button */}
        <div className="relative flex items-center" ref={scannerRef}>
          <Link 
            href={withLocale("/scanner")}
            className={dropdownBtnClass(scannerOpen)}
          >
            <span aria-hidden="true">📷</span>
            <span>Scanner</span>
          </Link>
          <button
            onClick={(e) => {
              e.preventDefault();
              setScannerOpen(!scannerOpen);
              setCommunityOpen(false); // Close others
            }}
            className={dropdownArrowClass(scannerOpen)}
            aria-label="Toggle Scanner menu"
            aria-expanded={scannerOpen}
          >
            <span aria-hidden="true" className="text-xs">{scannerOpen ? '▲' : '▼'}</span>
          </button>

          {scannerOpen && (
            <div className="absolute top-full left-0 mt-2 w-56 bg-white/90 dark:bg-black/90 backdrop-blur-3xl rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.3)] border border-white/20 dark:border-white/10 z-[100] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              {scannerMenu.items.map(item => (
                <Link 
                  key={item.href} 
                  href={withLocale(item.href)} 
                  onClick={() => setScannerOpen(false)}
                  className="flex items-center gap-3 px-5 py-3.5 text-sm font-bold text-neutral-800 dark:text-neutral-200 hover:bg-cocorico-red/10 dark:hover:bg-amber-400/10 hover:text-cocorico-red dark:hover:text-amber-400 transition-all hover:pl-7"
                >
                  <span aria-hidden="true" className="text-lg">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Comunidad split-button */}
        <div className="relative flex items-center ml-1" ref={communityRef}>
          <Link 
            href={withLocale("/community")}
            className={dropdownBtnClass(communityOpen)}
          >
            <span aria-hidden="true">👥</span>
            <span>Comunidad</span>
          </Link>
          <button
            onClick={(e) => {
              e.preventDefault();
              setCommunityOpen(!communityOpen);
              setScannerOpen(false); // Close others
            }}
            className={dropdownArrowClass(communityOpen)}
            aria-label="Toggle Comunidad menu"
            aria-expanded={communityOpen}
          >
            <span aria-hidden="true" className="text-xs">{communityOpen ? '▲' : '▼'}</span>
          </button>

          {communityOpen && (
            <div className="absolute top-full left-0 mt-2 w-60 bg-white/90 dark:bg-black/90 backdrop-blur-3xl rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.3)] border border-white/20 dark:border-white/10 z-[100] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              {communityMenu.items.map(item => (
                <Link 
                  key={item.href} 
                  href={withLocale(item.href)} 
                  onClick={() => setCommunityOpen(false)}
                  className="flex items-center gap-3 px-5 py-3.5 text-sm font-bold text-neutral-800 dark:text-neutral-200 hover:bg-cocorico-red/10 dark:hover:bg-amber-400/10 hover:text-cocorico-red dark:hover:text-amber-400 transition-all hover:pl-7"
                >
                  <span aria-hidden="true" className="text-lg">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
        
        {/* Premium button */}
        <Link href={withLocale("/premium")} className="glass-pill px-4 py-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white font-bold ml-2 hover:shadow-lg hover:scale-105 transition-all">
          ⭐ Premium
        </Link>
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
          <div className="relative" ref={userMenuRef}>
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
              <div 
                className="absolute right-0 mt-2 w-56 bg-white/90 dark:bg-black/90 backdrop-blur-3xl rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.3)] border border-white/20 dark:border-white/10 z-[100] py-1 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
                role="menu"
              >
                {userMenuLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={withLocale(link.href)}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
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
                  className="w-full flex items-center gap-2 text-left px-4 py-2 text-sm font-medium hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-colors"
                  role="menuitem"
                >
                  <span aria-hidden="true">🚪</span>
                  <span>{t("nav.logout")}</span>
                </button>
              </div>
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
            <SheetContent side="right" className="w-72 overflow-y-auto">
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
                  
                  {/* Scanner Mobile Links */}
                  <div className="flex flex-col gap-1 mt-2">
                    <div className="px-3 text-xs font-semibold text-neutral-500 uppercase">Scanner</div>
                    {scannerMenu.items.map(item => (
                      <Link
                        key={item.href}
                        href={withLocale(item.href)}
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium hover:bg-neutral-100 dark:hover:bg-neutral-800 ml-2"
                        onClick={() => setMobileSheetOpen(false)}
                      >
                        <span aria-hidden="true">{item.icon}</span>
                        <span>{item.label}</span>
                      </Link>
                    ))}
                  </div>

                  {/* Community Mobile Links */}
                  <div className="flex flex-col gap-1 mt-2">
                    <div className="px-3 text-xs font-semibold text-neutral-500 uppercase">Comunidad</div>
                    {communityMenu.items.map(item => (
                      <Link
                        key={item.href}
                        href={withLocale(item.href)}
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium hover:bg-neutral-100 dark:hover:bg-neutral-800 ml-2"
                        onClick={() => setMobileSheetOpen(false)}
                      >
                        <span aria-hidden="true">{item.icon}</span>
                        <span>{item.label}</span>
                      </Link>
                    ))}
                  </div>
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
