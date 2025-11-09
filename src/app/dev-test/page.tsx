"use client";

import { useState, useRef } from "react";
import AvatarCocorico from "@/components/AvatarCocorico";
import VoiceChat from "@/components/VoiceChat";
import { sttTranscribe, ttsSpeak } from "@/services/voice";

type VisemeItem = {
  start: number;
  end: number;
  viseme: string;
};

export default function DevTestPage() {
  const [activeTest, setActiveTest] = useState<string>("avatar");
  const [phonemes, setPhonemes] = useState<VisemeItem[]>([]);
  const [testResult, setTestResult] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const audioRef = useRef<HTMLInputElement>(null);

  // Test 1: Avatar con animación manual
  const testAvatarAnimation = () => {
    const mockPhonemes: VisemeItem[] = [
      { start: 0, end: 500, viseme: "A" },
      { start: 500, end: 1000, viseme: "E" },
      { start: 1000, end: 1500, viseme: "I" },
      { start: 1500, end: 2000, viseme: "O" },
      { start: 2000, end: 2500, viseme: "U" },
      { start: 2500, end: 3000, viseme: "FV" },
      { start: 3000, end: 3500, viseme: "M" },
    ];
    setPhonemes(mockPhonemes);
    setTestResult("✅ Animación iniciada (7 visemas en 3.5s)");
    
    setTimeout(() => {
      setPhonemes([]);
      setTestResult("✅ Animación completada");
    }, 3500);
  };

  // Test 2: TTS con ElevenLabs
  const testTTS = async () => {
    setLoading(true);
    setTestResult("🔄 Probando TTS...");
    try {
      const testPhonemes: VisemeItem[] = [];
      await ttsSpeak("Hola, soy Cocorico. Esta es una prueba de texto a voz.", {
        onPhonemes: (p) => {
          testPhonemes.push(...p);
          setPhonemes([...testPhonemes]);
        },
      });
      setTestResult(`✅ TTS exitoso (${testPhonemes.length} fonemas generados)`);
    } catch (err: any) {
      setTestResult(`❌ Error TTS: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Test 3: STT con archivo de audio
  const testSTT = async () => {
    if (!audioRef.current?.files?.[0]) {
      setTestResult("❌ Selecciona un archivo de audio primero");
      return;
    }

    setLoading(true);
    setTestResult("🔄 Transcribiendo audio...");
    try {
      const blob = audioRef.current.files[0];
  const text = await sttTranscribe(blob, "openai");
  setTestResult(`✅ STT exitoso: "${text}"`);
    } catch (err: any) {
      setTestResult(`❌ Error STT: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Test 4: Food-IQ API
  const testFoodIQ = async (foodName: string) => {
    setLoading(true);
    setTestResult(`🔄 Buscando "${foodName}" en Food-IQ...`);
    try {
      const res = await fetch(`/api/food-iq?name=${encodeURIComponent(foodName)}`);
      const data = await res.json();
      if (data.items?.length > 0) {
        const item = data.items[0];
        setTestResult(
          `✅ Encontrado: ${item.common_name}\n` +
          `Aliases: ${item.aliases?.join(", ") || "N/A"}\n` +
          `Shelf life (fresh): ${item.shelf_life_fresh || "N/A"}\n` +
          `Storage: ${item.storage_advice || "N/A"}`
        );
      } else {
        setTestResult(`⚠️ No se encontró "${foodName}" en la base de datos`);
      }
    } catch (err: any) {
      setTestResult(`❌ Error Food-IQ: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Test 5: Rate Limiting
  const testRateLimit = async () => {
    setLoading(true);
    setTestResult("🔄 Probando rate limiting (haremos 12 requests)...");
    let success = 0;
    let blocked = 0;

    for (let i = 0; i < 12; i++) {
      try {
        const res = await fetch("/api/stt", {
          method: "POST",
          body: new FormData(), // Empty, solo para probar rate limit
        });
        if (res.status === 429) {
          blocked++;
        } else {
          success++;
        }
      } catch {
        blocked++;
      }
      await new Promise((r) => setTimeout(r, 100)); // 100ms delay entre requests
    }

    setTestResult(
      `✅ Rate Limit Test:\n` +
      `- Exitosos: ${success}\n` +
      `- Bloqueados: ${blocked}\n` +
      `(Límite esperado: 10/día, deberías ver ~2 bloqueados)`
    );
    setLoading(false);
  };

  // Test 6: Check Environment Variables
  const checkEnvVars = () => {
    const vars = {
      "NEXT_PUBLIC_SUPABASE_URL": !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      "NEXT_PUBLIC_SUPABASE_ANON_KEY": !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      "NEXT_PUBLIC_ELEVENLABS_API_KEY": !!process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY,
      "NEXT_PUBLIC_REPLICATE_API_TOKEN": !!process.env.NEXT_PUBLIC_REPLICATE_API_TOKEN,
    };

    const results = Object.entries(vars)
      .map(([key, exists]) => `${exists ? "✅" : "❌"} ${key}`)
      .join("\n");

    setTestResult(`Variables de Entorno (cliente):\n${results}\n\n⚠️ Las vars del servidor no son visibles aquí`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-orange-600 mb-2">
            🧪 DEV Test Lab
          </h1>
          <p className="text-gray-600">
            Página de pruebas para desarrolladores - Solo visible en desarrollo
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {[
            { id: "avatar", label: "🎭 Avatar", emoji: "🐔" },
            { id: "tts", label: "🔊 TTS", emoji: "📢" },
            { id: "stt", label: "🎙️ STT", emoji: "🎤" },
            { id: "foodiq", label: "🍎 Food-IQ", emoji: "🥗" },
            { id: "ratelimit", label: "⏱️ Rate Limit", emoji: "🚦" },
            { id: "env", label: "🔐 Env Vars", emoji: "⚙️" },
            { id: "voicechat", label: "💬 Voice Chat", emoji: "🗣️" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTest(tab.id)}
              className={`px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                activeTest === tab.id
                  ? "bg-orange-500 text-white shadow-lg scale-105"
                  : "bg-white text-gray-700 hover:bg-orange-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column: Test Controls */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              {activeTest === "avatar" && "🎭 Avatar Animation Test"}
              {activeTest === "tts" && "🔊 Text-to-Speech Test"}
              {activeTest === "stt" && "🎙️ Speech-to-Text Test"}
              {activeTest === "foodiq" && "🍎 Food-IQ Database Test"}
              {activeTest === "ratelimit" && "⏱️ Rate Limiting Test"}
              {activeTest === "env" && "🔐 Environment Variables"}
              {activeTest === "voicechat" && "💬 Voice Chat Full Integration"}
            </h2>

            {/* Avatar Test */}
            {activeTest === "avatar" && (
              <div className="space-y-4">
                <p className="text-gray-600">
                  Prueba la animación del avatar con diferentes visemas.
                </p>
                <button
                  onClick={testAvatarAnimation}
                  className="w-full bg-orange-500 text-white py-3 rounded-lg font-medium hover:bg-orange-600 transition"
                >
                  Iniciar Animación de Prueba
                </button>
                <div className="grid grid-cols-4 gap-2">
                  {["A", "E", "I", "O", "U", "FV", "M", "idle"].map((v) => (
                    <button
                      key={v}
                      onClick={() => setPhonemes([{ start: 0, end: 1000, viseme: v }])}
                      className="bg-gray-100 py-2 rounded hover:bg-gray-200 transition text-sm"
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* TTS Test */}
            {activeTest === "tts" && (
              <div className="space-y-4">
                <p className="text-gray-600">
                  Prueba el sistema de Text-to-Speech con ElevenLabs o fallback a browser.
                </p>
                <button
                  onClick={testTTS}
                  disabled={loading}
                  className="w-full bg-orange-500 text-white py-3 rounded-lg font-medium hover:bg-orange-600 transition disabled:opacity-50"
                >
                  {loading ? "⏳ Generando voz..." : "🔊 Probar TTS"}
                </button>
                <div className="text-sm text-gray-500 bg-yellow-50 p-3 rounded">
                  ⚠️ Requiere <code>ELEVENLABS_API_KEY</code> en .env.local. Si no está, usará browser fallback.
                </div>
              </div>
            )}

            {/* STT Test */}
            {activeTest === "stt" && (
              <div className="space-y-4">
                <p className="text-gray-600">
                  Prueba el sistema de Speech-to-Text con OpenAI Whisper.
                </p>
                <input
                  ref={audioRef}
                  type="file"
                  accept="audio/*"
                  aria-label="Selecciona un archivo de audio para transcribir"
                  className="w-full border border-gray-300 rounded-lg p-2"
                />
                <button
                  onClick={testSTT}
                  disabled={loading}
                  className="w-full bg-orange-500 text-white py-3 rounded-lg font-medium hover:bg-orange-600 transition disabled:opacity-50"
                >
                  {loading ? "⏳ Transcribiendo..." : "🎙️ Transcribir Audio"}
                </button>
                <div className="text-sm text-gray-500 bg-yellow-50 p-3 rounded">
                  ⚠️ Requiere <code>OPENAI_API_KEY</code> en .env.local
                </div>
              </div>
            )}

            {/* Food-IQ Test */}
            {activeTest === "foodiq" && (
              <div className="space-y-4">
                <p className="text-gray-600">
                  Consulta la base de datos Food-IQ con 15 alimentos.
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {["banana", "tomate", "aguacate", "manzana", "lechuga", "fresa", "pera", "piña", "mango"].map(
                    (food) => (
                      <button
                        key={food}
                        onClick={() => testFoodIQ(food)}
                        disabled={loading}
                        className="bg-green-100 text-green-800 py-2 rounded hover:bg-green-200 transition text-sm disabled:opacity-50"
                      >
                        {food}
                      </button>
                    )
                  )}
                </div>
                <div className="text-sm text-gray-500 bg-yellow-50 p-3 rounded">
                  ⚠️ Requiere ejecutar <code>supabase/sql/food-iq-setup.sql</code> en Supabase Dashboard
                </div>
              </div>
            )}

            {/* Rate Limit Test */}
            {activeTest === "ratelimit" && (
              <div className="space-y-4">
                <p className="text-gray-600">
                  Prueba el sistema de rate limiting (10 requests/día para usuarios free).
                </p>
                <button
                  onClick={testRateLimit}
                  disabled={loading}
                  className="w-full bg-orange-500 text-white py-3 rounded-lg font-medium hover:bg-orange-600 transition disabled:opacity-50"
                >
                  {loading ? "⏳ Probando..." : "🚦 Probar Rate Limiting"}
                </button>
                <div className="text-sm text-gray-500 bg-yellow-50 p-3 rounded">
                  ℹ️ El límite se resetea cada deploy. En producción, migrar a Redis/Supabase.
                </div>
              </div>
            )}

            {/* Env Vars Check */}
            {activeTest === "env" && (
              <div className="space-y-4">
                <p className="text-gray-600">
                  Verifica qué variables de entorno están configuradas (solo lado cliente visible).
                </p>
                <button
                  onClick={checkEnvVars}
                  className="w-full bg-orange-500 text-white py-3 rounded-lg font-medium hover:bg-orange-600 transition"
                >
                  🔐 Verificar Variables
                </button>
                <div className="text-sm text-gray-500 bg-blue-50 p-3 rounded">
                  ℹ️ Las variables del servidor (sin NEXT_PUBLIC_) no son visibles aquí por seguridad.
                </div>
              </div>
            )}

            {/* Voice Chat Integration */}
            {activeTest === "voicechat" && (
              <div className="space-y-4">
                <p className="text-gray-600">
                  Componente completo de Voice Chat con grabación, transcripción, chat y TTS.
                </p>
                <div className="text-sm text-gray-500 bg-green-50 p-3 rounded">
                  ℹ️ Este es el componente que se usa en <code>/chat</code> (pestaña Voz). Prueba completa del flujo.
                </div>
              </div>
            )}

            {/* Results Display */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg min-h-[120px]">
              <h3 className="font-bold text-gray-700 mb-2">📊 Resultado:</h3>
              <pre className="text-sm whitespace-pre-wrap text-gray-800">
                {testResult || "Ejecuta una prueba para ver resultados..."}
              </pre>
            </div>
          </div>

          {/* Right Column: Visual Display */}
          <div className="bg-white rounded-2xl shadow-xl p-6 flex flex-col items-center justify-center">
            {activeTest === "voicechat" ? (
              <VoiceChat />
            ) : (
              <>
                <h3 className="text-lg font-bold text-gray-700 mb-4">
                  {activeTest === "avatar" && "Vista del Avatar"}
                  {activeTest === "tts" && "Avatar con TTS"}
                  {activeTest === "stt" && "Avatar (sin animación en STT)"}
                  {activeTest === "foodiq" && "Información Visual"}
                  {activeTest === "ratelimit" && "Gráfico de Requests"}
                  {activeTest === "env" && "Estado de Configuración"}
                </h3>
                
                {/* Avatar Display */}
                {(activeTest === "avatar" || activeTest === "tts") && (
                  <div className="relative">
                    <AvatarCocorico phonemes={phonemes} small={false} overlay={false} />
                    <div className="mt-4 text-center text-sm text-gray-500">
                      {phonemes.length > 0
                        ? `🎬 Animando (${phonemes.length} fonemas)`
                        : "🐔 En reposo (idle)"}
                    </div>
                  </div>
                )}

                {activeTest === "stt" && (
                  <div className="text-center">
                    <AvatarCocorico phonemes={[]} small={false} overlay={false} />
                    <p className="mt-4 text-gray-500">
                      El avatar permanece en idle durante STT
                    </p>
                  </div>
                )}

                {activeTest === "foodiq" && (
                  <div className="text-center text-6xl">
                    🍎🍌🥑🍅🥬🍓🍐🍍
                  </div>
                )}

                {activeTest === "ratelimit" && (
                  <div className="w-full space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-full bg-gray-200 rounded-full h-4">
                        <div className="bg-green-500 h-4 rounded-full w-[83%]"></div>
                      </div>
                      <span className="text-sm">10/12</span>
                    </div>
                    <p className="text-sm text-gray-500 text-center">
                      Límite: 10 requests permitidos
                    </p>
                  </div>
                )}

                {activeTest === "env" && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-green-50 rounded">
                      <div className="text-3xl mb-2">✅</div>
                      <div className="text-sm">Configuradas</div>
                    </div>
                    <div className="text-center p-4 bg-red-50 rounded">
                      <div className="text-3xl mb-2">❌</div>
                      <div className="text-sm">Faltantes</div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-8 bg-white rounded-2xl shadow-xl p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">🔗 Enlaces Directos</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <a
              href="/chat"
              target="_blank"
              className="bg-blue-50 hover:bg-blue-100 p-4 rounded-lg text-center transition"
            >
              <div className="text-2xl mb-1">💬</div>
              <div className="font-medium">Chat (Texto/Voz)</div>
            </a>
            <a
              href="/dashboard/lab"
              target="_blank"
              className="bg-purple-50 hover:bg-purple-100 p-4 rounded-lg text-center transition"
            >
              <div className="text-2xl mb-1">🧪</div>
              <div className="font-medium">Lab IA</div>
            </a>
            <a
              href="/api/food-iq?name=banana"
              target="_blank"
              className="bg-green-50 hover:bg-green-100 p-4 rounded-lg text-center transition"
            >
              <div className="text-2xl mb-1">🍎</div>
              <div className="font-medium">API Food-IQ</div>
            </a>
            <a
              href="/dev-test"
              className="bg-orange-50 hover:bg-orange-100 p-4 rounded-lg text-center transition"
            >
              <div className="text-2xl mb-1">🧪</div>
              <div className="font-medium">Esta Página</div>
            </a>
          </div>
        </div>

        {/* Documentation */}
        <div className="mt-8 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-2xl shadow-xl p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">📚 Documentación</h2>
          <ul className="space-y-2 text-gray-700">
            <li>
              <strong>VOICE-VISION-FOODIQ-README.md:</strong> Guía completa de implementación
            </li>
            <li>
              <strong>RESUMEN-IMPLEMENTACION.md:</strong> Resumen ejecutivo con métricas
            </li>
            <li>
              <strong>supabase/sql/food-iq-setup.sql:</strong> Script de base de datos (ejecutar en Supabase)
            </li>
            <li>
              <strong>.env.local:</strong> Configurar OPENAI_API_KEY, ELEVENLABS_API_KEY, Supabase vars
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
