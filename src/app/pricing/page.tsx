import SubscribeButton from "@/components/SubscribeButton";

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-neutral-950 dark:to-neutral-900 py-20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4 text-neutral-900 dark:text-white">
            Elige tu plan 🐓
          </h1>
          <p className="text-xl text-neutral-600 dark:text-neutral-400">
            Aprovecha todo el poder de Cocorico Premium
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Plan FREE */}
          <div className="bg-white dark:bg-neutral-800 p-8 rounded-2xl shadow-lg border border-neutral-200 dark:border-neutral-700">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">
                Free
              </h2>
              <p className="text-neutral-500 dark:text-neutral-400">
                Perfecto para probar
              </p>
            </div>

            <div className="mb-8">
              <p className="text-5xl font-bold text-center text-neutral-900 dark:text-white">
                Gratis
              </p>
            </div>

            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-2 text-neutral-700 dark:text-neutral-300">
                <span className="text-green-600 dark:text-green-400">✔</span>
                <span>10 chats IA al mes</span>
              </li>
              <li className="flex items-start gap-2 text-neutral-700 dark:text-neutral-300">
                <span className="text-green-600 dark:text-green-400">✔</span>
                <span>5 recetas guardadas</span>
              </li>
              <li className="flex items-start gap-2 text-neutral-700 dark:text-neutral-300">
                <span className="text-green-600 dark:text-green-400">✔</span>
                <span>Acceso al escáner local</span>
              </li>
              <li className="flex items-start gap-2 text-neutral-400 dark:text-neutral-600">
                <span className="text-red-500">❌</span>
                <span>Sin cámara IA avanzada</span>
              </li>
              <li className="flex items-start gap-2 text-neutral-400 dark:text-neutral-600">
                <span className="text-red-500">❌</span>
                <span>Sin voz IA ilimitada</span>
              </li>
            </ul>

            <a
              href="/signup"
              className="block w-full text-center px-6 py-3 border-2 border-orange-600 text-orange-600 font-semibold rounded-lg hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors"
            >
              Comenzar gratis
            </a>
          </div>

          {/* Plan PREMIUM */}
          <div className="relative bg-gradient-to-br from-orange-500 via-orange-600 to-red-600 p-8 rounded-2xl shadow-2xl text-white">
            <div className="absolute -top-4 right-8">
              <span className="bg-yellow-400 text-orange-900 text-xs font-bold px-3 py-1 rounded-full">
                MÁS POPULAR
              </span>
            </div>

            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold mb-2">Premium</h2>
              <p className="opacity-90">Para foodies y creadores 🧑‍🍳</p>
            </div>

            <div className="mb-8">
              <p className="text-center">
                <span className="text-5xl font-bold">4,99 €</span>
                <span className="text-xl opacity-90">/mes</span>
              </p>
            </div>

            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-2">
                <span className="text-yellow-300">✔</span>
                <span>Chats IA ilimitados</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-300">✔</span>
                <span>Recetas guardadas sin límite</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-300">✔</span>
                <span>Escáner con visión avanzada</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-300">✔</span>
                <span>Narración de recetas (voz IA)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-300">✔</span>
                <span>Acceso prioritario a funciones beta</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-300">✔</span>
                <span>Soporte prioritario</span>
              </li>
            </ul>

            <SubscribeButton />
          </div>
        </div>

        <div className="mt-12 text-center text-sm text-neutral-500 dark:text-neutral-400">
          <p>Puedes cancelar tu suscripción en cualquier momento.</p>
          <p>Pagos seguros procesados por Stripe.</p>
        </div>
      </div>
    </div>
  );
}
