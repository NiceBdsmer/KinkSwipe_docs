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
    <div className="flex justify-center gap-4 sm:gap-6 px-2 py-5">
      <Button
        variant="ghost"
        size="icon"
        className="action-orb bg-gradient-to-br from-rose-500/80 to-rose-700/80 hover:scale-105"
        onClick={onNope}
        aria-label={t.swipe.nope}
      >
        <X className="h-5 w-5" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="action-orb bg-gradient-to-br from-slate-500/80 to-slate-700/80 hover:scale-105"
        onClick={onSkip}
        aria-label={t.swipe.skip}
      >
        <Circle className="h-5 w-5" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="action-orb bg-gradient-to-br from-sky-500/80 to-blue-700/80 hover:scale-105"
        onClick={onMaybe}
        aria-label={t.swipe.maybe}
      >
        <Zap className="h-5 w-5" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="action-orb bg-gradient-to-br from-emerald-500/80 to-emerald-700/80 hover:scale-105"
        onClick={onYes}
        aria-label={t.swipe.yes}
      >
        <Heart className="h-5 w-5" />
      </Button>
    </div>
  );
}
