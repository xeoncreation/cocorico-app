"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

type MascotMood = "default" | "happy" | "thinking" | "cooking" | "alert" | "chef";

const MASCOT_IMAGES: Record<MascotMood, string> = {
  default: "/branding/cocorico/default.png",
  happy: "/branding/cocorico/happy.png",
  thinking: "/branding/cocorico/thinking.png",
  cooking: "/branding/cocorico/cocorico-cooking.png",
  alert: "/branding/cocorico/alert.png",
  chef: "/branding/cocorico/chef.png",
};

export default function CocoricoMascot({
  mood = "default",
  size = "md",
  animated = true,
  showBubble = false,
  bubbleText = "",
  className,
}: {
  mood?: MascotMood;
  size?: "sm" | "md" | "lg" | "xl";
  animated?: boolean;
  showBubble?: boolean;
  bubbleText?: string;
  className?: string;
}) {
  const [currentMood, setCurrentMood] = useState<MascotMood>(mood);

  useEffect(() => {
    setCurrentMood(mood);
  }, [mood]);

  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-32 h-32",
    xl: "w-48 h-48",
  };

  return (
    <div className={cn("relative inline-block", className)}>
      {/* Mascot Image */}
      <div
        className={cn(
          sizeClasses[size],
          "relative",
          animated && "animate-bounce-slow"
        )}
      >
        <Image
          src={MASCOT_IMAGES[currentMood]}
          alt="Cocorico"
          fill
          className="object-contain drop-shadow-lg"
          priority
        />
      </div>

      {/* Speech Bubble */}
      {showBubble && bubbleText && (
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-sm rounded-2xl px-4 py-2 shadow-lg border border-primary/20 min-w-[200px] max-w-[300px]">
          <p className="text-sm text-slate-800 text-center font-medium">
            {bubbleText}
          </p>
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white/95" />
        </div>
      )}
    </div>
  );
}

// Hook for easy mood transitions
export function useMascotMood(initialMood: MascotMood = "default") {
  const [mood, setMood] = useState<MascotMood>(initialMood);

  const updateMood = (newMood: MascotMood, duration?: number) => {
    setMood(newMood);
    if (duration) {
      setTimeout(() => setMood("default"), duration);
    }
  };

  return { mood, setMood: updateMood };
}
