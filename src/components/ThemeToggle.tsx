"use client";
import { useTheme } from "./ThemeProvider";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();
  
  return (
    <button
      onClick={toggle}
      aria-label={theme === "dark" ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
      className="relative flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium transition-all duration-300 hover:scale-105 bg-gradient-to-r from-amber-400/10 to-orange-400/10 hover:from-amber-400/20 hover:to-orange-400/20 dark:from-purple-500/10 dark:to-blue-500/10 dark:hover:from-purple-500/20 dark:hover:to-blue-500/20 border border-amber-400/30 dark:border-purple-400/30"
      title={theme === "dark" ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
    >
      {theme === "dark" ? (
        <>
          <Moon className="w-4 h-4 text-purple-400" />
          <span className="hidden sm:inline text-purple-300">Oscuro</span>
        </>
      ) : (
        <>
          <Sun className="w-4 h-4 text-amber-600" />
          <span className="hidden sm:inline text-amber-700">Claro</span>
        </>
      )}
    </button>
  );
}
