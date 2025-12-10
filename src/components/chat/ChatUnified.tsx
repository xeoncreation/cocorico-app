/**
 * Asistente Culinario Inteligente
 * 
 * Interfaz conversacional con IA especializada en cocina:
 * - Botón de voz integrado en el input de texto
 * - Transcripción en tiempo real
 * - Una sola vista para texto y voz
 * - Streaming de respuestas
 */

'use client';

import { useState, useRef, useEffect } from 'react';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { Mic, MicOff, Send, Paperclip, Loader2 } from 'lucide-react';
import { useVoiceRecognition } from '@/hooks/useVoiceRecognition';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface ChatUnifiedProps {
  locale?: string;
  apiEndpoint?: string;
}

export default function ChatUnified({ 
  locale = 'es', 
  apiEndpoint = '/api/chat-unified' 
}: ChatUnifiedProps) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Vercel AI SDK useChat hook
  const { messages, sendMessage, status, error: chatError } = useChat({
    transport: new DefaultChatTransport({ 
      api: apiEndpoint 
    }),
  });

  // Voice recognition
  const {
    transcript,
    interimTranscript,
    isListening,
    isSupported,
    error: voiceError,
    startListening,
    stopListening,
    resetTranscript,
  } = useVoiceRecognition({
    lang: locale === 'es' ? 'es-ES' : 'en-US',
    continuous: true,
    interimResults: true,
  });

  // Auto-scroll al final cuando hay nuevos mensajes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Sincronizar transcripción con input
  useEffect(() => {
    if (transcript) {
      setInput(transcript);
    }
  }, [transcript]);

  // Ajustar altura del textarea automáticamente
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  const handleVoiceToggle = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const messageText = input.trim();
    if (!messageText || status !== 'ready') return;
    
    sendMessage({ 
      text: messageText,
      metadata: { 
        inputType: isListening ? 'voice' : 'text',
        locale 
      }
    });
    
    setInput('');
    resetTranscript();
    
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto">
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {messages.length === 0 ? (
          <WelcomeScreen />
        ) : (
          <AnimatePresence initial={false}>
            {messages.map((message) => (
              <MessageBubble 
                key={message.id} 
                message={message}
              />
            ))}
          </AnimatePresence>
        )}
        
        {/* Loading indicator */}
        {status === 'streaming' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400"
          >
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm">Cocorico está respondiendo...</span>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Error Messages */}
      {(chatError || voiceError) && (
        <div className="px-4 py-2 bg-red-50 dark:bg-red-900/20 border-t border-red-200 dark:border-red-800">
          <p className="text-sm text-red-600 dark:text-red-400">
            {chatError?.message || voiceError}
          </p>
        </div>
      )}

      {/* Input Bar */}
      <div className="border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
        <form onSubmit={handleSubmit} className="px-4 py-4">
          <div className="flex items-end gap-2">
            {/* Text Input */}
            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={
                  isListening 
                    ? '🎤 Escuchando...' 
                    : 'Escribe un mensaje... (Shift + Enter para nueva línea)'
                }
                className={cn(
                  'w-full px-4 py-3 pr-24 rounded-2xl resize-none',
                  'bg-neutral-100 dark:bg-neutral-800',
                  'border border-neutral-200 dark:border-neutral-700',
                  'text-neutral-900 dark:text-neutral-100',
                  'placeholder:text-neutral-500 dark:placeholder:text-neutral-400',
                  'focus:outline-none focus:ring-2 focus:ring-cocorico-red/50',
                  'transition-all duration-200',
                  'max-h-32 overflow-y-auto',
                  isListening && 'ring-2 ring-red-500/50'
                )}
                rows={1}
                disabled={status !== 'ready'}
              />

              {/* Voice Button (inside textarea) */}
              {isSupported && (
                <button
                  type="button"
                  onClick={handleVoiceToggle}
                  className={cn(
                    'absolute right-12 bottom-3 p-2 rounded-full',
                    'transition-all duration-200',
                    'hover:bg-neutral-200 dark:hover:bg-neutral-700',
                    isListening 
                      ? 'text-red-500 animate-pulse' 
                      : 'text-neutral-600 dark:text-neutral-400'
                  )}
                  title={isListening ? 'Detener grabación' : 'Grabar con voz'}
                >
                  {isListening ? (
                    <MicOff className="w-5 h-5" />
                  ) : (
                    <Mic className="w-5 h-5" />
                  )}
                </button>
              )}

              {/* Attach Button (inside textarea) */}
              <button
                type="button"
                className={cn(
                  'absolute right-3 bottom-3 p-2 rounded-full',
                  'text-neutral-600 dark:text-neutral-400',
                  'hover:bg-neutral-200 dark:hover:bg-neutral-700',
                  'transition-all duration-200'
                )}
                title="Adjuntar archivo"
              >
                <Paperclip className="w-5 h-5" />
              </button>

              {/* Interim transcript indicator */}
              {interimTranscript && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute -top-8 left-0 right-0 px-4 py-1 bg-red-50 dark:bg-red-900/20 rounded-t-lg"
                >
                  <p className="text-xs text-red-600 dark:text-red-400 truncate">
                    {interimTranscript}
                  </p>
                </motion.div>
              )}
            </div>

            {/* Send Button */}
            <button
              type="submit"
              disabled={!input.trim() || status !== 'ready'}
              className={cn(
                'p-3 rounded-full flex-shrink-0',
                'bg-cocorico-red text-white',
                'hover:bg-cocorico-red/90',
                'disabled:bg-neutral-300 dark:disabled:bg-neutral-700',
                'disabled:cursor-not-allowed',
                'transition-all duration-200',
                'shadow-lg shadow-cocorico-red/20'
              )}
            >
              {status === 'streaming' ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Hint text */}
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2 text-center">
            {isListening 
              ? '🎤 Hablando... Toca el micrófono para detener' 
              : isSupported
                ? '💡 Tip: Usa el micrófono para dictar tu mensaje'
                : 'Cocorico puede ayudarte con recetas, técnicas de cocina y más'}
          </p>
        </form>
      </div>
    </div>
  );
}

// ============================================================================
// WELCOME SCREEN
// ============================================================================

function WelcomeScreen() {
  const suggestions = [
    '¿Qué puedo cocinar con pollo?',
    'Dame una receta saludable',
    'Cómo hacer pan casero',
    'Ideas para cena rápida',
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4"
    >
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-neutral-900 dark:text-white mb-2">
          ¡Hola! Soy Cocorico 🐓
        </h1>
        <p className="text-lg text-neutral-600 dark:text-neutral-400">
          Tu asistente culinario con inteligencia artificial
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl w-full">
        {suggestions.map((suggestion, i) => (
          <motion.button
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={cn(
              'px-6 py-4 rounded-xl text-left',
              'bg-neutral-100 dark:bg-neutral-800',
              'border border-neutral-200 dark:border-neutral-700',
              'hover:bg-neutral-200 dark:hover:bg-neutral-700',
              'hover:border-cocorico-red/50',
              'transition-all duration-200',
              'text-neutral-700 dark:text-neutral-300'
            )}
          >
            <p className="text-sm">{suggestion}</p>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}

// ============================================================================
// MESSAGE BUBBLE
// ============================================================================

interface MessageBubbleProps {
  message: {
    id: string;
    role: 'user' | 'assistant' | 'system';
    parts: Array<{
      type: string;
      text?: string;
      [key: string]: any;
    }>;
  };
}

function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={cn(
        'flex gap-3',
        isUser ? 'flex-row-reverse' : 'flex-row'
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          'w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-sm font-semibold',
          isUser
            ? 'bg-cocorico-red text-white'
            : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300'
        )}
      >
        {isUser ? '👤' : '🐓'}
      </div>

      {/* Message Content */}
      <div
        className={cn(
          'flex-1 max-w-[80%]',
          isUser && 'flex flex-col items-end'
        )}
      >
        <div
          className={cn(
            'px-4 py-3 rounded-2xl',
            isUser
              ? 'bg-cocorico-red text-white'
              : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100'
          )}
        >
          {message.parts.map((part, i) => {
            if (part.type === 'text' && part.text) {
              return (
                <p key={i} className="text-sm whitespace-pre-wrap leading-relaxed">
                  {part.text}
                </p>
              );
            }
            return null;
          })}
        </div>
      </div>
    </motion.div>
  );
}
