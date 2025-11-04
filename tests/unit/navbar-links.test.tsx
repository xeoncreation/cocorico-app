import { render, screen } from '@testing-library/react';
import Navbar from '@/components/Navbar';

jest.mock('@/components/ThemeToggle', () => () => <div data-testid="theme-toggle" />);
jest.mock('@/components/LanguageSelector', () => () => <div data-testid="lang-selector" />);

describe('Navbar links', () => {
  it('renders main navigation links with correct hrefs', () => {
    render(<Navbar />);

    const chat = screen.getByRole('link', { name: 'Chat' }) as HTMLAnchorElement;
    const fav = screen.getByRole('link', { name: 'Favoritos' }) as HTMLAnchorElement;
    const stats = screen.getByRole('link', { name: 'Estadísticas' }) as HTMLAnchorElement;
    const login = screen.getByRole('link', { name: 'Iniciar sesión' }) as HTMLAnchorElement;

    expect(chat).toBeInTheDocument();
    expect(fav).toBeInTheDocument();
    expect(stats).toBeInTheDocument();
    expect(login).toBeInTheDocument();

    expect(chat.getAttribute('href')).toBe('/chat');
    expect(fav.getAttribute('href')).toBe('/dashboard/favorites');
    expect(stats.getAttribute('href')).toBe('/dashboard/stats');
    expect(login.getAttribute('href')).toBe('/login');
  });
});
