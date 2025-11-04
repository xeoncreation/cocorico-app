"use client";
import { useState } from "react";

export default function SubscribeButton() {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    
    try {
      const res = await fetch("/api/stripe/session", { method: "POST" });
      const data = await res.json();
      
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || "Error creando sesión de pago");
        setLoading(false);
      }
    } catch (err) {
      alert("Error de conexión. Intenta de nuevo.");
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="bg-white text-orange-600 font-semibold px-6 py-3 rounded-lg hover:bg-neutral-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? "Conectando con Stripe..." : "Hazte Premium 🥇"}
    </button>
  );
}
