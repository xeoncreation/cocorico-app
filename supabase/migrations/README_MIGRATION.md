# Instrucciones para Ejecutar la Migración de Supabase

## 🎯 Objetivo
Crear la tabla `agent_events` en tu base de datos Supabase para el sistema de monitoreo del agente IA.

## 📋 Opciones de Ejecución

### Opción 1: Supabase Dashboard (Recomendado para desarrollo)

1. **Accede al Dashboard de Supabase**
   - Ve a: https://supabase.com/dashboard
   - Selecciona tu proyecto: `dxhgpjrgvkxudetbmxuw`

2. **Abre el Editor SQL**
   - En el menú lateral, haz clic en **"SQL Editor"**
   - O ve directamente a: https://supabase.com/dashboard/project/dxhgpjrgvkxudetbmxuw/sql

3. **Ejecuta la Migración**
   - Haz clic en **"New query"**
   - Copia y pega todo el contenido del archivo:
     ```
     supabase/migrations/20250209000000_create_agent_events.sql
     ```
   - Haz clic en **"Run"** (o presiona `Ctrl + Enter`)

4. **Verifica la Creación**
   - Ve a **"Table Editor"** en el menú lateral
   - Busca la tabla `agent_events`
   - Deberías ver las columnas: id, timestamp, type, component, message, stack, etc.

### Opción 2: Supabase CLI (Para producción)

Si tienes el Supabase CLI instalado:

```bash
# 1. Instalar Supabase CLI (si no lo tienes)
npm install -g supabase

# 2. Vincular tu proyecto
supabase link --project-ref dxhgpjrgvkxudetbmxuw

# 3. Aplicar la migración
supabase db push

# 4. Verificar
supabase db diff
```

### Opción 3: Ejecutar SQL directamente desde PowerShell

```powershell
# Leer el archivo SQL y ejecutarlo usando curl
$sql = Get-Content "supabase\migrations\20250209000000_create_agent_events.sql" -Raw

# Ejecutar contra la API de Supabase (necesitas tu service_role key)
$headers = @{
    "apikey" = "TU_SERVICE_ROLE_KEY"
    "Authorization" = "Bearer TU_SERVICE_ROLE_KEY"
    "Content-Type" = "application/json"
}

$body = @{
    query = $sql
} | ConvertTo-Json

Invoke-RestMethod -Uri "https://dxhgpjrgvkxudetbmxuw.supabase.co/rest/v1/rpc/exec" -Method POST -Headers $headers -Body $body
```

## ✅ Verificación Post-Migración

Después de ejecutar la migración, verifica que todo funcione:

1. **Verifica la tabla**
   ```sql
   SELECT * FROM agent_events LIMIT 1;
   ```

2. **Verifica los índices**
   ```sql
   SELECT indexname, indexdef 
   FROM pg_indexes 
   WHERE tablename = 'agent_events';
   ```

3. **Verifica las políticas RLS**
   ```sql
   SELECT * FROM pg_policies WHERE tablename = 'agent_events';
   ```

## 🔧 Troubleshooting

### Error: "relation agent_events already exists"
```sql
-- Si necesitas recrear la tabla
DROP TABLE IF EXISTS agent_events CASCADE;
-- Luego ejecuta la migración nuevamente
```

### Error: "permission denied"
- Asegúrate de usar una conexión con permisos de `service_role`
- O ejecuta desde el Dashboard de Supabase donde tienes permisos de admin

### Error al insertar desde el cliente
- Verifica que RLS esté habilitado
- Verifica que las políticas estén creadas correctamente
- El cliente puede necesitar autenticación para insertar eventos

## 📝 Notas Importantes

1. **La tabla usa UUID como primary key** - Se genera automáticamente en el cliente
2. **RLS está habilitado** - Solo usuarios autenticados y admins pueden leer
3. **Limpieza automática** - Hay una función para limpiar eventos >30 días (ejecutar manualmente)
4. **Metadata en JSONB** - Permite guardar información adicional flexible

## 🧪 Probar la Tabla

Una vez creada, puedes probar insertando un evento de prueba:

```sql
INSERT INTO agent_events (
  id,
  timestamp,
  type,
  message,
  user_agent,
  url
) VALUES (
  gen_random_uuid(),
  extract(epoch from now())::bigint * 1000,
  'info',
  'Test event from migration',
  'test-agent',
  '/test'
);
```

Luego verifica:

```sql
SELECT * FROM agent_events ORDER BY created_at DESC LIMIT 5;
```

## 🚀 ¡Listo!

Una vez ejecutada la migración, el sistema de monitoreo del agente IA estará completamente funcional.
