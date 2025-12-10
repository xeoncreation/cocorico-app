/**
 * MFA (Multi-Factor Authentication) - Client-side utilities
 * Implementa TOTP (Time-based One-Time Password) usando Supabase Auth
 */

'use client';

import { createClientComponentClient } from '@/lib/supabase/client';
import type { AuthMFAEnrollResponse, AuthMFAChallengeResponse, AuthMFAVerifyResponse } from '@supabase/supabase-js';

export interface MFAFactor {
  id: string;
  type: 'totp';
  status: 'verified' | 'unverified';
  created_at: string;
  updated_at: string;
}

export interface MFAEnrollData {
  qr: string;
  secret: string;
  factorId: string;
}

/**
 * Obtener lista de factores MFA del usuario actual
 */
export async function listMFAFactors(): Promise<{ factors: MFAFactor[]; error: any }> {
  const supabase = createClientComponentClient();
  const { data, error } = await supabase.auth.mfa.listFactors();

  if (error) return { factors: [], error };

  return {
    factors: data?.all ?? [],
    error: null
  };
}

/**
 * Iniciar proceso de registro de MFA TOTP
 * Retorna QR code y secret para configurar en app autenticadora (Google Authenticator, Authy, etc.)
 */
export async function enrollMFA(): Promise<{ data: MFAEnrollData | null; error: any }> {
  const supabase = createClientComponentClient();
  
  try {
    const { data, error }: AuthMFAEnrollResponse = await supabase.auth.mfa.enroll({
      factorType: 'totp',
      friendlyName: 'Cocorico Authenticator'
    });

    if (error) throw error;
    if (!data) throw new Error('No data returned from MFA enroll');

    // Type assertion para manejar el tipo union de factors
    const totpData = data as { id: string; type: 'totp'; totp: { qr_code: string; secret: string; uri: string } };

    return {
      data: {
        qr: totpData.totp.qr_code,
        secret: totpData.totp.secret,
        factorId: totpData.id
      },
      error: null
    };
  } catch (error) {
    console.error('MFA enroll error:', error);
    return { data: null, error };
  }
}

/**
 * Verificar código TOTP y completar registro de MFA
 * @param factorId - ID del factor obtenido en enrollMFA
 * @param code - Código de 6 dígitos de la app autenticadora
 */
export async function verifyMFA(factorId: string, code: string): Promise<{ success: boolean; error: any }> {
  const supabase = createClientComponentClient();

  try {
    // Crear challenge
    const { data: challengeData, error: challengeError }: AuthMFAChallengeResponse = 
      await supabase.auth.mfa.challenge({ factorId });

    if (challengeError) throw challengeError;
    if (!challengeData) throw new Error('No challenge data');

    // Verificar código
    const { error: verifyError }: AuthMFAVerifyResponse = await supabase.auth.mfa.verify({
      factorId,
      challengeId: challengeData.id,
      code
    });

    if (verifyError) throw verifyError;

    return { success: true, error: null };
  } catch (error) {
    console.error('MFA verify error:', error);
    return { success: false, error };
  }
}

/**
 * Desactivar MFA (eliminar factor)
 * @param factorId - ID del factor a eliminar
 */
export async function unenrollMFA(factorId: string): Promise<{ success: boolean; error: any }> {
  const supabase = createClientComponentClient();

  try {
    const { error } = await supabase.auth.mfa.unenroll({ factorId });
    if (error) throw error;

    return { success: true, error: null };
  } catch (error) {
    console.error('MFA unenroll error:', error);
    return { success: false, error };
  }
}

/**
 * Verificar código MFA durante login (para usuarios con MFA activado)
 * @param code - Código de 6 dígitos de la app autenticadora
 */
export async function challengeMFA(code: string): Promise<{ success: boolean; error: any }> {
  const supabase = createClientComponentClient();

  try {
    // Obtener factor activo
    const { data: factors } = await supabase.auth.mfa.listFactors();
    const activeFactor = factors?.totp.find((f: any) => f.status === 'verified');

    if (!activeFactor) {
      throw new Error('No active MFA factor found');
    }

    // Crear challenge
    const { data: challengeData, error: challengeError } = 
      await supabase.auth.mfa.challenge({ factorId: activeFactor.id });

    if (challengeError) throw challengeError;
    if (!challengeData) throw new Error('No challenge data');

    // Verificar código
    const { error: verifyError } = await supabase.auth.mfa.verify({
      factorId: activeFactor.id,
      challengeId: challengeData.id,
      code
    });

    if (verifyError) throw verifyError;

    return { success: true, error: null };
  } catch (error) {
    console.error('MFA challenge error:', error);
    return { success: false, error };
  }
}

/**
 * Verificar si el usuario actual tiene MFA activado
 */
export async function hasMFAEnabled(): Promise<boolean> {
  const { factors } = await listMFAFactors();
  return factors.some(f => f.status === 'verified');
}

/**
 * Obtener nivel de garantía de autenticación (AAL)
 * aal1 = solo contraseña
 * aal2 = contraseña + MFA
 */
export async function getAuthLevel(): Promise<'aal1' | 'aal2'> {
  const supabase = createClientComponentClient();
  const { data } = await supabase.auth.getSession();
  return (data.session?.user as any)?.aal ?? 'aal1';
}
