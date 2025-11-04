import { ValidationResult } from "@/types/api";

export function validateMessage(message: unknown): ValidationResult<string> {
  if (!message || typeof message !== "string") {
    return {
      isValid: false,
      error: "El mensaje debe ser un texto no vacío"
    };
  }

  const trimmed = message.trim();
  if (trimmed.length === 0) {
    return {
      isValid: false,
      error: "El mensaje no puede estar vacío"
    };
  }

  if (trimmed.length > 1000) {
    return {
      isValid: false,
      error: "El mensaje no puede exceder 1000 caracteres"
    };
  }

  return {
    isValid: true,
    value: trimmed
  };
}

export function validateReturnTo(url: string): ValidationResult<string> {
  try {
    // Only allow relative paths
    if (url.startsWith('http')) {
      const urlObj = new URL(url);
      // Only allow URLs from same origin
      if (urlObj.origin !== window.location.origin) {
        return {
          isValid: false,
          error: "URL de retorno no válida"
        };
      }
      // Extract pathname+search+hash
      url = urlObj.pathname + urlObj.search + urlObj.hash;
    }

    // Basic safety checks
    if (!url.startsWith('/')) {
      return {
        isValid: false,
        error: "La ruta debe comenzar con /"
      };
    }

    return {
      isValid: true,
      value: url
    };
  } catch (e) {
    return {
      isValid: false,
      error: "URL de retorno inválida"
    };
  }
}