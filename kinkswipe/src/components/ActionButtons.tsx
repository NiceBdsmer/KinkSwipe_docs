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
    <div className="flex justify-center gap-3 px-4 py-6">
      <Button
        variant="destructive"
        size="lg"
        className="flex-1"
        onClick={onNope}
      >
        <X className="mr-2 h-5 w-5" />
        {t.swipe.nope}
      </Button>
      <Button
        variant="secondary"
        size="lg"
        className="flex-1"
        onClick={onMeh}
      >
        <Circle className="mr-2 h-5 w-5" />
        {t.swipe.meh}
      </Button>
      <Button
        variant="default"
        size="lg"
        className="flex-1 bg-blue-600 hover:bg-blue-700"
        onClick={onMaybe}
      >
        <Zap className="mr-2 h-5 w-5" />
        {t.swipe.maybe}
      </Button>
      <Button
        variant="default"
        size="lg"
        className="flex-1 bg-green-600 hover:bg-green-700"
        onClick={onYes}
      >
        <Heart className="mr-2 h-5 w-5" />
        {t.swipe.yes}
      </Button>
    </div>
  );
}
