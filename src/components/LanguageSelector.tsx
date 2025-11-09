"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

const SUPPORTED = [
  { code: "es", name: "Español", aliases: ["español", "spanish", "castellano", "es"] },
  { code: "en", name: "English", aliases: ["english", "inglés", "en"] },
  // Los siguientes idiomas están preparados pero requieren archivos de traducción en src/messages/
  // { code: "fr", name: "Français", aliases: ["frances", "french", "francés", "fr"] },
  // { code: "de", name: "Deutsch", aliases: ["aleman", "german", "alemán", "de"] },
  // { code: "it", name: "Italiano", aliases: ["italiano", "italian", "it"] },
  // { code: "pt", name: "Português", aliases: ["portugues", "portuguese", "português", "pt"] },
  // { code: "ja", name: "日本語", aliases: ["japanese", "japones", "japonés", "ja"] },
  // { code: "ko", name: "한국어", aliases: ["korean", "coreano", "ko"] },
  // { code: "zh", name: "中文", aliases: ["chinese", "chino", "zh"] },
  // { code: "ar", name: "العربية", aliases: ["arabic", "arabe", "árabe", "ar"] },
];

function detectCurrentLocale(pathname: string | null) {
  if (!pathname) return null;
  const first = pathname.split("/").filter(Boolean)[0];
  return first && ["es", "en"].includes(first) ? first : null;
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
    const parts = (pathname || "/").split("/").filter(Boolean);
    let target = "/" + code;
    if (parts.length > 0 && ["es", "en"].includes(parts[0])) {
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
        className={`flex items-center gap-1.5 border rounded-lg px-3 py-2 text-sm font-medium transition ${
          open 
            ? "border-amber-400 dark:border-amber-500 bg-amber-50 dark:bg-amber-900/20" 
            : "border-neutral-300 dark:border-neutral-600 hover:border-amber-300 dark:hover:border-amber-400"
        } text-neutral-700 dark:text-neutral-200 bg-white dark:bg-neutral-800 shadow-sm`}
        onClick={() => setOpen((v) => !v)}
        aria-label="Selector de idioma"
      >
        <span className="text-base">🌍</span>
        <span>{compact ? currentLocale.toUpperCase() : `${currentLocale.toUpperCase()}`}</span>
        <svg 
          className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-64 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 shadow-xl z-50 p-3">
          <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1.5">
            Buscar idioma
          </label>
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Escribe el nombre..."
            className="w-full border-2 border-neutral-300 dark:border-neutral-600 rounded-lg px-3 py-2 text-sm mb-3 bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
          />
          <ul className="max-h-60 overflow-auto divide-y divide-neutral-200 dark:divide-neutral-700 rounded-lg border border-neutral-200 dark:border-neutral-700">
            {results.length === 0 && (
              <li className="p-3 text-sm text-center text-neutral-500 dark:text-neutral-400">
                Sin resultados
              </li>
            )}
            {results.map((l) => (
              <li key={l.code}>
                <button
                  type="button"
                  onClick={() => goToLocale(l.code)}
                  className={`w-full text-left px-4 py-3 text-sm transition ${
                    l.code === currentLocale 
                      ? "bg-amber-100 dark:bg-amber-900/40 text-amber-900 dark:text-amber-100 font-semibold" 
                      : "text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{l.name}</span>
                    <span className="text-xs font-mono text-neutral-500 dark:text-neutral-400">
                      {l.code.toUpperCase()}
                      {l.code === currentLocale && ' ✓'}
                    </span>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
