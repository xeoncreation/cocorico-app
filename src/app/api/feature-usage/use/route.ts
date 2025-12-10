/**
 * API Route: /api/feature-usage/use
 * 
 * Controla el acceso a funciones premium basado en:
 * 1. Autenticación (usuario logueado o no)
 * 2. Plan del usuario (free vs premium)
 * 3. Límites de uso semanal (solo para usuarios free)
 * 
 * @method POST
 * @body { featureKey: string }
 * @returns { allowed: boolean, tier: string, used?: number, remaining?: number, limit?: number, error?: string }
 */

import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@/lib/supabase/client';
import { FREE_WEEKLY_LIMITS, type FeatureKey } from '@/config/featureLimits';
import { getCurrentWeekStartDate } from '@/lib/feature-usage/period';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const supabase = await createRouteHandlerClient();
    
    // 1. Verificar autenticación
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        {
          allowed: false,
          error: 'unauthorized',
          message: 'Debes iniciar sesión para usar esta función.',
        },
        { status: 401 }
      );
    }

    // 2. Obtener featureKey del body
    const body = await req.json();
    const { featureKey } = body as { featureKey: FeatureKey };

    if (!featureKey || typeof featureKey !== 'string') {
      return NextResponse.json(
        {
          allowed: false,
          error: 'invalid_feature',
          message: 'Función no especificada o inválida.',
        },
        { status: 400 }
      );
    }

    const userId = user.id;

    // 3. Obtener plan del usuario
    const { data: planRow, error: planError } = await supabase
      .from('user_plans')
      .select('tier')
      .eq('user_id', userId)
      .maybeSingle();

    if (planError) {
      console.error('[feature-usage] Error fetching user plan:', planError);
    }

    const tier = planRow?.tier ?? 'free';

    // 4. Si es premium, permitir sin límites
    if (tier === 'premium') {
      return NextResponse.json({
        allowed: true,
        tier: 'premium',
        remaining: null,
        limit: null,
      });
    }

    // 5. Usuario FREE - verificar límites
    const limit = FREE_WEEKLY_LIMITS[featureKey as FeatureKey];

    if (limit === undefined || limit <= 0) {
      return NextResponse.json(
        {
          allowed: false,
          error: 'feature_not_available',
          message: 'Esta función no está disponible en el plan gratuito.',
        },
        { status: 403 }
      );
    }

    const periodStartDate = getCurrentWeekStartDate();

    // 6. Buscar registro de uso para esta semana
    const { data: usageRows, error: usageError } = await supabase
      .from('feature_usage')
      .select('*')
      .eq('user_id', userId)
      .eq('feature_key', featureKey)
      .eq('period_start_date', periodStartDate);

    if (usageError) {
      console.error('[feature-usage] Error fetching usage:', usageError);
    }

    const existing = usageRows?.[0];

    // 7. Si no existe registro, crear uno con used_count = 1
    if (!existing) {
      const { data: inserted, error: insertError } = await supabase
        .from('feature_usage')
        .insert({
          user_id: userId,
          feature_key: featureKey,
          period_start_date: periodStartDate,
          used_count: 1,
        })
        .select()
        .single();

      if (insertError) {
        console.error('[feature-usage] Error inserting usage:', insertError);
        return NextResponse.json(
          {
            allowed: false,
            error: 'internal_error',
            message: 'No se ha podido registrar el uso. Por favor, inténtalo de nuevo.',
          },
          { status: 500 }
        );
      }

      return NextResponse.json({
        allowed: true,
        tier: 'free',
        used: inserted.used_count,
        remaining: limit - inserted.used_count,
        limit,
      });
    }

    // 8. Si ya alcanzó el límite, denegar
    if (existing.used_count >= limit) {
      return NextResponse.json(
        {
          allowed: false,
          tier: 'free',
          used: existing.used_count,
          remaining: 0,
          limit,
          error: 'limit_reached',
          message:
            'Has agotado tus usos gratuitos de esta semana para esta función. Puedes suscribirte a Cocorico Premium para seguir usándola sin límites o esperar a que se renueve tu cuota semanal.',
        },
        { status: 403 }
      );
    }

    // 9. Incrementar contador
    const newCount = existing.used_count + 1;

    const { data: updated, error: updateError } = await supabase
      .from('feature_usage')
      .update({
        used_count: newCount,
        updated_at: new Date().toISOString(),
      })
      .eq('id', existing.id)
      .select()
      .single();

    if (updateError) {
      console.error('[feature-usage] Error updating usage:', updateError);
      return NextResponse.json(
        {
          allowed: false,
          error: 'internal_error',
          message: 'No se ha podido actualizar el contador de uso.',
        },
        { status: 500 }
      );
    }

    // 10. Retornar éxito con información de uso
    return NextResponse.json({
      allowed: true,
      tier: 'free',
      used: updated.used_count,
      remaining: limit - updated.used_count,
      limit,
    });
  } catch (error) {
    console.error('[feature-usage] Unexpected error:', error);
    return NextResponse.json(
      {
        allowed: false,
        error: 'internal_error',
        message: 'Ha ocurrido un error inesperado.',
      },
      { status: 500 }
    );
  }
}
