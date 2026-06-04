import { AnimatePresence, motion, type Variants } from 'framer-motion';
import { useBoardStore } from './store/boardStore';
import { useWildHuntStore } from './store/wildHuntStore';
import { BoardWelcomeScreen } from './components/board/BoardWelcomeScreen';
import { BoardScreen } from './components/board/BoardScreen';
import { EncounterScreen } from './components/encounter/EncounterScreen';
import { WildHuntSetupScreen } from './components/wildHunt/WildHuntSetupScreen';
import { WildHuntBoardScreen } from './components/wildHunt/WildHuntBoardScreen';

const slideUp: Variants = {
  initial: { y: '100%', opacity: 0 },
  animate: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 320, damping: 32 } },
  exit:    { y: '100%', opacity: 0, transition: { duration: 0.25, ease: 'easeIn' } },
};

export default function App() {
  const board = useBoardStore((s) => s.board);
  const activeSlotIndex = useBoardStore((s) => s.activeSlotIndex);
  const wildHuntPhase = useWildHuntStore((s) => s.phase);

  const inWildHunt = wildHuntPhase !== 'inactive';
  const screen = inWildHunt
    ? (wildHuntPhase === 'setup' ? 'wh-setup' : activeSlotIndex !== null ? 'encounter' : 'wh-board')
    : (!board ? 'welcome' : activeSlotIndex !== null ? 'encounter' : 'board');

  return (
    <div className="relative w-full h-dvh overflow-hidden">
      <AnimatePresence mode="sync">
        {screen !== 'encounter' && (
          <motion.div
            key="board"
            className="absolute inset-0"
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
          >
            {screen === 'welcome' && <BoardWelcomeScreen />}
            {screen === 'board' && <BoardScreen />}
            {screen === 'wh-setup' && <WildHuntSetupScreen />}
            {screen === 'wh-board' && <WildHuntBoardScreen />}
          </motion.div>
        )}

        {screen === 'encounter' && (
          <motion.div
            key="encounter"
            className="absolute inset-0"
            variants={slideUp}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <EncounterScreen />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
