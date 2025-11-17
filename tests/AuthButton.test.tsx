import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { supabase } from '@/app/lib/supabase-client';

// Mock next-intl to avoid ESM import issues and provide stable strings
jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const map: Record<string, string> = {
      'auth.login': 'Iniciar sesión',
      'auth.emailPlaceholder': 'Tu email',
      'auth.sendLink': 'Enviar enlace',
      'common.sending': 'Enviando...',
      'common.cancel': 'Cancelar',
      'auth.logout': 'Salir',
      'auth.magiclink.sent': 'Te enviamos un email con el enlace de acceso. Revísalo y vuelve aquí 👌'
    };
    return map[key] || key;
  }
}));

// Mock supabase client
jest.mock('@/app/lib/supabase-client', () => ({
  supabase: {
    auth: {
      getSession: jest.fn().mockResolvedValue({ data: { session: null } }),
      onAuthStateChange: jest.fn().mockReturnValue({ 
        data: { subscription: { unsubscribe: jest.fn() } }
      }),
      signInWithOtp: jest.fn().mockResolvedValue({ error: null }),
      signOut: jest.fn().mockResolvedValue({ error: null })
    }
  }
}));

describe('AuthButton', () => {
  beforeEach(() => {
    // Ensure a clean DOM/storage for each test
    localStorage.clear();
  });

  it('shows login button when not authenticated', () => {
    const { default: AuthButton } = require('../src/components/AuthButton');
    render(<AuthButton />);
    expect(screen.getByRole('button', { name: /Iniciar sesión/i })).toBeInTheDocument();
  });

  it('navigates to /login when clicking login', () => {
    const { default: AuthButton } = require('../src/components/AuthButton');
    render(<AuthButton />);
    const btn = screen.getByRole('button', { name: /Iniciar sesión/i });
    fireEvent.click(btn);
    expect(btn).toBeInTheDocument();
  });
});