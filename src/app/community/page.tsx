"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Post {
  id: number;
  user_id: string;
  image_url: string;
  description: string;
  created_at: string;
  post_likes: { count: number }[];
  post_comments: { count: number }[];
}

import Wallpaper from "@/components/layout/Wallpaper";
import GlassCard from "@/components/ui/GlassCard";

export default function CommunityPage() {
  return (
    <>
      <Wallpaper
        imageLight="/branding/SEARCH - BÚSQUEDA — Especias y hierbas, modo claro.png"
        imageDark="/branding/SEARCH - BÚSQUEDA — Especias en mesa, modo oscuro.png"
      />
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        <h1 className="text-4xl font-bold mb-8 text-center">Comunidad Cocorico 🐓</h1>
        <div className="grid md:grid-cols-3 gap-6">
          <GlassCard>
            <h2 className="text-xl font-semibold mb-2">Feed</h2>
            <p className="text-sm mb-4">Últimas recetas compartidas por la comunidad.</p>
            <a href="/community/feed" className="inline-block px-4 py-2 rounded-lg bg-orange-500 text-white font-bold hover:bg-orange-600">Ver Feed</a>
          </GlassCard>
          <GlassCard>
            <h2 className="text-xl font-semibold mb-2">Retos</h2>
            <p className="text-sm mb-4">Participa en los retos activos y gana recompensas.</p>
            <a href="/community/challenges" className="inline-block px-4 py-2 rounded-lg bg-amber-500 text-white font-bold hover:bg-amber-600">Ver Retos</a>
          </GlassCard>
          <GlassCard>
            <h2 className="text-xl font-semibold mb-2">Chat</h2>
            <p className="text-sm mb-4">Conversa con otros usuarios en el chat global.</p>
            <a href="/community/chat" className="inline-block px-4 py-2 rounded-lg bg-cyan-500 text-white font-bold hover:bg-cyan-600">Ir al Chat</a>
          </GlassCard>
        </div>
      </div>
    </>
  );
}
