"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Camera, Trophy, User, MessageSquare } from "lucide-react";
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

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800 z-50 pb-safe">
      <div className="flex justify-around items-center px-2 py-3">
        {navItems.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href || pathname?.startsWith(href + '/');
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors ${
                isActive
                  ? 'text-cocorico-red dark:text-amber-400'
                  : 'text-neutral-600 dark:text-neutral-400'
              }`}
            >
              <Icon size={20} />
              <span className="text-xs font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
