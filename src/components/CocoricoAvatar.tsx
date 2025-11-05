"use client";

import { motion } from "framer-motion";

export default function CocoricoAvatar({ speaking }: { speaking: boolean }) {
  return (
    <motion.div
      className="fixed bottom-4 right-4 z-50"
      animate={{ scale: speaking ? 1.1 : 1, y: speaking ? -5 : 0 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="relative">
        <img
          src="/branding/cocorico-avatar.png"
          alt="Cocorico"
          className="w-32 h-32 drop-shadow-xl"
          onError={(e) => {
            // Fallback to emoji if image not found
            e.currentTarget.style.display = "none";
            e.currentTarget.parentElement!.innerHTML = '<div class="w-32 h-32 text-8xl flex items-center justify-center">🐓</div>';
          }}
        />
        {speaking && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center text-4xl"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            💬
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
