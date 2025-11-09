import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import OnboardingModal from '@/components/OnboardingModal';

// Mock framer-motion to avoid complex animation logic in tests
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  X: () => <span>X</span>,
  ChefHat: () => <span>ChefHat</span>,
  Camera: () => <span>Camera</span>,
  Trophy: () => <span>Trophy</span>,
}));

// Mock UmamiAnalytics tracking
jest.mock('@/components/UmamiAnalytics', () => ({
  trackEvent: {
    onboardingStarted: jest.fn(),
    onboardingStepCompleted: jest.fn(),
    onboardingCompleted: jest.fn(),
  },
}));

describe('OnboardingModal', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    jest.clearAllMocks();
  });

  it('should render modal when onboarding_completed is not set', () => {
    render(<OnboardingModal />);
    expect(screen.getByText(/¡Bienvenido a Cocorico!/i)).toBeInTheDocument();
  });

  it('should not render modal when onboarding_completed is set', () => {
    localStorage.setItem('onboarding_completed', 'true');
    render(<OnboardingModal />);
    expect(screen.queryByText(/¡Bienvenido a Cocorico!/i)).not.toBeInTheDocument();
  });

  it('should show first step on initial render', () => {
    render(<OnboardingModal />);
    expect(screen.getByText(/¡Bienvenido a Cocorico!/i)).toBeInTheDocument();
    expect(screen.getByText(/Tu asistente de cocina con inteligencia artificial está listo para ayudarte/i)).toBeInTheDocument();
    expect(screen.getByText(/Comenzar/i)).toBeInTheDocument();
  });

  it('should advance to next step when clicking action button', async () => {
    render(<OnboardingModal />);
    
    // First step
    expect(screen.getByText(/¡Bienvenido a Cocorico!/i)).toBeInTheDocument();
    
    // Click next
    const nextButton = screen.getByText(/Comenzar/i);
    fireEvent.click(nextButton);
    
    // Second step
    await waitFor(() => {
      expect(screen.getByText(/1\. Crea tu primera receta/i)).toBeInTheDocument();
    });
  });

  it('should allow going back to previous step', async () => {
    render(<OnboardingModal />);
    
    // Go to step 2
    fireEvent.click(screen.getByText(/Comenzar/i));
    await waitFor(() => {
      expect(screen.getByText(/1\. Crea tu primera receta/i)).toBeInTheDocument();
    });
    
    // Click back
    const backButton = screen.getByText(/Atrás/i);
    fireEvent.click(backButton);
    
    // Should be back at step 1
    await waitFor(() => {
      expect(screen.getByText(/¡Bienvenido a Cocorico!/i)).toBeInTheDocument();
    });
  });

  it('should complete and hide modal on final step', async () => {
    render(<OnboardingModal />);
    
    // Navigate through all steps
    fireEvent.click(screen.getByText(/Comenzar/i));
    
    await waitFor(() => {
      expect(screen.getByText(/1\. Crea tu primera receta/i)).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText(/Ir a crear receta/i));
    
    await waitFor(() => {
      expect(screen.getByText(/2\. Prueba el escáner de ingredientes/i)).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText(/Probar escáner/i));
    
    await waitFor(() => {
      expect(screen.getByText(/3\. Completa un reto diario/i)).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText(/¡Empezar!/i));
    
    // Modal should be hidden
    await waitFor(() => {
      expect(screen.queryByText(/3\. Completa un reto diario/i)).not.toBeInTheDocument();
    });
    
    // localStorage should be set
    expect(localStorage.getItem('onboarding_completed')).toBe('true');
  });

  it('should close modal and set completed when clicking skip', async () => {
    render(<OnboardingModal />);
    
    const skipButton = screen.getByText(/Saltar tutorial/i);
    fireEvent.click(skipButton);
    
    await waitFor(() => {
      expect(screen.queryByText(/¡Bienvenido a Cocorico!/i)).not.toBeInTheDocument();
    });
    
    expect(localStorage.getItem('onboarding_completed')).toBe('true');
  });

  it('should close modal when clicking X button', async () => {
    render(<OnboardingModal />);
    
    const closeButton = screen.getByLabelText(/Cerrar/i);
    fireEvent.click(closeButton);
    
    await waitFor(() => {
      expect(screen.queryByText(/¡Bienvenido a Cocorico!/i)).not.toBeInTheDocument();
    });
    
    expect(localStorage.getItem('onboarding_completed')).toBe('true');
  });

  it('should call onComplete callback when provided', async () => {
    const onCompleteMock = jest.fn();
    render(<OnboardingModal onComplete={onCompleteMock} />);
    
    // Skip to completion
    const skipButton = screen.getByText(/Saltar tutorial/i);
    fireEvent.click(skipButton);
    
    await waitFor(() => {
      expect(onCompleteMock).toHaveBeenCalledTimes(1);
    });
  });
});
