import { useState } from 'react';
import TinderCard from 'react-tinder-card';
import { Card, CardHeader, CardContent } from './ui/card';
import { useTranslation } from '../i18n/useTranslation';
import { ArrowRightCircle, ArrowLeftCircle, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';

interface TutorialCardProps {
  onSwipe: (direction: 'left' | 'right' | 'up' | 'down') => void;
}

export function TutorialCard({ onSwipe }: TutorialCardProps) {
  const t = useTranslation();
  const [activeDirection, setActiveDirection] = useState<string | null>(null);

  return (
    <TinderCard
      key="tutorial"
      className="absolute inset-0 w-full h-full"
      swipeRequirementType="position"
      swipeThreshold={100}
      preventSwipe={[]}
      onSwipeRequirementFulfilled={(direction) => setActiveDirection(direction)}
      onSwipeRequirementUnfulfilled={() => setActiveDirection(null)}
      onCardLeftScreen={() => setActiveDirection(null)}
      onSwipe={(direction) => {
        setActiveDirection(null);
        onSwipe(direction);
      }}
    >
      <Card className="absolute inset-0 shadow-xl">
        <CardHeader>
          <div className="flex items-center justify-center">
            <span className="text-xs font-medium text-muted-foreground">
              {t.tutorial.title}
            </span>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center h-full gap-6 pt-6">
          <h2 className="text-2xl font-bold text-center">
            {t.tutorial.heading}
          </h2>
          <p className="text-center text-muted-foreground max-w-md">
            {t.tutorial.description}
          </p>
          
          <div className="grid grid-cols-2 gap-6 mt-4">
            <div className={`flex flex-col items-center gap-2 transition-all ${activeDirection === 'right' ? 'scale-110' : ''}`}>
              <div className="relative w-16 h-16 flex items-center justify-center bg-green-100 dark:bg-green-900 rounded-full">
                <ArrowRightCircle className={`w-10 h-10 text-green-600 dark:text-green-400 ${activeDirection === 'right' ? 'animate-pulse' : ''}`} />
              </div>
              <span className="text-sm font-semibold text-green-600 dark:text-green-400">{t.swipe.yes}</span>
              <span className="text-xs text-muted-foreground">{t.tutorial.swipeRight}</span>
            </div>

            <div className={`flex flex-col items-center gap-2 transition-all ${activeDirection === 'up' ? 'scale-110' : ''}`}>
              <div className="relative w-16 h-16 flex items-center justify-center bg-blue-100 dark:bg-blue-900 rounded-full">
                <ArrowUpCircle className={`w-10 h-10 text-blue-600 dark:text-blue-400 ${activeDirection === 'up' ? 'animate-pulse' : ''}`} />
              </div>
              <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">{t.swipe.maybe}</span>
              <span className="text-xs text-muted-foreground">{t.tutorial.swipeUp}</span>
            </div>

            <div className={`flex flex-col items-center gap-2 transition-all ${activeDirection === 'down' ? 'scale-110' : ''}`}>
              <div className="relative w-16 h-16 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-full">
                <ArrowDownCircle className={`w-10 h-10 text-gray-600 dark:text-gray-400 ${activeDirection === 'down' ? 'animate-pulse' : ''}`} />
              </div>
              <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">{t.swipe.meh}</span>
              <span className="text-xs text-muted-foreground">{t.tutorial.swipeDown}</span>
            </div>

            <div className={`flex flex-col items-center gap-2 transition-all ${activeDirection === 'left' ? 'scale-110' : ''}`}>
              <div className="relative w-16 h-16 flex items-center justify-center bg-red-100 dark:bg-red-900 rounded-full">
                <ArrowLeftCircle className={`w-10 h-10 text-red-600 dark:text-red-400 ${activeDirection === 'left' ? 'animate-pulse' : ''}`} />
              </div>
              <span className="text-sm font-semibold text-red-600 dark:text-red-400">{t.swipe.nope}</span>
              <span className="text-xs text-muted-foreground">{t.tutorial.swipeLeft}</span>
            </div>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-4">
            {t.tutorial.dismissHint}
          </p>
        </CardContent>
      </Card>
    </TinderCard>
  );
}
