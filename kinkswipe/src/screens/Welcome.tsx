import { Button } from '../components/ui/button';
import { FooterControls } from '../components/FooterControls';
import { useAppStore } from '../store/useAppStore';
import { useTranslation } from '../i18n/useTranslation';

export function Welcome() {
  const t = useTranslation();
  const setScreen = useAppStore((state) => state.setScreen);

  return (
    <div className="min-h-screen flex flex-col safe-area-inset app-shell">
      <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 w-full">
        <div className="w-full max-w-lg text-center space-y-6 sm:space-y-8">
          <div className="space-y-3 sm:space-y-4 animate-fade-up">
            <p className="soft-pill uppercase tracking-[0.2em]">{t.welcome.tagline}</p>
            <h1 className="text-3xl sm:text-4xl font-display text-foreground">{t.welcome.title}</h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              {t.welcome.subtitle}
            </p>
          </div>

          <div className="glass-card rounded-2xl p-6 space-y-4">
            <Button
              onClick={() => setScreen('onboarding')}
              size="lg"
              className="w-full rounded-full text-base py-4 h-12"
            >
              {t.welcome.startSwiping}
            </Button>
            <Button
              onClick={() => setScreen('category-selection')}
              variant="secondary"
              size="lg"
              className="w-full rounded-full text-base py-4 h-12"
            >
              {t.welcome.selectCategories || 'Select Categories'}
            </Button>
            <Button
              onClick={() => setScreen('load')}
              variant="outline"
              size="lg"
              className="w-full rounded-full text-base py-4 h-12"
            >
              {t.welcome.loadLink}
            </Button>
          </div>

          <div className="mt-4">
            <FooterControls />
          </div>
        </div>
      </div>
    </div>
  );
}
