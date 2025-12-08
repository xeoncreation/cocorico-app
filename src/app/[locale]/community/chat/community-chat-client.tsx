"use client";

import { useState, useRef, useEffect } from "react";
import { createClientComponentClient } from "@/lib/supabase/client";
import GlassCard from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Users, Bell, Settings, ChefHat, Crown, Circle } from "lucide-react";

type Message = {
  id: string;
  user_id: string;
  username: string;
  content: string;
  created_at: string;
  is_premium?: boolean;
};

type OnlineUser = {
  user_id: string;
  username: string;
  is_premium: boolean;
  status: "online" | "away";
};

export default function CommunityChatClient() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const supabase = createClientComponentClient();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    initializeChat();

    return () => {
      // Cleanup channels on unmount
      supabase.removeAllChannels();
    };
  }, []);

  const initializeChat = async () => {
    try {
      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setError("Debes iniciar sesión para usar el chat");
        setLoading(false);
        return;
      }

      setCurrentUser(user);

      // Load existing messages
      await loadMessages();

      // Setup realtime subscription
      setupRealtimeMessages();

      // Track presence
      setupPresence(user);

      setIsConnected(true);
    } catch (err) {
      console.error("Error initializing chat:", err);
      setError("Error al conectar con el chat");
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async () => {
    try {
      const { data, error } = await supabase
        .from("community_messages")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) throw error;

      setMessages((data || []).reverse());
    } catch (err) {
      console.error("Error loading messages:", err);
      // Continue with empty messages
      setMessages([]);
    }
  };

  const setupRealtimeMessages = () => {
    const channel = supabase
      .channel("community_chat_messages")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "community_messages",
        },
        (payload: any) => {
          setMessages((prev) => [...prev, payload.new as Message]);
        }
      )
      .subscribe();
  };

  const setupPresence = (user: any) => {
    const presenceChannel = supabase.channel("online_users", {
      config: { presence: { key: user.id } },
    });

    presenceChannel
      .on("presence", { event: "sync" }, () => {
        const state = presenceChannel.presenceState();
        const users: OnlineUser[] = [];

        Object.values(state).forEach((presences: any) => {
          presences.forEach((presence: any) => {
            users.push({
              user_id: presence.user_id,
              username: presence.username || "Usuario",
              is_premium: presence.is_premium || false,
              status: "online",
            });
          });
        });

        setOnlineUsers(users);
      })
      .subscribe(async (status: string) => {
        if (status === "SUBSCRIBED") {
          await presenceChannel.track({
            user_id: user.id,
            username: user.email?.split("@")[0] || "Usuario",
            is_premium: false, // TODO: Get from user profile
            online_at: new Date().toISOString(),
          });
        }
      });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newMessage.trim() || !currentUser) return;

    try {
      const { error } = await supabase.from("community_messages").insert({
        user_id: currentUser.id,
        username: currentUser.email?.split("@")[0] || "Usuario",
        content: newMessage.trim(),
      });

      if (error) throw error;

      setNewMessage("");
    } catch (err) {
      console.error("Error sending message:", err);
      alert("Error al enviar mensaje. Intenta de nuevo.");
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <GlassCard className="p-12 text-center">
          <div className="animate-spin w-8 h-8 border-4 border-cocorico-red border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="body-regular text-neutral-600 dark:text-neutral-400">
            Conectando al chat...
          </p>
        </GlassCard>
      </div>
    );
  }

  if (error || !currentUser) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <GlassCard className="p-8 text-center">
          <p className="body-regular text-red-600 dark:text-red-400 mb-4">
            {error || "Debes iniciar sesión para usar el chat"}
          </p>
          <Button
            onClick={() => (window.location.href = "/es/login")}
            className="bg-cocorico-red hover:bg-cocorico-red/90 text-white"
          >
            Iniciar Sesión
          </Button>
        </GlassCard>
      </div>
    );
  }

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
                <div
                  className={`w-2 h-2 rounded-full ${
                    isConnected ? "bg-green-500 animate-pulse" : "bg-gray-400"
                  }`}
                ></div>
                <span>{isConnected ? "Conectado" : "Conectando..."}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>{onlineUsers.length} usuarios activos</span>
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Messages area */}
        <div className="lg:col-span-2">
          <GlassCard className="flex flex-col h-[600px]">
            {/* Messages list */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center py-12">
                    <p className="body-regular text-neutral-500 dark:text-neutral-400">
                      No hay mensajes aún. ¡Sé el primero en escribir! 🚀
                    </p>
                  </div>
                </div>
              ) : (
                messages.map((msg) => {
                  const isOwnMessage = msg.user_id === currentUser?.id;
                  return (
                    <div
                      key={msg.id}
                      className={`flex gap-3 animate-in slide-in-from-bottom-2 ${
                        isOwnMessage ? "flex-row-reverse" : "flex-row"
                      }`}
                    >
                      {/* Avatar */}
                      <div
                        className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                          msg.is_premium
                            ? "bg-gradient-to-br from-amber-400 to-orange-500"
                            : "bg-gradient-to-br from-blue-400 to-purple-500"
                        }`}
                      >
                        {msg.is_premium ? (
                          <Crown className="w-5 h-5" />
                        ) : (
                          <ChefHat className="w-5 h-5" />
                        )}
                      </div>

                      {/* Message bubble */}
                      <div
                        className={`flex-1 max-w-md ${
                          isOwnMessage ? "text-right" : "text-left"
                        }`}
                      >
                        {!isOwnMessage && (
                          <div className="flex items-center gap-2 mb-1">
                            <span className="body-small font-semibold text-cocorico-brown dark:text-amber-100">
                              {msg.username}
                            </span>
                            {msg.is_premium && (
                              <span className="px-2 py-0.5 bg-amber-500 text-white text-xs font-bold rounded-full">
                                PREMIUM
                              </span>
                            )}
                          </div>
                        )}
                        <div
                          className={`p-3 rounded-2xl ${
                            isOwnMessage
                              ? "bg-cocorico-red text-white rounded-tr-none"
                              : "bg-white/60 dark:bg-slate-800/60 text-neutral-800 dark:text-neutral-100 rounded-tl-none"
                          }`}
                        >
                          <p className="body-regular">{msg.content}</p>
                        </div>
                        <span className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 inline-block">
                          {new Date(msg.created_at).toLocaleTimeString("es-ES", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input area */}
            <div className="p-4 border-t border-white/20 dark:border-slate-700/60">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Escribe tu mensaje..."
                  className="flex-1 coco-glass"
                  maxLength={500}
                />
                <Button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="bg-cocorico-red hover:bg-cocorico-red/90 text-white"
                >
                  <Send className="w-5 h-5" />
                </Button>
              </form>
            </div>
          </GlassCard>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <GlassCard className="p-4">
            <h3 className="heading-3 text-cocorico-brown dark:text-amber-100 mb-4">
              Usuarios activos
            </h3>
            <div className="space-y-3">
              {onlineUsers.length === 0 ? (
                <p className="body-small text-neutral-500 dark:text-neutral-400">
                  No hay usuarios conectados
                </p>
              ) : (
                onlineUsers.slice(0, 10).map((user) => {
                  const isCurrentUser = user.user_id === currentUser?.id;
                  return (
                    <div key={user.user_id} className="flex items-center gap-2">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm ${
                          user.is_premium
                            ? "bg-gradient-to-br from-amber-400 to-orange-500"
                            : "bg-gradient-to-br from-blue-400 to-purple-500"
                        }`}
                      >
                        {user.is_premium ? (
                          <Crown className="w-4 h-4" />
                        ) : (
                          <ChefHat className="w-4 h-4" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="body-small font-medium text-neutral-800 dark:text-neutral-100 truncate">
                          {user.username}
                          {isCurrentUser && (
                            <span className="text-xs text-neutral-500 ml-1">(tú)</span>
                          )}
                        </p>
                        <div className="flex items-center gap-1">
                          <Circle
                            className={`w-2 h-2 fill-current ${
                              user.status === "online" ? "text-green-500" : "text-yellow-500"
                            }`}
                          />
                          <span className="text-xs text-neutral-500 dark:text-neutral-400">
                            {user.status === "online" ? "En línea" : "Ausente"}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {onlineUsers.length > 10 && (
              <div className="mt-6 pt-4 border-t border-white/20 dark:border-slate-700/60">
                <Button
                  variant="outline"
                  className="w-full ios-clear-button"
                  size="sm"
                >
                  Ver todos ({onlineUsers.length})
                </Button>
              </div>
            )}
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
          <strong>✨ Chat en Tiempo Real:</strong> Mensajes instantáneos y presencia en vivo con Supabase Realtime
        </p>
      </div>
    </div>
  );
}
