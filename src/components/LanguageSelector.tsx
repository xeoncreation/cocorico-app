"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

const SUPPORTED = [
  { code: "es", name: "Español", aliases: ["español", "spanish", "castellano", "es"] },
  { code: "en", name: "English", aliases: ["english", "inglés", "en"] },
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
        className={`border rounded px-2 py-1 text-sm ${
          open 
            ? "border-amber-400 dark:border-amber-500" 
            : "border-neutral-300 dark:border-neutral-600"
        } hover:border-amber-300 dark:hover:border-amber-400 text-neutral-700 dark:text-neutral-200 bg-white dark:bg-neutral-800`}
        onClick={() => setOpen((v) => !v)}
      >
        {compact ? currentLocale.toUpperCase() : `Idioma: ${currentLocale.toUpperCase()}`}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-56 rounded-md border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 shadow-lg z-50 p-2">
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Escribe tu idioma..."
            className="w-full border border-neutral-300 dark:border-neutral-600 rounded px-2 py-1 text-sm mb-2 bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 placeholder:text-neutral-400 dark:placeholder:text-neutral-500"
          />
          <ul className="max-h-60 overflow-auto divide-y divide-neutral-200 dark:divide-neutral-700 rounded border border-neutral-200 dark:border-neutral-700">
            {results.length === 0 && (
              <li className="p-2 text-sm text-neutral-500 dark:text-neutral-400">Sin resultados</li>
            )}
            {results.map((l) => (
              <li key={l.code}>
                <button
                  type="button"
                  onClick={() => goToLocale(l.code)}
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-amber-50 dark:hover:bg-amber-900/30 ${
                    l.code === currentLocale 
                      ? "bg-amber-50 dark:bg-amber-900/40 text-amber-900 dark:text-amber-100" 
                      : "text-neutral-800 dark:text-neutral-200"
                  }`}
                >
                  {l.name} <span className="text-neutral-500 dark:text-neutral-400">({l.code.toUpperCase()})</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
