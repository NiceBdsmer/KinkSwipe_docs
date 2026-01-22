import { useMemo, useState, useRef } from 'react';
import { activitiesEn } from '../data/activities-en';
import { categories } from '../data/categories';
import { useAppStore } from '../store/useAppStore';
import { useTranslation } from '../i18n/useTranslation';
import { SummaryCard } from '../components/SummaryCard';
import { CustomCategoryDialog } from '../components/CustomCategoryDialog';
import { Button } from '../components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../components/ui/accordion';
import { Users, UserRound, Link, FileText, Download, Plus, ArrowLeft, Pencil, Trash2 } from 'lucide-react';
import { generateShareLink } from '../utils/generateShareLink';
import { exportText } from '../utils/exportText';
import { exportImage } from '../utils/exportImage';
import type { CustomCategory, ActivityDef, CustomActivity } from '../types';

type RatingMode = 'give' | 'receive';

export function SummaryScreen() {
  const t = useTranslation();
  const { ratings, userMeta, setScreen, customCategories, addCustomCategory, updateCustomCategory, deleteCustomCategory } = useAppStore();
  const summaryRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string>('');
  const [customDialogOpen, setCustomDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CustomCategory | undefined>(undefined);

  const [currentMode, setCurrentMode] = useState<RatingMode>(() => {
    if (userMeta.mode === 'both') return 'give';
    return userMeta.mode;
  });

  const showToggle = userMeta.mode === 'both';

  const handleCopyLink = async () => {
    try {
      setError('');
      const link = generateShareLink({
        ratings,
        userMeta,
        lang: 'en',
        customCategories: [],
        currentScreen: 'summary',
        currentCategory: '',
        currentActivityIndex: 0,
        tutorialSeen: true
      });

      if (navigator.share) {
        await navigator.share({
          title: 'KinkSwipe Results',
          text: 'Check out my KinkSwipe results!',
          url: link,
        });
      } else {
        await navigator.clipboard.writeText(link);
      }
    } catch (error) {
      console.error('Failed to share link:', error);
      setError('Failed to share link. Please try again.');
    }
  };

  const handleCopyText = async () => {
    try {
      setError('');
      const text = exportText(ratings);
      await navigator.clipboard.writeText(text);
    } catch (error) {
      console.error('Failed to copy text:', error);
      setError('Failed to copy text to clipboard. Please try again.');
    }
  };

  const handleDownloadImage = async () => {
    if (!summaryRef.current) {
      setError('Unable to generate image. Please refresh and try again.');
      return;
    }
    try {
      setError('');
      await exportImage(summaryRef.current);
    } catch (error) {
      console.error('Failed to download image:', error);
      setError('Failed to download image. Please try again.');
    }
  };

  const handleAddCustom = () => {
    setEditingCategory(undefined);
    setCustomDialogOpen(true);
  };

  const handleEditCategory = (category: CustomCategory) => {
    setEditingCategory(category);
    setCustomDialogOpen(true);
  };

  const handleDeleteCategory = (id: string) => {
    if (confirm('Are you sure you want to delete this category and all its activities?')) {
      deleteCustomCategory(id);
    }
  };

  const handleSaveCategory = (category: CustomCategory) => {
    if (editingCategory) {
      updateCustomCategory(editingCategory.id, category);
    } else {
      addCustomCategory(category);
    }
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

    customCategories.forEach((cat) => {
      cat.activities.forEach((activity) => {
        const rating = currentRatings[activity.id];
        if (rating === 'yes') yes++;
        else if (rating === 'maybe') maybe++;
        else if (rating === 'meh') meh++;
        else if (rating === 'no') nope++;
      });
    });

    return { yes, maybe, meh, nope };
  }, [currentRatings, customCategories]);

  const categoryActivities = useMemo(() => {
    const defaultCategories = categories.map((category) => {
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
        nopeActivities,
        isCustom: false,
        customCategory: undefined as CustomCategory | undefined
      };
    });

    const customCategoriesData = customCategories.map((customCat) => {
      const yesActivities = customCat.activities.filter(
        (activity) => currentRatings[activity.id] === 'yes'
      );
      const maybeActivities = customCat.activities.filter(
        (activity) => currentRatings[activity.id] === 'maybe'
      );
      const mehActivities = customCat.activities.filter(
        (activity) => currentRatings[activity.id] === 'meh'
      );
      const nopeActivities = customCat.activities.filter(
        (activity) => currentRatings[activity.id] === 'no'
      );

      return {
        category: { id: customCat.id, name: customCat.name },
        yesActivities,
        maybeActivities,
        mehActivities,
        nopeActivities,
        isCustom: true,
        customCategory: customCat
      };
    });

    return [...defaultCategories, ...customCategoriesData];
  }, [currentRatings, customCategories]);

  const getActivityText = (activity: ActivityDef | CustomActivity) => {
    if ('texts' in activity && activity.texts.en) {
      return activity.texts.en.text;
    }
    return activity.text;
  };

  return (
    <div ref={summaryRef} className="min-h-screen bg-background flex flex-col items-center p-4 pb-20">
      <div className="w-full max-w-2xl mb-4">
        <Button
          variant="ghost"
          onClick={() => setScreen('welcome')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Start
        </Button>
      </div>

      {error && (
        <div className="w-full max-w-2xl mb-4">
          <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-md">
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}

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
          {categoryActivities.map(({ category, yesActivities, maybeActivities, mehActivities, nopeActivities, isCustom, customCategory }) => (
            <AccordionItem key={category.id} value={category.id}>
              <AccordionTrigger className="capitalize">
                {isCustom ? category.name : t.categories[category.id as keyof typeof t.categories]}
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  {isCustom && customCategory && (
                    <div className="flex gap-2 justify-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditCategory(customCategory)}
                        className="gap-2"
                      >
                        <Pencil className="w-4 h-4" />
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteCategory(customCategory.id)}
                        className="gap-2 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </Button>
                    </div>
                  )}
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
                            {getActivityText(activity)}
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
                            {getActivityText(activity)}
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
                            {getActivityText(activity)}
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
                            {getActivityText(activity)}
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

      <CustomCategoryDialog
        open={customDialogOpen}
        onOpenChange={setCustomDialogOpen}
        onSave={handleSaveCategory}
        initialCategory={editingCategory}
      />
    </div>
  );
}
