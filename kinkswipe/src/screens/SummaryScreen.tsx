import { useMemo, useState, useRef } from 'react';
import { activitiesEn } from '../data/activities-en';
import { categories } from '../data/categories';
import { useAppStore } from '../store/useAppStore';
import { useTranslation } from '../i18n/useTranslation';
import { SummaryCard } from '../components/SummaryCard';
import { Button } from '../components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../components/ui/accordion';
import { Users, UserRound, Link, FileText, Download, Plus } from 'lucide-react';
import { generateShareLink } from '../utils/generateShareLink';
import { exportText } from '../utils/exportText';
import { exportImage } from '../utils/exportImage';

type RatingMode = 'give' | 'receive';

export function SummaryScreen() {
  const t = useTranslation();
  const { ratings, userMeta } = useAppStore();
  const summaryRef = useRef<HTMLDivElement>(null);

  const [currentMode, setCurrentMode] = useState<RatingMode>(() => {
    if (userMeta.mode === 'both') return 'give';
    return userMeta.mode;
  });

  const showToggle = userMeta.mode === 'both';

  const handleCopyLink = async () => {
    try {
      const link = generateShareLink({ ratings, userMeta, lang: 'en', version: '1.0' });

      // Try native share API first (mobile)
      if (navigator.share) {
        await navigator.share({
          title: 'KinkSwipe Results',
          text: 'Check out my KinkSwipe results!',
          url: link,
        });
      } else {
        // Fallback to clipboard
        await navigator.clipboard.writeText(link);
      }
      // TODO: Show success toast
    } catch (error) {
      console.error('Failed to share link:', error);
      // TODO: Show error toast
    }
  };

  const handleCopyText = async () => {
    try {
      const text = exportText(ratings);
      await navigator.clipboard.writeText(text);
      // TODO: Show success toast
    } catch (error) {
      console.error('Failed to copy text:', error);
      // TODO: Show error toast
    }
  };

  const handleDownloadImage = async () => {
    if (!summaryRef.current) return;
    try {
      await exportImage(summaryRef.current);
      // TODO: Show success toast
    } catch (error) {
      console.error('Failed to download image:', error);
      // TODO: Show error toast
    }
  };

  const handleAddCustom = () => {
    // TODO: Implement custom category/activity dialog
    console.log('Add custom clicked');
  };

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

  const categoryActivities = useMemo(() => {
    return categories.map((category) => {
      const categoryActivitiesEn = activitiesEn.filter(
        (activity) => activity.categoryId === category.id
      );
      
      const yesActivities = categoryActivitiesEn.filter(
        (activity) => currentRatings[activity.id] === 'yes'
      );
      const maybeActivities = categoryActivitiesEn.filter(
        (activity) => currentRatings[activity.id] === 'maybe'
      );
      const mehActivities = categoryActivitiesEn.filter(
        (activity) => currentRatings[activity.id] === 'meh'
      );
      const nopeActivities = categoryActivitiesEn.filter(
        (activity) => currentRatings[activity.id] === 'no'
      );
      
      return {
        category,
        yesActivities,
        maybeActivities,
        mehActivities,
        nopeActivities
      };
    });
  }, [currentRatings]);

  return (
    <div ref={summaryRef} className="min-h-screen bg-background flex flex-col items-center p-4">
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

        <Accordion type="multiple" className="w-full">
          {categoryActivities.map(({ category, yesActivities, maybeActivities, mehActivities, nopeActivities }) => (
            <AccordionItem key={category.id} value={category.id}>
              <AccordionTrigger className="capitalize">
                {t.categories[category.id as keyof typeof t.categories]}
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  {yesActivities.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-0.5 rounded-full bg-green-600 text-white text-xs font-semibold">
                          YES
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {yesActivities.length} {yesActivities.length === 1 ? 'activity' : 'activities'}
                        </span>
                      </div>
                      <ul className="text-sm space-y-1 pl-4">
                        {yesActivities.map((activity) => (
                          <li key={activity.id} className="text-foreground">
                            {activity.texts.en.text}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {maybeActivities.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-0.5 rounded-full bg-blue-600 text-white text-xs font-semibold">
                          MAYBE
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {maybeActivities.length} {maybeActivities.length === 1 ? 'activity' : 'activities'}
                        </span>
                      </div>
                      <ul className="text-sm space-y-1 pl-4">
                        {maybeActivities.map((activity) => (
                          <li key={activity.id} className="text-foreground">
                            {activity.texts.en.text}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {mehActivities.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-0.5 rounded-full bg-gray-600 text-white text-xs font-semibold">
                          MEH
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {mehActivities.length} {mehActivities.length === 1 ? 'activity' : 'activities'}
                        </span>
                      </div>
                      <ul className="text-sm space-y-1 pl-4">
                        {mehActivities.map((activity) => (
                          <li key={activity.id} className="text-foreground">
                            {activity.texts.en.text}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {nopeActivities.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-0.5 rounded-full bg-red-600 text-white text-xs font-semibold">
                          NOPE
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {nopeActivities.length} {nopeActivities.length === 1 ? 'activity' : 'activities'}
                        </span>
                      </div>
                      <ul className="text-sm space-y-1 pl-4">
                        {nopeActivities.map((activity) => (
                          <li key={activity.id} className="text-foreground">
                            {activity.texts.en.text}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {yesActivities.length === 0 &&
                   maybeActivities.length === 0 &&
                   mehActivities.length === 0 &&
                   nopeActivities.length === 0 && (
                    <p className="text-sm text-muted-foreground">No activities rated in this category.</p>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      <div className="fixed bottom-4 right-4 flex flex-col gap-2">
        <Button
          variant="default"
          size="icon"
          className="rounded-full shadow-lg"
          onClick={handleCopyLink}
          title="Copy share link"
        >
          <Link className="w-5 h-5" />
        </Button>
        <Button
          variant="default"
          size="icon"
          className="rounded-full shadow-lg"
          onClick={handleCopyText}
          title="Copy text summary"
        >
          <FileText className="w-5 h-5" />
        </Button>
        <Button
          variant="default"
          size="icon"
          className="rounded-full shadow-lg"
          onClick={handleDownloadImage}
          title="Download image"
        >
          <Download className="w-5 h-5" />
        </Button>
        <Button
          variant="default"
          size="icon"
          className="rounded-full shadow-lg"
          onClick={handleAddCustom}
          title="Add custom"
        >
          <Plus className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}
