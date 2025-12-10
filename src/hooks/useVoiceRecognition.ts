/**
 * useVoiceRecognition Hook
 * 
 * Hook para reconocimiento de voz en tiempo real usando Web Speech API
 * Soporta transcripción continua con resultados intermedios
 */

import { useState, useEffect, useRef, useCallback } from 'react';

interface UseVoiceRecognitionOptions {
  lang?: string;
  continuous?: boolean;
  interimResults?: boolean;
  onError?: (error: string) => void;
  onEnd?: () => void;
}

interface UseVoiceRecognitionReturn {
  transcript: string;
  interimTranscript: string;
  isListening: boolean;
  isSupported: boolean;
  error: string | null;
  startListening: () => void;
  stopListening: () => void;
  resetTranscript: () => void;
  browserSupportsSpeechRecognition: boolean;
}

export function useVoiceRecognition({
  lang = 'es-ES',
  continuous = true,
  interimResults = true,
  onError,
  onEnd,
}: UseVoiceRecognitionOptions = {}): UseVoiceRecognitionReturn {
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(false);

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const finalTranscriptRef = useRef('');

  // Verificar soporte del navegador
  useEffect(() => {
    if (typeof window === 'undefined') {
      setIsSupported(false);
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      setIsSupported(true);

      const recognition = new SpeechRecognition();
      recognition.continuous = continuous;
      recognition.interimResults = interimResults;
      recognition.lang = lang;
      recognition.maxAlternatives = 1;

      // Evento cuando hay resultados
      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let interim = '';
        let final = finalTranscriptRef.current;

        // Procesar todos los resultados
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          const transcriptPart = result[0].transcript;

          if (result.isFinal) {
            final += transcriptPart + ' ';
          } else {
            interim += transcriptPart;
          }
        }

        finalTranscriptRef.current = final;
        setTranscript(final.trim());
        setInterimTranscript(interim);
      };

      // Evento de error
      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error:', event.error);
        
        let errorMessage = 'Error de reconocimiento de voz';
        
        switch (event.error) {
          case 'no-speech':
            errorMessage = 'No se detectó voz. Intenta hablar más cerca del micrófono.';
            break;
          case 'audio-capture':
            errorMessage = 'No se pudo acceder al micrófono. Verifica los permisos.';
            break;
          case 'not-allowed':
            errorMessage = 'Permiso de micrófono denegado.';
            break;
          case 'network':
            errorMessage = 'Error de red. Verifica tu conexión a Internet.';
            break;
          case 'aborted':
            errorMessage = 'Reconocimiento de voz abortado.';
            break;
          default:
            errorMessage = `Error: ${event.error}`;
        }

        setError(errorMessage);
        setIsListening(false);
        onError?.(errorMessage);
      };

      // Evento cuando termina
      recognition.onend = () => {
        setIsListening(false);
        onEnd?.();
      };

      // Evento cuando empieza
      recognition.onstart = () => {
        setError(null);
        setIsListening(true);
      };

      recognitionRef.current = recognition;
    } else {
      setIsSupported(false);
      console.warn('Web Speech API no soportada en este navegador');
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          // Ignorar errores al detener
        }
      }
    };
  }, [lang, continuous, interimResults, onError, onEnd]);

  const startListening = useCallback(() => {
    if (!recognitionRef.current) {
      const errorMsg = 'Reconocimiento de voz no disponible';
      setError(errorMsg);
      onError?.(errorMsg);
      return;
    }

    try {
      // Detener si ya está escuchando
      if (isListening) {
        recognitionRef.current.stop();
      }

      // Limpiar estado previo
      setError(null);
      finalTranscriptRef.current = '';
      setTranscript('');
      setInterimTranscript('');

      // Iniciar
      recognitionRef.current.start();
    } catch (error) {
      console.error('Error starting recognition:', error);
      const errorMsg = 'No se pudo iniciar el reconocimiento de voz';
      setError(errorMsg);
      onError?.(errorMsg);
    }
  }, [isListening, onError]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      try {
        recognitionRef.current.stop();
      } catch (error) {
        console.error('Error stopping recognition:', error);
      }
    }
  }, [isListening]);

  const resetTranscript = useCallback(() => {
    finalTranscriptRef.current = '';
    setTranscript('');
    setInterimTranscript('');
    setError(null);
  }, []);

  return {
    transcript,
    interimTranscript,
    isListening,
    isSupported,
    error,
    startListening,
    stopListening,
    resetTranscript,
    browserSupportsSpeechRecognition: isSupported,
  };
}

export default useVoiceRecognition;
