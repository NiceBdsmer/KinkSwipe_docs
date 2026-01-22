import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { SwipeScreen } from './SwipeScreen';
import { useAppStore } from '../store/useAppStore';
import { categories } from '../data/categories';

const mockSetScreen = vi.fn();
const mockSetRating = vi.fn();
const mockSetCurrentCategory = vi.fn();
const mockSetCurrentActivityIndex = vi.fn();
const mockSetTutorialSeen = vi.fn();

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
  lang: 'en' as const,
  tutorialSeen: true,
  setScreen: mockSetScreen,
  setRating: mockSetRating,
  setCurrentCategory: mockSetCurrentCategory,
  setCurrentActivityIndex: mockSetCurrentActivityIndex,
  setTutorialSeen: mockSetTutorialSeen
};

vi.mock('../store/useAppStore', () => ({
  useAppStore: vi.fn()
}));

vi.mock('../utils/getActivities', () => ({
  getActivities: vi.fn(() => {
    const activities: any[] = [];
    categories.forEach((cat, catIndex) => {
      for (let i = 0; i < 20; i++) {
        activities.push({
          id: `test-activity-${catIndex}-${i}`,
          categoryId: cat.id,
          texts: {
            en: { text: `Test Activity ${catIndex}-${i}`, desc: 'A test activity' }
          }
        });
      }
    });
    return activities;
  }),
  getActivityText: vi.fn((activity: any) => activity.texts?.en?.text || activity.text || 'Test Activity')
}));

vi.mock('react-tinder-card', () => ({
  default: ({ children, onSwipe }: { children: React.ReactNode; onSwipe: (direction: string) => void }) => {
    return (
      <div
        data-testid="tinder-card"
        onClick={() => onSwipe('right')}
      >
        {children}
      </div>
    );
  }
}));

describe('SwipeScreen', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useAppStore as any).mockReturnValue(defaultStoreState);
  });
  
  it('should render Header, SwipeCard, and ActionButtons', () => {
    render(<SwipeScreen />);

    expect(screen.getByRole('button', { name: /Back/i })).toBeInTheDocument();
    const actionButtons = screen.getAllByRole('button', { name: /YES|MAYBE|SKIP|NOPE/ });
    expect(actionButtons.length).toBeGreaterThanOrEqual(4);
  });

  it('should display category progress', () => {
    render(<SwipeScreen />);

    const progressElements = screen.getAllByText(/0 \/ \d+/);
    expect(progressElements.length).toBeGreaterThan(0);
    expect(screen.getByText(/total/)).toBeInTheDocument();
  });

  it('should call setRating with yes on right swipe', async () => {
    render(<SwipeScreen />);

    const yesButtons = screen.getAllByRole('button', { name: /YES/i });
    const yesButton = yesButtons.find(btn => btn.querySelector('svg.lucide-heart'));
    if (yesButton) {
      await userEvent.click(yesButton);
    }

    await waitFor(() => {
      expect(mockSetRating).toHaveBeenCalledWith('give', expect.any(String), 'yes');
    });
  });

  it('should call setRating with maybe on up swipe (maybe button)', async () => {
    render(<SwipeScreen />);

    const maybeButtons = screen.getAllByRole('button', { name: /MAYBE/i });
    const maybeButton = maybeButtons.find(btn => btn.querySelector('svg.lucide-zap'));
    if (maybeButton) {
      await userEvent.click(maybeButton);
    }

    await waitFor(() => {
      expect(mockSetRating).toHaveBeenCalledWith('give', expect.any(String), 'maybe');
    });
  });
  
  it('should call setRating with skip on down swipe (skip button)', async () => {
    render(<SwipeScreen />);

    const skipButtons = screen.getAllByRole('button', { name: /SKIP/i });
    const skipButton = skipButtons.find(btn => btn.querySelector('svg.lucide-circle'));
    if (skipButton) {
      await userEvent.click(skipButton);
    }

    await waitFor(() => {
      expect(mockSetRating).toHaveBeenCalledWith('give', expect.any(String), 'skip');
    });
  });

  it('should call setRating with no on left swipe (nope button)', async () => {
    render(<SwipeScreen />);

    const nopeButtons = screen.getAllByRole('button', { name: /NO/i });
    const nopeButton = nopeButtons.find(btn => btn.querySelector('svg.lucide-x'));
    if (nopeButton) {
      await userEvent.click(nopeButton);
    }

    await waitFor(() => {
      expect(mockSetRating).toHaveBeenCalledWith('give', expect.any(String), 'no');
    });
  });

  it('should increment activity index after swipe', async () => {
    render(<SwipeScreen />);

    const yesButtons = screen.getAllByRole('button', { name: /YES/i });
    const yesButton = yesButtons.find(btn => btn.querySelector('svg.lucide-heart'));
    if (yesButton) {
      await userEvent.click(yesButton);
    }

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

    const yesButtons = screen.getAllByRole('button', { name: /YES/i });
    const yesButton = yesButtons.find(btn => btn.querySelector('svg.lucide-heart'));
    if (yesButton) {
      await userEvent.click(yesButton);
    }

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

    const yesButtons = screen.getAllByRole('button', { name: /YES/i });
    const yesButton = yesButtons.find(btn => btn.querySelector('svg.lucide-heart'));
    if (yesButton) {
      await userEvent.click(yesButton);
    }

    await waitFor(() => {
      expect(screen.getByText(/Round Complete/i)).toBeInTheDocument();
    });

    const viewSummaryButton = screen.getByText(/View Summary/i);
    await userEvent.click(viewSummaryButton);

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

    const yesButtons = screen.getAllByRole('button', { name: /YES/i });
    const yesButton = yesButtons.find(btn => btn.querySelector('svg.lucide-heart'));
    if (yesButton) {
      await userEvent.click(yesButton);
    }

    await waitFor(() => {
      expect(screen.getByText(/Round Complete/i)).toBeInTheDocument();
    });

    const continueButtons = screen.getAllByRole('button', { name: /Continue/i });
    const continueButton = continueButtons[0];
    await userEvent.click(continueButton);

    await waitFor(() => {
      expect(mockSetCurrentCategory).toHaveBeenCalledWith(categories[0].id);
      expect(mockSetCurrentActivityIndex).toHaveBeenCalledWith(0);
    });
  });
  
  it('should skip category when Skip Category button is clicked', async () => {
    render(<SwipeScreen />);
    
    const skipButton = screen.getByText(/Skip Category/i);
    await userEvent.click(skipButton);
    
    await waitFor(() => {
      expect(mockSetCurrentCategory).toHaveBeenCalledWith(categories[1].id);
      expect(mockSetCurrentActivityIndex).toHaveBeenCalledWith(0);
    });
  });
  
  it('should navigate to welcome when back button is clicked', async () => {
    render(<SwipeScreen />);
    
    const backButton = screen.getByRole('button', { name: /Back/i });
    await userEvent.click(backButton);
    
    expect(mockSetScreen).toHaveBeenCalledWith('welcome');
  });
  
  it('should handle receive mode when userMeta mode is receive', async () => {
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

    const yesButtons = screen.getAllByRole('button', { name: /YES/i });
    const yesButton = yesButtons.find(btn => btn.querySelector('svg.lucide-heart'));
    if (yesButton) {
      await userEvent.click(yesButton);
    }

    await waitFor(() => {
      expect(mockSetRating).toHaveBeenCalledWith('receive', expect.any(String), 'yes');
    });
  });
});
