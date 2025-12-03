"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Trophy, Flame, Star, Clock } from "lucide-react";
import Wallpaper from "@/components/layout/Wallpaper";

interface Challenge {
  id: number;
  title: string;
  description: string;
  difficulty: string;
  reward_xp: number;
  active_date: string;
}

// Retos demo con imágenes
const DEMO_CHALLENGES = [
  {
    id: 1,
    title: "Maestro del Desayuno 🍳",
    description: "Prepara un desayuno completo y nutritivo en menos de 15 minutos",
    difficulty: "easy",
    reward_xp: 50,
    active_date: new Date().toISOString(),
    image: "/branding/cocorico/cocorico-cooking.png",
    duration: "15 min"
  },
  {
    id: 2,
    title: "Técnica Perfecta de Corte 🔪",
    description: "Domina el corte Julienne y prepara una ensalada variada",
    difficulty: "medium",
    reward_xp: 100,
    active_date: new Date().toISOString(),
    image: "/branding/cocorico/cocorico-cutting.png",
    duration: "30 min"
  },
  {
    id: 3,
    title: "Pasta Casera desde Cero 🍝",
    description: "Crea tu propia pasta fresca sin usar máquina",
    difficulty: "hard",
    reward_xp: 200,
    active_date: new Date().toISOString(),
    image: "/branding/cocorico/chef.png",
    duration: "60 min"
  },
  {
    id: 4,
    title: "Smoothie Saludable 🥤",
    description: "Crea un smoothie con al menos 5 ingredientes naturales",
    difficulty: "easy",
    reward_xp: 50,
    active_date: new Date().toISOString(),
    image: "/branding/cocorico/happy.png",
    duration: "10 min"
  },
  {
    id: 5,
    title: "Pizza Artesanal 🍕",
    description: "Haz tu propia masa de pizza y hornéala a la perfección",
    difficulty: "medium",
    reward_xp: 150,
    active_date: new Date().toISOString(),
    image: "/branding/cocorico/cocorico-smiling.png",
    duration: "45 min"
  },
  {
    id: 6,
    title: "Sushi Roll Perfecto 🍣",
    description: "Prepara 4 tipos diferentes de sushi rolls con técnica impecable",
    difficulty: "hard",
    reward_xp: 250,
    active_date: new Date().toISOString(),
    image: "/branding/cocorico/thinking.png",
    duration: "90 min"
  },
  {
    id: 7,
    title: "Postre sin Horno 🍰",
    description: "Crea un postre delicioso sin necesidad de hornearlo",
    difficulty: "easy",
    reward_xp: 75,
    active_date: new Date().toISOString(),
    image: "/branding/cocorico/happy.png",
    duration: "20 min"
  },
  {
    id: 8,
    title: "Curry Tailandés Auténtico 🍛",
    description: "Prepara un curry tailandés con especias frescas y leche de coco",
    difficulty: "medium",
    reward_xp: 120,
    active_date: new Date().toISOString(),
    image: "/branding/cocorico/cocorico-cooking.png",
    duration: "40 min"
  },
  {
    id: 9,
    title: "Menú de 3 Platos 👨‍🍳",
    description: "Cocina entrada, plato principal y postre en una sola sesión",
    difficulty: "hard",
    reward_xp: 300,
    active_date: new Date().toISOString(),
    image: "/branding/cocorico/chef.png",
    duration: "120 min"
  },
  {
    id: 10,
    title: "Bowl Nutritivo 🥗",
    description: "Crea un bowl equilibrado con proteína, carbohidratos y vegetales",
    difficulty: "easy",
    reward_xp: 60,
    active_date: new Date().toISOString(),
    image: "/branding/cocorico/cocorico-smiling.png",
    duration: "15 min"
  }
];

export default function ChallengesPage() {
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);
  const [showDemo, setShowDemo] = useState(true);
  const router = useRouter();

  const plan = typeof document !== "undefined"
    ? (document.documentElement.dataset.theme as "free" | "premium")
    : "free";

  useEffect(() => {
    fetchChallenge();
  }, []);

  async function fetchChallenge() {
    try {
      const res = await fetch("/api/challenge/today");
      if (res.ok) {
        const data = await res.json();
        setChallenge(data);
        setShowDemo(!data);
      }
    } catch (err) {
      console.error("Error cargando reto:", err);
      setShowDemo(true);
    } finally {
      setLoading(false);
    }
  }

  async function completeChallenge() {
    if (!challenge) return;
    setCompleting(true);

    try {
      await fetch("/api/gamify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "challenge_completed" }),
      });

      alert(`¡Reto completado! +${challenge.reward_xp} XP 🎉`);
      router.push("/dashboard");
    } catch (err) {
      console.error("Error completando reto:", err);
      alert("Error al completar el reto");
    } finally {
      setCompleting(false);
    }
  }

  const getDifficultyColor = (diff: string) => {
    switch(diff) {
      case "easy": return "from-green-500 to-emerald-600";
      case "medium": return "from-orange-500 to-amber-600";
      case "hard": return "from-red-500 to-pink-600";
      default: return "from-blue-500 to-indigo-600";
    }
  };

  const getDifficultyLabel = (diff: string) => {
    switch(diff) {
      case "easy": return "Fácil";
      case "medium": return "Normal";
      case "hard": return "Difícil";
      default: return "Normal";
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-12 px-6 text-center">
        <div className={cn(
          "p-8 rounded-3xl inline-block",
          plan === "premium" && "glass-card-premium"
        )}>
          <p className={plan === "premium" ? "glass-text-premium" : "text-neutral-500 dark:text-neutral-400"}>
            Cargando retos...
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Wallpaper
        imageLight="/branding/MIS RECETAS- DASHBOARD — Cocina cenital difusa, modo claro.png"
        imageDark="/branding/MIS RECETAS - DASHBOARD — Encimera oscura gourmet, modo oscuro.png"
      />
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 dark:from-orange-950/30 dark:via-red-900/20 dark:to-pink-900/30 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className={cn(
            "text-center mb-12 p-8 rounded-3xl",
            plan === "premium" ? "glass-card-premium" : "bg-white/80 dark:bg-neutral-900/80 border border-orange-200 dark:border-orange-800"
          )}>
            <h1 className={cn(
              "heading-display mb-4",
            plan === "premium" ? "glass-text-premium" : "text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600"
          )}>
            Retos del Día 🔥
          </h1>
          <p className={cn(
            "text-lg",
            plan === "premium" ? "text-white/80" : "text-neutral-600 dark:text-neutral-400"
          )}>
            Completa desafíos y gana XP para subir de nivel
          </p>
        </div>

        {/* Toggle Demo/Real */}
        {challenge && showDemo && (
          <div className="text-center mb-8">
            <button
              onClick={() => setShowDemo(false)}
              className={cn(
                "px-6 py-3 rounded-xl font-semibold",
                plan === "premium" ? "glass-button-premium" : "bg-orange-500 text-white hover:bg-orange-600"
              )}
            >
              Ver reto del día
            </button>
          </div>
        )}

        {showDemo ? (
          /* Demo Challenges Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {DEMO_CHALLENGES.map((demo, idx) => (
              <div
                key={demo.id}
                className={cn(
                  "group overflow-hidden rounded-3xl transition-all hover:scale-105 cursor-pointer",
                  plan === "premium" ? "glass-card-premium" : "bg-white dark:bg-neutral-900 border border-orange-200 dark:border-orange-800 shadow-lg hover:shadow-2xl"
                )}
              >
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={demo.image}
                    alt={demo.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className={`absolute top-4 left-4 px-3 py-1 rounded-full bg-gradient-to-r ${getDifficultyColor(demo.difficulty)} text-white text-xs font-bold`}>
                    {getDifficultyLabel(demo.difficulty)}
                  </div>
                  <div className={cn(
                    "absolute top-4 right-4 px-3 py-1 rounded-full flex items-center gap-1",
                    plan === "premium" ? "glass-droplet" : "bg-white/90 text-neutral-900"
                  )}>
                    <Clock className="w-3 h-3" />
                    <span className="text-xs font-medium">{demo.duration}</span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className={cn(
                    "text-xl font-bold mb-3",
                    plan === "premium" ? "glass-text-premium" : "text-orange-900 dark:text-orange-300"
                  )}>
                    {demo.title}
                  </h3>
                  <p className={cn(
                    "text-sm mb-4",
                    plan === "premium" ? "text-white/70" : "text-neutral-600 dark:text-neutral-400"
                  )}>
                    {demo.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Star className="w-5 h-5 text-yellow-500" />
                      <span className={cn(
                        "font-bold text-lg",
                        plan === "premium" ? "glass-text-premium" : "text-orange-600 dark:text-orange-400"
                      )}>
                        +{demo.reward_xp} XP
                      </span>
                    </div>
                    <button className={cn(
                      "px-4 py-2 rounded-xl font-semibold text-sm transition-all",
                      plan === "premium" ? "glass-button-premium" : "bg-gradient-to-r from-orange-500 to-red-600 text-white hover:opacity-90"
                    )}>
                      Comenzar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : challenge ? (
          /* Single Challenge Detail */
          <div className={cn(
            "max-w-3xl mx-auto rounded-3xl overflow-hidden",
            plan === "premium" ? "glass-card-premium" : "bg-white dark:bg-neutral-900 border border-orange-200 dark:border-orange-800 shadow-2xl"
          )}>
            <div className="relative h-64">
              <Image
                src="/branding/cocorico/chef.png"
                alt={challenge.title}
                fill
                className="object-cover"
              />
              <div className={`absolute top-6 left-6 px-4 py-2 rounded-full bg-gradient-to-r ${getDifficultyColor(challenge.difficulty)} text-white font-bold`}>
                {getDifficultyLabel(challenge.difficulty)}
              </div>
            </div>

            <div className="p-8">
              <div className="flex items-center gap-2 mb-4 text-sm">
                <Flame className="w-5 h-5 text-orange-500" />
                <span className={plan === "premium" ? "text-white/80" : "text-neutral-600 dark:text-neutral-400"}>
                  {new Date(challenge.active_date).toLocaleDateString("es-ES", { 
                    weekday: "long", 
                    day: "numeric", 
                    month: "long" 
                  })}
                </span>
              </div>

              <h2 className={cn(
                "text-3xl font-bold mb-4",
                plan === "premium" ? "glass-text-premium" : "text-orange-900 dark:text-orange-300"
              )}>
                {challenge.title}
              </h2>

              <p className={cn(
                "text-lg mb-8",
                plan === "premium" ? "text-white/80" : "text-neutral-700 dark:text-neutral-300"
              )}>
                {challenge.description}
              </p>

              <div className="flex items-center gap-3 mb-8">
                <Trophy className="w-6 h-6 text-yellow-500" />
                <span className={cn(
                  "text-2xl font-bold",
                  plan === "premium" ? "glass-text-premium" : "text-orange-600 dark:text-orange-400"
                )}>
                  +{challenge.reward_xp} XP
                </span>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={completeChallenge}
                  disabled={completing}
                  className={cn(
                    "flex-1 px-8 py-4 rounded-xl font-bold text-lg transition-all",
                    plan === "premium" ? "glass-button-premium" : "bg-gradient-to-r from-orange-500 to-red-600 text-white hover:opacity-90 shadow-lg",
                    completing && "opacity-50 cursor-not-allowed"
                  )}
                >
                  {completing ? "Completando..." : "¡He completado este reto! 🎉"}
                </button>
                <a
                  href="/dashboard"
                  className={cn(
                    "px-8 py-4 rounded-xl font-medium transition-all",
                    plan === "premium" ? "glass-droplet" : "border-2 border-neutral-300 dark:border-neutral-600 hover:bg-neutral-50 dark:hover:bg-neutral-800"
                  )}
                >
                  Volver
                </a>
              </div>
            </div>
          </div>
        ) : (
          <div className={cn(
            "max-w-2xl mx-auto text-center p-12 rounded-3xl",
            plan === "premium" ? "glass-card-premium" : "bg-white/80 dark:bg-neutral-900/80"
          )}>
            <p className={cn(
              "text-lg",
              plan === "premium" ? "glass-text-premium" : "text-neutral-500 dark:text-neutral-400"
            )}>
              No hay reto disponible hoy. ¡Vuelve mañana!
            </p>
          </div>
        )}

        {/* Footer Info */}
        <div className={cn(
          "mt-12 text-center p-6 rounded-2xl",
          plan === "premium" ? "glass-droplet" : "bg-orange-50 dark:bg-orange-900/20"
        )}>
          <p className={cn(
            "text-sm flex items-center justify-center gap-2",
            plan === "premium" ? "text-white/80" : "text-orange-800 dark:text-orange-300"
          )}>
            <Flame className="w-5 h-5" />
            Completa retos diarios para ganar XP extra y subir de nivel más rápido
          </p>
        </div>
      </div>
    </div>
    </>
  );
}
