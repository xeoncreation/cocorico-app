"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export interface Tool {
  id: string;
  icon: ReactNode;
  label: string;
  description?: string;
}

interface ToolSelectorProps {
  tools: Tool[];
  selectedTool: string;
  onToolChange: (toolId: string) => void;
  className?: string;
  layout?: "grid" | "horizontal";
}

export function ToolSelector({
  tools,
  selectedTool,
  onToolChange,
  className,
  layout = "grid",
}: ToolSelectorProps) {
  return (
    <div
      className={cn(
        "flex gap-3",
        layout === "grid" 
          ? "flex-wrap justify-center" 
          : "overflow-x-auto scrollbar-hide",
        className
      )}
    >
      {tools.map((tool) => {
        const isSelected = selectedTool === tool.id;
        return (
          <motion.button
            key={tool.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onToolChange(tool.id)}
            className={cn(
              "relative flex items-center gap-3 px-4 py-3 rounded-2xl",
              "backdrop-blur-xl border transition-all duration-200",
              "min-w-[140px] sm:min-w-[160px]",
              isSelected
                ? "bg-cocorico-naranja/10 border-cocorico-naranja/40 shadow-lg shadow-cocorico-naranja/20"
                : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
            )}
          >
            {/* Icon */}
            <div
              className={cn(
                "text-xl transition-colors",
                isSelected ? "text-cocorico-naranja" : "text-white/70"
              )}
            >
              {tool.icon}
            </div>

            {/* Label */}
            <div className="flex-1 text-left">
              <div
                className={cn(
                  "font-medium text-sm transition-colors",
                  isSelected ? "text-white" : "text-white/80"
                )}
              >
                {tool.label}
              </div>
              {tool.description && (
                <div className="text-xs text-white/50 mt-0.5">
                  {tool.description}
                </div>
              )}
            </div>

            {/* Selected indicator */}
            {isSelected && (
              <motion.div
                layoutId="tool-selector-indicator"
                className="absolute inset-0 rounded-2xl border-2 border-cocorico-naranja/60"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
          </motion.button>
        );
      })}
    </div>
  );
}

interface ToolLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
}

export function ToolLayout({
  children,
  title,
  subtitle,
  className,
}: ToolLayoutProps) {
  return (
    <div
      className={cn(
        "min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950",
        "flex flex-col",
        className
      )}
    >
      {/* Header */}
      {(title || subtitle) && (
        <div className="px-4 py-8 sm:py-12 text-center">
          {title && (
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl sm:text-4xl font-bold text-white mb-2"
            >
              {title}
            </motion.h1>
          )}
          {subtitle && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-white/60 text-sm sm:text-base max-w-2xl mx-auto"
            >
              {subtitle}
            </motion.p>
          )}
        </div>
      )}

      {/* Content */}
      <div className="flex-1 px-4 pb-8">{children}</div>
    </div>
  );
}
