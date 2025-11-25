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
    <div
      className="fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat opacity-100 filter blur-[3px]"
      style={{ backgroundImage: `url(${bg})` }}
    />
  );
}
