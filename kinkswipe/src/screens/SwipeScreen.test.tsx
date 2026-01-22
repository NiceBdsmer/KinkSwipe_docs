import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { SwipeScreen } from './SwipeScreen';
import { useAppStore } from '../store/useAppStore';
import { categories } from '../data/categories';

const mockSetScreen = vi.fn();
const mockSetRating = vi.fn();
const mockSetCurrentCategory = vi.fn();
const mockSetCurrentActivityIndex = vi.fn();

const defaultStoreState = {
  currentCategory: categories[0].id,
  currentActivityIndex: 0,
  ratings: {
    give: {},
    receive: {}
  },
  userMeta: {
    mode: 'give' as const,
    experience: 'newbie' as const,
    agreedToTerms: true
  },
  setScreen: mockSetScreen,
  setRating: mockSetRating,
  setCurrentCategory: mockSetCurrentCategory,
  setCurrentActivityIndex: mockSetCurrentActivityIndex
};

vi.mock('../store/useAppStore', () => ({
  useAppStore: vi.fn()
}));

describe('SwipeScreen', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useAppStore as any).mockReturnValue(defaultStoreState);
  });
  
  it('should render Header, SwipeCard, and ActionButtons', () => {
    render(<SwipeScreen />);
    
    expect(screen.getByRole('button', { name: /Back/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /YES/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /MAYBE/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /MEH/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /NOPE/ })).toBeInTheDocument();
  });
  
  it('should display category progress', () => {
    render(<SwipeScreen />);
    
    const progressElements = screen.getAllByText(/0 \/ \d+/);
    expect(progressElements.length).toBeGreaterThan(0);
    expect(screen.getByText(/total/)).toBeInTheDocument();
  });
  
  it('should call setRating with yes on right swipe', async () => {
    render(<SwipeScreen />);
    
    const buttons = screen.getAllByText(/YES/);
    const yesButton = buttons.find(btn => btn.tagName === 'BUTTON');
    fireEvent.click(yesButton!);
    
    await waitFor(() => {
      expect(mockSetRating).toHaveBeenCalledWith('give', expect.any(String), 'yes');
    });
  });
  
  it('should call setRating with maybe on up swipe (maybe button)', async () => {
    render(<SwipeScreen />);
    
    const buttons = screen.getAllByText(/MAYBE/);
    const maybeButton = buttons.find(btn => btn.tagName === 'BUTTON');
    fireEvent.click(maybeButton!);
    
    await waitFor(() => {
      expect(mockSetRating).toHaveBeenCalledWith('give', expect.any(String), 'maybe');
    });
  });
  
  it('should call setRating with meh on down swipe (meh button)', async () => {
    render(<SwipeScreen />);
    
    const buttons = screen.getAllByText(/MEH/);
    const mehButton = buttons.find(btn => btn.tagName === 'BUTTON');
    fireEvent.click(mehButton!);
    
    await waitFor(() => {
      expect(mockSetRating).toHaveBeenCalledWith('give', expect.any(String), 'meh');
    });
  });
  
  it('should call setRating with no on left swipe (nope button)', async () => {
    render(<SwipeScreen />);
    
    const buttons = screen.getAllByText(/NOPE/);
    const nopeButton = buttons.find(btn => btn.tagName === 'BUTTON');
    fireEvent.click(nopeButton!);
    
    await waitFor(() => {
      expect(mockSetRating).toHaveBeenCalledWith('give', expect.any(String), 'no');
    });
  });
  
  it('should increment activity index after swipe', async () => {
    render(<SwipeScreen />);
    
    const buttons = screen.getAllByText(/YES/);
    const yesButton = buttons.find(btn => btn.tagName === 'BUTTON');
    fireEvent.click(yesButton!);
    
    await waitFor(() => {
      expect(mockSetCurrentActivityIndex).toHaveBeenCalledWith(1);
    });
  });
  
  it('should show RoundComplete dialog when both mode completes give round', async () => {
    const bothModeState = {
      ...defaultStoreState,
      currentCategory: categories[categories.length - 1].id,
      currentActivityIndex: 19,
      userMeta: {
        mode: 'both' as const,
        experience: 'newbie' as const,
        agreedToTerms: true
      }
    };
    
    (useAppStore as any).mockReturnValue(bothModeState);
    
    render(<SwipeScreen />);
    
    const buttons = screen.getAllByText(/YES/);
    const yesButton = buttons.find(btn => btn.tagName === 'BUTTON');
    fireEvent.click(yesButton!);
    
    await waitFor(() => {
      expect(screen.getByText(/Round Complete/i)).toBeInTheDocument();
    });
  });
  
  it('should navigate to summary when user declines second round', async () => {
    const bothModeState = {
      ...defaultStoreState,
      currentCategory: categories[categories.length - 1].id,
      currentActivityIndex: 19,
      userMeta: {
        mode: 'both' as const,
        experience: 'newbie' as const,
        agreedToTerms: true
      }
    };
    
    (useAppStore as any).mockReturnValue(bothModeState);
    
    render(<SwipeScreen />);
    
    const buttons = screen.getAllByText(/YES/);
    const yesButton = buttons.find(btn => btn.tagName === 'BUTTON');
    fireEvent.click(yesButton!);
    
    await waitFor(() => {
      expect(screen.getByText(/Round Complete/i)).toBeInTheDocument();
    });
    
    const viewSummaryButton = screen.getByText(/View Summary/i);
    fireEvent.click(viewSummaryButton);
    
    await waitFor(() => {
      expect(mockSetScreen).toHaveBeenCalledWith('summary');
    });
  });
  
  it('should reset to first category when user continues second round', async () => {
    const bothModeState = {
      ...defaultStoreState,
      currentCategory: categories[categories.length - 1].id,
      currentActivityIndex: 19,
      userMeta: {
        mode: 'both' as const,
        experience: 'newbie' as const,
        agreedToTerms: true
      }
    };
    
    (useAppStore as any).mockReturnValue(bothModeState);
    
    render(<SwipeScreen />);
    
    const buttons = screen.getAllByRole('button', { name: /YES/ });
    fireEvent.click(buttons[0]);
    
    await waitFor(() => {
      expect(screen.getByText(/Round Complete/i)).toBeInTheDocument();
    });
    
    const continueButtons = screen.getAllByRole('button', { name: /Continue/i });
    const continueButton = continueButtons[0];
    fireEvent.click(continueButton);
    
    await waitFor(() => {
      expect(mockSetCurrentCategory).toHaveBeenCalledWith(categories[0].id);
      expect(mockSetCurrentActivityIndex).toHaveBeenCalledWith(0);
    });
  });
  
  it('should skip category when Skip Category button is clicked', async () => {
    render(<SwipeScreen />);
    
    const skipButton = screen.getByText(/Skip Category/i);
    fireEvent.click(skipButton);
    
    await waitFor(() => {
      expect(mockSetCurrentCategory).toHaveBeenCalledWith(categories[1].id);
      expect(mockSetCurrentActivityIndex).toHaveBeenCalledWith(0);
    });
  });
  
  it('should navigate to welcome when back button is clicked', () => {
    render(<SwipeScreen />);
    
    const backButton = screen.getByRole('button', { name: /Back/i });
    fireEvent.click(backButton);
    
    expect(mockSetScreen).toHaveBeenCalledWith('welcome');
  });
  
  it('should handle receive mode when userMeta mode is receive', () => {
    const receiveModeState = {
      ...defaultStoreState,
      userMeta: {
        mode: 'receive' as const,
        experience: 'newbie' as const,
        agreedToTerms: true
      }
    };
    
    (useAppStore as any).mockReturnValue(receiveModeState);
    
    render(<SwipeScreen />);
    
    const buttons = screen.getAllByText(/YES/);
    const yesButton = buttons.find(btn => btn.tagName === 'BUTTON');
    fireEvent.click(yesButton!);
    
    expect(mockSetRating).toHaveBeenCalledWith('receive', expect.any(String), expect.any(String));
  });
});
