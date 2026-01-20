import type { RatingValue, UserMode, UserState } from './index';

// This file is just to verify types compile correctly.
// It won't be executed at runtime.

const _testRating: RatingValue = 'yes';
const _testMode: UserMode = 'give';

const _testState: UserState = {
  lang: 'en',
  userMeta: {
    mode: 'both',
    experience: 'curious',
    agreedToTerms: true
  },
  ratings: {
    give: { 'act1': 'yes' },
    receive: {}
  },
  customCategories: [],
  currentScreen: 'welcome',
  currentCategory: 'cat1',
  currentActivityIndex: 0
};

export default { _testRating, _testMode, _testState };
