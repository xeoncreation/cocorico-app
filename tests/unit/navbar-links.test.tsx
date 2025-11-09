import { render, screen } from '@testing-library/react';
import Navbar from '@/components/Navbar';

jest.mock('@/components/ThemeToggle', () => () => <div data-testid="theme-toggle" />);
jest.mock('@/components/LanguageSelector', () => () => <div data-testid="lang-selector" />);

describe('Navbar links', () => {
  it('renders main navigation links with correct hrefs', () => {
    render(<Navbar />);

    const chat = screen.getByRole('link', { name: 'Chat' }) as HTMLAnchorElement;
    const recetas = screen.getByRole('link', { name: 'Recetas' }) as HTMLAnchorElement;
    const comunidad = screen.getByRole('link', { name: 'Comunidad' }) as HTMLAnchorElement;
    const retos = screen.getByRole('link', { name: 'Retos' }) as HTMLAnchorElement;
    const premium = screen.getByRole('link', { name: 'Premium' }) as HTMLAnchorElement;
    const login = screen.getByRole('link', { name: 'Iniciar sesión' }) as HTMLAnchorElement;

    expect(chat).toBeInTheDocument();
    expect(recetas).toBeInTheDocument();
    expect(comunidad).toBeInTheDocument();
    expect(retos).toBeInTheDocument();
    expect(premium).toBeInTheDocument();
    expect(login).toBeInTheDocument();

    expect(chat.getAttribute('href')).toBe('/chat');
    expect(recetas.getAttribute('href')).toBe('/recipes');
    expect(comunidad.getAttribute('href')).toBe('/community');
    expect(retos.getAttribute('href')).toBe('/dashboard/challenges');
    expect(premium.getAttribute('href')).toBe('/pricing');
    expect(login.getAttribute('href')).toBe('/login');
  });
});
