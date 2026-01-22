import { Welcome } from './screens/Welcome';
import { Onboarding } from './screens/Onboarding';
import { CategorySelection } from './screens/CategorySelection';
import { SwipeScreen } from './screens/SwipeScreen';
import { SummaryScreen } from './screens/SummaryScreen';
import { LoadFromLink } from './screens/LoadFromLink';
import { FooterNavigation } from './components/FooterNavigation';
import { useAppStore } from './store/useAppStore';

function App() {
  const currentScreen = useAppStore((state) => state.currentScreen);

  return (
    <>
      {(() => {
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
      })()}
      <FooterNavigation />
    </>
  );
}

export default App;