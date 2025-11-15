"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function PlanThemeProvider({
  theme,             // "free" | "premium" | "auto"
  children,
}: {
  theme?: "free" | "premium" | "auto";
  children: React.ReactNode;
}) {
  const search = useSearchParams();

  useEffect(() => {
    // 1) query param tiene prioridad en dev: ?theme=premium
    const q = search.get("theme");
    const qp = q === "premium" || q === "free" ? q : null;

    // 2) cookie de fuerza (puesta por /api/dev/set-theme)
    const m = document.cookie.match(/(?:^|; )force_theme=(free|premium)/);
    const ck = m?.[1] === "premium" || m?.[1] === "free" ? (m[1] as "free"|"premium") : null;

    // 3) prop theme
    const fallback = theme && theme !== "auto" ? theme : "free";

    const finalTheme = (qp ?? ck ?? fallback) as "free" | "premium";
    document.documentElement.dataset.theme = finalTheme;
  }, [search, theme]);

  return <>{children}</>;
}
