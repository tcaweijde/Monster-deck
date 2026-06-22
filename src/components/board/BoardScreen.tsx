import { useState } from 'react';
import { useBoardStore } from '../../store/boardStore';
import { useEncounterStore } from '../../store/encounterStore';
import { useTrailStore } from '../../store/trailStore';
import { MONSTERS } from '../../data/monsters';
import { getMonsterById } from '../../data/monsters';
import { BoardSlotCard } from './BoardSlotCard';
import { TrailTokenBoard } from '../trail/TrailTokenBoard';
import { TrailPreFightModal } from '../trail/TrailPreFightModal';
import type { PlacedWeaknessToken, TrailCard } from '../../types';
import type { TrailDeckOptions } from '../../engine/deck';
import { makeDefaultTrailCards } from '../../engine/trail';

export function BoardScreen() {
  const board = useBoardStore((s) => s.board);
  const setActiveSlot = useBoardStore((s) => s.setActiveSlot);
  const endGame = useBoardStore((s) => s.endGame);
  const startEncounter = useEncounterStore((s) => s.startEncounter);

  const trailModeEnabled = useTrailStore((s) => s.trailModeEnabled);
  const weaknessTokensHeld = useTrailStore((s) => s.weaknessTokensHeld);
  const setPendingEffect = useTrailStore((s) => s.setPendingEffect);
  const clearPendingEffect = useTrailStore((s) => s.clearPendingEffect);

  const [pendingSlotIndex, setPendingSlotIndex] = useState<0 | 1 | 2 | null>(null);

  if (!board) return null;

  const getMonsterName = (id: string) =>
    MONSTERS.find((m) => m.id === id)?.name ?? id;

  const handleSlotTap = (index: 0 | 1 | 2) => {
    if (trailModeEnabled) {
      setPendingSlotIndex(index);
    } else {
      setActiveSlot(index);
      startEncounter(board.slots[index].monsterId);
    }
  };

  const handlePreFightConfirm = (token: PlacedWeaknessToken | null) => {
    if (pendingSlotIndex === null) return;
    const slot = board.slots[pendingSlotIndex];
    const monster = getMonsterById(slot.monsterId);

    if (token) setPendingEffect(token);

    // Always use trail cards in trail mode — authored data if available, otherwise defaults.
    const trailCards: [TrailCard, TrailCard, TrailCard, TrailCard] | null = trailModeEnabled && monster
      ? (monster.trailCards ?? makeDefaultTrailCards())
      : null;

    const trailDeckOpts: TrailDeckOptions | undefined = trailCards
      ? { trailCards }
      : undefined;

    setActiveSlot(pendingSlotIndex);
    startEncounter(
      slot.monsterId,
      false,
      0,
      trailDeckOpts,
      trailCards,
    );
    clearPendingEffect();
    setPendingSlotIndex(null);
  };

  return (
    <div className="h-dvh flex flex-col p-6 gap-4 max-w-lg mx-auto overflow-y-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-amber-500">Board</h1>
        <button
          onClick={endGame}
          className="text-sm text-stone-400 hover:text-red-400 transition-colors"
        >
          End Game
        </button>
      </div>
      <p className="text-sm text-stone-400">Tap a monster to begin the encounter.</p>
      <div className="flex flex-col gap-3">
        {board.slots.map((slot, i) => (
          <BoardSlotCard
            key={i}
            slot={slot}
            monsterName={getMonsterName(slot.monsterId)}
            onStartEncounter={() => handleSlotTap(i as 0 | 1 | 2)}
          />
        ))}
      </div>

      {trailModeEnabled && <TrailTokenBoard />}

      {pendingSlotIndex !== null && (
        <TrailPreFightModal
          heldTokens={weaknessTokensHeld}
          onConfirm={handlePreFightConfirm}
          onCancel={() => setPendingSlotIndex(null)}
        />
      )}
    </div>
  );
}
