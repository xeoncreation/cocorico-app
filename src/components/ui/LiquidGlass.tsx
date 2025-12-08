"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from "framer-motion";

/**
 * Liquid Glass Design System - iOS Inspired
 * Sistema de componentes con glassmorphism avanzado tipo iOS
 */

// ============================================================================
// GLASS CARD - Componente base para contenedores glass
// ============================================================================

interface GlassCardProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  variant?: "default" | "premium" | "subtle" | "frosted" | "ios";
  blur?: "sm" | "md" | "lg" | "xl" | "2xl";
  shine?: boolean;
  border?: boolean;
  shadow?: "none" | "sm" | "md" | "lg" | "xl";
}

export const LiquidGlassCard = ({
  children,
  variant = "default",
  blur = "lg",
  shine = false,
  border = true,
  shadow = "lg",
  className,
  ...props
}: GlassCardProps) => {
  const variants = {
    default: "bg-white/10 dark:bg-black/10",
    premium: "bg-gradient-to-br from-white/20 to-white/5 dark:from-white/10 dark:to-black/20",
    subtle: "bg-white/5 dark:bg-black/5",
    frosted: "bg-white/30 dark:bg-black/30",
    ios: "bg-white/70 dark:bg-black/50",
  };

  const blurs = {
    sm: "backdrop-blur-sm",
    md: "backdrop-blur-md",
    lg: "backdrop-blur-lg",
    xl: "backdrop-blur-xl",
    "2xl": "backdrop-blur-2xl",
  };

  const shadows = {
    none: "",
    sm: "shadow-sm",
    md: "shadow-md",
    lg: "shadow-lg shadow-black/5 dark:shadow-black/20",
    xl: "shadow-xl shadow-black/10 dark:shadow-black/30",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "relative rounded-3xl",
        variants[variant],
        blurs[blur],
        shadows[shadow],
        border && "border border-white/20 dark:border-white/10",
        shine && "before:absolute before:inset-0 before:rounded-3xl before:bg-gradient-to-br before:from-white/30 before:to-transparent before:opacity-50",
        "transition-all duration-300",
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// ============================================================================
// GLASS BUTTON - Botones con efecto glass
// ============================================================================

interface GlassButtonProps extends HTMLMotionProps<"button"> {
  children: ReactNode;
  variant?: "default" | "primary" | "premium" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  isActive?: boolean;
}

export const LiquidGlassButton = ({
  children,
  variant = "default",
  size = "md",
  isActive = false,
  className,
  ...props
}: GlassButtonProps) => {
  const variants = {
    default: "bg-white/10 hover:bg-white/20 active:bg-white/30 dark:bg-black/10 dark:hover:bg-black/20",
    primary: "bg-gradient-to-r from-blue-500/80 to-purple-500/80 hover:from-blue-500/90 hover:to-purple-500/90 text-white",
    premium: "bg-gradient-to-r from-amber-500/80 to-orange-500/80 hover:from-amber-500/90 hover:to-orange-500/90 text-white",
    danger: "bg-gradient-to-r from-red-500/80 to-pink-500/80 hover:from-red-500/90 hover:to-pink-500/90 text-white",
    ghost: "hover:bg-white/10 active:bg-white/20 dark:hover:bg-black/10",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm rounded-xl",
    md: "px-4 py-2.5 text-base rounded-2xl",
    lg: "px-6 py-3.5 text-lg rounded-2xl",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "relative backdrop-blur-lg border border-white/20 dark:border-white/10",
        "font-medium transition-all duration-200",
        "shadow-lg shadow-black/5 dark:shadow-black/20",
        variants[variant],
        sizes[size],
        isActive && "ring-2 ring-blue-500/50",
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
};

// ============================================================================
// GLASS INPUT - Inputs con efecto glass
// ============================================================================

interface GlassInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: ReactNode;
  error?: boolean;
}

export const LiquidGlassInput = ({
  icon,
  error,
  className,
  ...props
}: GlassInputProps) => {
  return (
    <div className="relative">
      {icon && (
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60">
          {icon}
        </div>
      )}
      <input
        className={cn(
          "w-full px-4 py-3 rounded-2xl",
          "bg-white/10 dark:bg-black/10 backdrop-blur-lg",
          "border border-white/20 dark:border-white/10",
          "text-gray-900 dark:text-white placeholder:text-white/50",
          "focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent",
          "transition-all duration-200",
          icon && "pl-12",
          error && "border-red-500/50 focus:ring-red-500/50",
          className
        )}
        {...props}
      />
    </div>
  );
};

// ============================================================================
// GLASS CONTAINER - Contenedor principal con efecto iOS
// ============================================================================

interface GlassContainerProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  fullscreen?: boolean;
  centered?: boolean;
}

export const LiquidGlassContainer = ({
  children,
  fullscreen = false,
  centered = false,
  className,
  ...props
}: GlassContainerProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "relative",
        fullscreen && "fixed inset-0",
        centered && "flex items-center justify-center",
        className
      )}
      {...props}
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/90 via-purple-50/90 to-pink-50/90 dark:from-blue-950/90 dark:via-purple-950/90 dark:to-pink-950/90" />
      
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute top-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
        />
      </div>

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
};

// ============================================================================
// GLASS TOGGLE - Switch toggle con efecto glass
// ============================================================================

interface GlassToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  icon?: ReactNode;
  activeIcon?: ReactNode;
}

export const LiquidGlassToggle = ({
  checked,
  onChange,
  label,
  icon,
  activeIcon,
}: GlassToggleProps) => {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex items-center gap-3 px-4 py-2.5 rounded-2xl",
        "backdrop-blur-lg border transition-all duration-300",
        checked
          ? "bg-blue-500/20 border-blue-500/50"
          : "bg-white/10 dark:bg-black/10 border-white/20 dark:border-white/10"
      )}
    >
      {/* Icon */}
      <motion.div
        initial={false}
        animate={{
          scale: checked ? 1.1 : 1,
          rotate: checked ? 360 : 0,
        }}
        transition={{ duration: 0.3 }}
        className={cn(
          "transition-colors",
          checked ? "text-blue-500" : "text-white/60"
        )}
      >
        {checked && activeIcon ? activeIcon : icon}
      </motion.div>

      {/* Label */}
      {label && (
        <span className="text-sm font-medium text-gray-900 dark:text-white">
          {label}
        </span>
      )}

      {/* Toggle indicator */}
      <motion.div
        className={cn(
          "w-12 h-6 rounded-full relative",
          checked ? "bg-blue-500" : "bg-white/20 dark:bg-black/20"
        )}
      >
        <motion.div
          animate={{
            x: checked ? 24 : 2,
          }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-lg"
        />
      </motion.div>
    </button>
  );
};

// ============================================================================
// GLASS BADGE - Badges con efecto glass
// ============================================================================

interface GlassBadgeProps {
  children: ReactNode;
  variant?: "default" | "primary" | "success" | "warning" | "danger";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const LiquidGlassBadge = ({
  children,
  variant = "default",
  size = "md",
  className,
}: GlassBadgeProps) => {
  const variants = {
    default: "bg-white/10 text-gray-900 dark:text-white border-white/20",
    primary: "bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-500/30",
    success: "bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/30",
    warning: "bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 border-yellow-500/30",
    danger: "bg-red-500/20 text-red-600 dark:text-red-400 border-red-500/30",
  };

  const sizes = {
    sm: "px-2 py-0.5 text-xs rounded-lg",
    md: "px-3 py-1 text-sm rounded-xl",
    lg: "px-4 py-1.5 text-base rounded-xl",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center font-medium backdrop-blur-lg border",
        variants[variant],
        sizes[size],
        className
      )}
    >
      {children}
    </span>
  );
};

// ============================================================================
// GLASS AVATAR - Avatares con efecto glass
// ============================================================================

interface GlassAvatarProps {
  src?: string;
  alt?: string;
  size?: "sm" | "md" | "lg" | "xl";
  isPremium?: boolean;
  isOnline?: boolean;
}

export const LiquidGlassAvatar = ({
  src,
  alt = "Avatar",
  size = "md",
  isPremium = false,
  isOnline = false,
}: GlassAvatarProps) => {
  const sizes = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
    xl: "w-16 h-16",
  };

  return (
    <div className="relative inline-block">
      <div
        className={cn(
          "relative rounded-full overflow-hidden backdrop-blur-lg",
          "bg-gradient-to-br from-white/20 to-white/10 dark:from-white/10 dark:to-black/20",
          "border-2",
          isPremium
            ? "border-amber-500/50"
            : "border-white/20 dark:border-white/10",
          sizes[size]
        )}
      >
        {src ? (
          <img src={src} alt={alt} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white/80 font-semibold">
            {alt.charAt(0).toUpperCase()}
          </div>
        )}
      </div>

      {/* Online indicator */}
      {isOnline && (
        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-900" />
      )}

      {/* Premium crown */}
      {isPremium && (
        <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-white text-xs">
          👑
        </div>
      )}
    </div>
  );
};
