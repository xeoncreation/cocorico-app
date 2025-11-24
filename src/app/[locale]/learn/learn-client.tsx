"use client";

import { useState } from "react";
import useSWR from "swr";
import { useTranslations } from "next-intl";
import Link from "next/link";
import GlassCard from "@/components/ui/GlassCard";
import { BookOpen, Clock, TrendingUp, Award } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Module {
  id: string;
  title: string;
  description: string;
  slug: string;
  duration_minutes: number;
  difficulty: "beginner" | "intermediate" | "advanced";
  category: string;
  cover_image_url: string | null;
  is_completed: boolean;
}

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function LearnClient({ locale }: { locale: string }) {
  const t = useTranslations("Learn");
  const { data, error, isLoading } = useSWR<{ modules: Module[] }>(
    "/api/learn/modules",
    fetcher
  );

  const modules = data?.modules || [];
  // If there are no modules from the API, show a small demo set so the page isn't empty
  const demoModules: Module[] = [
    {
      id: "demo-1",
      title: "Introducción a la cocina saludable",
      description: "Principios básicos para cocinar con menos desperdicio.",
      slug: "intro-cocina-saludable",
      duration_minutes: 15,
      difficulty: "beginner",
      category: "Fundamentos",
      cover_image_url: "/branding/banner-home.png",
      is_completed: false,
    },
    {
      id: "demo-2",
      title: "Técnicas de cocción rápidas",
      description: "Métodos rápidos y sencillos para ahorrar tiempo.",
      slug: "tecnicas-rapidas",
      duration_minutes: 12,
      difficulty: "beginner",
      category: "Técnicas",
      cover_image_url: "/branding/cocorico-cooking.png",
      is_completed: false,
    },
  ];

  const finalModules = modules.length > 0 ? modules : demoModules;

  // Group by category
  const categories = Array.from(new Set(finalModules.map((m) => m.category)));

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header with stats */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-cocorico-avocado to-cocorico-turquoise text-white text-4xl shadow-2xl mb-4">
          <BookOpen className="w-10 h-10" />
        </div>
        <h1 className="text-4xl lg:text-5xl font-bold text-cocorico-brown dark:text-amber-100">
          {t("title") || "Centro de Aprendizaje"} 🎓
        </h1>
        <p className="text-lg text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto">
          Mejora tus habilidades culinarias con lecciones interactivas y desbloquea logros
        </p>

        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto mt-6">
          <GlassCard className="p-4 text-center hover:scale-105 transition-transform">
            <Clock className="w-6 h-6 mx-auto mb-2 text-cocorico-mango" />
            <p className="text-2xl font-bold text-cocorico-brown dark:text-amber-100">
              {finalModules.length}
            </p>
            <p className="text-xs text-neutral-600 dark:text-neutral-400">Lecciones</p>
          </GlassCard>
          <GlassCard className="p-4 text-center hover:scale-105 transition-transform">
            <TrendingUp className="w-6 h-6 mx-auto mb-2 text-cocorico-avocado" />
            <p className="text-2xl font-bold text-cocorico-brown dark:text-amber-100">
              {finalModules.filter(m => m.is_completed).length}
            </p>
            <p className="text-xs text-neutral-600 dark:text-neutral-400">Completadas</p>
          </GlassCard>
          <GlassCard className="p-4 text-center hover:scale-105 transition-transform">
            <Award className="w-6 h-6 mx-auto mb-2 text-cocorico-datil" />
            <p className="text-2xl font-bold text-cocorico-brown dark:text-amber-100">
              {Math.round((finalModules.filter(m => m.is_completed).length / finalModules.length) * 100)}%
            </p>
            <p className="text-xs text-neutral-600 dark:text-neutral-400">Progreso</p>
          </GlassCard>
        </div>
      </div>

      <h1 className="text-3xl font-bold mb-6">{t("title") || "Learn"}</h1>

      {isLoading && <p className="text-muted-foreground">{t("loading") || "Loading modules..."}</p>}
      {error && <p className="text-destructive">{t("error") || "Failed to load modules."}</p>}

      <div className="space-y-8">
        {categories.map((category) => {
          const categoryModules = finalModules.filter((m) => m.category === category);
          return (
            <div key={category}>
              <h2 className="text-2xl font-semibold mb-4">{category}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categoryModules.map((module) => {
                  const progressValue = module.is_completed ? 100 : 0;
                  return (
                    <Link key={module.id} href={`/${locale}/learn/${module.slug}`}>
                      <GlassCard className="p-4 hover:scale-[1.02] transition" variant="base">
                      {module.cover_image_url && (
                        <img
                          src={module.cover_image_url}
                          alt={module.title}
                          className="w-full h-40 object-cover rounded-lg mb-3"
                        />
                      )}
                      <h3 className="font-semibold text-lg mb-1">{module.title}</h3>
                      <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                        {module.description}
                      </p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                        <span>{module.duration_minutes} min</span>
                        <span className="capitalize">{module.difficulty}</span>
                      </div>
                      {/* Simple progress bar */}
                      <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                        <div
                          className={`bg-primary h-2 rounded-full transition-all ${
                            progressValue === 100 ? "w-full" : "w-0"
                          }`}
                        />
                      </div>
                      {module.is_completed && (
                        <p className="text-xs text-primary mt-1">{t("completed") || "✓ Completed"}</p>
                      )}
                      </GlassCard>
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {!isLoading && modules.length === 0 && (
        <p className="text-muted-foreground text-center py-8">
          {t("no_modules") || "No learning modules available yet."}
        </p>
      )}
    </div>
  );
}
