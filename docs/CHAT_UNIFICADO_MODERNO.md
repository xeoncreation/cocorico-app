# 🎙️ Chat Unificado Moderno - Documentación

## 📝 Descripción

El **Chat Unificado Moderno** es una interfaz conversacional avanzada inspirada en ChatGPT que integra 3 modos de interacción en una sola experiencia:

### 🎯 Tres Modos de Interacción

1. **💬 Modo Texto** (Default)
   - Chat tradicional con streaming de respuestas
   - Soporte para markdown
   - Historial de conversación
   - Sugerencias rápidas

2. **🎤 Modo Dictado**
   - Click en botón de micrófono en el input
   - Transcripción en tiempo real mientras hablas
   - Resultado se inserta en el campo de texto
   - Puedes editar antes de enviar
   - Usa Web Speech API (sin costo)

3. **📞 Modo Conversación de Voz**
   - Click en botón de teléfono
   - Pantalla completa con visualización de audio
   - Graba tu pregunta → Transcribe → Genera respuesta → Reproduce audio
   - Conversación natural como llamada telefónica
   - Usa Whisper (transcripción) + ElevenLabs (TTS)

---

## 🏗️ Arquitectura

### Componentes

```
src/
├── components/chat/
│   └── ModernUnifiedChat.tsx       # Componente principal
├── app/
│   ├── [locale]/chat-unificado/
│   │   └── page.tsx                # Página del chat
│   └── api/
│       ├── chat-unified/route.ts   # API texto (streaming)
│       └── voice-conversation/route.ts # API voz completa
├── hooks/
│   └── useVoiceRecognition.ts      # Hook Web Speech API
└── services/
    └── voice.ts                    # Servicios STT/TTS
```

### Flujo de Datos

#### Modo Texto:
```
Usuario escribe → useChat (Vercel AI SDK) → /api/chat-unified → OpenAI → Stream respuesta
```

#### Modo Dictado:
```
Usuario habla → Web Speech API → Transcripción → Input texto → Usuario edita/envía → Flujo texto normal
```

#### Modo Conversación:
```
Usuario habla → MediaRecorder → Blob audio → /api/voice-conversation
  ↓
  1. Whisper (OpenAI) transcribe audio
  2. GPT-4 genera respuesta
  3. ElevenLabs sintetiza voz (opcional)
  ↓
Cliente recibe: { transcription, response, audioUrl }
  ↓
Reproduce audio automáticamente (si audioEnabled)
```

---

## 🎨 UI/UX Features

### Indicadores Visuales

1. **Estado del chat**
   - `Tu asistente culinario` - Modo normal
   - `🎤 Dictando...` - Modo dictado activo
   - `🎙️ Conversación de voz activa` - Modo conversación

2. **Visualización de audio**
   - Círculo pulsante durante grabación
   - Barra de nivel de audio en tiempo real
   - Animaciones suaves con Framer Motion

3. **Botones inteligentes**
   - Micrófono (🎤) - Dentro del input para dictado
   - Teléfono (📞) - Derecha del input para conversación
   - Send (✉️) - Botón de envío tradicional
   - Audio (🔊/🔇) - Toggle en header para respuestas de audio

### Animaciones

- **Mensajes**: Fade in + scale al aparecer
- **Modo conversación**: Pantalla completa con gradient animado
- **Audio level**: Barra en tiempo real
- **Círculo de grabación**: Pulse effect basado en nivel de audio

---

## 🔧 Configuración

### Variables de Entorno Requeridas

```env
# OpenAI (Whisper + GPT)
OPENAI_API_KEY=sk-...

# ElevenLabs (TTS) - Opcional
ELEVENLABS_API_KEY=...

# Supabase (Auth + DB)
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

### Instalación de Dependencias

```bash
npm install @ai-sdk/react ai framer-motion lucide-react
```

---

## 📱 Uso

### Integración Básica

```tsx
import ModernUnifiedChat from "@/components/chat/ModernUnifiedChat";

export default function ChatPage() {
  return (
    <ModernUnifiedChat 
      locale="es" 
      apiEndpoint="/api/chat-unified"
    />
  );
}
```

### Props

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `locale` | `string` | `'es'` | Idioma del chat ('es', 'en') |
| `apiEndpoint` | `string` | `'/api/chat-unified'` | Endpoint de API para texto |

---

## 🎤 APIs

### POST /api/chat-unified
**Streaming de respuestas de texto**

```typescript
// Request
{
  text: string;
  metadata?: {
    inputType: 'text' | 'voice-dictated';
    locale: string;
  }
}

// Response (Stream)
// Server-sent events con tokens de respuesta
```

### POST /api/voice-conversation
**Conversación de voz completa**

```typescript
// Request (FormData)
{
  audio: File;              // Audio blob (.webm)
  requestAudio: boolean;    // Si quiere respuesta en audio
  locale: string;           // 'es' o 'en'
}

// Response
{
  success: boolean;
  transcription: string;    // Lo que dijo el usuario
  response: string;         // Respuesta de la IA en texto
  audioUrl?: string;        // Data URL del audio (base64)
  hasAudio: boolean;        // Si incluye audio
}
```

---

## 🎯 Guía de Usuario

### Cómo usar cada modo:

#### 💬 Modo Texto (Default)
1. Escribe tu mensaje en el input
2. Presiona Enter o click en el botón de envío
3. La respuesta aparece con streaming en tiempo real

#### 🎤 Modo Dictado
1. Click en el icono de micrófono (🎤) dentro del input
2. Habla tu mensaje (aparece transcripción en tiempo real)
3. El texto se inserta automáticamente en el input
4. Puedes editar antes de enviar
5. Click en el botón de envío o Enter

#### 📞 Modo Conversación de Voz
1. Click en el icono de teléfono (📞) a la derecha del input
2. Pantalla completa con grabación activada
3. Habla tu pregunta naturalmente
4. Click en "Detener conversación"
5. El sistema transcribe, genera respuesta y la reproduce automáticamente
6. Si tienes audio activado (🔊), escucharás la respuesta

### Toggle de Audio
- Click en 🔊 (header derecho) para activar respuestas de audio
- Click en 🔇 para desactivar (solo texto)

---

## 🚀 Mejoras Futuras

### Corto Plazo
- [ ] Persistencia de historial en Supabase
- [ ] Detección automática de fin de frase (VAD)
- [ ] Cancelar respuesta en streaming
- [ ] Copy/paste de mensajes
- [ ] Exportar conversación

### Medio Plazo
- [ ] Modo conversación continua (sin stop manual)
- [ ] Múltiples voces (selección de voz TTS)
- [ ] Soporte para más idiomas
- [ ] Compartir conversación (URL pública)
- [ ] Markdown mejorado con syntax highlighting

### Largo Plazo
- [ ] Voice Activity Detection (VAD) profesional
- [ ] Conversación duplex (interrupciones)
- [ ] Multi-modal (imágenes + voz + texto)
- [ ] Agent con tools (buscar recetas, timers, etc.)
- [ ] Análisis de sentimientos en voz

---

## 🔒 Seguridad

### Implementado
✅ Rate limiting en endpoints de voz (20 req/min)  
✅ Autenticación requerida para APIs  
✅ Validación de archivos de audio  
✅ API keys server-side only  
✅ CORS configurado  

### Recomendaciones
- Monitorear uso de Whisper (costo por minuto)
- Limitar duración de grabaciones (max 5 min)
- Implementar quotas por usuario
- Cache de respuestas frecuentes

---

## 📊 Costos Estimados

### Por 1000 conversaciones de voz:

| Servicio | Costo | Notas |
|----------|-------|-------|
| **Whisper** (1 min avg) | $0.60 | $0.006/min |
| **GPT-4o-mini** | $0.15 | Asumiendo 500 tokens input + 1000 output |
| **ElevenLabs TTS** (30s avg) | $3.00 | $0.30/1000 chars, ~100 chars avg |
| **Total** | **~$3.75** | Por 1000 conversaciones completas |

### Optimizaciones:
- Usar `gpt-3.5-turbo` reduce 70% el costo de GPT
- Deshabilitar TTS reduce 80% del costo total
- Web Speech API (dictado) es **gratis** (corre en browser)

---

## 🐛 Troubleshooting

### El micrófono no funciona
- **Causa**: Permisos de navegador
- **Solución**: Verificar que el sitio tenga permisos de micrófono en `chrome://settings/content/microphone`

### Transcripción incorrecta
- **Causa**: Ruido de fondo, acento, mala dicción
- **Solución**: Hablar claro, cerca del micrófono, ambiente silencioso

### Sin respuesta de audio
- **Causa**: `ELEVENLABS_API_KEY` no configurada o audio desactivado
- **Solución**: 
  1. Verificar variable de entorno
  2. Click en 🔊 para activar audio

### Rate limit exceeded
- **Causa**: Más de 20 peticiones en 1 minuto
- **Solución**: Esperar 1 minuto o ajustar límites en `RateLimitPresets.ai`

---

## 📞 Soporte

**Documentación adicional:**
- [PLAN_CHAT_UNIFICADO_Y_AGENTE_IA.md](./PLAN_CHAT_UNIFICADO_Y_AGENTE_IA.md)
- [SECURITY.md](./SECURITY.md)

**Issues conocidos:**
- Safari iOS: Web Speech API limitado
- Firefox: Requiere prefijo `moz` para algunas APIs

**Reportar bugs:**
- GitHub Issues: `xeoncreation/cocorico-app`
- Email: dev@cocorico.app

---

## ✅ Checklist de Despliegue

Antes de ir a producción:

- [ ] Configurar `ELEVENLABS_API_KEY` en Vercel
- [ ] Verificar rate limits apropiados
- [ ] Probar en Chrome, Safari, Firefox
- [ ] Probar en móvil (iOS + Android)
- [ ] Documentar para usuarios finales
- [ ] Monitorear costos de Whisper/ElevenLabs
- [ ] Setup alerts para errores 5xx
- [ ] Backup/restore de conversaciones importantes

---

**Versión:** 1.0.0  
**Última actualización:** 10 diciembre 2025  
**Autor:** Equipo Cocorico
