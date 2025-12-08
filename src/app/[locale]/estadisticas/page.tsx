import { getTranslations } from 'next-intl/server';
import {
  LiquidGlassContainer,
  LiquidGlassCard,
  LiquidGlassButton,
  LiquidGlassBadge,
} from '@/components/ui/LiquidGlass';
import { BarChart3, TrendingUp, Target, Award, Calendar, Flame } from 'lucide-react';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'stats' });

  return {
    title: t('title') || 'Estadísticas',
    description: t('description') || 'Visualiza tu progreso y estadísticas de cocina',
  };
}

interface StatData {
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: any;
  color: string;
}

const statsData: StatData[] = [
  {
    label: 'Recetas Cocinadas',
    value: '127',
    change: '+12 esta semana',
    trend: 'up',
    icon: Flame,
    color: 'text-orange-400',
  },
  {
    label: 'Racha Actual',
    value: '23 días',
    change: '¡Récord personal!',
    trend: 'up',
    icon: Award,
    color: 'text-yellow-400',
  },
  {
    label: 'Tiempo en Cocina',
    value: '48h',
    change: '+5h vs mes anterior',
    trend: 'up',
    icon: Calendar,
    color: 'text-blue-400',
  },
  {
    label: 'Nivel de Chef',
    value: 'Avanzado',
    change: '85% al siguiente',
    trend: 'up',
    icon: Target,
    color: 'text-purple-400',
  },
];

export default async function EstadisticasPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  return (
    <LiquidGlassContainer fullscreen>
      {/* GIF Background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          src="/branding/estadisticas - video.gif"
          alt="Stats background"
          className="w-full h-full object-cover opacity-20"
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <BarChart3 className="w-12 h-12 text-purple-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Estadísticas
            </h1>
          </div>
          <p className="text-gray-300">
            Visualiza tu progreso y mejora como chef día a día
          </p>
        </div>

        {/* Main Stats Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {statsData.map((stat) => {
            const Icon = stat.icon;
            return (
              <LiquidGlassCard key={stat.label} variant="ios" blur="xl">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Icon className={`w-6 h-6 ${stat.color}`} />
                      <span className="text-gray-400 text-sm">{stat.label}</span>
                    </div>
                    <div className="text-4xl font-bold text-white mb-2">{stat.value}</div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-green-400" />
                      <span className="text-sm text-green-400">{stat.change}</span>
                    </div>
                  </div>
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${
                    stat.color.includes('orange')
                      ? 'from-orange-500/20 to-orange-600/20'
                      : stat.color.includes('yellow')
                      ? 'from-yellow-500/20 to-yellow-600/20'
                      : stat.color.includes('blue')
                      ? 'from-blue-500/20 to-blue-600/20'
                      : 'from-purple-500/20 to-purple-600/20'
                  }`}>
                    <Icon className={`w-8 h-8 ${stat.color}`} />
                  </div>
                </div>
              </LiquidGlassCard>
            );
          })}
        </div>

        {/* Weekly Activity Chart */}
        <LiquidGlassCard variant="ios" blur="2xl" className="mb-6">
          <h2 className="text-xl font-semibold mb-6">Actividad Semanal</h2>
          <div className="flex items-end justify-between gap-2 h-48">
            {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((day, idx) => {
              const heights = [60, 40, 80, 50, 90, 70, 45];
              return (
                <div key={day} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full bg-gray-700/50 rounded-t-lg hover:bg-gradient-to-t hover:from-purple-500 hover:to-pink-500 transition-all cursor-pointer"
                    style={{ height: `${heights[idx]}%` }}
                  ></div>
                  <span className="text-xs text-gray-400">{day}</span>
                </div>
              );
            })}
          </div>
        </LiquidGlassCard>

        {/* Categories Progress */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <LiquidGlassCard variant="subtle" blur="lg">
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-1">42</div>
              <div className="text-sm text-gray-400 mb-2">Recetas Italianas</div>
              <div className="w-full bg-gray-700/50 rounded-full h-2">
                <div className="h-full bg-gradient-to-r from-red-500 to-green-500 rounded-full" style={{ width: '75%' }}></div>
              </div>
            </div>
          </LiquidGlassCard>

          <LiquidGlassCard variant="subtle" blur="lg">
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-1">38</div>
              <div className="text-sm text-gray-400 mb-2">Recetas Asiáticas</div>
              <div className="w-full bg-gray-700/50 rounded-full h-2">
                <div className="h-full bg-gradient-to-r from-yellow-500 to-red-500 rounded-full" style={{ width: '68%' }}></div>
              </div>
            </div>
          </LiquidGlassCard>

          <LiquidGlassCard variant="subtle" blur="lg">
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-1">31</div>
              <div className="text-sm text-gray-400 mb-2">Recetas Mexicanas</div>
              <div className="w-full bg-gray-700/50 rounded-full h-2">
                <div className="h-full bg-gradient-to-r from-green-500 to-red-500 rounded-full" style={{ width: '55%' }}></div>
              </div>
            </div>
          </LiquidGlassCard>
        </div>

        {/* Achievements */}
        <LiquidGlassCard variant="frosted" blur="xl">
          <h2 className="text-xl font-semibold mb-6">Logros Recientes</h2>
          <div className="grid md:grid-cols-4 gap-4">
            {[
              { icon: '🏆', name: 'Chef Maestro', desc: 'Cocina 100 recetas' },
              { icon: '⭐', name: 'Racha 20', desc: '20 días consecutivos' },
              { icon: '🔥', name: 'Experimentador', desc: 'Prueba 5 cocinas' },
              { icon: '💎', name: 'Premium', desc: 'Miembro Premium' },
            ].map((achievement, idx) => (
              <div key={idx} className="text-center p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all cursor-pointer">
                <div className="text-4xl mb-2">{achievement.icon}</div>
                <div className="font-semibold text-white text-sm mb-1">{achievement.name}</div>
                <div className="text-xs text-gray-400">{achievement.desc}</div>
              </div>
            ))}
          </div>
        </LiquidGlassCard>

        {/* Actions */}
        <div className="mt-8 flex gap-4 justify-center">
          <LiquidGlassButton variant="default" size="lg">
            Compartir Progreso
          </LiquidGlassButton>
          <LiquidGlassButton variant="primary" size="lg">
            Ver Historial Completo
          </LiquidGlassButton>
        </div>
      </div>
    </LiquidGlassContainer>
  );
}
