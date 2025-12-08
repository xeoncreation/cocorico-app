"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import {
  Mic,
  MicOff,
  Send,
  Volume2,
  VolumeX,
  Sparkles,
  MessageSquare,
  Loader2,
  MoreVertical,
  Trash2,
  Copy,
  Download,
} from "lucide-react";
import {
  LiquidGlassCard,
  LiquidGlassButton,
  LiquidGlassInput,
  LiquidGlassContainer,
  LiquidGlassToggle,
  LiquidGlassAvatar,
  LiquidGlassBadge,
} from "@/components/ui/LiquidGlass";
import CocoricoMascot, { useMascotMood } from "@/components/CocoricoMascot";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

// ============================================================================
// TYPES
// ============================================================================

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  type: "text" | "voice";
  audioUrl?: string;
};

type ChatMode = "text" | "voice";
type VoiceState = "idle" | "listening" | "processing" | "speaking";

interface UnifiedChatInterfaceProps {
  locale: string;
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function UnifiedChatInterface({
  locale,
}: UnifiedChatInterfaceProps) {
  const t = useTranslations();

  // State
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [chatMode, setChatMode] = useState<ChatMode>("text");
  const [voiceState, setVoiceState] = useState<VoiceState>("idle");
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [audioLevel, setAudioLevel] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Mascot
  const { mood, setMood } = useMascotMood("default");

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Update mascot mood based on state
  useEffect(() => {
    if (voiceState === "listening") setMood("thinking", 0);
    else if (voiceState === "processing") setMood("chef", 0);
    else if (voiceState === "speaking") setMood("happy", 0);
    else if (isLoading) setMood("cooking", 0);
    else setMood("default", 0);
  }, [voiceState, isLoading, setMood]);

  // ============================================================================
  // TEXT CHAT FUNCTIONS
  // ============================================================================

  const sendTextMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue,
      timestamp: new Date(),
      type: "text",
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      // Llamar a tu API de chat
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: inputValue,
          history: messages.slice(-10), // Últimos 10 mensajes para contexto
        }),
      });

      const data = await response.json();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.response || "Lo siento, no pude procesar tu mensaje.",
        timestamp: new Date(),
        type: "text",
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // Reproducir audio si está habilitado
      if (isAudioEnabled && data.audioUrl) {
        playAudio(data.audioUrl);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Lo siento, ocurrió un error. Intenta nuevamente.",
        timestamp: new Date(),
        type: "text",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendTextMessage();
    }
  };

  // ============================================================================
  // VOICE CHAT FUNCTIONS
  // ============================================================================

  const startVoiceRecording = async () => {
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
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });
        await processVoiceInput(audioBlob);
        stream.getTracks().forEach((track) => track.stop());
      };

      // Audio level visualization
      const audioContext = new AudioContext();
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const updateLevel = () => {
        if (voiceState === "listening") {
          analyser.getByteFrequencyData(dataArray);
          const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
          setAudioLevel(average / 255);
          requestAnimationFrame(updateLevel);
        }
      };

      mediaRecorder.start();
      setVoiceState("listening");
      updateLevel();
    } catch (error) {
      console.error("Error accessing microphone:", error);
      alert("No se pudo acceder al micrófono. Por favor, verifica los permisos.");
    }
  };

  const stopVoiceRecording = () => {
    if (mediaRecorderRef.current && voiceState === "listening") {
      mediaRecorderRef.current.stop();
      setVoiceState("processing");
      setAudioLevel(0);
    }
  };

  const processVoiceInput = async (audioBlob: Blob) => {
    try {
      // Transcribir audio
      const formData = new FormData();
      formData.append("audio", audioBlob);

      const transcriptResponse = await fetch("/api/voice/transcribe", {
        method: "POST",
        body: formData,
      });

      const { text } = await transcriptResponse.json();

      if (!text) {
        setVoiceState("idle");
        return;
      }

      // Agregar mensaje del usuario
      const userMessage: Message = {
        id: Date.now().toString(),
        role: "user",
        content: text,
        timestamp: new Date(),
        type: "voice",
      };

      setMessages((prev) => [...prev, userMessage]);

      // Obtener respuesta del asistente
      const chatResponse = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history: messages.slice(-10),
          voiceMode: true,
        }),
      });

      const data = await chatResponse.json();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.response,
        timestamp: new Date(),
        type: "voice",
        audioUrl: data.audioUrl,
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // Reproducir respuesta de audio
      if (isAudioEnabled && data.audioUrl) {
        setVoiceState("speaking");
        await playAudio(data.audioUrl);
      }

      setVoiceState("idle");
    } catch (error) {
      console.error("Error processing voice:", error);
      setVoiceState("idle");
    }
  };

  const playAudio = async (url: string): Promise<void> => {
    return new Promise((resolve) => {
      const audio = new Audio(url);
      audio.onended = () => resolve();
      audio.play();
    });
  };

  // ============================================================================
  // MESSAGE ACTIONS
  // ============================================================================

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  const deleteMessage = (id: string) => {
    setMessages((prev) => prev.filter((msg) => msg.id !== id));
  };

  const clearChat = () => {
    setMessages([]);
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <LiquidGlassContainer fullscreen>
      <div className="max-w-6xl mx-auto h-screen flex flex-col p-4 gap-4">
        {/* HEADER */}
        <LiquidGlassCard variant="ios" blur="xl" className="p-4">
          <div className="flex items-center justify-between">
            {/* Logo & Title */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <CocoricoMascot mood={mood} size="sm" animated />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  Cocorico Chat
                </h1>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {chatMode === "voice"
                    ? "Modo voz activado"
                    : "Chat de texto"}
                </p>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2">
              {/* Voice/Text Toggle */}
              <LiquidGlassToggle
                checked={chatMode === "voice"}
                onChange={(checked) => setChatMode(checked ? "voice" : "text")}
                icon={<MessageSquare className="w-5 h-5" />}
                activeIcon={<Mic className="w-5 h-5" />}
              />

              {/* Audio Enable/Disable */}
              <LiquidGlassButton
                variant="ghost"
                size="sm"
                onClick={() => setIsAudioEnabled(!isAudioEnabled)}
              >
                {isAudioEnabled ? (
                  <Volume2 className="w-5 h-5" />
                ) : (
                  <VolumeX className="w-5 h-5" />
                )}
              </LiquidGlassButton>

              {/* Clear Chat */}
              <LiquidGlassButton
                variant="ghost"
                size="sm"
                onClick={clearChat}
              >
                <Trash2 className="w-5 h-5" />
              </LiquidGlassButton>
            </div>
          </div>
        </LiquidGlassCard>

        {/* MESSAGES */}
        <LiquidGlassCard
          variant="ios"
          blur="2xl"
          className="flex-1 overflow-hidden flex flex-col"
        >
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            <AnimatePresence initial={false}>
              {messages.map((message) => (
                <MessageBubble
                  key={message.id}
                  message={message}
                  onCopy={copyMessage}
                  onDelete={deleteMessage}
                />
              ))}
            </AnimatePresence>

            {/* Loading indicator */}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2 text-gray-600 dark:text-gray-400"
              >
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Cocorico está pensando...</span>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </LiquidGlassCard>

        {/* INPUT AREA */}
        <LiquidGlassCard variant="ios" blur="xl" className="p-4">
          {chatMode === "text" ? (
            <TextInputArea
              value={inputValue}
              onChange={setInputValue}
              onSend={sendTextMessage}
              onKeyDown={handleKeyDown}
              isLoading={isLoading}
              textareaRef={textareaRef}
            />
          ) : (
            <VoiceInputArea
              voiceState={voiceState}
              audioLevel={audioLevel}
              onStartRecording={startVoiceRecording}
              onStopRecording={stopVoiceRecording}
            />
          )}
        </LiquidGlassCard>
      </div>
    </LiquidGlassContainer>
  );
}

// ============================================================================
// MESSAGE BUBBLE COMPONENT
// ============================================================================

interface MessageBubbleProps {
  message: Message;
  onCopy: (content: string) => void;
  onDelete: (id: string) => void;
}

const MessageBubble = ({ message, onCopy, onDelete }: MessageBubbleProps) => {
  const [showActions, setShowActions] = useState(false);
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      className={cn("flex gap-3", isUser && "flex-row-reverse")}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Avatar */}
      <LiquidGlassAvatar
        alt={isUser ? "User" : "Cocorico"}
        isPremium={!isUser}
        size="md"
      />

      {/* Content */}
      <div className={cn("flex-1 max-w-2xl", isUser && "flex flex-col items-end")}>
        <motion.div
          className={cn(
            "px-4 py-3 rounded-2xl backdrop-blur-lg",
            isUser
              ? "bg-blue-500/20 border border-blue-500/30 text-gray-900 dark:text-white"
              : "bg-white/20 dark:bg-black/20 border border-white/20 text-gray-900 dark:text-white"
          )}
        >
          <p className="text-sm whitespace-pre-wrap">{message.content}</p>

          {/* Voice indicator */}
          {message.type === "voice" && (
            <LiquidGlassBadge variant="primary" size="sm" className="mt-2">
              <Mic className="w-3 h-3 mr-1" />
              Voice message
            </LiquidGlassBadge>
          )}
        </motion.div>

        {/* Timestamp & Actions */}
        <div className="flex items-center gap-2 mt-1 px-2">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {message.timestamp.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>

          <AnimatePresence>
            {showActions && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex gap-1"
              >
                <button
                  onClick={() => onCopy(message.content)}
                  className="p-1 rounded-lg hover:bg-white/10 dark:hover:bg-black/10 transition-colors"
                >
                  <Copy className="w-3 h-3 text-gray-500 dark:text-gray-400" />
                </button>
                <button
                  onClick={() => onDelete(message.id)}
                  className="p-1 rounded-lg hover:bg-red-500/10 transition-colors"
                >
                  <Trash2 className="w-3 h-3 text-red-500" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

// ============================================================================
// TEXT INPUT AREA
// ============================================================================

interface TextInputAreaProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  isLoading: boolean;
  textareaRef: React.RefObject<HTMLTextAreaElement>;
}

const TextInputArea = ({
  value,
  onChange,
  onSend,
  onKeyDown,
  isLoading,
  textareaRef,
}: TextInputAreaProps) => {
  return (
    <div className="flex items-end gap-3">
      <div className="flex-1">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Escribe un mensaje... (Shift + Enter para nueva línea)"
          className={cn(
            "w-full px-4 py-3 rounded-2xl resize-none",
            "bg-white/10 dark:bg-black/10 backdrop-blur-lg",
            "border border-white/20 dark:border-white/10",
            "text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400",
            "focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent",
            "transition-all duration-200",
            "max-h-32"
          )}
          rows={1}
          style={{ minHeight: "48px" }}
        />
      </div>

      <LiquidGlassButton
        variant="primary"
        size="lg"
        onClick={onSend}
        disabled={!value.trim() || isLoading}
        className="flex-shrink-0"
      >
        {isLoading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <Send className="w-5 h-5" />
        )}
      </LiquidGlassButton>
    </div>
  );
};

// ============================================================================
// VOICE INPUT AREA
// ============================================================================

interface VoiceInputAreaProps {
  voiceState: VoiceState;
  audioLevel: number;
  onStartRecording: () => void;
  onStopRecording: () => void;
}

const VoiceInputArea = ({
  voiceState,
  audioLevel,
  onStartRecording,
  onStopRecording,
}: VoiceInputAreaProps) => {
  const isRecording = voiceState === "listening";

  return (
    <div className="flex flex-col items-center gap-4 py-4">
      {/* Audio level visualizer */}
      <AnimatePresence>
        {isRecording && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex gap-1 h-12 items-end"
          >
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  height: `${20 + audioLevel * 80 * Math.random()}%`,
                }}
                transition={{
                  duration: 0.1,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
                className="w-2 bg-gradient-to-t from-blue-500 to-purple-500 rounded-full"
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Record button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={isRecording ? onStopRecording : onStartRecording}
        disabled={voiceState === "processing" || voiceState === "speaking"}
        className={cn(
          "w-20 h-20 rounded-full backdrop-blur-lg border-2 transition-all duration-300",
          "flex items-center justify-center",
          isRecording
            ? "bg-red-500/20 border-red-500/50 animate-pulse"
            : "bg-blue-500/20 border-blue-500/50 hover:bg-blue-500/30"
        )}
      >
        {voiceState === "processing" || voiceState === "speaking" ? (
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        ) : isRecording ? (
          <MicOff className="w-8 h-8 text-red-500" />
        ) : (
          <Mic className="w-8 h-8 text-blue-500" />
        )}
      </motion.button>

      {/* Status text */}
      <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
        {voiceState === "listening" && "Escuchando... Toca para detener"}
        {voiceState === "processing" && "Procesando tu mensaje..."}
        {voiceState === "speaking" && "Cocorico está hablando..."}
        {voiceState === "idle" && "Toca el micrófono para hablar"}
      </p>
    </div>
  );
};
