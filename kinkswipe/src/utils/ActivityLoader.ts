import type { Language } from '../types';
import type { ActivityDef } from '../types';
import { indexedDB } from '../db/indexedDB';

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
    const cachedActivities = await indexedDB.getActivities(categoryId, lang);

    if (cachedActivities && cachedActivities.length > 0) {
      activityCache.set(cacheKey, cachedActivities);
      console.log(`Loaded ${cachedActivities.length} activities from IndexedDB cache for ${categoryId}`);
      return cachedActivities;
    }

    const module = await import(`../data/activities-${lang}/${categoryId}.ts`) as ActivityModule;
    const activities = module.activities;

    activityCache.set(cacheKey, activities);

    await indexedDB.cacheActivities(activities, lang);
    console.log(`Cached ${activities.length} activities in IndexedDB for ${categoryId}`);

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
  console.log('Activity memory cache cleared');
}

export function preloadCategories(categoryIds: string[], lang: Language): void {
  categoryIds.forEach(categoryId => {
    loadCategoryActivities(categoryId, lang).catch(console.error);
  });
  console.log(`Preloading ${categoryIds.length} categories`);
}

export function getActivityCache() {
  return activityCache;
}

export async function warmUpCache(lang: Language = 'en'): Promise<void> {
  console.log('Warming up activity cache...');
  const { categories } = await import('../data/categories');
  const categoryIds = categories.map(c => c.id);
  await Promise.all(categoryIds.map(catId => loadCategoryActivities(catId, lang)));
  console.log('Cache warm-up complete');
}
