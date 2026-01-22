import type { ActivityDef } from '../types';
import { activitiesEn } from './activities-en';

export const activitiesEs: ActivityDef[] = activitiesEn.map(a => ({
  ...a,
  texts: {
    en: a.texts.en
  }
}));
