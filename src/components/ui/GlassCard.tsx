"use client";
import { cn } from "@/lib/utils";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "base" | "accent" | "danger" | "success" | "info" | "premium";
}

const variantMap: Record<NonNullable<GlassCardProps["variant"]>, string> = {
  base: "bg-[rgba(255,240,230,0.18)]",
  accent: "bg-[linear-gradient(135deg,rgba(249,123,50,0.15),rgba(243,199,81,0.15))]",
  danger: "bg-[radial-gradient(circle_at_top,rgba(229,53,38,0.25),rgba(15,23,42,0.15))]",
  success: "bg-[radial-gradient(circle_at_top,rgba(46,138,86,0.25),rgba(15,23,42,0.15))]",
  info: "bg-[radial-gradient(circle_at_top,rgba(76,206,198,0.25),rgba(15,23,42,0.15))]",
  premium: "bg-[linear-gradient(135deg,rgba(243,199,81,0.25),rgba(249,123,50,0.25),rgba(229,53,38,0.2))]",
};

export function GlassCard({ className, variant = "base", ...props }: GlassCardProps) {
  return (
    <div
      className={cn(
        // iOS Clear style - less blur, more transparency, defined borders
        "backdrop-blur-md",
        "bg-white/15 dark:bg-slate-900/30",
        "border border-white/30 dark:border-slate-700/40",
        "rounded-3xl",
        "shadow-[0_8px_32px_rgba(0,0,0,0.12)]",
        "p-4 md:p-6",
        variantMap[variant],
        className
      )}
      {...props}
    />
  );
}

export default GlassCard;
