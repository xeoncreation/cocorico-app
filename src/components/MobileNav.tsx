"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Camera, Trophy, User, MessageSquare, Globe } from "lucide-react";
import { useEffect, useState } from "react";

export default function MobileNav() {
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Only show on mobile screens
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (!isMobile) return null;

  const navItems = [
    { href: "/", icon: Home, label: "Inicio" },
    { href: "/chat", icon: MessageSquare, label: "Chat" },
    { href: "/dev/lab", icon: Camera, label: "Lab" },
    { href: "/dashboard/challenges", icon: Trophy, label: "Retos" },
    { href: "/dashboard/profile", icon: User, label: "Perfil" },
  ];

  // Link pseudo para abrir el selector de idioma (overlay) reutilizando el componente.
  function openLanguageSelector() {
    const btn = document.querySelector('[aria-haspopup="listbox"]');
    if (btn) (btn as HTMLButtonElement).click();
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-sm border-t border-neutral-200 dark:border-neutral-800 z-50 pb-safe shadow-lg">
      <div className="flex justify-around items-center px-2 py-2">
        {navItems.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href || pathname?.startsWith(href + '/');
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-md transition-colors ${
                isActive
                  ? 'text-cocorico-red dark:text-amber-400'
                  : 'text-neutral-600 dark:text-neutral-400'
              } hover:bg-neutral-100 dark:hover:bg-neutral-800`}
            >
              <Icon size={20} />
              <span className="text-[11px] font-medium leading-none">{label}</span>
            </Link>
          );
        })}
        {/* Botón para selector de idioma */}
        <button
          onClick={openLanguageSelector}
          aria-label="Cambiar idioma"
          className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-md text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
        >
          <Globe size={20} />
          <span className="text-[11px] font-medium leading-none">Idioma</span>
        </button>
      </div>
    </nav>
  );
}
