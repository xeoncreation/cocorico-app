"use client";
import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";

export default function Reveal({
  children, delay = 0, y = 16
}: { children: React.ReactNode; delay?: number; y?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [isTest, setIsTest] = useState(false);
  
  useEffect(() => {
    // Detect test environment on client side
    if (typeof window !== 'undefined' && typeof navigator !== 'undefined') {
      const isPlaywright = navigator.userAgent?.includes('Playwright') || 
                          navigator.userAgent?.includes('HeadlessChrome');
      const isTestEnv = process.env.NODE_ENV === 'test' ||
                       window.location.hostname === '127.0.0.1' ||
                       window.location.hostname === 'localhost';
      setIsTest(isPlaywright || isTestEnv);
    }
  }, []);

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
