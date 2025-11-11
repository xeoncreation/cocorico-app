import { motion } from 'framer-motion';
import React from 'react';

export function PrimaryButton({ children, onClick, className = '' }: { children: React.ReactNode; onClick?: () => void; className?: string }) {
  return (
    <motion.button
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
      onClick={onClick}
      className={`h-12 px-6 rounded-2xl bg-primary text-white font-semibold shadow-md ${className}`}
    >
      {children}
    </motion.button>
  );
}
