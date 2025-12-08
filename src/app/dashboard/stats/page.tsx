

import { AppBackground } from "@/components/layout/AppBackground";
import Wallpaper from "@/components/layout/Wallpaper";
import GlassCard from "@/components/ui/GlassCard";
import { BarChart2, TrendingUp, Users, BookOpen, Clock, Zap, Award, Heart } from "lucide-react";

export default function StatsPage() {
  // TODO: Integrar lógica real de estadísticas
  const users = 2847;
  const publicRecipes = 8654;
  const privateRecipes = 12340;
  const activeUsers = 1892;
  const avgSessionTime = "8m 32s";
  const totalScans = 45620;
  const challengesCompleted = 3420;
  const recipesShared = 5230;
  
  return (
    <>
      <Wallpaper
        imageLight="/branding/MIS RECETAS- DASHBOARD — Cocina cenital difusa, modo claro.png"
        imageDark="/branding/MIS RECETAS - DASHBOARD — Encimera oscura gourmet, modo oscuro.png"
      />
      {/* Video Background */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <img
          src="/branding/estadisticas - video.gif"
          alt="Stats background"
          className="w-full h-full object-cover opacity-15"
        />
      </div>
      <AppBackground variantOverride="stats">
        <main className="max-w-6xl mx-auto p-6 space-y-8">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="flex justify-center mb-4">
              <BarChart2 className="w-16 h-16 text-cocorico-mango" />
            </div>
            <h1 className="heading-display glass-text-strong">📊 Estadísticas de Cocorico</h1>
            <p className="glass-text-medium max-w-2xl mx-auto">
              Analiza el rendimiento y crecimiento de la plataforma en tiempo real
            </p>
          </div>

          {/* Main Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <GlassCard className="p-6 text-center hover:scale-105 transition-transform">
              <Users className="w-8 h-8 mx-auto mb-3 text-blue-500" />
              <h3 className="text-3xl font-bold text-cocorico-brown dark:text-amber-100 mb-1">{users.toLocaleString()}</h3>
              <p className="text-sm glass-text-medium">Usuarios Totales</p>
              <div className="flex items-center justify-center gap-1 mt-2 text-xs text-green-600 dark:text-green-400">
                <TrendingUp className="w-3 h-3" />
                +12% este mes
              </div>
            </GlassCard>
            
            <GlassCard className="p-6 text-center hover:scale-105 transition-transform">
              <BookOpen className="w-8 h-8 mx-auto mb-3 text-green-500" />
              <h3 className="text-3xl font-bold text-cocorico-brown dark:text-amber-100 mb-1">{publicRecipes.toLocaleString()}</h3>
              <p className="text-sm glass-text-medium">Recetas Públicas</p>
              <div className="flex items-center justify-center gap-1 mt-2 text-xs text-green-600 dark:text-green-400">
                <TrendingUp className="w-3 h-3" />
                +8% este mes
              </div>
            </GlassCard>
            
            <GlassCard className="p-6 text-center hover:scale-105 transition-transform">
              <Users className="w-8 h-8 mx-auto mb-3 text-amber-500" />
              <h3 className="text-3xl font-bold text-cocorico-brown dark:text-amber-100 mb-1">{activeUsers.toLocaleString()}</h3>
              <p className="text-sm glass-text-medium">Usuarios Activos</p>
              <p className="text-xs glass-text-soft mt-2">Últimos 7 días</p>
            </GlassCard>
            
            <GlassCard className="p-6 text-center hover:scale-105 transition-transform">
              <Clock className="w-8 h-8 mx-auto mb-3 text-purple-500" />
              <h3 className="text-3xl font-bold text-cocorico-brown dark:text-amber-100 mb-1">{avgSessionTime}</h3>
              <p className="text-sm glass-text-medium">Sesión Promedio</p>
              <div className="flex items-center justify-center gap-1 mt-2 text-xs text-green-600 dark:text-green-400">
                <TrendingUp className="w-3 h-3" />
                +5% este mes
              </div>
            </GlassCard>
          </div>

          {/* Secondary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <GlassCard className="p-6">
              <h3 className="text-xl font-bold glass-text-strong mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-cocorico-mango" />
                Actividad de Usuarios
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="glass-text-medium">Total de Escaneos</span>
                  <span className="font-bold text-cocorico-brown dark:text-amber-100">{totalScans.toLocaleString()}</span>
                </div>
                <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
                  <div className="bg-gradient-to-r from-cocorico-mango to-cocorico-datil h-2 rounded-full" style={{ width: "85%" }}></div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="glass-text-medium">Retos Completados</span>
                  <span className="font-bold text-cocorico-brown dark:text-amber-100">{challengesCompleted.toLocaleString()}</span>
                </div>
                <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
                  <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full" style={{ width: "65%" }}></div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="glass-text-medium">Recetas Compartidas</span>
                  <span className="font-bold text-cocorico-brown dark:text-amber-100">{recipesShared.toLocaleString()}</span>
                </div>
                <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full" style={{ width: "75%" }}></div>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="p-6">
              <h3 className="text-xl font-bold glass-text-strong mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" />
                Top Categorías de Recetas
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">🍝</div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="glass-text-medium font-semibold">Pasta & Italiana</span>
                      <span className="text-sm glass-text-soft">2,340</span>
                    </div>
                    <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
                      <div className="bg-cocorico-red h-2 rounded-full" style={{ width: "90%" }}></div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="text-2xl">🥗</div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="glass-text-medium font-semibold">Ensaladas & Healthy</span>
                      <span className="text-sm glass-text-soft">1,890</span>
                    </div>
                    <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
                      <div className="bg-cocorico-avocado h-2 rounded-full" style={{ width: "75%" }}></div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="text-2xl">🍰</div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="glass-text-medium font-semibold">Postres & Dulces</span>
                      <span className="text-sm glass-text-soft">1,650</span>
                    </div>
                    <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
                      <div className="bg-cocorico-mango h-2 rounded-full" style={{ width: "65%" }}></div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="text-2xl">🌮</div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="glass-text-medium font-semibold">Mexicana & Tacos</span>
                      <span className="text-sm glass-text-soft">1,420</span>
                    </div>
                    <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
                      <div className="bg-cocorico-datil h-2 rounded-full" style={{ width: "55%" }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </GlassCard>
          </div>

          {/* Private Stats */}
          <GlassCard className="p-6 bg-gradient-to-br from-neutral-100 to-neutral-50 dark:from-neutral-800/40 dark:to-neutral-900/40">
            <div className="flex items-start gap-4">
              <Heart className="w-8 h-8 text-pink-500 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="text-xl font-bold glass-text-strong mb-2">Recetas Privadas</h3>
                <p className="glass-text-medium mb-4">
                  Los usuarios mantienen {privateRecipes.toLocaleString()} recetas privadas en sus colecciones personales
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-2xl font-bold text-cocorico-brown dark:text-amber-100">{privateRecipes.toLocaleString()}</p>
                    <p className="text-sm glass-text-soft">Total privadas</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-cocorico-brown dark:text-amber-100">{(privateRecipes / users).toFixed(1)}</p>
                    <p className="text-sm glass-text-soft">Promedio por usuario</p>
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>
        </main>
      </AppBackground>
    </>
  );
}
