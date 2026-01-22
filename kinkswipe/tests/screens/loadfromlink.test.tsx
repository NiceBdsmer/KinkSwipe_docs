import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LoadFromLink } from '../../src/screens/LoadFromLink';
import { useAppStore } from '../../src/store/useAppStore';
import { decodePayload } from '../../src/utils/decodePayload';

// Mock dependencies
vi.mock('../../src/store/useAppStore', () => ({
  useAppStore: vi.fn()
}));

vi.mock('../../src/utils/decodePayload', () => ({
  decodePayload: vi.fn()
}));

vi.mock('../../src/screens/SummaryScreen', () => ({
  SummaryScreen: () => <div>Summary Screen</div>
}));

describe('LoadFromLink', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock window.location
    Object.defineProperty(window, 'location', {
      value: { search: '' },
      writable: true
    });
  });

  it('should render input form by default', () => {
    (useAppStore as any).mockImplementation((selector) => selector({
      setScreen: vi.fn()
    }));

    render(<LoadFromLink />);

    expect(screen.getByRole('heading', { name: 'Load Results' })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('https://kinkswipe.app/?d=...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Load Results/i })).toBeInTheDocument();
  });

  it('should decode payload from URL on mount', async () => {
    const mockDecodedData = {
      ratings: { give: {}, receive: {} },
      userMeta: { mode: 'give', experience: 'newbie', agreedToTerms: true }
    };

    (decodePayload as any).mockReturnValue(mockDecodedData);
    (useAppStore as any).mockImplementation((selector) => selector({
      setScreen: vi.fn()
    }));

    // Mock URL with payload
    Object.defineProperty(window, 'location', {
      value: { search: '?d=test-payload' },
      writable: true
    });

    render(<LoadFromLink />);

    await waitFor(() => {
      expect(decodePayload).toHaveBeenCalledWith('test-payload');
    });
  });

  it('should show loaded data when payload is valid', async () => {
    const mockDecodedData = {
      ratings: { give: {}, receive: {} },
      userMeta: { mode: 'give', experience: 'newbie', agreedToTerms: true }
    };

    (decodePayload as any).mockReturnValue(mockDecodedData);
    (useAppStore as any).mockImplementation((selector) => selector({
      setScreen: vi.fn()
    }));

    render(<LoadFromLink />);

    // Simulate loading a valid URL
    const input = screen.getByPlaceholderText('https://kinkswipe.app/?d=...');
    fireEvent.change(input, { target: { value: 'https://kinkswipe.app/?d=test-payload' } });

    const loadButton = screen.getByRole('button', { name: /Load Results/i });
    fireEvent.click(loadButton);

    await waitFor(() => {
      expect(screen.getByText("Loaded Someone's Results")).toBeInTheDocument();
      expect(screen.getByText('Summary Screen')).toBeInTheDocument();
    });
  });

  it('should show error for invalid payload', async () => {
    (decodePayload as any).mockImplementation(() => {
      throw new Error('Invalid payload');
    });
    (useAppStore as any).mockImplementation((selector) => selector({
      setScreen: vi.fn()
    }));

    render(<LoadFromLink />);

    const input = screen.getByPlaceholderText('https://kinkswipe.app/?d=...');
    fireEvent.change(input, { target: { value: 'https://kinkswipe.app/?d=invalid' } });

    const loadButton = screen.getByRole('button', { name: /Load Results/i });
    fireEvent.click(loadButton);

    await waitFor(() => {
      expect(screen.getByText('Invalid payload')).toBeInTheDocument();
    });
  });

  it('should navigate to onboarding when Start My Own is clicked', async () => {
    const mockDecodedData = {
      ratings: { give: {}, receive: {} },
      userMeta: { mode: 'give', experience: 'newbie', agreedToTerms: true }
    };

    const mockSetScreen = vi.fn();
    (decodePayload as any).mockReturnValue(mockDecodedData);
    (useAppStore as any).mockImplementation((selector) => selector({
      setScreen: mockSetScreen
    }));

    render(<LoadFromLink />);

    // Load data first
    const input = screen.getByPlaceholderText('https://kinkswipe.app/?d=...');
    fireEvent.change(input, { target: { value: 'https://kinkswipe.app/?d=test-payload' } });
    fireEvent.click(screen.getByRole('button', { name: /Load Results/i }));

    await waitFor(() => {
      expect(screen.getByText("Loaded Someone's Results")).toBeInTheDocument();
    });

    // Click start own
    const startOwnButton = screen.getByRole('button', { name: /Start My Own Assessment/i });
    fireEvent.click(startOwnButton);

    expect(mockSetScreen).toHaveBeenCalledWith('onboarding');
  });

  it('should navigate back to welcome screen', () => {
    const mockSetScreen = vi.fn();
    (useAppStore as any).mockImplementation((selector) => selector({
      setScreen: mockSetScreen
    }));

    render(<LoadFromLink />);

    const backButton = screen.getByRole('button', { name: /Back to Welcome/i });
    fireEvent.click(backButton);

    expect(mockSetScreen).toHaveBeenCalledWith('welcome');
  });
});