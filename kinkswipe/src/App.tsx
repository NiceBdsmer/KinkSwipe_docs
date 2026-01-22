import { lazy, Suspense } from 'react';
import { Toaster } from 'sonner';
import { FooterNavigation } from './components/FooterNavigation';
import { useAppStore } from './store/useAppStore';

// Lazy load heavy screens
const Welcome = lazy(() => import('./screens/Welcome').then(module => ({ default: module.Welcome })));
const Onboarding = lazy(() => import('./screens/Onboarding').then(module => ({ default: module.Onboarding })));
const CategorySelection = lazy(() => import('./screens/CategorySelection').then(module => ({ default: module.CategorySelection })));
const SwipeScreen = lazy(() => import('./screens/SwipeScreen').then(module => ({ default: module.SwipeScreen })));
const SummaryScreen = lazy(() => import('./screens/SummaryScreen').then(module => ({ default: module.SummaryScreen })));
const LoadFromLink = lazy(() => import('./screens/LoadFromLink').then(module => ({ default: module.LoadFromLink })));

function App() {
  const currentScreen = useAppStore((state) => state.currentScreen);

  const renderScreen = () => {
    switch (currentScreen) {
      case 'welcome':
        return <Welcome />;
      case 'onboarding':
        return <Onboarding />;
      case 'category-selection':
        return <CategorySelection />;
      case 'swipe':
        return <SwipeScreen />;
      case 'summary':
        return <SummaryScreen />;
      case 'load':
        return <LoadFromLink />;
      default:
        return <Welcome />;
    }
  };

  return (
    <>
      <Suspense fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      }>
        {renderScreen()}
      </Suspense>
      <FooterNavigation />
      <Toaster position="top-center" richColors />
    </>
  );
}

export default App;