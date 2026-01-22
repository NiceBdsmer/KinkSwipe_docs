# KinkSwipe - README

**KinkSwipe** is a privacy-first, mobile-first web app for exploring BDSM/kink preferences through Tinder-style swipe cards. No login, no backend, no database. Everything is saved locally to your browser's localStorage and shared via URL encoding.

## 🚀 Live Demo
https://kinkswipe.vercel.app

## ✨ Features

### Core Features
- ✅ **Tinder-style swipe interface** - 4-directional gestures for quick preference rating
  - Right swipe → **YES** (Green)
  - Up swipe → **MAYBE** (Blue)
  - Down swipe → **SKIP** (Gray)
  - Left swipe → **NOPE** (Red)
- ✅ **Tutorial card** - Visual guide showing swipe directions on first use
- ✅ **Role selection** - Give, Receive, or Both (two rounds)
- ✅ **Experience levels** - Newbie, Curious, Experienced
- ✅ **Safety warnings** - Tooltips for edge activities
- ✅ **Multi-language** - English (EN), Spanish (ES), Thai (TH)
- ✅ **Mobile-first design** - Optimized for touch gestures
- ✅ **Dark mode default** - Playful & sexy aesthetic

### Summary & Export
- ✅ **Visual summary** - Total counts and per-category breakdown
- ✅ **Shareable link** - LZ-string compressed URL
- ✅ **Text export** - Copy plain text summary
- ✅ **Image export** - PNG screenshot download
- ✅ **Load from link** - Decode and view others' lists

### Data & Performance
- ✅ **Lazy loading** - Activities load per category
- ✅ **IndexedDB cache** - Faster repeat visits
- ✅ **Compression utilities** - ~70% smaller ratings storage
- ✅ **Code splitting** - Optimized bundle size
- ✅ **Offline support** - Works without network after first load

## 🛠️ Tech Stack

- **Framework**: React 18 + Vite + TypeScript
- **State**: Zustand with localStorage persistence
- **Styles**: Tailwind CSS + shadcn/ui components
- **Animations**: Framer Motion + React Spring v9.7.5
- **Swipe**: react-tinder-card
- **Compression**: LZ-string
- **Export**: html2canvas
- **Deploy**: Vercel (static site)

## 📱 Screen Flow

1. **Welcome** - Start swiping, load link, select language
2. **Onboarding** - Role → Experience → Safety
3. **Swipe** - Rate activities by category
4. **Summary** - View results and export
5. **Load From Link** - View someone else's list

## 🎨 Design Principles

- 🔒 **Privacy First** - 100% client-side, no data sent to servers
- 📱 **Mobile-First** - Touch-optimized, large tap targets, vertical layout
- 🌈 **Inclusive & Non-judgmental** - Neutral language, flexible roles
- 🎮 **Playful but Responsible** - Sexy aesthetic, safety warnings for edge activities
- 🌍 **Multi-language** - EN/ES/TH built from ground up

## 📦 Project Structure

```
kinkswipe/
├── src/
│   ├── components/        # React components
│   │   ├── ui/         # shadcn/ui components
│   │   ├── ActionButtons.tsx
│   │   ├── FooterNavigation.tsx
│   │   ├── FooterControls.tsx
│   │   ├── Header.tsx
│   │   ├── SwipeCard.tsx
│   │   └── TutorialCard.tsx
│   ├── screens/          # Main screens
│   │   ├── Welcome.tsx
│   │   ├── Onboarding.tsx
│   │   ├── CategorySelection.tsx
│   │   ├── SwipeScreen.tsx
│   │   ├── SummaryScreen.tsx
│   │   └── LoadFromLink.tsx
│   ├── store/           # Zustand store
│   │   └── useAppStore.ts
│   ├── data/            # Activity data
│   │   ├── activities-en/  # Split by category (Phase 1)
│   │   ├── activities-es.ts
│   │   ├── activities-th.ts
│   │   └── categories.ts
│   ├── utils/           # Utilities
│   │   ├── ActivityLoader.ts  # Lazy loading (Phase 1)
│   │   ├── compression.ts      # Rating compression (Phase 3)
│   │   ├── storage.ts         # Storage utilities (Phase 3)
│   │   ├── getActivities.ts
│   │   ├── encodePayload.ts
│   │   ├── decodePayload.ts
│   │   ├── exportText.ts
│   │   ├── exportImage.ts
│   │   └── generateShareLink.ts
│   ├── db/              # IndexedDB (Phase 2)
│   │   └── indexedDB.ts
│   ├── i18n/            # Translations
│   │   ├── strings-en.ts
│   │   ├── strings-es.ts
│   │   ├── strings-th.ts
│   │   └── useTranslation.ts
│   ├── types/            # TypeScript types
│   │   └── index.ts
│   ├── App.tsx
│   └── main.tsx
├── tests/               # Test files
├── public/              # Static assets
└── package.json
```

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm run test

# Build for production
npm run build

# Lint code
npm run lint

# Type check
npx tsc --noEmit
```

## 📊 Performance Metrics

- **Initial bundle**: ~84KB (activities)
- **Total bundle (gzipped)**: ~70KB for main app
- **Time to Interactive**: < 2s on 3G
- **Categories**: 9 default + custom
- **Activities**: 162+ activities
- **Languages**: 3 (EN, ES, TH)

## 🔄 Recent Changes (2026-01-23)

### Bug Fixes
- ✅ Fixed tutorial card not loading actual activity after dismissal
- ✅ Fixed activities-en.ts to properly import and export all category activities
- ✅ Added loading state when activities are unavailable
- ✅ Fixed footer button duplication on swipe screen
- ✅ FooterNavigation now properly hidden on relevant screens

### Storage Improvements
- ✅ **Phase 1**: Activities split by category into separate files
- ✅ **Phase 1**: Created ActivityLoader utility for lazy loading
- ✅ **Phase 2**: Implemented IndexedDB integration for activity cache
- ✅ **Phase 2**: Added custom categories CRUD operations
- ✅ **Phase 2**: Implemented ratings storage in IndexedDB
- ✅ **Phase 3**: Created compression utilities for ratings (~70% size reduction)
- ✅ **Phase 3**: Implemented compressed rating storage format

### Test Improvements
- ✅ All 13 SwipeScreen tests passing
- ✅ Fixed accessibility labels on action buttons
- ✅ Updated test queries to handle multiple buttons
- ✅ Build and lint verified

## 📝 License

KinkSwipe is a closed-source project. Contact nicebdsmer@gmail.com for licensing or collaboration.

## 👥 Contributing

For bug reports or feature requests, please contact nicebdsmer@gmail.com.
