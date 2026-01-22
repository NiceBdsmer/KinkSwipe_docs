import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Welcome } from '../../src/screens/Welcome';
import { useAppStore } from '../../src/store/useAppStore';

// Mock the store
vi.mock('../../src/store/useAppStore', () => ({
  useAppStore: vi.fn()
}));

describe('Welcome', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render welcome screen with title and buttons', () => {
    // Mock store to return setScreen function
    (useAppStore as any).mockImplementation((selector) => selector({
      setScreen: vi.fn()
    }));

    render(<Welcome />);

    expect(screen.getByText('KinkSwipe')).toBeInTheDocument();
    expect(screen.getByText('Discover your preferences together')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Start Swiping/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Load Link/i })).toBeInTheDocument();
  });

  it('should navigate to onboarding when Start Swiping is clicked', () => {
    const mockSetScreen = vi.fn();
    (useAppStore as any).mockImplementation((selector) => selector({
      setScreen: mockSetScreen
    }));

    render(<Welcome />);

    const startButton = screen.getByRole('button', { name: /Start Swiping/i });
    fireEvent.click(startButton);

    expect(mockSetScreen).toHaveBeenCalledWith('onboarding');
  });

  it('should navigate to load screen when Load Link is clicked', () => {
    const mockSetScreen = vi.fn();
    (useAppStore as any).mockImplementation((selector) => selector({
      setScreen: mockSetScreen
    }));

    render(<Welcome />);

    const loadButton = screen.getByRole('button', { name: /Load Link/i });
    fireEvent.click(loadButton);

    expect(mockSetScreen).toHaveBeenCalledWith('load');
  });
});