import { Progress } from './ui/progress';
import { useAppStore } from '../store/useAppStore';
import { categories } from '../data/categories';
import { activitiesEn } from '../data/activities-en';

export function CategoryProgress() {
  const ratings = useAppStore((state) => state.ratings.give);

  const categoryActivities = categories.flatMap((category) =>
    activitiesEn.filter((a) => a.categoryId === category.id)
  );

  const completedCount = categoryActivities.reduce(
    (count, activity) => count + (ratings[activity.id] ? 1 : 0),
    0
  );

  const totalCount = categoryActivities.length;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <div className="px-4 pb-4">
      <Progress value={progress} className="h-2" />
      <p className="text-xs text-muted-foreground mt-1 text-center">
        {completedCount} / {totalCount} ({Math.round(progress)}%)
      </p>
    </div>
  );
}
