"use client";

import { useState, useRef, useEffect } from "react";
import GlassCard from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Users, Bell, Settings, ChefHat, Crown } from "lucide-react";

type Message = {
  id: string;
  user: string;
  avatar?: string;
  message: string;
  timestamp: Date;
  isPremium?: boolean;
};

// Mock messages for demo
const MOCK_MESSAGES: Message[] = [
  {
    id: "1",
    user: "Chef María",
    message: "¡Acabo de preparar una paella espectacular! 🥘",
    timestamp: new Date(Date.now() - 1000 * 60 * 15),
    isPremium: true,
  },
  {
    id: "2",
    user: "CocineroNovato",
    message: "¿Alguien sabe cómo hacer que el arroz quede perfecto?",
    timestamp: new Date(Date.now() - 1000 * 60 * 10),
  },
  {
    id: "3",
    user: "Chef García",
    message: "El secreto está en el fondo y el sofrito 👨‍🍳",
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    isPremium: true,
  },
  {
    id: "4",
    user: "FoodLover",
    message: "¡Gracias por el consejo! Lo probaré hoy",
    timestamp: new Date(Date.now() - 1000 * 60 * 2),
  },
];

export default function CommunityChatClient() {
  const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES);
  const [newMessage, setNewMessage] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Simular conexión
    setTimeout(() => setIsConnected(true), 1000);
  }, []);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;
    
    const message: Message = {
      id: Date.now().toString(),
      user: "Tú",
      message: newMessage,
      timestamp: new Date(),
    };
    
    setMessages([...messages, message]);
    setNewMessage("");
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="heading-display text-cocorico-brown dark:text-amber-100 mb-2">
              Chat de la Comunidad
            </h1>
            <div className="flex items-center gap-3 body-small text-neutral-600 dark:text-neutral-400">
              <div className="flex items-center gap-1">
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
                <span>{isConnected ? 'Conectado' : 'Conectando...'}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>127 usuarios activos</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" className="ios-clear-button">
              <Bell className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="ios-clear-button">
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Banner info */}
        <GlassCard className="p-4 bg-blue-50/50 dark:bg-blue-950/20 border-blue-200/30 dark:border-blue-800/30">
          <p className="body-small text-blue-800 dark:text-blue-200">
            <strong>💬 Chat en Vivo:</strong> Conecta con otros cocineros, comparte tips y recetas. Sé respetuoso y disfruta de la comunidad.
          </p>
        </GlassCard>
      </div>

      {/* Chat container */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Messages area */}
        <div className="lg:col-span-3">
          <GlassCard className="h-[600px] flex flex-col">
            {/* Messages list */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${msg.user === "Tú" ? "flex-row-reverse" : "flex-row"}`}
                >
                  {/* Avatar */}
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                    msg.isPremium
                      ? "bg-gradient-to-br from-amber-400 to-orange-500"
                      : "bg-gradient-to-br from-blue-400 to-purple-500"
                  }`}>
                    {msg.isPremium ? (
                      <Crown className="w-5 h-5" />
                    ) : (
                      <ChefHat className="w-5 h-5" />
                    )}
                  </div>

                  {/* Message bubble */}
                  <div className={`flex-1 max-w-md ${msg.user === "Tú" ? "text-right" : "text-left"}`}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="body-small font-semibold text-cocorico-brown dark:text-amber-100">
                        {msg.user}
                      </span>
                      {msg.isPremium && (
                        <span className="px-2 py-0.5 bg-amber-500 text-white text-xs font-bold rounded-full">
                          PREMIUM
                        </span>
                      )}
                    </div>
                    <div
                      className={`p-3 rounded-2xl ${
                        msg.user === "Tú"
                          ? "bg-cocorico-red text-white rounded-tr-none"
                          : "bg-white/60 dark:bg-slate-800/60 text-neutral-800 dark:text-neutral-100 rounded-tl-none"
                      }`}
                    >
                      <p className="body-regular">{msg.message}</p>
                    </div>
                    <span className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 inline-block">
                      {msg.timestamp.toLocaleTimeString("es-ES", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input area */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-white/20 dark:border-slate-700/60">
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Escribe un mensaje..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-1 bg-white/50 dark:bg-slate-800/50 border-white/30 dark:border-slate-700/50"
                  disabled={!isConnected}
                />
                <Button
                  type="submit"
                  className="bg-cocorico-red hover:bg-cocorico-red/90 text-white"
                  disabled={!isConnected || !newMessage.trim()}
                >
                  <Send className="w-5 h-5" />
                </Button>
              </div>
            </form>
          </GlassCard>
        </div>

        {/* Sidebar - Online users */}
        <div className="lg:col-span-1">
          <GlassCard className="p-4">
            <h3 className="heading-3 text-cocorico-brown dark:text-amber-100 mb-4">
              Usuarios activos
            </h3>
            <div className="space-y-3">
              {[
                { name: "Chef María", isPremium: true, status: "online" },
                { name: "CocineroNovato", isPremium: false, status: "online" },
                { name: "Chef García", isPremium: true, status: "online" },
                { name: "FoodLover", isPremium: false, status: "online" },
                { name: "MasterChef", isPremium: true, status: "away" },
              ].map((user, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm ${
                    user.isPremium
                      ? "bg-gradient-to-br from-amber-400 to-orange-500"
                      : "bg-gradient-to-br from-blue-400 to-purple-500"
                  }`}>
                    {user.isPremium ? (
                      <Crown className="w-4 h-4" />
                    ) : (
                      <ChefHat className="w-4 h-4" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="body-small font-medium text-neutral-800 dark:text-neutral-100 truncate">
                      {user.name}
                    </p>
                    <div className="flex items-center gap-1">
                      <div className={`w-2 h-2 rounded-full ${
                        user.status === "online" ? "bg-green-500" : "bg-yellow-500"
                      }`}></div>
                      <span className="text-xs text-neutral-500 dark:text-neutral-400">
                        {user.status === "online" ? "En línea" : "Ausente"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-white/20 dark:border-slate-700/60">
              <Button variant="outline" className="w-full ios-clear-button" size="sm">
                Ver todos (127)
              </Button>
            </div>
          </GlassCard>

          {/* Premium CTA */}
          <GlassCard className="p-4 mt-4 bg-gradient-to-br from-amber-50/50 to-orange-50/50 dark:from-amber-950/20 dark:to-orange-950/20 border-amber-200/30 dark:border-amber-800/30">
            <div className="text-center space-y-3">
              <Crown className="w-10 h-10 mx-auto text-amber-500" />
              <h4 className="heading-3 text-amber-800 dark:text-amber-200">
                Chat Premium
              </h4>
              <p className="body-small text-amber-700 dark:text-amber-300">
                Accede a salas exclusivas, stickers animados y prioridad en mensajes
              </p>
              <Button className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white" size="sm">
                Mejorar a Premium
              </Button>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Footer note */}
      <div className="mt-6 text-center">
        <p className="body-small text-neutral-500 dark:text-neutral-400">
          <strong>🚧 Modo Demo:</strong> Este chat usa mensajes simulados. La funcionalidad en tiempo real con WebSocket se implementará próximamente.
        </p>
      </div>
    </div>
  );
}
