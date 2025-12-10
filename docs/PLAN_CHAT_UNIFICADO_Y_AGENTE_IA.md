# Plan de Desarrollo: Chat Unificado + Agente IA de Asistencia

## 📋 Resumen Ejecutivo

Este documento detalla el plan completo para:
1. **Unificar chat de texto y voz** en una interfaz única tipo ChatGPT
2. **Crear un agente IA de asistencia** para usuarios con capacidad de resolución de problemas y alertas automáticas

---

## 🎯 Fase 1: Chat Unificado (Texto + Voz)

### 1.1 Análisis de ChatGPT

**Características clave estudiadas:**
- Interfaz minimalista con sidebar colapsable
- Conversación continua en un solo thread
- Botón de voz integrado en el input
- Transcripción en tiempo real mientras hablas
- Historial persistente con scroll infinito
- Indicadores visuales de estado (escribiendo, escuchando, procesando)

### 1.2 Arquitectura Propuesta

```
┌─────────────────────────────────────────┐
│         ChatUnified Component           │
│  ┌───────────────────────────────────┐  │
│  │      Message List (Scroll)        │  │
│  │  ┌─────────────────────────────┐  │  │
│  │  │  User Message               │  │  │
│  │  │  [Texto o transcripción]    │  │  │
│  │  └─────────────────────────────┘  │  │
│  │  ┌─────────────────────────────┐  │  │
│  │  │  Assistant Message          │  │  │
│  │  │  [Streaming response]       │  │  │
│  │  └─────────────────────────────┘  │  │
│  └───────────────────────────────────┘  │
│  ┌───────────────────────────────────┐  │
│  │  Input Bar (Fixed Bottom)         │  │
│  │  [TextField]  [🎤] [📎] [Send]   │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

### 1.3 Stack Tecnológico Recomendado

**Para Chat Unificado:**
- **Vercel AI SDK 4.x** (ya instalado)
  - `useChat` hook con streaming
  - `streamText` para respuestas en tiempo real
  - Manejo automático de estado y mensajes
  
- **OpenAI Realtime API** (para voz)
  - WebSocket bidireccional
  - Transcripción automática
  - Síntesis de voz (TTS)
  - Detección de actividad de voz (VAD)

- **Web Speech API** (fallback)
  - `SpeechRecognition` para transcripción
  - `SpeechSynthesis` para TTS
  - Soporte nativo del navegador

**Modelo Recomendado:**
- **GPT-4o** (multimodal, soporta audio nativo)
- Fallback: **GPT-4 Turbo** + Whisper API

### 1.4 Implementación del Chat Unificado

#### Componente Principal: `ChatUnified.tsx`

```typescript
// src/components/chat/ChatUnified.tsx
'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Send, Paperclip } from 'lucide-react';
import { useVoiceRecognition } from '@/hooks/useVoiceRecognition';
import MessageList from './MessageList';
import InputBar from './InputBar';

export default function ChatUnified() {
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ 
      api: '/api/chat-unified' 
    }),
  });

  const {
    transcript,
    isListening,
    startListening,
    stopListening,
    resetTranscript
  } = useVoiceRecognition();

  // Sincronizar transcripción con input
  useEffect(() => {
    if (transcript) {
      setInput(transcript);
    }
  }, [transcript]);

  const handleVoiceToggle = () => {
    if (isListening) {
      stopListening();
      setIsRecording(false);
    } else {
      startListening();
      setIsRecording(true);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    sendMessage({ 
      text: input,
      metadata: { 
        inputType: isRecording ? 'voice' : 'text' 
      }
    });
    
    setInput('');
    resetTranscript();
  };

  return (
    <div className="flex flex-col h-screen">
      <MessageList messages={messages} status={status} />
      
      <InputBar
        input={input}
        setInput={setInput}
        isRecording={isRecording}
        onVoiceToggle={handleVoiceToggle}
        onSubmit={handleSubmit}
        disabled={status !== 'ready'}
      />
    </div>
  );
}
```

#### Hook de Reconocimiento de Voz

```typescript
// src/hooks/useVoiceRecognition.ts
import { useState, useEffect, useRef } from 'react';

export function useVoiceRecognition() {
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition = 
      window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'es-ES';

    recognition.onresult = (event) => {
      const results = Array.from(event.results);
      const transcript = results
        .map(result => result[0].transcript)
        .join('');
      setTranscript(transcript);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
    };
  }, []);

  const startListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const resetTranscript = () => {
    setTranscript('');
  };

  return {
    transcript,
    isListening,
    startListening,
    stopListening,
    resetTranscript,
    isSupported: !!recognitionRef.current
  };
}
```

#### API Route

```typescript
// src/app/api/chat-unified/route.ts
import { openai } from '@ai-sdk/openai';
import { streamText, convertToModelMessages } from 'ai';

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: openai('gpt-4o'), // Soporta audio y texto
    system: `Eres Cocorico, un asistente culinario amigable y experto.
    Ayudas a los usuarios con recetas, técnicas de cocina, y consejos nutricionales.
    Respondes de forma concisa y útil.`,
    messages: convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
}
```

---

## 🤖 Fase 2: Agente IA de Asistencia y Monitoreo

### 2.1 Características del Agente

**Funciones principales:**
1. **Asistencia Proactiva**
   - Guiar usuarios en uso de la app
   - Responder preguntas sobre funcionalidades
   - Sugerir mejores prácticas

2. **Detección de Problemas**
   - Monitorear errores en cliente (React Error Boundary)
   - Capturar excepciones de API
   - Detectar patrones de comportamiento anómalo
   - Analizar logs en tiempo real

3. **Resolución Automática**
   - Reintentos inteligentes de requests fallidos
   - Clear cache cuando sea apropiado
   - Sugerencias contextuales de solución

4. **Sistema de Alertas**
   - Enviar emails al dev cuando detecta problemas críticos
   - Incluir contexto completo del error
   - Sugerir posibles causas y soluciones

### 2.2 Modelo Recomendado para el Agente

Después de investigar, el mejor modelo es:

**🏆 GPT-4o + Function Calling**

**Razones:**
- Multimodal (puede analizar screenshots, logs, texto)
- Function calling nativo para ejecutar acciones
- Context window de 128k tokens (puede analizar mucho contexto)
- Mejor razonamiento para debugging
- Latencia baja (~500ms)

**Alternativa económica:**
- **GPT-4o-mini** para consultas simples
- **GPT-4o** solo para análisis complejos de errores

### 2.3 Arquitectura del Agente

```
┌──────────────────────────────────────────────────┐
│              Application Layer                    │
│  ┌──────────────────────────────────────────┐   │
│  │  React Components                        │   │
│  │  - ErrorBoundary                         │   │
│  │  - useAgentMonitor hook                  │   │
│  └────────────┬────────────────────────────┘   │
│               │ Eventos                          │
│               ▼                                  │
│  ┌──────────────────────────────────────────┐   │
│  │  Agent Service                           │   │
│  │  - Recolecta eventos                     │   │
│  │  - Analiza patrones                      │   │
│  │  - Decide acciones                       │   │
│  └────────────┬────────────────────────────┘   │
│               │ API Calls                        │
│               ▼                                  │
│  ┌──────────────────────────────────────────┐   │
│  │  Agent API Endpoint                      │   │
│  │  /api/agent/analyze                      │   │
│  │  /api/agent/resolve                      │   │
│  │  /api/agent/alert                        │   │
│  └────────────┬────────────────────────────┘   │
│               │                                  │
│               ▼                                  │
│  ┌──────────────────────────────────────────┐   │
│  │  AI Model (GPT-4o)                       │   │
│  │  - Analiza errores                       │   │
│  │  - Genera soluciones                     │   │
│  │  - Tools: email, cache, retry, log       │   │
│  └────────────┬────────────────────────────┘   │
│               │                                  │
│               ▼                                  │
│  ┌──────────────────────────────────────────┐   │
│  │  Actions                                 │   │
│  │  - Enviar email (Resend)                │   │
│  │  - Log a DB (Supabase)                  │   │
│  │  - Execute fix                          │   │
│  └──────────────────────────────────────────┘   │
└──────────────────────────────────────────────────┘
```

### 2.4 Implementación del Agente

#### Sistema de Monitoreo Global

```typescript
// src/lib/agent/agent-monitor.ts
import { supabase } from '@/app/lib/supabase-client';

export interface ErrorEvent {
  id: string;
  timestamp: number;
  type: 'error' | 'warning' | 'info';
  component?: string;
  message: string;
  stack?: string;
  userAgent: string;
  url: string;
  userId?: string;
  metadata?: Record<string, any>;
}

class AgentMonitor {
  private events: ErrorEvent[] = [];
  private readonly maxEvents = 100;
  
  async captureError(error: Error, metadata?: Record<string, any>) {
    const event: ErrorEvent = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      type: 'error',
      message: error.message,
      stack: error.stack,
      userAgent: navigator.userAgent,
      url: window.location.href,
      metadata,
    };

    this.events.push(event);
    
    // Mantener solo últimos N eventos
    if (this.events.length > this.maxEvents) {
      this.events.shift();
    }

    // Analizar si es crítico
    if (this.isCriticalError(error)) {
      await this.handleCriticalError(event);
    }

    // Guardar en DB
    await this.saveEvent(event);
  }

  private isCriticalError(error: Error): boolean {
    const criticalPatterns = [
      /database/i,
      /authentication/i,
      /payment/i,
      /network/i,
      /unhandled/i,
    ];
    
    return criticalPatterns.some(pattern => 
      pattern.test(error.message)
    );
  }

  private async handleCriticalError(event: ErrorEvent) {
    // Llamar al agente IA para análisis
    const response = await fetch('/api/agent/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event,
        recentEvents: this.events.slice(-10), // Últimos 10 eventos
      }),
    });

    const { shouldAlert, analysis, suggestedFix } = await response.json();

    if (shouldAlert) {
      await this.sendAlert({
        event,
        analysis,
        suggestedFix,
      });
    }
  }

  private async sendAlert(data: {
    event: ErrorEvent;
    analysis: string;
    suggestedFix: string;
  }) {
    await fetch('/api/agent/alert', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  }

  private async saveEvent(event: ErrorEvent) {
    try {
      await supabase.from('agent_events').insert({
        ...event,
        created_at: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Failed to save event:', error);
    }
  }

  getRecentEvents(limit = 20): ErrorEvent[] {
    return this.events.slice(-limit);
  }
}

export const agentMonitor = new AgentMonitor();
```

#### Error Boundary Mejorado

```typescript
// src/components/ErrorBoundary.tsx
import React from 'react';
import { agentMonitor } from '@/lib/agent/agent-monitor';

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Capturar con el agente
    agentMonitor.captureError(error, {
      componentStack: errorInfo.componentStack,
      type: 'react-error-boundary',
    });
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
          <h1 className="text-2xl font-bold mb-4">
            Algo salió mal 😞
          </h1>
          <p className="text-neutral-600 mb-4">
            Nuestro agente IA está analizando el problema
          </p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="px-4 py-2 bg-cocorico-red text-white rounded"
          >
            Intentar de nuevo
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

#### API Endpoint del Agente

```typescript
// src/app/api/agent/analyze/route.ts
import { openai } from '@ai-sdk/openai';
import { generateObject } from 'ai';
import { z } from 'zod';

export async function POST(req: Request) {
  const { event, recentEvents } = await req.json();

  const { object } = await generateObject({
    model: openai('gpt-4o'),
    schema: z.object({
      severity: z.enum(['low', 'medium', 'high', 'critical']),
      shouldAlert: z.boolean(),
      analysis: z.string(),
      suggestedFix: z.string(),
      possibleCauses: z.array(z.string()),
      relatedEvents: z.array(z.string()),
    }),
    system: `Eres un agente IA experto en debugging de aplicaciones Next.js + React + Supabase.
    Analiza errores, identifica patrones, y sugiere soluciones.
    Solo marca shouldAlert=true si el error es crítico y requiere atención inmediata del desarrollador.`,
    prompt: `Analiza este error y los eventos recientes:
    
ERROR:
${JSON.stringify(event, null, 2)}

EVENTOS RECIENTES:
${JSON.stringify(recentEvents, null, 2)}

Determina:
1. ¿Es un error crítico que requiere alerta al desarrollador?
2. ¿Cuál es la causa probable?
3. ¿Qué se puede hacer automáticamente para resolverlo?
4. ¿Hay patrones en los eventos recientes?`,
  });

  return Response.json(object);
}
```

#### Sistema de Alertas por Email

```typescript
// src/app/api/agent/alert/route.ts
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const { event, analysis, suggestedFix } = await req.json();

  const emailHtml = `
    <h1>🚨 Alerta del Agente IA - Cocorico</h1>
    
    <h2>Error Detectado</h2>
    <p><strong>Mensaje:</strong> ${event.message}</p>
    <p><strong>Componente:</strong> ${event.component || 'N/A'}</p>
    <p><strong>URL:</strong> ${event.url}</p>
    <p><strong>Timestamp:</strong> ${new Date(event.timestamp).toISOString()}</p>
    
    <h2>Análisis del Agente IA</h2>
    <p>${analysis}</p>
    
    <h2>Solución Sugerida</h2>
    <pre>${suggestedFix}</pre>
    
    <h2>Stack Trace</h2>
    <pre>${event.stack}</pre>
    
    <hr>
    <p><small>Este mensaje fue generado automáticamente por el Agente IA de Cocorico</small></p>
  `;

  try {
    await resend.emails.send({
      from: 'Agente IA Cocorico <agent@cocorico.app>',
      to: 'xeontheconcept@gmail.com',
      subject: `🚨 Error Crítico: ${event.message.substring(0, 50)}...`,
      html: emailHtml,
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error('Failed to send alert email:', error);
    return Response.json({ success: false, error }, { status: 500 });
  }
}
```

#### Chat del Agente de Asistencia

```typescript
// src/components/agent/AgentChat.tsx
'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { Bot } from 'lucide-react';

export default function AgentChat() {
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ 
      api: '/api/agent/chat' 
    }),
    initialMessages: [{
      id: '0',
      role: 'assistant',
      parts: [{
        type: 'text',
        text: '¡Hola! Soy el agente de asistencia de Cocorico 🐓. ¿En qué puedo ayudarte hoy?'
      }]
    }],
  });

  return (
    <div className="fixed bottom-4 right-4 w-96 h-[600px] bg-white rounded-2xl shadow-2xl border border-neutral-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-neutral-200 flex items-center gap-2">
        <Bot className="w-6 h-6 text-cocorico-red" />
        <div>
          <h3 className="font-semibold">Asistente Cocorico</h3>
          <p className="text-xs text-neutral-500">Siempre listo para ayudar</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                msg.role === 'user'
                  ? 'bg-cocorico-red text-white'
                  : 'bg-neutral-100 text-neutral-900'
              }`}
            >
              {msg.parts.map((part, i) => (
                part.type === 'text' && (
                  <p key={i} className="text-sm">{part.text}</p>
                )
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const input = e.currentTarget.elements.namedItem('message') as HTMLInputElement;
          sendMessage({ text: input.value });
          input.value = '';
        }}
        className="p-4 border-t border-neutral-200"
      >
        <input
          name="message"
          placeholder="Escribe tu pregunta..."
          className="w-full px-4 py-2 border border-neutral-300 rounded-full focus:outline-none focus:ring-2 focus:ring-cocorico-red"
          disabled={status !== 'ready'}
        />
      </form>
    </div>
  );
}
```

```typescript
// src/app/api/agent/chat/route.ts
import { openai } from '@ai-sdk/openai';
import { streamText, tool } from 'ai';
import { z } from 'zod';
import { agentMonitor } from '@/lib/agent/agent-monitor';

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: openai('gpt-4o'),
    system: `Eres el agente de asistencia de Cocorico, una app de cocina con IA.
    
TU ROL:
- Ayudar a los usuarios con cualquier duda sobre la app
- Explicar funcionalidades: chat, análisis, recetas, comunidad
- Guiar en el uso de herramientas
- Si el usuario pregunta algo NO relacionado con la app, responde brevemente y redirige sutilmente el tema a Cocorico

FUNCIONALIDADES DE LA APP:
1. Chat Unificado: hablar o escribir con el asistente culinario
2. Análisis: escanear alimentos y ver información nutricional
3. Mis Recetas: guardar y organizar recetas favoritas
4. Comunidad: compartir y descubrir recetas de otros usuarios
5. Premium: funciones avanzadas (planeador de menús, análisis detallado, etc.)

TONO: Amigable, cercano, útil, sin ser intrusivo`,
    messages,
    tools: {
      checkAppStatus: tool({
        description: 'Verificar el estado actual de la aplicación y detectar problemas',
        parameters: z.object({}),
        execute: async () => {
          const recentEvents = agentMonitor.getRecentEvents(5);
          const hasErrors = recentEvents.some(e => e.type === 'error');
          
          return {
            status: hasErrors ? 'warning' : 'healthy',
            recentErrors: recentEvents.filter(e => e.type === 'error').length,
            message: hasErrors 
              ? 'He detectado algunos errores recientes. Estoy trabajando en resolverlos.' 
              : 'Todo funciona correctamente.'
          };
        },
      }),
      
      getUserContext: tool({
        description: 'Obtener contexto del usuario actual para personalizar la ayuda',
        parameters: z.object({}),
        execute: async () => {
          // Aquí podrías obtener datos reales del usuario
          return {
            isPremium: false,
            lastUsedFeature: 'chat',
            totalRecipes: 12,
          };
        },
      }),
    },
  });

  return result.toUIMessageStreamResponse();
}
```

---

## 📦 Fase 3: Dependencias y Configuración

### 3.1 Packages Necesarios

```json
{
  "dependencies": {
    // Ya tienes
    "ai": "^4.0.0",
    "@ai-sdk/openai": "^1.0.0",
    "@ai-sdk/react": "^1.0.0",
    
    // Agregar
    "resend": "^3.0.0",
    "zod": "^3.22.4"
  }
}
```

### 3.2 Variables de Entorno

```env
# .env.local

# OpenAI (ya tienes)
OPENAI_API_KEY=sk-...

# Resend para emails
RESEND_API_KEY=re_...

# Email del desarrollador
DEV_EMAIL=xeontheconcept@gmail.com
```

### 3.3 Tabla de Supabase para Eventos

```sql
-- Crear tabla para eventos del agente
CREATE TABLE agent_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  timestamp BIGINT NOT NULL,
  type VARCHAR(20) NOT NULL,
  component VARCHAR(255),
  message TEXT NOT NULL,
  stack TEXT,
  user_agent TEXT,
  url TEXT,
  user_id UUID REFERENCES auth.users(id),
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  INDEX idx_timestamp (timestamp DESC),
  INDEX idx_type (type),
  INDEX idx_user_id (user_id)
);

-- Habilitar RLS
ALTER TABLE agent_events ENABLE ROW LEVEL SECURITY;

-- Solo el backend puede insertar
CREATE POLICY "Service role can insert events"
  ON agent_events FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Solo admins pueden leer
CREATE POLICY "Admins can read events"
  ON agent_events FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid()
      AND raw_user_meta_data->>'role' = 'admin'
    )
  );
```

---

## 🚀 Fase 4: Plan de Implementación

### Sprint 1: Chat Unificado (1 semana)
- [ ] Día 1-2: Implementar `useVoiceRecognition` hook
- [ ] Día 3-4: Crear componente `ChatUnified` con UI
- [ ] Día 5: Integrar transcripción en tiempo real
- [ ] Día 6-7: Testing y ajustes de UX

### Sprint 2: Agente de Monitoreo (1 semana)
- [ ] Día 1-2: Implementar `AgentMonitor` class
- [ ] Día 3-4: Crear API endpoints `/api/agent/*`
- [ ] Día 5: Integrar Resend para emails
- [ ] Día 6-7: Crear tabla en Supabase y testing

### Sprint 3: Agente de Asistencia (3-4 días)
- [ ] Día 1-2: Crear componente `AgentChat`
- [ ] Día 3: Implementar tools del agente
- [ ] Día 4: Testing y refinamiento del sistema prompt

### Sprint 4: Integración y Pulido (2-3 días)
- [ ] Integrar todo en la app principal
- [ ] Agregar botón flotante del agente
- [ ] Testing end-to-end
- [ ] Deploy a producción

**Total estimado: 3-4 semanas**

---

## 💰 Costos Estimados

### OpenAI API
- **GPT-4o**: $2.50 / 1M tokens input, $10 / 1M output
- **Estimado mensual**: $50-100 (uso moderado)

### Resend (Emails)
- **Gratis**: 100 emails/día
- **Pro ($20/mes)**: 50,000 emails/mes

### Total mensual: ~$70-120

---

## 📊 Métricas de Éxito

1. **Chat Unificado**
   - 90%+ de mensajes enviados exitosamente
   - <500ms latencia de respuesta
   - 95%+ satisfacción de usuarios

2. **Agente IA**
   - Detectar 95%+ de errores críticos
   - <5 min tiempo de alerta al dev
   - 80%+ de resoluciones automáticas exitosas
   - <10 falsos positivos por semana

---

## 🔄 Próximos Pasos

1. **Revisar este plan** y aprobar
2. **Instalar dependencias** nuevas
3. **Crear rama** `feature/chat-unified-agent`
4. **Empezar Sprint 1** con el chat unificado
5. **Iterar** basado en feedback

---

## 📝 Notas Adicionales

### Mejoras Futuras
- Integrar análisis de sentimiento
- Dashboard de métricas del agente
- Auto-healing más avanzado
- Integración con Sentry o similar
- Conversión de voz a voz (sin transcripción intermedia) con GPT-4o Realtime

### Recursos de Referencia
- [Vercel AI SDK Docs](https://sdk.vercel.ai/docs)
- [OpenAI Realtime API](https://platform.openai.com/docs/guides/realtime)
- [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)
- [Resend Docs](https://resend.com/docs)

---

**Autor**: GitHub Copilot con Claude Sonnet 4.5
**Fecha**: 9 de diciembre de 2025
**Versión**: 1.0
