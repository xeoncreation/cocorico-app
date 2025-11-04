// Types for API responses
export interface ApiError {
  error: string;
  detail?: unknown;
}

export interface ChatResponse {
  answer?: string;
  error?: string;
  detail?: unknown;
}

export interface AuthCallbackError {
  message: string;
  status: number;
}

// Utility type for validation
export type ValidationResult<T> = {
  isValid: boolean;
  value?: T;
  error?: string;
};

// Chat message type
export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

// Auth types
export interface AuthRedirectConfig {
  returnTo?: string;
  emailRedirectTo: string;
}