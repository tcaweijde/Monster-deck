import { AnimatePresence, motion, type Variants } from 'framer-motion';
import { useBoardStore } from './store/boardStore';
import { useWildHuntStore } from './store/wildHuntStore';
import { useLegendaryHuntStore } from './store/legendaryHuntStore';
import { useEncounterStore } from './store/encounterStore';
import { useTrailStore } from './store/trailStore';
import { BoardWelcomeScreen } from './components/board/BoardWelcomeScreen';
import { BoardScreen } from './components/board/BoardScreen';
import { EncounterScreen } from './components/encounter/EncounterScreen';
import { WildHuntSetupScreen } from './components/wildHunt/WildHuntSetupScreen';
import { WildHuntBoardScreen } from './components/wildHunt/WildHuntBoardScreen';
import { WildHuntMonstersScreen } from './components/wildHunt/WildHuntMonstersScreen';
import { ProximitySetupScreen } from './components/wildHunt/ProximitySetupScreen';
import { WildHuntEncounterScreen } from './components/wildHunt/WildHuntEncounterScreen';
import { WildHuntVictoryScreen } from './components/wildHunt/WildHuntVictoryScreen';
import { WildHuntDefeatScreen } from './components/wildHunt/WildHuntDefeatScreen';
import { LegendaryHuntSetupScreen } from './components/legendaryHunt/LegendaryHuntSetupScreen';
import { LegendaryHuntBoardScreen } from './components/legendaryHunt/LegendaryHuntBoardScreen';
import { BossFightPrepScreen } from './components/legendaryHunt/BossFightPrepScreen';
import { LegendaryEncounterScreen } from './components/legendaryHunt/LegendaryEncounterScreen';
import { LegendaryHuntVictoryScreen } from './components/legendaryHunt/LegendaryHuntVictoryScreen';
import { LegendaryHuntDefeatScreen } from './components/legendaryHunt/LegendaryHuntDefeatScreen';
import { TrailTokenPlacementScreen } from './components/trail/TrailTokenPlacementScreen';

const slideUp: Variants = {
  initial: { y: '100%', opacity: 0 },
  animate: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 320, damping: 32 } },
  exit:    { y: '100%', opacity: 0, transition: { duration: 0.25, ease: 'easeIn' } },
};

export default function App() {
  const board = useBoardStore((s) => s.board);
  const activeSlotIndex = useBoardStore((s) => s.activeSlotIndex);
  const wildHuntPhase = useWildHuntStore((s) => s.phase);
  const legendaryPhase = useLegendaryHuntStore((s) => s.phase);
  const showMonsters = useWildHuntStore((s) => s.showMonsters);
  const showProximitySetup = useWildHuntStore((s) => s.showProximitySetup);
  const activeWildHuntSlotIndex = useWildHuntStore((s) => s.activeWildHuntSlotIndex);
  const encounterPhase = useEncounterStore((s) => s.phase);

  const trailModeEnabled = useTrailStore((s) => s.trailModeEnabled);
  const weaknessTokenBoard = useTrailStore((s) => s.weaknessTokenBoard);
  const placementConfirmed = useTrailStore((s) => s.placementConfirmed);
  const trailPlacementPending =
    trailModeEnabled &&
    weaknessTokenBoard.length > 0 &&
    placementConfirmed.length < weaknessTokenBoard.length;

  const inLH = legendaryPhase !== 'inactive';
  const inWH = wildHuntPhase !== 'inactive';

  const screen = inLH
    ? legendaryPhase === 'setup'
      ? 'lh-setup'
      : legendaryPhase === 'victory'
        ? 'lh-victory'
        : legendaryPhase === 'defeat'
          ? 'lh-defeat'
          : legendaryPhase === 'bossPrep'
            ? 'lh-boss-prep'
            : legendaryPhase === 'bossFight' && encounterPhase !== 'setup'
              ? 'lh-boss'
              : activeSlotIndex !== null
                ? 'encounter'
                : trailPlacementPending
                  ? 'trail-placement'
                  : 'lh-board'
    : inWH
    ? wildHuntPhase === 'setup'
      ? 'wh-setup'
      : wildHuntPhase === 'victory'
        ? 'wh-victory'
        : wildHuntPhase === 'defeat'
          ? 'wh-defeat'
          : wildHuntPhase === 'finalBattle' && encounterPhase !== 'setup'
            ? 'wh-boss'
            : activeWildHuntSlotIndex !== null
              ? showProximitySetup ? 'wh-proximity' : 'encounter'
              : showMonsters
                ? 'wh-monsters'
                : 'wh-board'
    : (!board
        ? 'welcome'
        : trailPlacementPending
          ? 'trail-placement'
          : activeSlotIndex !== null
            ? 'encounter'
            : 'board');

  return (
    <div className="relative w-full h-dvh overflow-hidden">
      <AnimatePresence mode="sync">
        {screen !== 'encounter' && screen !== 'wh-boss' && screen !== 'lh-boss' && (
          <motion.div
            key="board"
            className="absolute inset-0"
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
          >
            {screen === 'welcome' && <BoardWelcomeScreen />}
            {screen === 'board' && <BoardScreen />}
            {screen === 'trail-placement' && <TrailTokenPlacementScreen />}
            {screen === 'wh-setup' && <WildHuntSetupScreen />}
            {screen === 'wh-board' && <WildHuntBoardScreen />}
            {screen === 'wh-monsters' && <WildHuntMonstersScreen />}
            {screen === 'wh-proximity' && <ProximitySetupScreen />}
            {screen === 'wh-victory' && <WildHuntVictoryScreen />}
            {screen === 'wh-defeat' && <WildHuntDefeatScreen />}
            {screen === 'lh-setup' && <LegendaryHuntSetupScreen />}
            {screen === 'lh-board' && <LegendaryHuntBoardScreen />}
            {screen === 'lh-boss-prep' && <BossFightPrepScreen />}
            {screen === 'lh-victory' && <LegendaryHuntVictoryScreen />}
            {screen === 'lh-defeat' && <LegendaryHuntDefeatScreen />}
          </motion.div>
        )}

        {(screen === 'encounter' || screen === 'wh-boss' || screen === 'lh-boss') && (
          <motion.div
            key="encounter"
            className="absolute inset-0"
            variants={slideUp}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            {screen === 'wh-boss' ? <WildHuntEncounterScreen /> : screen === 'lh-boss' ? <LegendaryEncounterScreen /> : <EncounterScreen />}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
