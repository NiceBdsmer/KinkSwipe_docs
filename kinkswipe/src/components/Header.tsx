import { Button } from './ui/button';
import { ArrowLeft } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { useTranslation } from '../i18n/useTranslation';
import { categories } from '../data/categories';

interface HeaderProps {
  onBack?: () => void;
  extraActions?: React.ReactNode;
}

export function Header({ onBack, extraActions }: HeaderProps) {
  const t = useTranslation();
  const currentCategory = useAppStore((state) => state.currentCategory);
  const currentActivityIndex = useAppStore((state) => state.currentActivityIndex);

  const category = categories.find((c) => c.id === currentCategory);
  const categoryName = category ? t.categories[category.id as keyof typeof t.categories] : '';

  return (
    <div className="flex items-center justify-between px-3 sm:px-4 py-3 sm:py-4 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center gap-3">
        {onBack && (
          <Button variant="ghost" size="icon" onClick={onBack} aria-label="Back" className="shrink-0">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        )}
        <div className="min-w-0">
          <h1 className="text-lg sm:text-xl font-semibold truncate max-w-[180px] sm:max-w-none">{categoryName}</h1>
          <p className="text-sm text-muted-foreground">
            Activity {currentActivityIndex + 1}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground">
          <span className="text-green-600 font-medium">{t.swipe.yes}</span>
          <span className="text-blue-600 font-medium">{t.swipe.maybe}</span>
          <span className="text-gray-600 font-medium">{t.swipe.skip}</span>
          <span className="text-red-600 font-medium">{t.swipe.nope}</span>
        </div>
        <div className="flex sm:hidden items-center gap-1 text-xs text-muted-foreground">
          <span className="text-green-600">✓</span>
          <span className="text-blue-600">?</span>
          <span className="text-gray-600">⊘</span>
          <span className="text-red-600">✗</span>
        </div>
        {extraActions}
      </div>
    </div>
  );
}
