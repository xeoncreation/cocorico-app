import Link from "next/link";

export default function UpgradePage() {
  return (
    <main className="max-w-lg mx-auto px-4 py-16 space-y-6 text-center">
      <div className="mb-8">
        <span className="inline-block px-4 py-2 bg-[#FFD166] text-[#0F172A] rounded-full text-sm font-semibold mb-4">
          ✨ Desbloquea Premium
        </span>
      </div>

      <h1 className="text-3xl md:text-4xl font-bold mb-4">
        Hazte Premium
      </h1>

      <p className="text-lg opacity-80 max-w-md mx-auto">
        Desbloquea el modo cocina inmersivo, sugerencias IA avanzadas y la estética glass exclusiva.
      </p>

      <div className="my-8 space-y-3 text-left max-w-sm mx-auto">
        <div className="flex items-start gap-3">
          <span className="text-2xl">🎨</span>
          <div>
            <h3 className="font-semibold">Interfaz Glass</h3>
            <p className="text-sm opacity-70">Estética premium con glassmorphism y animaciones fluidas</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <span className="text-2xl">🧠</span>
          <div>
            <h3 className="font-semibold">IA Avanzada</h3>
            <p className="text-sm opacity-70">Optimización de macros, coste y tiempo personalizado</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <span className="text-2xl">👨‍🍳</span>
          <div>
            <h3 className="font-semibold">Modo Cocina</h3>
            <p className="text-sm opacity-70">Experiencia inmersiva con controles por gestos</p>
          </div>
        </div>
      </div>

      <Link
        href="/plans"
        className="inline-block mt-8 bg-[#2EC4B6] text-white rounded-2xl px-8 py-4 font-semibold text-lg transition-all hover:scale-105 shadow-lg"
      >
        Ver Planes
      </Link>

      <div className="mt-8 pt-8 border-t border-neutral-200 dark:border-neutral-700">
        <Link 
          href="/free" 
          className="text-sm underline opacity-70 hover:opacity-100 transition"
        >
          Seguir con la versión gratuita
        </Link>
      </div>
    </main>
  );
}
