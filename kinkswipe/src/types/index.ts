export type RatingValue = 'yes' | 'maybe' | 'skip' | 'no';

export type UserMode = 'give' | 'receive' | 'both';

export type ExperienceLevel = 'newbie' | 'curious' | 'experienced';

export type Language = 'en' | 'es' | 'th';

export interface LocalizedText {
  text: string;
  desc: string;
}

export interface ActivityDef {
  id: string;
  categoryId: string;
  edge?: boolean;
  texts: {
    en: LocalizedText;
    es?: LocalizedText;
    th?: LocalizedText;
  };
}

export interface CategoryDef {
  id: string;
  // name is optional as it might be handled by i18n for built-ins
  name?: string;
}

export interface CustomActivity {
  id: string;
  text: string;
  desc?: string;
  edge?: boolean;
}

export interface CustomCategory {
  id: string;
  name: string;
  activities: CustomActivity[];
}

export interface UserRatings {
  [activityId: string]: RatingValue;
}

export interface UserMeta {
  mode: UserMode;
  experience: ExperienceLevel;
  agreedToTerms?: boolean;
}

export interface UserState {
  lang: Language;
  userMeta: UserMeta;
  ratings: {
    give: UserRatings;
    receive: UserRatings;
  };
  customCategories: CustomCategory[];
  // UI State for persistence
  currentScreen: 'welcome' | 'onboarding' | 'category-selection' | 'swipe' | 'summary' | 'load';
  currentCategory: string;
  currentActivityIndex: number;
  tutorialSeen: boolean;
}
