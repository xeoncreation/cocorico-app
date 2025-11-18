"use client";

import { useState, MouseEvent } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Ripple = {
  x: number;
  y: number;
  size: number;
  id: number;
};

let rippleId = 0;

export function RippleButton({
  className,
  children,
  ...props
}: React.ComponentProps<typeof Button>) {
  const [ripples, setRipples] = useState<Ripple[]>([]);

  const createRipple = (e: MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    const newRipple: Ripple = {
      x,
      y,
      size,
      id: rippleId++,
    };

    setRipples((prev) => [...prev, newRipple]);

    // limpiar ripple después de la animación
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 600);
  };

  return (
    <Button
      {...props}
      className={cn("ripple-container relative overflow-hidden", className)}
      onClick={(e) => {
        createRipple(e);
        props.onClick?.(e);
      }}
    >
      {children}
      {ripples.map((r) => (
        <span
          key={r.id}
          className="ripple-circle absolute rounded-full bg-white/50 pointer-events-none animate-ripple"
          style={{
            width: r.size,
            height: r.size,
            left: r.x,
            top: r.y,
          }}
        />
      ))}
    </Button>
  );
}
