"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/app/lib/supabase-client";
import Link from "next/link";

const schema = z.object({
  email: z.string().email("Correo inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres").optional().or(z.literal("")),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      if (!supabase) {
        setError("Autenticación no disponible: configura las variables NEXT_PUBLIC_SUPABASE_*.");
        return;
      }

      // If password provided, try password login; otherwise send magic link
      if (data.password && data.password.length >= 6) {
        const { error } = await supabase.auth.signInWithPassword({
          email: data.email,
          password: data.password,
        });
        if (error) throw error;
        setMessage("Inicio de sesión correcto. Redirigiendo…");
        // Give a brief moment to ensure session is set
        setTimeout(() => router.push("/"), 600);
      } else {
        const { error } = await supabase.auth.signInWithOtp({ email: data.email, options: { emailRedirectTo: window.location.origin } });
        if (error) throw error;
        setMessage("Te enviamos un enlace mágico a tu correo. Revisa tu bandeja.");
      }
    } catch (e: any) {
      setError(e?.message ?? "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-6 py-10">
      <h1 className="text-3xl font-bold mb-2">Iniciar sesión</h1>
      <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-6">
        Usa tu correo y contraseña, o deja la contraseña vacía para recibir un enlace mágico.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Correo electrónico</label>
          <input
            type="email"
            className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cocorico-red"
            placeholder="tucorreo@ejemplo.com"
            {...register("email")}
          />
          {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Contraseña (opcional)</label>
          <input
            type="password"
            className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cocorico-red"
            placeholder="••••••••"
            {...register("password")}
          />
          {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>}
          <p className="mt-1 text-xs text-neutral-500">Déjalo vacío para recibir un enlace mágico.</p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-cocorico-red text-white font-semibold py-2 hover:opacity-95 disabled:opacity-60"
        >
          {loading ? "Procesando…" : "Entrar / Enlace mágico"}
        </button>
      </form>

      {message && <div className="mt-4 rounded-md bg-green-50 text-green-800 px-3 py-2 text-sm">{message}</div>}
      {error && <div className="mt-4 rounded-md bg-red-50 text-red-800 px-3 py-2 text-sm">{error}</div>}

      <div className="mt-8 text-sm text-neutral-600 dark:text-neutral-400">
        ¿No tienes cuenta?{" "}
        <Link href="/signup" className="text-cocorico-red font-semibold hover:underline">
          Regístrate aquí
        </Link>
      </div>
    </div>
  );
}
