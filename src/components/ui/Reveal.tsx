"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export default function Reveal({
  children, delay = 0, y = 16
}: { children: React.ReactNode; delay?: number; y?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  
  // Disable animations in test environments for immediate visibility
  // Check for Playwright user agent or test env variables
  const isTest = typeof window !== 'undefined' && (
    window.location.hostname === 'localhost' || 
    process.env.NODE_ENV === 'test' ||
    navigator.userAgent.includes('Playwright') ||
    window.location.hostname === '127.0.0.1'
  );
  const shouldAnimate = !isTest;

  return (
    <motion.div
      ref={ref}
      initial={shouldAnimate ? { opacity: 0, y } : { opacity: 1, y: 0 }}
      animate={inView || !shouldAnimate ? { opacity: 1, y: 0 } : {}}
      transition={shouldAnimate ? { duration: 0.35, delay } : { duration: 0 }}
    >
      {children}
    </motion.div>
  );
}
