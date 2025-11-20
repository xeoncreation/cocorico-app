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
      className="w-full coco-btn-primary px-6 py-3 rounded-xl font-bold text-white hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
    >
      {loading ? "Conectando con Stripe..." : "Hazte Premium 🥇"}
    </button>
  );
}
