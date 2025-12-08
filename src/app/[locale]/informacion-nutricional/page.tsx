import { getTranslations } from 'next-intl/server';
import {
  LiquidGlassContainer,
  LiquidGlassCard,
  LiquidGlassButton,
  LiquidGlassBadge,
} from '@/components/ui/LiquidGlass';
import { Activity, Flame, Droplet, Pizza, TrendingUp, Target } from 'lucide-react';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'nutrition' });

  return {
    title: t('title') || 'Información Nutricional',
    description: t('description') || 'Analiza el contenido nutricional de tus recetas',
  };
}

interface NutritionData {
  label: string;
  value: string;
  percentage: number;
  color: string;
  icon: any;
}

const nutritionData: NutritionData[] = [
  { label: 'Calorías', value: '450 kcal', percentage: 22, color: 'text-orange-400', icon: Flame },
  { label: 'Proteínas', value: '28g', percentage: 56, color: 'text-red-400', icon: Pizza },
  { label: 'Carbohidratos', value: '45g', percentage: 15, color: 'text-blue-400', icon: Droplet },
  { label: 'Grasas', value: '18g', percentage: 25, color: 'text-yellow-400', icon: Activity },
];

export default async function InformacionNutricionalPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <LiquidGlassContainer fullscreen>
      {/* GIF Background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          src="/branding/informacion nutricional - video.gif"
          alt="Nutrition background"
          className="w-full h-full object-cover opacity-25"
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Activity className="w-12 h-12 text-green-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
              Información Nutricional
            </h1>
          </div>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Análisis completo de macronutrientes y micronutrientes de tus recetas
          </p>
        </div>

        {/* Main Nutrition Card */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Left: Circular Chart Placeholder */}
          <LiquidGlassCard variant="ios" blur="2xl">
            <h2 className="text-xl font-semibold mb-6 text-center">Distribución Diaria</h2>
            <div className="relative aspect-square max-w-xs mx-auto flex items-center justify-center">
              {/* Circular Progress Placeholder */}
              <div className="absolute inset-0 rounded-full border-8 border-gray-700/50"></div>
              <div
                className="absolute inset-0 rounded-full border-8 border-green-400"
                style={{
                  clipPath: 'polygon(50% 50%, 50% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 0%, 50% 0%)',
                }}
              ></div>
              <div className="text-center z-10">
                <div className="text-5xl font-bold text-white">1,850</div>
                <div className="text-gray-400">kcal/día</div>
                <LiquidGlassBadge variant="success" className="mt-2">
                  65% objetivo
                </LiquidGlassBadge>
              </div>
            </div>
          </LiquidGlassCard>

          {/* Right: Macros Breakdown */}
          <LiquidGlassCard variant="ios" blur="2xl">
            <h2 className="text-xl font-semibold mb-6">Macronutrientes</h2>
            <div className="space-y-4">
              {nutritionData.map((macro) => {
                const Icon = macro.icon;
                return (
                  <div key={macro.label}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Icon className={`w-5 h-5 ${macro.color}`} />
                        <span className="font-medium">{macro.label}</span>
                      </div>
                      <span className={`font-bold ${macro.color}`}>{macro.value}</span>
                    </div>
                    <div className="w-full bg-gray-700/50 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${
                          macro.color.includes('orange')
                            ? 'from-orange-500 to-orange-400'
                            : macro.color.includes('red')
                            ? 'from-red-500 to-red-400'
                            : macro.color.includes('blue')
                            ? 'from-blue-500 to-blue-400'
                            : 'from-yellow-500 to-yellow-400'
                        } transition-all duration-500`}
                        style={{ width: `${macro.percentage}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-400 mt-1">{macro.percentage}% del objetivo diario</div>
                  </div>
                );
              })}
            </div>
          </LiquidGlassCard>
        </div>

        {/* Vitamins & Minerals */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <LiquidGlassCard variant="subtle" blur="lg">
            <div className="text-center">
              <Target className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">85%</div>
              <div className="text-sm text-gray-400">Vitamina C</div>
              <LiquidGlassBadge variant="primary" size="sm" className="mt-2">
                Óptimo
              </LiquidGlassBadge>
            </div>
          </LiquidGlassCard>

          <LiquidGlassCard variant="subtle" blur="lg">
            <div className="text-center">
              <TrendingUp className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">92%</div>
              <div className="text-sm text-gray-400">Hierro</div>
              <LiquidGlassBadge variant="primary" size="sm" className="mt-2">
                Excelente
              </LiquidGlassBadge>
            </div>
          </LiquidGlassCard>

          <LiquidGlassCard variant="subtle" blur="lg">
            <div className="text-center">
              <Activity className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">78%</div>
              <div className="text-sm text-gray-400">Calcio</div>
              <LiquidGlassBadge variant="success" size="sm" className="mt-2">
                Bueno
              </LiquidGlassBadge>
            </div>
          </LiquidGlassCard>
        </div>

        {/* Detailed Info */}
        <LiquidGlassCard variant="frosted" blur="xl">
          <h3 className="text-lg font-semibold mb-4">Detalles Nutricionales</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Fibra</span>
              <span className="font-medium">12g (48%)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Azúcares</span>
              <span className="font-medium">8g (16%)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Sodio</span>
              <span className="font-medium">450mg (20%)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Colesterol</span>
              <span className="font-medium">65mg (22%)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Grasas saturadas</span>
              <span className="font-medium">6g (30%)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Grasas trans</span>
              <span className="font-medium">0g (0%)</span>
            </div>
          </div>
        </LiquidGlassCard>

        {/* Actions */}
        <div className="mt-8 flex gap-4 justify-center">
          <LiquidGlassButton variant="default" size="lg">
            Compartir Análisis
          </LiquidGlassButton>
          <LiquidGlassButton variant="primary" size="lg">
            Ver Receta Completa
          </LiquidGlassButton>
        </div>
      </div>
    </LiquidGlassContainer>
  );
}
