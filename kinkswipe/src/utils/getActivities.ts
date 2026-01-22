import { activitiesEn } from '../data/activities-en';
import { activitiesEs } from '../data/activities-es';
import { activitiesTh } from '../data/activities-th';
import { loadCategoryActivities, preloadCategories, getActivityCache } from './ActivityLoader';
import type { ActivityDef, Language } from '../types';

const activitiesMap: Record<Language, ActivityDef[]> = {
  en: activitiesEn,
  es: activitiesEs,
  th: activitiesTh
};

export function getActivities(lang: Language): ActivityDef[] {
  return activitiesMap[lang] ?? activitiesEn;
}

export function getCategoryActivities(categoryId: string, lang: Language): ActivityDef[] {
  const allActivities = getActivities(lang);
  return allActivities.filter(a => a.categoryId === categoryId);
}

export async function getLazyCategoryActivities(categoryId: string, lang: Language): Promise<ActivityDef[]> {
  return loadCategoryActivities(categoryId, lang);
}

export async function preloadAllCategories(lang: Language): Promise<void> {
  const { categories } = await import('../data/categories');
  preloadCategories(categories.map((c: any) => c.id), lang);
}

export function getActivityText(activity: ActivityDef, lang: Language) {
  return activity.texts[lang] ?? activity.texts.en;
}

export function getActivityCacheState() {
  return getActivityCache();
}

export async function clearActivityCache(): Promise<void> {
  const { clearActivityCache: clearCache } = await import('./ActivityLoader');
  clearCache();
}
