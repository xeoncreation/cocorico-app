import React from "react";
import { useTheme } from "@/components/ThemeProvider";

interface WallpaperProps {
  imageLight: string;
  imageDark: string;
}

export default function Wallpaper({ imageLight, imageDark }: WallpaperProps) {
  const themeCtx = useTheme();
  const theme = themeCtx.theme;
  const bg = theme === "dark" ? imageDark : imageLight;

  return (
    <div
      className="fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat opacity-90 filter blur-[6px]"
      style={{ backgroundImage: `url(${bg})` }}
    />
  );
}
