"use client";

import Link from "next/link";
import { useLocale } from "next-intl";
import { Camera, Plus, Mic, Sparkles } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

type FABAction = {
  icon: React.ReactNode;
  label: string;
  href: string;
  color: string;
};

export default function FloatingActionButton() {
  const [isOpen, setIsOpen] = useState(false);
  let locale: string | undefined;
  try { locale = useLocale(); } catch { locale = undefined; }

  const linkWithLocale = (href: string) => (locale ? `/${locale}${href}` : href);

  const actions: FABAction[] = [
    {
      icon: <Camera className="w-5 h-5" />,
      label: "Escanear",
      href: linkWithLocale('/scanner'),
      color: "from-cocorico-mango to-cocorico-datil",
    },
    {
      icon: <Mic className="w-5 h-5" />,
      label: "Chat de Voz",
      href: linkWithLocale('/chat'),
      color: "from-cocorico-turquoise to-cocorico-avocado",
    },
    {
      icon: <Sparkles className="w-5 h-5" />,
      label: "Chat IA",
      href: linkWithLocale('/chat'),
      color: "from-cocorico-red to-cocorico-mango",
    },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col-reverse items-end gap-3">
      {/* Secondary actions - shown when open */}
      {isOpen && (
        <div className="flex flex-col-reverse items-end gap-3 animate-in fade-in slide-in-from-bottom-4 duration-200">
          {actions.map((action, index) => (
            <Link
              key={action.href}
              href={action.href}
              onClick={() => setIsOpen(false)}
              className={cn(
                "group flex items-center gap-3 animate-in slide-in-from-right duration-200",
              )}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <span className="px-3 py-1.5 bg-white/95 dark:bg-neutral-800/95 backdrop-blur-sm rounded-full text-sm font-semibold shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {action.label}
              </span>
              <div
                className={cn(
                  "w-12 h-12 rounded-full bg-gradient-to-br shadow-xl flex items-center justify-center text-white hover:scale-110 transition-transform",
                  action.color
                )}
              >
                {action.icon}
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Main FAB button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-14 h-14 rounded-full bg-gradient-to-br from-cocorico-red via-cocorico-mango to-cocorico-datil shadow-2xl flex items-center justify-center text-white hover:scale-110 active:scale-95 transition-all duration-200",
          isOpen && "rotate-45"
        )}
        aria-label="Acciones rápidas"
      >
        <Plus className="w-7 h-7" />
      </button>
    </div>
  );
}
