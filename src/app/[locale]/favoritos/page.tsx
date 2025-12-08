import { getTranslations } from 'next-intl/server';
import {
  LiquidGlassContainer,
  LiquidGlassCard,
  LiquidGlassButton,
  LiquidGlassBadge,
} from '@/components/ui/LiquidGlass';
import { Heart, Clock, ChefHat, Star, Filter, Search } from 'lucide-react';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'favorites' });

  return {
    title: t('title') || 'Favoritos',
    description: t('description') || 'Tus recetas favoritas guardadas',
  };
}

interface FavoriteRecipe {
  id: string;
  name: string;
  chef: string;
  rating: number;
  time: string;
  difficulty: 'Fácil' | 'Media' | 'Difícil';
  cuisine: string;
  image: string;
}

const demoFavorites: FavoriteRecipe[] = [
  {
    id: '1',
    name: 'Risotto de Champiñones',
    chef: 'Chef María',
    rating: 4.8,
    time: '35 min',
    difficulty: 'Media',
    cuisine: 'Italiana',
    image: '🍄',
  },
  {
    id: '2',
    name: 'Tacos al Pastor',
    chef: 'Carlos Gourmet',
    rating: 4.9,
    time: '45 min',
    difficulty: 'Media',
    cuisine: 'Mexicana',
    image: '🌮',
  },
  {
    id: '3',
    name: 'Pad Thai Auténtico',
    chef: 'Ana Healthy',
    rating: 4.7,
    time: '25 min',
    difficulty: 'Fácil',
    cuisine: 'Tailandesa',
    image: '🍜',
  },
  {
    id: '4',
    name: 'Tarta de Manzana',
    chef: 'Chef María',
    rating: 5.0,
    time: '60 min',
    difficulty: 'Difícil',
    cuisine: 'Francesa',
    image: '🥧',
  },
  {
    id: '5',
    name: 'Sushi Rolls',
    chef: 'Ana Healthy',
    rating: 4.8,
    time: '40 min',
    difficulty: 'Media',
    cuisine: 'Japonesa',
    image: '🍣',
  },
  {
    id: '6',
    name: 'Paella Valenciana',
    chef: 'Carlos Gourmet',
    rating: 4.9,
    time: '50 min',
    difficulty: 'Difícil',
    cuisine: 'Española',
    image: '🥘',
  },
];

export default async function FavoritosPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  return (
    <LiquidGlassContainer fullscreen>
      {/* GIF Background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          src="/branding/favoritos-video.gif"
          alt="Favorites background"
          className="w-full h-full object-cover opacity-20"
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Heart className="w-12 h-12 text-red-400 fill-red-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent">
              Mis Favoritos
            </h1>
          </div>
          <p className="text-gray-300">
            Las recetas que más te gustan, todas en un solo lugar
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <LiquidGlassCard variant="subtle" blur="md" className="text-center">
            <div className="text-3xl font-bold text-red-400">{demoFavorites.length}</div>
            <div className="text-sm text-gray-400">Recetas Guardadas</div>
          </LiquidGlassCard>

          <LiquidGlassCard variant="subtle" blur="md" className="text-center">
            <div className="text-3xl font-bold text-yellow-400">4.8</div>
            <div className="text-sm text-gray-400">Rating Promedio</div>
          </LiquidGlassCard>

          <LiquidGlassCard variant="subtle" blur="md" className="text-center">
            <div className="text-3xl font-bold text-blue-400">5</div>
            <div className="text-sm text-gray-400">Cocinas</div>
          </LiquidGlassCard>
        </div>

        {/* Filters */}
        <LiquidGlassCard variant="frosted" blur="lg" className="mb-6">
          <div className="flex gap-3 items-center flex-wrap">
            <LiquidGlassButton variant="default" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filtros
            </LiquidGlassButton>
            <LiquidGlassBadge variant="primary">Italiana</LiquidGlassBadge>
            <LiquidGlassBadge variant="success">Mexicana</LiquidGlassBadge>
            <LiquidGlassBadge variant="primary">Asiática</LiquidGlassBadge>
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar en favoritos..."
                  className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-400/50"
                />
              </div>
            </div>
          </div>
        </LiquidGlassCard>

        {/* Favorites Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {demoFavorites.map((recipe) => (
            <LiquidGlassCard key={recipe.id} variant="frosted" blur="xl" className="overflow-hidden group">
              {/* Image Placeholder */}
              <div className="relative aspect-video bg-gradient-to-br from-red-900/50 to-pink-900/50 rounded-lg overflow-hidden mb-4 flex items-center justify-center">
                <div className="text-6xl">{recipe.image}</div>
                <button className="absolute top-2 right-2 p-2 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 transition-all">
                  <Heart className="w-5 h-5 text-red-400 fill-red-400" />
                </button>
              </div>

              {/* Content */}
              <div>
                <h3 className="font-bold text-lg text-white mb-2">{recipe.name}</h3>

                <div className="flex items-center gap-2 mb-3">
                  <ChefHat className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-400">{recipe.chef}</span>
                </div>

                <div className="flex items-center gap-4 mb-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="text-white font-medium">{recipe.rating}</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-400">
                    <Clock className="w-4 h-4" />
                    <span>{recipe.time}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <LiquidGlassBadge
                    variant={
                      recipe.difficulty === 'Fácil'
                        ? 'success'
                        : recipe.difficulty === 'Media'
                        ? 'primary'
                        : 'warning'
                    }
                    size="sm"
                  >
                    {recipe.difficulty}
                  </LiquidGlassBadge>
                  <LiquidGlassBadge variant="primary" size="sm">
                    {recipe.cuisine}
                  </LiquidGlassBadge>
                </div>

                <LiquidGlassButton variant="primary" size="md" className="w-full">
                  Ver Receta
                </LiquidGlassButton>
              </div>
            </LiquidGlassCard>
          ))}
        </div>

        {/* Empty State (hidden when there are favorites) */}
        {demoFavorites.length === 0 && (
          <LiquidGlassCard variant="ios" blur="2xl" className="text-center py-16">
            <Heart className="w-20 h-20 text-gray-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-400 mb-2">
              No tienes favoritos aún
            </h3>
            <p className="text-gray-500 mb-6">
              Explora recetas y guarda tus favoritas aquí
            </p>
            <LiquidGlassButton variant="primary" size="lg">
              Explorar Recetas
            </LiquidGlassButton>
          </LiquidGlassCard>
        )}
      </div>
    </LiquidGlassContainer>
  );
}
