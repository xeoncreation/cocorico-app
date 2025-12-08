"use client";

import { useState } from "react";
import { Heart, Sparkles, ChefHat, Plus, Clock, Users } from "lucide-react";
import { ToolSelector, Tool, ToolLayout } from "@/components/ui/tool-selector";
import { motion } from "framer-motion";
import Wallpaper from "@/components/layout/Wallpaper";

const RECIPE_TOOLS: Tool[] = [
  {
    id: "favorites",
    icon: <Heart />,
    label: "Favoritos",
    description: "Recetas guardadas",
  },
  {
    id: "ai-versions",
    icon: <Sparkles />,
    label: "Versiones IA",
    description: "Creadas con IA",
  },
  {
    id: "my-recipes",
    icon: <ChefHat />,
    label: "Mis Recetas",
    description: "Creadas por ti",
  },
];

export default function MyRecipesPage() {
  const [selectedTool, setSelectedTool] = useState("favorites");

  return (
    <>
      <Wallpaper
        imageLight="/branding/MIS RECETAS- DASHBOARD — Cocina cenital difusa, modo claro.png"
        imageDark="/branding/MIS RECETAS - DASHBOARD — Encimera oscura gourmet, modo oscuro.png"
      />
      <ToolLayout
        title="Mis Recetas 👨‍🍳"
        subtitle="Gestiona tus recetas favoritas, versiones creadas con IA y tus propias creaciones culinarias."
      >
        {/* Tool Selector */}
        <div className="max-w-6xl mx-auto mb-8">
          <ToolSelector
            tools={RECIPE_TOOLS}
            selectedTool={selectedTool}
            onToolChange={setSelectedTool}
            layout="grid"
          />
        </div>

        {/* Content */}
        <div className="max-w-6xl mx-auto">
          {selectedTool === "favorites" && <FavoritesView />}
          {selectedTool === "ai-versions" && <AIVersionsView />}
          {selectedTool === "my-recipes" && <MyRecipesView />}
        </div>
      </ToolLayout>
    </>
  );
}

function FavoritesView() {
  const demoRecipes = [
    { id: 1, name: "Paella Valenciana", time: "45 min", servings: 4, image: "🥘" },
    { id: 2, name: "Pasta Carbonara", time: "20 min", servings: 2, image: "🍝" },
    { id: 3, name: "Tacos al Pastor", time: "30 min", servings: 4, image: "🌮" },
  ];

  return (
    <div className="space-y-4">
      {/* GIF de favoritos */}
      <div className="mb-8 rounded-xl overflow-hidden max-w-2xl mx-auto">
        <img 
          src="/branding/favoritos-video.gif" 
          alt="Recetas favoritas"
          className="w-full h-auto"
        />
      </div>
      
      {demoRecipes.length === 0 ? (
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-12 text-center">
          <Heart className="w-16 h-16 text-white/20 mx-auto mb-4" />
          <p className="text-white/60 mb-4">No tienes recetas favoritas aún</p>
          <button className="bg-cocorico-naranja hover:bg-cocorico-naranja/90 text-white px-6 py-3 rounded-2xl font-medium transition-colors">
            Explorar Recetas
          </button>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-white text-xl font-semibold">{demoRecipes.length} recetas guardadas</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {demoRecipes.map((recipe) => (
              <motion.div
                key={recipe.id}
                whileHover={{ scale: 1.02 }}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 cursor-pointer group hover:border-cocorico-naranja/40 transition-all"
              >
                <div className="text-6xl text-center mb-3">{recipe.image}</div>
                <h3 className="text-white font-medium mb-2">{recipe.name}</h3>
                <div className="flex items-center gap-4 text-sm text-white/60">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {recipe.time}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {recipe.servings}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function AIVersionsView() {
  const demoVersions = [
    { id: 1, name: "Paella Vegana", base: "Paella Valenciana", date: "Hace 2 días", image: "🥘" },
    { id: 2, name: "Carbonara Ligera", base: "Pasta Carbonara", date: "Hace 1 semana", image: "🍝" },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-white text-xl font-semibold">Versiones creadas con IA</h2>
      </div>
      
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {demoVersions.map((version) => (
          <motion.div
            key={version.id}
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-4 cursor-pointer group"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="text-5xl">{version.image}</div>
              <div className="bg-purple-500/20 text-purple-300 text-xs px-2 py-1 rounded-lg flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                IA
              </div>
            </div>
            <h3 className="text-white font-medium mb-1">{version.name}</h3>
            <p className="text-white/50 text-sm mb-1">Basada en: {version.base}</p>
            <p className="text-white/40 text-xs">{version.date}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function MyRecipesView() {
  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-12 text-center">
      <ChefHat className="w-16 h-16 text-white/20 mx-auto mb-4" />
      <p className="text-white/60 mb-6">Aún no has creado ninguna receta propia</p>
      <button className="bg-cocorico-naranja hover:bg-cocorico-naranja/90 text-white px-6 py-3 rounded-2xl font-medium transition-colors inline-flex items-center gap-2">
        <Plus className="w-5 h-5" />
        Crear Mi Primera Receta
      </button>
    </div>
  );
}
