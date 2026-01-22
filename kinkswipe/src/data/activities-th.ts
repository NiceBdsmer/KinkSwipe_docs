import type { ActivityDef } from '../types';
import { activitiesEn } from './activities-en';

export const activitiesTh: ActivityDef[] = activitiesEn.map((activity) => ({
  ...activity,
  texts: {
    ...activity.texts,
    th: activity.texts.en
  }
}));
