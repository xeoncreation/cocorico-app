"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Menu } from "lucide-react";
import AuthButton from "@/components/AuthButton";
import LanguageSelector from "@/components/LanguageSelector";

const navLinks = [
  { href: "/", key: "nav.home" },
  { href: "/recipes/search", key: "nav.search" },
  { href: "/learn", key: "nav.learn" },
  { href: "/dashboard", key: "nav.dashboard" },
  { href: "/dashboard/favorites", key: "nav.favorites" },
  { href: "/dashboard/versions", key: "nav.versions" },
  { href: "/dashboard/import", key: "nav.import" },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const t = useTranslations();
  const locale = useLocale();
  const withLocale = (href: string) => `/${locale}${href === "/" ? "" : href}`;
  const isActive = (href: string) => {
    const target = withLocale(href);
    return pathname === target || pathname.endsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur border-b">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link href={withLocale('/')} className="font-bold text-amber-800">
          🐓 Cocorico
        </Link>

        {/* Desktop */}
        <nav className="hidden gap-6 md:flex">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={withLocale(l.href)}
              className={`text-sm hover:text-amber-800 ${
                isActive(l.href) ? "text-amber-800 font-medium" : "text-neutral-600"
              }`}
            >
                  {t(l.key as any)}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          <LanguageSelector compact />
          <AuthButton />
        </div>

        {/* Mobile */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon"><Menu /></Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <div className="py-4">
                <div className="px-1 pb-2 font-semibold text-amber-800">Cocorico</div>
                <Separator />
                <nav className="mt-3 grid gap-2">
                  {navLinks.map((l) => (
                    <Link
                      key={l.href}
                      href={withLocale(l.href)}
                      className={`rounded px-2 py-2 text-sm hover:bg-amber-50 ${
                        isActive(l.href) ? "bg-amber-50 text-amber-800" : "text-neutral-700"
                      }`}
                    >
                      {t(l.key as any)}
                    </Link>
                  ))}
                </nav>
                <Separator className="my-3" />
                <AuthButton />
                <div className="mt-3"><LanguageSelector /></div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
