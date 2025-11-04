"use client";
import { motion } from "framer-motion";

export default function Loader() {
  return (
    <motion.div
      className="flex justify-center items-center h-32"
      animate={{ rotate: 360 }}
      transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
    >
      <img src="/globe.svg" className="w-10 h-10" alt="Cargando" />
    </motion.div>
  );
}
