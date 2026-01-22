import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Progress } from '../components/ui/progress';
import { FooterControls } from '../components/FooterControls';
import { useAppStore } from '../store/useAppStore';
import { useTranslation } from '../i18n/useTranslation';
import { categories } from '../data/categories';
import { getActivities } from '../utils/getActivities';
import { ChevronRight, Play, Lock } from 'lucide-react';

export function CategorySelection() {
  const t = useTranslation();
  const { setScreen, setCurrentCategory, setCurrentActivityIndex, ratings, userMeta, lang } = useAppStore();
  
  const activities = getActivities(lang);
  const currentMode: 'give' | 'receive' = userMeta.mode === 'both' ? 'give' : userMeta.mode;
  
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const getCategoryInfo = (categoryId: string) => {
    const categoryActivities = activities.filter(a => a.categoryId === categoryId);
    const ratedCount = categoryActivities.filter(a => ratings[currentMode]?.[a.id] !== undefined).length;
    const isCompleted = ratedCount === categoryActivities.length && categoryActivities.length > 0;
    
    return {
      activities: categoryActivities.length,
      completed: ratedCount,
      progress: categoryActivities.length > 0 ? (ratedCount / categoryActivities.length) * 100 : 0,
      isCompleted,
      isLocked: categoryId === 'edge' && !ratings[currentMode]?.['basics-complete']
    };
  };

  const getCategoryTitle = (categoryId: string) => {
    const titles: Record<string, string> = {
      'basics': t.categories?.basics || 'Basics',
      'bondage': t.categories?.bondage || 'Bondage',
      'impact': t.categories?.impact || 'Impact',
      'sensory': t.categories?.sensory || 'Sensory',
      'power-exchange': t.categories?.['power-exchange'] || 'Power Exchange',
      'edge': t.categories?.edge || 'Edge Play',
      'sexual': t.categories?.sexual || 'Sexual',
      'fetishes': t.categories?.fetishes || 'Fetishes',
      'humiliation': t.categories?.humiliation || 'Humiliation'
    };
    return titles[categoryId] || categoryId;
  };

  const getCategoryDescription = (categoryId: string) => {
    const descriptions: Record<string, string> = {
      'basics': t.categories?.basicsDesc || 'Essential fundamentals and safety practices',
      'bondage': t.categories?.bondageDesc || 'Restraint and restriction techniques',
      'impact': t.categories?.impactDesc || 'Spanking, flogging, and impact play',
      'sensory': t.categories?.sensoryDesc || 'Sensation exploration and sensory deprivation',
      'power-exchange': t.categories?.['power-exchangeDesc'] || 'Domination, submission, and power dynamics',
      'edge': t.categories?.edgeDesc || 'Advanced and high-intensity activities',
      'sexual': t.categories?.sexualDesc || 'Sexual activities and intimate play',
      'fetishes': t.categories?.fetishesDesc || 'Specific fetishes and specialized interests',
      'humiliation': t.categories?.humiliationDesc || 'Humiliation and degradation play'
    };
    return descriptions[categoryId] || '';
  };

  const handleStartCategory = (categoryId: string) => {
    setCurrentCategory(categoryId);
    setCurrentActivityIndex(0);
    setScreen('swipe');
  };

  const getTotalProgress = () => {
    const totalActivities = activities.length;
    const ratedCount = Object.keys(ratings[currentMode] ?? {}).length;
    return totalActivities > 0 ? (ratedCount / totalActivities) * 100 : 0;
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="px-4 py-6 max-w-4xl mx-auto w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">{t.categorySelection?.title || 'Choose Your Path'}</h1>
          <p className="text-muted-foreground mb-4">
            {t.categorySelection?.subtitle || 'Select a category to begin exploring activities'}
          </p>
          
          <div className="max-w-md mx-auto">
            <div className="flex justify-between text-sm text-muted-foreground mb-2">
              <span>{t.categorySelection?.overallProgress || 'Overall Progress'}</span>
              <span>{Math.round(getTotalProgress())}%</span>
            </div>
            <Progress value={getTotalProgress()} className="h-3" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => {
            const info = getCategoryInfo(category.id);
            const title = getCategoryTitle(category.id);
            const description = getCategoryDescription(category.id);
            
            return (
              <Card
                key={category.id}
                className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                  selectedCategory === category.id
                    ? 'ring-2 ring-primary ring-offset-2'
                    : 'hover:border-primary/50'
                } ${info.isLocked ? 'opacity-60 cursor-not-allowed' : ''}`}
                onClick={() => !info.isLocked && setSelectedCategory(category.id)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{title}</CardTitle>
                    {info.isLocked ? (
                      <Lock className="w-4 h-4 text-muted-foreground" />
                    ) : info.isCompleted ? (
                      <div className="w-4 h-4 rounded-full bg-success" />
                    ) : null}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {description}
                  </p>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {info.activities} {t.categorySelection?.activities || 'activities'}
                      </span>
                      <span className="text-muted-foreground">
                        {info.completed} {t.categorySelection?.completed || 'completed'}
                      </span>
                    </div>
                    
                    {info.activities > 0 && (
                      <Progress 
                        value={info.progress} 
                        className={`h-2 ${info.isCompleted ? 'bg-success/20' : ''}`}
                      />
                    )}
                  </div>
                  
                  <Button
                    className="w-full"
                    variant={info.isCompleted ? "secondary" : "default"}
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!info.isLocked) {
                        handleStartCategory(category.id);
                      }
                    }}
                    disabled={info.isLocked}
                  >
                    <Play className="w-3 h-3 mr-1" />
                    {info.isCompleted 
                      ? (t.categorySelection?.review || 'Review')
                      : (t.categorySelection?.start || 'Start')
                    }
                    <ChevronRight className="w-3 h-3 ml-1" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="flex flex-col items-center gap-4 mt-8">
          <Button
            variant="outline"
            onClick={() => setScreen('welcome')}
          >
            {t.categorySelection?.back || 'Back to Menu'}
          </Button>
          
          {/* Footer with Controls */}
          <FooterControls />
        </div>
      </div>
    </div>
  );
}