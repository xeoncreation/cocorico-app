# Security Hardening Guide for Cocorico

Este documento detalla las medidas de seguridad implementadas y recomendadas para Cocorico App.

## ✅ Implementado

### 1. Validación con Zod

**Archivo:** `src/lib/validation.ts`

Todos los endpoints API ahora validan inputs con Zod schemas:

```tsx
// ✅ Antes (vulnerable a inyección)
const { ingredients } = await req.json();

// ✅ Después (validado y type-safe)
const validation = await validateRequest(AIRecipeRequestSchema, body);
if (!validation.success) {
  return NextResponse.json({ error: validation.error }, { status: 400 });
}
const { ingredients } = validation.data; // Type-safe!
```

**Schemas creados:**
- `AIRecipeRequestSchema` - `/api/ai/recipes`
- `BarcodeSchema` - `/api/scan/[barcode]`
- `RecipeSchema` - `/api/recipes` (CRUD)
- `ChatMessageSchema` - `/api/chat/messages`
- `ProfileUpdateSchema` - `/api/profile`
- `RecipeSearchSchema` - `/api/recipes/search`
- `RecipeRatingSchema` - `/api/recipes/[id]/rate`
- `StripePaymentSchema` - `/api/stripe/*`
- `ReportSchema` - `/api/report`

**Protecciones:**
- Límites de longitud de strings
- Regex patterns para prevenir XSS
- Type coercion segura
- Sanitización de HTML en inputs de usuario

### 2. RLS Policies en Supabase

**Archivo:** `supabase/migrations/20240115_community_chat.sql`

Row Level Security activado en todas las tablas:

#### `community_messages`
```sql
-- Usuarios autenticados pueden leer mensajes
CREATE POLICY "Authenticated users can read messages"
  ON community_messages FOR SELECT
  TO authenticated USING (true);

-- Usuarios solo pueden insertar sus propios mensajes
CREATE POLICY "Users can insert own messages"
  ON community_messages FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

-- Usuarios solo pueden actualizar sus propios mensajes
CREATE POLICY "Users can update own messages"
  ON community_messages FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Usuarios solo pueden eliminar sus propios mensajes
CREATE POLICY "Users can delete own messages"
  ON community_messages FOR DELETE
  TO authenticated USING (auth.uid() = user_id);
```

#### `recipes`
```sql
-- Público puede leer recetas públicas
CREATE POLICY "Public recipes are viewable by everyone"
  ON recipes FOR SELECT
  USING (visibility = 'public');

-- Usuarios pueden ver sus propias recetas
CREATE POLICY "Users can view own recipes"
  ON recipes FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Solo dueño puede crear recetas
CREATE POLICY "Users can create own recipes"
  ON recipes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Solo dueño puede actualizar
CREATE POLICY "Users can update own recipes"
  ON recipes FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Solo dueño puede eliminar
CREATE POLICY "Users can delete own recipes"
  ON recipes FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
```

#### `products`
```sql
-- Público puede leer productos (escaneados)
CREATE POLICY "Public read access to products"
  ON products FOR SELECT
  USING (true);

-- Solo authenticated puede crear (desde scanner)
CREATE POLICY "Authenticated users can insert products"
  ON products FOR INSERT
  TO authenticated
  WITH CHECK (true);
```

#### `profiles`
```sql
-- Usuarios pueden leer perfiles públicos
CREATE POLICY "Public profiles are viewable"
  ON profiles FOR SELECT
  USING (true);

-- Solo dueño puede actualizar su perfil
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);
```

#### `transactions`
```sql
-- Solo el usuario puede ver sus transacciones
CREATE POLICY "Users can view own transactions"
  ON transactions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Inserts solo por service role (webhook)
-- No policy needed, handled by SUPABASE_SERVICE_ROLE_KEY
```

### 3. Protección XSS

**Funciones de sanitización:**

```tsx
// Sanitizar HTML en inputs de usuario
export function sanitizeHtml(input: string): string {
  return input
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
}

// Validación anti-XSS en schemas
const ChatMessageSchema = z.object({
  content: z.string()
    .regex(/^[^<>]*$/, "El mensaje contiene HTML no permitido"),
});
```

### 4. Validación de UUIDs

```tsx
export function isValidUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

// Uso en endpoints
if (!isValidUUID(params.id)) {
  return NextResponse.json({ error: "ID inválido" }, { status: 400 });
}
```

### 5. Stripe Webhook Verification

**Archivo:** `src/app/api/stripe/webhook/route.ts`

```tsx
// Verificar firma de Stripe
let event: Stripe.Event;
try {
  event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
} catch (err) {
  return NextResponse.json(
    { error: `Webhook Error: ${err.message}` },
    { status: 400 }
  );
}
```

## 🔄 Pendiente de Implementación

### 6. Rate Limiting

**Archivo a crear:** `src/middleware.ts`

```bash
npm install @upstash/ratelimit @upstash/redis
```

```tsx
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "10 s"),
  analytics: true,
});

export async function middleware(request: NextRequest) {
  // Rate limit por IP
  const ip = request.ip ?? "127.0.0.1";
  
  // Endpoints de IA - límite estricto
  if (request.nextUrl.pathname.startsWith("/api/ai/")) {
    const { success, limit, remaining, reset } = await ratelimit.limit(
      `ai:${ip}`
    );

    if (!success) {
      return new Response("Too Many Requests", {
        status: 429,
        headers: {
          "X-RateLimit-Limit": limit.toString(),
          "X-RateLimit-Remaining": remaining.toString(),
          "X-RateLimit-Reset": reset.toString(),
        },
      });
    }
  }

  // API general - límite más permisivo
  if (request.nextUrl.pathname.startsWith("/api/")) {
    const { success } = await ratelimit.limit(`api:${ip}`, {
      rate: 100,
      window: "1 m",
    });

    if (!success) {
      return new Response("Too Many Requests", { status: 429 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/api/:path*",
};
```

**Límites recomendados:**
- `/api/ai/*`: 10 requests / 10 segundos (costoso, proteger OpenAI)
- `/api/scan/*`: 30 requests / minuto (prevenir abuso del scanner)
- `/api/chat/*`: 60 requests / minuto (realtime, más permisivo)
- `/api/recipes/*`: 100 requests / minuto (CRUD normal)
- Otros: 200 requests / minuto (general)

### 7. CORS Headers

**Archivo:** `next.config.js`

```js
module.exports = {
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: process.env.NEXT_PUBLIC_APP_URL },
          { key: "Access-Control-Allow-Methods", value: "GET,DELETE,PATCH,POST,PUT" },
          { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version" },
        ],
      },
    ];
  },
};
```

### 8. Content Security Policy

**Archivo:** `src/middleware.ts`

```tsx
const cspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline' https://js.stripe.com;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  img-src 'self' blob: data: https:;
  font-src 'self' https://fonts.gstatic.com;
  connect-src 'self' https://*.supabase.co https://api.openai.com https://api.stripe.com;
  frame-src 'self' https://js.stripe.com;
`;

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  
  response.headers.set(
    "Content-Security-Policy",
    cspHeader.replace(/\s{2,}/g, " ").trim()
  );
  
  return response;
}
```

### 9. Environment Variables Validation

**Archivo:** `src/lib/env.ts`

```tsx
import { z } from "zod";

const envSchema = z.object({
  // Supabase
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  
  // OpenAI
  OPENAI_API_KEY: z.string().startsWith("sk-"),
  
  // Stripe
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().startsWith("pk_"),
  STRIPE_SECRET_KEY: z.string().startsWith("sk_"),
  STRIPE_WEBHOOK_SECRET: z.string().startsWith("whsec_"),
  
  // App
  NEXT_PUBLIC_APP_URL: z.string().url(),
  NODE_ENV: z.enum(["development", "production", "test"]),
});

export const env = envSchema.parse(process.env);

// Uso:
import { env } from "@/lib/env";
const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL; // Type-safe!
```

### 10. Audit Logging

**Archivo:** `src/lib/audit-log.ts`

```tsx
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface AuditLogEntry {
  user_id?: string;
  action: string;
  resource_type: string;
  resource_id?: string;
  ip_address?: string;
  user_agent?: string;
  metadata?: Record<string, any>;
}

export async function logAuditEvent(entry: AuditLogEntry) {
  await supabase.from("audit_logs").insert({
    ...entry,
    created_at: new Date().toISOString(),
  });
}

// Uso:
await logAuditEvent({
  user_id: user.id,
  action: "recipe_deleted",
  resource_type: "recipe",
  resource_id: recipeId,
  ip_address: request.ip,
});
```

**Crear tabla:**

```sql
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id TEXT,
  ip_address TEXT,
  user_agent TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX audit_logs_user_id_idx ON audit_logs(user_id);
CREATE INDEX audit_logs_action_idx ON audit_logs(action);
CREATE INDEX audit_logs_created_at_idx ON audit_logs(created_at DESC);
```

## 🔒 Mejores Prácticas

### Secrets Management

```bash
# .env.local (NUNCA commitear)
OPENAI_API_KEY=sk-...
STRIPE_SECRET_KEY=sk_...
SUPABASE_SERVICE_ROLE_KEY=...

# .env.example (sí commitear)
OPENAI_API_KEY=sk-your-key-here
STRIPE_SECRET_KEY=sk-your-key-here
```

### Password Hashing

Supabase maneja esto automáticamente. Si implementas auth custom:

```bash
npm install bcryptjs
```

```tsx
import bcrypt from "bcryptjs";

// Hash password
const hashedPassword = await bcrypt.hash(password, 10);

// Verify password
const isValid = await bcrypt.compare(password, hashedPassword);
```

### JWT Verification

```tsx
import { jwtVerify } from "jose";

export async function verifyJWT(token: string) {
  const secret = new TextEncoder().encode(process.env.JWT_SECRET);
  
  try {
    const { payload } = await jwtVerify(token, secret);
    return { valid: true, payload };
  } catch {
    return { valid: false };
  }
}
```

### SQL Injection Prevention

**✅ Siempre usa queries parametrizadas:**

```tsx
// ❌ NUNCA así (vulnerable a SQL injection)
const { data } = await supabase
  .from("recipes")
  .select("*")
  .eq("title", userInput);

// ✅ Así está bien (Supabase sanitiza automáticamente)
const { data } = await supabase
  .from("recipes")
  .select("*")
  .eq("title", userInput); // Supabase escapa el input

// ❌ Si usas SQL raw, SIEMPRE parametriza
const { data } = await supabase.rpc("search_recipes", {
  query: userInput, // Parámetro seguro
});
```

## 📋 Security Checklist

- [x] Zod validation en APIs
- [x] RLS policies en Supabase
- [x] XSS protection (sanitización)
- [x] UUID validation
- [x] Stripe webhook verification
- [x] AI Recipe endpoint validado
- [ ] Rate limiting implementado
- [ ] CORS headers configurados
- [ ] CSP headers implementados
- [ ] Environment variables validadas
- [ ] Audit logging configurado
- [ ] HTTPS forzado en producción
- [ ] Security headers (Vercel automático)

## 🚨 Reportar Vulnerabilidades

Si encuentras una vulnerabilidad de seguridad:

1. **NO crear issue público en GitHub**
2. Enviar email a: security@cocorico.app
3. Incluir:
   - Descripción detallada
   - Pasos para reproducir
   - Impacto potencial
   - Sugerencias de fix (opcional)

## 📚 Recursos

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Supabase RLS Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Next.js Security](https://nextjs.org/docs/advanced-features/security-headers)
- [Stripe Security](https://stripe.com/docs/security/guide)
- [Zod Documentation](https://zod.dev/)
