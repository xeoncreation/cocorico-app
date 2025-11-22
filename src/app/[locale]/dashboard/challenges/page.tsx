import { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { AppBackground } from "@/components/layout/AppBackground";
import GlassCard from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { Trophy, Target, Calendar, Users, Zap } from "lucide-react";

export const metadata: Metadata = {
  title: "Retos Culinarios | Cocorico",
  description: "Desafíate a cocinar mejor cada día con retos personalizados y logros desbloqueables.",
};

export default async function ChallengesPage({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale }).catch(() => (key: string) => key);

  // Retos de ejemplo
  const challenges = [
    {
      id: 1,
      title: "Maestro del Desayuno",
      description: "Prepara 5 desayunos saludables diferentes",
      progress: 3,
      total: 5,
      xp: 150,
      icon: "🌅",
      difficulty: "Fácil",
      timeLeft: "5 días restantes"
    },
    {
      id: 2,
      title: "Chef Vegetariano",
      description: "Cocina 10 recetas vegetarianas completas",
      progress: 7,
      total: 10,
      xp: 300,
      icon: "🥗",
      difficulty: "Medio",
      timeLeft: "12 días restantes"
    },
    {
      id: 3,
      title: "Experto en Batch Cooking",
      description: "Prepara comidas para toda la semana en un día",
      progress: 0,
      total: 1,
      xp: 500,
      icon: "📦",
      difficulty: "Difícil",
      timeLeft: "No iniciado"
    }
  ];

  return (
    <AppBackground variantOverride="dashboard">
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <Trophy className="w-16 h-16 text-amber-500" />
          </div>
          <h1 className="text-4xl font-bold text-cocorico-brown dark:text-amber-100">
            Retos Culinarios
          </h1>
          <p className="text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto">
            Mejora tus habilidades culinarias completando retos diarios y semanales. Gana XP, desbloquea logros y conviértete en un chef maestro.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <GlassCard className="p-4 text-center">
            <Target className="w-8 h-8 mx-auto mb-2 text-blue-500" />
            <div className="text-2xl font-bold text-cocorico-brown dark:text-neutral-100">12</div>
            <div className="text-sm text-neutral-600 dark:text-neutral-400">Retos activos</div>
          </GlassCard>
          <GlassCard className="p-4 text-center">
            <Trophy className="w-8 h-8 mx-auto mb-2 text-amber-500" />
            <div className="text-2xl font-bold text-cocorico-brown dark:text-neutral-100">8</div>
            <div className="text-sm text-neutral-600 dark:text-neutral-400">Completados</div>
          </GlassCard>
          <GlassCard className="p-4 text-center">
            <Zap className="w-8 h-8 mx-auto mb-2 text-orange-500" />
            <div className="text-2xl font-bold text-cocorico-brown dark:text-neutral-100">2,450</div>
            <div className="text-sm text-neutral-600 dark:text-neutral-400">XP ganados</div>
          </GlassCard>
          <GlassCard className="p-4 text-center">
            <Users className="w-8 h-8 mx-auto mb-2 text-green-500" />
            <div className="text-2xl font-bold text-cocorico-brown dark:text-neutral-100">Top 15%</div>
            <div className="text-sm text-neutral-600 dark:text-neutral-400">Ranking global</div>
          </GlassCard>
        </div>

        {/* Retos Activos */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-cocorico-brown dark:text-amber-100 flex items-center gap-2">
            <Calendar className="w-6 h-6" />
            Retos Activos
          </h2>
          
          <div className="grid gap-4">
            {challenges.map((challenge) => (
              <GlassCard key={challenge.id} className="p-6 hover:scale-[1.02] transition-transform cursor-pointer">
                <div className="flex items-start gap-4">
                  <div className="text-5xl">{challenge.icon}</div>
                  <div className="flex-1 space-y-3">
                    <div>
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-xl font-bold text-cocorico-brown dark:text-neutral-100">
                            {challenge.title}
                          </h3>
                          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                            {challenge.description}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          challenge.difficulty === "Fácil" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" :
                          challenge.difficulty === "Medio" ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" :
                          "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                        }`}>
                          {challenge.difficulty}
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-neutral-600 dark:text-neutral-400">
                          Progreso: {challenge.progress}/{challenge.total}
                        </span>
                        <span className="font-semibold text-amber-600 dark:text-amber-400">
                          +{challenge.xp} XP
                        </span>
                      </div>
                      <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-amber-500 to-orange-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${(challenge.progress / challenge.total) * 100}%` }}
                        />
                      </div>
                      <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
                        <Calendar className="w-3 h-3" />
                        {challenge.timeLeft}
                      </div>
                    </div>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>

        {/* CTA */}
        <GlassCard className="p-8 text-center bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20">
          <h3 className="text-2xl font-bold text-cocorico-brown dark:text-amber-100 mb-4">
            ¿Listo para más desafíos?
          </h3>
          <p className="text-neutral-600 dark:text-neutral-300 mb-6 max-w-md mx-auto">
            Desbloquea retos premium y accede a categorías exclusivas con Cocorico Premium
          </p>
          <Button asChild size="lg" className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white">
            <Link href={`/${locale}/pricing`}>
              ⭐ Ver Planes Premium
            </Link>
          </Button>
        </GlassCard>
      </div>
    </AppBackground>
  );
}
