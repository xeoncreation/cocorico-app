"use client";

import { useState } from "react";
import { Video, Users, TrendingUp, Play, Eye, ThumbsUp } from "lucide-react";
import { ToolSelector, Tool, ToolLayout } from "@/components/ui/tool-selector";
import { motion } from "framer-motion";

const COMMUNITY_TOOLS: Tool[] = [
  {
    id: "videos",
    icon: <Video />,
    label: "Videos",
    description: "Contenido visual",
  },
  {
    id: "users",
    icon: <Users />,
    label: "Comunidad",
    description: "Otros cocineros",
  },
  {
    id: "stats",
    icon: <TrendingUp />,
    label: "Mis Estadísticas",
    description: "Tu progreso",
  },
];

export default function CommunityPage() {
  const [selectedTool, setSelectedTool] = useState("videos");

  return (
    <ToolLayout
        title="Comunidad Cocorico 🌟"
        subtitle="Explora videos, conecta con otros cocineros y revisa tus estadísticas culinarias."
      >
        {/* Tool Selector */}
        <div className="max-w-6xl mx-auto mb-8">
          <ToolSelector
            tools={COMMUNITY_TOOLS}
            selectedTool={selectedTool}
            onToolChange={setSelectedTool}
            layout="grid"
          />
        </div>

        {/* Content */}
        <div className="max-w-6xl mx-auto">
          {selectedTool === "videos" && <VideosView />}
          {selectedTool === "users" && <UsersView />}
          {selectedTool === "stats" && <StatsView />}
        </div>
      </ToolLayout>
  );
}

function VideosView() {
  const demoVideos = [
    { id: 1, title: "Cómo hacer Paella perfecta", author: "Chef María", views: "12.5K", duration: "15:30", likes: 245 },
    { id: 2, title: "Secretos de la Pasta Carbonara", author: "Giovanni Rossi", views: "8.2K", duration: "10:15", likes: 189 },
    { id: 3, title: "Tacos Mexicanos Auténticos", author: "Lupita Cocina", views: "15.8K", duration: "12:45", likes: 312 },
    { id: 4, title: "Postres Rápidos y Fáciles", author: "Dulce Repostería", views: "20.1K", duration: "08:20", likes: 456 },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-white text-xl font-semibold">Videos Populares</h2>
      </div>
      
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {demoVideos.map((video) => (
          <motion.div
            key={video.id}
            whileHover={{ scale: 1.02 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden cursor-pointer group hover:border-cocorico-naranja/40 transition-all"
          >
            {/* Thumbnail */}
            <div className="aspect-video bg-gradient-to-br from-purple-900/50 to-pink-900/50 relative flex items-center justify-center">
              <Play className="w-12 h-12 text-white/80 group-hover:scale-110 transition-transform" />
              <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                {video.duration}
              </div>
            </div>
            
            {/* Info */}
            <div className="p-3">
              <h3 className="text-white font-medium text-sm mb-1 line-clamp-2">{video.title}</h3>
              <p className="text-white/60 text-xs mb-2">{video.author}</p>
              <div className="flex items-center gap-3 text-white/50 text-xs">
                <span className="flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  {video.views}
                </span>
                <span className="flex items-center gap-1">
                  <ThumbsUp className="w-3 h-3" />
                  {video.likes}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function UsersView() {
  const demoUsers = [
    { id: 1, name: "Chef María", recipes: 45, followers: "2.3K", avatar: "👩‍🍳" },
    { id: 2, name: "Giovanni Rossi", recipes: 32, followers: "1.8K", avatar: "👨‍🍳" },
    { id: 3, name: "Lupita Cocina", recipes: 67, followers: "3.5K", avatar: "👩‍🍳" },
    { id: 4, name: "Dulce Repostería", recipes: 89, followers: "4.2K", avatar: "🧑‍🍳" },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-white text-xl font-semibold">Cocineros Destacados</h2>
      </div>
      
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {demoUsers.map((user) => (
          <motion.div
            key={user.id}
            whileHover={{ scale: 1.02 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center cursor-pointer hover:border-cocorico-turquoise/40 transition-all"
          >
            <div className="text-5xl mb-3">{user.avatar}</div>
            <h3 className="text-white font-medium mb-2">{user.name}</h3>
            <div className="flex items-center justify-center gap-4 text-sm text-white/60">
              <span>{user.recipes} recetas</span>
              <span>{user.followers} seguidores</span>
            </div>
            <button className="mt-4 w-full bg-cocorico-turquoise/20 hover:bg-cocorico-turquoise/30 text-cocorico-turquoise py-2 rounded-xl text-sm font-medium transition-colors">
              Seguir
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function StatsView() {
  const stats = [
    { label: "Recetas Cocinadas", value: "127", icon: "🍳", color: "from-orange-500/20 to-red-500/20" },
    { label: "Favoritos Guardados", value: "45", icon: "❤️", color: "from-pink-500/20 to-rose-500/20" },
    { label: "Videos Vistos", value: "89", icon: "📹", color: "from-purple-500/20 to-indigo-500/20" },
    { label: "Seguidores", value: "234", icon: "👥", color: "from-blue-500/20 to-cyan-500/20" },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={`bg-gradient-to-br ${stat.color} backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center`}
          >
            <div className="text-4xl mb-2">{stat.icon}</div>
            <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
            <div className="text-sm text-white/60">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Activity Chart Placeholder */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
        <h3 className="text-white text-lg font-semibold mb-4">Actividad Reciente</h3>
        <div className="h-48 bg-white/5 rounded-xl flex items-center justify-center">
          <TrendingUp className="w-12 h-12 text-white/20" />
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
        <h3 className="text-white text-lg font-semibold mb-4">Logros Recientes</h3>
        <div className="grid sm:grid-cols-3 gap-3">
          {["🏆", "⭐", "🎖️"].map((emoji, idx) => (
            <div key={idx} className="bg-white/5 rounded-xl p-4 text-center">
              <div className="text-3xl mb-2">{emoji}</div>
              <div className="text-white/60 text-sm">Logro {idx + 1}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
