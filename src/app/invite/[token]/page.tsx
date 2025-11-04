"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function InvitePage({ params }: { params: { token: string } }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleAccept() {
    if (!email || !password) {
      setError("Email y contraseña son requeridos");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/invite/accept", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: params.token, email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setDone(true);
        setTimeout(() => router.push("/login"), 2000);
      } else {
        setError(data.error || "Error al aceptar la invitación.");
      }
    } catch (err) {
      setError("Error de conexión. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center bg-gradient-to-br from-orange-50 to-yellow-50">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md">
          <h1 className="text-2xl font-semibold mb-3 text-orange-600">🎉 Invitación confirmada</h1>
          <p className="text-neutral-600">
            Tu cuenta ha sido creada. Redirigiendo al login...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-orange-50 to-yellow-50">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-orange-600 mb-2">🐓 Cocorico</h1>
          <h2 className="text-xl font-semibold text-neutral-800">Invitación privada</h2>
        </div>

        <p className="text-neutral-600 mb-6 text-center">
          Has sido invitado a participar en la <strong>beta cerrada</strong> de Cocorico.
          Completa tus datos para unirte.
        </p>

        <div className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="tu@email.com"
              className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              placeholder="Mínimo 6 caracteres"
              className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>

          <button
            onClick={handleAccept}
            disabled={loading}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creando cuenta..." : "Aceptar invitación"}
          </button>
        </div>

        {error && (
          <div className="mt-4 bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <p className="mt-6 text-center text-sm text-gray-500">
          ¿Ya tienes cuenta?{" "}
          <a href="/login" className="text-orange-600 hover:underline">
            Inicia sesión
          </a>
        </p>
      </div>
    </div>
  );
}
