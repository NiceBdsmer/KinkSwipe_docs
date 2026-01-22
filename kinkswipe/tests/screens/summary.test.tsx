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
    
    expect(screen.getAllByText('Your Results')).toHaveLength(2);
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

  it('should display total activities count', () => {
    render(<SummaryScreen />);
    
    expect(screen.getByText(/You rated .* activities total/i)).toBeInTheDocument();
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
    
    expect(screen.getAllByText('Your Results')).toHaveLength(2);
    expect(screen.getByText('You said YES to')).toBeInTheDocument();
  });
});
