import GlassCard from "@/components/ui/GlassCard";
import Wallpaper from "@/components/layout/Wallpaper";
import { Heart, MessageCircle, Share2, Eye, Clock, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default async function FeedPage({ params }: { params: { locale: string } }) {
  // TODO: Replace with actual DB fetch
  const recipes = [
    { 
      id: 1, 
      title: "Tacos al Pastor Auténticos", 
      description: "Receta tradicional mexicana con marinado de 24 horas y piña asada.",
      author: "Chef María",
      image: "/branding/cocorico/cocorico-cooking.png",
      likes: 127,
      comments: 23,
      views: 1520,
      time: "hace 2 horas"
    },
    { 
      id: 2, 
      title: "Ramen Casero Japonés", 
      description: "Caldo intenso de 12 horas con huevo marinado y chashu de cerdo.",
      author: "Cocina_Fusion",
      image: "/branding/cocorico/chef.png",
      likes: 89,
      comments: 15,
      views: 980,
      time: "hace 5 horas"
    },
    { 
      id: 3, 
      title: "Tarta de Limón Merengada", 
      description: "Postre ligero y refrescante con merengue italiano perfecto.",
      author: "Sweet Dreams",
      image: "/branding/cocorico/happy.png",
      likes: 203,
      comments: 34,
      views: 2100,
      time: "hace 1 día"
    },
    { 
      id: 4, 
      title: "Risotto de Hongos Porcini", 
      description: "Cremoso risotto italiano con hongos salvajes y parmesano.",
      author: "Italiano Vero",
      image: "/branding/cocorico/thinking.png",
      likes: 156,
      comments: 19,
      views: 1340,
      time: "hace 1 día"
    },
  ];

  return (
    <>
      <Wallpaper
        imageLight="/branding/FEED_MODO_CLARO.png"
        imageDark="/branding/FEED_MODO_OSCURO.png"
      />
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-cocorico-brown dark:text-amber-100 mb-2">
            Feed de Recetas 🍽️
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            Descubre las últimas creaciones de nuestra comunidad
          </p>
        </header>

        <div className="grid gap-6">
          {recipes.map(recipe => (
            <GlassCard key={recipe.id} className="overflow-hidden hover:scale-[1.01] transition-transform">
              <div className="flex flex-col md:flex-row">
                {/* Image */}
                <div className="md:w-48 h-48 relative bg-neutral-200 dark:bg-neutral-800">
                  <Image
                    src={recipe.image}
                    alt={recipe.title}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Content */}
                <div className="flex-1 p-5 flex flex-col">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <Link href={`/${params.locale}/recipes/${recipe.id}`}>
                        <h2 className="text-xl font-bold text-cocorico-brown dark:text-amber-100 hover:text-cocorico-red transition-colors mb-1">
                          {recipe.title}
                        </h2>
                      </Link>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400 flex items-center gap-2">
                        <span className="font-medium">{recipe.author}</span>
                        <span>•</span>
                        <Clock className="w-3 h-3" />
                        {recipe.time}
                      </p>
                    </div>
                  </div>

                  <p className="text-neutral-600 dark:text-neutral-300 mb-4 line-clamp-2">
                    {recipe.description}
                  </p>

                  {/* Stats and Actions */}
                  <div className="flex items-center justify-between mt-auto pt-3 border-t border-neutral-200 dark:border-neutral-700">
                    <div className="flex items-center gap-4 text-sm text-neutral-500 dark:text-neutral-400">
                      <span className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {recipe.views}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="w-4 h-4" />
                        {recipe.comments}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/50 dark:bg-black/20 hover:bg-cocorico-red/10 dark:hover:bg-cocorico-red/20 text-cocorico-red transition-colors">
                        <Heart className="w-4 h-4" />
                        <span className="text-sm font-semibold">{recipe.likes}</span>
                      </button>
                      <button className="p-1.5 rounded-full bg-white/50 dark:bg-black/20 hover:bg-white/80 dark:hover:bg-black/40 transition-colors text-neutral-600 dark:text-neutral-400">
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>

        {recipes.length === 0 && (
          <GlassCard className="p-12 text-center">
            <p className="text-neutral-500 dark:text-neutral-400">
              No hay recetas en el feed todavía.
            </p>
          </GlassCard>
        )}
      </div>
    </>
  );
}
