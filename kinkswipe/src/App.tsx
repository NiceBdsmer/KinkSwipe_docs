import { Welcome } from './screens/Welcome';
import { Onboarding } from './screens/Onboarding';
import { SwipeScreen } from './screens/SwipeScreen';
import { SummaryScreen } from './screens/SummaryScreen';
import { useAppStore } from './store/useAppStore';

function App() {
  const currentScreen = useAppStore((state) => state.currentScreen);

  switch (currentScreen) {
    case 'welcome':
      return <Welcome />;
    case 'onboarding':
      return <Onboarding />;
    case 'swipe':
      return <SwipeScreen />;
    case 'summary':
      return <SummaryScreen />;
    case 'load':
      // TODO: Implement LoadFromLink screen in Phase D
      return <div>Load from Link - Coming Soon</div>;
    default:
      return <Welcome />;
  }
}

export default App;