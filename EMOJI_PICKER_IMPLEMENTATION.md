# Instrucciones para Aplicar Cambios - Emoji Picker

## 🎨 Cambios Implementados

### 1. **Videos con Liquid Glass Clear Style** ✅
- **Archivos modificados:**
  - `src/app/[locale]/page.tsx`
  
- **Cambios aplicados:**
  - Video principal: `coco-glass` → `glass-clear`
  - Border radius: `rounded-[2rem]` → inherente en `.glass-clear` (1.25rem)
  - Video inferior también actualizado con `glass-clear`
  
- **Resultado:** Bordes suaves y translúcidos sin esquinas picudas

### 2. **Sistema de Emoji Picker** ✅
- **Archivos creados:**
  - `src/components/EmojiPicker.tsx` - Componente modal con categorías
  
- **Archivos modificados:**
  - `src/components/navigation/UnifiedNavbar.tsx`
    - Importado EmojiPicker
    - Agregado estado `userEmoji` y `showEmojiPicker`
    - Avatar circular → Emoji personalizable
    - Botón "Cambiar Emoji" en menú desplegable
    - Función `handleEmojiSelect()` para guardar en Supabase
    
- **Categorías de emojis:**
  - Cocineros 👨‍🍳👩‍🍳
  - Comida 🍕🍔🍟
  - Frutas 🍎🍊🍌
  - Vegetales 🥦🥕
  - Bebidas ☕🍵
  - Animales 🐶🐱
  - Personas 😀😊

### 3. **Migración de Base de Datos** ✅
- **Archivo:** `supabase/migrations/20250209000001_add_emoji_to_user_profiles.sql`
- **Cambios:**
  - Agrega columna `emoji TEXT` a tabla `user_profiles`
  - Valor por defecto: '👤'

## 📋 Pasos para Aplicar la Migración

### Opción A: Supabase CLI (Recomendado)
```bash
# 1. Asegúrate de tener Supabase CLI instalado
npm install -g supabase

# 2. Login en Supabase
supabase login

# 3. Link al proyecto
supabase link --project-ref TU_PROJECT_REF

# 4. Aplicar migración
supabase db push
```

### Opción B: SQL Editor en Supabase Dashboard
1. Ve a tu proyecto en [Supabase Dashboard](https://supabase.com/dashboard)
2. Navega a **SQL Editor**
3. Copia y ejecuta el contenido de:
   ```
   supabase/migrations/20250209000001_add_emoji_to_user_profiles.sql
   ```

### Opción C: Crear columna manualmente
```sql
-- Ejecutar en SQL Editor
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS emoji TEXT DEFAULT '👤';

COMMENT ON COLUMN user_profiles.emoji IS 'Emoji personalizado del usuario para usar como avatar';
```

## 🧪 Cómo Probar

1. **Verificar Liquid Glass en Videos:**
   - Abre `http://localhost:3000`
   - Los videos deben tener bordes suaves y translúcidos
   - No debe haber esquinas picudas/duras

2. **Probar Emoji Picker:**
   - Inicia sesión en la app
   - Haz clic en el menú de usuario (esquina superior derecha)
   - Clic en "Cambiar Emoji"
   - Selecciona un emoji de las categorías
   - El emoji debe aparecer en el avatar del navbar
   - Recarga la página → el emoji debe persistir

3. **Verificar Persistencia:**
   ```sql
   -- Verifica que se guardó en la base de datos
   SELECT id, email, emoji, updated_at 
   FROM user_profiles 
   WHERE emoji IS NOT NULL;
   ```

## 🎯 Características del Emoji Picker

- **Modal con glass-clear style**
- **8 categorías** con scroll horizontal
- **Búsqueda** (preparada para futuras mejoras)
- **Grid de 8 columnas** con hover effects
- **Animaciones** con Framer Motion
- **Guarda en:**
  - `user_profiles.emoji` (base de datos)
  - `user.user_metadata.emoji` (auth metadata)

## 🔧 Troubleshooting

### El emoji no se guarda
- Verifica que la columna `emoji` existe en `user_profiles`
- Revisa permisos RLS en Supabase
- Chequea la consola del navegador por errores

### El emoji no se carga al iniciar sesión
- Verifica que el useEffect en UnifiedNavbar esté ejecutándose
- Asegúrate de que `supabase.auth.getSession()` esté funcionando
- Revisa que la query a `user_profiles` sea exitosa

### El modal no se cierra
- El fondo del modal tiene `onClick={onClose}`
- El botón X también cierra el modal
- Seleccionar un emoji cierra automáticamente

## 📝 Notas Técnicas

- **Liquid Glass Clear**: Clase CSS en `globals.css` línea 541-606
- **Z-index del modal**: `z-[200]` para estar sobre navbar (`z-50`)
- **Default emoji**: `👤` si no se ha seleccionado uno
- **Responsive**: Grid de emojis adapta en móvil

## ✅ Checklist de Verificación

- [ ] Migración SQL aplicada exitosamente
- [ ] Videos tienen bordes liquid-glass suaves
- [ ] Botón "Cambiar Emoji" aparece en menú de usuario
- [ ] Modal de emoji picker se abre correctamente
- [ ] Emojis se muestran en grid de 8 columnas
- [ ] Seleccionar emoji actualiza avatar
- [ ] Emoji persiste después de recargar página
- [ ] No hay errores en consola del navegador
- [ ] No hay errores de TypeScript en compilación
