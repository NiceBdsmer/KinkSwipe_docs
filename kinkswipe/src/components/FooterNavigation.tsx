import { Home, RotateCcw } from 'lucide-react';
import { Button } from './ui/button';
import { useAppStore } from '../store/useAppStore';
import { useTranslation } from '../i18n/useTranslation';

export function FooterNavigation() {
  const t = useTranslation();
  const setScreen = useAppStore((state) => state.setScreen);
  const resetState = useAppStore((state) => state.resetState);
  const currentScreen = useAppStore((state) => state.currentScreen);

  const handleHome = () => {
    setScreen('start');
  };

  const handleResetAll = () => {
    resetState();
    setScreen('start');
  };

  if (currentScreen === 'start' || currentScreen === 'welcome' || currentScreen === 'onboarding' || currentScreen === 'category-selection' || currentScreen === 'swipe' || currentScreen === 'load') {
    return null;
  }

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-xl border-t border-white/10 safe-area-inset-bottom">
      <div className="flex items-center justify-between gap-3 px-4 py-3 max-w-lg mx-auto">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleHome}
          className="flex-1 gap-2 rounded-full"
        >
          <Home className="w-4 h-4" />
          <span>{t.footer?.home || 'Home'}</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleResetAll}
          className="flex-1 gap-2 rounded-full"
        >
          <RotateCcw className="w-4 h-4" />
          <span>{t.footer?.resetAll || 'Reset All'}</span>
        </Button>
      </div>
    </footer>
  );
}
