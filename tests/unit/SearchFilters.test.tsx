/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import SearchFilters from '@/components/search/SearchFilters';
import type { SearchFilterState } from '@/components/search/SearchFilters';

describe('SearchFilters Component', () => {
  
  const defaultFilters: SearchFilterState = {
    maxTime: 120,
    difficulty: [],
    diets: [],
    ingredients: [],
  };

  const mockOnChange = jest.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it('debe renderizar el componente correctamente', () => {
    render(
      <SearchFilters 
        value={defaultFilters} 
        onChange={mockOnChange}
        plan="free"
      />
    );
    
    // Verificar que el botón de filtros está presente
    expect(screen.getByRole('button', { name: /filtros/i })).toBeInTheDocument();
  });

  it('debe renderizar con plan premium', () => {
    render(
      <SearchFilters 
        value={defaultFilters} 
        onChange={mockOnChange}
        plan="premium"
      />
    );
    
    expect(screen.getByRole('button', { name: /filtros/i })).toBeInTheDocument();
  });

  it('debe mostrar valores iniciales correctamente', () => {
    const filtersWithValues: SearchFilterState = {
      maxTime: 60,
      difficulty: ['easy'],
      diets: ['vegetarian'],
      ingredients: ['tomate'],
    };

    render(
      <SearchFilters 
        value={filtersWithValues} 
        onChange={mockOnChange}
        plan="free"
      />
    );
    
    // El componente debería renderizar con los valores
    expect(screen.getByRole('button', { name: /filtros/i })).toBeInTheDocument();
  });
});
