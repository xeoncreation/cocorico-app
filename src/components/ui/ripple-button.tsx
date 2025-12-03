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

  const createRipple = (_e: MouseEvent<HTMLButtonElement>) => {
    const newRipple: Ripple = {
      x: 0,
      y: 0,
      size: 0,
      id: rippleId++,
    };
    setRipples((prev) => [...prev, newRipple]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 600);
  };

  return (
    <Button
      {...props}
      className={cn(
        "ripple-container relative overflow-hidden",
        "ios-clear-button", // iOS Clear style
        "font-semibold transition-all duration-300",
        className
      )}
      onClick={(e) => {
        createRipple(e);
        props.onClick?.(e);
      }}
    >
      {children}
      {ripples.map((r) => (
        <span
          key={r.id}
          className="ripple-center"
        />
      ))}
    </Button>
  );
}
