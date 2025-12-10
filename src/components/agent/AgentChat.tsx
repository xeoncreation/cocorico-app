/**
 * AgentChat Component
 * 
 * Chatbot flotante de asistencia que ayuda a los usuarios
 * con dudas sobre la aplicación
 */

'use client';

import { useState } from 'react';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { Bot, X, MessageSquare, Send, Loader2, Minimize2, Maximize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function AgentChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState('');

  const { messages, sendMessage, status, error } = useChat({
    transport: new DefaultChatTransport({ 
      api: '/api/agent/chat' 
    }),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || status !== 'ready') return;
    
    sendMessage({ text: input });
    setInput('');
  };

  const quickActions = [
    '¿Cómo funciona el scanner?',
    '¿Qué incluye Premium?',
    'Ayuda con recetas',
    'Ver estadísticas',
  ];

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-br from-cocorico-red to-red-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:shadow-cocorico-red/50 transition-shadow"
          >
            <Bot className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className={cn(
              'fixed z-50 bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 flex flex-col',
              isMinimized 
                ? 'bottom-6 right-6 w-80 h-16' 
                : 'bottom-6 right-6 w-96 h-[600px]'
            )}
          >
            {/* Header */}
            <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between bg-gradient-to-r from-cocorico-red to-red-600 text-white rounded-t-2xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold">Asistente Cocorico</h3>
                  {!isMinimized && (
                    <p className="text-xs opacity-90">Siempre listo para ayudar</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  {isMinimized ? (
                    <Maximize2 className="w-4 h-4" />
                  ) : (
                    <Minimize2 className="w-4 h-4" />
                  )}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {/* Mensaje de bienvenida si no hay mensajes */}
                  {messages.length === 0 && (
                    <div className="flex justify-start">
                      <div className="max-w-[80%] rounded-2xl px-4 py-2 bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white">
                        <p className="text-sm whitespace-pre-wrap">
                          ¡Hola! 👋 Soy el agente de asistencia de Cocorico 🐓. ¿En qué puedo ayudarte hoy?
                        </p>
                      </div>
                    </div>
                  )}

                  {messages.map((msg: any) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={cn(
                        'flex',
                        msg.role === 'user' ? 'justify-end' : 'justify-start'
                      )}
                    >
                      <div
                        className={cn(
                          'max-w-[80%] rounded-2xl px-4 py-2',
                          msg.role === 'user'
                            ? 'bg-cocorico-red text-white'
                            : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white'
                        )}
                      >
                        {msg.parts.map((part: any, i: number) => (
                          part.type === 'text' && part.text && (
                            <p key={i} className="text-sm whitespace-pre-wrap">
                              {part.text}
                            </p>
                          )
                        ))}
                      </div>
                    </motion.div>
                  ))}

                  {status === 'streaming' && (
                    <div className="flex justify-start">
                      <div className="bg-neutral-100 dark:bg-neutral-800 rounded-2xl px-4 py-2">
                        <Loader2 className="w-4 h-4 animate-spin text-neutral-600 dark:text-neutral-400" />
                      </div>
                    </div>
                  )}

                  {error && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                      <p className="text-sm text-red-600 dark:text-red-400">
                        Error: {error.message}
                      </p>
                    </div>
                  )}

                  {/* Quick Actions (solo al inicio) */}
                  {messages.length === 1 && (
                    <div className="grid grid-cols-2 gap-2">
                      {quickActions.map((action, i) => (
                        <button
                          key={i}
                          onClick={() => {
                            setInput(action);
                            sendMessage({ text: action });
                          }}
                          className="text-xs px-3 py-2 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-lg transition-colors text-left"
                          disabled={status !== 'ready'}
                        >
                          {action}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Input */}
                <form
                  onSubmit={handleSubmit}
                  className="p-4 border-t border-neutral-200 dark:border-neutral-800"
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Escribe tu pregunta..."
                      className="flex-1 px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-full focus:outline-none focus:ring-2 focus:ring-cocorico-red bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
                      disabled={status !== 'ready'}
                    />
                    <button
                      type="submit"
                      disabled={!input.trim() || status !== 'ready'}
                      className="p-2 bg-cocorico-red text-white rounded-full hover:bg-cocorico-red/90 disabled:bg-neutral-300 dark:disabled:bg-neutral-700 disabled:cursor-not-allowed transition-colors"
                    >
                      {status === 'streaming' ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <Send className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </form>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
