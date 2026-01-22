import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Onboarding } from '../../src/screens/Onboarding';
import { useAppStore } from '../../src/store/useAppStore';

describe('Onboarding E2E Flow', () => {
  beforeEach(() => {
    // Reset the store before each test
    useAppStore.getState().resetState();
    vi.clearAllMocks();
  });

  describe('Complete Onboarding Flow - Giver Role', () => {
    it('should complete the full onboarding flow as Giver', async () => {
      render(<Onboarding />);

      // Step 1: Role Selection
      expect(screen.getByText(/How do you want to explore\?/i)).toBeInTheDocument();

      // Select "As Giver" role
      const giverCard = screen.getByText(/As Giver/i).closest('.cursor-pointer');
      fireEvent.click(giverCard!);

      // Click continue button
      const continueButton = screen.getByRole('button', { name: /Continue/i });
      fireEvent.click(continueButton);

      // Step 2: Experience Selection
      await waitFor(() => {
        expect(screen.getByText(/What is your experience level\?/i)).toBeInTheDocument();
      });

      // Select "Newbie" experience
      const newbieCard = screen.getByText(/Newbie/i).closest('.cursor-pointer');
      fireEvent.click(newbieCard!);

      // Click continue button
      fireEvent.click(screen.getByRole('button', { name: /Continue/i }));

      // Step 3: Safety Agreement
      await waitFor(() => {
        expect(screen.getByText(/Safety First/i)).toBeInTheDocument();
      });

      // Safety text should be displayed
      expect(screen.getByText(/Kink activities can carry physical and emotional risks/i)).toBeInTheDocument();

      // Agree to safety
      const safetyCheckbox = screen.getByRole('checkbox');
      fireEvent.click(safetyCheckbox);

      // Click continue button
      fireEvent.click(screen.getByRole('button', { name: /Continue/i }));

      // Verify store state is updated
      const storeState = useAppStore.getState();
      expect(storeState.userMeta.mode).toBe('give');
      expect(storeState.userMeta.experience).toBe('newbie');
      expect(storeState.userMeta.agreedToTerms).toBe(true);
      expect(storeState.currentScreen).toBe('swipe');
    });

    it('should complete onboarding with Experienced level', async () => {
      render(<Onboarding />);

      // Select "As Giver" role
      fireEvent.click(screen.getByText(/As Giver/i).closest('.cursor-pointer')!);
      fireEvent.click(screen.getByRole('button', { name: /Continue/i }));

      // Select "Experienced" experience
      await waitFor(() => {
        expect(screen.getByText(/Experienced/i)).toBeInTheDocument();
      });
      fireEvent.click(screen.getByText(/Experienced/i).closest('.cursor-pointer')!);
      fireEvent.click(screen.getByRole('button', { name: /Continue/i }));

      // Agree to safety
      await waitFor(() => {
        expect(screen.getByRole('checkbox')).toBeInTheDocument();
      });
      fireEvent.click(screen.getByRole('checkbox'));
      fireEvent.click(screen.getByRole('button', { name: /Continue/i }));

      // Verify store state
      const storeState = useAppStore.getState();
      expect(storeState.userMeta.mode).toBe('give');
      expect(storeState.userMeta.experience).toBe('experienced');
      expect(storeState.currentScreen).toBe('swipe');
    });
  });

  describe('Complete Onboarding Flow - Receiver Role', () => {
    it('should complete the full onboarding flow as Receiver', async () => {
      render(<Onboarding />);

      // Step 1: Select "As Receiver" role
      const receiverCard = screen.getByText(/As Receiver/i).closest('.cursor-pointer');
      fireEvent.click(receiverCard!);
      fireEvent.click(screen.getByRole('button', { name: /Continue/i }));

      // Step 2: Select "Curious" experience
      await waitFor(() => {
        expect(screen.getByText(/What is your experience level\?/i)).toBeInTheDocument();
      });
      const curiousCard = screen.getByText(/Curious/i).closest('.cursor-pointer');
      fireEvent.click(curiousCard!);
      fireEvent.click(screen.getByRole('button', { name: /Continue/i }));

      // Step 3: Agree to safety
      await waitFor(() => {
        expect(screen.getByText(/Safety First/i)).toBeInTheDocument();
      });
      fireEvent.click(screen.getByRole('checkbox'));
      fireEvent.click(screen.getByRole('button', { name: /Continue/i }));

      // Verify store state
      const storeState = useAppStore.getState();
      expect(storeState.userMeta.mode).toBe('receive');
      expect(storeState.userMeta.experience).toBe('curious');
      expect(storeState.currentScreen).toBe('swipe');
    });
  });

  describe('Complete Onboarding Flow - Both Role', () => {
    it('should complete the full onboarding flow as Both', async () => {
      render(<Onboarding />);

      // Step 1: Select "Both" role
      const bothCard = screen.getByText(/Both/i).closest('.cursor-pointer');
      fireEvent.click(bothCard!);
      fireEvent.click(screen.getByRole('button', { name: /Continue/i }));

      // Step 2: Select "Curious" experience
      await waitFor(() => {
        expect(screen.getByText(/What is your experience level\?/i)).toBeInTheDocument();
      });
      const curiousCard = screen.getByText(/Curious/i).closest('.cursor-pointer');
      fireEvent.click(curiousCard!);
      fireEvent.click(screen.getByRole('button', { name: /Continue/i }));

      // Step 3: Agree to safety
      await waitFor(() => {
        expect(screen.getByText(/Safety First/i)).toBeInTheDocument();
      });
      fireEvent.click(screen.getByRole('checkbox'));
      fireEvent.click(screen.getByRole('button', { name: /Continue/i }));

      // Verify store state
      const storeState = useAppStore.getState();
      expect(storeState.userMeta.mode).toBe('both');
      expect(storeState.userMeta.experience).toBe('curious');
      expect(storeState.currentScreen).toBe('swipe');
    });
  });

  describe('Navigation and Validation', () => {
    it('should not allow proceeding to next step without selecting a role', async () => {
      render(<Onboarding />);

      const continueButton = screen.getByRole('button', { name: /Continue/i });

      // Button should be disabled initially
      expect(continueButton).toBeDisabled();

      // Clicking should not navigate
      fireEvent.click(continueButton);
      expect(screen.getByText(/How do you want to explore\?/i)).toBeInTheDocument();
    });

    it('should not allow proceeding to safety step without selecting experience', async () => {
      render(<Onboarding />);

      // Select role and proceed
      fireEvent.click(screen.getByText(/As Giver/i).closest('.cursor-pointer')!);
      fireEvent.click(screen.getByRole('button', { name: /Continue/i }));

      await waitFor(() => {
        expect(screen.getByText(/What is your experience level\?/i)).toBeInTheDocument();
      });

      // Button should be disabled
      const continueButton = screen.getByRole('button', { name: /Continue/i });
      expect(continueButton).toBeDisabled();

      // Clicking should not navigate
      fireEvent.click(continueButton);
      expect(screen.getByText(/What is your experience level\?/i)).toBeInTheDocument();
    });

    it('should not allow completing onboarding without safety agreement', async () => {
      render(<Onboarding />);

      // Select role
      fireEvent.click(screen.getByText(/As Giver/i).closest('.cursor-pointer')!);
      fireEvent.click(screen.getByRole('button', { name: /Continue/i }));

      // Select experience
      await waitFor(() => {
        expect(screen.getByText(/Newbie/i)).toBeInTheDocument();
      });
      fireEvent.click(screen.getByText(/Newbie/i).closest('.cursor-pointer')!);
      fireEvent.click(screen.getByRole('button', { name: /Continue/i }));

      // Safety step - button should be disabled
      await waitFor(() => {
        expect(screen.getByText(/Safety First/i)).toBeInTheDocument();
      });
      const continueButton = screen.getByRole('button', { name: /Continue/i });
      expect(continueButton).toBeDisabled();

      // Clicking should not complete
      fireEvent.click(continueButton);
      expect(screen.getByText(/Safety First/i)).toBeInTheDocument();

      // Should not navigate to swipe screen
      expect(useAppStore.getState().currentScreen).toBe('welcome');
    });

    it('should navigate back from role step to welcome screen', () => {
      render(<Onboarding />);

      const backButton = screen.getByRole('button', { name: /Back/i });
      fireEvent.click(backButton);

      expect(useAppStore.getState().currentScreen).toBe('welcome');
    });

    it('should navigate back between steps', async () => {
      render(<Onboarding />);

      // Select role and proceed
      fireEvent.click(screen.getByText(/As Giver/i).closest('.cursor-pointer')!);
      fireEvent.click(screen.getByRole('button', { name: /Continue/i }));

      // Should be on experience step
      await waitFor(() => {
        expect(screen.getByText(/What is your experience level\?/i)).toBeInTheDocument();
      });

      // Click back button
      fireEvent.click(screen.getByRole('button', { name: /Back/i }));

      // Should return to role step
      expect(screen.getByText(/How do you want to explore\?/i)).toBeInTheDocument();
      expect(screen.getByText(/As Giver/i)).toBeInTheDocument();
    });

    it('should navigate back from experience to role', async () => {
      render(<Onboarding />);

      // Select role and proceed
      fireEvent.click(screen.getByText(/As Giver/i).closest('.cursor-pointer')!);
      fireEvent.click(screen.getByRole('button', { name: /Continue/i }));

      // Should be on experience step
      await waitFor(() => {
        expect(screen.getByText(/What is your experience level\?/i)).toBeInTheDocument();
      });

      // Select experience and proceed
      fireEvent.click(screen.getByText(/Newbie/i).closest('.cursor-pointer')!);
      fireEvent.click(screen.getByRole('button', { name: /Continue/i }));

      // Should be on safety step
      await waitFor(() => {
        expect(screen.getByText(/Safety First/i)).toBeInTheDocument();
      });

      // Click back button
      fireEvent.click(screen.getByRole('button', { name: /Back/i }));

      // Should return to experience step
      expect(screen.getByText(/What is your experience level\?/i)).toBeInTheDocument();
      expect(screen.getByText(/Newbie/i)).toBeInTheDocument();
    });
  });

  describe('Progress Indicators', () => {
    it('should show progress dots with correct active state', () => {
      render(<Onboarding />);

      // Should show 3 dots
      const dots = document.querySelectorAll('.w-2\\.5.h-2\\.5');
      expect(dots.length).toBe(3);

      // First dot should be active (bg-primary)
      expect(dots[0]).toHaveClass('bg-primary');
      // Second and third should be muted
      expect(dots[1]).toHaveClass('bg-muted');
      expect(dots[2]).toHaveClass('bg-muted');
    });

    it('should update progress dots when navigating steps', async () => {
      render(<Onboarding />);

      // Proceed to experience step
      fireEvent.click(screen.getByText(/As Giver/i).closest('.cursor-pointer')!);
      fireEvent.click(screen.getByRole('button', { name: /Continue/i }));

      await waitFor(() => {
        const dots = document.querySelectorAll('.w-2\\.5.h-2\\.5');
        // First dot should be completed
        expect(dots[0].className).toContain('bg-primary/50');
        // Second dot should be active
        expect(dots[1]).toHaveClass('bg-primary');
        // Third dot should be muted
        expect(dots[2]).toHaveClass('bg-muted');
      });

      // Proceed to safety step
      fireEvent.click(screen.getByText(/Newbie/i).closest('.cursor-pointer')!);
      fireEvent.click(screen.getByRole('button', { name: /Continue/i }));

      await waitFor(() => {
        const dots = document.querySelectorAll('.w-2\\.5.h-2\\.5');
        // First and second should be completed
        expect(dots[0].className).toContain('bg-primary/50');
        expect(dots[1].className).toContain('bg-primary/50');
        // Third dot should be active
        expect(dots[2]).toHaveClass('bg-primary');
      });
    });

    it('should update progress dots when navigating back', async () => {
      render(<Onboarding />);

      // Proceed to experience step
      fireEvent.click(screen.getByText(/As Giver/i).closest('.cursor-pointer')!);
      fireEvent.click(screen.getByRole('button', { name: /Continue/i }));

      await waitFor(() => {
        expect(screen.getByText(/What is your experience level\?/i)).toBeInTheDocument();
      });

      // Click back button
      fireEvent.click(screen.getByRole('button', { name: /Back/i }));

      // First dot should be active again
      const dots = document.querySelectorAll('.w-2\\.5.h-2\\.5');
      expect(dots[0]).toHaveClass('bg-primary');
      expect(dots[1]).toHaveClass('bg-muted');
    });
  });

  describe('Role Card Selection', () => {
    it('should show visual feedback when role card is selected', () => {
      render(<Onboarding />);

      const giverCard = screen.getByText(/As Giver/i).closest('.cursor-pointer');
      const receiverCard = screen.getByText(/As Receiver/i).closest('.cursor-pointer');
      const bothCard = screen.getByText(/Both/i).closest('.cursor-pointer');

      // Initially none should have ring
      expect(giverCard).not.toHaveClass('ring-2');
      expect(receiverCard).not.toHaveClass('ring-2');
      expect(bothCard).not.toHaveClass('ring-2');

      // Select Giver
      fireEvent.click(giverCard!);

      // Giver should have ring, others should not
      expect(giverCard).toHaveClass('ring-2');
      expect(receiverCard).not.toHaveClass('ring-2');
      expect(bothCard).not.toHaveClass('ring-2');

      // Select Receiver
      fireEvent.click(receiverCard!);

      // Receiver should have ring, others should not
      expect(giverCard).not.toHaveClass('ring-2');
      expect(receiverCard).toHaveClass('ring-2');
      expect(bothCard).not.toHaveClass('ring-2');

      // Select Both
      fireEvent.click(bothCard!);

      // Both should have ring, others should not
      expect(giverCard).not.toHaveClass('ring-2');
      expect(receiverCard).not.toHaveClass('ring-2');
      expect(bothCard).toHaveClass('ring-2');
    });
  });

  describe('Experience Card Selection', () => {
    it('should show visual feedback when experience card is selected', async () => {
      render(<Onboarding />);

      // Proceed to experience step
      fireEvent.click(screen.getByText(/As Giver/i).closest('.cursor-pointer')!);
      fireEvent.click(screen.getByRole('button', { name: /Continue/i }));

      await waitFor(() => {
        expect(screen.getByText(/What is your experience level\?/i)).toBeInTheDocument();
      });

      const newbieCard = screen.getByText(/Newbie/i).closest('.cursor-pointer');
      const curiousCard = screen.getByText(/Curious/i).closest('.cursor-pointer');
      const experiencedCard = screen.getByText(/Experienced/i).closest('.cursor-pointer');

      // Initially none should have ring
      expect(newbieCard).not.toHaveClass('ring-2');
      expect(curiousCard).not.toHaveClass('ring-2');
      expect(experiencedCard).not.toHaveClass('ring-2');

      // Select Newbie
      fireEvent.click(newbieCard!);
      expect(newbieCard).toHaveClass('ring-2');

      // Select Curious
      fireEvent.click(curiousCard!);
      expect(newbieCard).not.toHaveClass('ring-2');
      expect(curiousCard).toHaveClass('ring-2');

      // Select Experienced
      fireEvent.click(experiencedCard!);
      expect(newbieCard).not.toHaveClass('ring-2');
      expect(curiousCard).not.toHaveClass('ring-2');
      expect(experiencedCard).toHaveClass('ring-2');
    });
  });

  describe('Safety Checkbox', () => {
    it('should toggle safety agreement checkbox', async () => {
      render(<Onboarding />);

      // Proceed to safety step
      fireEvent.click(screen.getByText(/As Giver/i).closest('.cursor-pointer')!);
      fireEvent.click(screen.getByRole('button', { name: /Continue/i }));
      fireEvent.click(screen.getByText(/Newbie/i).closest('.cursor-pointer')!);
      fireEvent.click(screen.getByRole('button', { name: /Continue/i }));

      await waitFor(() => {
        expect(screen.getByText(/Safety First/i)).toBeInTheDocument();
      });

      const checkbox = screen.getByRole('checkbox');

      // Initially unchecked
      expect(checkbox).not.toBeChecked();

      // Click to check
      fireEvent.click(checkbox);
      expect(checkbox).toBeChecked();

      // Click to uncheck
      fireEvent.click(checkbox);
      expect(checkbox).not.toBeChecked();

      // Click to check again
      fireEvent.click(checkbox);
      expect(checkbox).toBeChecked();
    });
  });

  describe('Full End-to-End Flows', () => {
    it('should handle Giver + Newbie flow correctly', async () => {
      render(<Onboarding />);

      // Role: Giver
      fireEvent.click(screen.getByText(/As Giver/i).closest('.cursor-pointer')!);
      fireEvent.click(screen.getByRole('button', { name: /Continue/i }));

      // Experience: Newbie
      await waitFor(() => {
        expect(screen.getByText(/Newbie/i)).toBeInTheDocument();
      });
      fireEvent.click(screen.getByText(/Newbie/i).closest('.cursor-pointer')!);
      fireEvent.click(screen.getByRole('button', { name: /Continue/i }));

      // Safety: Agree
      await waitFor(() => {
        expect(screen.getByText(/Safety First/i)).toBeInTheDocument();
      });
      fireEvent.click(screen.getByRole('checkbox'));
      fireEvent.click(screen.getByRole('button', { name: /Continue/i }));

      // Verify final state
      const state = useAppStore.getState();
      expect(state.userMeta).toEqual({
        mode: 'give',
        experience: 'newbie',
        agreedToTerms: true
      });
      expect(state.currentScreen).toBe('swipe');
    });

    it('should handle Receiver + Curious flow correctly', async () => {
      render(<Onboarding />);

      // Role: Receiver
      fireEvent.click(screen.getByText(/As Receiver/i).closest('.cursor-pointer')!);
      fireEvent.click(screen.getByRole('button', { name: /Continue/i }));

      // Experience: Curious
      await waitFor(() => {
        expect(screen.getByText(/Curious/i)).toBeInTheDocument();
      });
      fireEvent.click(screen.getByText(/Curious/i).closest('.cursor-pointer')!);
      fireEvent.click(screen.getByRole('button', { name: /Continue/i }));

      // Safety: Agree
      await waitFor(() => {
        expect(screen.getByText(/Safety First/i)).toBeInTheDocument();
      });
      fireEvent.click(screen.getByRole('checkbox'));
      fireEvent.click(screen.getByRole('button', { name: /Continue/i }));

      // Verify final state
      const state = useAppStore.getState();
      expect(state.userMeta).toEqual({
        mode: 'receive',
        experience: 'curious',
        agreedToTerms: true
      });
      expect(state.currentScreen).toBe('swipe');
    });

    it('should handle Both + Experienced flow correctly', async () => {
      render(<Onboarding />);

      // Role: Both
      fireEvent.click(screen.getByText(/Both/i).closest('.cursor-pointer')!);
      fireEvent.click(screen.getByRole('button', { name: /Continue/i }));

      // Experience: Experienced
      await waitFor(() => {
        expect(screen.getByText(/Experienced/i)).toBeInTheDocument();
      });
      fireEvent.click(screen.getByText(/Experienced/i).closest('.cursor-pointer')!);
      fireEvent.click(screen.getByRole('button', { name: /Continue/i }));

      // Safety: Agree
      await waitFor(() => {
        expect(screen.getByText(/Safety First/i)).toBeInTheDocument();
      });
      fireEvent.click(screen.getByRole('checkbox'));
      fireEvent.click(screen.getByRole('button', { name: /Continue/i }));

      // Verify final state
      const state = useAppStore.getState();
      expect(state.userMeta).toEqual({
        mode: 'both',
        experience: 'experienced',
        agreedToTerms: true
      });
      expect(state.currentScreen).toBe('swipe');
    });

    it('should handle back and forth navigation before completion', async () => {
      render(<Onboarding />);

      // Step 1: Select Giver, go to experience, go back, select Both
      fireEvent.click(screen.getByText(/As Giver/i).closest('.cursor-pointer')!);
      fireEvent.click(screen.getByRole('button', { name: /Continue/i }));

      await waitFor(() => {
        expect(screen.getByText(/What is your experience level\?/i)).toBeInTheDocument();
      });

      fireEvent.click(screen.getByRole('button', { name: /Back/i }));
      expect(screen.getByText(/How do you want to explore\?/i)).toBeInTheDocument();

      // Change selection to Both
      fireEvent.click(screen.getByText(/Both/i).closest('.cursor-pointer')!);
      fireEvent.click(screen.getByRole('button', { name: /Continue/i }));

      // Step 2: Experience - select Newbie, go to safety, go back, select Curious
      await waitFor(() => {
        expect(screen.getByText(/What is your experience level\?/i)).toBeInTheDocument();
      });
      fireEvent.click(screen.getByText(/Newbie/i).closest('.cursor-pointer')!);
      fireEvent.click(screen.getByRole('button', { name: /Continue/i }));

      await waitFor(() => {
        expect(screen.getByText(/Safety First/i)).toBeInTheDocument();
      });

      fireEvent.click(screen.getByRole('button', { name: /Back/i }));
      fireEvent.click(screen.getByText(/Curious/i).closest('.cursor-pointer')!);
      fireEvent.click(screen.getByRole('button', { name: /Continue/i }));

      // Step 3: Safety and complete
      await waitFor(() => {
        expect(screen.getByText(/Safety First/i)).toBeInTheDocument();
      });
      fireEvent.click(screen.getByRole('checkbox'));
      fireEvent.click(screen.getByRole('button', { name: /Continue/i }));

      // Verify final state
      const state = useAppStore.getState();
      expect(state.userMeta).toEqual({
        mode: 'both',
        experience: 'curious',
        agreedToTerms: true
      });
      expect(state.currentScreen).toBe('swipe');
    });
  });
});
