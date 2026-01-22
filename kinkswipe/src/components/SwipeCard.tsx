import TinderCard from 'react-tinder-card';
import { Card, CardHeader, CardContent } from './ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { AlertTriangle } from 'lucide-react';
import type { ActivityDef } from '../types';
import { useTranslation } from '../i18n/useTranslation';
import { useAppStore } from '../store/useAppStore';
import { getActivityText } from '../utils/getActivities';

interface SwipeCardProps {
  activity: ActivityDef;
  onSwipe: (direction: 'left' | 'right' | 'up' | 'down') => void;
}

export function SwipeCard({ activity, onSwipe }: SwipeCardProps) {
  const isEdge = activity.edge ?? false;
  const t = useTranslation();
  const { lang } = useAppStore();
  const activityText = getActivityText(activity, lang);

  return (
    <TinderCard
      className="absolute inset-0 w-full h-full"
      onSwipe={(direction) => {
        if (direction === 'up') onSwipe('up');
        else if (direction === 'right') onSwipe('right');
        else if (direction === 'down') onSwipe('down');
        else onSwipe('left');
      }}
    >
      <Card className="absolute inset-0 shadow-xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              {activity.categoryId}
            </span>
            {isEdge && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-sm">
                      <strong className="text-destructive">{t.edge.warning}</strong><br />
                      {t.edge.info}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center h-full gap-4 pt-6">
          <h2 className="text-3xl font-bold text-center">
            {activityText.text}
          </h2>
          <p className="text-center text-muted-foreground max-w-md">
            {activityText.desc}
          </p>
        </CardContent>
      </Card>
      <div className="absolute top-4 left-4 -translate-x-1/2 -translate-y-1/2 rotate-[-12deg] text-red-600 text-4xl font-black opacity-0 pointer-events-none transition-opacity">
        {t.swipe.nope}
      </div>
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-[12deg] text-green-600 text-4xl font-black opacity-0 pointer-events-none transition-opacity">
        {t.swipe.yes}
      </div>
      <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 -rotate-12deg text-gray-600 text-4xl font-black opacity-0 pointer-events-none transition-opacity">
        {t.swipe.meh}
      </div>
      <div className="absolute top-1/4 right-1/4 translate-x-1/2 -translate-y-1/2 rotate-[12deg] text-blue-600 text-4xl font-black opacity-0 pointer-events-none transition-opacity">
        {t.swipe.maybe}
      </div>
    </TinderCard>
  );
}