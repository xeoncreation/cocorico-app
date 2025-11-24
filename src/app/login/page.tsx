
import LegacyPageWrapper from "@/components/layout/LegacyPageWrapper";
import Wallpaper from "@/components/layout/Wallpaper";
import Link from "next/link";

export default function LoginPage() {
  // TODO: Integrar lógica real de login
  return (
    <>
      <Wallpaper
        imageLight="/branding/LOGIN_MODO_CLARO.jpg"
        imageDark="/branding/LOGIN_MODO_OSCURO.jpg"
      />
      <LegacyPageWrapper>
        <div className="mx-auto max-w-md px-6 py-10 coco-glass rounded-2xl">
          <div className="mb-6 flex justify-center">
            <img
              src="/branding/cocorico-mascot-anim-optimized.gif"
              alt="Cocorico animado"
              style={{ width: 120, height: 120, borderRadius: '1rem', objectFit: 'cover', boxShadow: '0 4px 24px rgba(0,0,0,0.12)' }}
            />
          </div>
          <h1 className="text-3xl font-bold mb-2">Iniciar sesión</h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-6">
            Usa tu correo y contraseña, o deja la contraseña vacía para recibir un enlace mágico.
          </p>
          {/* Aquí va el formulario real de login */}
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Correo electrónico</label>
              <input
                type="email"
                className="w-full rounded-md border coco-glass px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cocorico-red"
                placeholder="tucorreo@ejemplo.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Contraseña (opcional)</label>
              <input
                type="password"
                className="w-full rounded-md border coco-glass px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cocorico-red"
                placeholder="••••••••"
              />
              <p className="mt-1 text-xs text-neutral-500">Déjalo vacío para recibir un enlace mágico.</p>
            </div>
            <button
              type="submit"
              className="w-full rounded-md coco-glass font-semibold py-2 hover:opacity-95"
            >
              Entrar / Enlace mágico
            </button>
          </form>
          <div className="mt-8 text-sm text-neutral-600 dark:text-neutral-400">
            ¿No tienes cuenta?{" "}
            <Link href="/signup" className="text-cocorico-red font-semibold hover:underline">
              Regístrate aquí
            </Link>
          </div>
        </div>
      </LegacyPageWrapper>
    </>
  );
}
