import { activitiesEn } from '../data/activities-en';
import { activitiesEs } from '../data/activities-es';
import { activitiesTh } from '../data/activities-th';
import type { ActivityDef, Language } from '../types';

const activitiesMap: Record<Language, ActivityDef[]> = {
  en: activitiesEn,
  es: activitiesEs,
  th: activitiesTh
};

export function getActivities(lang: Language): ActivityDef[] {
  return activitiesMap[lang] ?? activitiesEn;
}

export function getActivityText(activity: ActivityDef, lang: Language) {
  return activity.texts[lang] ?? activity.texts.en;
}