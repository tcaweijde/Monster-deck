import { useEncounterStore } from './store/encounterStore';
import { SetupScreen } from './components/setup/SetupScreen';
import { EncounterScreen } from './components/encounter/EncounterScreen';

export default function App() {
  const phase = useEncounterStore((s) => s.phase);

  return phase === 'setup' ? <SetupScreen /> : <EncounterScreen />;
}
