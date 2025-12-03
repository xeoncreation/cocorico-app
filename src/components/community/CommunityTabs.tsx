"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface CommunityTabsProps {
  locale: string;
}

const tabs = [
  { href: "/community", label: "Inicio", icon: "🏠" },
  { href: "/community/feed", label: "Feed", icon: "📰" },
  { href: "/community/challenges", label: "Retos", icon: "🏆" },
  { href: "/community/chat", label: "Chat", icon: "💬" },
];

export default function CommunityTabs({ locale }: CommunityTabsProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    const fullPath = `/${locale}${href}`;
    if (href === "/community") {
      return pathname === fullPath;
    }
    return pathname?.startsWith(fullPath);
  };

  return (
    <nav className="navbar-liquid sticky top-16 z-40 border-b border-white/30 dark:border-slate-700/60">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex gap-1 overflow-x-auto scrollbar-hide py-2">
          {tabs.map((tab) => (
            <Link
              key={tab.href}
              href={`/${locale}${tab.href}`}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all",
                "hover:bg-white/20 dark:hover:bg-slate-800/40",
                isActive(tab.href)
                  ? "bg-white/30 dark:bg-slate-800/60 text-amber-600 dark:text-amber-400 shadow-lg"
                  : "text-neutral-700 dark:text-neutral-300"
              )}
            >
              <span className="text-lg">{tab.icon}</span>
              <span>{tab.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
