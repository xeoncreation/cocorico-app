"use client";
import Link from "next/link";

export default function Footer() {
  const hasElevenLabs = !!process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY;
  const hasReplicate = !!process.env.NEXT_PUBLIC_REPLICATE_API_TOKEN;
  const voiceStatus = hasElevenLabs ? "ON" : "Partial";
  const visionStatus = hasReplicate ? "ON" : "Partial";

  return (
    <footer className="border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 py-8 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-6">
          {/* Columna 1: Logo y descripción */}
          <div>
            <h3 className="font-display text-2xl text-cocorico-red dark:text-amber-300 mb-2">Cocorico</h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Tu asistente culinario inteligente con IA. Recetas, voz, visión y comunidad.
            </p>
          </div>

          {/* Columna 2: Enlaces rápidos */}
          <div>
            <h4 className="font-semibold mb-3 text-cocorico-brown dark:text-neutral-200">Explorar</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/chat" className="text-neutral-600 dark:text-neutral-400 hover:text-cocorico-red">Chat</Link></li>
              <li><Link href="/dashboard/lab" className="text-neutral-600 dark:text-neutral-400 hover:text-cocorico-red">Lab IA</Link></li>
              <li><Link href="/recipes" className="text-neutral-600 dark:text-neutral-400 hover:text-cocorico-red">Recetas</Link></li>
              <li><Link href="/community" className="text-neutral-600 dark:text-neutral-400 hover:text-cocorico-red">Comunidad</Link></li>
            </ul>
          </div>

          {/* Columna 3: Cuenta */}
          <div>
            <h4 className="font-semibold mb-3 text-cocorico-brown dark:text-neutral-200">Cuenta</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/dashboard" className="text-neutral-600 dark:text-neutral-400 hover:text-cocorico-red">Dashboard</Link></li>
              <li><Link href="/dashboard/achievements" className="text-neutral-600 dark:text-neutral-400 hover:text-cocorico-red">Logros</Link></li>
              <li><Link href="/dashboard/challenges" className="text-neutral-600 dark:text-neutral-400 hover:text-cocorico-red">Retos</Link></li>
              <li><Link href="/pricing" className="text-neutral-600 dark:text-neutral-400 hover:text-cocorico-red">Premium</Link></li>
            </ul>
          </div>

          {/* Columna 4: Legal */}
          <div>
            <h4 className="font-semibold mb-3 text-cocorico-brown dark:text-neutral-200">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/legal/privacy" className="text-neutral-600 dark:text-neutral-400 hover:text-cocorico-red">Privacidad</Link></li>
              <li><Link href="/legal/terms" className="text-neutral-600 dark:text-neutral-400 hover:text-cocorico-red">Términos</Link></li>
              <li><Link href="/legal/cookies" className="text-neutral-600 dark:text-neutral-400 hover:text-cocorico-red">Cookies</Link></li>
            </ul>
          </div>
        </div>

        {/* Línea separadora */}
        <div className="border-t border-neutral-200 dark:border-neutral-700 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Copyright */}
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              © {new Date().getFullYear()} Cocorico. Todos los derechos reservados.
            </p>

            {/* Build tag */}
            <div className="flex items-center gap-3 text-xs font-mono text-neutral-400 dark:text-neutral-500">
              <span className="px-2 py-1 bg-neutral-100 dark:bg-neutral-800 rounded">v0.1.0</span>
              <span className={`px-2 py-1 rounded ${voiceStatus === "ON" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"}`}>
                Voice: {voiceStatus}
              </span>
              <span className={`px-2 py-1 rounded ${visionStatus === "ON" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"}`}>
                Vision: {visionStatus}
              </span>
              <span className="px-2 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded">
                Food-IQ: ON
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
