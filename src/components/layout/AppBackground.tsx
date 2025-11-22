"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

type BackgroundVariant =
  | "home-free"
  | "home-premium"
  | "recipes-free"
  | "recipes-neutral"
  | "learn"
  | "stats"
  | "community"
  | "feedback"
  | "profile"
  | "onboarding"
  | "dashboard";

/**
 * Devuelve la clase CSS de fondo según la ruta actual y, opcionalmente,
 * según si el usuario es premium o no.
 */
function resolveBackgroundVariant(
  pathname: string,
  isPremium?: boolean
): BackgroundVariant {
  // Normalizamos para evitar problemas con locale
  // Ej: /es/dashboard, /en/dashboard etc.
  const path = pathname.replace(/^\/[a-z]{2}\//, "/");

  if (path === "/" || path.startsWith("/dashboard")) {
    return isPremium ? "home-premium" : "home-free";
  }

  if (path.startsWith("/recipes/search") || path.startsWith("/recipes")) {
    // Para listados largos mejor un fondo más neutro
    return "recipes-neutral";
  }

  if (path.startsWith("/learn")) {
    return "learn";
  }

  if (path.startsWith("/dashboard/stats")) {
    return "stats";
  }

  if (path.startsWith("/community")) {
    return "community";
  }

  if (path.startsWith("/dashboard/feedback")) {
    return "feedback";
  }

  if (path.startsWith("/dashboard/profile") || path.startsWith("/settings")) {
    return "profile";
  }

  if (path.startsWith("/onboarding")) {
    return "onboarding";
  }

  // Fallback general
  return isPremium ? "home-premium" : "home-free";
}

type AppBackgroundProps = {
  children: React.ReactNode;
  /** Forzar un fondo concreto (opcional); si no, se deduce por ruta */
  variantOverride?: BackgroundVariant;
  /** Si ya tienes el plan disponible, pásalo para elegir mejor el fondo home */
  isPremium?: boolean;
  className?: string;
};

export function AppBackground({
  children,
  variantOverride,
  isPremium,
  className,
}: AppBackgroundProps) {
  const pathname = usePathname();
  const variant =
    variantOverride ?? resolveBackgroundVariant(pathname ?? "/", isPremium);

  const variantClass: Record<BackgroundVariant, string> = {
    "home-free": "coco-bg-home-free",
    "home-premium": "coco-bg-home-premium",
    "recipes-free": "coco-bg-recipes-free",
    "recipes-neutral": "coco-bg-recipes-neutral",
    learn: "coco-bg-learn",
    stats: "coco-bg-stats",
    community: "coco-bg-community",
    feedback: "coco-bg-feedback",
    profile: "coco-bg-profile",
    onboarding: "coco-bg-onboarding",
    dashboard: "coco-bg-home-free",
  };

  return (
    <div className={cn("app-root-bg-inner min-h-screen", className)}>
      <div className={cn("coco-page-background", variantClass[variant])} />
      {children}
    </div>
  );
}

export default AppBackground;
export type { BackgroundVariant };
