"use client";

import { useState } from "react";
import { MessageCircle, Mic, Search, Sparkles } from "lucide-react";
import { ToolSelector, Tool, ToolLayout } from "@/components/ui/tool-selector";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import Wallpaper from "@/components/layout/Wallpaper";

const CHAT_TOOLS: Tool[] = [
  {
    id: "text-chat",
    icon: <MessageCircle />,
    label: "Chat de texto",
    description: "Conversa con Cocorico",
  },
  {
    id: "voice-chat",
    icon: <Mic />,
    label: "Chat de voz",
    description: "Habla con Cocorico",
  },
  {
    id: "search",
    icon: <Search />,
    label: "Buscar recetas",
    description: "Encuentra ideas",
  },
  {
    id: "generate",
    icon: <Sparkles />,
    label: "Generar receta",
    description: "Crea algo nuevo",
  },
];

export default function ChatPage() {
  const t = useTranslations();
  const [selectedTool, setSelectedTool] = useState("text-chat");

  return (
    <>
      <Wallpaper
        imageLight="/branding/CHAT_MODO_CLARO.png"
        imageDark="/branding/CHAT_MODO_OSCURO.png"
      />
      <ToolLayout
        title={`¡Hola! Soy Cocorico 🐓`}
        subtitle="Tu asistente culinario con inteligencia artificial. Pregúntame lo que quieras sobre cocina."
      >
        {/* Tool Selector */}
        <div className="max-w-4xl mx-auto mb-8">
          <ToolSelector
            tools={CHAT_TOOLS}
            selectedTool={selectedTool}
            onToolChange={setSelectedTool}
            layout="grid"
          />
        </div>

        {/* Content Area */}
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedTool}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {selectedTool === "text-chat" && <TextChatView />}
              {selectedTool === "voice-chat" && <VoiceChatView />}
              {selectedTool === "search" && <SearchView />}
              {selectedTool === "generate" && <GenerateView />}
            </motion.div>
          </AnimatePresence>
        </div>
      </ToolLayout>
    </>
  );
}

function TextChatView() {
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, { role: "user", content: input }]);
    setInput("");
    // TODO: Conectar con API de chat
  };

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 min-h-[500px] flex flex-col">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto mb-4 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center text-white/40">
              <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Escribe un mensaje para empezar...</p>
            </div>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] px-4 py-3 rounded-2xl ${
                  msg.role === "user"
                    ? "bg-cocorico-naranja text-white"
                    : "bg-white/10 text-white"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSend()}
          placeholder="Escribe tu mensaje..."
          className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-cocorico-naranja/40 transition-colors"
        />
        <button
          onClick={handleSend}
          className="bg-cocorico-naranja hover:bg-cocorico-naranja/90 text-white px-6 py-3 rounded-2xl font-medium transition-colors"
        >
          Enviar
        </button>
      </div>
    </div>
  );
}

function VoiceChatView() {
  const [isRecording, setIsRecording] = useState(false);

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 min-h-[500px] flex flex-col items-center justify-center">
      {/* GIF de chat de voz */}
      <div className="mb-8 rounded-2xl overflow-hidden max-w-md w-full">
        <img 
          src="/branding/chat de voz- video.gif" 
          alt="Chat de voz animado"
          className="w-full h-auto"
        />
      </div>
      
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsRecording(!isRecording)}
        className={`w-24 h-24 rounded-full flex items-center justify-center transition-all ${
          isRecording
            ? "bg-red-500 shadow-lg shadow-red-500/50"
            : "bg-cocorico-naranja shadow-lg shadow-cocorico-naranja/50"
        }`}
      >
        <Mic className="w-10 h-10 text-white" />
      </motion.button>
      <p className="mt-6 text-white/80 text-center">
        {isRecording ? "Escuchando... Toca para detener" : "Toca el micrófono para hablar"}
      </p>
      {isRecording && (
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="mt-4 w-2 h-2 bg-red-500 rounded-full"
        />
      )}
    </div>
  );
}

function SearchView() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 min-h-[500px]">
      <div className="mb-6">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="¿Qué quieres cocinar hoy?"
          className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-4 text-white placeholder:text-white/40 focus:outline-none focus:border-cocorico-naranja/40 transition-colors"
        />
      </div>
      <div className="text-white/40 text-center py-12">
        <Search className="w-12 h-12 mx-auto mb-3 opacity-50" />
        <p>Busca recetas por ingredientes, tipo de comida o lo que se te ocurra...</p>
      </div>
    </div>
  );
}

function GenerateView() {
  const [prompt, setPrompt] = useState("");

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 min-h-[500px]">
      <div className="mb-6">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe la receta que quieres crear... Ej: 'Una pasta cremosa con setas y bacon'"
          rows={4}
          className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-4 text-white placeholder:text-white/40 focus:outline-none focus:border-cocorico-naranja/40 transition-colors resize-none"
        />
      </div>
      <button className="w-full bg-cocorico-naranja hover:bg-cocorico-naranja/90 text-white py-3 rounded-2xl font-medium transition-colors flex items-center justify-center gap-2">
        <Sparkles className="w-5 h-5" />
        Generar Receta con IA
      </button>
    </div>
  );
}
