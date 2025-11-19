"use client";
import { cn } from "@/lib/utils";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "base" | "accent" | "danger" | "success" | "info" | "premium";
}

const variantMap: Record<NonNullable<GlassCardProps["variant"]>, string> = {
  base: "bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.35),_rgba(255,255,255,0.06))]",
  accent: "bg-[radial-gradient(circle_at_top,_rgba(255,90,36,0.45),_rgba(10,10,10,0.35))]",
  danger: "bg-[radial-gradient(circle_at_top,_rgba(239,68,68,0.35),_rgba(15,23,42,0.7))]",
  success: "bg-[radial-gradient(circle_at_top,_rgba(34,197,94,0.35),_rgba(15,23,42,0.7))]",
  info: "bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.4),_rgba(15,23,42,0.7))]",
  premium: "bg-[radial-gradient(circle_at_top,_rgba(147,51,234,0.45),_rgba(15,23,42,0.85))]",
};

export function GlassCard({ className, variant = "base", ...props }: GlassCardProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[32px] md:rounded-[40px]",
        "backdrop-blur-3xl border border-[rgba(255,255,255,0.55)]",
        "shadow-[0_18px_45px_rgba(15,23,42,0.45)]",
        "before:absolute before:inset-x-[-40%] before:-top-24 before:h-32 before:bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.9),_transparent_70%)] before:opacity-70 before:pointer-events-none",
        "after:absolute after:inset-px after:rounded-[30px] after:border after:border-[rgba(255,255,255,0.5)] after:opacity-80 after:pointer-events-none",
        variantMap[variant],
        className
      )}
      {...props}
    />
  );
}

export default GlassCard;
