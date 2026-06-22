import { useWildHuntStore } from '../store/wildHuntStore';
import { useBoardStore } from '../store/boardStore';
import { useEncounterStore } from '../store/encounterStore';
import { useTrailStore } from '../store/trailStore';

/**
 * Adapts quit and victory encounter callbacks to the active game mode
 * (Wild Hunt vs. base game), keeping the branching out of EncounterScreen.
 */
export function useEncounterHandlers() {
  const wildHuntPhase = useWildHuntStore((s) => s.phase);
  const activeWildHuntSlotIndex = useWildHuntStore((s) => s.activeWildHuntSlotIndex);
  const wildHuntSlots = useWildHuntStore((s) => s.wildHuntSlots);
  const clearActiveWildHuntSlot = useWildHuntStore((s) => s.clearActiveWildHuntSlot);
  const defeatWildHuntSlot = useWildHuntStore((s) => s.defeatWildHuntSlot);
  const absorbDamage = useWildHuntStore((s) => s.absorbDamage);

  const boardActiveSlotIndex = useBoardStore((s) => s.activeSlotIndex);
  const boardSlots = useBoardStore((s) => s.board?.slots);
  const handleBoardVictory = useBoardStore((s) => s.handleVictory);
  const clearActiveSlot = useBoardStore((s) => s.clearActiveSlot);

  const resetToSetup = useEncounterStore((s) => s.resetToSetup);

  const trailModeEnabled = useTrailStore((s) => s.trailModeEnabled);
  const handleTrailVictoryReset = useTrailStore((s) => s.handleVictoryReset);

  const inWildHunt = wildHuntPhase !== 'inactive';

  const displayLevel: number | null = inWildHunt
    ? (activeWildHuntSlotIndex !== null
        ? (wildHuntSlots[activeWildHuntSlotIndex]?.level ?? null)
        : null)
    : (boardActiveSlotIndex !== null
        ? (boardSlots?.[boardActiveSlotIndex]?.level ?? null)
        : null);

  const quitEncounter = () => {
    if (inWildHunt) clearActiveWildHuntSlot();
    else clearActiveSlot();
    resetToSetup();
  };

  const completeEncounter = () => {
    if (inWildHunt && activeWildHuntSlotIndex !== null) {
      const level = wildHuntSlots[activeWildHuntSlotIndex]?.level ?? 1;
      absorbDamage(level);
      defeatWildHuntSlot(activeWildHuntSlotIndex);
    } else {
      const defeatedTerrainType = boardActiveSlotIndex !== null
        ? boardSlots?.[boardActiveSlotIndex]?.locationType
        : undefined;
      handleBoardVictory();
      if (trailModeEnabled) handleTrailVictoryReset(defeatedTerrainType);
    }
    resetToSetup();
  };

  return { displayLevel, inWildHunt, quitEncounter, completeEncounter };
}
