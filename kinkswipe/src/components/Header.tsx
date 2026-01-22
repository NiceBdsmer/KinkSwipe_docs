import { Button } from './ui/button';
import { ArrowLeft } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { useTranslation } from '../i18n/useTranslation';
import { categories } from '../data/categories';

interface HeaderProps {
  onBack?: () => void;
}

export function Header({ onBack }: HeaderProps) {
  const t = useTranslation();
  const currentCategory = useAppStore((state) => state.currentCategory);
  const currentActivityIndex = useAppStore((state) => state.currentActivityIndex);

  const category = categories.find((c) => c.id === currentCategory);
  const categoryName = category ? t.categories[category.id as keyof typeof t.categories] : '';

  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-border">
      <div className="flex items-center gap-3">
        {onBack && (
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
        )}
        <div>
          <h1 className="text-lg font-semibold">{categoryName}</h1>
          <p className="text-sm text-muted-foreground">
            {currentActivityIndex + 1}
          </p>
        </div>
      </div>
      <div className="text-sm text-muted-foreground">
        {t.swipe.yes} | {t.swipe.maybe} | {t.swipe.meh} | {t.swipe.nope}
      </div>
    </div>
  );
}
