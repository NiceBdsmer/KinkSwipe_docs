import { activitiesEn } from '../data/activities-en';
import { categories } from '../data/categories';
import type { RatingValue } from '../types';

type RatingMode = 'give' | 'receive';

export function exportText(ratings: Record<RatingMode, Record<string, RatingValue | undefined>>): string {
  const lines: string[] = [];

  categories.forEach((category) => {
    const categoryActivities = activitiesEn.filter(activity => activity.categoryId === category.id);

    // Check if any activities in this category have ratings
    const hasRatings = categoryActivities.some(activity =>
      ratings.give[activity.id] || ratings.receive[activity.id]
    );

    if (!hasRatings) return;

    lines.push(`${category.id.toUpperCase()}`);
    lines.push('='.repeat(category.id.length));

    (['give', 'receive'] as RatingMode[]).forEach((mode) => {
      const modeRatings = ratings[mode];
      const ratedActivities = categoryActivities.filter(activity => modeRatings[activity.id]);

      if (ratedActivities.length === 0) return;

      lines.push(`\n${mode.toUpperCase()}:`);

      const groupedByRating: Record<RatingValue, typeof ratedActivities> = {
        yes: [],
        maybe: [],
        meh: [],
        no: []
      };

      ratedActivities.forEach(activity => {
        const rating = modeRatings[activity.id]!;
        groupedByRating[rating].push(activity);
      });

      (['yes', 'maybe', 'meh', 'no'] as RatingValue[]).forEach(rating => {
        const activities = groupedByRating[rating];
        if (activities.length > 0) {
          lines.push(`  ${rating.toUpperCase()}: ${activities.map(a => a.texts.en.text).join(', ')}`);
        }
      });
    });

    lines.push('');
  });

  return lines.join('\n');
}