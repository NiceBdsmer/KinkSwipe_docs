import { Button } from './ui/button';
import { X, Circle, Zap, Heart } from 'lucide-react';
import { useTranslation } from '../i18n/useTranslation';

interface ActionButtonsProps {
  onNope: () => void;
  onMeh: () => void;
  onMaybe: () => void;
  onYes: () => void;
}

export function ActionButtons({ onNope, onMeh, onMaybe, onYes }: ActionButtonsProps) {
  const t = useTranslation();

  return (
    <div className="flex justify-center gap-2 sm:gap-3 px-3 sm:px-4 py-4 sm:py-6">
      <Button
        variant="destructive"
        size="lg"
        className="flex-1 h-10 sm:h-12 text-xs sm:text-sm"
        onClick={onNope}
      >
        <X className="mr-1 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" />
        <span className="hidden sm:inline">{t.swipe.nope}</span>
        <span className="sm:hidden">NO</span>
      </Button>
      <Button
        variant="secondary"
        size="lg"
        className="flex-1 h-10 sm:h-12 text-xs sm:text-sm"
        onClick={onMeh}
      >
        <Circle className="mr-1 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" />
        <span className="hidden sm:inline">{t.swipe.meh}</span>
        <span className="sm:hidden">MEH</span>
      </Button>
      <Button
        variant="default"
        size="lg"
        className="flex-1 h-10 sm:h-12 text-xs sm:text-sm bg-blue-600 hover:bg-blue-700"
        onClick={onMaybe}
      >
        <Zap className="mr-1 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" />
        <span className="hidden sm:inline">{t.swipe.maybe}</span>
        <span className="sm:hidden">?</span>
      </Button>
      <Button
        variant="default"
        size="lg"
        className="flex-1 h-10 sm:h-12 text-xs sm:text-sm bg-green-600 hover:bg-green-700"
        onClick={onYes}
      >
        <Heart className="mr-1 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" />
        <span className="hidden sm:inline">{t.swipe.yes}</span>
        <span className="sm:hidden">YES</span>
      </Button>
    </div>
  );
}
