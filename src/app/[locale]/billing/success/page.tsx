// @ts-nocheck - user_subscriptions table not yet in Database type; requires migration
import { supabaseServer } from "@/app/lib/supabase-server";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: { session_id?: string };
}) {
  const {
    data: { user },
  } = await supabaseServer().auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: sub } = await supabaseServer()
    .from("user_subscriptions")
    .select("status, current_period_end")
    .eq("user_id", user.id)
    .maybeSingle();

  const isPremium = sub?.status === "active" || sub?.status === "trialing";

  return (
    <div className="max-w-md mx-auto p-8 text-center">
      <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-lg p-8">
        {isPremium ? (
          <>
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">🎉</span>
            </div>
            <h1 className="text-3xl font-bold mb-2 text-green-600 dark:text-green-400">
              ¡Bienvenido a Premium!
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400 mb-6">
              Tu suscripción está activa. Ahora puedes disfrutar de todas las
              funciones exclusivas de Cocorico.
            </p>
            {sub?.current_period_end && (
              <p className="text-sm text-neutral-500 mb-6">
                Renovación:{" "}
                {new Date(sub.current_period_end).toLocaleDateString("es-ES", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            )}
          </>
        ) : (
          <>
            <div className="w-20 h-20 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">⏳</span>
            </div>
            <h1 className="text-3xl font-bold mb-2">¡Gracias!</h1>
            <p className="text-neutral-600 dark:text-neutral-400 mb-6">
              Tu pago está siendo procesado. Tu suscripción se activará en breve.
            </p>
          </>
        )}

        <div className="space-y-3">
          <Link
            href="/dashboard"
            className="block w-full bg-cocorico-red text-white py-3 px-4 rounded-lg font-semibold hover:bg-red-600 transition"
          >
            Ir al Dashboard
          </Link>
          <Link
            href="/community"
            className="block w-full border dark:border-neutral-700 py-3 px-4 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
          >
            Explorar Comunidad
          </Link>
        </div>

        {searchParams.session_id && (
          <p className="text-xs text-neutral-500 mt-6">
            ID de sesión: {searchParams.session_id.slice(0, 20)}...
          </p>
        )}
      </div>
    </div>
  );
}
