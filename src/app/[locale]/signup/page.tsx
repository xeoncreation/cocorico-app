import { Metadata } from "next";
import Link from "next/link";
import GlassCard from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { AppBackground } from "@/components/layout/AppBackground";
import { Mail, Lock, User, Sparkles, Apple, Chrome } from "lucide-react";
import Wallpaper from "@/components/layout/Wallpaper";

export const metadata: Metadata = {
  title: "Crear Cuenta | Cocorico",
  description: "Únete a Cocorico y comienza tu viaje hacia una alimentación más saludable con IA personalizada.",
};

export default function SignUpPage() {
  return (
    <>
      <Wallpaper
        imageLight="/branding/LOGIN_MODO_CLARO.jpg"
        imageDark="/branding/LOGIN_MODO_OSCURO.jpg"
      />
      <AppBackground variantOverride="home-free">
        <div className="min-h-screen flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-md space-y-8">
            {/* Header */}
            <div className="text-center space-y-3">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-orange-400 to-red-500 text-white text-4xl shadow-2xl mb-4">
                🐓
              </div>
              <h1 className="text-4xl font-extrabold text-cocorico-brown dark:text-amber-100">
                ¡Únete a Cocorico!
              </h1>
              <p className="text-neutral-600 dark:text-neutral-300 text-lg">
                Crea tu cuenta y descubre el poder de la IA nutricional
              </p>
            </div>

            {/* Main Card */}
            <GlassCard className="p-8 space-y-6">
              {/* Social Signup */}
              <div className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full h-12 text-base font-semibold hover:bg-white/80 dark:hover:bg-neutral-800/80 transition-colors"
                  disabled
                >
                  <Chrome className="w-5 h-5 mr-3" />
                  Continuar con Google
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full h-12 text-base font-semibold hover:bg-white/80 dark:hover:bg-neutral-800/80 transition-colors"
                  disabled
                >
                  <Apple className="w-5 h-5 mr-3" />
                  Continuar con Apple
                </Button>
              </div>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-neutral-300 dark:border-neutral-700"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white/50 dark:bg-neutral-900/50 text-neutral-500 dark:text-neutral-400">
                    O crea tu cuenta con email
                  </span>
                </div>
              </div>

              {/* Signup Form */}
              <form className="space-y-4">
                {/* Name Field */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Nombre completo
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      placeholder="Tu nombre"
                      className="w-full pl-11 pr-4 py-3 bg-white/70 dark:bg-neutral-800/70 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-cocorico-red focus:border-transparent transition-all"
                    />
                  </div>
                </div>

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
                </div>

                {/* Password Field */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Contraseña
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      placeholder="Mínimo 8 caracteres"
                      className="w-full pl-11 pr-4 py-3 bg-white/70 dark:bg-neutral-800/70 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-cocorico-red focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                {/* Confirm Password Field */}
                <div>
                  <label htmlFor="confirm-password" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Confirmar contraseña
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                    <input
                      id="confirm-password"
                      name="confirm-password"
                      type="password"
                      required
                      placeholder="Repite tu contraseña"
                      className="w-full pl-11 pr-4 py-3 bg-white/70 dark:bg-neutral-800/70 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-cocorico-red focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                {/* Terms Checkbox */}
                <div className="flex items-start gap-3">
                  <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    required
                    className="mt-1 w-4 h-4 text-cocorico-red border-neutral-300 rounded focus:ring-cocorico-red"
                  />
                  <label htmlFor="terms" className="text-sm text-neutral-600 dark:text-neutral-400">
                    Acepto los{" "}
                    <Link href="/terms" className="text-cocorico-red hover:underline font-medium">
                      Términos de Servicio
                    </Link>
                    {" "}y la{" "}
                    <Link href="/privacy" className="text-cocorico-red hover:underline font-medium">
                      Política de Privacidad
                    </Link>
                  </label>
                </div>

                {/* Submit Button */}
                <Button 
                  type="submit" 
                  className="w-full h-12 text-base font-bold bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg hover:shadow-xl transition-all"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Crear mi cuenta
                </Button>
              </form>
            </GlassCard>

            {/* Footer Links */}
            <div className="text-center">
              <p className="text-neutral-600 dark:text-neutral-400">
                ¿Ya tienes cuenta?{" "}
                <Link 
                  href="/login" 
                  className="text-cocorico-red dark:text-amber-400 font-semibold hover:underline"
                >
                  Inicia sesión
                </Link>
              </p>
            </div>

            {/* Features Preview */}
            <GlassCard className="p-6">
              <h3 className="text-lg font-bold text-cocorico-brown dark:text-amber-100 mb-4 text-center">
                Lo que obtienes con tu cuenta gratuita:
              </h3>
              <ul className="space-y-3 text-sm text-neutral-600 dark:text-neutral-300">
                <li className="flex items-start gap-3">
                  <span className="text-lg">✓</span>
                  <span><strong>Chat IA ilimitado</strong> para preguntas sobre nutrición</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-lg">✓</span>
                  <span><strong>Escaneo de productos</strong> con puntuación nutricional</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-lg">✓</span>
                  <span><strong>Recetas saludables</strong> adaptadas a tus preferencias</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-lg">✓</span>
                  <span><strong>Seguimiento de progreso</strong> y sistema de badges</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-lg">✓</span>
                  <span><strong>Comunidad activa</strong> de usuarios saludables</span>
                </li>
              </ul>
            </GlassCard>
          </div>
        </div>
      </AppBackground>
    </>
  );
}
