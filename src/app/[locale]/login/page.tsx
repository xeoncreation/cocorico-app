
"use client";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { AppBackground } from "@/components/layout/AppBackground";
import Wallpaper from "@/components/layout/Wallpaper";
import { Button } from "@/components/ui/button";
import GlassCard from "@/components/ui/GlassCard";
import { Mail, Lock, Chrome, Apple } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/app/lib/supabase-client";
import { useRouter } from "next/navigation";

function LoginForm({ locale, t }: { locale: string; t: any }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      if (!email) {
        setError("Por favor ingresa tu email");
        return;
      }

      // Si hay contraseña, login con password
      if (password) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        setMessage("¡Inicio de sesión exitoso!");
        setTimeout(() => router.push(`/${locale}`), 1000);
      } else {
        // Sin contraseña, enviar magic link
        const redirectTo = typeof window !== 'undefined' 
          ? `${window.location.protocol}//${window.location.host}/${locale}`
          : undefined;

        const { error } = await supabase.auth.signInWithOtp({
          email,
          options: {
            emailRedirectTo: redirectTo,
          },
        });
        if (error) throw error;
        setMessage("✉️ Te enviamos un enlace mágico. Revisa tu correo.");
      }
    } catch (e: any) {
      setError(e?.message ?? "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t("login.emailPlaceholder", { default: "tu@email.com" })}
            className="w-full pl-10 pr-4 py-3 rounded-lg border coco-glass text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-cocorico-red dark:focus:ring-amber-500"
            required
          />
        </div>
      </div>

      {/* Password */}
      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
          {t("login.password", { default: "Contraseña (opcional)" })}
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t("login.passwordPlaceholder", { default: "••••••••" })}
            className="w-full pl-10 pr-4 py-3 rounded-lg border coco-glass text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-cocorico-red dark:focus:ring-amber-500"
          />
        </div>
        <p className="text-xs text-neutral-500 dark:text-neutral-400">Déjalo vacío para recibir un enlace mágico</p>
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
      <Button type="submit" className="w-full coco-glass" size="lg" disabled={loading}>
        {loading ? "Entrando..." : password ? t("login.submit", { default: "Iniciar sesión" }) : "Enviar enlace mágico"}
      </Button>

      {/* Messages */}
      {message && <div className="rounded-lg bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 px-4 py-3 text-sm">{message}</div>}
      {error && <div className="rounded-lg bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300 px-4 py-3 text-sm">{error}</div>}
    </form>
  );
}

export default function LoginPage({ params: { locale } }: { params: { locale: string } }) {
  const t = useTranslations();

  return (
    <>
      <Wallpaper
        imageLight="/branding/LOGIN - REGISTER — Fondo cálido crema, modo claro.png"
        imageDark="/branding/LOGIN - REGISTER — Fondo crema, modo oscuro.png"
      />
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
            <h1 className="heading-2 text-cocorico-brown dark:text-amber-100">
              {t("login.welcome", { default: "Bienvenido a Cocorico" })}
            </h1>
            <p className="body-regular text-neutral-600 dark:text-neutral-400">
              {t("login.subtitle", { default: "Inicia sesión para acceder a todas las funciones" })}
            </p>
          </div>

          {/* Formulario */}
          <LoginForm locale={locale} t={t} />

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
    </>
  );
}
