import { useMemo, useState } from 'react';
import { activitiesEn } from '../data/activities-en';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { useAppStore } from '../store/useAppStore';
import { useTranslation } from '../i18n/useTranslation';
import { SummaryCard } from '../components/SummaryCard';
import { Button } from '../components/ui/button';
import { Users, UserRound } from 'lucide-react';

type RatingMode = 'give' | 'receive';

export function SummaryScreen() {
  const t = useTranslation();
  const { ratings, userMeta } = useAppStore();
  
  const [currentMode, setCurrentMode] = useState<RatingMode>(() => {
    if (userMeta.mode === 'both') return 'give';
    return userMeta.mode;
  });

  const showToggle = userMeta.mode === 'both';

  const currentRatings = ratings[currentMode as keyof typeof ratings];
  
  const stats = useMemo(() => {
    let yes = 0;
    let maybe = 0;
    let meh = 0;
    let nope = 0;
    
    activitiesEn.forEach((activity) => {
      const rating = currentRatings[activity.id];
      if (rating === 'yes') yes++;
      else if (rating === 'maybe') maybe++;
      else if (rating === 'meh') meh++;
      else if (rating === 'no') nope++;
    });
    
    return { yes, maybe, meh, nope };
  }, [currentRatings]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center p-4">
      <div className="w-full max-w-2xl space-y-6">
        {showToggle && (
          <div className="flex gap-2 bg-muted p-1 rounded-lg">
            <Button
              variant={currentMode === 'give' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setCurrentMode('give')}
              className="flex-1 gap-2"
            >
              <UserRound className="w-4 h-4" />
              {t.summary.give}
            </Button>
            <Button
              variant={currentMode === 'receive' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setCurrentMode('receive')}
              className="flex-1 gap-2"
            >
              <Users className="w-4 h-4" />
              {t.summary.receive}
            </Button>
          </div>
        )}

        <SummaryCard
          yesCount={stats.yes}
          maybeCount={stats.maybe}
          mehCount={stats.meh}
          nopeCount={stats.nope}
        />

        <Card>
          <CardHeader>
            <CardTitle>{t.summary.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              You rated {activitiesEn.length} activities total.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
