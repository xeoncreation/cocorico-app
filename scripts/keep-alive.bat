@echo off
REM Script de Windows para mantener Supabase activo
REM Ejecuta este archivo cada semana haciendo doble click

echo ============================================
echo   SUPABASE KEEP-ALIVE
echo   Generando actividad en la base de datos
echo ============================================
echo.

cd /d "%~dp0.."

echo [1/2] Ejecutando script de actividad...
call npm run supabase:keep-alive

echo.
echo [2/2] Ejecutando script avanzado...
call npx tsx scripts/generate-advanced-activity.ts

echo.
echo ============================================
echo   COMPLETADO
echo ============================================
echo.
echo Presiona cualquier tecla para cerrar...
pause > nul
