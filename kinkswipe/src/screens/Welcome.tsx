import { Button } from '../components/ui/button';
import { FooterControls } from '../components/FooterControls';
import { useAppStore } from '../store/useAppStore';
import { useTranslation } from '../i18n/useTranslation';

export function Welcome() {
  const t = useTranslation();
  const setScreen = useAppStore((state) => state.setScreen);

  return (
    <div className="min-h-screen bg-background flex flex-col safe-area-inset">
      <div className="flex-1 flex flex-col items-center justify-center p-3 sm:p-4 w-full">
        <div className="w-full max-w-lg sm:max-w-md text-center space-y-6 sm:space-y-8">
          {/* Logo and Title */}
          <div className="space-y-3 sm:space-y-4">
            <h1 className="text-3xl sm:text-4xl font-bold text-primary">KinkSwipe</h1>
            <p className="text-base sm:text-lg text-muted-foreground">
              {t.welcome.tagline}
            </p>
          </div>

          {/* Main Actions */}
          <div className="space-y-3 sm:space-y-4">
            <Button
              onClick={() => setScreen('onboarding')}
              size="lg"
              className="w-full text-base sm:text-lg py-4 sm:py-6 h-12 sm:h-14"
            >
              {t.welcome.startSwiping}
            </Button>
            <Button
              onClick={() => setScreen('category-selection')}
              variant="secondary"
              size="lg"
              className="w-full text-base sm:text-lg py-4 sm:py-6 h-12 sm:h-14"
            >
              {t.welcome.selectCategories || 'Select Categories'}
            </Button>
            <Button
              onClick={() => setScreen('load')}
              variant="outline"
              size="lg"
              className="w-full text-base sm:text-lg py-4 sm:py-6 h-12 sm:h-14"
            >
              {t.welcome.loadLink}
            </Button>
          </div>

          {/* Footer with Controls */}
          <div className="mt-8">
            <FooterControls />
          </div>
        </div>
      </div>
    </div>
  );
}