"use client";

import GlassCard from "@/components/ui/GlassCard";
import { PlayCircle, Clock } from "lucide-react";
import Link from "next/link";

export default function ContinueLearningWidget() {
  // Mock data - in real app this would come from DB
  const recentLesson = {
    id: "knife-skills-101",
    title: "Técnicas de Corte: Básico",
    progress: 65,
    totalDuration: "15 min",
    timeLeft: "5 min",
    image: "/branding/LEARN - APRENDER — Fondo libro de cocina, modo claro.png" // Using existing asset as placeholder
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-cocorico-brown dark:text-amber-100">
        Continuar aprendiendo
      </h2>
      <GlassCard className="p-0 overflow-hidden group hover:scale-[1.01] transition-transform">
        <div className="flex flex-col sm:flex-row">
          <div className="sm:w-1/3 h-32 sm:h-auto relative bg-neutral-200">
            {/* Placeholder image background */}
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url('${recentLesson.image}')` }}
            />
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center group-hover:bg-black/30 transition-colors">
              <PlayCircle className="w-12 h-12 text-white opacity-90" />
            </div>
          </div>
          <div className="p-4 sm:p-6 flex-1 flex flex-col justify-center">
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-lg font-bold text-cocorico-brown dark:text-amber-100">
                {recentLesson.title}
              </h3>
              <span className="text-xs font-medium px-2 py-1 bg-cocorico-yellow/20 text-cocorico-brown rounded-full">
                En progreso
              </span>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm text-neutral-600 dark:text-neutral-400">
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {recentLesson.timeLeft} restantes
                </span>
                <span>{recentLesson.progress}%</span>
              </div>
              <div className="h-2 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-cocorico-yellow transition-all duration-500"
                  style={{ width: `${recentLesson.progress}%` }}
                />
              </div>
            </div>

            <div className="mt-4">
              <Link 
                href="/learn" 
                className="text-sm font-semibold text-cocorico-red hover:underline"
              >
                Reanudar lección →
              </Link>
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
