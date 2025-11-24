"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Mic, MicOff, Volume2, VolumeX, Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import GlassCard from "@/components/ui/GlassCard";
import CocoricoMascot, { useMascotMood } from "@/components/CocoricoMascot";
import { sttTranscribe, ttsSpeak } from "@/services/voice";
import { AppBackground } from "@/components/layout/AppBackground";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  isVoice?: boolean;
};

type VoiceState = "idle" | "listening" | "processing" | "speaking";

interface VoiceChatClientProps {
  locale: string;
}

export default function VoiceChatClient({ locale }: VoiceChatClientProps) {
  const t = useTranslations();
  const [messages, setMessages] = useState<Message[]>([]);
  const [voiceState, setVoiceState] = useState<VoiceState>("idle");
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [currentTranscript, setCurrentTranscript] = useState("");
  const [audioLevel, setAudioLevel] = useState(0);
  
  const { mood, setMood } = useMascotMood("default");
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number>();

  // Auto-scroll to bottom cuando hay nuevos mensajes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Actualizar mood de mascota según estado
  useEffect(() => {
    switch (voiceState) {
      case "listening":
        setMood("thinking", 0);
        break;
      case "processing":
        setMood("chef", 0);
        break;
      case "speaking":
        setMood("happy", 0);
        break;
      default:
        setMood("default", 0);
    }
  }, [voiceState, setMood]);

  // Iniciar grabación de audio
  const startListening = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        await processAudio(audioBlob);
        
        // Detener stream
        stream.getTracks().forEach(track => track.stop());
      };

      // Analizar nivel de audio para visualización
      const audioContext = new AudioContext();
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      
      const updateAudioLevel = () => {
        analyser.getByteFrequencyData(dataArray);
        const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
        setAudioLevel(average / 255);
        
        if (voiceState === "listening") {
          animationFrameRef.current = requestAnimationFrame(updateAudioLevel);
        }
      };

      updateAudioLevel();

      mediaRecorder.start();
      setVoiceState("listening");
    } catch (error) {
      console.error("Error accessing microphone:", error);
      alert("No se pudo acceder al micrófono. Por favor, verifica los permisos.");
    }
  };

  // Detener grabación
  const stopListening = () => {
    if (mediaRecorderRef.current && voiceState === "listening") {
      mediaRecorderRef.current.stop();
      setVoiceState("processing");
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      setAudioLevel(0);
    }
  };

  // Procesar audio grabado
  const processAudio = async (audioBlob: Blob) => {
    try {
      // Transcribir con Whisper
      const transcript = await sttTranscribe(audioBlob, "openai");
      
      if (!transcript.trim()) {
        setVoiceState("idle");
        return;
      }

      // Agregar mensaje del usuario
      const userMessage: Message = {
        id: Date.now().toString(),
        role: "user",
        content: transcript,
        timestamp: new Date(),
        isVoice: true,
      };
      
      setMessages(prev => [...prev, userMessage]);

      // Obtener respuesta de IA
      await getAIResponse(transcript);
    } catch (error) {
      console.error("Error processing audio:", error);
      setVoiceState("idle");
    }
  };

  // Obtener respuesta de IA y reproducir con TTS
  const getAIResponse = async (userInput: string) => {
    try {
      // Llamar a API de chat (reutilizar endpoint existente)
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userInput,
          history: messages.slice(-5), // Últimos 5 mensajes para contexto
        }),
      });

      if (!response.ok) throw new Error("Error en respuesta de IA");

      const data = await response.json();
      const aiResponse = data.response || data.message || "Lo siento, no pude procesar tu solicitud.";

      // Agregar mensaje del asistente
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: aiResponse,
        timestamp: new Date(),
        isVoice: true,
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Reproducir respuesta con TTS si audio está habilitado
      if (isAudioEnabled) {
        setVoiceState("speaking");
        
        await ttsSpeak(aiResponse, {
          provider: "elevenlabs",
          onAudioStart: () => setVoiceState("speaking"),
          onAudioEnd: () => setVoiceState("idle"),
        });
      } else {
        setVoiceState("idle");
      }
    } catch (error) {
      console.error("Error getting AI response:", error);
      setVoiceState("idle");
    }
  };

  // Toggle de grabación
  const toggleVoiceRecording = () => {
    if (voiceState === "idle") {
      startListening();
    } else if (voiceState === "listening") {
      stopListening();
    }
  };

  // Renderizar visualizador de onda de audio
  const renderAudioWave = () => {
    if (voiceState !== "listening") return null;

    return (
      <div className="flex items-center justify-center gap-1 h-12">
        {[...Array(20)].map((_, i) => {
          const height = Math.sin((i / 20) * Math.PI * 2 + audioLevel * 10) * audioLevel * 40 + 10;
          return (
            <div
              key={i}
              className="w-1 bg-gradient-to-t from-cocorico-red to-amber-400 rounded-full transition-all duration-100"
              style={{ height: `${height}px` }}
            />
          );
        })}
      </div>
    );
  };

  return (
    <AppBackground variantOverride="home-premium">
      <div className="min-h-screen flex flex-col">
        {/* Header */}
        <div className="relative z-10 pt-20 pb-6 px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cocorico-red via-amber-500 to-cocorico-mango drop-shadow-2xl mb-3">
            🎙️ Chat de Voz con IA
          </h1>
          <p className="text-lg text-neutral-700 dark:text-neutral-300 font-semibold drop-shadow-md">
            Habla con Cocorico de forma natural
          </p>
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col lg:flex-row gap-6 px-4 pb-6 max-w-7xl mx-auto w-full">
          {/* Mascota - Visible en desktop */}
          <div className="hidden lg:flex lg:w-1/3 items-center justify-center">
            <GlassCard className="p-8 bg-white/60 dark:bg-neutral-900/60 backdrop-blur-xl border-2 border-white/80 dark:border-neutral-700/80 shadow-2xl">
              <CocoricoMascot 
                mood={mood} 
                size="xl" 
                animated 
                className={voiceState === "listening" ? "animate-pulse" : voiceState === "speaking" ? "animate-bounce" : ""}
              />
              <div className="mt-6 text-center">
                <p className="text-sm font-bold text-neutral-700 dark:text-neutral-300">
                  {voiceState === "idle" && "Listo para escucharte"}
                  {voiceState === "listening" && "Escuchando..."}
                  {voiceState === "processing" && "Procesando..."}
                  {voiceState === "speaking" && "Hablando..."}
                </p>
              </div>
            </GlassCard>
          </div>

          {/* Área de chat */}
          <div className="flex-1 flex flex-col">
            {/* Historial de mensajes */}
            <GlassCard className="flex-1 mb-4 p-4 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border-2 border-white/90 dark:border-neutral-700/90 shadow-2xl overflow-y-auto max-h-[50vh] lg:max-h-[60vh]">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center p-8">
                  <div className="text-6xl mb-4">🐓💬</div>
                  <h3 className="text-xl font-bold text-neutral-700 dark:text-neutral-300 mb-2">
                    Comienza una conversación
                  </h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 max-w-md">
                    Presiona el botón del micrófono y hazme cualquier pregunta sobre cocina, recetas o nutrición
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] p-4 rounded-2xl shadow-lg ${
                          message.role === "user"
                            ? "bg-cocorico-red text-white"
                            : "bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
                        }`}
                      >
                        <div className="flex items-start gap-2 mb-1">
                          <span className="text-lg">
                            {message.role === "user" ? "👤" : "🐓"}
                          </span>
                          <div className="flex-1">
                            <p className="font-semibold text-sm mb-1">
                              {message.role === "user" ? "Tú" : "Cocorico"}
                            </p>
                            <p className="text-sm leading-relaxed whitespace-pre-wrap">
                              {message.content}
                            </p>
                          </div>
                        </div>
                        <p className="text-xs opacity-70 text-right mt-2">
                          {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          {message.isVoice && " 🎤"}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </GlassCard>

            {/* Controles de voz */}
            <GlassCard className="p-6 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-xl border-2 border-white/90 dark:border-neutral-700/90 shadow-2xl">
              <div className="flex flex-col items-center gap-4">
                {/* Visualizador de audio */}
                {renderAudioWave()}

                {/* Botón principal de voz */}
                <Button
                  onClick={toggleVoiceRecording}
                  disabled={voiceState === "processing" || voiceState === "speaking"}
                  className={`w-20 h-20 rounded-full shadow-2xl transition-all duration-300 ${
                    voiceState === "listening"
                      ? "bg-cocorico-red hover:bg-red-600 scale-110 animate-pulse"
                      : voiceState === "processing" || voiceState === "speaking"
                      ? "bg-neutral-400 cursor-not-allowed"
                      : "bg-gradient-to-br from-cocorico-red to-amber-500 hover:scale-110 hover:shadow-3xl"
                  }`}
                  size="icon"
                >
                  {voiceState === "processing" ? (
                    <Loader2 className="w-10 h-10 animate-spin text-white" />
                  ) : voiceState === "listening" ? (
                    <MicOff className="w-10 h-10 text-white" />
                  ) : (
                    <Mic className="w-10 h-10 text-white" />
                  )}
                </Button>

                {/* Texto de estado */}
                <p className="text-sm font-bold text-neutral-700 dark:text-neutral-300">
                  {voiceState === "idle" && "Presiona para hablar"}
                  {voiceState === "listening" && "Presiona para detener"}
                  {voiceState === "processing" && "Procesando tu mensaje..."}
                  {voiceState === "speaking" && "Cocorico está respondiendo..."}
                </p>

                {/* Toggle de audio */}
                <Button
                  onClick={() => setIsAudioEnabled(!isAudioEnabled)}
                  variant="outline"
                  size="sm"
                  className="gap-2"
                >
                  {isAudioEnabled ? (
                    <>
                      <Volume2 className="w-4 h-4" />
                      Audio activado
                    </>
                  ) : (
                    <>
                      <VolumeX className="w-4 h-4" />
                      Audio desactivado
                    </>
                  )}
                </Button>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </AppBackground>
  );
}
