import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { categories } from '../data/categories';
import type {
  CustomCategory,
  Language,
  RatingValue,
  UserMeta,
  UserState
} from '../types';

type RatingMode = 'give' | 'receive';

type AppState = UserState & {
  setLang: (lang: Language) => void;
  setUserMeta: (userMeta: UserMeta) => void;
  setRating: (mode: RatingMode, activityId: string, rating: RatingValue) => void;
  setCustomCategories: (customCategories: CustomCategory[]) => void;
  addCustomCategory: (customCategory: CustomCategory) => void;
  setScreen: (screen: UserState['currentScreen']) => void;
  setCurrentCategory: (categoryId: string) => void;
  setCurrentActivityIndex: (index: number) => void;
  setTutorialSeen: (seen: boolean) => void;
  resetRatingsForMode: (mode: RatingMode) => void;
  resetState: () => void;
};

const getDefaultState = (): UserState => ({
  lang: 'en',
  userMeta: {
    mode: 'give',
    experience: 'newbie',
    agreedToTerms: false
  },
  ratings: {
    give: {},
    receive: {}
  },
  customCategories: [],
  currentScreen: 'welcome',
  currentCategory: categories[0]?.id ?? '',
  currentActivityIndex: 0,
  tutorialSeen: false
});

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      ...getDefaultState(),
      setLang: (lang) => set({ lang }),
      setUserMeta: (userMeta) => set({ userMeta }),
      setRating: (mode, activityId, rating) =>
        set((state) => ({
          ratings: {
            ...state.ratings,
            [mode]: {
              ...state.ratings[mode],
              [activityId]: rating
            }
          }
        })),
      setCustomCategories: (customCategories) => set({ customCategories }),
      addCustomCategory: (customCategory) =>
        set((state) => ({
          customCategories: [...state.customCategories, customCategory]
        })),
      setScreen: (currentScreen) => set({ currentScreen }),
      setCurrentCategory: (currentCategory) => set({ currentCategory }),
      setCurrentActivityIndex: (currentActivityIndex) => set({ currentActivityIndex }),
      setTutorialSeen: (tutorialSeen) => set({ tutorialSeen }),
      resetRatingsForMode: (mode) =>
        set((state) => ({
          ratings: {
            ...state.ratings,
            [mode]: {}
          }
        })),
      resetState: () => set(getDefaultState())
    }),
    {
      name: 'kinkswipe-state',
      storage: createJSONStorage(() => localStorage)
    }
  )
);
