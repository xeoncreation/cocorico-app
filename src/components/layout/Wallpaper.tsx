"use client";

import React from "react";
import { useTheme } from "@/components/ThemeProvider";

/**
 * Wallpaper Component
 * 
 * Displays a dynamic background wallpaper that switches between light and dark mode images
 * based on the current theme. The wallpaper is fixed, blurred, and positioned behind all content.
 * 
 * @example
 * ```tsx
 * <Wallpaper
 *   imageLight="/branding/HOME-INICIO, Fondo Campo de Trigo, modo claro.png"
 *   imageDark="/branding/HOME - INICIO — Campo de trigo nocturno cálido (dark mode).png"
 * />
 * ```
 */

interface WallpaperProps {
  /** Path to the wallpaper image for light mode */
  imageLight: string;
  /** Path to the wallpaper image for dark mode */
  imageDark: string;
}

export default function Wallpaper({ imageLight, imageDark }: WallpaperProps) {
  const themeCtx = useTheme();
  const theme = themeCtx.theme;
  const bg = theme === "dark" ? imageDark : imageLight;

  return (
    <>
      <div
        aria-hidden
        className="fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat opacity-95 filter blur-[2px] transition-all duration-700"
        style={{ backgroundImage: `url("${bg}")` }}
      />
      {/* subtle theme-aware overlay to improve contrast for foreground content */}
      <div
        aria-hidden
        className={`fixed inset-0 -z-9 pointer-events-none transition-colors duration-700 ${
          theme === "dark" ? "bg-black/20" : "bg-white/5"
        }`}
      />
    </>
  );
}
