"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

// Idiomas soportados y futuros. 'available' indica si existe archivo de traducción.
const SUPPORTED = [
  { code: "es", name: "Español", flag: "🇪🇸", available: true, aliases: ["español", "spanish", "castellano", "es"] },
  { code: "en", name: "English", flag: "🇬🇧", available: true, aliases: ["english", "inglés", "en"] },
  { code: "fr", name: "Français", flag: "🇫🇷", available: false, aliases: ["frances", "french", "francés", "fr"] },
  { code: "de", name: "Deutsch", flag: "🇩🇪", available: false, aliases: ["aleman", "german", "alemán", "de"] },
  { code: "it", name: "Italiano", flag: "🇮🇹", available: false, aliases: ["italiano", "italian", "it"] },
  { code: "pt", name: "Português", flag: "🇵🇹", available: false, aliases: ["portugues", "portuguese", "português", "pt"] },
  { code: "ja", name: "日本語", flag: "🇯🇵", available: false, aliases: ["japanese", "japones", "japonés", "ja"] },
  { code: "ko", name: "한국어", flag: "🇰🇷", available: false, aliases: ["korean", "coreano", "ko"] },
  { code: "zh", name: "中文", flag: "🇨🇳", available: false, aliases: ["chinese", "chino", "zh"] },
  { code: "ar", name: "العربية", flag: "🇸🇦", available: false, aliases: ["arabic", "arabe", "árabe", "ar"] },
];

function detectCurrentLocale(pathname: string | null) {
  if (!pathname) return null;
  const first = pathname.split("/").filter(Boolean)[0];
  return first && SUPPORTED.map(l => l.code).includes(first) ? first : null;
}

export default function LanguageSelector({ compact = false }: { compact?: boolean }) {
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useMemo(() => detectCurrentLocale(pathname) ?? "es", [pathname]);

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return SUPPORTED;
    return SUPPORTED.filter((l) =>
      [l.name, l.code, ...(l.aliases || [])]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [query]);

  function goToLocale(code: string) {
    const langObj = SUPPORTED.find(l => l.code === code);
    if (!langObj) return;
    if (!langObj.available) {
      // feedback visual cuando idioma no disponible
      const el = document.getElementById(`lang-${code}`);
      if (el) {
        el.classList.add('animate-pulse');
        setTimeout(() => el.classList.remove('animate-pulse'), 600);
      }
      return;
    }
    const parts = (pathname || "/").split("/").filter(Boolean);
    let target = "/" + code;
    if (parts.length > 0 && SUPPORTED.map(l=>l.code).includes(parts[0])) {
      const rest = parts.slice(1).join("/");
      if (rest) target += "/" + rest;
    } else if (pathname && pathname !== "/") {
      target += pathname;
    }
    setOpen(false);
    router.push(target.replace(/\/+$/, ""));
  }

  useEffect(() => {
    function onEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, []);

  return (
    <div className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open ? "true" : "false"}
        className={`flex items-center gap-1 border rounded-lg px-2.5 py-1.5 text-sm font-medium ${
          open
            ? "border-amber-500 shadow-sm bg-amber-50 dark:bg-amber-900/30" 
            : "border-neutral-300 dark:border-neutral-600"
        } hover:border-amber-400 dark:hover:border-amber-400 text-neutral-700 dark:text-neutral-200 bg-white dark:bg-neutral-800 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-400/60`}
        onClick={() => setOpen((v) => !v)}
      >
        <span>{SUPPORTED.find(l=>l.code===currentLocale)?.flag || '�'}</span>
        {compact ? currentLocale.toUpperCase() : 'Idioma'}
        <svg 
          className={`w-3 h-3 will-change-transform transition-transform duration-150 ${open ? 'rotate-180' : ''}`} 
          viewBox="0 0 20 20" 
          fill="currentColor"
        >
          <path d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"/>
        </svg>
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-72 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white/95 dark:bg-neutral-800/95 backdrop-blur-sm shadow-xl z-50 p-4 space-y-3">
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar idioma (ej: 'jap', 'portu', 'deu')"
            className="w-full border border-neutral-300 dark:border-neutral-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-amber-400/50"
          />
          <div className="flex items-center justify-between text-[10px] uppercase tracking-wide font-semibold text-neutral-500 dark:text-neutral-400 px-1">
            <span>{results.length} resultados</span>
            <span className="flex items-center gap-1"><span className="inline-block w-2 h-2 rounded-full bg-emerald-500"/>Disponible</span>
          </div>
          <ul className="max-h-64 overflow-auto divide-y divide-neutral-100 dark:divide-neutral-700 rounded-lg border border-neutral-200 dark:border-neutral-700">
            {results.length === 0 && (
              <li className="p-3 text-sm text-center text-neutral-500 dark:text-neutral-400">Sin resultados</li>
            )}
            {results.map((l) => {
              const active = l.code === currentLocale;
              return (
                <li key={l.code} id={`lang-${l.code}`}>
                  <button
                    type="button"
                    disabled={!l.available}
                    onClick={() => goToLocale(l.code)}
                    className={`group w-full text-left px-3 py-2 text-sm flex items-center justify-between gap-2 disabled:cursor-not-allowed ${
                      active
                        ? 'bg-amber-50 dark:bg-amber-900/40 text-amber-900 dark:text-amber-100 font-semibold'
                        : 'text-neutral-700 dark:text-neutral-200'
                    } ${l.available ? 'hover:bg-amber-50 dark:hover:bg-amber-900/30' : 'opacity-55'} transition-colors`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-lg leading-none">{l.flag}</span>
                      <span>{l.name}</span>
                      <span className="text-neutral-400 dark:text-neutral-500 text-xs">({l.code.toUpperCase()})</span>
                    </span>
                    {l.available ? (
                      <span className={`w-2 h-2 rounded-full ${active ? 'bg-amber-500' : 'bg-emerald-500'} group-hover:scale-110 transition-transform`} />
                    ) : (
                      <span className="text-[10px] uppercase tracking-wide bg-neutral-200 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300 px-1.5 py-0.5 rounded">Próx.</span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
          <div className="text-[10px] px-1 pt-1 text-neutral-500 dark:text-neutral-400 flex justify-between">
            <span>Idiomas "Próx." se añadirán pronto</span>
            <button type="button" onClick={() => setOpen(false)} className="underline hover:text-neutral-700 dark:hover:text-neutral-200">Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
}
