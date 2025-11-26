"use client";

import { useEffect, useState } from "react";
import { createClientComponentClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Clock, Users, ChefHat, ArrowLeft, Heart, Share2, Edit } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { Recipe } from "@/types/recipes";

interface RecipeDetailClientProps {
  id: string;
  locale: string;
}

export default function RecipeDetailClient({ id, locale }: RecipeDetailClientProps) {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);
  const supabase = createClientComponentClient();
  const router = useRouter();

  useEffect(() => {
    async function loadRecipe() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        const { data, error } = await supabase
          .from("recipes")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;
        
        setRecipe(data);
        if (user && data) {
          setIsOwner(user.id === data.user_id);
        }
      } catch (error) {
        console.error("Error loading recipe:", error);
      } finally {
        setLoading(false);
      }
    }
    loadRecipe();
  }, [id, supabase]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cocorico-red"></div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
        <h2 className="text-2xl font-bold mb-4 text-neutral-800 dark:text-neutral-200">Receta no encontrada</h2>
        <Button asChild>
          <Link href={`/${locale}/recipes`}>Volver a Recetas</Link>
        </Button>
      </div>
    );
  }

  // Mock data for ingredients and steps if not present in DB schema yet
  const ingredients = (recipe as any).ingredients || [
    "2 tazas de harina",
    "1 taza de azúcar",
    "3 huevos",
    "1/2 taza de leche",
    "1 cdta de vainilla"
  ];

  const steps = (recipe as any).steps || [
    "Precalentar el horno a 180°C.",
    "Mezclar los ingredientes secos en un bol.",
    "Batir los huevos y añadir la leche y vainilla.",
    "Incorporar la mezcla líquida a la seca.",
    "Hornear por 30-40 minutos."
  ];

  return (
    <div className="max-w-4xl mx-auto pb-12">
      {/* Navigation */}
      <div className="mb-6 flex items-center justify-between">
        <Button variant="ghost" className="hover:bg-white/20" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver
        </Button>
        <div className="flex gap-2">
          {isOwner && (
            <Button variant="outline" className="bg-white/10 border-white/20 hover:bg-white/20" asChild>
              <Link href={`/${locale}/recipes/${id}/edit`}>
                <Edit className="w-4 h-4 mr-2" />
                Editar
              </Link>
            </Button>
          )}
          <Button variant="ghost" size="icon" className="hover:bg-white/20">
            <Share2 className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="hover:bg-white/20 text-cocorico-red">
            <Heart className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative h-64 md:h-96 rounded-3xl overflow-hidden mb-8 shadow-2xl">
        <Image
          src={(recipe as any).image || "/branding/cocorico/default.png"}
          alt={recipe.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 p-6 md:p-10 text-white w-full">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 drop-shadow-lg">{recipe.title}</h1>
          <div className="flex flex-wrap gap-4 text-sm md:text-base font-medium">
            {recipe.prep_time && (
              <div className="flex items-center gap-2 bg-black/30 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                <Clock className="w-4 h-4" />
                <span>{recipe.prep_time} min</span>
              </div>
            )}
            {recipe.servings && (
              <div className="flex items-center gap-2 bg-black/30 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                <Users className="w-4 h-4" />
                <span>{recipe.servings} porciones</span>
              </div>
            )}
            <div className="flex items-center gap-2 bg-black/30 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
              <ChefHat className="w-4 h-4" />
              <span>Dificultad Media</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-8">
          {/* Description */}
          <GlassCard className="p-6">
            <h2 className="text-xl font-bold mb-4 text-cocorico-brown dark:text-amber-100">Sobre esta receta</h2>
            <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed">
              {recipe.description || "Sin descripción disponible."}
            </p>
          </GlassCard>

          {/* Ingredients (Mobile only, hidden on desktop to move to sidebar) */}
          <div className="md:hidden">
            <GlassCard className="p-6">
              <h2 className="text-xl font-bold mb-4 text-cocorico-brown dark:text-amber-100">Ingredientes</h2>
              <ul className="space-y-3">
                {ingredients.map((ing: string, i: number) => (
                  <li key={i} className="flex items-center gap-3 text-neutral-700 dark:text-neutral-300">
                    <div className="w-2 h-2 rounded-full bg-cocorico-yellow" />
                    {ing}
                  </li>
                ))}
              </ul>
            </GlassCard>
          </div>

          {/* Instructions */}
          <GlassCard className="p-6">
            <h2 className="text-xl font-bold mb-6 text-cocorico-brown dark:text-amber-100">Instrucciones</h2>
            <div className="space-y-8">
              {steps.map((step: string, i: number) => (
                <div key={i} className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-cocorico-red text-white flex items-center justify-center font-bold shadow-lg">
                    {i + 1}
                  </div>
                  <div className="pt-1">
                    <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">{step}</p>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Ingredients (Desktop) */}
          <div className="hidden md:block sticky top-24">
            <GlassCard className="p-6 bg-gradient-to-br from-white/40 to-white/10 dark:from-black/40 dark:to-black/10">
              <h2 className="text-xl font-bold mb-4 text-cocorico-brown dark:text-amber-100 flex items-center gap-2">
                <div className="w-1 h-6 bg-cocorico-yellow rounded-full" />
                Ingredientes
              </h2>
              <ul className="space-y-3">
                {ingredients.map((ing: string, i: number) => (
                  <li key={i} className="flex items-start gap-3 text-neutral-700 dark:text-neutral-300 pb-3 border-b border-neutral-200/50 dark:border-neutral-700/50 last:border-0 last:pb-0">
                    <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-cocorico-yellow flex-shrink-0" />
                    <span className="text-sm font-medium">{ing}</span>
                  </li>
                ))}
              </ul>
              
              <div className="mt-6 pt-4 border-t border-neutral-200 dark:border-neutral-700">
                <Button className="w-full bg-cocorico-green hover:bg-green-600 text-white">
                  Añadir a lista de compra
                </Button>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
}
