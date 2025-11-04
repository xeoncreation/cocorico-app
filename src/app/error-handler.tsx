"use client";

import { useEffect } from "react";

export function GlobalErrorHandler() {
  useEffect(() => {
    // Silenciar errores de extensiones de navegador (MetaMask, etc.)
    const originalError = console.error;
    console.error = (...args) => {
      const errorMessage = args.join(" ");
      
      // Ignorar errores conocidos de extensiones
      if (
        errorMessage.includes("MetaMask") ||
        errorMessage.includes("chrome-extension://") ||
        errorMessage.includes("moz-extension://")
      ) {
        return;
      }
      
      originalError(...args);
    };

    // Manejar errores no capturados
    const handleError = (event: ErrorEvent) => {
      if (
        event.message?.includes("MetaMask") ||
        event.filename?.includes("chrome-extension://") ||
        event.filename?.includes("moz-extension://")
      ) {
        event.preventDefault();
        return;
      }
    };

    window.addEventListener("error", handleError);

    return () => {
      console.error = originalError;
      window.removeEventListener("error", handleError);
    };
  }, []);

  return null;
}
