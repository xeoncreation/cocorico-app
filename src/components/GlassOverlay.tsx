import { motion } from 'framer-motion';

export function GlassOverlay({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <motion.div
      initial={{ backdropFilter: 'blur(0px)', opacity: 0 }}
      animate={{ backdropFilter: 'blur(16px)', opacity: 1 }}
      exit={{ backdropFilter: 'blur(0px)', opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 bg-black/20"
    />
  );
}
