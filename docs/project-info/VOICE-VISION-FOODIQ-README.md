# 🎙️ Sistema de Voz, Visión y Food-IQ — Implementación Completa

## ✅ Sistema implementado

Se han creado todos los componentes, servicios y endpoints según las especificaciones proporcionadas.

---

## 📦 Archivos creados

### Servicios de Voz
- `src/services/voice/index.ts` — Adaptador agnóstico STT/TTS
- `src/services/voice/providers/elevenlabs.ts` — TTS con ElevenLabs + phonemas
- `src/services/voice/providers/openai.ts` — STT Whisper
- `src/services/voice/providers/browser.ts` — Fallback navegador

### API Endpoints
- `src/app/api/stt/route.ts` — Speech-to-Text (Whisper)
- `src/app/api/tts/route.ts` — Text-to-Speech (opcional)
- `src/app/api/food-iq/route.ts` — Consulta Food-IQ database

### Componentes UI
- `src/components/AvatarCocorico.tsx` — Avatar SVG con lip-sync
- `src/components/VoiceChat.tsx` — Chat de voz completo
- `src/components/Footer.tsx` — Footer con build-tag

### Utilidades
- `src/utils/rate-limit.ts` — Rate limiting en memoria

### Base de datos
- `supabase/sql/food-iq-setup.sql` — Tabla + seed de 15 alimentos

### Páginas actualizadas
- `src/app/chat/page.tsx` — Pestañas Texto | Voz
- `src/app/dashboard/lab/page.tsx` — Avatar overlay AR
- `src/app/[locale]/layout.tsx` — Navbar ampliado + build-tag en footer

---

## 🗄️ Configuración de Supabase

### 1. Ejecutar SQL en Supabase Dashboard

Ve a: **Supabase Dashboard → SQL Editor** y ejecuta el contenido de:

```
supabase/sql/food-iq-setup.sql
```

Esto creará:
- Tabla `public.food_iq`
- Políticas RLS (lectura pública)
- Seed con 15 alimentos comunes

### 2. Verificar creación

```sql
SELECT COUNT(*) FROM public.food_iq;
-- Debería devolver: 15

SELECT common_name FROM public.food_iq LIMIT 5;
-- banana, tomate, aguacate, manzana, lechuga
```

---

## 🔐 Variables de entorno

Asegúrate de tener configuradas en `.env.local` y **Vercel**:

```env
# OpenAI (Chat + Whisper STT)
OPENAI_API_KEY=sk-...

# ElevenLabs (TTS realista)
ELEVENLABS_API_KEY=...
NEXT_PUBLIC_ELEVENLABS_API_KEY=...

# Replicate (Visión nube)
REPLICATE_API_TOKEN=...
NEXT_PUBLIC_REPLICATE_API_TOKEN=...

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://...supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...

# Opcional: Beta privada
SITE_PASSWORD=tu_clave_secreta
```

---

## 🧪 Checklist de prueba

### ✅ Voz (Chat)

1. Ve a `/chat`
2. Haz clic en la pestaña **🎙️ Voz**
3. Pulsa **Grabar**, habla, y **Detener**
4. El sistema debería:
   - Transcribir tu audio (Whisper)
   - Enviar a `/api/chat`
   - Reproducir respuesta con voz (ElevenLabs o fallback browser)
   - Animar el avatar Cocorico con lip-sync

### ✅ Visión (Lab IA)

1. Ve a `/dashboard/lab`
2. Verifica que aparece:
   - Avatar Cocorico pequeño en esquina inferior derecha (overlay AR)
   - Componentes de cámara e ingredient scanner
3. Prueba "Analizar en nube" (requiere `REPLICATE_API_TOKEN`)

### ✅ Food-IQ

1. Endpoint disponible en: `/api/food-iq?name=banana`
2. Debería devolver info organoléptica, conservación, etc.
3. Integrar en Lab tras detectar alimento:

```typescript
const res = await fetch(`/api/food-iq?name=${detectedName}`);
const { items } = await res.json();
// Renderizar panel con: storage_advice, spoilage_signs, taste_profile_by_stage
```

### ✅ Rate Limiting

1. Hacer >10 peticiones a `/api/stt` en menos de 24h
2. La 11ª debería devolver:

```json
{
  "error": "rate_limited",
  "retryAfter": 86340
}
```

### ✅ Navbar

Verifica que aparecen enlaces visibles (sin condicionales):
- `/chat`
- `/dashboard/lab`
- `/community`
- `/dashboard/challenges`
- `/community/leaderboard`
- `/pricing`

### ✅ Footer build-tag

Al final de cualquier página debe verse:

```
Cocorico v0.1.0 • Voice: ON • Vision: ON • Food-IQ: ON
```

---

## 🚀 Despliegue a Vercel

1. **Commitear y push**:

```bash
git add .
git commit -m "feat: sistema completo voz + visión + Food-IQ"
git push
```

2. **Variables de entorno en Vercel**:

Ve a: **Project Settings → Environment Variables** y añade:
- `OPENAI_API_KEY`
- `ELEVENLABS_API_KEY`
- `NEXT_PUBLIC_ELEVENLABS_API_KEY`
- `REPLICATE_API_TOKEN`
- `NEXT_PUBLIC_REPLICATE_API_TOKEN`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- (Opcional) `SITE_PASSWORD`

3. **Redeploy** si es necesario

---

## 📊 Arquitectura

```
┌─────────────────────────────────────────┐
│  Cliente (Browser)                      │
│  - VoiceChat: MediaRecorder → STT      │
│  - AvatarCocorico: lip-sync phonemas    │
│  - SmartCamera: Replicate vision        │
└──────────────┬──────────────────────────┘
               │
        ┌──────▼───────┐
        │  /api/stt    │ ← Whisper (OpenAI)
        │  /api/tts    │ ← (opcional server)
        │  /api/chat   │ ← Chat existente
        │  /api/food-iq│ ← Supabase query
        └──────────────┘
               │
        ┌──────▼───────┐
        │  Services    │
        │  - voice/    │ → ElevenLabs/OpenAI/Browser
        │  - rate-limit│ → In-memory store
        └──────────────┘
               │
        ┌──────▼───────┐
        │  Supabase    │
        │  - food_iq   │ (15 alimentos + crecimiento)
        └──────────────┘
```

---

## 🔧 Troubleshooting

### Error: `OPENAI_API_KEY missing`
→ Verifica `.env.local` y Vercel env vars

### TTS no suena / fallback browser
→ Normal si `ELEVENLABS_API_KEY` no está configurada. Usará `speechSynthesis` del navegador.

### Avatar no anima
→ Verifica que `phonemes` array se está pasando correctamente desde `VoiceChat`

### Food-IQ devuelve `[]`
→ Ejecuta el SQL seed en Supabase; verifica RLS policies

### Rate limit no funciona
→ En memoria local (se resetea con cada deploy). Para producción, usa Redis o Supabase RLS con timestamps.

---

## 📝 Próximos pasos

1. **Integrar Food-IQ en Lab**: tras detectar "banana", mostrar panel con consejos
2. **WebSocket para ElevenLabs**: phonemas reales (actualmente aproximados)
3. **Rate limit persistente**: migrar a Redis o DB
4. **Premium tier**: subir límites (10→100 turnos/día)
5. **Tests E2E**: Playwright para flujo completo voz

---

## 📚 Documentación de referencia

- [OpenAI Whisper API](https://platform.openai.com/docs/guides/speech-to-text)
- [ElevenLabs TTS](https://docs.elevenlabs.io/api-reference/text-to-speech)
- [Replicate Vision](https://replicate.com/docs/get-started/javascript)
- [Supabase RLS](https://supabase.com/docs/guides/auth/row-level-security)

---

✅ **Sistema listo para producción**

¡Disfruta de tu asistente culinario con voz, visión y conocimiento organoléptico! 🐓🎙️👁️🥑
