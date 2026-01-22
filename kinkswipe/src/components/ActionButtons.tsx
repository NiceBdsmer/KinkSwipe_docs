import { Button } from './ui/button';
import { X, Circle, Zap, Heart } from 'lucide-react';
import { useTranslation } from '../i18n/useTranslation';

interface ActionButtonsProps {
  onNope: () => void;
  onSkip: () => void;
  onMaybe: () => void;
  onYes: () => void;
}

export function ActionButtons({ onNope, onSkip, onMaybe, onYes }: ActionButtonsProps) {
  const t = useTranslation();

  return (
    <div className="flex justify-center gap-1 sm:gap-3 px-2 sm:px-4 py-4 sm:py-6">
      <Button
        variant="destructive"
        size="lg"
        className="flex-1 min-w-0 h-10 sm:h-12 text-xs sm:text-sm px-1 sm:px-3"
        onClick={onNope}
        aria-label={t.swipe.nope}
      >
        <X className="h-4 w-4 sm:h-5 sm:w-5" />
        <span className="hidden sm:inline ml-1 sm:ml-2">{t.swipe.nope}</span>
      </Button>
      <Button
        variant="secondary"
        size="lg"
        className="flex-1 min-w-0 h-10 sm:h-12 text-xs sm:text-sm px-1 sm:px-3"
        onClick={onSkip}
        aria-label={t.swipe.skip}
      >
        <Circle className="h-4 w-4 sm:h-5 sm:w-5" />
        <span className="hidden sm:inline ml-1 sm:ml-2">{t.swipe.skip}</span>
      </Button>
      <Button
        variant="default"
        size="lg"
        className="flex-1 min-w-0 h-10 sm:h-12 text-xs sm:text-sm bg-blue-600 hover:bg-blue-700 px-1 sm:px-3"
        onClick={onMaybe}
        aria-label={t.swipe.maybe}
      >
        <Zap className="h-4 w-4 sm:h-5 sm:w-5" />
        <span className="hidden sm:inline ml-1 sm:ml-2">{t.swipe.maybe}</span>
      </Button>
      <Button
        variant="default"
        size="lg"
        className="flex-1 min-w-0 h-10 sm:h-12 text-xs sm:text-sm bg-green-600 hover:bg-green-700 px-1 sm:px-3"
        onClick={onYes}
        aria-label={t.swipe.yes}
      >
        <Heart className="h-4 w-4 sm:h-5 sm:w-5" />
        <span className="hidden sm:inline ml-1 sm:ml-2">{t.swipe.yes}</span>
      </Button>
      <Button
        variant="secondary"
        size="lg"
        className="flex-1 min-w-0 h-10 sm:h-12 text-xs sm:text-sm px-1 sm:px-3"
        onClick={onSkip}
      >
        <Circle className="h-4 w-4 sm:h-5 sm:w-5" />
        <span className="hidden sm:inline ml-1 sm:ml-2">{t.swipe.skip}</span>
      </Button>
      <Button
        variant="default"
        size="lg"
        className="flex-1 min-w-0 h-10 sm:h-12 text-xs sm:text-sm bg-blue-600 hover:bg-blue-700 px-1 sm:px-3"
        onClick={onMaybe}
      >
        <Zap className="h-4 w-4 sm:h-5 sm:w-5" />
        <span className="hidden sm:inline ml-1 sm:ml-2">{t.swipe.maybe}</span>
      </Button>
      <Button
        variant="default"
        size="lg"
        className="flex-1 min-w-0 h-10 sm:h-12 text-xs sm:text-sm bg-green-600 hover:bg-green-700 px-1 sm:px-3"
        onClick={onYes}
      >
        <Heart className="h-4 w-4 sm:h-5 sm:w-5" />
        <span className="hidden sm:inline ml-1 sm:ml-2">{t.swipe.yes}</span>
      </Button>
    </div>
  );
}
