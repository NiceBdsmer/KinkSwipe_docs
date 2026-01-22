# PRD — KinkSwipe

## Project Overview
KinkSwipe es una web app **100% client-side, privacy-first** para explorar preferencias BDSM/kink mediante swipe cards tipo Tinder. Sin login, sin backend, sin base de datos. Todo se guarda en localStorage y se comparte via URL encoding.

## Tech Stack (100% Gratis - Deploy en Vercel)
- **Framework**: React 18 + Vite + TypeScript
- **Estado**: Zustand (persistencia en localStorage)
- **Estilos**: Tailwind CSS + shadcn/ui
- **Swipe**: react-tinder-card
- **Animaciones**: Framer Motion
- **Compresion URL**: lz-string
- **Export**: html2canvas (PNG)
- **Deploy**: Vercel (static site)
- **Package Manager**: pnpm

## Design Decisions
- Dark mode por defecto (estetica playful & sexy)
- Mobile-first (swipe optimizado para pulgar)
- 4 direcciones de swipe: Right=YES, Up=MAYBE, Down=MEH, Left=NOPE
- Roles: Give / Receive / Both (dos rondas)
- Multi-idioma: EN / ES / TH
- Zero tracking, zero cookies de terceros

## Tasks

### Phase 0: Project Setup
- [x] Create Vite project with React and TypeScript using pnpm create vite@latest kinkswipe --template react-ts
- [x] Install dependencies: pnpm add zustand tailwindcss postcss autoprefixer framer-motion react-tinder-card lz-string html2canvas
- [x] Initialize Tailwind CSS with pnpm dlx tailwindcss init -p and configure tailwind.config.js for dark mode class strategy
- [x] Install shadcn/ui with pnpm dlx shadcn@latest init, select dark theme, slate color, and src/components/ui path
- [x] Add shadcn components: button, card, dialog, accordion, tooltip, progress, select, checkbox
- [x] Create folder structure: src/components, src/screens, src/store, src/data, src/utils, src/i18n, src/types
- [x] Create src/types/index.ts with TypeScript types: RatingValue, UserMode, ExperienceLevel, UserState, ActivityDef, CategoryDef, CustomCategory
- [x] Configure Vercel deployment by creating vercel.json with rewrites for SPA routing

### Phase 1: Data Layer
- [x] Create src/data/categories.ts with CategoryDef array containing 8 categories: bondage, impact, sensory, power-exchange, edge, sexual, fetishes, humiliation
- [x] Create src/data/activities-en.ts with 150+ ActivityDef objects covering all categories, each with id, categoryId, edge flag, and texts.en with text and desc
- [x] Create src/data/activities-es.ts with Spanish translations for all activities
- [x] Create src/data/activities-th.ts with Thai translations for all activities
- [x] Create src/store/useAppStore.ts with Zustand store containing: lang, userMeta, ratings (give/receive), customCategories, currentScreen, currentCategory, currentActivityIndex
- [x] Add Zustand persist middleware to save state to localStorage with key kinkswipe-state
- [x] Create src/utils/encodePayload.ts function that compresses UserState to base64 string using lz-string compressToEncodedURIComponent
- [x] Create src/utils/decodePayload.ts function that decompresses base64 string back to UserState using lz-string decompressFromEncodedURIComponent

### Phase 2: i18n System
- [x] Create src/i18n/strings-en.ts with all UI strings in English: welcome, onboarding, swipe, summary, buttons, tooltips
- [x] Create src/i18n/strings-es.ts with Spanish translations of all UI strings
- [x] Create src/i18n/strings-th.ts with Thai translations of all UI strings
- [x] Create src/i18n/useTranslation.ts hook that returns t function based on current lang from store
- [x] Create src/components/LanguageSwitcher.tsx with EN/ES/TH toggle buttons that update store lang

### Phase 3: Core Components
- [x] Create src/components/Header.tsx with back button, category name, and progress indicator showing X/Y in category and Z% total
- [x] Create src/components/SwipeCard.tsx using react-tinder-card with category chip, activity title, description, and edge warning icon with tooltip
- [x] Add swipe overlay labels to SwipeCard: YES (green right), MAYBE (blue up), MEH (gray down), NOPE (red left)
- [x] Create src/components/ActionButtons.tsx with 4 buttons below card: NOPE, MEH, MAYBE, YES with icons and colors
- [x] Create src/components/CategoryProgress.tsx showing visual progress bar for current category
- [x] Create src/components/EdgeWarning.tsx tooltip component showing safety info for edge activities
- [x] Create src/components/SummaryCard.tsx displaying counts for YES/MAYBE/MEH/NOPE with colored badges

### Phase 4: Screens - Welcome and Onboarding
- [x] Create src/screens/Welcome.tsx with logo, tagline, Start Swiping button, Load Link button, and LanguageSwitcher
- [x] Create src/screens/Onboarding.tsx as multi-step wizard with 3 steps using local state
- [x] Build onboarding step 1: role selection with 3 cards - As Giver, As Receiver, Both (two rounds)
- [x] Build onboarding step 2: experience level with 3 options - Newbie, Curious, Experienced
- [x] Build onboarding step 3: safety disclaimer text with I Understand checkbox and continue button
- [x] Add navigation between steps with back button and progress dots indicator
- [x] On complete, save userMeta to store and navigate to SwipeScreen
- [x] Write unit tests for Welcome.tsx component
- [x] Write unit tests for Onboarding.tsx component
- [x] Write E2E tests for complete onboarding flow (role selection → experience → safety → swipe screen)
- [x] Run tests and lint, then merge to master

### Phase 5: Swipe Screen
- [x] Create src/screens/SwipeScreen.tsx with Header, SwipeCard stack, and ActionButtons
- [x] Implement swipe handler that maps direction to rating: right=yes, up=maybe, down=tolerate, left=no
- [x] Save rating to store.ratings[currentMode][activityId] on each swipe
- [x] Advance to next activity after swipe, move to next category when current is complete
- [x] Add Skip Category button that marks all remaining activities in category as undefined and moves to next
- [x] When all categories complete in Give mode and userMeta.mode is both, show RoundComplete dialog asking to continue as Receiver
- [x] When all categories complete (or user declines second round), navigate to SummaryScreen
- [x] Write unit tests for SwipeScreen.tsx component
- [x] Write unit tests for swipe handler logic (direction to rating mapping)
- [x] Write E2E tests for complete swipe flow (all activities → category change → summary)
- [x] Run tests and lint, then merge to master

### Phase 6: Summary Screen
- [x] Create src/screens/SummaryScreen.tsx with global stats panel and category accordion
- [x] Build global stats showing total counts: You said YES to X, MAYBE to Y, MEH to Z, NOPE to W
- [x] Build category accordion using shadcn Accordion, each section shows category name and expandable content
- [x] Inside each accordion item, show 4 lists grouped by rating: YES activities, MAYBE activities, MEH activities, NOPE activities
- [x] Add floating action buttons for: Copy Link, Copy Text, Download Image, Add Custom
- [x] If mode was Both, show tabs or toggle to switch between viewing Give ratings and Receive ratings
- [x] Write unit tests for SummaryScreen.tsx component
- [ ] Write unit tests for category accordion expansion/collapse logic
- [ ] Write E2E tests for summary display (all activities grouped correctly)
- [ ] Run tests and lint, then merge to master

### Phase 7: Share and Export
- [ ] Create src/utils/generateShareLink.ts that builds URL with encoded payload as query param d
- [ ] Implement Copy Link button using navigator.clipboard.writeText with the generated share URL
- [ ] Implement native share using navigator.share API when available on mobile devices
- [ ] Create src/utils/exportText.ts that generates plain text summary grouped by category and rating
- [ ] Implement Copy Text button that copies the text summary to clipboard
- [ ] Create src/utils/exportImage.ts using html2canvas to capture summary view as PNG
- [ ] Implement Download Image button that triggers PNG download with filename kinkswipe-results.png
- [ ] Write unit tests for generateShareLink.ts, exportText.ts, exportImage.ts
- [ ] Write integration tests for share/export flow (encode → clipboard/download)
- [ ] Run tests and lint, then merge to master

### Phase 8: Load From Link
- [ ] Create src/screens/LoadFromLink.tsx with text input for pasting a share link
- [ ] Parse URL query param d and decode payload using decodePayload utility
- [ ] Validate decoded data has correct version and structure before loading
- [ ] Display loaded data in read-only SummaryScreen variant with banner showing This is someone elses list
- [ ] Add button to Start your own that clears loaded data and goes to onboarding
- [ ] Write unit tests for LoadFromLink.tsx component
- [ ] Write integration tests for URL parsing and payload validation
- [ ] Write E2E tests for load from link flow (valid URL → load → start own)
- [ ] Run tests and lint, then merge to master

### Phase 9: Custom Categories and Activities
- [ ] Create src/components/AddCategoryDialog.tsx with form: category name input and save button
- [ ] Create src/components/AddActivityDialog.tsx with form: activity text, description, edge checkbox, and save button
- [ ] Add custom categories and activities to store.customCategories array
- [ ] Include custom categories in swipe flow after built-in categories
- [ ] Include custom data in share payload encoding
- [ ] Write unit tests for AddCategoryDialog.tsx and AddActivityDialog.tsx
- [ ] Write integration tests for custom categories/activities (create → swipe → share)
- [ ] Run tests and lint, then merge to master

### Phase 10: Polish and Deploy
- [ ] Add loading skeleton components for async operations
- [ ] Add subtle animations for card enter/exit using Framer Motion
- [ ] Add haptic feedback on swipe using navigator.vibrate when available
- [ ] Write unit tests for skeleton components
- [ ] Write E2E tests for complete flow: Welcome to Onboarding to Swipe to Summary to Share
- [ ] Write E2E tests for Load From Link flow with valid and invalid URLs
- [ ] Test on mobile devices for swipe gesture responsiveness
- [x] Create vercel.json with rewrites rule to serve index.html for all routes
- [ ] Deploy to Vercel and verify production build works correctly
