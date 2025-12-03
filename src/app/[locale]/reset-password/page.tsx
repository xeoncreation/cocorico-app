import { Metadata } from "next";
import Link from "next/link";
import GlassCard from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { AppBackground } from "@/components/layout/AppBackground";
import { Mail, ArrowLeft, Send } from "lucide-react";
import Wallpaper from "@/components/layout/Wallpaper";

export const metadata: Metadata = {
  title: "Recuperar Contraseña | Cocorico",
  description: "Restablece tu contraseña de Cocorico de forma segura.",
};

export default function ResetPasswordPage() {
  return (
    <>
      <Wallpaper
        imageLight="/branding/LOGIN - REGISTER — Fondo cálido crema, modo claro.png"
        imageDark="/branding/LOGIN - REGISTER — Fondo crema, modo oscuro.png"
      />
      <AppBackground variantOverride="home-free">
      <div className="min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md space-y-8">
          {/* Header */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 text-white text-4xl shadow-2xl mb-4">
              🔐
            </div>
            <h1 className="heading-display text-cocorico-brown dark:text-amber-100">
              Recuperar Contraseña
            </h1>
            <p className="text-neutral-600 dark:text-neutral-300 text-lg">
              Te enviaremos un enlace para restablecer tu contraseña
            </p>
          </div>

          {/* Main Card */}
          <GlassCard className="p-8 space-y-6">
            <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>💡 Importante:</strong> El enlace de recuperación será válido por 1 hora. 
                Revisa tu bandeja de spam si no lo encuentras.
              </p>
            </div>

            {/* Reset Form */}
            <form className="space-y-4">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Correo electrónico
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="tu@email.com"
                    className="w-full pl-11 pr-4 py-3 bg-white/70 dark:bg-neutral-800/70 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-cocorico-red focus:border-transparent transition-all"
                  />
                </div>
                <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-400">
                  Introduce el email que usaste para registrarte
                </p>
              </div>

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full h-12 text-base font-bold bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl transition-all"
              >
                <Send className="w-5 h-5 mr-2" />
                Enviar enlace de recuperación
              </Button>
            </form>

            {/* Security Info */}
            <div className="pt-4 border-t border-neutral-200 dark:border-neutral-700">
              <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                Consejos de seguridad:
              </h3>
              <ul className="space-y-1 text-xs text-neutral-600 dark:text-neutral-400">
                <li>• Nunca compartas tu contraseña con nadie</li>
                <li>• Usa una contraseña única para Cocorico</li>
                <li>• Activa la autenticación en dos pasos (próximamente)</li>
                <li>• Cambia tu contraseña regularmente</li>
              </ul>
            </div>
          </GlassCard>

          {/* Footer Links */}
          <div className="flex flex-col gap-4">
            <Link 
              href="/login" 
              className="flex items-center justify-center gap-2 text-neutral-600 dark:text-neutral-400 hover:text-cocorico-red dark:hover:text-amber-400 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver al inicio de sesión
            </Link>

            <div className="text-center">
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                ¿No tienes cuenta?{" "}
                <Link 
                  href="/signup" 
                  className="text-cocorico-red dark:text-amber-400 font-semibold hover:underline"
                >
                  Regístrate gratis
                </Link>
              </p>
            </div>
          </div>

          {/* Alternative Help */}
          <GlassCard className="p-6 text-center">
            <p className="text-sm text-neutral-600 dark:text-neutral-300 mb-3">
              ¿Tienes problemas para recuperar tu cuenta?
            </p>
            <Button 
              variant="outline" 
              className="text-sm"
              onClick={() => alert("Contacta con soporte en: support@cocorico.app")}
            >
              Contactar con soporte
            </Button>
          </GlassCard>
        </div>
      </div>
    </AppBackground>
    </>
  );
}
