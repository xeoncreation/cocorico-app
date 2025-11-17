# 📋 Pasos Manuales para Completar la Implementación

**Fecha:** 17 de Noviembre, 2025  
**Proyecto:** Cocorico App - Post BLOQUES 5-6

---

## ✅ **Ya Completado (Automático)**

1. ✅ **Feedback System** - Sistema completo de tickets
2. ✅ **Plans/Pricing** - Página de comparativa con Stripe
3. ✅ **Scanner** - Food detection con cámara
4. ✅ **Stats & Badges** - Visualización con Recharts
5. ✅ **CocoricoMascot** - Sistema de moods
6. ✅ **Search Fix** - Types corregidos para deploy
7. ✅ **Migrations SQL** - feedback_tickets table
8. ✅ **API Improvements** - OpenAI Vision integration

---

## 🔧 **Pasos Manuales Requeridos**

### **1. Ejecutar Migración en Supabase** 🗄️

**Archivo:** `supabase/migrations/20241117_feedback_tickets.sql`

**Pasos:**
1. Ir a [Supabase Dashboard](https://app.supabase.com)
2. Seleccionar proyecto **Cocorico**
3. Ir a **SQL Editor** (menú lateral)
4. Copiar contenido del archivo `20241117_feedback_tickets.sql`
5. Pegar y ejecutar (Run)
6. Verificar que la tabla `feedback_tickets` se creó correctamente

**Verificación:**
```sql
SELECT * FROM feedback_tickets LIMIT 1;
```

---

### **2. Crear Bucket de Storage para Feedback** 📦

**Objetivo:** Permitir subida de capturas de pantalla en tickets

**Pasos:**
1. Ir a **Storage** en Supabase Dashboard
2. Click **New Bucket**
3. **Nombre:** `assets` (si no existe ya)
4. **Public bucket:** ✅ YES
5. **File size limit:** 5 MB
6. **Allowed MIME types:** `image/jpeg, image/png, image/webp`

**Crear carpeta:**
- Dentro del bucket `assets`, crear carpeta: `feedback/`

**Configurar RLS (opcional pero recomendado):**
```sql
-- Policy para permitir uploads autenticados
CREATE POLICY "feedback_uploads_authenticated" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'assets' 
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = 'feedback'
  );

-- Policy para lectura pública
CREATE POLICY "feedback_read_public" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'assets' 
    AND (storage.foldername(name))[1] = 'feedback'
  );
```

---

### **3. Configurar OpenAI API Key (Opcional)** 🤖

**Objetivo:** Activar detección real de alimentos con Vision API

**Pasos:**
1. Obtener API Key de [OpenAI Platform](https://platform.openai.com/api-keys)
2. Agregar a `.env.local`:
   ```bash
   OPENAI_API_KEY=sk-proj-...tu-key-aqui...
   ```
3. Reiniciar servidor de desarrollo: `npm run dev`

**Verificación:**
- Ir a `/scanner`
- Subir imagen de alimentos
- Si la key es válida, verás detección real (no mock)

**Fallback:**
- Si no se configura, la API usará datos mock automáticamente
- El sistema funciona sin problemas con datos de prueba

---

### **4. Configurar Admin Email para Feedback** 👨‍💼

**Objetivo:** Dar permisos de admin para gestionar tickets

**Pasos:**
1. Ir a `.env.local`
2. Agregar:
   ```bash
   ADMIN_EMAIL=tu-email@cocorico.app
   ```
3. Reiniciar servidor

**Funcionalidad:**
- Los usuarios con este email pueden:
  - Ver todos los tickets
  - Cambiar estados (pending → working → done)
  - Responder a tickets
  - Ver estadísticas de feedback

---

### **5. Testing Manual Completo** 🧪

#### **A. Feedback System**
- [ ] Ir a `/dashboard/feedback`
- [ ] Crear ticket tipo "bug"
- [ ] Subir captura de pantalla
- [ ] Verificar que aparece en historial
- [ ] Verificar imagen en Supabase Storage

#### **B. Plans/Pricing**
- [ ] Ir a `/plans`
- [ ] Click "Ir a Premium"
- [ ] Verificar redirección a Stripe Checkout (test mode)
- [ ] Completar checkout con tarjeta de prueba: `4242 4242 4242 4242`

#### **C. Scanner**
- [ ] Ir a `/scanner`
- [ ] Probar modo cámara (permitir permisos)
- [ ] Probar modo upload
- [ ] Verificar detección de alimentos
- [ ] Check mascot moods (thinking → happy)

#### **D. Stats & Badges**
- [ ] Ir a `/dashboard/stats`
- [ ] Verificar gráficos Recharts renderizan
- [ ] Ir a `/dashboard/badges`
- [ ] Verificar badges desbloqueados/locked

---

### **6. Deploy en Vercel** 🚀

**Pre-deploy Checklist:**
- [ ] Todas las variables de entorno configuradas en Vercel:
  ```
  NEXT_PUBLIC_SUPABASE_URL
  NEXT_PUBLIC_SUPABASE_ANON_KEY
  SUPABASE_SERVICE_ROLE_KEY
  OPENAI_API_KEY (opcional)
  ADMIN_EMAIL
  STRIPE_SECRET_KEY
  STRIPE_PUBLISHABLE_KEY
  NEXT_PUBLIC_STRIPE_PRICE_ID
  ```

**Pasos:**
1. Hacer push de los cambios (ya hecho ✅)
2. Ir a [Vercel Dashboard](https://vercel.com)
3. Seleccionar proyecto **cocorico-app**
4. Ir a **Deployments**
5. El deploy se ejecutará automáticamente
6. Verificar build success (sin errores TypeScript)

**Verificación Post-Deploy:**
```bash
# Check homepage
curl https://cocorico.app

# Check API health
curl https://cocorico.app/api/health

# Check feedback API
curl -X POST https://cocorico.app/api/ai/detect-food \
  -H "Content-Type: application/json" \
  -d '{"image": "data:image/png;base64,..."}'
```

---

### **7. Conectar Stats Reales (Futuro)** 📊

**Cuando tengas datos reales de usuarios:**

1. Modificar `stats-client.tsx`:
```typescript
import { loadUserStats } from "@/lib/stats";

useEffect(() => {
  async function loadData() {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const stats = await loadUserStats(user.id);
      if (stats) {
        setMonthlyRecipes(stats.monthlyActivity.map(m => ({
          month: m.month,
          value: m.count
        })));
        // ... etc
      }
    }
  }
  loadData();
}, []);
```

2. Crear tabla `cooking_history` si no existe:
```sql
CREATE TABLE cooking_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  recipe_id UUID REFERENCES recipes(id),
  cooked_at TIMESTAMPTZ DEFAULT NOW(),
  time_minutes INTEGER,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5)
);
```

---

### **8. Monitoreo Post-Deploy** 📈

**Métricas a vigilar:**

1. **Vercel Analytics:**
   - Page views en `/plans`
   - Conversion rate de upgrade
   - Bounce rate en `/scanner`

2. **Supabase:**
   - Query performance de feedback_tickets
   - Storage usage (bucket assets)
   - Auth conversions (sign-ups)

3. **Stripe Dashboard:**
   - Subscriptions activas
   - Failed payments
   - Churn rate

4. **Error Tracking:**
   - Sentry o similar para errores en producción
   - Console logs en detect-food API

---

## 📝 **Notas Importantes**

### **Seguridad:**
- ✅ RLS habilitado en feedback_tickets
- ✅ Storage policies configuradas
- ✅ Admin email check en políticas
- ⚠️ Nunca exponer SUPABASE_SERVICE_ROLE_KEY en cliente

### **Performance:**
- ✅ Indexes creados en feedback_tickets
- ✅ Lazy loading de imágenes en scanner
- ✅ Recharts con ResponsiveContainer
- 💡 Considerar CDN para assets pesados

### **Accesibilidad:**
- ✅ aria-labels agregados en scanner
- ✅ Keyboard navigation en filtros
- ✅ Color contrast verificado
- 💡 Agregar skip links en futuro

---

## 🎯 **Próximos Pasos Recomendados**

1. **Semana 1-2:**
   - [ ] Deploy y testing exhaustivo
   - [ ] Monitorear primeras conversiones
   - [ ] Recolectar feedback inicial

2. **Semana 3-4:**
   - [ ] Analizar datos de uso
   - [ ] Optimizar flujos con más fricción
   - [ ] A/B testing en pricing page

3. **Mes 2:**
   - [ ] Implementar notificaciones de tickets
   - [ ] Dashboard admin para feedback
   - [ ] Exportación de stats avanzada

---

## 📞 **Soporte**

Si encuentras problemas:
1. Check logs en Vercel: **Functions → View Logs**
2. Check queries en Supabase: **Logs → API**
3. Verificar errores en browser console (F12)
4. Review este documento para pasos faltantes

---

**¡Listo para producción!** 🚀
