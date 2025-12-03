"use client";

import { useState } from "react";
import Wallpaper from "@/components/layout/Wallpaper";

export default function CheckoutPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function startCheckout() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/billing/create-session", {
        method: "POST",
      });

      if (!res.ok) {
        throw new Error("Error al crear sesión de pago");
      }

      const data = await res.json();

      if (data.error) {
        throw new Error(data.error);
      }

      if (data.url) {
        // Redirigir a Stripe Checkout
        window.location.href = data.url;
      } else {
        throw new Error("No se recibió URL de checkout");
      }
    } catch (err: any) {
      console.error("Error:", err);
      setError(err.message || "Error al iniciar el proceso de pago");
      setLoading(false);
    }
  }

  return (
    <>
      <Wallpaper
        imageLight="/branding/HOME-INICIO,  Fondo Campo de Trigo, modo claro.png"
        imageDark="/branding/HOME - INICIO — Campo de trigo nocturno cálido (dark mode).png"
      />
      <div className="max-w-md mx-auto p-6">
        <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-lg p-8">
          <h1 className="heading-2 mb-2 text-center">
          Completa tu suscripción 🐓
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400 text-center mb-6">
          Serás redirigido a Stripe para completar el pago de forma segura
        </p>

        <div className="border dark:border-neutral-700 rounded-lg p-6 mb-6 bg-neutral-50 dark:bg-neutral-800">
          <div className="flex justify-between mb-2">
            <span className="font-medium">Plan Premium</span>
            <span className="font-bold">€4.99/mes</span>
          </div>
          <ul className="text-sm text-neutral-600 dark:text-neutral-400 space-y-1 mt-4">
            <li>✅ IA ilimitada</li>
            <li>✅ Recetas exclusivas</li>
            <li>✅ Chat privado</li>
            <li>✅ Sin anuncios</li>
          </ul>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4">
            <p className="text-red-800 dark:text-red-200 text-sm">{error}</p>
          </div>
        )}

        <button
          onClick={startCheckout}
          disabled={loading}
          className="w-full bg-cocorico-red text-white rounded-lg px-4 py-3 font-semibold hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg"
        >
          {loading ? "Redirigiendo a Stripe..." : "Ir a pago seguro"}
        </button>

        <p className="text-xs text-center text-neutral-500 mt-4">
          🔒 Pago seguro procesado por Stripe
          <br />
          Puedes cancelar en cualquier momento
        </p>
      </div>
      </div>
    </>
  );
}
