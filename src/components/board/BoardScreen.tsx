import { useBoardStore } from '../../store/boardStore';
import { useEncounterStore } from '../../store/encounterStore';
import { MONSTERS } from '../../data/monsters';
import { BoardSlotCard } from './BoardSlotCard';

export function BoardScreen() {
  const board = useBoardStore((s) => s.board);
  const setActiveSlot = useBoardStore((s) => s.setActiveSlot);
  const startEncounter = useEncounterStore((s) => s.startEncounter);

  if (!board) return null;

  const getMonsterName = (id: string) =>
    MONSTERS.find((m) => m.id === id)?.name ?? id;

  const handleSlotTap = (index: 0 | 1 | 2) => {
    const slot = board.slots[index];
    setActiveSlot(index);
    startEncounter(slot.monsterId);
  };

  return (
    <div className="min-h-screen flex flex-col p-6 space-y-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold text-amber-500">Board</h1>
      <p className="text-sm text-gray-400">Tap a monster to begin the encounter.</p>
      <div className="space-y-3">
        {board.slots.map((slot, i) => (
          <BoardSlotCard
            key={slot.locationType}
            slot={slot}
            monsterName={getMonsterName(slot.monsterId)}
            onStartEncounter={() => handleSlotTap(i as 0 | 1 | 2)}
          />
        ))}
      </div>
    </div>
  );
}
