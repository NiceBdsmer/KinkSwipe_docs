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
    setScreen('welcome');
  };

  const handleResetAll = () => {
    resetState();
    setScreen('welcome');
  };

  if (currentScreen === 'welcome') {
    return null;
  }

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t border-border safe-area-inset-bottom">
      <div className="flex items-center justify-between gap-3 px-4 py-3 max-w-lg mx-auto">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleHome}
          className="flex-1 gap-2"
        >
          <Home className="w-4 h-4" />
          <span>{t.footer?.home || 'Home'}</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleResetAll}
          className="flex-1 gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          <span>{t.footer?.resetAll || 'Reset All'}</span>
        </Button>
      </div>
    </footer>
  );
}
