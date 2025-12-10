/**
 * AgentMonitor - Sistema de Monitoreo de Errores y Eventos
 * 
 * Captura y analiza errores en tiempo real, detecta patrones,
 * y envía alertas automáticas cuando encuentra problemas críticos.
 */

import { createClient } from '@/app/lib/supabase-client';

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

export interface ErrorAnalysis {
  severity: 'low' | 'medium' | 'high' | 'critical';
  shouldAlert: boolean;
  analysis: string;
  suggestedFix: string;
  possibleCauses: string[];
  relatedEvents: string[];
}

class AgentMonitor {
  private events: ErrorEvent[] = [];
  private readonly maxEvents = 100;
  private alertThreshold = 5; // Alertar después de N errores similares
  
  /**
   * Captura un error y lo procesa
   */
  async captureError(error: Error, metadata?: Record<string, any>): Promise<void> {
    const event: ErrorEvent = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      type: 'error',
      message: error.message,
      stack: error.stack,
      userAgent: typeof window !== 'undefined' ? navigator.userAgent : 'server',
      url: typeof window !== 'undefined' ? window.location.href : 'server',
      metadata,
    };

    // Agregar a la cola
    this.events.push(event);
    
    // Mantener solo los últimos N eventos
    if (this.events.length > this.maxEvents) {
      this.events.shift();
    }

    console.error('🔴 AgentMonitor captured error:', event);

    // Guardar en DB
    await this.saveEvent(event);

    // Analizar si es crítico
    if (this.isCriticalError(error)) {
      await this.handleCriticalError(event);
    }
  }

  /**
   * Captura una advertencia
   */
  async captureWarning(message: string, metadata?: Record<string, any>): Promise<void> {
    const event: ErrorEvent = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      type: 'warning',
      message,
      userAgent: typeof window !== 'undefined' ? navigator.userAgent : 'server',
      url: typeof window !== 'undefined' ? window.location.href : 'server',
      metadata,
    };

    this.events.push(event);
    
    if (this.events.length > this.maxEvents) {
      this.events.shift();
    }

    console.warn('🟡 AgentMonitor captured warning:', event);

    await this.saveEvent(event);
  }

  /**
   * Captura información general
   */
  async captureInfo(message: string, metadata?: Record<string, any>): Promise<void> {
    const event: ErrorEvent = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      type: 'info',
      message,
      userAgent: typeof window !== 'undefined' ? navigator.userAgent : 'server',
      url: typeof window !== 'undefined' ? window.location.href : 'server',
      metadata,
    };

    this.events.push(event);
    
    if (this.events.length > this.maxEvents) {
      this.events.shift();
    }

    console.info('🔵 AgentMonitor captured info:', event);

    await this.saveEvent(event);
  }

  /**
   * Verifica si un error es crítico
   */
  private isCriticalError(error: Error): boolean {
    const criticalPatterns = [
      /database/i,
      /authentication/i,
      /payment/i,
      /network.*failed/i,
      /unhandled.*rejection/i,
      /cannot.*read.*property/i,
      /undefined.*is.*not.*function/i,
      /failed.*to.*fetch/i,
      /supabase/i,
    ];
    
    return criticalPatterns.some(pattern => pattern.test(error.message));
  }

  /**
   * Maneja un error crítico enviándolo al agente IA
   */
  private async handleCriticalError(event: ErrorEvent): Promise<void> {
    try {
      // Obtener eventos recientes para contexto
      const recentEvents = this.events.slice(-10);

      // Llamar al agente IA para análisis
      const response = await fetch('/api/agent/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event,
          recentEvents,
        }),
      });

      if (!response.ok) {
        console.error('Failed to analyze error:', response.statusText);
        return;
      }

      const analysis: ErrorAnalysis = await response.json();

      console.log('🤖 Agent Analysis:', analysis);

      // Si debe alertar, enviar email
      if (analysis.shouldAlert) {
        await this.sendAlert({
          event,
          analysis,
        });
      }
    } catch (error) {
      console.error('Error handling critical error:', error);
    }
  }

  /**
   * Envía una alerta al desarrollador
   */
  private async sendAlert(data: {
    event: ErrorEvent;
    analysis: ErrorAnalysis;
  }): Promise<void> {
    try {
      const response = await fetch('/api/agent/alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        console.log('✅ Alert sent to developer');
      } else {
        console.error('❌ Failed to send alert:', response.statusText);
      }
    } catch (error) {
      console.error('Error sending alert:', error);
    }
  }

  /**
   * Guarda un evento en la base de datos
   */
  private async saveEvent(event: ErrorEvent): Promise<void> {
    try {
      const supabase = createClient();
      
      // Intentar obtener el usuario actual
      const { data: { user } } = await supabase.auth.getUser();

      // Usar any para evitar errores de tipo ya que la tabla no está en el schema generado
      const { error } = await (supabase as any).from('agent_events').insert({
        id: event.id,
        timestamp: event.timestamp,
        type: event.type,
        component: event.component,
        message: event.message,
        stack: event.stack,
        user_agent: event.userAgent,
        url: event.url,
        user_id: user?.id || null,
        metadata: event.metadata || {},
      });

      if (error) {
        console.error('Failed to save event to DB:', error);
      }
    } catch (error) {
      console.error('Error saving event:', error);
    }
  }

  /**
   * Obtiene los eventos recientes
   */
  getRecentEvents(limit = 20): ErrorEvent[] {
    return this.events.slice(-limit);
  }

  /**
   * Obtiene estadísticas de errores
   */
  getStats(): {
    total: number;
    errors: number;
    warnings: number;
    info: number;
    lastError?: ErrorEvent;
  } {
    const errors = this.events.filter(e => e.type === 'error');
    const warnings = this.events.filter(e => e.type === 'warning');
    const info = this.events.filter(e => e.type === 'info');

    return {
      total: this.events.length,
      errors: errors.length,
      warnings: warnings.length,
      info: info.length,
      lastError: errors[errors.length - 1],
    };
  }

  /**
   * Limpia todos los eventos
   */
  clear(): void {
    this.events = [];
  }
}

// Singleton instance
export const agentMonitor = new AgentMonitor();

// Helper para usar en try/catch
export const withErrorCapture = async <T>(
  fn: () => Promise<T>,
  context?: string
): Promise<T | null> => {
  try {
    return await fn();
  } catch (error) {
    await agentMonitor.captureError(error as Error, { context });
    return null;
  }
};
