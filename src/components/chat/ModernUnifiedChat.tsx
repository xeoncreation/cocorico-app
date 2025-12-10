/**
 * Modern Unified Chat - Estilo ChatGPT
 * 
 * 3 modos integrados en una sola interfaz:
 * 1. Texto normal (typing)
 * 2. Dictado (transcribe a texto, luego envía)
 * 3. Conversación de voz continua (real-time audio)
 */

'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { 
  Mic, 
  MicOff, 
  Send, 
  Phone,
  PhoneOff,
  Loader2,
  Volume2,
  VolumeX,
  Sparkles,
  StopCircle
} from 'lucide-react';
import { useVoiceRecognition } from '@/hooks/useVoiceRecognition';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { sttTranscribe } from '@/services/voice';

type VoiceMode = 'off' | 'dictation' | 'conversation';

interface ModernUnifiedChatProps {
  locale?: string;
  apiEndpoint?: string;
}

export default function ModernUnifiedChat({ 
  locale = 'es', 
  apiEndpoint = '/api/chat-unified' 
}: ModernUnifiedChatProps) {
  // State
  const [input, setInput] = useState('');
  const [voiceMode, setVoiceMode] = useState<VoiceMode>('off');
  const [isRecording, setIsRecording] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [isProcessingVoice, setIsProcessingVoice] = useState(false);
  
  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);

  // Vercel AI SDK useChat hook
  const { messages, sendMessage, status, error: chatError } = useChat({
    transport: new DefaultChatTransport({ 
      api: apiEndpoint 
    }),
  });

  // Voice recognition (Web Speech API) para dictado
  const {
    transcript,
    interimTranscript,
    isListening,
    isSupported: speechSupported,
    error: voiceError,
    startListening,
    stopListening,
    resetTranscript,
  } = useVoiceRecognition({
    lang: locale === 'es' ? 'es-ES' : 'en-US',
    continuous: true,
    interimResults: true,
  });

  // Auto-scroll al final
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Sincronizar transcripción con input en modo dictado
  useEffect(() => {
    if (voiceMode === 'dictation' && transcript) {
      setInput(transcript);
    }
  }, [transcript, voiceMode]);

  // Ajustar altura del textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  // Cleanup audio context
  useEffect(() => {
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // ============================================================================
  // MODO DICTADO: Grabar → Transcribir → Insertar en input
  // ============================================================================

  const startDictation = useCallback(() => {
    if (!speechSupported) {
      alert('Tu navegador no soporta reconocimiento de voz');
      return;
    }
    
    setVoiceMode('dictation');
    startListening();
  }, [speechSupported, startListening]);

  const stopDictation = useCallback(() => {
    stopListening();
    setVoiceMode('off');
  }, [stopListening]);

  // ============================================================================
  // MODO CONVERSACIÓN: Grabar audio → Enviar → Recibir respuesta en audio
  // ============================================================================

  const startVoiceConversation = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Setup audio visualizer
      const audioContext = new AudioContext();
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      
      audioContextRef.current = audioContext;
      analyserRef.current = analyser;
      
      // Visualize audio level
      const updateAudioLevel = () => {
        if (!analyserRef.current) return;
        
        const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
        analyserRef.current.getByteFrequencyData(dataArray);
        const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
        setAudioLevel(Math.min(100, (average / 255) * 200));
        
        animationFrameRef.current = requestAnimationFrame(updateAudioLevel);
      };
      updateAudioLevel();

      // Setup MediaRecorder
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        audioChunksRef.current = [];
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
        
        // Process the voice message
        await processVoiceMessage(audioBlob);
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
      setVoiceMode('conversation');

    } catch (error) {
      console.error('Error starting voice conversation:', error);
      alert('No se pudo acceder al micrófono');
    }
  }, []);

  const stopVoiceConversation = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
    
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    
    setVoiceMode('off');
    setAudioLevel(0);
  }, [isRecording]);

  const processVoiceMessage = async (audioBlob: Blob) => {
    try {
      setIsProcessingVoice(true);
      
      // Enviar a la API especializada de voice-conversation
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.webm');
      formData.append('requestAudio', audioEnabled.toString());
      formData.append('locale', locale);

      const response = await fetch('/api/voice-conversation', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Error en la conversación de voz');
      }

      const data = await response.json();
      
      // Agregar mensaje del usuario (transcripción)
      sendMessage({ 
        text: data.transcription,
        metadata: { 
          inputType: 'voice-conversation',
          locale 
        }
      });

      // Si hay audio de respuesta, reproducirlo
      if (data.hasAudio && data.audioUrl && audioEnabled) {
        playAudioResponse(data.audioUrl);
      }

    } catch (error) {
      console.error('Error processing voice message:', error);
      alert('Error al procesar el mensaje de voz. Intenta de nuevo.');
    } finally {
      setIsProcessingVoice(false);
    }
  };

  const playAudioResponse = (audioUrl: string) => {
    if (audioElementRef.current) {
      audioElementRef.current.pause();
      audioElementRef.current = null;
    }

    const audio = new Audio(audioUrl);
    audioElementRef.current = audio;

    audio.onended = () => {
      audioElementRef.current = null;
    };

    audio.onerror = (e) => {
      console.error('Error reproduciendo audio:', e);
      audioElementRef.current = null;
    };

    audio.play().catch(err => {
      console.error('Error al iniciar reproducción:', err);
    });
  };

  // ============================================================================
  // ENVIAR MENSAJE DE TEXTO
  // ============================================================================

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const messageText = input.trim();
    if (!messageText || status !== 'ready') return;
    
    sendMessage({ 
      text: messageText,
      metadata: { 
        inputType: voiceMode === 'dictation' ? 'voice-dictated' : 'text',
        locale 
      }
    });
    
    setInput('');
    resetTranscript();
    
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

  // ============================================================================
  // VOICE MODE TOGGLE HANDLER
  // ============================================================================

  const handleVoiceButtonClick = () => {
    if (voiceMode === 'off') {
      // Si hay texto, usar dictado. Si no, iniciar conversación
      if (input.trim()) {
        startDictation();
      } else {
        // Mostrar opciones
        setVoiceMode('dictation');
        startDictation();
      }
    } else if (voiceMode === 'dictation') {
      stopDictation();
    } else if (voiceMode === 'conversation') {
      stopVoiceConversation();
    }
  };

  const handleConversationButtonClick = () => {
    if (voiceMode === 'conversation') {
      stopVoiceConversation();
    } else {
      startVoiceConversation();
    }
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto bg-white dark:bg-neutral-950">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cocorico-red to-cocorico-orange flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-semibold text-neutral-900 dark:text-white">
              Cocorico AI
            </h1>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              {voiceMode === 'conversation' && isRecording 
                ? '🎙️ Conversación de voz activa'
                : voiceMode === 'dictation'
                ? '🎤 Dictando...'
                : 'Tu asistente culinario'}
            </p>
          </div>
        </div>

        {/* Audio toggle */}
        <button
          onClick={() => setAudioEnabled(!audioEnabled)}
          className={cn(
            'p-2 rounded-lg transition-colors',
            audioEnabled 
              ? 'bg-cocorico-red/10 text-cocorico-red' 
              : 'text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
          )}
          title={audioEnabled ? 'Audio activado' : 'Audio desactivado'}
        >
          {audioEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
        </button>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {messages.length === 0 ? (
          <WelcomeScreen onQuickAction={setInput} />
        ) : (
          <AnimatePresence initial={false}>
            {messages.map((message) => (
              <MessageBubble 
                key={message.id} 
                message={message}
                audioEnabled={audioEnabled}
              />
            ))}
          </AnimatePresence>
        )}
        
        {/* Loading indicator */}
        {(status === 'streaming' || isProcessingVoice) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-neutral-500 dark:text-neutral-400"
          >
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm">
              {isProcessingVoice ? 'Procesando tu voz...' : 'Cocorico está respondiendo...'}
            </span>
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

      {/* Voice Conversation Mode - Full Screen Recording */}
      {voiceMode === 'conversation' && isRecording && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="absolute inset-0 bg-gradient-to-br from-cocorico-red/95 to-cocorico-orange/95 backdrop-blur-xl z-50 flex flex-col items-center justify-center"
        >
          {/* Pulsing circle */}
          <div className="relative">
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.5, 0.8, 0.5]
              }}
              transition={{ 
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute inset-0 rounded-full bg-white/30"
              style={{
                transform: `scale(${1 + audioLevel / 100})`
              }}
            />
            <div className="relative w-32 h-32 rounded-full bg-white flex items-center justify-center shadow-2xl">
              <Mic className="w-16 h-16 text-cocorico-red" />
            </div>
          </div>

          <p className="text-white text-2xl font-semibold mt-8 mb-2">
            Escuchando...
          </p>
          <p className="text-white/80 text-sm mb-8">
            Habla con naturalidad
          </p>

          {/* Audio level bar */}
          <div className="w-64 h-2 bg-white/20 rounded-full overflow-hidden mb-8">
            <motion.div 
              className="h-full bg-white rounded-full"
              style={{ width: `${audioLevel}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>

          {/* Stop button */}
          <button
            onClick={stopVoiceConversation}
            className="px-6 py-3 bg-white text-cocorico-red rounded-full font-medium shadow-xl hover:shadow-2xl transition-all hover:scale-105 flex items-center gap-2"
          >
            <StopCircle className="w-5 h-5" />
            Detener conversación
          </button>
        </motion.div>
      )}

      {/* Input Bar */}
      <div className="border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-4 py-4">
        <form onSubmit={handleSubmit} className="flex items-end gap-2">
          {/* Text Input */}
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                voiceMode === 'dictation'
                  ? '🎤 Dictando... Habla o escribe'
                  : voiceMode === 'conversation'
                  ? '🎙️ Conversación de voz activa'
                  : 'Mensaje a Cocorico...'
              }
              className={cn(
                'w-full px-4 py-3 pr-24 rounded-2xl resize-none',
                'bg-neutral-100 dark:bg-neutral-800',
                'border-2 transition-all duration-200',
                'text-neutral-900 dark:text-neutral-100',
                'placeholder:text-neutral-500 dark:placeholder:text-neutral-400',
                'focus:outline-none max-h-32 overflow-y-auto',
                voiceMode === 'dictation' 
                  ? 'border-cocorico-red focus:border-cocorico-red' 
                  : 'border-transparent focus:border-cocorico-red/50'
              )}
              rows={1}
              disabled={status !== 'ready' || voiceMode === 'conversation'}
            />

            {/* Interim transcript indicator */}
            {voiceMode === 'dictation' && interimTranscript && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute -top-10 left-0 right-0 px-4 py-2 bg-cocorico-red/10 rounded-lg"
              >
                <p className="text-xs text-cocorico-red truncate flex items-center gap-2">
                  <span className="animate-pulse">🎤</span>
                  {interimTranscript}
                </p>
              </motion.div>
            )}

            {/* Mic button inside textarea */}
            {speechSupported && voiceMode !== 'conversation' && (
              <button
                type="button"
                onClick={handleVoiceButtonClick}
                className={cn(
                  'absolute right-12 bottom-2.5 p-2 rounded-full transition-all',
                  voiceMode === 'dictation'
                    ? 'text-cocorico-red bg-cocorico-red/10 animate-pulse'
                    : 'text-neutral-500 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                )}
                title={voiceMode === 'dictation' ? 'Detener dictado' : 'Dictar mensaje'}
              >
                {voiceMode === 'dictation' ? (
                  <MicOff className="w-5 h-5" />
                ) : (
                  <Mic className="w-5 h-5" />
                )}
              </button>
            )}
          </div>

          {/* Voice Conversation Button */}
          <button
            type="button"
            onClick={handleConversationButtonClick}
            disabled={status !== 'ready'}
            className={cn(
              'p-3 rounded-full transition-all shadow-lg flex-shrink-0',
              voiceMode === 'conversation'
                ? 'bg-red-500 text-white hover:bg-red-600 animate-pulse'
                : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-300 dark:hover:bg-neutral-600',
              'disabled:opacity-50 disabled:cursor-not-allowed'
            )}
            title={voiceMode === 'conversation' ? 'Detener conversación' : 'Iniciar conversación de voz'}
          >
            {voiceMode === 'conversation' ? (
              <PhoneOff className="w-5 h-5" />
            ) : (
              <Phone className="w-5 h-5" />
            )}
          </button>

          {/* Send Button */}
          <button
            type="submit"
            disabled={!input.trim() || status !== 'ready' || voiceMode === 'conversation'}
            className={cn(
              'p-3 rounded-full flex-shrink-0 transition-all shadow-lg',
              'bg-cocorico-red text-white',
              'hover:bg-cocorico-red/90 hover:shadow-xl',
              'disabled:bg-neutral-300 dark:disabled:bg-neutral-700',
              'disabled:cursor-not-allowed disabled:shadow-none'
            )}
          >
            {status === 'streaming' ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </form>

        {/* Helper text */}
        <div className="flex items-center justify-between mt-2 px-2">
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            {voiceMode === 'dictation' && '🎤 Dictando con voz'}
            {voiceMode === 'conversation' && '🎙️ Conversación de voz activa'}
            {voiceMode === 'off' && speechSupported && '💡 Usa el micrófono para dictar o el teléfono para conversar'}
          </p>
          <p className="text-xs text-neutral-400">
            Shift + Enter para nueva línea
          </p>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// WELCOME SCREEN
// ============================================================================

function WelcomeScreen({ onQuickAction }: { onQuickAction: (text: string) => void }) {
  const suggestions = [
    { icon: '🍳', text: '¿Qué puedo cocinar con pollo?' },
    { icon: '📖', text: 'Dame una receta fácil para principiantes' },
    { icon: '⏱️', text: 'Recetas rápidas de menos de 20 minutos' },
    { icon: '🥗', text: 'Ideas saludables para la semana' },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cocorico-red to-cocorico-orange flex items-center justify-center mb-4 shadow-xl">
        <Sparkles className="w-8 h-8 text-white" />
      </div>
      
      <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">
        ¡Hola! Soy Cocorico
      </h2>
      
      <p className="text-neutral-600 dark:text-neutral-400 mb-8 max-w-md">
        Tu asistente culinario inteligente. Puedo ayudarte con recetas, técnicas, 
        ingredientes y mucho más. ¿En qué te puedo ayudar hoy?
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl">
        {suggestions.map((suggestion, index) => (
          <motion.button
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => onQuickAction(suggestion.text)}
            className="p-4 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-all text-left group border border-transparent hover:border-cocorico-red/50"
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl">{suggestion.icon}</span>
              <span className="text-sm text-neutral-700 dark:text-neutral-300 group-hover:text-neutral-900 dark:group-hover:text-white">
                {suggestion.text}
              </span>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// MESSAGE BUBBLE
// ============================================================================

interface MessageBubbleProps {
  message: any;
  audioEnabled: boolean;
}

function MessageBubble({ message, audioEnabled }: MessageBubbleProps) {
  const isUser = message.role === 'user';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'flex gap-3',
        isUser ? 'justify-end' : 'justify-start'
      )}
    >
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cocorico-red to-cocorico-orange flex items-center justify-center flex-shrink-0 shadow-md">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
      )}
      
      <div
        className={cn(
          'max-w-[70%] rounded-2xl px-4 py-3 shadow-sm',
          isUser
            ? 'bg-cocorico-red text-white'
            : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white'
        )}
      >
        <p className="text-sm whitespace-pre-wrap leading-relaxed">
          {message.content}
        </p>
      </div>

      {isUser && (
        <div className="w-8 h-8 rounded-full bg-neutral-300 dark:bg-neutral-700 flex items-center justify-center flex-shrink-0">
          <span className="text-sm">👤</span>
        </div>
      )}
    </motion.div>
  );
}
