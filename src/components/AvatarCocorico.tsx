"use client";
import { useEffect, useRef, useState } from "react";

type VisemeItem = { start: number; end: number; viseme: string };

export default function AvatarCocorico({
  phonemes = [],
  small = false,
  overlay = false,
}: { phonemes?: VisemeItem[]; small?: boolean; overlay?: boolean }) {
  const [ts, setTs] = useState(0);
  const raf = useRef<number | null>(null);
  const startAt = useRef<number | null>(null);

  useEffect(() => {
    cancel();
    startAt.current = performance.now();
    const tick = (now: number) => {
      if (!startAt.current) startAt.current = now;
      setTs(now - startAt.current);
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return cancel;
  }, [phonemes]);

  function cancel() {
    if (raf.current) cancelAnimationFrame(raf.current);
    raf.current = null;
    startAt.current = null;
  }

  const current = phonemes.find(p => ts >= p.start && ts <= p.end)?.viseme || idleViseme(ts);

  const cls = small ? "w-28 h-28" : "w-40 h-40";
  const wrapper = overlay ? "pointer-events-none fixed right-4 bottom-4 z-40" : "";

  return (
    <div className={`${wrapper}`}>
      <svg viewBox="0 0 200 200" className={cls}>
        <defs>
          <linearGradient id="body" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>
        </defs>
        {/* Cabeza */}
        <circle cx="100" cy="100" r="80" fill="url(#body)" />
        {/* Pico superior */}
        <path d="M70 110 Q100 85 130 110" fill="#f97316" />
        {/* Pico inferior (boca) */}
        <path d={mouthPath(current)} fill="#fb923c" />
        {/* Ojos */}
        <circle cx="80" cy="85" r="8" fill="#111" />
        <circle cx="120" cy="85" r="8" fill="#111" />
        {/* Parpadeo simple */}
        {blink(ts) ? (
          <>
            <rect x="72" y="80" width="16" height="10" fill="#fbbf24" />
            <rect x="112" y="80" width="16" height="10" fill="#fbbf24" />
          </>
        ) : null}
      </svg>
    </div>
  );
}

function mouthPath(v: string) {
  switch (v) {
    case "A": return "M70 120 Q100 140 130 120 Q100 135 70 120";
    case "E": return "M70 118 Q100 125 130 118 Q100 122 70 118";
    case "I": return "M85 118 Q100 130 115 118 Q100 128 85 118";
    case "O": return "M80 120 Q100 150 120 120 Q100 145 80 120";
    case "U": return "M85 122 Q100 140 115 122 Q100 138 85 122";
    case "FV": return "M70 118 Q100 120 130 118 Q100 118 70 118";
    case "M": return "M70 120 Q100 120 130 120 Q100 120 70 120";
    default: return "M70 120 Q100 130 130 120 Q100 132 70 120";
  }
}

function idleViseme(ms: number) {
  // Idle: micro oscilación tipo "respirar"
  const s = Math.sin(ms / 600);
  return s > 0.6 ? "E" : s < -0.6 ? "M" : "I";
}

function blink(ms: number) {
  // Parpadeo cada 3–6s
  return Math.floor(ms / 3000) % 2 === 0 && (ms % 3000) < 120;
}
