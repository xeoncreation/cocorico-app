
"use client";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { AppBackground } from "@/components/layout/AppBackground";
import { Button } from "@/components/ui/button";
import GlassCard from "@/components/ui/GlassCard";
import { Mail, Lock, Chrome, Apple } from "lucide-react";

export default function LoginPage({ params: { locale } }: { params: { locale: string } }) {
  const t = useTranslations();

  return (
    <AppBackground variantOverride="home-free">
      <div className="min-h-screen flex items-center justify-center px-4 py-12">
        <GlassCard className="w-full max-w-md p-8 space-y-6">
          {/* Logo y título */}
          <div className="text-center space-y-2">
            <div className="mb-4 flex justify-center">
              <img
                src="/branding/cocorico-mascot-anim-optimized.gif"
                alt="Cocorico animado"
                style={{ width: 120, height: 120, borderRadius: '1rem', objectFit: 'cover', boxShadow: '0 4px 24px rgba(0,0,0,0.12)' }}
              />
            </div>
            <h1 className="text-3xl font-bold text-cocorico-brown dark:text-amber-100">
              {t("login.welcome", { default: "Bienvenido a Cocorico" })}
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400">
              {t("login.subtitle", { default: "Inicia sesión para acceder a todas las funciones" })}
            </p>
          </div>

          {/* Formulario */}
          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); alert("Funcionalidad en desarrollo"); }}>
            {/* Email */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                {t("login.email", { default: "Correo electrónico" })}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  id="email"
                  type="email"
                  placeholder={t("login.emailPlaceholder", { default: "tu@email.com" })}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border coco-glass text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-cocorico-red dark:focus:ring-amber-500"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                {t("login.password", { default: "Contraseña" })}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  id="password"
                  type="password"
                  placeholder={t("login.passwordPlaceholder", { default: "••••••••" })}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border coco-glass text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-cocorico-red dark:focus:ring-amber-500"
                  required
                />
              </div>
            </div>

            {/* Recordar y olvidé contraseña */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded border-neutral-300" />
                <span className="text-neutral-600 dark:text-neutral-400">{t("login.rememberMe", { default: "Recordarme" })}</span>
              </label>
              <Link href={`/${locale}/reset-password`} className="text-cocorico-red dark:text-amber-400 hover:underline">
                {t("login.forgotPassword", { default: "¿Olvidaste tu contraseña?" })}
              </Link>
            </div>

            {/* Submit */}
            <Button type="submit" className="w-full coco-glass" size="lg">
              {t("login.submit", { default: "Iniciar sesión" })}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-300 dark:border-neutral-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white dark:bg-neutral-800 text-neutral-500">{t("login.orContinueWith", { default: "O continúa con" })}</span>
            </div>
          </div>

          {/* Social Login */}
          <div className="grid grid-cols-2 gap-4">
            <Button className="w-full coco-glass" onClick={() => alert("Google login en desarrollo")}> 
              <Chrome className="w-5 h-5 mr-2" />
              Google
            </Button>
            <Button className="w-full coco-glass" onClick={() => alert("Apple login en desarrollo")}> 
              <Apple className="w-5 h-5 mr-2" />
              Apple
            </Button>
          </div>

          {/* Sign up link */}
          <div className="text-center text-sm text-neutral-600 dark:text-neutral-400">
            {t("login.noAccount", { default: "¿No tienes cuenta?" })} {" "}
            <Link href={`/${locale}/signup`} className="text-cocorico-red dark:text-amber-400 font-semibold hover:underline">
              {t("login.signup", { default: "Regístrate gratis" })}
            </Link>
          </div>
        </GlassCard>
      </div>
    </AppBackground>
  );
}
