import GlassCard from "@/components/ui/GlassCard";
import Wallpaper from "@/components/layout/Wallpaper";
import { Trophy, Target, Clock, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function ChallengesPage({ params }: { params: { locale: string } }) {
  // TODO: Replace with actual DB fetch
  const challenges = [
    { 
      id: 1, 
      title: "Maestro del Scanner", 
      description: "Escanea 10 productos diferentes y conviértete en experto nutricional",
      type: "scanner",
      icon: "🔍",
      progress: 6,
      total: 10,
      reward: "100 XP + Badge Escáner",
      timeLeft: "3 días",
      difficulty: "Fácil"
    },
    { 
      id: 2, 
      title: "Chef Innovador", 
      description: "Crea y comparte 3 recetas originales con la comunidad",
      type: "cooking",
      icon: "👨‍🍳",
      progress: 1,
      total: 3,
      reward: "250 XP + Badge Chef",
      timeLeft: "5 días",
      difficulty: "Media"
    },
    { 
      id: 3, 
      title: "Semana Saludable", 
      description: "Completa 5 comidas saludables esta semana según Cocorico Score",
      type: "health",
      icon: "💪",
      progress: 3,
      total: 5,
      reward: "150 XP",
      timeLeft: "2 días",
      difficulty: "Media"
    },
    { 
      id: 4, 
      title: "Comunidad Activa", 
      description: "Da 'me gusta' y comenta en 20 recetas de otros usuarios",
      type: "social",
      icon: "❤️",
      progress: 12,
      total: 20,
      reward: "75 XP",
      timeLeft: "1 semana",
      difficulty: "Fácil"
    },
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Fácil": return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
      case "Media": return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
      case "Difícil": return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
      default: return "bg-neutral-100 text-neutral-700";
    }
  };

  return (
    <>
      <Wallpaper
        imageLight="/branding/SEARCH - BÚSQUEDA — Especias y hierbas, modo claro.png"
        imageDark="/branding/SEARCH - BÚSQUEDA — Especias en mesa, modo oscuro.png"
      />
      <div className="max-w-5xl mx-auto p-4 space-y-6">
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-cocorico-brown dark:text-amber-100 mb-2 flex items-center gap-3">
            <Trophy className="w-8 h-8 text-cocorico-yellow" />
            Retos Activos
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            Completa desafíos para ganar XP, badges y desbloquear recompensas
          </p>
        </header>

        <div className="grid md:grid-cols-2 gap-6">
          {challenges.map(challenge => {
            const progressPercent = (challenge.progress / challenge.total) * 100;
            const isCompleted = challenge.progress >= challenge.total;

            return (
              <GlassCard key={challenge.id} className="p-6 hover:scale-[1.02] transition-transform relative overflow-hidden">
                {isCompleted && (
                  <div className="absolute top-4 right-4">
                    <CheckCircle2 className="w-6 h-6 text-green-500" />
                  </div>
                )}

                <div className="flex items-start gap-4 mb-4">
                  <div className="text-4xl">{challenge.icon}</div>
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-cocorico-brown dark:text-amber-100 mb-1">
                      {challenge.title}
                    </h2>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">
                      {challenge.description}
                    </p>
                    
                    <div className="flex items-center gap-2 mb-4">
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${getDifficultyColor(challenge.difficulty)}`}>
                        {challenge.difficulty}
                      </span>
                      <span className="text-xs text-neutral-500 dark:text-neutral-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {challenge.timeLeft}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-neutral-600 dark:text-neutral-400">Progreso</span>
                    <span className="font-semibold text-cocorico-brown dark:text-amber-100">
                      {challenge.progress} / {challenge.total}
                    </span>
                  </div>
                  <div className="h-3 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-cocorico-yellow to-cocorico-orange transition-all duration-500"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* Reward */}
                <div className="flex items-center justify-between pt-4 border-t border-neutral-200 dark:border-neutral-700">
                  <div className="text-sm">
                    <p className="text-neutral-500 dark:text-neutral-400 mb-1">Recompensa</p>
                    <p className="font-semibold text-cocorico-brown dark:text-amber-100">{challenge.reward}</p>
                  </div>
                  {!isCompleted && (
                    <Button size="sm" className="bg-cocorico-red hover:bg-red-700">
                      <Target className="w-4 h-4 mr-1" />
                      Continuar
                    </Button>
                  )}
                  {isCompleted && (
                    <Button size="sm" variant="outline" className="border-green-500 text-green-600">
                      ¡Completado!
                    </Button>
                  )}
                </div>
              </GlassCard>
            );
          })}
        </div>

        {challenges.length === 0 && (
          <GlassCard className="p-12 text-center">
            <Trophy className="w-16 h-16 mx-auto mb-4 text-neutral-400" />
            <p className="text-neutral-500 dark:text-neutral-400">
              No hay retos activos actualmente.
            </p>
          </GlassCard>
        )}
      </div>
    </>
  );
}
