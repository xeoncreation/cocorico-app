import { supabaseServer } from "@/lib/supabase-client";
import { redirect } from "next/navigation";
import CocoricoAvatar from "@/components/CocoricoAvatar";


const DEV_EMAIL = process.env.DEV_EMAIL || "yo-90@outlook.com";


export default async function DevLabPage() {
  if (!supabaseServer) {
    redirect("/login");
  }

  const { data: { user } } = await supabaseServer.auth.getUser();
  if (!user) {
    redirect("/login");
  }
  if (user.email !== DEV_EMAIL) {
    return (
      <div className="max-w-xl mx-auto py-24 text-center">
        <h1 className="text-3xl font-bold mb-4">Acceso restringido</h1>
        <p className="text-neutral-600 dark:text-neutral-400 mb-6">Solo el desarrollador principal puede acceder al laboratorio.</p>
        <p className="text-sm text-neutral-400">Email detectado: {user.email}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-12 px-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-neutral-900 dark:text-white mb-2">
          🧰 Laboratorio de Desarrollo
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400">
          Acceso privado · {user.email}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. AI Chat */}
        <div className="bg-white dark:bg-neutral-900 p-6 rounded-xl shadow-lg border border-neutral-200 dark:border-neutral-700">
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">
            💬 Chat IA
          </h2>
          <div className="bg-neutral-50 dark:bg-neutral-800 p-4 rounded-lg border border-neutral-200 dark:border-neutral-700 h-64 overflow-y-auto">
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-2">
              Sistema de chat con OpenAI integrado
            </p>
            <div className="space-y-2 text-sm">
              <div className="bg-white dark:bg-neutral-700 p-2 rounded">
                → /api/chat
              </div>
              <div className="bg-white dark:bg-neutral-700 p-2 rounded">
                → Integrado con gamificación (+20 XP)
              </div>
              <div className="bg-white dark:bg-neutral-700 p-2 rounded">
                → Límites: 10 chats/mes (free)
              </div>
            </div>
          </div>
          <a
            href="/chat"
            className="block mt-4 text-center bg-gradient-to-r from-orange-500 to-red-600 text-white font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
          >
            Abrir Chat
          </a>
        </div>

        {/* 2. Voice Chat */}
        <div className="bg-white dark:bg-neutral-900 p-6 rounded-xl shadow-lg border border-neutral-200 dark:border-neutral-700">
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">
            🎙️ Chat de Voz
          </h2>
          <div className="bg-neutral-50 dark:bg-neutral-800 p-4 rounded-lg border border-neutral-200 dark:border-neutral-700 h-64 overflow-y-auto">
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-2">
              ElevenLabs TTS + Whisper STT
            </p>
            <div className="space-y-2 text-sm">
              <div className="bg-white dark:bg-neutral-700 p-2 rounded">
                → /api/voice/tts
              </div>
              <div className="bg-white dark:bg-neutral-700 p-2 rounded">
                → /api/voice/stt
              </div>
              <div className="bg-white dark:bg-neutral-700 p-2 rounded">
                → Cocorico Avatar animado al hablar
              </div>
            </div>
          </div>
          <button className="block w-full mt-4 text-center bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition-opacity">
            Prueba de Voz
          </button>
        </div>

        {/* 3. Smart Camera */}
        <div className="bg-white dark:bg-neutral-900 p-6 rounded-xl shadow-lg border border-neutral-200 dark:border-neutral-700">
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">
            📸 Detector por Cámara
          </h2>
          <div className="bg-neutral-50 dark:bg-neutral-800 p-4 rounded-lg border border-neutral-200 dark:border-neutral-700 h-64 overflow-y-auto">
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-2">
              LiveVision component con OpenAI Vision
            </p>
            <div className="space-y-2 text-sm">
              <div className="bg-white dark:bg-neutral-700 p-2 rounded">
                → SmartCamera component
              </div>
              <div className="bg-white dark:bg-neutral-700 p-2 rounded">
                → Análisis en tiempo real
              </div>
              <div className="bg-white dark:bg-neutral-700 p-2 rounded">
                → Detección de ingredientes
              </div>
            </div>
          </div>
          <a
            href="/scan"
            className="block mt-4 text-center bg-gradient-to-r from-green-500 to-teal-600 text-white font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
          >
            Abrir Escáner
          </a>
        </div>

        {/* 4. System Stats */}
        <div className="bg-white dark:bg-neutral-900 p-6 rounded-xl shadow-lg border border-neutral-200 dark:border-neutral-700">
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">
            📊 Estadísticas del Sistema
          </h2>
          <div className="bg-neutral-50 dark:bg-neutral-800 p-4 rounded-lg border border-neutral-200 dark:border-neutral-700 h-64 overflow-y-auto">
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-2">
              Auditoría completa del proyecto
            </p>
            <div className="space-y-2 text-sm">
              <div className="bg-white dark:bg-neutral-700 p-2 rounded">
                ✅ Block 51: Beta Invites
              </div>
              <div className="bg-white dark:bg-neutral-700 p-2 rounded">
                ✅ Block 52: Stripe Subscriptions
              </div>
              <div className="bg-white dark:bg-neutral-700 p-2 rounded">
                ✅ Block 53: Gamification
              </div>
              <div className="bg-white dark:bg-neutral-700 p-2 rounded">
                ✅ Block 54: Community Social
              </div>
            </div>
          </div>
          <a
            href="/dev/audit"
            className="block mt-4 text-center bg-gradient-to-r from-purple-500 to-pink-600 text-white font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
          >
            Ver Auditoría Completa
          </a>
        </div>
      </div>

      {/* Cocorico Avatar Demo */}
      <div className="mt-8 bg-gradient-to-br from-orange-50 to-red-50 dark:from-neutral-900 dark:to-neutral-800 p-6 rounded-xl shadow-lg border border-orange-200 dark:border-neutral-700">
        <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">
          🐓 Animación de Cocorico
        </h2>
        <p className="text-neutral-600 dark:text-neutral-400 mb-4">
          Avatar animado que aparece cuando el sistema está hablando (TTS activo)
        </p>
        <div className="bg-white dark:bg-neutral-900 p-4 rounded-lg border border-neutral-200 dark:border-neutral-700">
          <code className="text-sm text-neutral-700 dark:text-neutral-300">
            {'<CocoricoAvatar speaking={isSpeaking} />'}
          </code>
        </div>
      </div>

      {/* Demo of Cocorico Avatar (not speaking) */}
      <CocoricoAvatar speaking={false} />
    </div>
  );
}
