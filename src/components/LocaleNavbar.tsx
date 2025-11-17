"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface LocaleNavbarProps {
  locale: string;
}

export default function LocaleNavbar({ locale }: LocaleNavbarProps) {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === `/${locale}`) return pathname === `/${locale}`;
    return pathname?.startsWith(path);
  };

  const navLinkClass = (path: string) =>
    `flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition ${
      isActive(path)
        ? "bg-cocorico-red/10 dark:bg-amber-400/10 text-cocorico-red dark:text-amber-400 font-bold border-b-2 border-cocorico-red dark:border-amber-400"
        : "text-cocorico-brown dark:text-neutral-200 hover:bg-cocorico-yellow/20 dark:hover:bg-neutral-700"
    }`;

  return (
    <div className="hidden md:flex items-center gap-4">
      <Link href={`/${locale}/chat`} className={navLinkClass(`/${locale}/chat`)}>
        💬 Chat
      </Link>
      <Link href={`/${locale}/scanner`} className={navLinkClass(`/${locale}/scanner`)}>
        📷 Escáner
      </Link>
      <Link href={`/${locale}/recipes`} className={navLinkClass(`/${locale}/recipes`)}>
        📖 Recetas
      </Link>
      <Link href={`/${locale}/learn`} className={navLinkClass(`/${locale}/learn`)}>
        🎓 Aprender
      </Link>
      <Link href={`/${locale}/community`} className={navLinkClass(`/${locale}/community`)}>
        👥 Comunidad
      </Link>
      <Link href="/dashboard/challenges" className={navLinkClass("/dashboard/challenges")}>
        🏆 Retos
      </Link>
      <Link href={`/${locale}/pricing`} className={navLinkClass(`/${locale}/pricing`)}>
        ⭐ Premium
      </Link>
    </div>
  );
}
