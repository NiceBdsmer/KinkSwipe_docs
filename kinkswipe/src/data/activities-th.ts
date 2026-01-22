import type { ActivityDef } from '../types';
import { activitiesEn } from './activities-en';

export const activitiesTh: ActivityDef[] = activitiesEn.map(a => ({
  ...a,
  texts: {
    en: a.texts.en
  }
}));
