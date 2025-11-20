import { getTranslations } from "next-intl/server";
import { Metadata } from "next";
import SubscribeButton from "@/components/SubscribeButton";
import { AppBackground } from "@/components/layout/AppBackground";

export const metadata: Metadata = {
  title: "Precios | Cocorico",
  description: "Elige el plan perfecto para ti. Prueba Cocorico gratis o desbloquea funciones premium.",
};

export default async function PricingPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const t = await getTranslations({ locale });

  return (
    <AppBackground variantOverride="home-premium">
      <main className="min-h-screen py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl sm:text-6xl font-bold mb-4 glass-text-strong">
              Elige tu plan 🐓
            </h1>
            <p className="text-xl glass-text-medium max-w-2xl mx-auto">
              Aprovecha todo el poder de Cocorico Premium
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Plan FREE */}
            <div className="glass-card p-8 rounded-3xl relative z-10">
              <div className="text-center mb-6 relative z-10">
                <h2 className="text-3xl font-bold glass-text-strong mb-2">
                  Free
                </h2>
                <p className="glass-text-soft">
                  Perfecto para probar
                </p>
              </div>

              <div className="mb-8 relative z-10">
                <p className="text-5xl font-bold text-center glass-text-strong">
                  Gratis
                </p>
              </div>

              <ul className="space-y-3 mb-8 relative z-10">
                <li className="flex items-start gap-2 glass-text-medium">
                  <span className="text-green-400">✔</span>
                  <span>10 chats IA al mes</span>
                </li>
                <li className="flex items-start gap-2 glass-text-medium">
                  <span className="text-green-400">✔</span>
                  <span>5 recetas guardadas</span>
                </li>
                <li className="flex items-start gap-2 glass-text-medium">
                  <span className="text-green-400">✔</span>
                  <span>Acceso al escáner local</span>
                </li>
                <li className="flex items-start gap-2 glass-text-soft opacity-60">
                  <span className="text-red-400">❌</span>
                  <span>Sin cámara IA avanzada</span>
                </li>
                <li className="flex items-start gap-2 glass-text-soft opacity-60">
                  <span className="text-red-400">❌</span>
                  <span>Sin voz IA ilimitada</span>
                </li>
              </ul>

              <a
                href={`/${locale}/signup`}
                className="relative z-10 block w-full text-center px-6 py-3 glass-card glass-card-avocado font-semibold rounded-xl hover:scale-105 transition-transform glass-text-strong"
              >
                Comenzar gratis
              </a>
            </div>

            {/* Plan PREMIUM */}
            <div className="relative glass-card glass-card-mango p-8 rounded-3xl">
              <div className="absolute -top-4 right-8 z-20">
                <span className="bg-cocorico-datil text-neutral-900 text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                  MÁS POPULAR
                </span>
              </div>

              <div className="text-center mb-6 relative z-10">
                <h2 className="text-3xl font-bold glass-text-strong mb-2">Premium</h2>
                <p className="glass-text-medium">Para foodies y creadores 🧑‍🍳</p>
              </div>

              <div className="mb-8 relative z-10">
                <p className="text-center">
                  <span className="text-5xl font-bold glass-text-strong">4,99 €</span>
                  <span className="text-xl glass-text-medium">/mes</span>
                </p>
              </div>

              <ul className="space-y-3 mb-8 relative z-10">
                <li className="flex items-start gap-2 glass-text-medium">
                  <span className="text-yellow-300">✔</span>
                  <span>Chats IA ilimitados</span>
                </li>
                <li className="flex items-start gap-2 glass-text-medium">
                  <span className="text-yellow-300">✔</span>
                  <span>Recetas guardadas sin límite</span>
                </li>
                <li className="flex items-start gap-2 glass-text-medium">
                  <span className="text-yellow-300">✔</span>
                  <span>Escáner con visión avanzada</span>
                </li>
                <li className="flex items-start gap-2 glass-text-medium">
                  <span className="text-yellow-300">✔</span>
                  <span>Narración de recetas (voz IA)</span>
                </li>
                <li className="flex items-start gap-2 glass-text-medium">
                  <span className="text-yellow-300">✔</span>
                  <span>Acceso prioritario a funciones beta</span>
                </li>
                <li className="flex items-start gap-2 glass-text-medium">
                  <span className="text-yellow-300">✔</span>
                  <span>Soporte prioritario</span>
                </li>
              </ul>

              <div className="relative z-10">
                <SubscribeButton />
              </div>
            </div>
          </div>

          <div className="mt-12 text-center text-sm glass-text-soft max-w-2xl mx-auto">
            <p className="mb-2">Puedes cancelar tu suscripción en cualquier momento.</p>
            <p>Pagos seguros procesados por Stripe.</p>
          </div>
        </div>
      </main>
    </AppBackground>
  );
}
