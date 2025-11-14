// @ts-nocheck - user_subscriptions table not yet in Database type; requires migration
import Link from "next/link";
import { supabaseServer } from "@/app/lib/supabase-server";

export default async function PlansPage() {
  const { data: { user } } = await supabaseServer().auth.getUser();
  
  let subscriptionStatus = null;
  if (user) {
    const { data: sub } = await supabaseServer()
      .from("user_subscriptions")
      .select("status")
      .eq("user_id", user.id)
      .maybeSingle();
    subscriptionStatus = sub?.status;
  }

  const isPremium = subscriptionStatus === "active" || subscriptionStatus === "trialing";

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 text-center">
      <h1 className="text-4xl font-bold mb-4 text-cocorico-red dark:text-amber-400">
        Planes de Cocorico Premium 🐓
      </h1>
      <p className="text-lg text-neutral-600 dark:text-neutral-400 mb-12">
        Desbloquea funciones avanzadas como IA ilimitada, recetas exclusivas y
        personalización total.
      </p>

      <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
        {/* Plan Gratis */}
        <div className="border-2 dark:border-neutral-700 p-8 rounded-2xl shadow-lg bg-white dark:bg-neutral-900">
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2">Gratis</h2>
            <p className="text-4xl font-bold text-neutral-800 dark:text-white">
              €0<span className="text-lg font-normal text-neutral-500">/mes</span>
            </p>
          </div>
          <ul className="text-left space-y-3 mb-8">
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-1">✅</span>
              <span className="text-sm">10 recetas con IA al mes</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-1">✅</span>
              <span className="text-sm">Guardar recetas favoritas</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-1">✅</span>
              <span className="text-sm">Acceso a la comunidad</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500 mt-1">❌</span>
              <span className="text-sm text-neutral-500">Sin recetas exclusivas</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500 mt-1">❌</span>
              <span className="text-sm text-neutral-500">
                Sin personalización avanzada
              </span>
            </li>
          </ul>
          <Link
            href={user ? "/dashboard" : "/login"}
            className="block w-full py-3 px-4 bg-neutral-200 dark:bg-neutral-700 text-neutral-800 dark:text-white rounded-lg font-semibold hover:bg-neutral-300 dark:hover:bg-neutral-600 transition"
          >
            {user && !isPremium ? "Tu plan actual" : "Empezar gratis"}
          </Link>
        </div>

        {/* Plan Premium */}
        <div className="border-4 border-cocorico-red p-8 rounded-2xl shadow-2xl bg-gradient-to-br from-white to-amber-50 dark:from-neutral-900 dark:to-neutral-800 relative">
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-cocorico-red text-white px-4 py-1 rounded-full text-sm font-bold">
            POPULAR
          </div>
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2 text-cocorico-red">Premium</h2>
            <p className="text-4xl font-bold text-neutral-800 dark:text-white">
              €4.99<span className="text-lg font-normal text-neutral-500">/mes</span>
            </p>
          </div>
          <ul className="text-left space-y-3 mb-8">
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-1">✅</span>
              <span className="text-sm font-medium">IA ilimitada</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-1">✅</span>
              <span className="text-sm font-medium">
                Recetas exclusivas y vídeos
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-1">✅</span>
              <span className="text-sm font-medium">Chat privado con usuarios</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-1">✅</span>
              <span className="text-sm font-medium">
                Personalización avanzada de perfil
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-1">✅</span>
              <span className="text-sm font-medium">Sin anuncios</span>
            </li>
          </ul>
          {isPremium ? (
            <div className="w-full py-3 px-4 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-lg font-semibold text-center">
              ✓ Plan activo
            </div>
          ) : (
            <Link
              href={user ? "/checkout" : "/login"}
              className="block w-full py-3 px-4 bg-cocorico-red text-white rounded-lg font-semibold hover:bg-red-600 transition shadow-lg"
            >
              Suscribirme ahora
            </Link>
          )}
        </div>
      </div>

      {user && isPremium && (
        <div className="mt-12 p-6 border dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-800">
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            ¿Quieres cancelar o gestionar tu suscripción?{" "}
            <Link href="/billing/manage" className="text-cocorico-red underline">
              Ir a configuración de facturación
            </Link>
          </p>
        </div>
      )}
    </div>
  );
}
