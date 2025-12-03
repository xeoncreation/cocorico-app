import { supabaseServer } from "@/lib/supabase-client";
import { getUserPlan } from "@/utils/usageLimits";
import { redirect } from "next/navigation";
import Wallpaper from "@/components/layout/Wallpaper";

export default async function BillingPage() {
  if (!supabaseServer) {
    redirect("/login");
  }

  const { data: { user } } = await supabaseServer.auth.getUser();
  
  if (!user) {
    redirect("/login");
  }

  const plan = await getUserPlan(user.id);

  const isPremium = plan === "premium" || plan === "admin";

  return (
    <>
      <Wallpaper
        imageLight="/branding/MIS RECETAS- DASHBOARD — Cocina cenital difusa, modo claro.png"
        imageDark="/branding/MIS RECETAS - DASHBOARD — Encimera oscura gourmet, modo oscuro.png"
      />
      <div className="max-w-3xl mx-auto py-12 px-6">
        <div className="text-center mb-12">
          <h1 className="heading-display text-neutral-900 dark:text-white mb-4">
            Mi suscripción
          </h1>
        <p className="text-neutral-600 dark:text-neutral-400">
          Gestiona tu plan y facturación
        </p>
      </div>

      <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-lg p-8 mb-8 border border-neutral-200 dark:border-neutral-700">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-2">
              Estado actual
            </h2>
            <p className="text-lg">
              {isPremium ? (
                <span className="text-orange-600 dark:text-orange-400 font-semibold">
                  Premium 🥇
                </span>
              ) : (
                <span className="text-neutral-600 dark:text-neutral-400 font-semibold">
                  Free 🐥
                </span>
              )}
            </p>
          </div>
          
          {isPremium && (
            <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium">
              Activo
            </div>
          )}
        </div>

        {!isPremium && (
          <div className="space-y-4">
            <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
              <h3 className="font-semibold text-neutral-900 dark:text-white mb-2">
                Límites del plan Free:
              </h3>
              <ul className="space-y-1 text-sm text-neutral-700 dark:text-neutral-300">
                <li>• 10 chats IA al mes</li>
                <li>• 5 recetas guardadas</li>
                <li>• Funciones básicas de escáner</li>
              </ul>
            </div>

            <a
              href="/pricing"
              className="block w-full text-center bg-gradient-to-r from-orange-500 to-red-600 text-white font-semibold px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
            >
              Subir a Premium 🚀
            </a>
          </div>
        )}

        {isPremium && (
          <div className="space-y-4">
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <h3 className="font-semibold text-neutral-900 dark:text-white mb-2">
                Beneficios Premium:
              </h3>
              <ul className="space-y-1 text-sm text-neutral-700 dark:text-neutral-300">
                <li>✅ Chats IA ilimitados</li>
                <li>✅ Recetas guardadas sin límite</li>
                <li>✅ Escáner con visión avanzada</li>
                <li>✅ Narración de recetas (voz IA)</li>
                <li>✅ Soporte prioritario</li>
              </ul>
            </div>

            <div className="flex gap-3">
              <a
                href="https://billing.stripe.com/p/login/test_XXXXXXX"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 text-center border-2 border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 font-medium px-6 py-3 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors"
              >
                Gestionar en Stripe
              </a>
              <a
                href="/dashboard"
                className="flex-1 text-center bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 font-medium px-6 py-3 rounded-lg hover:bg-neutral-300 dark:hover:bg-neutral-600 transition-colors"
              >
                Volver al Dashboard
              </a>
            </div>
          </div>
        )}
      </div>

      <div className="text-center text-sm text-neutral-500 dark:text-neutral-400">
        <p>¿Necesitas ayuda? Contacta con soporte en support@cocorico.app</p>
      </div>
    </div>
    </>
  );
}
