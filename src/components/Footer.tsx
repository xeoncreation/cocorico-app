"use client";
import Link from "next/link";

export default function Footer() {
  const hasElevenLabs = !!process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY;
  const hasReplicate = !!process.env.NEXT_PUBLIC_REPLICATE_API_TOKEN;
  const voiceStatus = hasElevenLabs ? "ON" : "Partial";
  const visionStatus = hasReplicate ? "ON" : "Partial";

  return (
    <footer className="border-t-2 border-neutral-400 dark:border-neutral-600 bg-white dark:bg-black py-8 px-6 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-6">
          {/* Columna 1: Logo y descripción */}
          <div>
            <h3 className="font-display text-2xl font-extrabold text-cocorico-red dark:text-amber-400 mb-2">Cocorico</h3>
            <p className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
              Tu asistente culinario inteligente con IA. Recetas, voz, visión y comunidad.
            </p>
          </div>

          {/* Columna 2: Enlaces rápidos */}
          <div>
            <h4 className="font-extrabold mb-3 text-base text-cocorico-brown dark:text-amber-300">Explorar</h4>
            <ul className="space-y-2 text-sm font-bold">
              <li><Link href="/chat-unificado" className="text-neutral-900 dark:text-neutral-100 hover:text-cocorico-red dark:hover:text-amber-400 transition underline-offset-4 hover:underline">Chat</Link></li>
              <li><Link href="/analisis" className="text-neutral-900 dark:text-neutral-100 hover:text-cocorico-red dark:hover:text-amber-400 transition underline-offset-4 hover:underline">Análisis</Link></li>
              <li><Link href="/mis-recetas" className="text-neutral-900 dark:text-neutral-100 hover:text-cocorico-red dark:hover:text-amber-400 transition underline-offset-4 hover:underline">Mis Recetas</Link></li>
              <li><Link href="/comunidad" className="text-neutral-900 dark:text-neutral-100 hover:text-cocorico-red dark:hover:text-amber-400 transition underline-offset-4 hover:underline">Comunidad</Link></li>
            </ul>
          </div>

          {/* Columna 3: Cuenta */}
          <div>
            <h4 className="font-extrabold mb-3 text-base text-cocorico-brown dark:text-amber-300">Cuenta</h4>
            <ul className="space-y-2 text-sm font-bold">
              <li><Link href="/dashboard" className="text-neutral-900 dark:text-neutral-100 hover:text-cocorico-red dark:hover:text-amber-400 transition underline-offset-4 hover:underline">Dashboard</Link></li>
              <li><Link href="/dashboard/achievements" className="text-neutral-900 dark:text-neutral-100 hover:text-cocorico-red dark:hover:text-amber-400 transition underline-offset-4 hover:underline">Logros</Link></li>
              <li><Link href="/dashboard/challenges" className="text-neutral-900 dark:text-neutral-100 hover:text-cocorico-red dark:hover:text-amber-400 transition underline-offset-4 hover:underline">Retos</Link></li>
              <li><Link href="/pricing" className="text-neutral-900 dark:text-neutral-100 hover:text-cocorico-red dark:hover:text-amber-400 transition underline-offset-4 hover:underline">Premium</Link></li>
            </ul>
          </div>

          {/* Columna 4: Legal */}
          <div>
            <h4 className="font-extrabold mb-3 text-base text-cocorico-brown dark:text-amber-300">Legal</h4>
            <ul className="space-y-2 text-sm font-bold">
              <li><Link href="/legal/privacy" className="text-neutral-900 dark:text-neutral-100 hover:text-cocorico-red dark:hover:text-amber-400 transition underline-offset-4 hover:underline">Privacidad</Link></li>
              <li><Link href="/legal/terms" className="text-neutral-900 dark:text-neutral-100 hover:text-cocorico-red dark:hover:text-amber-400 transition underline-offset-4 hover:underline">Términos</Link></li>
              <li><Link href="/legal/cookies" className="text-neutral-900 dark:text-neutral-100 hover:text-cocorico-red dark:hover:text-amber-400 transition underline-offset-4 hover:underline">Cookies</Link></li>
            </ul>
          </div>
        </div>

        {/* Línea separadora */}
        <div className="border-t-2 border-neutral-400 dark:border-neutral-600 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Copyright */}
            <p className="text-sm font-extrabold text-neutral-900 dark:text-neutral-100">
              © {new Date().getFullYear()} Cocorico. Todos los derechos reservados.
            </p>

            {/* Build tag */}
            <div className="flex items-center gap-3 text-sm font-mono font-extrabold">
              <span className="px-3 py-1.5 bg-neutral-300 dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 rounded-md">v0.1.0</span>
              <span className={`px-3 py-1.5 rounded-md ${voiceStatus === "ON" ? "bg-green-200 text-green-900 dark:bg-green-800 dark:text-green-100" : "bg-amber-200 text-amber-900 dark:bg-amber-700 dark:text-amber-100"}`}>
                Voice: {voiceStatus}
              </span>
              <span className={`px-3 py-1.5 rounded-md ${visionStatus === "ON" ? "bg-green-200 text-green-900 dark:bg-green-800 dark:text-green-100" : "bg-amber-200 text-amber-900 dark:bg-amber-700 dark:text-amber-100"}`}>
                Vision: {visionStatus}
              </span>
              <span className="px-3 py-1.5 bg-amber-200 text-amber-900 dark:bg-amber-700 dark:text-amber-100 rounded-md">
                Food-IQ: ON
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
