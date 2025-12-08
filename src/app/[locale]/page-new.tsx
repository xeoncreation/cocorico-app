import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { MessageCircle, ScanLine, BookOpen, Users, Sparkles, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default async function HomePage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const t = await getTranslations({ locale }).catch(() => (key: string) => key);

  const features = [
    {
      icon: MessageCircle,
      title: "Chat Inteligente",
      description: "Habla con Cocorico por texto o voz",
      href: "/chat-unificado",
      color: "from-orange-500 to-red-500"
    },
    {
      icon: ScanLine,
      title: "Análisis de Alimentos",
      description: "Escanea productos y analiza nutrición",
      href: "/analisis",
      color: "from-cyan-500 to-blue-500"
    },
    {
      icon: BookOpen,
      title: "Mis Recetas",
      description: "Favoritos y versiones con IA",
      href: "/mis-recetas",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: Users,
      title: "Comunidad",
      description: "Videos, usuarios y estadísticas",
      href: "/comunidad",
      color: "from-green-500 to-teal-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 flex flex-col items-center justify-center px-4 py-20">
      {/* Hero Section */}
      <div className="max-w-4xl mx-auto text-center mb-16">
        <div className="text-7xl mb-6 animate-bounce">🐓</div>
        <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6">
          ¡Hola! Soy{" "}
          <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
            Cocorico
          </span>
        </h1>
        <p className="text-xl text-white/70 mb-8 max-w-2xl mx-auto">
          Tu asistente culinario con inteligencia artificial. Encuentra recetas, aprende a cocinar 
          y gestiona tu alimentación de forma inteligente.
        </p>
        
        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            href="/chat-unificado"
            className="group bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:scale-105 transition-transform flex items-center gap-2"
          >
            Empezar a Chatear
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/recipes"
            className="bg-white/10 backdrop-blur-xl border border-white/20 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-white/15 transition-colors"
          >
            Ver Recetas
          </Link>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-6xl mx-auto w-full">
        <h2 className="text-3xl font-bold text-white text-center mb-12">
          ¿Qué puedes hacer con Cocorico?
        </h2>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <Link
                key={idx}
                href={feature.href}
                className="group bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-white/30 transition-all hover:scale-105"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">
                  {feature.title}
                </h3>
                <p className="text-white/60 text-sm">
                  {feature.description}
                </p>
              </Link>
            );
          })}
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-4xl mx-auto text-center mt-20">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 sm:p-12">
          <Sparkles className="w-12 h-12 text-orange-500 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-white mb-4">
            ¿Listo para cocinar con IA?
          </h2>
          <p className="text-white/70 mb-8">
            Únete a miles de cocineros que ya usan Cocorico para mejorar sus habilidades culinarias
          </p>
          <Link
            href="/signup"
            className="inline-block bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:scale-105 transition-transform"
          >
            Crear Cuenta Gratis
          </Link>
        </div>
      </div>
    </div>
  );
}
