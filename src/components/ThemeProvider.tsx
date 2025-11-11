"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { useTheme as usePlanTheme } from "@/lib/useTheme"; // plan-based theme (free/premium)

type Theme = "light" | "dark";
const ThemeCtx = createContext<{ theme: Theme; toggle: () => void } | null>(null);

export function ThemeProvider({ children, userId }: { children: React.ReactNode; userId?: string }) {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const stored = localStorage.getItem("cocorico-theme") as Theme | null;
    const sysDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initial = stored ?? (sysDark ? "dark" : "light");
    setTheme(initial);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
    localStorage.setItem("cocorico-theme", theme);
  }, [theme]);

  // Apply plan-based theme variables (data-theme="free" | "premium")
  usePlanTheme(userId);

  return (
    <ThemeCtx.Provider value={{ theme, toggle: () => setTheme(t => (t === "dark" ? "light" : "dark")) }}>
      {children}
    </ThemeCtx.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeCtx);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
