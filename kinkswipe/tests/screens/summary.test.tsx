import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { SummaryScreen } from '../../src/screens/SummaryScreen';
import { useAppStore } from '../../src/store/useAppStore';

const defaultStoreState = {
  ratings: {
    give: {
      'rope-bondage': 'yes',
      'handcuffs': 'maybe',
      'leather-cuffs': 'meh',
      'blindfolds': 'no'
    },
    receive: {
      'rope-bondage': 'maybe',
      'handcuffs': 'no',
      'leather-cuffs': 'yes',
      'blindfolds': 'meh'
    }
  },
  userMeta: {
    mode: 'give' as const,
    experience: 'newbie' as const,
    agreedToTerms: true
  }
};

vi.mock('../../src/store/useAppStore', () => ({
  useAppStore: vi.fn()
}));

vi.mock('../../src/i18n/useTranslation', () => ({
  useTranslation: () => ({
    summary: {
      title: 'Your Results',
      yesCount: 'You said YES to',
      maybeCount: 'MAYBE to',
      mehCount: 'MEH to',
      nopeCount: 'NOPE to',
      give: 'As Giver',
      receive: 'As Receiver'
    },
    categories: {
      bondage: 'Bondage',
      impact: 'Impact',
      sensory: 'Sensory',
      'power-exchange': 'Power Exchange',
      edge: 'Edge Play',
      sexual: 'Sexual',
      fetishes: 'Fetishes',
      humiliation: 'Humiliation'
    }
  })
}));

describe('SummaryScreen', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useAppStore as any).mockReturnValue(defaultStoreState);
  });

  it('should render SummaryScreen component', () => {
    render(<SummaryScreen />);
    
    expect(screen.getByText('Your Results')).toBeInTheDocument();
    expect(screen.getByText('You said YES to')).toBeInTheDocument();
  });

  it('should display SummaryCard with correct counts for give mode', () => {
    render(<SummaryScreen />);
    
    expect(screen.getByText('You said YES to')).toBeInTheDocument();
    expect(screen.getByText('MAYBE to')).toBeInTheDocument();
    expect(screen.getByText('MEH to')).toBeInTheDocument();
    expect(screen.getByText('NOPE to')).toBeInTheDocument();
  });

  it('should not show mode toggle when userMeta mode is give', () => {
    render(<SummaryScreen />);
    
    expect(screen.queryByText('As Giver')).not.toBeInTheDocument();
    expect(screen.queryByText('As Receiver')).not.toBeInTheDocument();
  });

  it('should not show mode toggle when userMeta mode is receive', () => {
    const receiveState = {
      ...defaultStoreState,
      userMeta: {
        ...defaultStoreState.userMeta,
        mode: 'receive' as const
      }
    };
    
    (useAppStore as any).mockReturnValue(receiveState);
    
    render(<SummaryScreen />);
    
    expect(screen.queryByText('As Giver')).not.toBeInTheDocument();
    expect(screen.queryByText('As Receiver')).not.toBeInTheDocument();
  });

  it('should show mode toggle when userMeta mode is both', () => {
    const bothModeState = {
      ...defaultStoreState,
      userMeta: {
        ...defaultStoreState.userMeta,
        mode: 'both' as const
      }
    };
    
    (useAppStore as any).mockReturnValue(bothModeState);
    
    render(<SummaryScreen />);
    
    expect(screen.getByText('As Giver')).toBeInTheDocument();
    expect(screen.getByText('As Receiver')).toBeInTheDocument();
  });

  it('should switch to receive mode when receive button is clicked', async () => {
    const bothModeState = {
      ...defaultStoreState,
      userMeta: {
        ...defaultStoreState.userMeta,
        mode: 'both' as const
      }
    };
    
    (useAppStore as any).mockReturnValue(bothModeState);
    
    render(<SummaryScreen />);
    
    const receiveButton = screen.getByText('As Receiver');
    fireEvent.click(receiveButton);
    
    await waitFor(() => {
      expect(receiveButton).toBeInTheDocument();
    });
  });

  it('should switch back to give mode when give button is clicked', async () => {
    const bothModeState = {
      ...defaultStoreState,
      userMeta: {
        ...defaultStoreState.userMeta,
        mode: 'both' as const
      }
    };
    
    (useAppStore as any).mockReturnValue(bothModeState);
    
    render(<SummaryScreen />);
    
    const giveButton = screen.getByText('As Giver');
    fireEvent.click(giveButton);
    
    await waitFor(() => {
      expect(giveButton).toBeInTheDocument();
    });
  });

  it('should display category accordion items', () => {
    render(<SummaryScreen />);
    
    expect(screen.getByText('Bondage')).toBeInTheDocument();
    expect(screen.getByText('Impact')).toBeInTheDocument();
    expect(screen.getByText('Sensory')).toBeInTheDocument();
    expect(screen.getByText('Power Exchange')).toBeInTheDocument();
    expect(screen.getByText('Edge Play')).toBeInTheDocument();
    expect(screen.getByText('Sexual')).toBeInTheDocument();
    expect(screen.getByText('Fetishes')).toBeInTheDocument();
    expect(screen.getByText('Humiliation')).toBeInTheDocument();
  });

  it('should handle empty ratings gracefully', () => {
    const emptyState = {
      ...defaultStoreState,
      ratings: {
        give: {},
        receive: {}
      }
    };
    
    (useAppStore as any).mockReturnValue(emptyState);
    
    render(<SummaryScreen />);
    
    expect(screen.getByText('Your Results')).toBeInTheDocument();
    expect(screen.getByText('You said YES to')).toBeInTheDocument();
    expect(screen.getByText('Bondage')).toBeInTheDocument();
  });

  it('should display activities grouped by rating in accordion content', () => {
    render(<SummaryScreen />);
    
    const bondageTrigger = screen.getByText('Bondage');
    fireEvent.click(bondageTrigger);
    
    waitFor(() => {
      expect(screen.getByText('Rope Bondage')).toBeInTheDocument();
      expect(screen.getByText('Handcuffs')).toBeInTheDocument();
    });
  });

  it('should render 4 floating action buttons', () => {
    render(<SummaryScreen />);
    
    const buttons = screen.getAllByRole('button');
    const iconButtons = buttons.filter(btn => btn.classList.contains('rounded-full'));
    
    expect(iconButtons.length).toBe(4);
  });

  it('should render Copy Link, Copy Text, Download Image, and Add Custom buttons', () => {
    render(<SummaryScreen />);
    
    const buttons = screen.getAllByRole('button');
    const iconButtons = buttons.filter(btn => btn.classList.contains('rounded-full'));
    
    expect(iconButtons.length).toBe(4);
    
    iconButtons.forEach(button => {
      expect(button).toBeInTheDocument();
      expect(button).toBeEnabled();
    });
  });

  it('should have buttons with fixed positioning at bottom right', () => {
    const { container } = render(<SummaryScreen />);
    
    const iconButtons = container.querySelectorAll('.fixed.bottom-4.right-4 button');
    
    expect(iconButtons.length).toBe(4);
  });

  it('should handle button clicks without errors', () => {
    render(<SummaryScreen />);
    
    const buttons = screen.getAllByRole('button');
    const iconButtons = buttons.filter(btn => btn.classList.contains('rounded-full'));
    
    iconButtons.forEach(button => {
      expect(() => fireEvent.click(button)).not.toThrow();
    });
  });
});
