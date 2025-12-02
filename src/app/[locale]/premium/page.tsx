import Wallpaper from "@/components/layout/Wallpaper";
import GlassCard from "@/components/ui/GlassCard";
import { RippleButton } from "@/components/ui/ripple-button";
import Link from "next/link";
import { Check, Sparkles, Zap, Crown, ChefHat, Camera, Trophy } from "lucide-react";

export default async function PremiumPage({ params }: { params: { locale: string } }) {
  const features = [
    { icon: Sparkles, title: "UI Liquid Glass", desc: "Interfaz premium con efectos glassmorphism" },
    { icon: ChefHat, title: "IA Avanzada", desc: "Sugerencias nutricionales y sustituciones inteligentes" },
    { icon: Camera, title: "Escaneo HD", desc: "Reconocimiento de ingredientes de alta precisión" },
    { icon: Trophy, title: "Retos Exclusivos", desc: "Acceso a desafíos premium y badges especiales" },
    { icon: Zap, title: "Modo Cocina", desc: "Experiencia inmersiva con pasos guiados" },
    { icon: Crown, title: "Sin Anuncios", desc: "Experiencia completamente sin interrupciones" },
  ];

  return (
    <>
      <Wallpaper
        imageLight="/branding/PREMIUM_MODO_CLARO.png"
        imageDark="/branding/PREMIUM_MODO_OSCURO.png"
      />
      <div className="min-h-screen max-w-6xl mx-auto px-4 py-12 space-y-16">
        {/* Hero Section */}
        <GlassCard className="p-8 md:p-16 text-center space-y-6">
          <div className="inline-block p-3 rounded-2xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 mb-4">
            <Crown className="w-12 h-12 text-amber-500" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
            Cocorico Premium
          </h1>
          <p className="text-lg md:text-xl text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto">
            Eleva tu experiencia culinaria con IA avanzada, interfaz premium y funciones exclusivas
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <RippleButton className="coco-btn-primary text-lg px-8 py-4">
              <Link href={`/${params.locale}/checkout`}>Comenzar ahora</Link>
            </RippleButton>
            <RippleButton className="coco-btn-secondary text-lg px-8 py-4">
              <Link href="#features">Ver características</Link>
            </RippleButton>
          </div>
        </GlassCard>

        {/* Features Grid */}
        <section id="features" className="space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center">Características Premium</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <GlassCard key={idx} className="p-6 hover:scale-105 transition-transform">
                  <div className="inline-block p-3 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 mb-4">
                    <Icon className="w-8 h-8 text-amber-500" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">{feature.desc}</p>
                </GlassCard>
              );
            })}
          </div>
        </section>

        {/* Pricing */}
        <section className="space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center">Plan Premium</h2>
          <div className="max-w-md mx-auto">
            <GlassCard className="p-8 text-center space-y-6">
              <div className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-600 dark:text-amber-400 text-sm font-semibold">
                Más Popular
              </div>
              <div className="space-y-2">
                <div className="text-5xl font-bold">
                  $9.99<span className="text-2xl text-neutral-500">/mes</span>
                </div>
                <p className="text-neutral-600 dark:text-neutral-400">o $99/año (ahorra 17%)</p>
              </div>
              <ul className="space-y-3 text-left">
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Todas las características premium</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>IA avanzada sin límites</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Recetas ilimitadas</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Soporte prioritario</span>
                </li>
              </ul>
              <RippleButton className="w-full coco-btn-primary py-4 text-lg">
                <Link href={`/${params.locale}/checkout`}>Suscribirse ahora</Link>
              </RippleButton>
              <p className="text-xs text-neutral-500">Cancela cuando quieras · Garantía de 30 días</p>
            </GlassCard>
          </div>
        </section>

        {/* FAQ */}
        <section className="space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center">Preguntas Frecuentes</h2>
          <div className="max-w-3xl mx-auto space-y-4">
            {[
              { q: "¿Puedo cancelar en cualquier momento?", a: "Sí, puedes cancelar tu suscripción cuando quieras sin penalización." },
              { q: "¿Qué incluye el plan premium?", a: "Acceso completo a IA avanzada, UI liquid glass, modo cocina inmersivo, retos exclusivos y mucho más." },
              { q: "¿Hay garantía de devolución?", a: "Ofrecemos garantía de devolución de 30 días sin preguntas." },
              { q: "¿Funciona en todos los dispositivos?", a: "Sí, Cocorico Premium funciona en web, iOS y Android con sincronización automática." },
            ].map((faq, idx) => (
              <GlassCard key={idx} className="p-6">
                <h3 className="font-bold text-lg mb-2">{faq.q}</h3>
                <p className="text-neutral-600 dark:text-neutral-400">{faq.a}</p>
              </GlassCard>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <GlassCard className="p-12 text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold">¿Listo para empezar?</h2>
          <p className="text-lg text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto">
            Únete a miles de usuarios que ya disfrutan de Cocorico Premium
          </p>
          <RippleButton className="coco-btn-primary text-lg px-12 py-4">
            <Link href={`/${params.locale}/checkout`}>Comenzar prueba gratuita</Link>
          </RippleButton>
        </GlassCard>
      </div>
    </>
  );
}
