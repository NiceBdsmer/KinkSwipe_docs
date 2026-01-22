import { useState } from 'react';
import { Header } from '../components/Header';
import { SwipeCard } from '../components/SwipeCard';
import { TutorialCard } from '../components/TutorialCard';
import { ActionButtons } from '../components/ActionButtons';
import { Progress } from '../components/ui/progress';
import { useAppStore } from '../store/useAppStore';
import { categories } from '../data/categories';
import { getActivities } from '../utils/getActivities';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Button } from '../components/ui/button';
import { useTranslation } from '../i18n/useTranslation';
import type { RatingValue } from '../types';
import { Grid3X3 } from 'lucide-react';

export function SwipeScreen() {
  const t = useTranslation();
  const { currentCategory, currentActivityIndex, ratings, userMeta, tutorialSeen, setScreen, setRating, setCurrentCategory, setCurrentActivityIndex, lang, setTutorialSeen } = useAppStore();

  const [showRoundComplete, setShowRoundComplete] = useState(false);

  const currentMode: 'give' | 'receive' = userMeta.mode === 'both' ? 'give' : userMeta.mode;
  const showTutorial = !tutorialSeen && currentActivityIndex === 0 && currentCategory === categories[0].id;

  const activities = getActivities(lang);
  const categoryActivities = activities.filter(a => a.categoryId === currentCategory);
  const currentActivity = categoryActivities[currentActivityIndex];
  
  const getCategoryProgress = () => {
    const ratedCount = categoryActivities.filter(a => ratings[currentMode]?.[a.id] !== undefined).length;
    return { current: ratedCount, total: categoryActivities.length };
  };
  
  const getTotalProgress = () => {
    const totalActivities = activities.length;
    const ratedCount = Object.keys(ratings[currentMode] ?? {}).length;
    return { current: ratedCount, total: totalActivities };
  };
  
  const directionToRating = (direction: 'left' | 'right' | 'up' | 'down'): RatingValue => {
    switch (direction) {
      case 'right': return 'yes';
      case 'up': return 'maybe';
      case 'down': return 'meh';
      case 'left': return 'no';
    }
  };
  
  const handleSwipe = (direction: 'left' | 'right' | 'up' | 'down') => {
    if (!currentActivity) return;
    
    const rating = directionToRating(direction);
    setRating(currentMode, currentActivity.id, rating);
    
    if (currentActivityIndex < categoryActivities.length - 1) {
      setCurrentActivityIndex(currentActivityIndex + 1);
    } else {
      moveToNextCategory();
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleTutorialSwipe = (_direction: 'left' | 'right' | 'up' | 'down') => {
    setTutorialSeen(true);
  };
  
  const moveToNextCategory = () => {
    const currentIndex = categories.findIndex(c => c.id === currentCategory);
    
    if (currentIndex < categories.length - 1) {
      setCurrentCategory(categories[currentIndex + 1].id);
      setCurrentActivityIndex(0);
    } else {
      if (userMeta.mode === 'both' && currentMode === 'give') {
        setShowRoundComplete(true);
      } else {
        setScreen('summary');
      }
    }
  };
  
  const handleSkipCategory = () => {
    moveToNextCategory();
  };
  
  const handleRoundComplete = (continueSecondRound: boolean) => {
    setShowRoundComplete(false);
    if (continueSecondRound) {
      setCurrentCategory(categories[0].id);
      setCurrentActivityIndex(0);
    } else {
      setScreen('summary');
    }
  };
  
      const categoryProgress = getCategoryProgress();
      const totalProgress = getTotalProgress();
      const categoryPercent = (categoryProgress.current / categoryProgress.total) * 100;
      
      return (
    <div className="min-h-screen bg-background flex flex-col safe-area-inset pb-20">
      <Header
        onBack={() => setScreen('welcome')}
        extraActions={
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setScreen('category-selection')}
            className="text-muted-foreground hover:text-primary"
          >
            <Grid3X3 className="w-4 h-4" />
          </Button>
        }
      />

           <div className="flex-1 flex flex-col px-3 sm:px-4 py-2 max-w-lg sm:max-w-md mx-auto w-full">
            <div className="px-4 pb-2">
              <Progress value={categoryPercent} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1 text-center">
                {categoryProgress.current} / {categoryProgress.total}
              </p>
            </div>
            
            <div className="text-xs text-center text-muted-foreground mb-2">
              {totalProgress.current} / {totalProgress.total} total
            </div>
        
        <div className="flex-1 relative min-h-[300px] sm:min-h-[400px]">
          {showTutorial && !currentActivity ? (
            <TutorialCard
              onSwipe={handleTutorialSwipe}
            />
          ) : currentActivity ? (
            <SwipeCard
              activity={currentActivity}
              onSwipe={handleSwipe}
            />
          ) : null}
        </div>
        
        <ActionButtons
          onNope={() => handleSwipe('left')}
          onMeh={() => handleSwipe('down')}
          onMaybe={() => handleSwipe('up')}
          onYes={() => handleSwipe('right')}
        />
        
        <Button
          variant="ghost"
          className="mt-2 text-sm"
          onClick={handleSkipCategory}
        >
          {t.swipe.skipCategory}
        </Button>
      </div>
      
      <Dialog open={showRoundComplete} onOpenChange={setShowRoundComplete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t.swipe.roundComplete.title}</DialogTitle>
            <DialogDescription>{t.swipe.roundComplete.message}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => handleRoundComplete(false)}
            >
              {t.swipe.roundComplete.no}
            </Button>
            <Button onClick={() => handleRoundComplete(true)}>
              {t.swipe.roundComplete.yes}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}