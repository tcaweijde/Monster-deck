import { useBoardStore } from './store/boardStore';
import { BoardWelcomeScreen } from './components/board/BoardWelcomeScreen';
import { BoardScreen } from './components/board/BoardScreen';
import { EncounterScreen } from './components/encounter/EncounterScreen';

export default function App() {
  const board = useBoardStore((s) => s.board);
  const activeSlotIndex = useBoardStore((s) => s.activeSlotIndex);

  if (!board) return <BoardWelcomeScreen />;
  if (activeSlotIndex !== null) return <EncounterScreen />;
  return <BoardScreen />;
}
