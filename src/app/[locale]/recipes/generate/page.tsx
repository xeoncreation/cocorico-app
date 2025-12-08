"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import Wallpaper from "@/components/layout/Wallpaper";
import { AppBackground } from "@/components/layout/AppBackground";
import GlassCard from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Clock, Users, ChefHat, Loader2, Save } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface GeneratedRecipe {
  title: string;
  description: string;
  servings: number;
  prepTime: string;
  cookTime: string;
  difficulty: string;
  ingredients: Array<{ name: string; quantity: string }>;
  instructions: string[];
  tips?: string[];
}

export default function RecipeGeneratorPage() {
  const [loading, setLoading] = useState(false);
  const [ingredients, setIngredients] = useState("");
  const [maxTime, setMaxTime] = useState("30");
  const [difficulty, setDifficulty] = useState("medium");
  const [diet, setDiet] = useState("");
  const [generatedRecipe, setGeneratedRecipe] = useState<GeneratedRecipe | null>(null);
  const [error, setError] = useState("");
  const router = useRouter();
  const locale = useLocale();

  const generateRecipe = async () => {
    if (!ingredients.trim()) {
      setError("Por favor ingresa al menos un ingrediente");
      return;
    }

    setLoading(true);
    setError("");
    setGeneratedRecipe(null);

    try {
      const response = await fetch("/api/ai/recipes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ingredients: ingredients.split(",").map((i) => i.trim()),
          maxTime: parseInt(maxTime),
          difficulty,
          diet: diet || undefined,
        }),
      });

      if (!response.ok) {
        throw new Error("Error al generar receta");
      }

      const data = await response.json();
      setGeneratedRecipe(data.recipe);
    } catch (err) {
      setError("No se pudo generar la receta. Intenta de nuevo.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const saveRecipe = () => {
    if (!generatedRecipe) return;
    
    // Guardar en localStorage para pre-llenar el formulario
    localStorage.setItem("draft_recipe", JSON.stringify(generatedRecipe));
    router.push(`/${locale}/recipes/create`);
  };

  return (
    <>
      <Wallpaper
        imageLight="/branding/MIS RECETAS- DASHBOARD — Cocina cenital difusa, modo claro.png"
        imageDark="/branding/MIS RECETAS - DASHBOARD — Encimera oscura gourmet, modo oscuro.png"
      />
      <AppBackground variantOverride="recipes-neutral">
        <div className="min-h-screen py-8">
          <div className="container mx-auto px-4 max-w-6xl">
            {/* Header */}
            <GlassCard className="p-8 text-center mb-8">
              <div className="inline-block p-3 rounded-2xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 mb-4">
                <Sparkles className="w-12 h-12 text-purple-500" />
              </div>
              <h1 className="heading-display text-4xl md:text-5xl mb-4 bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                Generador IA de Recetas
              </h1>
              <p className="body-large text-lg glass-text-medium max-w-2xl mx-auto">
                Dime qué ingredientes tienes y te crearé una receta perfecta ✨
              </p>
            </GlassCard>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Form */}
              <GlassCard className="p-6 space-y-6">
                <div className="space-y-2">
                  <label className="label-strong">
                    Ingredientes disponibles *
                  </label>
                  <Textarea
                    placeholder="pollo, arroz, cebolla, tomate, pimientos..."
                    value={ingredients}
                    onChange={(e) => setIngredients(e.target.value)}
                    rows={4}
                    className="bg-white/50 dark:bg-neutral-900/50"
                  />
                  <p className="text-xs text-neutral-500">
                    Separa los ingredientes con comas
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="label-strong">Tiempo máximo</label>
                  <Select value={maxTime} onValueChange={setMaxTime}>
                    <SelectTrigger className="bg-white/50 dark:bg-neutral-900/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutos</SelectItem>
                      <SelectItem value="30">30 minutos</SelectItem>
                      <SelectItem value="45">45 minutos</SelectItem>
                      <SelectItem value="60">1 hora</SelectItem>
                      <SelectItem value="90">1.5 horas</SelectItem>
                      <SelectItem value="120">2 horas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="label-strong">Dificultad</label>
                  <Select value={difficulty} onValueChange={setDifficulty}>
                    <SelectTrigger className="bg-white/50 dark:bg-neutral-900/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">🌟 Fácil</SelectItem>
                      <SelectItem value="medium">⭐⭐ Media</SelectItem>
                      <SelectItem value="hard">⭐⭐⭐ Difícil</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="label-strong">Restricciones dietéticas (opcional)</label>
                  <Select value={diet} onValueChange={setDiet}>
                    <SelectTrigger className="bg-white/50 dark:bg-neutral-900/50">
                      <SelectValue placeholder="Ninguna" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Ninguna</SelectItem>
                      <SelectItem value="vegetarian">🥬 Vegetariana</SelectItem>
                      <SelectItem value="vegan">🌱 Vegana</SelectItem>
                      <SelectItem value="gluten-free">🌾 Sin Gluten</SelectItem>
                      <SelectItem value="dairy-free">🥛 Sin Lácteos</SelectItem>
                      <SelectItem value="keto">🥑 Keto</SelectItem>
                      <SelectItem value="paleo">🍖 Paleo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {error && (
                  <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-xl">
                    <p className="text-red-200 text-sm">{error}</p>
                  </div>
                )}

                <Button
                  onClick={generateRecipe}
                  disabled={loading || !ingredients.trim()}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white text-lg py-6"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Generando receta mágica...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      Generar Receta con IA
                    </>
                  )}
                </Button>
              </GlassCard>

              {/* Preview */}
              <div>
                {loading && (
                  <GlassCard className="p-8 text-center">
                    <Loader2 className="w-16 h-16 mx-auto mb-4 animate-spin text-purple-500" />
                    <p className="glass-text-medium">
                      Cocorico está creando tu receta perfecta...
                    </p>
                  </GlassCard>
                )}

                {!loading && !generatedRecipe && (
                  <GlassCard className="p-8 text-center">
                    <Sparkles className="w-16 h-16 mx-auto mb-4 text-neutral-400" />
                    <p className="glass-text-medium">
                      Completa el formulario y genera tu primera receta IA
                    </p>
                  </GlassCard>
                )}

                {generatedRecipe && (
                  <GlassCard className="p-6 space-y-6 animate-in slide-in-from-right duration-500">
                    <div className="flex items-start justify-between">
                      <div>
                        <h2 className="heading-2 text-2xl mb-2">
                          {generatedRecipe.title}
                        </h2>
                        <p className="body-small glass-text-medium">
                          {generatedRecipe.description}
                        </p>
                      </div>
                      <Badge className="bg-purple-500">IA</Badge>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <Clock className="w-5 h-5 mx-auto mb-1 text-purple-500" />
                        <div className="text-sm font-semibold">
                          {generatedRecipe.prepTime}
                        </div>
                        <div className="text-xs text-neutral-500">Prep</div>
                      </div>
                      <div className="text-center">
                        <ChefHat className="w-5 h-5 mx-auto mb-1 text-pink-500" />
                        <div className="text-sm font-semibold capitalize">
                          {generatedRecipe.difficulty}
                        </div>
                        <div className="text-xs text-neutral-500">Dificultad</div>
                      </div>
                      <div className="text-center">
                        <Users className="w-5 h-5 mx-auto mb-1 text-orange-500" />
                        <div className="text-sm font-semibold">
                          {generatedRecipe.servings}
                        </div>
                        <div className="text-xs text-neutral-500">Porciones</div>
                      </div>
                    </div>

                    <div>
                      <h3 className="label-strong mb-3">Ingredientes</h3>
                      <ul className="space-y-2">
                        {generatedRecipe.ingredients.map((ing, idx) => (
                          <li
                            key={idx}
                            className="flex items-center gap-2 text-sm"
                          >
                            <div className="w-2 h-2 rounded-full bg-purple-500" />
                            <span className="font-medium">{ing.quantity}</span>
                            <span className="glass-text-medium">{ing.name}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="label-strong mb-3">Instrucciones</h3>
                      <ol className="space-y-3">
                        {generatedRecipe.instructions.map((step, idx) => (
                          <li key={idx} className="flex gap-3">
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white text-xs flex items-center justify-center font-bold">
                              {idx + 1}
                            </span>
                            <p className="text-sm glass-text-medium flex-1">
                              {step}
                            </p>
                          </li>
                        ))}
                      </ol>
                    </div>

                    {generatedRecipe.tips && generatedRecipe.tips.length > 0 && (
                      <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
                        <h4 className="label-strong mb-2">💡 Tips de Cocorico</h4>
                        <ul className="space-y-1">
                          {generatedRecipe.tips.map((tip, idx) => (
                            <li key={idx} className="text-sm glass-text-medium">
                              • {tip}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <Button
                      onClick={saveRecipe}
                      className="w-full bg-green-600 hover:bg-green-700 text-white"
                    >
                      <Save className="w-5 h-5 mr-2" />
                      Guardar como Receta
                    </Button>
                  </GlassCard>
                )}
              </div>
            </div>
          </div>
        </div>
      </AppBackground>
    </>
  );
}
