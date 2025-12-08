import { getTranslations } from 'next-intl/server';
import {
  LiquidGlassContainer,
  LiquidGlassCard,
  LiquidGlassButton,
  LiquidGlassAvatar,
  LiquidGlassBadge,
} from '@/components/ui/LiquidGlass';
import { Video, Heart, MessageCircle, Share2, Play, TrendingUp, Users } from 'lucide-react';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'community' });

  return {
    title: t('title') || 'Comunidad Video',
    description: t('description') || 'Comparte y descubre videos de recetas de la comunidad',
  };
}

interface VideoPost {
  id: string;
  author: string;
  avatar: string;
  isPremium: boolean;
  title: string;
  duration: string;
  views: string;
  likes: number;
  comments: number;
  thumbnail: string;
}

const demoVideos: VideoPost[] = [
  {
    id: '1',
    author: 'Chef María',
    avatar: '👩‍🍳',
    isPremium: true,
    title: 'Pasta Carbonara Auténtica en 15 minutos',
    duration: '8:45',
    views: '12.5K',
    likes: 2341,
    comments: 156,
    thumbnail: '/branding/cocorico-cooking.png',
  },
  {
    id: '2',
    author: 'Carlos Gourmet',
    avatar: '👨‍🍳',
    isPremium: false,
    title: 'Secretos del Pan Casero Perfecto',
    duration: '15:20',
    views: '8.2K',
    likes: 1823,
    comments: 94,
    thumbnail: '/branding/cocorico-happy.png',
  },
  {
    id: '3',
    author: 'Ana Healthy',
    avatar: '🥗',
    isPremium: true,
    title: 'Bowl Vegano Alto en Proteínas',
    duration: '6:30',
    views: '15.8K',
    likes: 3142,
    comments: 203,
    thumbnail: '/branding/cocorico-thinking.png',
  },
];

export default async function ComunidadVideoPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  return (
    <LiquidGlassContainer fullscreen>
      {/* GIF Background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          src="/branding/comunidad-video.gif"
          alt="Community background"
          className="w-full h-full object-cover opacity-20"
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Video className="w-12 h-12 text-pink-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
              Comunidad Video
            </h1>
          </div>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Descubre, comparte y aprende con videos de recetas de nuestra comunidad
          </p>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <LiquidGlassCard variant="subtle" blur="md" className="text-center">
            <TrendingUp className="w-6 h-6 text-pink-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">1,234</div>
            <div className="text-sm text-gray-400">Videos Activos</div>
          </LiquidGlassCard>

          <LiquidGlassCard variant="subtle" blur="md" className="text-center">
            <Users className="w-6 h-6 text-purple-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">45K</div>
            <div className="text-sm text-gray-400">Miembros</div>
          </LiquidGlassCard>

          <LiquidGlassCard variant="subtle" blur="md" className="text-center">
            <Heart className="w-6 h-6 text-red-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">2.1M</div>
            <div className="text-sm text-gray-400">Me Gusta</div>
          </LiquidGlassCard>
        </div>

        {/* Upload Button */}
        <div className="mb-8 flex justify-center">
          <LiquidGlassButton variant="primary" size="lg">
            <Video className="w-5 h-5 mr-2" />
            Subir Tu Video
          </LiquidGlassButton>
        </div>

        {/* Video Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {demoVideos.map((video) => (
            <LiquidGlassCard key={video.id} variant="frosted" blur="xl" className="overflow-hidden group">
              {/* Thumbnail */}
              <div className="relative aspect-video bg-gradient-to-br from-purple-900/50 to-pink-900/50 rounded-lg overflow-hidden mb-4">
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/50 transition-all">
                  <Play className="w-16 h-16 text-white opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all" />
                </div>
                <div className="absolute top-2 right-2">
                  <LiquidGlassBadge variant="primary" size="sm">
                    {video.duration}
                  </LiquidGlassBadge>
                </div>
              </div>

              {/* Content */}
              <div>
                {/* Author */}
                <div className="flex items-center gap-3 mb-3">
                  <LiquidGlassAvatar
                    src={video.avatar}
                    alt={video.author}
                    size="sm"
                    isPremium={video.isPremium}
                  />
                  <div className="flex-1">
                    <div className="font-medium text-white flex items-center gap-2">
                      {video.author}
                      {video.isPremium && <LiquidGlassBadge variant="warning" size="sm">PRO</LiquidGlassBadge>}
                    </div>
                    <div className="text-xs text-gray-400">{video.views} vistas</div>
                  </div>
                </div>

                {/* Title */}
                <h3 className="font-semibold text-white mb-3 line-clamp-2">{video.title}</h3>

                {/* Stats */}
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <button className="flex items-center gap-1 hover:text-red-400 transition-colors">
                    <Heart className="w-4 h-4" />
                    <span>{video.likes}</span>
                  </button>
                  <button className="flex items-center gap-1 hover:text-blue-400 transition-colors">
                    <MessageCircle className="w-4 h-4" />
                    <span>{video.comments}</span>
                  </button>
                  <button className="flex items-center gap-1 hover:text-green-400 transition-colors ml-auto">
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </LiquidGlassCard>
          ))}
        </div>

        {/* Load More */}
        <div className="mt-8 text-center">
          <LiquidGlassButton variant="default" size="lg">
            Cargar Más Videos
          </LiquidGlassButton>
        </div>
      </div>
    </LiquidGlassContainer>
  );
}
