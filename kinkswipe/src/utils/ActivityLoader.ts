import type { Language } from '../types';
import type { ActivityDef } from '../types';

interface ActivityModule {
  activities: ActivityDef[];
}

let activityCache = new Map<string, ActivityDef[]>();

export async function loadCategoryActivities(
  categoryId: string,
  lang: Language
): Promise<ActivityDef[]> {
  const cacheKey = `${lang}-${categoryId}`;

  if (activityCache.has(cacheKey)) {
    return activityCache.get(cacheKey)!;
  }

  try {
    const module = await import(`../data/activities-${lang}/${categoryId}.ts`) as ActivityModule;
    const activities = module.activities;
    activityCache.set(cacheKey, activities);
    return activities;
  } catch (error) {
    console.error(`Failed to load activities for ${categoryId} in ${lang}:`, error);
    return [];
  }
}

export async function loadAllActivities(lang: Language): Promise<ActivityDef[]> {
  const { categories } = await import('../data/categories');
  const activities: ActivityDef[] = [];

  for (const category of categories) {
    const categoryActivities = await loadCategoryActivities(category.id, lang);
    activities.push(...categoryActivities);
  }

  return activities;
}

export function clearActivityCache(): void {
  activityCache.clear();
}

export function preloadCategories(categoryIds: string[], lang: Language): void {
  categoryIds.forEach(categoryId => {
    loadCategoryActivities(categoryId, lang).catch(console.error);
  });
}
