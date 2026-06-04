import { useBoardStore } from '../../store/boardStore';
import { useEncounterStore } from '../../store/encounterStore';
import { useWildHuntStore } from '../../store/wildHuntStore';
import { MONSTERS } from '../../data/monsters';
import { BoardSlotCard } from '../board/BoardSlotCard';

/**
 * Monster board sub-screen within the Wild Hunt game mode.
 * Shows the 3 board slots and allows starting encounters, but navigates
 * back to the Wild Hunt board screen instead of ending the game.
 */
export function WildHuntMonstersScreen() {
  const board = useBoardStore((s) => s.board);
  const setActiveSlot = useBoardStore((s) => s.setActiveSlot);
  const startEncounter = useEncounterStore((s) => s.startEncounter);
  const setShowMonsters = useWildHuntStore((s) => s.setShowMonsters);

  if (!board) return null;

  const getMonsterName = (id: string) =>
    MONSTERS.find((m) => m.id === id)?.name ?? id;

  const handleSlotTap = (index: 0 | 1 | 2) => {
    const slot = board.slots[index];
    setActiveSlot(index);
    startEncounter(slot.monsterId);
  };

  return (
    <div className="h-dvh flex flex-col p-6 gap-4 max-w-lg mx-auto overflow-hidden">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-amber-500">Board</h1>
        <button
          onClick={() => setShowMonsters(false)}
          className="text-sm text-stone-400 hover:text-amber-400 transition-colors"
        >
          ← Back to Run
        </button>
      </div>
      <p className="text-sm text-stone-400">Tap a monster to begin the encounter.</p>
      <div className="flex-1 min-h-0 flex flex-col gap-3">
        {board.slots.map((slot, i) => (
          <BoardSlotCard
            key={i}
            slot={slot}
            monsterName={getMonsterName(slot.monsterId)}
            onStartEncounter={() => handleSlotTap(i as 0 | 1 | 2)}
          />
        ))}
      </div>
    </div>
  );
}
