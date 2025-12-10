/**
 * Helpers para cálculo de períodos semanales
 * 
 * Gestiona la lógica de "semanas" para el sistema de límites de uso.
 * La semana comienza el lunes a las 00:00 UTC.
 * 
 * @module period
 */

/**
 * Obtiene la fecha de inicio de la semana actual (lunes)
 * 
 * @returns Fecha en formato 'YYYY-MM-DD' del lunes de la semana actual
 * 
 * @example
 * getCurrentWeekStartDate() // '2025-12-08' (si hoy es 10 de diciembre de 2025)
 */
export function getCurrentWeekStartDate(): string {
  const now = new Date();
  const day = now.getUTCDay(); // 0 = Domingo, 1 = Lunes, ..., 6 = Sábado
  
  // Calcular cuántos días restar para llegar al lunes
  // Si es domingo (0), restar 6 días; si es lunes (1), restar 0; etc.
  const daysToSubtract = day === 0 ? 6 : day - 1;
  
  const mondayDate = new Date(Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate() - daysToSubtract
  ));
  
  return mondayDate.toISOString().slice(0, 10); // 'YYYY-MM-DD'
}

/**
 * Obtiene la fecha de inicio de semana para una fecha específica
 * 
 * @param date - Fecha para la cual calcular el inicio de semana
 * @returns Fecha en formato 'YYYY-MM-DD' del lunes de esa semana
 */
export function getWeekStartDate(date: Date): string {
  const day = date.getUTCDay();
  const daysToSubtract = day === 0 ? 6 : day - 1;
  
  const mondayDate = new Date(Date.UTC(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate() - daysToSubtract
  ));
  
  return mondayDate.toISOString().slice(0, 10);
}

/**
 * Obtiene la fecha de fin de la semana actual (domingo)
 * 
 * @returns Fecha en formato 'YYYY-MM-DD' del domingo de la semana actual
 */
export function getCurrentWeekEndDate(): string {
  const now = new Date();
  const day = now.getUTCDay();
  const daysToAdd = day === 0 ? 0 : 7 - day;
  
  const sundayDate = new Date(Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate() + daysToAdd
  ));
  
  return sundayDate.toISOString().slice(0, 10);
}

/**
 * Calcula cuántos días faltan para el próximo lunes (renovación)
 * 
 * @returns Número de días hasta la renovación semanal
 */
export function getDaysUntilRenewal(): number {
  const now = new Date();
  const day = now.getUTCDay();
  
  if (day === 0) return 1; // Domingo → mañana es lunes
  return 8 - day; // Días hasta el próximo lunes
}

/**
 * Formatea la fecha de renovación para mostrar al usuario
 * 
 * @returns Fecha legible del próximo lunes (renovación)
 * 
 * @example
 * getNextRenewalDate() // 'lunes 15 de diciembre'
 */
export function getNextRenewalDate(locale: string = 'es'): string {
  const now = new Date();
  const day = now.getUTCDay();
  const daysUntilMonday = day === 0 ? 1 : 8 - day;
  
  const nextMonday = new Date(Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate() + daysUntilMonday
  ));
  
  return nextMonday.toLocaleDateString(locale, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
}

/**
 * Verifica si dos fechas están en la misma semana
 * 
 * @param date1 - Primera fecha
 * @param date2 - Segunda fecha
 * @returns true si ambas fechas están en la misma semana
 */
export function areDatesInSameWeek(date1: Date, date2: Date): boolean {
  return getWeekStartDate(date1) === getWeekStartDate(date2);
}
