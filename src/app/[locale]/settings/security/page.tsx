'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@/lib/auth/client';
import { enrollMFA, verifyMFA, listMFAFactors, unenrollMFA, type MFAFactor, type MFAEnrollData } from '@/lib/auth/mfa';
import { Shield, Check, X, Key, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import QRCode from 'react-qr-code';

export default function SecuritySettings() {
  const { user, loading: authLoading } = useUser();
  const [factors, setFactors] = useState<MFAFactor[]>([]);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [enrollData, setEnrollData] = useState<MFAEnrollData | null>(null);
  const [verifyCode, setVerifyCode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (user) {
      loadFactors();
    }
  }, [user]);

  async function loadFactors() {
    setLoading(true);
    const { factors: mfaFactors } = await listMFAFactors();
    setFactors(mfaFactors);
    setLoading(false);
  }

  async function handleEnroll() {
    setEnrolling(true);
    setError('');
    setSuccess('');

    const { data, error: err } = await enrollMFA();

    if (err || !data) {
      setError('Error al activar MFA. Intenta de nuevo.');
      setEnrolling(false);
      return;
    }

    setEnrollData(data);
  }

  async function handleVerify() {
    if (!enrollData || !verifyCode) {
      setError('Introduce el código de 6 dígitos');
      return;
    }

    setError('');
    const { success: verified, error: err } = await verifyMFA(enrollData.factorId, verifyCode);

    if (err || !verified) {
      setError('Código incorrecto. Verifica e intenta de nuevo.');
      return;
    }

    setSuccess('¡MFA activado correctamente! Tu cuenta ahora está más segura.');
    setEnrollData(null);
    setVerifyCode('');
    setEnrolling(false);
    await loadFactors();
  }

  async function handleDisable(factorId: string) {
    if (!confirm('¿Seguro que deseas desactivar la verificación en dos pasos?')) {
      return;
    }

    const { success: disabled } = await unenrollMFA(factorId);

    if (disabled) {
      setSuccess('MFA desactivado');
      await loadFactors();
    } else {
      setError('Error al desactivar MFA');
    }
  }

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cocorico-red"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-6 text-center">
        <p className="text-neutral-600 dark:text-neutral-400">Debes iniciar sesión para acceder a esta página.</p>
      </div>
    );
  }

  const hasMFA = factors.some(f => f.status === 'verified');

  return (
    <div className="max-w-2xl mx-auto py-12 px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2 flex items-center gap-3">
          <Shield className="w-8 h-8 text-cocorico-red" />
          Seguridad de la cuenta
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400">
          Protege tu cuenta con verificación en dos pasos (MFA/2FA)
        </p>
      </div>

      {/* Mensajes */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-2 text-red-800 dark:text-red-200">
          <X className="w-5 h-5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center gap-2 text-green-800 dark:text-green-200">
          <Check className="w-5 h-5 flex-shrink-0" />
          <p>{success}</p>
        </div>
      )}

      {/* Estado MFA */}
      <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-700 p-6 mb-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-lg ${hasMFA ? 'bg-green-100 dark:bg-green-900/20' : 'bg-neutral-100 dark:bg-neutral-700'}`}>
              <Key className={`w-6 h-6 ${hasMFA ? 'text-green-600 dark:text-green-400' : 'text-neutral-600 dark:text-neutral-400'}`} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-neutral-900 dark:text-white mb-1">
                Verificación en dos pasos (2FA)
              </h2>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                {hasMFA 
                  ? 'Tu cuenta está protegida con autenticación de dos factores' 
                  : 'Añade una capa extra de seguridad a tu cuenta'}
              </p>
              {hasMFA && (
                <div className="mt-2 flex items-center gap-2 text-xs text-green-600 dark:text-green-400">
                  <Check className="w-4 h-4" />
                  <span>Activo</span>
                </div>
              )}
            </div>
          </div>

          {!hasMFA && !enrolling && (
            <Button onClick={handleEnroll} variant="default">
              Activar 2FA
            </Button>
          )}

          {hasMFA && factors[0] && (
            <Button onClick={() => handleDisable(factors[0].id)} variant="destructive">
              Desactivar
            </Button>
          )}
        </div>
      </div>

      {/* Flujo de activación */}
      {enrolling && enrollData && (
        <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-700 p-6">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
            <Smartphone className="w-5 h-5" />
            Configura tu app autenticadora
          </h3>

          <div className="space-y-6">
            {/* Paso 1 */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-cocorico-red text-white text-sm font-bold">
                  1
                </div>
                <p className="font-medium text-neutral-900 dark:text-white">
                  Escanea el código QR
                </p>
              </div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4 ml-8">
                Abre tu app autenticadora (Google Authenticator, Authy, Microsoft Authenticator, etc.) y escanea este código:
              </p>
              <div className="flex justify-center p-6 bg-white rounded-lg">
                <QRCode value={enrollData.qr} size={200} />
              </div>
            </div>

            {/* Paso 2 */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-cocorico-red text-white text-sm font-bold">
                  2
                </div>
                <p className="font-medium text-neutral-900 dark:text-white">
                  O introduce este código manualmente
                </p>
              </div>
              <div className="ml-8">
                <code className="block p-3 bg-neutral-100 dark:bg-neutral-700 rounded-lg text-sm font-mono text-center">
                  {enrollData.secret}
                </code>
              </div>
            </div>

            {/* Paso 3 */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-cocorico-red text-white text-sm font-bold">
                  3
                </div>
                <p className="font-medium text-neutral-900 dark:text-white">
                  Introduce el código de verificación
                </p>
              </div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3 ml-8">
                Introduce el código de 6 dígitos que aparece en tu app:
              </p>
              <div className="ml-8 flex gap-3">
                <Input
                  type="text"
                  placeholder="123456"
                  value={verifyCode}
                  onChange={(e) => setVerifyCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  maxLength={6}
                  className="text-center text-2xl font-mono tracking-widest"
                />
                <Button onClick={handleVerify} disabled={verifyCode.length !== 6}>
                  Verificar
                </Button>
              </div>
            </div>

            <div className="ml-8 pt-4 border-t border-neutral-200 dark:border-neutral-700">
              <Button 
                onClick={() => {
                  setEnrolling(false);
                  setEnrollData(null);
                  setVerifyCode('');
                  setError('');
                }} 
                variant="ghost"
              >
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Info adicional */}
      {!hasMFA && !enrolling && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
            ¿Por qué activar la verificación en dos pasos?
          </h3>
          <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
            <li>• Protege tu cuenta incluso si alguien obtiene tu contraseña</li>
            <li>• Usa tu teléfono como segunda clave de acceso</li>
            <li>• Compatible con Google Authenticator, Authy y más</li>
            <li>• Recomendado para todas las cuentas importantes</li>
          </ul>
        </div>
      )}
    </div>
  );
}
